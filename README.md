# QBTTEXAS LLC — company website

Marketing site and 3D model viewer for QBTTEXAS LLC: AI-based 3D modeling and digital twins for bridges, buildings and plants.

Built with Next.js (App Router), TypeScript and Three.js. No CMS, no database: content lives in `src/data` and `src/components`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start
```

## What is in here

| Path | Contents |
|---|---|
| `src/app/page.tsx` | Homepage: hero with a live point-cloud scene, services, work samples, how it works, software, capabilities, industries, proof, contact |
| `src/app/models` | 3D model viewer page (`/models` and `/models/[slug]`): model library, shaded / wireframe / point-cloud modes, camera presets, section cut, click-to-measure |
| `src/components/HeroScene.tsx` | Hero animation: the Wonsan–Anmyeon Bridge GLBs are sampled into ~240k surface points coloured by elevation (LiDAR style), revealed by a scan sweep, then the BIM edges build up and inspection pins appear |
| `src/components/ModelViewer.tsx` | Three.js viewer used by the models page (meshopt-compressed GLB, EdgesGeometry wireframe, clipping plane, raycast picking) |
| `src/components/WarpedMesh.tsx` | The warped wire-grid backdrop; every section gets a different well centre and strength |
| `src/data/models.ts` | Bridge catalogue: names, locations, structure types, files |
| `public/models/wonsan` | Wonsan–Anmyeon Bridge, six measurement-based groups (pylons, deck, cables, bearings, furniture), meshopt |
| `public/models/indiana` | Nine Indiana highway bridges from INDOT plan sets, meshopt-compressed GLB |
| `public/renders` | Wireframe renders and product screenshots used on the homepage and as viewer thumbnails |

## Content placeholders

Square-bracket placeholders (`[CLIENT LOGO]`, `[EMAIL]`, `[CUSTOMER QUOTE]`, `[XX]%`) mark copy still to be supplied. The contact form posts to a `mailto:` placeholder; swap it for a form endpoint before launch.

## Deploy

The site is static-friendly and deploys as-is on Vercel or Netlify (`npm run build`). Model files total about 6 MB; serve them with long cache headers.
