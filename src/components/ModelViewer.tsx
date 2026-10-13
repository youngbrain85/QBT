"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { BridgeModel } from "@/data/models";
import styles from "./ModelViewer.module.css";

export type ViewMode = "shaded" | "wireframe" | "points";
export type ViewPreset = "iso" | "front" | "side" | "top";

export type SelectedElement = {
  name: string;
  size: [number, number, number];
  triangles: number;
};

type Props = {
  model: BridgeModel;
  mode: ViewMode;
  section: number; // 0..1, fraction of the model kept along its long axis
  preset: ViewPreset;
  presetNonce: number;
  onSelect: (e: SelectedElement | null) => void;
  onStats: (s: { meshes: number; triangles: number; size: [number, number, number] }) => void;
};

const INK = 0xf2efe9;

export default function ModelViewer({ model, mode, section, preset, presetNonce, onSelect, onStats }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    renderer: THREE.WebGLRenderer;
    root: THREE.Group;
    meshes: THREE.Mesh[];
    edges: THREE.LineSegments[];
    points: THREE.Points[];
    clip: THREE.Plane;
    radius: number;
    long: "x" | "z";
    longHalf: number;
    highlight: THREE.LineSegments | null;
  } | null>(null);

  // Build the renderer once.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 10000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    scene.add(new THREE.HemisphereLight(0xe8eefc, 0x2a3150, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(1, 2, 1.2);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x9fb4ff, 0.6);
    fill.position.set(-1.5, 0.6, -1);
    scene.add(fill);
    const root = new THREE.Group();
    scene.add(root);
    const clip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1e9);

    const state = {
      scene,
      camera,
      controls,
      renderer,
      root,
      meshes: [] as THREE.Mesh[],
      edges: [] as THREE.LineSegments[],
      points: [] as THREE.Points[],
      clip,
      radius: 1,
      long: "z" as "x" | "z",
      longHalf: 1,
      highlight: null as THREE.LineSegments | null,
    };
    sceneRef.current = state;

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

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    // Picking.
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let downAt = [0, 0];
    const onDown = (e: PointerEvent) => {
      downAt = [e.clientX, e.clientY];
    };
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 4) return;
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(state.meshes.filter((m) => m.visible), false);
      if (state.highlight) {
        state.scene.remove(state.highlight);
        state.highlight.geometry.dispose();
        state.highlight = null;
      }
      const hit = hits[0];
      if (!hit) {
        onSelect(null);
        return;
      }
      const mesh = hit.object as THREE.Mesh;
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const geom = mesh.geometry as THREE.BufferGeometry;
      const tri = (geom.getIndex() ? geom.getIndex()!.count : geom.getAttribute("position").count) / 3;
      const hl = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom, 20),
        new THREE.LineBasicMaterial({ color: 0x6fcdeb, transparent: true, opacity: 1, depthTest: false }),
      );
      hl.applyMatrix4(mesh.matrixWorld);
      hl.renderOrder = 10;
      state.scene.add(hl);
      state.highlight = hl;
      onSelect({
        name: mesh.name || mesh.parent?.name || "Element",
        size: [size.x, size.y, size.z],
        triangles: Math.round(tri),
      });
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the selected model.
  useEffect(() => {
    const st = sceneRef.current;
    if (!st) return;
    let cancelled = false;
    setStatus("loading");
    onSelect(null);
    // clear
    st.root.clear();
    st.edges.forEach((e) => {
      st.scene.remove(e);
      e.geometry.dispose();
    });
    st.points.forEach((p) => {
      st.scene.remove(p);
      p.geometry.dispose();
    });
    if (st.highlight) {
      st.scene.remove(st.highlight);
      st.highlight = null;
    }
    st.meshes = [];
    st.edges = [];
    st.points = [];

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    (async () => {
      const meshes: THREE.Mesh[] = [];
      for (const f of model.files) {
        const g = await loader.loadAsync(`/models/${f}`);
        if (cancelled) return;
        g.scene.traverse((n) => {
          if ((n as THREE.Mesh).isMesh) meshes.push(n as THREE.Mesh);
        });
        st.root.add(g.scene);
      }
      st.root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(st.root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      st.root.position.sub(center);
      st.root.updateMatrixWorld(true);
      st.radius = size.length() / 2;
      st.long = size.x >= size.z ? "x" : "z";
      st.longHalf = Math.max(size.x, size.z) / 2;
      st.clip.normal.set(st.long === "x" ? -1 : 0, 0, st.long === "z" ? -1 : 0);

      let triangles = 0;
      const edgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.8, clippingPlanes: [st.clip] });
      const pointMat = new THREE.PointsMaterial({ color: INK, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.85, clippingPlanes: [st.clip] });
      meshes.forEach((m) => {
        const geom = m.geometry as THREE.BufferGeometry;
        triangles += (geom.getIndex() ? geom.getIndex()!.count : geom.getAttribute("position").count) / 3;
        // Some exports carry no normals; without them a lit material renders black.
        if (!geom.getAttribute("normal")) geom.computeVertexNormals();
        m.material = new THREE.MeshStandardMaterial({
          color: 0xc9cfe0,
          metalness: 0.05,
          roughness: 0.75,
          flatShading: true,
          side: THREE.DoubleSide,
          clippingPlanes: [st.clip],
        });
        const e = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 24), edgeMat);
        e.applyMatrix4(m.matrixWorld);
        st.scene.add(e);
        st.edges.push(e);
        const p = new THREE.Points(geom, pointMat);
        p.applyMatrix4(m.matrixWorld);
        st.scene.add(p);
        st.points.push(p);
      });
      st.meshes = meshes;
      onStats({ meshes: meshes.length, triangles: Math.round(triangles), size: [size.x, size.y, size.z] });

      // grid
      const old = st.scene.getObjectByName("grid");
      if (old) st.scene.remove(old);
      const grid = new THREE.GridHelper(st.radius * 3, 40, 0x2e3657, 0x1f2540);
      grid.name = "grid";
      grid.position.y = box.min.y - center.y - st.radius * 0.01;
      st.scene.add(grid);

      st.camera.near = st.radius / 100;
      st.camera.far = st.radius * 50;
      st.camera.updateProjectionMatrix();
      applyPreset(st, "iso");
      setStatus("ready");
    })().catch((e) => {
      console.error(e);
      if (!cancelled) setStatus("error");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.slug]);

  // Display mode.
  useEffect(() => {
    const st = sceneRef.current;
    if (!st) return;
    st.meshes.forEach((m) => {
      m.visible = mode === "shaded";
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.transparent = false;
      mat.opacity = 1;
    });
    st.edges.forEach((e) => (e.visible = mode !== "points"));
    st.points.forEach((p) => (p.visible = mode === "points"));
  }, [mode, status]);

  // Section clipping.
  useEffect(() => {
    const st = sceneRef.current;
    if (!st) return;
    // keep [ -longHalf, -longHalf + section * 2 * longHalf ]
    const cut = -st.longHalf + section * 2 * st.longHalf + (section >= 1 ? st.radius : 0);
    st.clip.constant = cut;
  }, [section, status]);

  // Camera presets.
  useEffect(() => {
    const st = sceneRef.current;
    if (!st || status !== "ready") return;
    applyPreset(st, preset);
  }, [preset, presetNonce, status]);

  return (
    <div ref={hostRef} className={styles.host}>
      {status === "loading" ? <span className={`mono ${styles.status}`}>Loading model…</span> : null}
      {status === "error" ? <span className={`mono ${styles.status}`}>Could not load this model.</span> : null}
    </div>
  );
}

function applyPreset(st: { camera: THREE.PerspectiveCamera; controls: OrbitControls; radius: number; long: "x" | "z" }, preset: ViewPreset) {
  const { camera, controls, radius, long } = st;
  const dist = (radius / Math.sin((camera.fov * Math.PI) / 360)) * 0.85;
  const alongX = long === "x";
  switch (preset) {
    case "front":
      // look along the long axis
      camera.position.set(alongX ? dist : 0, radius * 0.15, alongX ? 0 : dist);
      break;
    case "side":
      camera.position.set(alongX ? 0 : dist, radius * 0.12, alongX ? dist : 0);
      break;
    case "top":
      camera.position.set(0.001, dist, 0);
      break;
    default:
      camera.position.set(dist * 0.72, dist * 0.42, dist * 0.62);
  }
  controls.target.set(0, 0, 0);
  controls.update();
}
