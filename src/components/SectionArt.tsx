/**
 * Decorative backdrops, one per section, all deterministic so SSR and CSR match.
 * Hero keeps the warped wire mesh; every other section gets a different
 * engineering motif (drafting grid, ruler ticks, spotlight, point field,
 * contours, concentric arcs).
 */

function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const svgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" };

/** Topographic contour lines (industries). */
export function Contours({ seed = 0.6, opacity = 0.14 }: { seed?: number; opacity?: number }) {
  let d = "";
  for (let k = 0; k < 11; k++) {
    const base = 40 + k * 68;
    let first = true;
    for (let x = -20; x <= 1460; x += 12) {
      const y = base + 26 * Math.sin(x / 190 + k * 0.9 + seed) + 14 * Math.sin(x / 61 + k * 1.7 + seed * 2) + 9 * Math.sin(x / 23 + k * 0.4);
      d += (first ? "M" : "L") + x + " " + y.toFixed(1);
      first = false;
    }
  }
  return (
    <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="0.8" strokeOpacity={opacity} />
    </svg>
  );
}

/** Scattered points in the shape of a cable-stayed elevation (capabilities). */
export function PointField({ opacity = 0.22 }: { opacity?: number }) {
  const rnd = prng(99);
  let d = "";
  for (let i = 0; i < 1400; i++) {
    const x = 80 + rnd() * 1280;
    const deck = 330 + (x - 720) * 0.04;
    const r = rnd();
    let y: number;
    if (r < 0.55) y = deck + (rnd() - 0.5) * 26;
    else if (r < 0.75) {
      const onPylon = Math.abs(x - 430) < 18 || Math.abs(x - 1010) < 18;
      if (!onPylon) continue;
      y = deck - rnd() * 200;
    } else if (r < 0.9) {
      const t = rnd();
      const cx = x < 720 ? 430 : 1010;
      y = deck - 200 + t * 200 + (rnd() - 0.5) * 4;
      if (Math.abs(x - cx) > 230 * (1 - t) + 10 || Math.abs(x - cx) < 10) continue;
    } else y = deck + 20 + rnd() * 260;
    d += "M" + x.toFixed(0) + " " + y.toFixed(0) + "h0.01";
  }
  return (
    <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeOpacity={opacity} />
    </svg>
  );
}

/** Concentric arcs with a hatched overlap, rising from the bottom edge (proof). */
export function Arcs() {
  let hatch = "";
  for (let x = 300; x <= 1200; x += 14) hatch += `M${x} 760L${x + 120} 640`;
  return (
    <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMax slice" style={svgStyle} aria-hidden="true">
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.16" strokeWidth="1">
        {[420, 520, 620].map((r) => (
          <circle key={`a${r}`} cx="520" cy="900" r={r} />
        ))}
        {[420, 520, 620].map((r) => (
          <circle key={`b${r}`} cx="980" cy="900" r={r} />
        ))}
      </g>
      <path d={hatch} fill="none" stroke="var(--ink)" strokeOpacity="0.12" strokeWidth="1" />
    </svg>
  );
}
