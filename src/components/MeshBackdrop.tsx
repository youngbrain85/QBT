"use client";

import { useEffect, useMemo, useRef } from "react";
import styles from "./MeshBackdrop.module.css";

type Well = { cx: number; cy: number; r: number; k: number };

/** One warped wire grid, fixed behind the whole page so it stays continuous while scrolling. */
function multiWellPath(wells: Well[], step = 56): string {
  const W = 1440;
  const H = 900;
  const warp = (x: number, y: number): [number, number] => {
    let ox = 0;
    let oy = 0;
    for (const w of wells) {
      const dx = w.cx - x;
      const dy = w.cy - y;
      const s = w.k * Math.exp(-(dx * dx + dy * dy) / (2 * w.r * w.r));
      ox += dx * s;
      oy += dy * s;
    }
    return [x + ox, y + oy];
  };
  let d = "";
  for (let x = -160; x <= W + 160; x += step) {
    let first = true;
    for (let y = -80; y <= H + 80; y += 16) {
      const p = warp(x, y);
      d += (first ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      first = false;
    }
  }
  for (let y = -80; y <= H + 80; y += step) {
    let first = true;
    for (let x = -160; x <= W + 160; x += 16) {
      const p = warp(x, y);
      d += (first ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      first = false;
    }
  }
  return d;
}

const WELLS: Well[] = [
  { cx: 1010, cy: 430, r: 260, k: 0.62 },
  { cx: 260, cy: 760, r: 220, k: 0.35 },
  { cx: 1320, cy: 120, r: 180, k: 0.25 },
];

export default function MeshBackdrop() {
  const ref = useRef<SVGSVGElement | null>(null);
  const d = useMemo(() => multiWellPath(WELLS), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      // strongest over the hero, settling to a quieter level further down
      const t = Math.min(1, y / (vh * 1.2));
      const opacity = 0.55 - 0.28 * t;
      el.style.opacity = opacity.toFixed(3);
      if (!reduce) {
        const shift = -(y * 0.06) % 900;
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${(1 + t * 0.04).toFixed(3)})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg ref={ref} className={styles.svg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d={d} fill="none" stroke="var(--wire)" strokeWidth="0.9" />
      </svg>
    </div>
  );
}
