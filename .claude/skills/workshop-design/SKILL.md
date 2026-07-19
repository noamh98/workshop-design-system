---
name: workshop-design
description: Build executive workshop slides/decks in the hand-sketched "consultant notebook" Workshop Design System (Hebrew RTL + English, six-ink convention, sketchbook mode, standalone HTML export). Use for any presentation, dashboard, slide, deck, mock, or briefing "in this style" / "like sketch-dashboard" / "workshop design".
user-invocable: true
---

# Workshop Design System — Skill

Dependency-free HTML/CSS/vanilla-JS design system for executive strategy decks.
Visual language: "the notebook of a senior consultant mid-workshop" — paper
textures, hand-sketched annotation layer, fixed ink convention. NOT a generic
SaaS dashboard, NOT comic/cartoon.

## Where the assets live

1. Local: `c:\PROJECTS\Workshop Design System-handoff\project\`
2. Remote: https://github.com/noamh98/workshop-design-system (branch `main`, folder `project/`)

If neither is available, clone the repo. Never regenerate assets from memory —
always copy the real files.

## Asset map (under `project/`)

| Path | What |
|---|---|
| `css/tokens.css` | ALL design tokens: light+dark colors, type scale, spacing, radius, shadow, motion, ink vars, paper vars |
| `css/base.css` | reset, typography, focus states, `.slide` canvas (1920x1080, fluid `aspect-ratio:16/9`) |
| `css/rtl.css` | logical-property utilities, RTL mirroring |
| `css/print.css` | one-slide-per-page print, `print-color-adjust: exact` |
| `css/paper-textures.css` | `.paper-dot-grid/-notebook/-whiteboard/-kraft/-corkboard/-blueprint` |
| `css/ink-system.css` | `[data-ink]` → `--_ink`/`--_ink-soft`, `.ink-*` utilities |
| `css/animations.css` | fade/slide/draw/marker/glow/paper-reveal/sticky-drop |
| `css/style-sketchbook.css` | opt-in `.style-sketchbook` hand-drawn mode (charcoal stage + ivory paper) |
| `css/fonts-sketch.css` | `'Workshop Sketch'` @font-face: Excalifont (Latin) + Playpen Sans Hebrew, unicode-range split |
| `css/components/*.css` | annotations, cards, matrix, canvas, flow, architecture, tables-charts, meeting |
| `js/sketch.js` | jittered SVG strokes for every `[data-sketch]` element |
| `js/charts.js` | SVG donut/bar/line from `data-chart-config` JSON |
| `js/theme.js` | dark/light + he/en (RTL/LTR) toggles, localStorage |
| `js/reveal.js` | scroll-reveal, KPI count-up, triggers `Sketch.animateDraw()` |
| `js/scale.js` | opt-in kiosk `transform:scale()` fit via `data-scale-to-fit` |
| `fonts/*.woff2` | self-hosted Excalifont + Playpen Sans Hebrew (+ IBM Plex Mono), OFL |
| `icons/sprite.svg` | canonical 40-icon set, 24x24, stroke 1.75, round caps |
| `templates/` | ready slides to copy: sketch-dashboard (en+he), finetracker-briefing (he, incl. `_standalone-src.html`) |
| `guidelines/*.card.html` | visual spec cards: colors, type, spacing, strokes, charts, textures, icons |
| `docs/README.md` | full system documentation — read it before a non-trivial build |

## Hard rules (never break)

1. **Six-ink semantic convention, fixed across the whole deck:**

   | Ink | Meaning | Token |
   |---|---|---|
   | Black | titles, structure, neutral | `--ink-black` |
   | Blue | ideas, future state, "next" | `--ink-blue` |
   | Red | problems, current pain, blockers | `--ink-red` |
   | Green | solutions, validated, done | `--ink-green` |
   | Orange | risks, watch-outs, in-progress | `--ink-orange` |
   | Purple | AI / automation / intelligence | `--ink-purple` |

   Apply with `data-ink="blue"` on a card/quadrant/callout. Never remap
   between slides. Never invent a 7th color — compose existing inks.
2. **No emoji. No gradients (decorative). SVG icons only** — copy `<symbol>`
   defs from `icons/sprite.svg` into an inline `<svg style="display:none">`
   block and use same-document `<use href="#icon-x"/>` (external `<use>`
   breaks over `file://`).
3. **Hebrew is RTL**: `<html lang="he" dir="rtl">`, `lang`/`dir` echoed on
   `.slide`. Latin terms/numbers inside RTL text wrapped in
   `<bdi class="tabular">` / `.ltr-embed`. Only logical CSS properties
   (`margin-inline-start`, `.text-start`) — never `margin-left`/`text-align:left`.
4. **Hand-print font only inside `.style-sketchbook`.** Default style keeps
   `--font-hand` (Caveat) for sticky notes/marker callouts/marginalia only —
   never body paragraphs, tables, or KPI values.
5. **Never declare bare `--_ink`/`--_ink-soft` defaults on a component class**
   outside `ink-system.css` — consume with fallback:
   `var(--_ink, var(--ink-black))`.
6. Fonts self-hosted, no CDN. Everything must work over `file://`.

## Two visual modes

- **Default** — professional paper surfaces + hand-drawn *annotation* layer.
- **Sketchbook** (`class="style-sketchbook"` on `.slide`) — everything
  hand-drawn: 'Workshop Sketch' typography everywhere, near-black charcoal
  stage, inset ivory paper with CSS speckle grain, real jittered SVG borders
  (e.g. `data-sketch="box"`), marker-fill KPI icons. Load
  `fonts-sketch.css` BEFORE `style-sketchbook.css`. Demo:
  `templates/sketch-dashboard/`.

## Key APIs

- `data-sketch="box|circle|loop|underline|underline-double|underline-wavy|highlight|scribble|cross|strike-diag|bracket|star|arrow-h|arrow-v|arrow-curve"` —
  jittered stroke drawn by `sketch.js`; seeded per element (stable wobble);
  `arrow-h` auto-flips under RTL; `data-sketch-passes="2"` for double-pass.
- Charts: `data-chart="donut|bar|bar-h|stacked-bar|line|scatter|gantt|waterfall"` +
  `data-chart-config='{"segments":[{"value":23,"color":"var(--ink-red)"}],"centerValue":"342"}'`;
  line accepts `"rough":true`, `"area":true`.
- Reveal: wrap in `data-animate="paper-reveal"` (respects reduced-motion).
- Theme/lang toggles: buttons with `data-theme-toggle` / `data-lang-toggle`.
- Kiosk scaling: `data-scale-to-fit` + `js/scale.js`.

## Workflow for a new slide/deck

1. Read `project/docs/README.md` (full spec) if not already.
2. Pick the closest template in `project/templates/` and copy it — never
   start from a blank file.
3. Copy the CSS/JS/font files the page actually uses (pages load only what
   they use — don't bundle everything).
4. Put the ink legend (`.ink-legend`) on the title slide.
5. Verify: light+dark themes, RTL bidi cleanliness, `file://` open, print
   preview (one slide per page), reduced-motion.

## Standalone (single-file) export

For "send one HTML file" requests: inline all CSS into `<style>`, inline used
icon symbols, inline JS into `<script>`, base64-embed the woff2 fonts into the
@font-face rules. Reference implementations:
`project/templates/finetracker-briefing/_standalone-src.html` and (on branch
`old-main`) `scripts/bundle-standalone.py` +
`templates/finetracker-briefing.he.standalone.html`.

## Accessibility floor

`:focus-visible` visible in both themes; `[data-animate]` never leaves content
stuck transparent (reduced-motion + print force visible); ink/neutral contrast
already WCAG-checked — orange and `--color-ink-muted` are large-text/decorative
only, not small body copy.
