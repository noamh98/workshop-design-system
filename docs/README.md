# Workshop Design System

A dependency-free HTML/CSS/vanilla-JS component system for executive strategy
decks — AI, SAP, Power BI, government, insurance, transportation, banking,
healthcare, cyber, and executive reporting. The visual language is "the
notebook of a senior consultant mid-workshop": paper textures, a hand-sketched
annotation layer, and a fixed ink convention — deliberately not a generic
SaaS dashboard template, and deliberately not comic/cartoon.

No Bootstrap, Tailwind, React, Vue. SVG icons only. RTL + LTR (Hebrew +
English). Dark + light themes. Print-ready (one slide per page).

## Quick start

Open [`index.html`](../index.html) — it's the showcase and living documentation.
Copy any file from [`templates/`](../templates/) as the starting point for a
real deck; each is a self-contained `1920x1080` `.slide`.

No build step. No server required — everything works over `file://` (icons
are inlined per-page rather than loaded via cross-file `<use>`, which some
browsers block under `file://`).

**Reviewing or checking the output?** Step-by-step walkthroughs of how to
render every template (light + dark, LTR + RTL), what to look for in each, the
print/PDF and kiosk-scaling checks, and how to capture headless screenshots:

- [`docs/REVIEW-GUIDE.md`](REVIEW-GUIDE.md) — English (Markdown)
- [`docs/REVIEW-GUIDE.he.md`](REVIEW-GUIDE.he.md) — עברית (Markdown)
- [`docs/review-guide.html`](review-guide.html) — עברית, a rich styled page
  you can open directly over `file://` (light/dark toggle, printable,
  interactive checklist)

**Building a new deck with an AI agent (Claude, Copilot, or anything
else)?** Tool-agnostic instructions — what files the agent needs, a
copy-paste prompt, and the hard rules that don't change between tools:

- [`docs/NEW-PRESENTATION-GUIDE.md`](NEW-PRESENTATION-GUIDE.md) — English
- [`docs/NEW-PRESENTATION-GUIDE.he.md`](NEW-PRESENTATION-GUIDE.he.md) — עברית

## Folder structure

```
css/
  tokens.css              design tokens: color (light+dark), type scale, spacing,
                          radius, shadow, motion, ink system, sketch/paper vars
  base.css                reset, typography defaults, focus states, .slide canvas
  rtl.css                 logical-property utilities, RTL mirroring rules
  print.css               one-slide-per-page print rules
  paper-textures.css      .paper-dot-grid / -notebook / -whiteboard / -kraft /
                          -corkboard / -blueprint background surfaces
  ink-system.css          [data-ink] attribute -> --_ink/--_ink-soft, .ink-* utilities
  animations.css          fade/slide/draw/marker/glow/paper-reveal/sticky-drop
  style-sketchbook.css    opt-in .style-sketchbook mode: hand-print typography
                          everywhere (see "Opt-in sketchbook style" below)
  fonts-sketch.css        self-hosted 'Workshop Sketch' @font-face pair for
                          .style-sketchbook (Latin+Hebrew, unicode-range split)
  components/
    annotations.css       sticky notes, tape, pins, paperclips, folded corners,
                          marker highlight, crossed-out text
    cards.css             KPI cards, current/future compare blocks, decision &
                          recommendation cards, callouts, quotes, badges
    matrix.css            generic 2x2 (SWOT/decision/priority) + risk heatmap
    canvas.css            workshop canvas / brainstorm board, Business Model Canvas
    flow.css              process flow, roadmap/timeline, customer journey,
                          value stream, swimlanes
    architecture.css      AI hub (hub & spoke), architecture sketch, wireframe
                          dashboard
    tables-charts.css     tables, chart-card, progress bars
    meeting.css           slide header/hero, executive summary, meeting notes,
                          action items/next steps, footer/pagination
js/
  sketch.js               hand-drawn SVG primitive engine (jittered lines, rects,
                          ellipses, arrows) — powers every [data-sketch] element
  charts.js               SVG donut/bar/line renderer, driven by data-chart-config
  theme.js                dark/light + He/En(RTL/LTR) toggle, localStorage-persisted
  reveal.js               IntersectionObserver scroll-reveal, KPI count-up,
                          progress-bar fill, triggers Sketch.animateDraw()
  scale.js                opt-in ResizeObserver transform:scale() fit for
                          kiosk/projector decks (see "Kiosk / projector scaling")
icons/
  sprite.svg              40 stroke-based icons + sketchbook duotone/hatch
                          variants (canonical source — see note below)
fonts/                    self-hosted Excalifont (Latin) + Playpen Sans Hebrew
                          for .style-sketchbook, with OFL license files —
                          see fonts/README.md
templates/                ready-to-copy composed slides, incl. customer-journey,
                          value-stream, swimlanes, priority-matrix, and the
                          sketch-dashboard style demo; *.he.html are the mixed
                          Hebrew/English (RTL) counterparts
docs/
  README.md               this file
  REVIEW-GUIDE.md         how to render & visually verify the system (English)
  REVIEW-GUIDE.he.md      how to render & visually verify the system (Hebrew)
  review-guide.html       rich styled Hebrew review guide (open over file://)
  reference/              design reference imagery (e.g. sketch-dashboard-reference.png)
```

