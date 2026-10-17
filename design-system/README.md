# QBTTEXAS Design System v1.0

The tokens, type, motifs and components behind the QBTTEXAS website (qbttexas.netlify.app).

| File | What it is |
|---|---|
| `index.html` | The style guide. Open it in a browser (needs internet for Google Fonts). |
| `tokens/qbttexas.tokens.json` | Design tokens in the W3C Design Tokens format: colour, fonts, type styles, spacing, layout, radii, borders, sizes, motion, motifs. Import into Figma (Tokens Studio), Style Dictionary, etc. |
| `css/tokens.css` | The same tokens as CSS custom properties on `:root`. |
| `css/components.css` | Buttons, cards, section layout, drafting-grid motif, spec lists, steps, viewer controls, grade tags, inputs. |
| `assets/logo-mark.svg` | The isometric cube mark (ink on transparent). |
| `assets/logo-lockup.svg` | Mark + QBTTEXAS wordmark (Anton). |

## Fonts

Google Fonts, loaded with one link tag:

```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Anton** 400 for headlines and the wordmark
- **Montserrat** 400/500/600/700 for body and UI
- **IBM Plex Mono** 400/500 for eyebrows, labels and readouts

## Using it in a page

```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/components.css">

<section class="section motif--drafting">
  <div class="container section__inner">
    <div class="section__head">
      <div class="section__title">
        <p class="eyebrow">Work</p>
        <h2 class="display h2">Bridges, modeled from drawings and the field.</h2>
      </div>
      <p class="section__lede">Ten bridges modeled to date.</p>
    </div>
    <a class="btn btn--primary" href="#">3D demo</a>
  </div>
</section>
```

Alternate `motif--drafting` and `motif--drafting motif--drafting-surface` from section to section. The wire mesh and the radial `hero` gradient belong to the hero only.

## Principles

1. Navy ground, warm off-white ink, one cyan wire reserved for the hero.
2. Every section below the hero sits on the same hairline drafting grid.
3. Numbers an engineer can check: spans, mesh counts, approvals, tolerances.
4. Models are shown shaded first; wireframe and point cloud are modes.
5. Projects are described by type and scale, never by client name.
