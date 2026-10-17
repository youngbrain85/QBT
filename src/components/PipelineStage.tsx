"use client";

import { useEffect, useRef, useState } from "react";
import { BEATS, H, LOOP, W, beatAt, drawScene, type Method } from "./pipelineScene";
import s from "./Sections.module.css";

type Step = [string, string, string];
export type MethodSteps = { method: Method; label: string; title: string; steps: Step[] };

/**
 * The How-it-works stage: the pipeline showreel drawn behind the section, and the five step cards,
 * which light up as the loop reaches their beat. Pauses off-screen; a still frame under
 * prefers-reduced-motion.
 */
export default function PipelineStage({ methods }: { methods: MethodSteps[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const [beat, setBeat] = useState(-1);
  const [methodIx, setMethodIx] = useState(0);
  const seekRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const band = bandRef.current;
    if (!cv || !band) return;
    const g = cv.getContext("2d");
    if (!g) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let lastBeat = -2;
    let lastMethod = -1;
    let start = performance.now() - 3000; // open on 1.0, not the empty intro
    const TOTAL = LOOP * 2; // method A then method B, 30 s each
    seekRef.current = (t: number) => { start = performance.now() - t * 1000; };

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
    };
    const draw = (tt: number) => {
      const mi = Math.floor(tt / LOOP) % 2, t = tt % LOOP;
      if (mi !== lastMethod) { lastMethod = mi; setMethodIx(mi); }
      // The scene's bridge band (logical rows 0.22H to 0.84H) is fitted to the spacer between the
      // heading and the step cards, so the bridge plays in open space and only its edges run on
      // behind the cards.
      const r = cv.getBoundingClientRect();
      const br = band.getBoundingClientRect();
      const dpr = cv.width / Math.max(1, r.width);
      const k = br.height / (H * 0.62);
      const tx = br.left - r.left + br.width / 2 - (W / 2) * k;
      const ty = br.top - r.top + br.height / 2 - H * 0.53 * k;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, cv.width, cv.height);
      g.setTransform(k * dpr, 0, 0, k * dpr, tx * dpr, ty * dpr);
      drawScene(g, t, 0.8, mi === 0 ? "scan" : "drawing");
      const bt = beatAt(t);
      if (bt !== lastBeat) { lastBeat = bt; setBeat(bt); }
    };
    const tick = () => {
      if (!visible) return;
      frame = requestAnimationFrame(tick);
      draw(((performance.now() - start) / 1000) % TOTAL);
    };
    size();
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(26); });
    ro.observe(cv);
    if (reduce) { draw(26); return () => ro.disconnect(); }
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(tick);
    }, { threshold: 0.05 });
    io.observe(cv);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); };
  }, []);

  const m = methods[methodIx];
  const beats = BEATS[m.method];
  return (
    <>
      <canvas ref={canvasRef} className={s.pipelineCanvas} aria-hidden="true" />
      <div className={s.methodTabs} role="tablist" aria-label="Methodology">
        {methods.map((mm, i) => (
          <button key={mm.method} type="button" role="tab" aria-selected={i === methodIx} data-active={i === methodIx ? "1" : "0"} className={`mono ${s.methodTab}`} onClick={() => { seekRef.current?.(i * LOOP + 3); setMethodIx(i); }}>
            <span>{mm.label}</span>
            <strong>{mm.title}</strong>
          </button>
        ))}
      </div>
      <div ref={bandRef} className={s.pipelineBand} aria-hidden="true" />
      <ol className={s.steps}>
        {m.steps.map(([title, body, tag], i) => (
          <li key={m.method + title} className={s.step} data-active={beat === i ? "1" : "0"}>
            <span className="mono">
              {beats[i].n} {beats[i].word}
            </span>
            <h3>{title}</h3>
            <p>{body}</p>
            <span className="mono">{tag}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
