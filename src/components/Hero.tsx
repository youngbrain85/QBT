"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import HeroMesh from "./HeroMesh";
import styles from "./Hero.module.css";
import type { HeroPhase } from "./HeroScene";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const STEPS = [
  ["01 Point cloud", "UAV + LiDAR"],
  ["02 Mesh & alignment", "AI"],
  ["03 BIM elements", "IFC"],
  ["04 Inspection twin", "live"],
];

const PINS = [
  { left: "56%", top: "28%", text: "PY2 · C.J. 16 · EL +89.125" },
  { left: "20%", top: "60%", text: "Cable S-12 · anchorage CA19" },
  { left: "64%", top: "66%", text: "Bearing B2 · OK" },
];

export default function Hero() {
  const [phase, setPhase] = useState<HeroPhase>(0);
  const progress = [0.34, 0.6, 0.84, 1][phase];

  return (
    <section id="top" className={`section ${styles.hero}`}>
      <HeroMesh />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow">Innovate · Build · Transform</p>
          <h1 className={`display ${styles.title}`}>Physical AI. Digital 3D World.</h1>
          <p className={styles.lede}>AI that turns field capture into measurable digital twins of bridges, buildings and plants.</p>
          <div className={styles.ctas}>
            <Link href="/models" className="btn btn--primary">
              3D demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/#work" className="btn btn--ghost">
              View our work
            </Link>
          </div>
          <ul className={`mono ${styles.tags}`}>
            <li>UAV · LiDAR · Photogrammetry</li>
            <li>Scan-to-BIM</li>
            <li>Digital twins</li>
          </ul>
        </div>

        <div className={styles.stage} aria-hidden="true">
          <HeroScene onPhase={setPhase} />
          {PINS.map((p, i) => (
            <div
              key={p.text}
              className={`mono ${styles.pin}`}
              data-show={phase === 2 ? "1" : "0"}
              style={{ left: p.left, top: p.top, transitionDelay: `${i * 0.25}s` }}
            >
              <span className={styles.pinDot} />
              {p.text}
            </div>
          ))}
          <div className={`mono ${styles.pipeline}`}>
            <p className={styles.pipelineLabel}>Pipeline</p>
            {STEPS.map(([a, b], i) => (
              <div key={a} className={styles.step} data-active={i === Math.min(phase, 3) ? "1" : "0"}>
                <span>{a}</span>
                <span className="muted">{b}</span>
              </div>
            ))}
            <div className={styles.bar}>
              <div className={styles.barFill} style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
