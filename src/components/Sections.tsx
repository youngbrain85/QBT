import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Nav";
import { Arcs, Contours, PointField } from "./SectionArt";
import { featuredModel, indianaModels } from "@/data/models";
import s from "./Sections.module.css";

const APP_URL = "https://wonsan-webapp-en.vercel.app/";
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

export function LogoStrip() {
  return (
    <section aria-label="Customers" className={s.logos}>
      <div className={`container ${s.logosInner}`}>
        <p className="eyebrow" style={{ fontSize: 12, flex: "0 0 auto" }}>
          Trusted by teams across Texas
        </p>
        <ul className={s.logosList}>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>[CLIENT LOGO]</li>
          ))}
        </ul>
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
            <h2 className="display">Bridges, modeled from drawings and the field.</h2>
          </div>
          <p className="section__lede">
            Ten bridges modeled to date: a 450 m cable-stayed bridge in Korea and nine highway bridges in Indiana. Every model opens in the browser.
          </p>
        </div>

        <article className={`card ${s.featured}`}>
          <Link href={`/models/${f.slug}`} className={s.featuredImage}>
            <Image src={f.render} alt="Wireframe render of the Wonsan–Anmyeon Bridge: two diamond pylons on pile foundations, deck and 72 stay cables" fill sizes="(max-width: 900px) 100vw, 66vw" priority />
            <span className={`mono ${s.cornerTag}`}>Featured · Cable-stayed · LOD 400</span>
            <span className={`mono ${s.cornerStat}`}>1,452 meshes · 73 segments</span>
          </Link>
          <div className={s.featuredBody}>
            <p className="eyebrow" style={{ fontSize: 12 }}>
              Taean, Korea
            </p>
            <h3 className="display">{f.name}</h3>
            <p>
              Two-pylon steel–concrete composite cable-stayed bridge, 450 m long with 105 m diamond pylons. {f.summary}
            </p>
            <dl className="spec">
              <div>
                <dt>Length</dt>
                <dd>104.68 + 240 + 104.68 m</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>DWG/DXF · site photos</dd>
              </div>
              <div>
                <dt>Deliverable</dt>
                <dd>GLB · IFC4 · measurements</dd>
              </div>
              <div>
                <dt>Review</dt>
                <dd>71 of 73 segments approved</dd>
              </div>
            </dl>
            <div className={s.featuredCtas}>
              <Link href={`/models/${f.slug}`} className="btn btn--primary">
                Open in the 3D viewer <Arrow dark />
              </Link>
              <a href={SEGMENT_VIEWER_URL} className="btn btn--ghost" target="_blank" rel="noreferrer">
                Segment review viewer
              </a>
            </div>
          </div>
        </article>

        <div className="grid">
          <figure className={`card card--ground ${s.figure}`}>
            <Image src="/renders/wonsan-anmyeon-pylon.png" alt="Wireframe close-up of a diamond pylon with its pile cap and piles" width={1200} height={1500} style={{ objectPosition: "50% 30%" }} />
            <figcaption>
              <strong>Pylon PY1 in 32 parts.</strong> Lofted from the section table: outer width, void and leg depth per construction joint, 0.8 m rings.
            </figcaption>
          </figure>
          <figure className={`card card--ground ${s.figure}`}>
            <Image src="/renders/wonsan-anmyeon-side.png" alt="Side wireframe view of the bridge showing the cable fans from both pylons" width={1600} height={900} />
            <figcaption>
              <strong>72 stay cables with anchorages.</strong> Cable geometry refined over several revisions against quantity tables, installation drawings and close-up photographs.
            </figcaption>
          </figure>
          <figure className={`card card--ground ${s.figure}`}>
            <Image src="/renders/app-segment-viewer.png" alt="Segment review viewer with a list of pylon segments, elevation ranges and approval badges beside the model" width={1600} height={900} style={{ objectPosition: "0 0" }} />
            <figcaption>
              <strong>Reviewed segment by segment.</strong> Each of the 73 models carries its elevation range and approval status; section clipping shows the hollow interiors.
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
          <p className="mono">10 bridges · Korea and Indiana · every model delivered as GLB, the Wonsan–Anmyeon twin also as IFC4</p>
          <Link href="/models" className="link">
            Open the model library →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    ["Collect the source", "Drawings converted DWG to DXF, section and quantity tables, installation drawings, and close-up site photographs. UAV and LiDAR capture where drawings are missing.", "DWG · DXF · PDF · JPG · E57"],
    ["Model parametrically", "Each pylon is lofted from elevation-indexed section parameters in 0.8 m rings; deck segments, cables and anchorages follow the same rule. A drawing revision becomes a parameter change, not a remodel.", "32 pylon parts · 37 deck segments · 72 cables"],
    ["Review every segment", "A browser viewer lists all segments with elevation range and status. Wireframe, translucent approved parts and X/Y section clipping let the engineer check hollow sections against the drawings.", "71 of 73 approved"],
    ["Measure and validate", "Every segment is measured automatically: bounding box, watertightness, volume and cross-section slices with outer bounds and voids, saved as JSON beside the model.", "bbox · volume · slices · watertight"],
    ["Deliver as BIM and twin", "Semantic IFC4 export with pylons, girders, deck slab and cables, re-parsed and validated, plus GLB for the web. The inspection platform then ties damage records to the elements.", "IFC4 · GLB · inspection twin"],
  ];
  return (
    <section id="how" className="section motif--ticks">
      <div className="container section__inner" style={{ gap: 56 }}>
        <div className="section__head">
          <div className="section__title">
            <p className="eyebrow">How it works</p>
            <h2 className="display">From drawings and photos to a reviewed, measured BIM twin.</h2>
          </div>
          <p className="section__lede">The pipeline we ran on the Wonsan–Anmyeon Bridge. Each step leaves a file you can open: a parameter table, a viewer, a measurement JSON, an IFC.</p>
        </div>
        <ol className={s.steps}>
          {steps.map(([title, body, tag], i) => (
            <li key={title} className={s.step}>
              <span className="mono">{i + 1}.0 {["Collect", "Model", "Review", "Measure", "Deliver"][i]}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <span className="mono">{tag}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Software() {
  return (
    <section id="software" className="section motif--spotlight">
      <div className="container section__inner">
        <div className="section__head">
          <div className="section__title">
            <p className="eyebrow">Software</p>
            <h2 className="display">The twin is a working tool, not a render.</h2>
          </div>
          <p className="section__lede">Bridge visual inspection platform built on the Wonsan–Anmyeon twin. Inspectors log damage on the 3D model; the system scores the structure.</p>
        </div>
        <article className={`card card--ground ${s.softwareMain}`}>
          <a href={APP_URL} target="_blank" rel="noreferrer">
            <Image src="/renders/app-mbi-3dview.png" alt="Inspection platform 3D view: a member tree on the left and the cable-stayed bridge model with a condition heatmap toggle" width={1600} height={900} />
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
              <Image src="/renders/app-mbi-inspection.png" alt="Inspection platform dashboard with a safety grade card, converted defect score and grade distribution" width={1600} height={900} />
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
          Screens shown from the Korean build. English version:{" "}
          <a href={APP_URL} className="link" target="_blank" rel="noreferrer">
            wonsan-webapp-en.vercel.app
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
    <section id="capabilities" className="section section--surface">
      <PointField />
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
    <section id="industries" className="section">
      <Contours />
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
    <section id="proof" className="section section--surface">
      <Arcs />
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
    <section id="contact" className="section">
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
    <footer id="about" className={s.footer}>
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