## The ink system (read this before building a deck)

Every workshop artifact uses a **fixed** six-color convention. Never remap
these between slides — the room learns the code once (put the legend on the
title slide, see `.ink-legend`) and then reads it silently for the rest of the
deck.

| Ink | Meaning | CSS |
|---|---|---|
| Black | Titles, structure, neutral | `--ink-black` |
| Blue | Ideas, future state, "next" | `--ink-blue` |
| Red | Problems, current-state pain, blockers | `--ink-red` |
| Green | Solutions, validated, done | `--ink-green` |
| Orange | Risks, watch-outs, in-progress | `--ink-orange` |
| Purple | AI / automation / intelligence | `--ink-purple` |

Apply it with `data-ink="blue"` on any card/quadrant/callout — this sets
`--_ink` and `--_ink-soft` which every component consumes. Both light and
dark theme have tuned values for all six inks, so switching themes never
requires touching markup.

**Never** declare a bare `--_ink`/`--_ink-soft` default on a component class
outside `css/ink-system.css`: it ties `[data-ink="x"]` on specificity, and any
later-loading component stylesheet then silently clobbers the attribute. Always
*consume* with a fallback instead — `var(--_ink, var(--ink-black))` — so a
component still renders when no `[data-ink]` ancestor is present. (Setting
`--_ink` inline via `style="--_ink:…"` or through `data-ink` on an element is
fine — the rule is only about bare defaults on a class selector.)

## Handwriting is not for body copy (default style)

`--font-hand` (Caveat) is reserved for: sticky notes, marker callouts,
handwritten labels, and marginalia. It is **never** used for body paragraphs,
tables, or KPI values in the default style — those stay in the professional
sans/serif pair (`--font-body`, `--font-display`). This is the line between
"executive workshop notebook" and "comic sans slide," and it's enforced by
which CSS classes you reach for (`.hand`, `.sticky-note__*`) — never apply
`.hand` to a `<p>` of real body text.

Hebrew has no equivalent consultant-grade cursive webfont, so
`[lang='he'] .hand` falls back to an italicized body cut rather than a
childish script — see `css/base.css`.

The **one** documented exception to this rule is the opt-in sketchbook style,
below.

## Opt-in sketchbook style — `.style-sketchbook`

`css/style-sketchbook.css` defines a single opt-in mode, applied by adding
`class="style-sketchbook"` to a `.slide` (or a wrapper). It replicates the
hand-drawn dashboard in `docs/reference/sketch-dashboard-reference.png` —
**all** slide typography, the paper/frame surface, box borders, and KPI
icons are hand-drawn, not just the annotation layer. This is a deliberate,
scoped relaxation of the "handwriting is not for body copy" rule; it applies
*only* under `.style-sketchbook`, and the default style is unchanged
(verified by re-screenshotting non-sketchbook templates — pixel-identical).

