import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Nav";
import { featuredModel, indianaModels } from "@/data/models";
import PipelineStage, { type MethodSteps } from "./PipelineStage";
import s from "./Sections.module.css";

const APP_URL = "https://wonsan-webapp-en.vercel.app/";
const APP_MODEL_URL = "https://wonsan-webapp-en.vercel.app/model";
const SEGMENT_VIEWER_URL = "https://youngbrain85.github.io/wonsan-anmyeon-bridge-3d/";

function Arrow({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke={dark ? "#0a0d1c" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServicesBar() {
  const items: [string, string][] = [
    ["3D Modeling & Digital Twins", "Scan-to-BIM, as-built twins, web viewer"],
    ["Research & Consulting", "Inspection methods, UAV workflows, pilots"],
    ["Software & Automation", "Custom tools, data pipelines, integrations"],
    ["Land Development", "Site modeling, terrain, feasibility studies"],
  ];
  return (
    <section aria-label="Services" className={s.services}>
      <div className={`container ${s.servicesInner}`}>
        {items.map(([a, b]) => (
          <Link key={a} href="/#capabilities" className={s.service}>
            <strong>{a}</strong>
            <span>{b}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Work() {
  const f = featuredModel;
  return (
    <section id="work" className="section motif--drafting">
      <div className={`container section__inner`}>
        <div className="section__head">
          <div className="section__title">
            <p className="eyebrow">Work</p>
            <h2 className="display">3D Digital Twin</h2>
          </div>
        </div>

        <article className={`card ${s.featured}`}>
          <Link href={`/models/${f.slug}`} className={s.featuredImage}>
            <Image src={f.render} alt="Wireframe render of the cable-stayed bridge: two diamond pylons on pile foundations, deck and 72 stay cables" fill sizes="(max-width: 900px) 100vw, 66vw" priority />
            <span className={`mono ${s.cornerTag}`}>Featured · Cable-stayed · LOD 400</span>
            <span className={`mono ${s.cornerStat}`}>1,452 meshes · 73 segments</span>
          </Link>
          <div className={s.featuredBody}>
            <p className="eyebrow" style={{ fontSize: 12 }}>
              South Korea · sea crossing
            </p>
            <h3 className="display">{f.name}</h3>
            <dl className="spec">
              <div>
                <dt>Source</dt>
                <dd>DWG/DXF · site photos</dd>
              </div>
              <div>
                <dt>Deliverable</dt>
                <dd>GLB · IFC4</dd>
              </div>
            </dl>
            <div className={s.featuredCtas}>
              <Link href={`/models/${f.slug}`} className="btn btn--primary">
                Open in the 3D viewer <Arrow dark />
              </Link>
            </div>
          </div>
        </article>

        <div className="grid">
          <figure className={`card card--ground ${s.figure}`}>
            <a href={APP_MODEL_URL} target="_blank" rel="noreferrer">
              <Image src="/renders/app-en-3dview.png" alt="JJ InfraData inspection web app, 3D View page: member tree with pylons, foundations, deck and girders, cables, bearings and furniture beside the cable-stayed bridge model" width={1600} height={900} style={{ objectPosition: "0 0" }} />
            </a>
            <figcaption>
              <strong>Live in the inspection web app.</strong> The same 1,452-mesh model drives the JJ InfraData 3D View: a member tree that isolates any of the 73 segments, a condition-grade heatmap and damage markers.{" "}
              <a href={APP_MODEL_URL} className="link" target="_blank" rel="noreferrer">
                Open the 3D View
              </a>
            </figcaption>
          </figure>
          <figure className={`card card--ground ${s.figure}`}>
            <Image src="/renders/pylon-segments.png" alt="Pylon PY1 alone, its 32 parts tinted alternately so each segment reads as its own object" width={1200} height={900} style={{ objectPosition: "50% 40%" }} />
            <figcaption>
              <strong>By member, by segment.</strong> Pylon PY1 on its own: 32 parts, each its own object with an elevation range, so any member or any segment can be isolated, measured and visualized.
            </figcaption>
          </figure>
          <figure className={`card card--ground ${s.figure}`}>
            <Image src="/renders/pylon-damage.png" alt="Damage markers for a crack, spalling, leakage and rebar exposure drawn on the 3D faces of pylon PY1, with an inspection record panel listing each one with its size and grade" width={1200} height={900} style={{ objectPosition: "50% 45%" }} />
            <figcaption>
              <strong>Damage on the surface, records behind it.</strong> Inspectors mark cracks, spalls and leaks directly on the 3D faces; every marker opens its inspection record (type, size, grade, photo, date) and feeds the map sheets.
            </figcaption>
          </figure>
        </div>

        <div className={s.subhead}>
          <h3 className="display">Nine Indiana highway bridges</h3>
          <p className="mono">Modeled from INDOT plan sets · GLB · member-level meshes</p>
        </div>
        <div className="grid">
          {indianaModels.map((m) => (
            <article key={m.slug} className={`card ${s.bridgeCard}`}>
              <Link href={`/models/${m.slug}`}>
                <Image src={m.render} alt={`Wireframe render of ${m.name}`} width={1600} height={900} />
              </Link>
              <div className={s.bridgeCardBody}>
                <h4>{m.name}</h4>
                <p className="mono">
                  {m.type} · {m.meshes.toLocaleString()} meshes · {m.county}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className={s.footLine}>
          <p className="mono">10 bridges · Korea and Indiana · every model delivered as GLB, the cable-stayed twin also as IFC4</p>
          <Link href="/models" className="link">
            Open the model library →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const measure: [string, string, string] = ["Measure and validate", "Every segment is measured automatically: bounding box, watertightness, volume and cross-section slices with outer bounds and voids, saved as JSON beside the model.", "bbox · volume · slices · watertight"];
  const deliver: [string, string, string] = ["Deliver as BIM and twin", "Semantic IFC4 export with pylons, girders, deck slab and cables, re-parsed and validated, plus GLB for the web. The inspection platform then ties damage records to the elements.", "IFC4 · GLB · inspection twin"];
  const methods: MethodSteps[] = [
    {
      method: "scan",
      label: "Method A",
      title: "Capture the field",
      steps: [
        ["Collect the source", "UAV flights and LiDAR scans of the structure, with the drawings, section tables and close-up site photographs alongside. Where no drawings exist, the capture is the source.", "E57 · LAS · JPG · DWG"],
        ["Model from the cloud", "The point cloud is meshed and aligned, then fitted to parametric elements: pylons lofted in 0.8 m rings, deck segments, cables and anchorages. The model follows the field, not the sheet.", "240k points · 32 pylon parts · 72 cables"],
        ["Review every segment", "A browser viewer lists all segments with elevation range and status. Wireframe, translucent approved parts and section clipping let the engineer check hollow sections against the scan.", "71 of 73 approved"],
        measure,
        deliver,
      ],
    },
    {
      method: "drawing",
      label: "Method B",
      title: "AI agent, from 2D drawings",
      steps: [
        ["Read the drawings", "An AI agent parses the DWG/DXF sheets: plan, elevation, sections and the variable-dimension table, and turns them into elevation-indexed parameters. No scan needed to start.", "DWG → DXF · 4 sheets · 12 layers"],
        ["Model from parameters", "The agent lofts each pylon ring by ring from the section table, mirrors the second pylon along the deck axis, and places deck segments and cables from the drawings. A revision is a parameter change.", "32 pylon parts · 37 deck segments · 72 cables"],
        ["Verify with site photos", "Close-up photographs are matched to the model: cable anchorages, the pylon head, bearings, pile caps. Mismatches go back into the parameters until the twin agrees with the field.", "4 checkpoints · ±8 mm"],
        measure,
        deliver,
      ],
    },
  ];
  return (
    <section id="how" className={`section motif--drafting motif--drafting-surface ${s.how}`}>
      <div className={`container section__inner ${s.howInner}`} style={{ gap: 56 }}>
        <div className="section__head">
          <div className="section__title">
            <p className="eyebrow">How it works</p>
            <h2 className="display">
              From Drawings and Photos
              <br />
              To 3D Digital Twin
            </h2>
          </div>
          <p className="section__lede">Two ways to the same twin, both run on a 450 m cable-stayed bridge in Korea: capture the field, or let an AI agent build it from the 2D drawings and check it against site photos. Each step leaves a file you can open.</p>
        </div>
        <PipelineStage methods={methods} />
      </div>
    </section>
  );
}

export function Software() {
  return (
    <section id="software" className="section motif--drafting">
      <div className="container section__inner">
        <div className="section__head">
          <div className="section__title">
            <p className="eyebrow">Software</p>
            <h2 className="display">The twin is a working tool, not a render.</h2>
          </div>
          <p className="section__lede">Bridge visual inspection platform built on the cable-stayed bridge twin. Inspectors log damage on the 3D model; the system scores the structure.</p>
        </div>
        <article className={`card card--ground ${s.softwareMain}`}>
          <a href={APP_MODEL_URL} target="_blank" rel="noreferrer">
            <Image src="/renders/app-en-3dview.png" alt="Inspection web app 3D View: a member tree on the left and the cable-stayed bridge model with a condition-grade heatmap toggle" width={1600} height={900} />
          </a>
          <div className={s.softwareBody}>
            <p className="eyebrow" style={{ fontSize: 12 }}>
              3D view
            </p>
            <h3>Member tree, segment isolation, damage markers</h3>
            <ul>
              <li>Browse pylons, foundations, deck and girders, cables, bearings and furniture as a tree; isolate any one of 73 segments.</li>
              <li>Click a mesh for element data, click a marker for the damage record.</li>
              <li>Condition heatmap colors members by their computed grade.</li>
              <li>Measurement-based LOD 4–5 GLB with drawing dimensions attached.</li>
            </ul>
            <span className="mono">React · Vite · Mantine · Three.js · Supabase</span>
          </div>
        </article>
        <div className="grid">
          <article className={`card card--ground ${s.shot}`} style={{ flexBasis: 420 }}>
            <a href={APP_URL} target="_blank" rel="noreferrer">
              <Image src="/renders/app-en-dashboard.png" alt="Inspection web app dashboard with the target bridge, a safety grade card, converted defect score and grade distribution" width={1600} height={900} />
            </a>
            <div className={s.shotBody}>
              <h3>Dashboard and safety grade</h3>
              <p>Converted defect score and A to E grade per the Korean facility safety guideline (KISTEC tables 1.31 and 1.32), member-level grades, recent damage and inspection map sheet counts in one view.</p>
            </div>
          </article>
          <article className={`card card--ground ${s.shot}`} style={{ flexBasis: 420 }}>
            <a href={SEGMENT_VIEWER_URL} target="_blank" rel="noreferrer">
              <Image src="/renders/app-segment-viewer.png" alt="Segment review viewer with a segment list and the bridge model" width={1600} height={900} />
            </a>
            <div className={s.shotBody}>
              <h3>Segment review viewer and inspection map sheets</h3>
              <p>Approve segments one by one with section clipping, then project the 3D damage records onto 97 member drawings to generate the inspection map sheets automatically.</p>
            </div>
          </article>
        </div>
        <p className={`mono ${s.note}`}>
          <a href={APP_URL} className="link" target="_blank" rel="noreferrer">
            Open the inspection app
          </a>{" "}
          · English build ·{" "}
          <a href={APP_MODEL_URL} className="link" target="_blank" rel="noreferrer">
            3D View
          </a>
        </p>
      </div>
    </section>
  );
}

const capIcons = {
  layers: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 20 14 25l10-5M4 14l10 5 10-5M14 3 4 8l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  grid: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M5 5h18v18H5z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 11h18M11 5v18" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  ),
  sensor: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 3v4m0 14v4M3 14h4m14 0h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  change: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 18 10 10l5 6 4-4 5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 23h20" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  ),
  web: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="22" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 24h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

export function Capabilities() {
  const caps: [keyof typeof capIcons, string, string][] = [
    ["layers", "As-built digital twins", "A geo-referenced, versioned model of the asset as it really is, updated with every new capture."],
    ["grid", "BIM & CAD export", "IFC, Revit, DWG and glTF out of the box. Drop results straight into the tools your engineers already use."],
    ["sensor", "Sensor & IoT overlay", "Temperature, vibration, occupancy and equipment status shown where they happen, on the model."],
    ["change", "Change detection", "Compare scan to scan or scan to design. Deviations are flagged with location, size and a photo."],
    ["web", "Web viewer & sharing", "Nothing to install. Measure, annotate and share a link with owners, contractors and inspectors."],
  ];
  return (
    <section id="capabilities" className="section motif--drafting motif--drafting-surface">
      <div className="container section__inner">
        <div className="section__title">
          <p className="eyebrow">Capabilities</p>
          <h2 className="display">One platform from first scan to daily operations.</h2>
        </div>
        <div className="grid">
          <article className={`card card--ground ${s.capWide}`}>
            <div className={s.capWideText}>
              <h3 className="display">AI 3D reconstruction</h3>
              <p>Photogrammetry and LiDAR fused into one clean, measurable model. Trained on built environments, so it understands structure, not just surfaces.</p>
              <Link href="/#contact" className="link">
                Request a sample model →
              </Link>
            </div>
            <div className={s.capViewer}>
              <div className={`mono ${s.capViewerBar}`}>
                <span>viewer · site-042.twin</span>
                <span style={{ color: "var(--ink)" }}>LIVE</span>
              </div>
              <svg viewBox="0 0 320 170" width="100%" aria-hidden="true">
                <rect width="320" height="170" fill="#0a0d1c" />
                <g stroke="#1f2540">
                  <path d="M0 40h320M0 80h320M0 120h320M40 0v170M80 0v170M120 0v170M160 0v170M200 0v170M240 0v170M280 0v170" />
                </g>
                <g fill="none" stroke="#f2efe9" strokeWidth="1.2" strokeLinejoin="round">
                  <path d="M100 60 200 100 150 128 50 88Z" />
                  <path d="M100 24 200 64 150 92 50 52Z" />
                  <path d="M100 24v36M200 64v36M150 92v36M50 52v36" />
                </g>
                <g fill="none" stroke="#f2efe9" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
                  <path d="M200 64 260 94 210 122 150 92" />
                </g>
                <rect x="222" y="18" width="84" height="34" rx="3" fill="#10142a" stroke="#242b47" />
                <text x="230" y="32" fontFamily="var(--font-mono)" fontSize="9" fill="#9a9690">
                  WALL-12
                </text>
                <text x="230" y="44" fontFamily="var(--font-mono)" fontSize="9" fill="#f2efe9">
                  4.82 m × 2.90 m
                </text>
              </svg>
            </div>
          </article>
          {caps.map(([icon, title, body]) => (
            <article key={title} className={`card card--ground ${s.cap}`}>
              {capIcons[icon]}
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Industries() {
  const rows: [string, string][] = [
    ["Construction & AEC", "Progress tracking, as-built verification, clash checks against design."],
    ["Real estate & facilities", "Accurate floor areas, virtual walkthroughs, maintenance records on the model."],
    ["Energy & industrial", "Plant and pipeline twins for turnarounds, safety planning and brownfield retrofits."],
    ["Infrastructure & public works", "Roads, bridges and utilities documented for inspection and long-term asset management."],
  ];
  return (
    <section id="industries" className="section motif--drafting">
      <div className={`container section__inner ${s.industriesInner}`} style={{ flexDirection: "row" }}>
        <div className={s.industriesIntro}>
          <p className="eyebrow">Industries</p>
          <h2 className="display">Built for the teams that build Texas.</h2>
          <p>Each industry gets its own capture guide, element library and export presets.</p>
        </div>
        <ul className={s.industryList}>
          {rows.map(([a, b]) => (
            <li key={a}>
              <Link href="/#contact">
                <span className="display">{a}</span>
                <span>{b}</span>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M4 11h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section id="proof" className="section motif--drafting motif--drafting-surface">
      <div className="container section__inner">
        <div className="section__title">
          <p className="eyebrow">Customer story</p>
          <h2 className="display">Results on real sites.</h2>
        </div>
        <div className="grid">
          <figure className={`card card--ground ${s.quote}`}>
            <blockquote className="display" style={{ fontFamily: "var(--font-body)" }}>
              “[CUSTOMER QUOTE — two sentences on what changed on site after switching to QBTTEXAS twins.]”
            </blockquote>
            <figcaption>
              <span className={s.avatar} />
              <span style={{ display: "flex", flexDirection: "column" }}>
                <strong>[NAME]</strong>
                <span className="muted" style={{ fontSize: 14 }}>
                  [TITLE], [COMPANY]
                </span>
              </span>
              <Link href="/#contact" className="link" style={{ marginLeft: "auto" }}>
                Read the case study →
              </Link>
            </figcaption>
          </figure>
          <div className={s.metrics}>
            {[
              ["[XX]%", "less time from site visit to usable model"],
              ["10", "bridges modeled in Korea and Indiana"],
              ["±[X] mm", "typical measurement accuracy"],
            ].map(([n, l]) => (
              <div key={l} className={`card card--ground ${s.metric}`}>
                <strong className="display">{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section id="contact" className="section motif--drafting">
      <div className="container section__inner">
        <div className={s.ctaCard}>
          <div className={s.ctaText}>
            <h2 className="display">See your site as a digital twin.</h2>
            <p>Send us a sample of your capture and we will return a working model you can open in the browser. A 30-minute walkthrough, no commitment.</p>
          </div>
          <form className={s.form} action="mailto:[EMAIL]" method="post" encType="text/plain">
            <label htmlFor="cta-email">Work email</label>
            <div className={s.formRow}>
              <input id="cta-email" name="email" type="email" placeholder="you@company.com" required />
              <button type="submit" className="btn btn--primary">
                Book a demo
              </button>
            </div>
            <small>We reply within one business day. No newsletter, no spam.</small>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Solutions", [["3D reconstruction", "/#capabilities"], ["Digital twins", "/#capabilities"], ["BIM export", "/#capabilities"], ["3D viewer", "/models"]]],
    ["Industries", [["Construction", "/#industries"], ["Real estate", "/#industries"], ["Energy", "/#industries"], ["Infrastructure", "/#industries"]]],
    ["Company", [["About", "/#about"], ["Work", "/#work"], ["Software", "/#software"], ["Contact", "/#contact"]]],
  ];
  return (
    <footer id="about" className={`motif--drafting ${s.footer}`}>
      <div className={`container ${s.footerInner}`}>
        <div className={s.footerCols}>
          <div className={s.footerBrand}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Logo size={26} />
              <span className="display" style={{ fontSize: 18, letterSpacing: "0.06em" }}>
                QBTTEXAS LLC
              </span>
            </span>
            <p className="eyebrow" style={{ fontSize: 12 }}>
              Innovate · Build · Transform
            </p>
            <p>AI-based 3D modeling and digital twins for the built and industrial world.</p>
            <address className="mono">
              [STREET ADDRESS]
              <br />
              [CITY], Texas [ZIP]
              <br />
              [EMAIL] · [PHONE]
            </address>
          </div>
          {cols.map(([title, links]) => (
            <nav key={title} aria-label={title} className={s.footerCol}>
              <span className="mono">{title}</span>
              {links.map(([label, href]) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <p aria-hidden="true" className={`display ${s.footerWordmark}`}>
          QBTTEXAS
        </p>
        <div className={s.footerBottom}>
          <span>© 2026 QBTTEXAS LLC. All rights reserved.</span>
          <span>
            <Link href="/#about">Privacy</Link>
            <Link href="/#about">Terms</Link>
            <Link href="/#about">LinkedIn</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
