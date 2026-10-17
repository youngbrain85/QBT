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
          <Link key={a} href="/#software" className={s.service}>
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
          <h3 className="display">Bridges in Indiana State</h3>
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
          <Link href="/models" className="link">
            Open the model library →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const measure: [string, string, string] = ["Measure and validate", "Every segment is measured automatically and saved beside the model.", "bbox · volume · slices"];
  const deliver: [string, string, string] = ["Deliver as BIM and twin", "IFC4 for BIM, GLB for the web, ready for inspection records.", "IFC4 · GLB"];
  const methods: MethodSteps[] = [
    {
      method: "scan",
      label: "Method A",
      title: "Capture the field",
      steps: [
        ["Collect the source", "UAV flights, LiDAR scans and site photographs of the structure.", "E57 · LAS · JPG"],
        ["Model from the cloud", "The point cloud is meshed, aligned and fitted to parametric elements.", "240k points"],
        ["Review every segment", "Every segment is checked against the scan in the browser.", "73 segments"],
        measure,
        deliver,
      ],
    },
    {
      method: "drawing",
      label: "Method B",
      title: "AI agent, from 2D drawings",
      steps: [
        ["Read the drawings", "An AI agent turns the DWG/DXF sheets into model parameters.", "DWG → DXF"],
        ["Model from parameters", "The agent builds pylons, deck and cables from those parameters.", "parametric"],
        ["Verify with site photos", "Site photographs are matched to the model until the twin agrees with the field.", "±8 mm"],
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
            <h2 className="display">AI-Powered Bridge Inspection</h2>
          </div>
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
    ["Solutions", [["3D reconstruction", "/#software"], ["Digital twins", "/#software"], ["BIM export", "/#software"], ["3D viewer", "/models"]]],
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