**Fonts — self-hosted, offline-safe.** `css/fonts-sketch.css` (linked
*before* `style-sketchbook.css`) defines one composite family, `'Workshop
Sketch'`, from two physical files in `fonts/`, split by `unicode-range` so a
single mixed Hebrew/English line (e.g. `ניהול תאונות דרכים — Real-time AI
Platform`) picks the right face per glyph automatically:

- Latin/digits/punctuation: **Excalifont**, the actual Excalidraw hand-print
  font (`fonts/Excalifont-Regular.woff2`, OFL).
- Hebrew: **Playpen Sans Hebrew** (`fonts/PlaypenSansHebrew.woff2`, OFL),
  chosen by rendering three Google-Fonts candidates side-by-side against
  Excalifont and picking the closest bounce/weight match — see
  `fonts/README.md` for the comparison and why the other two lost.

No CDN, no network requests — everything resolves via relative paths under
`fonts/`, verified with a fully offline headless render (byte-identical to
the online render).

**Surface.** `.style-sketchbook` itself (the `.slide` element, so it
survives print/export) is the near-black charcoal stage from the reference;
`.sketch-dash` inside it is the inset, rounded ivory paper with a pure-CSS
speckle grain (layered `radial-gradient` dots, no raster asset) plus the
existing `.paper-grain` fiber overlay. Print drops the charcoal frame back
to flat paper (`css/print.css` philosophy: no chrome, ink-economical).

**Hand strokes.** Card borders, the flow-diagram circles, and the arrows
between them are real jittered SVG strokes from `js/sketch.js`
(`data-sketch="box"` / `"circle"` / `"arrow-h"`), not CSS borders — the CSS
border is only a `file://`-safe fallback for the instant before JS runs,
and retracts once the host is marked `[data-sketch-drawn]`. `roughRect`
takes an optional `data-sketch-passes="2"` for the reference's occasional
double-pass redraw look; `roughEllipse` threads jittered points through
smooth quadratic curves (not straight facets) so small circles stay round.
Small corner-doodle SVGs and the purple AI chip (with pin/circuit tails) are
positioned with logical inset properties so they mirror automatically under
`dir="rtl"`.

**KPI icons.** The four KPI icons (`icon-car-fill`, `icon-folder-fill`,
`icon-clock-fill`, `icon-warning-fill` in `icons/sprite.svg`, the canonical
source) carry a marker-fill layer under the existing 24x24 stroke: a 45°
hatch `<pattern>` for car/folder/clock, a flat low-opacity fill for the
warning triangle (hatch read noisy at that size). Colored via the
`ink-red`/`ink-blue`/`ink-green` utility classes, never a hardcoded hex.
**Note if you copy these into a new page:** the hatch `<pattern>` defs must
live in their own non-`display:none` SVG root — Chromium does not resolve a
`<pattern>` paint server referenced from inside a `display:none` tree, even
though `<symbol>`/`<use>` tolerates it fine. See the comment at the top of
`icons/sprite.svg`.

Everything still consumes the existing tokens and the six inks — no new
colors, no seventh ink. KPI deltas default to the card's ink but a nested
`data-ink` override (custom-property scoping, not a selector fight) lets a
semantically-bad rise on an otherwise-positive-colored card render red
(e.g. "+15%" high-risk events on the orange card) — see the KPI markup in
`templates/sketch-dashboard.html`.

Demos: `templates/sketch-dashboard.html` (English) and
`templates/sketch-dashboard.he.html` (mixed Hebrew/English, RTL). The
reference uses a yellow for its "medium" risk slice; since yellow is outside
the six-ink palette, the risk donut maps High=red / Medium=orange / Low=green
instead — a documented, intentional deviation from the image.

