// The pipeline showreel, drawn in Canvas 2D: one generic cable-stayed bridge that is collected as a
// point cloud, modelled as BIM edges, reviewed segment by segment, measured, and delivered as an
// inspection twin. 30 s loop, no cuts, locked camera, the bridge turns. Palette = design tokens.

export const LOOP = 30;
export const W = 1920;
export const H = 1080;

const C = { ink: "#f2efe9", ink2: "#b8b3ab", muted: "#9a9690", dim: "#85817a", wire: "#6fcdeb", slate: "#d6dbe8", line3: "#2e3657", surface: "#10142a", gradeB: "#6fcdeb", gradeC: "#e0b341", gradeD: "#e05a4e" };
const RAMP: [number, number, number][] = [[0.22, 0.83, 0.33], [0.72, 0.9, 0.3], [0.98, 0.84, 0.28], [1.0, 0.55, 0.12], [1.0, 0.2, 0.18]];
function ramp(t: number) {
  const x = (Number.isFinite(t) ? Math.min(0.9999, Math.max(0, t)) : 0) * 4, i = Math.floor(x), f = x - i, a = RAMP[i], b = RAMP[i + 1];
  return `rgb(${((a[0] + (b[0] - a[0]) * f) * 255) | 0},${((a[1] + (b[1] - a[1]) * f) * 255) | 0},${((a[2] + (b[2] - a[2]) * f) * 255) | 0})`;
}
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);

type V3 = [number, number, number];
type Edge = { a: V3; b: V3; kind: string; seg: string; order: number };

// ---------- geometry (metres): x along the deck, y up (deck top = 0), z transverse ----------
const L = 449.36, PX = 120, DECK_W = 11.5, Y_TOP = 75, Y_LOW = -48;
const OUT: [number, number][] = [[6.8, -30], [12.9, 0], [9.6, 22], [4.3, 44], [1.4, 60], [0.6, 70], [0.05, 75]];
const INN: [number, number][] = [[3.5, -22], [9.6, 0], [6.3, 22], [1.0, 44], [0, 52]];
const edges: Edge[] = [];
function E(a: V3, b: V3, kind: string, seg: string, order: number) { edges.push({ a, b, kind, seg, order }); }
function zAt(prof: [number, number][], y: number) { for (let i = 0; i < prof.length - 1; i++) { const a = prof[i], b = prof[i + 1]; if (y >= a[1] && y <= b[1]) return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]); } return 0; }
function buildPylon(px: number, name: string) {
  for (const sx of [-2.75, 2.75]) for (const s of [-1, 1]) {
    for (let i = 0; i < OUT.length - 1; i++) E([px + sx, OUT[i][1], s * OUT[i][0]], [px + sx, OUT[i + 1][1], s * OUT[i + 1][0]], "pylon", name, OUT[i][1]);
    for (let i = 0; i < INN.length - 1; i++) E([px + sx, INN[i][1], s * INN[i][0]], [px + sx, INN[i + 1][1], s * INN[i + 1][0]], "void", name, INN[i][1]);
  }
  for (const sx of [-2.75, 2.75]) { E([px + sx, -30, -6.8], [px + sx, -30, 6.8], "pylon", name, -30); E([px + sx, -22, -3.5], [px + sx, -22, 3.5], "void", name, -22); E([px + sx, -2.5, -12.9], [px + sx, -2.5, 12.9], "pylon", name, -2.5); }
  for (const s of [-1, 1]) for (const p of OUT) E([px - 2.75, p[1], s * p[0]], [px + 2.75, p[1], s * p[0]], "depth", name, p[1]);
  for (let y = -28; y < 50; y += 4.8) { const zo = zAt(OUT, y), zi = Math.max(0, zAt(INN, y)); for (const s of [-1, 1]) { E([px - 2.75, y, s * zo], [px - 2.75, y, s * zi], "ring", name, y); E([px + 2.75, y, s * zo], [px + 2.75, y, s * zi], "ring", name, y); } }
  const cz = 14, cx = 10, y0 = -34, y1 = -30, Q: [number, number][] = [[px - cx, -cz], [px + cx, -cz], [px + cx, cz], [px - cx, cz]];
  for (let i = 0; i < 4; i++) { const a = Q[i], b = Q[(i + 1) % 4]; E([a[0], y0, a[1]], [b[0], y0, b[1]], "cap", name + " FND", -34); E([a[0], y1, a[1]], [b[0], y1, b[1]], "cap", name + " FND", -34); E([a[0], y0, a[1]], [a[0], y1, a[1]], "cap", name + " FND", -34); }
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) E([px + i * 7, y0, j * 9], [px + i * 7, Y_LOW, j * 9], "pile", name + " FND", -48);
  for (let i = 0; i < 9; i++) { const hy = 24 + i * 5.4; for (const dir of [-1, 1]) { const ax = px + dir * (28 + i * 9.6); for (const s of [-1, 1]) E([px, hy, s * 1.2], [ax, 0.5, s * DECK_W], "cable", "CABLES", 100 + i); } }
}
buildPylon(-PX, "PY1"); buildPylon(PX, "PY2");
const x0 = -L / 2, x1 = L / 2, SEG = 12.15;
for (let x = x0; x < x1 - 1; x += SEG) {
  const xa = x, xb = Math.min(x1, x + SEG), si = Math.round((x - x0) / SEG), ord = Math.abs(xa + SEG / 2);
  for (const s of [-1, 1]) { E([xa, 0.5, s * DECK_W], [xb, 0.5, s * DECK_W], "deck", "DECK " + si, ord); E([xa, -2.5, s * DECK_W], [xb, -2.5, s * DECK_W], "deck", "DECK " + si, ord); }
  for (const s of [-1, 1]) E([xa, 0.5, s * DECK_W], [xa, -2.5, s * DECK_W], "joint", "DECK " + si, ord);
  E([xa, 0.5, -DECK_W], [xa, 0.5, DECK_W], "joint", "DECK " + si, ord); E([xa, -2.5, -DECK_W], [xa, -2.5, DECK_W], "joint", "DECK " + si, ord);
}
for (const x of [x0 + 3, x1 - 3]) for (const s of [-1, 1]) { E([x, -2.5, s * 7], [x, -30, s * 7], "pier", "ABUT", 300); E([x - 2, -2.5, s * 7], [x + 2, -2.5, s * 7], "pier", "ABUT", 300); }

