import styles from "./Hero.module.css";

type Well = { cx: number; cy: number; r: number; k: number };
const WELLS: Well[] = [
  { cx: 1010, cy: 430, r: 260, k: 0.62 },
  { cx: 260, cy: 760, r: 220, k: 0.35 },
  { cx: 1320, cy: 120, r: 180, k: 0.25 },
];

/** The warped wire grid from the previous QBT Texas site, hero only. */
function meshPath(wells: Well[], step = 56): string {
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

export default function HeroMesh() {
  const d = meshPath(WELLS);
  const mask = "radial-gradient(ellipse at 66% 46%, #000 30%, transparent 80%)";
  return (
    <svg className={styles.heroMesh} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", left: 0, top: "-5%", width: "100%", height: "120%", pointerEvents: "none", WebkitMaskImage: mask, maskImage: mask }} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--wire)" strokeWidth="0.9" strokeOpacity="0.55" />
    </svg>
  );
}
