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
  components/
    annotations.css       sticky notes, tape, pins, paperclips, folded corners,
                          marker highlight, crossed-out text
    cards.css              KPI cards, current/future compare blocks, decision &
                          recommendation cards, callouts, quotes, badges
    matrix.css              generic 2x2 (SWOT/decision/priority) + risk heatmap
    canvas.css              workshop canvas / brainstorm board, Business Model Canvas
    flow.css                process flow, roadmap/timeline, customer journey,
                          value stream, swimlanes
    architecture.css       AI hub (hub & spoke), architecture sketch, wireframe
                          dashboard
    tables-charts.css      tables, chart-card, progress bars
    meeting.css             slide header/hero, executive summary, meeting notes,
                          action items/next steps, footer/pagination
js/
  sketch.js               hand-drawn SVG primitive engine (jittered lines, rects,
                          ellipses, arrows) — powers every [data-sketch] element
  charts.js               SVG donut/bar/line renderer, driven by data-chart-config
  theme.js                dark/light + He/En(RTL/LTR) toggle, localStorage-persisted
  reveal.js               IntersectionObserver scroll-reveal, KPI count-up,
                          progress-bar fill, triggers Sketch.animateDraw()
icons/
  sprite.svg              40 stroke-based icons (canonical source — see note below)
templates/                7 ready-to-copy composed slides
docs/README.md            this file
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

## Handwriting is not for body copy

`--font-hand` (Caveat) is reserved for: sticky notes, marker callouts,
handwritten labels, and marginalia. It is **never** used for body paragraphs,
tables, or KPI values — those stay in the professional sans/serif pair
(`--font-body`, `--font-display`). This is the line between "executive
workshop notebook" and "comic sans slide," and it's enforced by which CSS
classes you reach for (`.hand`, `.sticky-note__*`) — never apply `.hand` to
a `<p>` of real body text.

Hebrew has no equivalent consultant-grade cursive webfont, so
`[lang='he'] .hand` falls back to an italicized body cut rather than a
childish script — see `css/base.css`.

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
they carry meaning. Use your browser's Print → Save as PDF on any template
or the showcase.

## Slides are fluid, not a fixed transform-scaled canvas

`.slide` uses `max-width: var(--slide-w)` + `aspect-ratio: 16/9` rather than a
literal `1920px` canvas with a JS `transform: scale()` letterboxing layer.
This keeps the system a normal responsive web page (and means `<iframe>`
embedding "just works"). The type scale uses `clamp()` with viewport units so
text still scales reasonably across window sizes. If you need pixel-exact
PowerPoint-style scaling for a kiosk/projector deployment, that's the one
intentional gap — add a `ResizeObserver`-driven `transform: scale()` wrapper
around `.slide` rather than fighting the fluid layout.

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