// surface samples for the point cloud, coloured by elevation
const pts: V3[] = [];
function pip(poly: [number, number][], z: number, y: number) { let inside = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const zi = poly[i][0], yi = poly[i][1], zj = poly[j][0], yj = poly[j][1]; if (yi > y !== yj > y && z < ((zj - zi) * (y - yi)) / (yj - yi) + zi) inside = !inside; } return inside; }
const outerPoly: [number, number][] = OUT.concat(OUT.slice(0, -1).reverse().map((p) => [-p[0], p[1]] as [number, number]));
const innerPoly: [number, number][] = INN.concat(INN.slice(0, -1).reverse().map((p) => [-p[0], p[1]] as [number, number]));
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (const px of [-PX, PX]) for (let i = 0; i < 2600; i++) { const z = (rnd() * 2 - 1) * 13, y = -30 + rnd() * 105; if (pip(outerPoly, z, y) && !pip(innerPoly, z, y)) pts.push([px + (rnd() < 0.5 ? -2.75 : 2.75), y, z]); }
for (const e of edges) { if (e.kind === "ring" || e.kind === "void") continue; const n = e.kind === "cable" ? 26 : e.kind === "deck" ? 10 : 6; for (let i = 0; i <= n; i++) { const s = (i + rnd() * 0.6) / n; pts.push([e.a[0] + (e.b[0] - e.a[0]) * s, e.a[1] + (e.b[1] - e.a[1]) * s, e.a[2] + (e.b[2] - e.a[2]) * s]); } }
for (let i = 0; i < 1800; i++) pts.push([x0 + rnd() * L, 0.5, (rnd() * 2 - 1) * DECK_W]);
const ptColor = pts.map((p) => ramp(Math.pow(clamp((p[1] - Y_LOW) / (Y_TOP - Y_LOW), 0, 1), 0.8)));

