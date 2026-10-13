"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { models, type BridgeModel } from "@/data/models";
import type { SelectedElement, ViewMode, ViewPreset } from "./ModelViewer";
import styles from "./ModelsWorkspace.module.css";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

const FILTERS: { key: string; label: string; test: (m: BridgeModel) => boolean }[] = [
  { key: "all", label: "All", test: () => true },
  { key: "cable-stayed", label: "Cable-stayed", test: (m) => m.typeTag === "cable-stayed" },
  { key: "girder", label: "Girder", test: (m) => m.typeTag === "girder" },
  { key: "indiana", label: "Indiana", test: (m) => m.region === "Indiana" },
  { key: "korea", label: "Korea", test: (m) => m.region === "Korea" },
];

function fmt(n: number) {
  return n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2);
}

export default function ModelsWorkspace({ initialSlug }: { initialSlug?: string }) {
  const initial = models.find((m) => m.slug === initialSlug) ?? models[0];
  const [current, setCurrent] = useState<BridgeModel>(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [mode, setMode] = useState<ViewMode>("shaded");
  const [section, setSection] = useState(1);
  const [preset, setPreset] = useState<ViewPreset>("iso");
  const [presetNonce, setPresetNonce] = useState(0);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [stats, setStats] = useState<{ meshes: number; triangles: number; size: [number, number, number] } | null>(null);

  const list = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter) ?? FILTERS[0];
    const q = query.trim().toLowerCase();
    return models.filter((m) => f.test(m) && (!q || `${m.name} ${m.type} ${m.county ?? ""} ${m.crosses ?? ""}`.toLowerCase().includes(q)));
  }, [filter, query]);

  const choose = (m: BridgeModel) => {
    setCurrent(m);
    setSelected(null);
    setStats(null);
    setSection(1);
    window.history.replaceState(null, "", `/models/${m.slug}`);
  };

  const pickPreset = (p: ViewPreset) => {
    setPreset(p);
    setPresetNonce((n) => n + 1);
  };

  return (
    <div className={styles.workspace}>
      <aside aria-label="Model library" className={styles.library}>
        <div className={styles.libraryHead}>
          <div className={styles.libraryTitle}>
            <h1 className="display">Models</h1>
            <span className="mono">{models.length} bridges</span>
          </div>
          <label htmlFor="model-search" className={styles.srOnly}>
            Search models
          </label>
          <input id="model-search" type="search" placeholder="Search by name, route or type" value={query} onChange={(e) => setQuery(e.target.value)} className={styles.search} />
          <div className={`mono ${styles.filters}`}>
            {FILTERS.map((f) => (
              <button key={f.key} type="button" data-active={filter === f.key ? "1" : "0"} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <ul className={styles.list}>
          {list.map((m) => (
            <li key={m.slug}>
              <button type="button" className={styles.item} data-active={m.slug === current.slug ? "1" : "0"} onClick={() => choose(m)}>
                <span className={styles.itemRow}>
                  <span className={styles.itemName}>{m.name}</span>
                  <span className="mono">{m.region === "Korea" ? "KR" : "IN"}</span>
                </span>
                <span className={`mono ${styles.itemMeta}`}>
                  {m.typeTag} · {m.meshes.toLocaleString()} meshes · {m.coverage === "complete" ? "complete" : "exterior"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section aria-label="3D viewport" className={styles.viewport}>
        <div className={styles.toolbar}>
          <div className={styles.toolGroup} role="group" aria-label="Display mode">
            {(["shaded", "wireframe", "points"] as ViewMode[]).map((m) => (
              <button key={m} type="button" className={styles.tool} data-active={mode === m ? "1" : "0"} onClick={() => setMode(m)}>
                {m === "shaded" ? "Shaded" : m === "wireframe" ? "Wireframe" : "Point cloud"}
              </button>
            ))}
          </div>
          <div className={styles.toolGroup} role="group" aria-label="Camera">
            {(["iso", "front", "side", "top"] as ViewPreset[]).map((p) => (
              <button key={p} type="button" className={`mono ${styles.toolSmall}`} data-active={preset === p ? "1" : "0"} onClick={() => pickPreset(p)}>
                {p === "iso" ? "All" : p[0].toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <label className={`mono ${styles.section}`}>
            <span>Section</span>
            <input type="range" min={0.05} max={1} step={0.005} value={section} onChange={(e) => setSection(parseFloat(e.target.value))} aria-label="Section cut along the bridge" />
          </label>
        </div>
        <div className={styles.canvasWrap}>
          <ModelViewer model={current} mode={mode} section={section} preset={preset} presetNonce={presetNonce} onSelect={setSelected} onStats={setStats} />
          <div className={`mono ${styles.hud}`}>
            <span>{current.name}</span>
            <span>{current.type}</span>
            {stats ? (
              <span>
                {fmt(stats.size[0])} × {fmt(stats.size[1])} × {fmt(stats.size[2])} m · {stats.triangles.toLocaleString()} tris
              </span>
            ) : null}
          </div>
          <p className={`mono ${styles.hint}`}>Drag to orbit · Right-drag to pan · Scroll to zoom · Click an element for details</p>
        </div>
        <div className={styles.thumbs}>
          {models.map((m) => (
            <button key={m.slug} type="button" className={styles.thumb} data-active={m.slug === current.slug ? "1" : "0"} onClick={() => choose(m)} aria-label={m.name}>
              <Image src={m.render} alt="" width={150} height={84} />
            </button>
          ))}
        </div>
      </section>

      <aside aria-label="Details" className={styles.details}>
        <div className={styles.detailBlock}>
          <p className="eyebrow" style={{ fontSize: 11 }}>
            Model
          </p>
          <h2 className="display">{current.name}</h2>
          <p className="muted" style={{ fontSize: 13 }}>
            {current.summary}
          </p>
        </div>
        <dl className={`spec ${styles.detailBlock}`}>
          <div>
            <dt>Type</dt>
            <dd>{current.type}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{current.county ?? "—"}</dd>
          </div>
          <div>
            <dt>Crosses</dt>
            <dd>{current.crosses ?? "—"}</dd>
          </div>
          <div>
            <dt>Structure ID</dt>
            <dd>{current.structureId ?? "—"}</dd>
          </div>
          <div>
            <dt>Meshes</dt>
            <dd>{stats ? stats.meshes.toLocaleString() : current.meshes.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Coverage</dt>
            <dd>{current.coverage === "complete" ? "Complete exterior" : "Exterior, detail pending"}</dd>
          </div>
        </dl>
        <div className={styles.detailBlock}>
          <p className="eyebrow" style={{ fontSize: 11 }}>
            Selected element
          </p>
          {selected ? (
            <>
              <strong className={styles.elementName}>{selected.name}</strong>
              <dl className="spec">
                <div>
                  <dt>Size</dt>
                  <dd>
                    {fmt(selected.size[0])} × {fmt(selected.size[1])} × {fmt(selected.size[2])} m
                  </dd>
                </div>
                <div>
                  <dt>Triangles</dt>
                  <dd>{selected.triangles.toLocaleString()}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>
              Click a member in the viewport to read its dimensions.
            </p>
          )}
        </div>
        <div className={styles.detailBlock}>
          <p className="eyebrow" style={{ fontSize: 11 }}>
            Download
          </p>
          <div className={styles.chips}>
            {current.files.map((f) => (
              <a key={f} href={`/models/${f}`} download className={`mono ${styles.chip}`}>
                {f.split("/").pop()}
              </a>
            ))}
          </div>
          <Link href="/#contact" className="link" style={{ fontSize: 13 }}>
            Request IFC, DWG or measurements →
          </Link>
        </div>
      </aside>
    </div>
  );
}
