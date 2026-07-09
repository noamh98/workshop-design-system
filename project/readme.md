# Workshop Design System

"The notebook of a senior consultant mid-workshop": paper textures, a hand-sketched annotation layer, a fixed six-ink marker convention, and (opt-in) hand-print typography. For executive strategy decks and dashboards — AI, government, insurance, transportation, banking, healthcare. Deliberately NOT a generic SaaS dashboard template, and deliberately not comic/cartoon.

Dependency-free HTML/CSS/vanilla-JS. RTL + LTR (Hebrew + English). Dark + light themes. Print-ready.

**Source repo:** https://github.com/noamh98/workshop-design-system — explore it for the full docs (`docs/README.md`, `docs/NEW-PRESENTATION-GUIDE.md`, review guides in Hebrew + English) and the complete template set. A copy of its main README is at `docs/README.md` here.

## Index

- `styles.css` — global CSS entry point (imports everything below)
- `css/tokens.css` — all design tokens: colors (light+dark), type, spacing, radius, shadow, motion, ink system, sketch/paper vars
- `css/base.css`, `css/rtl.css`, `css/print.css` — reset, `.slide` canvas (1920×1080, 16:9), RTL mirroring, print
- `css/paper-textures.css` — dot-grid / notebook / whiteboard / kraft / corkboard / blueprint surfaces
- `css/ink-system.css` — `data-ink="black|blue|red|green|orange|purple"` semantic coloring
- `css/style-sketchbook.css` + `css/fonts-sketch.css` — opt-in `.style-sketchbook` hand-print mode ('Workshop Sketch' composite font: Excalifont Latin + Playpen Sans Hebrew)
- `css/components/` — annotations (stickies, tape, highlights), cards (KPI, compare, callouts), matrix (2×2, heatmap), canvas, flow (process/roadmap/journey/swimlanes), architecture, tables-charts, meeting
- `js/sketch.js` — hand-drawn SVG engine: `data-sketch="underline|highlight|circle|box|arrow-h|arrow-v|cross"` (seeded jitter, stable across renders)
- `js/charts.js` — rough SVG donut/bar/line via `data-chart` + `data-chart-config`
- `js/theme.js` — dark/light + He/En toggles; `js/reveal.js` — scroll reveal; `js/scale.js` — kiosk scaling
- `icons/sprite.svg` — stroke icon set + hatch-fill duotone variants
- `fonts/` — self-hosted Excalifont + Playpen Sans Hebrew (both OFL)
- `templates/sketch-dashboard/` — Hebrew RTL hand-drawn dashboard template (Design Component), replica of `docs/reference` in the repo
- `guidelines/` — specimen cards shown in the Design System tab

## Content fundamentals

- **Bilingual by design.** Hebrew is a first-class citizen: mixed He/En lines are normal ("אנליטיקה ב-Real-time", "סיווג בסיוע AI"). Latin terms (AI, Excel, Email, KPI) stay in Latin, wrapped in `<bdi>` inside RTL text.
- **Consultant shorthand, not marketing prose.** Terse noun phrases: "תהליך ידני", "חוסר נראות", "Manual process", "Lack of visibility". Lists of 5–6 items, 2–4 words each. No exclamation marks, no emoji ever.
- **Labels are uppercase-tracked** in Latin ("CURRENT SITUATION"); Hebrew labels are plain ("מצב נוכחי").
- **Numbers carry deltas + a baseline**: "1,247", "+18%", "מול חודש שעבר / vs last month". Negative-is-good deltas exist ("-1.3 ימים") — color by meaning, not sign.
- Tone: neutral, factual, decision-oriented. The room is executives; the artifact looks hand-made but reads precise.

## Visual foundations

- **Colors:** warm paper neutrals (`--color-paper` #FBFAF7 light / #14171C dark charcoal-navy), never pure white/black. One signal accent (deep blue #1B4B66), terracotta secondary. The heart is the **six-ink convention** (never remap): black=structure, blue=future/ideas, red=problems/current pain, green=solutions/done, orange=risks/in-progress, purple=AI/automation.
- **Type:** Fraunces/Frank Ruhl Libre display; Inter/Heebo body; Caveat hand (Latin annotations only). Opt-in `.style-sketchbook` sets EVERYTHING in 'Workshop Sketch' hand-print — the one documented exception.
- **Backgrounds:** paper textures (dot-grid, notebook rule, blueprint) drawn in pure CSS; sketchbook slides float ivory paper with speckle grain on a near-black #141519 charcoal stage.
- **Borders:** the hand-drawn SVG stroke IS the border (`data-sketch="box"`, jittered double-pass rects and rings, seeded so they're stable). Uneven organic border-radius as file:// fallback. Stroke width 2px, jitter amplitude `--sketch-jitter: 3.5`.
- **Corner doodles:** small decorative ink scribbles (`.sketch-doodle`) in the margins, opacity 0.55, mirrored automatically in RTL via logical insets.
- **Shadows:** subtle only (`--shadow-xs`…`--shadow-lg`); sticky notes get slight rotation (±2.2°) and lift on hover.
- **Motion:** draw-on strokes (stroke-dashoffset), fades, sticky-drop with slight overshoot; durations 100–900ms; standard easing `cubic-bezier(0.2,0,0,1)`. All gated by `prefers-reduced-motion`.
- **Hover:** sticky notes straighten + lift; otherwise interaction is minimal — these are slides.
- **Charts:** hand-rough SVG lines/donuts/bars from `js/charts.js`, colored with ink tokens; hatch-pattern fills (45° lines) instead of solid fills.
- **Layout:** fixed 1920×1080 `.slide`, 16:9, `--slide-pad: 96px`; logical properties throughout so RTL mirrors free.
- **Radii:** 4–20px scale; sketch cards use uneven hand radii like `14px 12px 15px 11px / 12px 15px 11px 14px`.
- No gradients, no glassmorphism, no emoji, no neon.

## Iconography

- **Own stroke icon set** in `icons/sprite.svg`: 24×24 grid, stroke-width ~1.75, round caps/joins, `fill:none`, colored via `currentColor`. Includes duotone "-fill" variants filled with 45° hatch `<pattern>`s (sketch-hatch-red/blue/green) for KPI cards.
- Templates **inline the sprite per page** (file:// blocks cross-file `<use>`). Reference glyphs with `<svg class="icon"><use href="#icon-name"></use></svg>`.
- No icon font, no emoji, no unicode-as-icons (except ● legend dots).

## Fonts

Self-hosted: Excalifont (Latin hand-print) + Playpen Sans Hebrew, combined as one 'Workshop Sketch' family via unicode-range; IBM Plex Mono (400/500/600, from github.com/IBM/plex, OFL) for `--font-mono`. Google-hosted at runtime: Fraunces, Inter, Heebo, Frank Ruhl Libre, Caveat.

## Intentional additions

- `templates/sketch-dashboard/` re-packages the repo's `sketch-dashboard.he.html` as a Design Component template with dark-mode + jitter tweaks.