let EXT = 1; // transverse extrusion: 0 = flat elevation drawing, 1 = full 3D
function project(p: V3, yaw: number, pitch: number): V3 {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const pz = p[2] * EXT;
  const x = p[0] * cy - pz * sy, z = p[0] * sy + pz * cy, y = p[1];
  const y2 = y * cp - z * sp, z2 = y * sp + z * cp, k = 5200 / (1500 + z2);
  return [W * 0.5 + x * k, H * 0.53 - (y2 - 10) * k, z2];
}

export type Method = "scan" | "drawing";
export const BEATS: Record<Method, { n: string; word: string; s: number; e: number }[]> = {
  scan: [
    { n: "1.0", word: "Collect", s: 3, e: 8.5 },
    { n: "2.0", word: "Model", s: 8.5, e: 14 },
    { n: "3.0", word: "Review", s: 14, e: 19 },
    { n: "4.0", word: "Measure", s: 19, e: 23.5 },
    { n: "5.0", word: "Deliver", s: 23.5, e: 28.2 },
  ],
  drawing: [
    { n: "1.0", word: "Read", s: 3, e: 8.5 },
    { n: "2.0", word: "Model", s: 8.5, e: 14 },
    { n: "3.0", word: "Verify", s: 14, e: 19 },
    { n: "4.0", word: "Measure", s: 19, e: 23.5 },
    { n: "5.0", word: "Deliver", s: 23.5, e: 28.2 },
  ],
};
export function beatAt(t: number) { return BEATS.scan.findIndex((b) => t >= b.s && t < b.e); }

// photo checkpoints for the drawing method: where a site photograph is matched to the model
const PHOTOS = [
  { label: "Cable anchorage CA19 · match", at: [-PX + 40, 1, 11.5] as V3 },
  { label: "Pylon head · 2 revisions", at: [PX, 72, 0] as V3 },
  { label: "Bearing B2 · match", at: [PX, -2.5, 8] as V3 },
  { label: "Pile cap PY1 · match", at: [-PX - 10, -32, 14] as V3 },
];
const AGENT_LOG = ["parse DXF  12 layers · 4 sheets", "section table  C.J.12 … C.J.23", "loft PY1  32 parts · 0.8 m rings", "mirror PY2  along the deck axis", "place 37 deck segments", "place 72 cables · guide pipes", "write parameters.json"];

const DAMAGE = [
  { id: "CR-07", type: "Crack", col: C.gradeC, at: [-PX + 2.75, 30, 5.5] as V3 },
  { id: "SP-02", type: "Spalling", col: C.gradeD, at: [PX - 2.75, 12, -10.5] as V3 },
  { id: "LK-03", type: "Leakage", col: C.gradeC, at: [-PX - 2.75, -12, -7] as V3 },
  { id: "CR-11", type: "Map cracking", col: C.gradeB, at: [40, -2.5, 11.5] as V3 },
];