## Hebrew / mixed he-en variants

Real decks in this system are mostly Hebrew with embedded English technical
terms (product names, `AI`, `Excel`, `Power BI`, `Real-time`, `SAP`, KPI
units). Several templates ship a `NAME.he.html` counterpart next to the
original (`<html lang="he" dir="rtl">`, `lang`/`dir` also on `.slide`):
`executive-summary.he.html`, `meeting-actions.he.html`,
`priority-matrix.he.html`, `sketch-dashboard.he.html`. These are **mixed**
he/en content, not laboratory-pure Hebrew — the user's actual usage. Numbers,
dates, and English runs that must stay LTR inside RTL text are wrapped in
`<bdi class="tabular">` / `.ltr-embed` so bidi stays clean (no jumbled
`בעיה ב-Excel files` runs). `sketch.js` arrow-h auto-flips under `dir="rtl"`,
and `.hand` uses the Hebrew fallback (no Caveat rendering Hebrew).

## The hand-drawn layer — `data-sketch`

Any element with `data-sketch="<type>"` gets a jittered SVG stroke drawn into
it by `js/sketch.js` on load, resize, and font-load. Types:

- `underline` — sketchy single-stroke underline (e.g. under a subtitle)
- `highlight` — translucent marker swipe behind text (auto-layered *behind*
  the glyphs via `z-index: -1`)
- `circle` — hand-drawn ellipse hugging the element (word/number emphasis)
- `box` — hand-drawn rectangle border
- `arrow-h` / `arrow-v` — jittered arrow filling the element's own box,
  auto-flips direction under `dir="rtl"`
- `cross` — strike-through for a rejected/superseded idea (drawn *above* the
  text via `z-index: 2`)

Randomness is seeded per-element (`data-sketch-seed` or DOM position), so a
given element wobbles the same way on every reload — organic, not flickering.

Reveal-on-scroll can make a stroke "draw itself in": wrap the host in
`data-animate="paper-reveal"` (or any `[data-animate]` value) and
`js/reveal.js` calls `Sketch.animateDraw()` automatically when it scrolls
into view.

## Charts — `data-chart`

`js/charts.js` renders `donut`, `bar`, and `line` charts from a JSON config
in `data-chart-config`, no library:

```html
<div data-chart="donut"
     data-chart-config='{"segments":[{"value":23,"color":"var(--ink-red)"},
                                      {"value":47,"color":"var(--ink-blue)"}],
                         "centerValue":"342","centerLabel":"cases"}'
     style="width:120px;height:120px;"></div>
```

Line charts accept `"rough": true` for a hand-sketched wobble and `"area":
true` for a soft fill under the curve.

## Theme, language, and direction

`js/theme.js` toggles `data-theme="dark|light"` and `lang="he|en"` +
`dir="rtl|ltr"` on `<html>`, persisted to `localStorage`. Wire any button with
`data-theme-toggle` / `data-lang-toggle` — no other JS needed. Language drives
direction (Hebrew → RTL) and swaps the font stack (`--font-display`,
`--font-body`, `--font-hand`) via the `[lang]` selectors in `tokens.css`.

**Never** hardcode `margin-left`/`text-align: left` in a component — use the
logical utilities in `rtl.css` (`.text-start`, `.ms-auto`, etc.) or native
logical CSS properties. Numbers/dates that must stay LTR inside RTL text use
`.tabular` / `.ltr-embed`.

## Icons

`icons/sprite.svg` is the canonical 40-icon set (stroke-based, 24x24 grid,
`stroke-width: 1.75`, round caps/joins, `fill: none`) — read it if you're
adding an icon or serving this system over `http://` (where cross-file
`<use href="icons/sprite.svg#icon-x">` works fine). Every shipped page
instead **inlines** the subset of symbols it needs directly after `<body>`,
because Chrome blocks external SVG `<use>` fetches under `file://`. If you
add a new page, copy the `<symbol>` defs you need from `icons/sprite.svg`
into an inline `<svg style="display:none">` block, then reference them with
a same-document `<use href="#icon-name"/>`.

