/**
 * A plain grid pulled toward one point: the warped wire motif carried over
 * from the previous QBT Texas site. Rendered as a single SVG path, computed
 * deterministically so server and client markup match.
 */
export type WarpedMeshProps = {
  /** Well centre, in a 1440 × 760 viewBox. */
  cx?: number;
  cy?: number;
  /** Well radius (px of the viewBox). */
  radius?: number;
  /** Pull strength, 0–1. */
  strength?: number;
  /** Grid spacing. */
  step?: number;
  /** Where the mask is brightest, as a CSS position. */
  origin?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  className?: string;
};

export function meshPath({
  cx = 1010,
  cy = 400,
  radius = 250,
  strength = 0.66,
  step = 56,
}: Pick<WarpedMeshProps, "cx" | "cy" | "radius" | "strength" | "step">): string {
  const W = 1440;
  const H = 760;
  const warp = (x: number, y: number): [number, number] => {
    const dx = cx - x;
    const dy = cy - y;
    const s = strength * Math.exp(-(dx * dx + dy * dy) / (2 * radius * radius));
    return [x + dx * s, y + dy * s];
  };
  let d = "";
  for (let x = -120; x <= W + 120; x += step) {
    let first = true;
    for (let y = -60; y <= H + 60; y += 16) {
      const p = warp(x, y);
      d += (first ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      first = false;
    }
  }
  for (let y = -60; y <= H + 60; y += step) {
    let first = true;
    for (let x = -120; x <= W + 120; x += 16) {
      const p = warp(x, y);
      d += (first ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      first = false;
    }
  }
  return d;
}

export default function WarpedMesh({
  cx,
  cy,
  radius,
  strength,
  step,
  origin = "66% 46%",
  strokeOpacity = 0.22,
  strokeWidth = 0.8,
  className = "",
}: WarpedMeshProps) {
  const d = meshPath({ cx, cy, radius, strength, step });
  const mask = `radial-gradient(ellipse at ${origin}, #000 20%, transparent 75%)`;
  return (
    <svg
      className={`mesh ${className}`}
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke="var(--wire)" strokeWidth={strokeWidth} strokeOpacity={strokeOpacity} />
    </svg>
  );
}