/** Draws one frame of the bridge layers (no backdrop, no headline) into a 1920×1080 logical space. */
export function drawScene(g: CanvasRenderingContext2D, t: number, alpha = 1, method: Method = "scan") {
  const orbitYaw = 0.55 + 0.42 * Math.sin((t / LOOP) * Math.PI * 2 - 1.3);
  // the drawing method opens as a flat elevation sheet and lifts into 3D while the agent models it
  const lift = method === "drawing" ? ease(span(t, 8.5, 12.5)) : 1;
  const yaw = method === "drawing" ? orbitYaw * lift : orbitYaw, pitch = 0.2 * lift;
  EXT = method === "drawing" ? Math.max(0.02, lift) : 1;
  const P = edges.map((e) => ({ a: project(e.a, yaw, pitch), b: project(e.b, yaw, pitch), e }));
  let minX = Infinity, maxX = -Infinity;
  for (const p of P) { minX = Math.min(minX, p.a[0], p.b[0]); maxX = Math.max(maxX, p.a[0], p.b[0]); }
  const drawing = method === "drawing";
  const scan = drawing ? 0 : span(t, 3.2, 8.2), review = span(t, 14, 18.6), measure = span(t, 19, 23.2), deliver = span(t, 23.5, 27.6), outro = span(t, 28.2, 30);
  // scan: BIM edges build in 2.0; drawing: the sheet is plotted in 1.0 and everything is already there when it lifts
  const build = drawing ? span(t, 3.2, 8.2) : span(t, 8.5, 13.6);
  const plot = drawing ? span(t, 3.2, 8.2) : 1;
  const cloudOp = t < 8.5 ? 1 : t < 14 ? 1 - build * 0.7 : 0.3 - deliver * 0.25;
  const scanX = outro > 0 ? maxX + 40 - (maxX - minX + 80) * ease(outro) : minX - 40 + (maxX - minX + 80) * ease(scan);
  const visible = (x: number) => (outro > 0 ? x > scanX : x < scanX);
  g.save(); g.globalAlpha = alpha;
  const A = (v: number) => { g.globalAlpha = alpha * v; };

  if (!drawing && scan > 0 && cloudOp > 0.02) {
    for (let i = 0; i < pts.length; i++) { const q = project(pts[i], yaw, pitch); if (!visible(q[0])) continue; g.fillStyle = ptColor[i]; A(cloudOp * (q[2] > 0 ? 0.55 : 0.9)); g.fillRect(q[0], q[1], 1.8, 1.8); }
  }
  if (drawing && t >= 3 && t < 14) {
    // sheet frame, title block and dimension line of the elevation drawing; fades as the model lifts
    const op = (t < 8.5 ? Math.min(1, span(t, 3, 3.6)) : 1 - lift) * 0.9;
    const fx = minX - 70, fy = H * 0.2, fw = maxX - minX + 140, fh = H * 0.62;
    A(op); g.strokeStyle = C.ink2; g.lineWidth = 1.2; g.strokeRect(fx, fy, fw, fh); g.strokeRect(fx + 6, fy + 6, fw - 12, fh - 12);
    g.font = '400 15px "IBM Plex Mono", monospace'; g.fillStyle = C.ink2; g.textAlign = "left";
    g.fillText("GENERAL ELEVATION  1:500", fx + 22, fy + fh - 20); g.textAlign = "right"; g.fillText("SHEET S-02 · DXF · 12 LAYERS", fx + fw - 22, fy + fh - 20); g.textAlign = "left";
    const marks = [x0, -PX, PX, x1].map((x) => project([x, Y_LOW, 0], yaw, pitch)); const dimY = Math.max(...marks.map((m) => m[1])) + 40;
    const kk = Math.min(1, plot * 1.4); g.strokeStyle = C.ink2; g.beginPath(); g.moveTo(marks[0][0], dimY); g.lineTo(marks[0][0] + (marks[3][0] - marks[0][0]) * kk, dimY); g.stroke();
    for (const m of marks) { if (m[0] > marks[0][0] + (marks[3][0] - marks[0][0]) * kk) continue; g.beginPath(); g.moveTo(m[0], dimY - 8); g.lineTo(m[0], dimY + 8); g.stroke(); }
    g.font = '400 18px "IBM Plex Mono", monospace'; g.textAlign = "center"; const lab = ["104.68", "240.00", "104.68"];
    for (let i = 0; i < 3; i++) if (kk > (i + 1) / 3.2) g.fillText(lab[i], (marks[i][0] + marks[i + 1][0]) / 2, dimY - 10);
    g.textAlign = "left";
    // the plotter head
    if (plot > 0 && plot < 1) { const hx = minX - 40 + (maxX - minX + 80) * plot; A(0.9); g.strokeStyle = C.wire; g.lineWidth = 2; g.beginPath(); g.moveTo(hx, fy + 10); g.lineTo(hx, fy + fh - 10); g.stroke(); g.fillStyle = C.wire; g.fillText("READING  " + Math.round(plot * 100) + "%", hx + 12, fy + 30); }
  }
  if (drawing && t >= 8.5 && t < 14) {
    // the agent's log, typed line by line beside the lifting model
    const k = span(t, 8.6, 13.4); const lx = W - 150 - 520, ly = H * 0.22;
    A(0.95); g.font = '400 15px "IBM Plex Mono", monospace';
    g.fillStyle = C.dim; g.fillText("AI AGENT · MODELLING FROM THE SHEETS", lx, ly);
    AGENT_LOG.forEach((row, i) => { const rk = span(k, i / AGENT_LOG.length, (i + 1) / AGENT_LOG.length); if (rk <= 0) return; g.fillStyle = rk < 1 ? C.wire : C.ink2; g.fillText((rk < 1 ? "▸ " : "✓ ") + row.slice(0, Math.ceil(row.length * rk)), lx, ly + 26 + i * 24); });
  }
  if (!drawing && t >= 3 && t < 8.5) {
    const ux = scanX, uy = H * 0.14 + Math.sin(t * 2.2) * 6;
    g.strokeStyle = C.wire; g.lineWidth = 1.5; g.setLineDash([6, 8]); A(0.6); g.beginPath(); g.moveTo(minX - 40, uy); g.lineTo(ux, uy); g.stroke(); g.setLineDash([]);
    A(0.14); g.fillStyle = C.wire; g.beginPath(); g.moveTo(ux, uy); g.lineTo(ux - 150, H * 0.86); g.lineTo(ux + 150, H * 0.86); g.closePath(); g.fill();
    A(0.9); g.lineWidth = 2; g.beginPath(); g.moveTo(ux, H * 0.2); g.lineTo(ux, H * 0.86); g.stroke();
    g.fillStyle = C.ink; g.beginPath(); g.arc(ux, uy, 5, 0, Math.PI * 2); g.fill();
    g.font = '400 16px "IBM Plex Mono", monospace'; g.fillStyle = C.wire; g.textAlign = "left"; g.fillText("UAV · LiDAR · " + Math.round(scan * 240) + "k pts", ux + 14, uy - 10);
  }

  const orderK = (e: Edge) => { if (drawing) return clamp(((e.a[0] + e.b[0]) / 2 - x0) / L, 0, 0.98); if (e.kind === "cable") return 0.72 + ((e.order - 100) / 9) * 0.26; if (e.kind === "pier") return 0.7; if (e.seg.startsWith("DECK")) return 0.42 + (e.order / (L / 2)) * 0.28; return 0.02 + ((e.order - Y_LOW) / (Y_TOP - Y_LOW)) * 0.4; };
  const segTint = (e: Edge) => { if (!e.seg.startsWith("DECK")) return e.seg.startsWith("PY1") ? C.ink : e.seg.startsWith("PY2") ? C.ink2 : e.kind === "cable" ? C.wire : C.ink2; const i = parseInt(e.seg.slice(5)); return [C.ink, C.wire, C.ink2, "#8fb7c9"][i % 4]; };
  P.sort((a, b) => b.a[2] + b.b[2] - (a.a[2] + a.b[2]));
  for (const p of P) {
    const e = p.e; if (build <= 0) break;
    if (build < orderK(e)) continue;
    const thin = e.kind === "cable" || e.kind === "joint" || e.kind === "pile" || e.kind === "ring";
    let col = C.ink, op = thin ? 0.55 : 0.9, w = thin ? 1.2 : 2.2;
    if (e.kind === "void") { if (!drawing && review <= 0) continue; col = drawing && review <= 0 ? C.ink2 : C.wire; op = drawing && review <= 0 ? 0.5 : 0.9 * Math.min(1, review * 3); g.setLineDash([8, 6]); w = 1.4; }
    if (drawing && e.kind === "depth" && lift < 0.05) continue;
    if (e.kind === "ring") op = 0.35;
    if (review > 0 && review < 1 && e.kind !== "void") col = segTint(e);
    if (deliver > 0) op *= 1 - deliver * 0.45;
    if ((p.a[2] + p.b[2]) / 2 > 0 && thin) op *= 0.6;
    if (outro > 0 && !visible((p.a[0] + p.b[0]) / 2)) continue;
    g.strokeStyle = col; A(op); g.lineWidth = w; g.beginPath(); g.moveTo(p.a[0], p.a[1]); g.lineTo(p.b[0], p.b[1]); g.stroke(); g.setLineDash([]);
  }
  if (build > 0 && build < 1) { A(1); for (const p of P) { if (Math.abs(orderK(p.e) - build) >= 0.015) continue; g.strokeStyle = C.wire; g.lineWidth = 3; g.beginPath(); g.moveTo(p.a[0], p.a[1]); g.lineTo(p.b[0], p.b[1]); g.stroke(); } }

  if (deliver > 0 && outro < 1) {
    const fill = (poly: V3[], hole: V3[] | null, a: number) => { g.save(); g.beginPath(); poly.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); if (hole) { hole.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); } g.fillStyle = C.slate; A(a); g.fill("evenodd"); g.restore(); };
    for (const px of [-PX, PX]) for (const sx of [-2.75, 2.75]) {
      const poly = outerPoly.map((p) => project([px + sx, p[1], p[0]], yaw, pitch)), hole = innerPoly.map((p) => project([px + sx, p[1], p[0]], yaw, pitch));
      if (outro > 0 && !visible(poly[0][0])) continue;
      fill(poly, hole, 0.95 * deliver * (sx < 0 ? 0.7 : 1));
    }
    const deck = ([[x0, 0.5, -DECK_W], [x1, 0.5, -DECK_W], [x1, 0.5, DECK_W], [x0, 0.5, DECK_W]] as V3[]).map((p) => project(p, yaw, pitch));
    if (!(outro > 0)) fill(deck, null, 0.7 * deliver);
    DAMAGE.forEach((d, i) => {
      const k = span(deliver, 0.35 + i * 0.12, 0.55 + i * 0.12); if (k <= 0) return;
      const q = project(d.at, yaw, pitch); if (outro > 0 && !visible(q[0])) return;
      g.fillStyle = d.col; A(0.9 * k); g.beginPath(); g.arc(q[0], q[1], 7, 0, Math.PI * 2); g.fill();
      g.strokeStyle = d.col; g.lineWidth = 1.5; g.beginPath(); g.arc(q[0], q[1], 13, 0, Math.PI * 2); g.stroke();
      g.font = '500 15px "IBM Plex Mono", monospace'; const lab = d.id + " · " + d.type; const w = g.measureText(lab).width + 16;
      g.fillStyle = "rgba(10,13,28,0.85)"; g.fillRect(q[0] - w / 2, q[1] - 46, w, 26); g.strokeRect(q[0] - w / 2, q[1] - 46, w, 26);
      g.fillStyle = C.ink; g.textAlign = "center"; g.fillText(lab, q[0], q[1] - 28); g.textAlign = "left";
    });
  }

  if (measure > 0 && deliver < 1) {
    const k = ease(measure), op = (1 - Math.min(1, deliver * 2.5)) * 0.9;
    const corners: V3[] = [];
    for (const x of [x0, x1]) for (const y of [Y_LOW, Y_TOP]) for (const z of [-14, 14]) corners.push(project([x, y, z], yaw, pitch));
    g.strokeStyle = C.wire; g.lineWidth = 1.2; g.setLineDash([4, 6]); A(op * Math.min(1, k * 2));
    const pairs = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (const [a, b] of pairs) { const Aa = corners[a], Bb = corners[b]; g.beginPath(); g.moveTo(Aa[0], Aa[1]); g.lineTo(Aa[0] + (Bb[0] - Aa[0]) * k, Aa[1] + (Bb[1] - Aa[1]) * k); g.stroke(); }
    g.setLineDash([]);
    const marks = [x0, -PX, PX, x1].map((x) => project([x, Y_LOW, 14], yaw, pitch)); const dimY = Math.min(Math.max(...marks.map((m) => m[1])) + 44, H - 120);
    A(op); g.strokeStyle = C.ink2; g.lineWidth = 1.4; g.beginPath(); g.moveTo(marks[0][0], dimY); g.lineTo(marks[0][0] + (marks[3][0] - marks[0][0]) * k, dimY); g.stroke();
    for (const m of marks) { if (m[0] > marks[0][0] + (marks[3][0] - marks[0][0]) * k) continue; g.beginPath(); g.moveTo(m[0], dimY - 10); g.lineTo(m[0], dimY + 10); g.stroke(); }
    g.fillStyle = C.ink2; g.font = '400 20px "IBM Plex Mono", monospace'; g.textAlign = "center";
    const lab = ["104.68", "240.00", "104.68"]; for (let i = 0; i < 3; i++) if (k > (i + 1) / 3.2) g.fillText(lab[i], (marks[i][0] + marks[i + 1][0]) / 2, dimY - 12);
    if (k > 0.95) g.fillText("L = 449.36 m · H = 123 m", (marks[0][0] + marks[3][0]) / 2, dimY + 34);
    g.textAlign = "left";
  }

  if (drawing && review > 0 && review < 1) {
    PHOTOS.forEach((ph, i) => {
      const k = span(review, i * 0.22, i * 0.22 + 0.18); if (k <= 0) return;
      const q = project(ph.at, yaw, pitch); const fw = 150, fh = 100, fx = q[0] + (i % 2 ? -fw - 60 : 60), fy = q[1] - fh - 50;
      A(0.95 * Math.min(1, k * 2)); g.strokeStyle = C.ink2; g.lineWidth = 1.2; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(fx + (i % 2 ? fw : 0), fy + fh); g.stroke();
      g.fillStyle = "rgba(16,20,42,0.95)"; g.fillRect(fx, fy, fw, fh); g.strokeRect(fx, fy, fw, fh);
      // a photograph: diagonal grain, a crosshair, a match tick once compared
      g.save(); g.beginPath(); g.rect(fx + 1, fy + 1, fw - 2, fh - 2); g.clip(); g.strokeStyle = C.line3; g.lineWidth = 1; for (let o = -fh; o < fw + fh; o += 9) { g.beginPath(); g.moveTo(fx + o, fy + fh); g.lineTo(fx + o + fh, fy); g.stroke(); } g.restore();
      g.strokeStyle = C.wire; g.beginPath(); g.moveTo(fx + fw / 2 - 14, fy + fh / 2); g.lineTo(fx + fw / 2 + 14, fy + fh / 2); g.moveTo(fx + fw / 2, fy + fh / 2 - 14); g.lineTo(fx + fw / 2, fy + fh / 2 + 14); g.stroke();
      g.fillStyle = C.wire; g.beginPath(); g.arc(q[0], q[1], 5, 0, Math.PI * 2); g.fill();
      g.font = '400 14px "IBM Plex Mono", monospace'; g.fillStyle = k > 0.9 ? C.ink : C.ink2; g.textAlign = "left"; g.fillText((k > 0.9 ? "✓ " : "… ") + ph.label, fx, fy - 10);
    });
    A(0.9); g.font = '400 15px "IBM Plex Mono", monospace'; g.fillStyle = C.wire; g.fillText("PHOTO MATCH  " + Math.min(4, Math.floor(review * 4.5)) + " / 4 · DEVIATION ±8 MM", W - 150 - 420, H * 0.22);
  }
  if (!drawing && review > 0 && review < 1) {
    const cx = project([-PX, 0, 0], yaw, pitch)[0], top = project([-PX, Y_TOP, 0], yaw, pitch)[1], bot = project([-PX, -34, 0], yaw, pitch)[1];
    const sy = bot - (bot - top) * ease(review);
    g.strokeStyle = C.wire; g.lineWidth = 2; A(0.9); g.beginPath(); g.moveTo(cx - 120, sy); g.lineTo(cx + 120, sy); g.stroke();
    g.fillStyle = C.wire; A(0.08); g.fillRect(cx - 120, sy, 240, bot - sy);
    A(1); g.font = '400 15px "IBM Plex Mono", monospace'; g.fillStyle = C.wire; g.fillText("SECTION  EL " + (Y_LOW + 30 + (Y_TOP + 34) * ease(review)).toFixed(1), cx + 130, sy + 5);
  }
  g.restore();
}