Directional icons (arrows, chevrons) get `.icon-directional` so they mirror
under `dir="rtl"`.

## Print

`css/print.css` forces one `.slide` per printed page at `1920x1080`, strips
toolbars/nav/animation, and keeps ink colors (`print-color-adjust: exact`) since
they carry meaning. `print-color-adjust` is inherited, so it's set on
`html, body` (and echoed on the surfaces as belt-and-suspenders); atomic cards
carry `break-inside: avoid`. Use your browser's Print → Save as PDF on any
template or the showcase.

## Kiosk / projector scaling — `js/scale.js`

`.slide` is deliberately fluid: `max-width: var(--slide-w)` + `aspect-ratio:
16/9` rather than a literal `1920px` canvas with a JS `transform: scale()`
letterboxing layer. This keeps the system a normal responsive web page (so
`<iframe>` embedding "just works"), and the type scale uses `clamp()` with
viewport units so text scales reasonably across window sizes. Fluid is the
default and needs no JS.

When you *do* need pixel-exact PowerPoint-style scaling — a kiosk or projector
showing one deck full-screen — opt in with `js/scale.js` instead of fighting
the fluid layout. Add `data-scale-to-fit` to a `.slide` (or wrap it in a
`.slide-scaler`) and include `<script src="js/scale.js"></script>` after the
other scripts. It applies `scale = min(vw/1920, vh/1080)` with
`transform-origin: top center` via a `ResizeObserver` on the *parent* (not the
scaled node, to avoid a feedback loop), clamps to ≤1 by default (opt out with
`data-scale-max`), honours `prefers-reduced-motion`, and overrides the base
size with `data-scale-base="W,H"`. It's a no-op when the attribute is absent,
so it never affects the fluid pages. See `templates/kiosk-scaled.html` for a
wired demo; `window.WorkshopScale.{refresh,apply}` are exposed for manual
re-fit.

## Accessibility notes

- Focus: `:focus-visible` draws `--shadow-focus` (`css/base.css`); verify it
  stays visible on toolbar buttons in both themes.
- Reduced motion: `[data-animate]` only hides (`opacity:0`) inside
  `@media (prefers-reduced-motion: no-preference)`, and the `print,
  (prefers-reduced-motion: reduce)` block forces everything visible — content
  is never stuck transparent.
- Contrast: inks and neutrals were run through a WCAG 2.1 matrix against every
  paper surface. Kraft and corkboard pin an explicit dark ink in light theme
  and a dark substrate + light ink in dark theme (corkboard previously
  inherited `--color-ink`, which flipped light over its tan surface in dark
  theme — the same bug class already fixed for `.paper-blueprint`). Kraft and
  corkboard are sticky-note *substrates*: real content rides on notes with
  their own fills, so raw colored-ink-directly-on-substrate remains a
  documented decorative combination, not body text. `--color-ink-muted` and
  orange clear 3:1 (large text / non-text UI) but not 4.5:1 — keep them for
  large or decorative use, not small body copy.

## Extending the system

1. New component → new file in `css/components/`, linked from the pages that
   need it (don't bundle everything into one stylesheet — pages should only
   load what they use).
2. New ink meaning → don't add a 7th color. Compose existing inks (e.g. a
   "blocked-by-risk" state is a red `workshop-box` with an orange badge)
   before inventing a new semantic color.
3. New icon → follow the existing 24x24 grid / `stroke-width: 1.75` /
   round-cap convention in `icons/sprite.svg`, then inline it into any page
   that uses it (see Icons section above).
4. New animation → add the keyframe/transition to `animations.css` behind
   `@media (prefers-reduced-motion: no-preference)`, and make sure
   `print.css` / the reduced-motion block turns it off.
