"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "./Hero.module.css";

const FILES = ["PY1.glb", "PY2.glb", "DECK.glb", "CABLES.glb", "BEARINGS.glb", "FURNITURE.glb"];
const LOOP_SECONDS = 20;
const TOTAL_POINTS = 240_000;

/** LiDAR-style elevation ramp: green → yellow → orange → red. */
function rampColor(t: number, out: THREE.Color) {
  const stops: [number, number, number][] = [
    [0.22, 0.83, 0.33],
    [0.72, 0.9, 0.3],
    [0.98, 0.84, 0.28],
    [1.0, 0.55, 0.12],
    [1.0, 0.2, 0.18],
  ];
  const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = stops[i];
  const b = stops[i + 1];
  out.setRGB(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
}

const pointVertex = /* glsl */ `
  attribute float aSeed;
  attribute float aNx;
  uniform float uReveal;
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    float edge = smoothstep(uReveal, uReveal - 0.08, aNx);
    vAlpha = edge * (0.75 + 0.25 * aSeed);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float flicker = 0.85 + 0.15 * sin(aSeed * 40.0);
    gl_PointSize = uSize * uPixelRatio * flicker * (160.0 / -mv.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 4.5 * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

const pointFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = dot(c, c);
    if (r > 0.25) discard;
    float a = uOpacity * vAlpha * smoothstep(0.25, 0.12, r);
    gl_FragColor = vec4(vColor, a);
  }
`;

export type HeroPhase = 0 | 1 | 2 | 3;

export default function HeroScene({ onPhase }: { onPhase?: (p: HeroPhase) => void }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 5000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.55;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.46;

    const group = new THREE.Group();
    scene.add(group);
    // Lights for the shaded BIM stage; the cloud and edges are unlit.
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x1a1e33, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(1, 2, 1.2);
    scene.add(key);
    const fillLight = new THREE.DirectionalLight(0x9fb5ff, 0.5);
    fillLight.position.set(-1.5, 0.6, -1);
    scene.add(fillLight);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    let frame = 0;
    let disposed = false;
    const start = performance.now();
    let lastPhase: HeroPhase = 0;

    const pointsUniforms = {
      uReveal: { value: -1.2 },
      uSize: { value: 2.2 },
      uOpacity: { value: 1 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    };
    const lineMat = new THREE.LineBasicMaterial({ color: 0xf2efe9, transparent: true, opacity: 0 });
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x6fcdeb,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    // Shaded faces that fill in once the BIM elements are built, so the bridge reads as a solid
    // light object against the navy backdrop instead of a cloud the same colour as the page.
    const fillMat = new THREE.MeshStandardMaterial({
      color: 0xd6dbe8,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true,
      transparent: true,
      opacity: 0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    let scanPlane: THREE.Mesh | null = null;
    let radius = 1;
    let xHalf = 1;

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    async function build() {
      const meshes: THREE.Mesh[] = [];
      for (const f of FILES) {
        const gltf = await loader.loadAsync(`/models/cable-stayed/${f}`);
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((n) => {
          if ((n as THREE.Mesh).isMesh) meshes.push(n as THREE.Mesh);
        });
        group.add(gltf.scene);
      }
      if (disposed) return;

      // Fit: centre the bridge, remember its extent along the deck (the model's z axis).
      const box = new THREE.Box3().setFromObject(group);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      group.position.sub(center);
      group.updateMatrixWorld(true);
      radius = size.length() / 2;
      const yMin = box.min.y - center.y;
      const yMax = box.max.y - center.y;
      xHalf = Math.max(size.x, size.z) / 2;

      // Dense surface point cloud, coloured by elevation like a LiDAR scan.
      const areas = meshes.map((m) => {
        const g = m.geometry as THREE.BufferGeometry;
        const pos = g.getAttribute("position");
        if (!pos) return 0;
        const idx = g.getIndex();
        const tri = new THREE.Triangle();
        const a = new THREE.Vector3();
        const b = new THREE.Vector3();
        const c = new THREE.Vector3();
        let area = 0;
        const count = idx ? idx.count : pos.count;
        for (let i = 0; i < count; i += 3) {
          const ia = idx ? idx.getX(i) : i;
          const ib = idx ? idx.getX(i + 1) : i + 1;
          const ic = idx ? idx.getX(i + 2) : i + 2;
          a.fromBufferAttribute(pos, ia);
          b.fromBufferAttribute(pos, ib);
          c.fromBufferAttribute(pos, ic);
          tri.set(a, b, c);
          area += tri.getArea();
        }
        return area;
      });
      const totalArea = areas.reduce((s, v) => s + v, 0) || 1;
      const positions = new Float32Array(TOTAL_POINTS * 3);
      const colors = new Float32Array(TOTAL_POINTS * 3);
      const seeds = new Float32Array(TOTAL_POINTS);
      const nx = new Float32Array(TOTAL_POINTS);
      const p = new THREE.Vector3();
      const col = new THREE.Color();
      let written = 0;
      meshes.forEach((m, mi) => {
        if (areas[mi] <= 0) return;
        // Give thin elements (cables, railings) a floor so they still read as lines of points.
        const share = Math.max(areas[mi] / totalArea, 0.004);
        const n = Math.min(TOTAL_POINTS - written, Math.floor(TOTAL_POINTS * share));
        if (n <= 0) return;
        const sampler = new MeshSurfaceSampler(m).build();
        for (let i = 0; i < n; i++) {
          sampler.sample(p);
          p.applyMatrix4(m.matrixWorld);
          const o = written * 3;
          positions[o] = p.x;
          positions[o + 1] = p.y;
          positions[o + 2] = p.z;
          const t = (p.y - yMin) / Math.max(1e-6, yMax - yMin);
          rampColor(Math.pow(t, 0.8), col);
          colors[o] = col.r;
          colors[o + 1] = col.g;
          colors[o + 2] = col.b;
          seeds[written] = Math.random();
          // reveal runs along the longest horizontal axis
          nx[written] = (size.z >= size.x ? p.z : p.x) / xHalf;
          written++;
        }
      });
      const pg = new THREE.BufferGeometry();
      pg.setAttribute("position", new THREE.BufferAttribute(positions.subarray(0, written * 3), 3));
      pg.setAttribute("color", new THREE.BufferAttribute(colors.subarray(0, written * 3), 3));
      pg.setAttribute("aSeed", new THREE.BufferAttribute(seeds.subarray(0, written), 1));
      pg.setAttribute("aNx", new THREE.BufferAttribute(nx.subarray(0, written), 1));
      const pm = new THREE.ShaderMaterial({
        uniforms: pointsUniforms,
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(pg, pm);
      points.frustumCulled = false;
      scene.add(points);

      // BIM edges that build up after the scan.
      const edgeGroup = new THREE.Group();
      meshes.forEach((m) => {
        const eg = new THREE.EdgesGeometry(m.geometry as THREE.BufferGeometry, 28);
        const ls = new THREE.LineSegments(eg, lineMat);
        ls.applyMatrix4(m.matrixWorld);
        edgeGroup.add(ls);
      });
      scene.add(edgeGroup);
      // The source meshes become the shaded stage; hidden until the BIM phase.
      meshes.forEach((m) => {
        const g = m.geometry as THREE.BufferGeometry;
        if (!g.getAttribute("normal")) g.computeVertexNormals();
        m.material = fillMat;
      });
      group.visible = false;

      // Scan plane sweeping along the deck.
      const along = size.z >= size.x ? "z" : "x";
      const planeW = along === "z" ? size.x * 1.6 : size.z * 1.6;
      scanPlane = new THREE.Mesh(new THREE.PlaneGeometry(planeW, size.y * 1.4), scanMat);
      if (along === "z") scanPlane.rotation.y = 0;
      else scanPlane.rotation.y = Math.PI / 2;
      scene.add(scanPlane);
      const scanEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(scanPlane.geometry),
        new THREE.LineBasicMaterial({ color: 0x6fcdeb, transparent: true, opacity: 0.9 }),
      );
      scanPlane.add(scanEdge);

      // Ground grid.
      const grid = new THREE.GridHelper(radius * 3, 36, 0x2e3657, 0x1f2540);
      grid.position.y = yMin - radius * 0.01;
      const gm = grid.material as THREE.Material;
      gm.transparent = true;
      gm.opacity = 0.55;
      scene.add(grid);

      // Camera: three-quarter view, slightly above deck level.
      const dist = (radius / Math.sin((camera.fov * Math.PI) / 360)) * 0.58;
      camera.position.set(dist * 0.78, dist * 0.3, dist * 0.55);
      camera.near = dist / 100;
      camera.far = dist * 20;
      camera.updateProjectionMatrix();
      controls.target.set(0, size.y * 0.1, 0);

      setReady(true);

      const tick = () => {
        if (disposed) return;
        frame = requestAnimationFrame(tick);
        const t = reduceMotion ? 0.7 : (((performance.now() - start) / 1000) % LOOP_SECONDS) / LOOP_SECONDS;

        // 0–0.36 scan reveal · 0.36–0.5 edges build · 0.5–0.62 shaded faces fill in · 0.62–0.92 pins · 0.92–1 fade
        let reveal: number;
        let edgeOp: number;
        let cloudOp: number;
        let scanOp: number;
        let fillOp: number;
        if (t < 0.36) {
          reveal = -1.15 + (t / 0.36) * 2.4;
          edgeOp = 0;
          cloudOp = 1;
          fillOp = 0;
          scanOp = t < 0.02 ? t / 0.02 : t > 0.34 ? (0.36 - t) / 0.02 : 1;
        } else if (t < 0.5) {
          const k = (t - 0.36) / 0.14;
          reveal = 1.3;
          edgeOp = k * 0.85;
          cloudOp = 1 - k * 0.35;
          fillOp = 0;
          scanOp = 0;
        } else if (t < 0.62) {
          const k = (t - 0.5) / 0.12;
          reveal = 1.3;
          edgeOp = 0.85 - k * 0.3;
          cloudOp = 0.65 - k * 0.45;
          fillOp = k;
          scanOp = 0;
        } else if (t < 0.92) {
          reveal = 1.3;
          edgeOp = 0.55;
          cloudOp = 0.2;
          fillOp = 1;
          scanOp = 0;
        } else {
          const k = (t - 0.92) / 0.08;
          reveal = 1.3;
          edgeOp = 0.55 * (1 - k);
          cloudOp = 0.2 * (1 - k);
          fillOp = 1 - k;
          scanOp = 0;
        }
        pointsUniforms.uReveal.value = reveal;
        pointsUniforms.uOpacity.value = cloudOp;
        lineMat.opacity = edgeOp;
        fillMat.opacity = fillOp;
        fillMat.transparent = fillOp < 0.999;
        group.visible = fillOp > 0.01;
        scanMat.opacity = scanOp * 0.16;
        (scanEdge.material as THREE.LineBasicMaterial).opacity = scanOp * 0.9;
        if (scanPlane) {
          const pos = reveal * xHalf;
          if (along === "z") scanPlane.position.z = pos;
          else scanPlane.position.x = pos;
        }

        const phase: HeroPhase = t < 0.36 ? 0 : t < 0.56 ? 1 : t < 0.92 ? 2 : 3;
        if (phase !== lastPhase) {
          lastPhase = phase;
          onPhase?.(phase);
        }

        controls.update();
        renderer.render(scene, camera);
      };
      tick();
    }

    build().catch((e) => {
      console.error(e);
      setFailed(true);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={hostRef} className={styles.canvasHost} data-ready={ready ? "1" : "0"} data-failed={failed ? "1" : "0"}>
      {!ready && !failed ? <span className={`mono ${styles.loading}`}>Loading point cloud…</span> : null}
    </div>
  );
}
