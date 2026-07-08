# Execution Plan — Workshop Design System Review & Extension

> Handoff document. Written by a planning session that already read **all** of
> `css/`, `js/`, and `docs/README.md` (but NOT yet `index.html`, `templates/*`,
> or `icons/sprite.svg` — the executor must read those first). Execute the
> steps in order. Findings marked **CONFIRMED** were verified by code read;
> anything marked **VERIFY** must be checked by actually rendering.

**Branch:** `claude/workshop-design-system-review-wokpr5` — develop, commit, and
`git push -u origin claude/workshop-design-system-review-wokpr5` at the end
(and at logical milestones). **Do NOT open a PR.**

---

## Environment notes

This runs in a Linux container (not Windows). Headless Chromium is at
`/opt/pw-browsers/chromium`. Do NOT run `playwright install`.

```bash
# Screenshot (settled end-state, no mid-animation frames):
/opt/pw-browsers/chromium --headless=new --no-sandbox --disable-gpu \
  --force-prefers-reduced-motion --hide-scrollbars --virtual-time-budget=4000 \
  --screenshot=/path/out.png --window-size=1920,1250 \
  "file:///home/user/workshop-design-system/templates/FILE.html"

# Print-to-PDF:
/opt/pw-browsers/chromium --headless=new --no-sandbox --disable-gpu \
  --print-to-pdf=/path/out.pdf --no-pdf-header-footer "file:///.../FILE.html"
```

- `--virtual-time-budget` matters: `js/sketch.js` draws on DOMContentLoaded+rAF
  and `js/reveal.js` uses IntersectionObserver.
- `--force-prefers-reduced-motion` makes `[data-animate]` elements fully
  visible (`css/animations.css:89-92`) so you capture the settled state.
- Dark theme headlessly: make a scratch copy of the file with
  `data-theme="dark"` sed-ed onto `<html>` (localStorage isn't practical
  headless).
- Keep screenshots in the session scratchpad, NOT committed to the repo
  (exception: `docs/reference/` already holds the style reference image).
- Google Fonts may not load through the proxy in headless runs — if glyphs
  fall back to system fonts, note it and judge layout, not font rendering.

## Hard constraints (from CLAUDE.md + docs/README.md — never violate)

1. No frameworks, no build step, no server requirement. Everything must keep
   working by double-clicking an `.html` over `file://`.
2. Icons stay inline SVG per page — copy `<symbol>` defs from
   `icons/sprite.svg` into an inline `<svg style="display:none">` block.
   Never cross-file `<use href="icons/sprite.svg#...">` (Chrome blocks it
   under `file://`).
3. The six-ink convention is fixed: black=titles/structure, blue=ideas/future,
   red=problems/blockers, green=solutions/done, orange=risks,
   purple=AI/automation. Never remap, never add a 7th color.
4. `--font-hand` (Caveat) only for stickies/annotations/marginalia in the
   **default** style. (Step 3.5 introduces a deliberate, opt-in, documented
   exception — see below.)
5. **Never** declare a bare `--_ink`/`--_ink-soft` default on a component
   class outside `css/ink-system.css` — equal specificity + later cascade
   order silently clobbers `[data-ink]`. Consume with
   `var(--_ink, var(--ink-black))` inline instead.

---

## Step 0 — Read the rest of the code

Read fully before touching anything: `index.html` (333 lines), all 7 files in
`templates/`, `icons/sprite.svg`. Templates carry inline `--_ink` overrides
and the icon defs you'll copy from.

## Step 1 — Correctness sweep (scope item 7) — FIRST, it seeds everything else

**1a. `--_ink` redeclaration grep.**
`grep -rn -- '--_ink' css/ templates/ index.html | grep -v 'var(--_ink'` —
inspect every assignment outside `css/ink-system.css`.

- **CONFIRMED BUG:** `css/components/flow.css:57` —
  `.timeline__milestone { --_ink: var(--ink-blue); }`. Exactly the forbidden
  pattern: ties with `[data-ink='x']` on specificity, `flow.css` loads later,
  so `data-ink` on a milestone is silently clobbered to blue.
  Fix: delete the declaration; change consumers to fallbacks —
  `.timeline__dot` `background/border: var(--_ink, var(--ink-blue))`,
  `.timeline__date` `color: var(--_ink, var(--ink-blue))`.
- **Intentional — do NOT "fix":** `.swot .matrix__quadrant[data-quad=…]` in
  `css/components/canvas.css:91-94` (higher specificity, deliberate mapping).

**1b. Missing `var(--_ink)` fallbacks.** Bare `var(--_ink)` with no
`[data-ink]` ancestor resolves to invalid-at-computed-value-time. Add
fallbacks at least here (verify each; list may be incomplete):

- `css/components/matrix.css:66` (`.matrix__quadrant-title` color), `:79`
  (li::before background)
- `css/components/cards.css:40-41` (kpi-card__icon), `:76`
  (compare-block__tag bg), `:96` (list li::before), `:126`
  (decision-card__eyebrow), `:143-145` (recommendation eyebrow ::before),
  `:157` (callout__icon), `:173` (quote-block::before), `:203-205` (badge)
- `css/components/flow.css` timeline consumers (after 1a)
- Model on `css/components/tables-charts.css:81`, which already does it right.

Pick each fallback per the component's semantic default (nearby comments
document it; default `--ink-black` unless stated otherwise).

**1c. Duplicate-attribute scan** across every `.html`: small Python script in
the scratchpad — for each tag (`<[a-zA-Z][^>]*>`), extract attribute names,
flag repeats (esp. `style`, `class`, `data-*`). Browsers keep only the first
duplicate silently. Fix hits by merging attributes.

**1d. `aspect-ratio` vs fixed grid rows.**
`grep -rn 'aspect-ratio' css/ templates/ index.html` — no grid cell inside a
fixed-height `overflow:hidden` container may carry `aspect-ratio` (the
risk-heatmap bug class). `.ai-hub`'s `aspect-ratio:1` is legitimate — leave it.

**1e. Negative z-index / stacking contexts.** `js/sketch.js` already guards
(`ensureSvg` sets `z-index:0` on static hosts) — verify visually in Step 2
that flow arrows and timeline tracks actually render. Don't trust code read.

**Commit:** `fix: correctness sweep — ink cascade clobber in timeline, missing --_ink fallbacks, ...`

## Step 2 — Render everything + design/aesthetic pass (scope item 1)

Screenshot all 7 templates + `index.html` (long scroll page — capture at
`--window-size=1920,4000` or in sections), in **light and dark**. Look for:

- Invisible sketch arrows/underlines/highlights (stacking-context bug class)
- Clipped rows / overflow (heatmap bug class)
- Ink colors reverting to black (cascade bug class)
- **VERIFY — suspected real bug:** `.paper-blueprint` in **dark theme**:
  `css/paper-textures.css:23` sets `background-color: var(--color-accent-strong)`
  which flips to light `#85C0DE` in dark theme while the hardcoded text color
  stays `#EAF1F6` → near-invisible text. If confirmed, add a
  `:root[data-theme='dark'] .paper-blueprint` override (keep a dark navy
  surface, e.g. `#0F3245`) and re-check `.ai-hub__node-label` contrast on it.
- Aesthetic judgment per template: does it read as a senior consultant's
  workshop notebook? Fix anything generic: unmotivated rounded-card-plus-
  colored-border filler, emoji-as-icon, purple gradients, SVG-drawn
  "people/scenes", hand-font on body copy (default style).

**Commit** fixes; keep before/after screenshots in the scratchpad.

## Step 3 — Build the four missing templates (scope item 2)

CSS exists; no demos. Scaffold each from `templates/process-flow-roadmap.html`
(same `<head>` pattern — link only the component CSS the page needs; inline
icon `<symbol>` block right after `<body>`; `.slide` → `.slide__inner` →
`.slide-header` + content + `.slide-footer`; `js/theme.js|sketch.js|reveal.js`
at the end).

1. **`templates/customer-journey.html`** — `.journey__stages` (5-6 stages),
   `.journey__curve` with an inline SVG emotion curve
   (`.journey__curve-path`/`-fill`; hand-drawn feel — reuse `rough:true` line
   chart from `js/charts.js` or hand-author the path), `.journey__row`s for
   touchpoints / pain points / opportunities with `.journey__row-label`.
   Inks: red pain row, blue opportunities; one sticky-note or `.margin-note`
   for the "moment of truth".
2. **`templates/value-stream.html`** — `.value-stream` with
   `.value-stream__step` (green default) alternating `.value-stream__wait`
   (orange clock + wait time), a lead-time summary strip (KPI cards or
   `.table-workshop` totals), a red `.margin-note` on the worst wait.
3. **`templates/swimlanes.html`** — `.swimlanes` with 3-4 `.swimlane`s
   (label + track of `.swimlane__item`s with varied `data-ink`), sketch
   `flow-arrow`s between items where meaningful.
4. **`templates/priority-matrix.html`** — `.matrix-2x2`, axes impact vs.
   effort; quadrants `data-ink`: green "quick wins", blue "big bets",
   orange "fill-ins", black "money pits"; items as small stickies or list
   items; `.sketch-circled` emphasis on the top priority.

Each: logical properties only (Hebrew-ready), icons inlined, footer, sparing
`data-animate`. Screenshot light+dark, fix, then surface all four in
`index.html` the same way existing templates are surfaced (read how first).

**Commit:** `feat: add customer-journey, value-stream, swimlanes, priority-matrix templates`

## Step 3.5 — "Sketchbook dashboard" style — replicate the reference image

**Reference: `docs/reference/sketch-dashboard-reference.png`** (committed to
this repo). This is the style the user loves and wants reproduced **exactly**.
Study it before building. What it shows: an off-white paper slide, framed by a
dark surround, where EVERYTHING is hand-drawn — jittered sketch borders,
hand-circled process icons joined by freehand arrows, small doodle scribbles
in the corners, and **all typography in a neat print-handwriting style**
(architect's print — NOT cursive, NOT childish), with the six-ink convention
carrying meaning (red current-state box, blue future-solution checklist,
green/orange/red/blue KPI cards).

**3.5a. New opt-in style variant.** Add `css/style-sketchbook.css` defining a
`.style-sketchbook` scope (applied on `.slide` or a wrapper):

- Typography: the whole slide (headings, body, KPI values, labels) switches to
  a hand-print font stack. This deliberately relaxes constraint #4 — it is a
  **separate, opt-in style mode**, documented as such; the default style keeps
  the rule. Candidate Latin fonts (match the reference's neat print look):
  `Shantell Sans`, `Patrick Hand`, `Gochi Hand`, `Architects Daughter`
  (Caveat is too cursive for body here — keep it for marginalia). Candidate
  Hebrew hand fonts: **`Playpen Sans Hebrew`**, **`Amatic SC`** (has Hebrew).
  Render a sample of each candidate pair and pick the one that reads
  "consultant marker print", not "kids' worksheet". Load fonts the same way
  existing pages do (check `index.html` `<head>` first) and keep sane
  fallbacks so `file://`-offline still looks acceptable.
- Everything keeps consuming the existing tokens/inks — no new colors, no
  seventh ink. Sketch borders via existing `data-sketch="box"` /
  `.workshop-box`; do not invent a parallel border system.

**3.5b. New template `templates/sketch-dashboard.html`** replicating the
reference layout one-to-one:

- Top-left: two-line black hand-print title + blue marker subtitle with
  sketch underline (`data-sketch="underline"`).
- Top-right: two small sketch-bordered chart cards — a rough line "trend"
  chart (`js/charts.js` `"rough": true`) with a big `+28%`-style delta, and a
  donut chart (purple/orange/yellowish segments from existing ink/chart
  tokens) with a small High/Medium/Low legend; plus an "AI chip" icon in the
  far corner (from `icons/sprite.svg` if present, else add one following the
  24x24 / stroke-1.75 convention and inline it).
- Middle band: red `CURRENT SITUATION` sketch box with a bulleted pain list
  (left) → five hand-circled process-step icons (`.flow-step` +
  `data-sketch="circle"` or existing circle treatment) connected by freehand
  arrows (`.flow-arrow`, `data-sketch="arrow-h"`) → blue `FUTURE SOLUTION`
  sketch box with a ✓-checklist (right).
- Bottom row: four KPI cards (red / blue / green / orange) — hand-drawn icon,
  big hand-print value, small delta line ("+18% vs last month" style) colored
  by meaning.
- Small corner doodle scribbles (green/red/blue strokes) as in the reference —
  subtle, decorative, `aria-hidden`.

**3.5c. Mixed Hebrew/English version — this is the user's primary real-world
mode.** The user's decks are mostly Hebrew with English technical terms
embedded (product names, "AI", "Excel", "Real-time", KPI units). Build
`templates/sketch-dashboard.he.html`: `<html lang="he" dir="rtl">`, layout
mirrored, Hebrew hand-print font for Hebrew text, Latin hand-print for
embedded English runs, numbers/dates via `.tabular`/`.ltr-embed`. Verify by
screenshot: clean bidi (no jumbled `בעיה ב-Excel files` runs), arrows flipped,
title/subtitle right-aligned, KPI values LTR inside RTL cards.

**3.5d. Match check.** Screenshot the new template at 1920 and compare
side-by-side against `docs/reference/sketch-dashboard-reference.png`.
Iterate until borders, ink usage, density, and typography genuinely match the
reference (not "inspired by" — match). Then surface both files in
`index.html`.

**Commit:** `feat: sketchbook-dashboard style variant + EN/HE templates matching reference`

## Step 4 — Hebrew/RTL content pass (scope item 3)

Hebrew-content versions of 2-3 more templates — recommend
`executive-summary`, `meeting-actions`, and the new `priority-matrix`.
Naming: `NAME.he.html` next to the original (keeps relative paths simple).
`<html lang="he" dir="rtl">`. **All Hebrew variants use mixed content** —
Hebrew primary with embedded English terms (that's the user's real usage),
not laboratory-pure Hebrew. Real workshop-plausible content (יעדים, חסמים,
המלצות, לו"ז) with LTR-embedded numbers/dates/English via `.tabular` /
`.ltr-embed`.

Verify by screenshot: right alignment; `sketch.js` arrow flip (`arrow-h` is
RTL-aware, `js/sketch.js:198`); `.hand` falls back per `[lang='he']` rules
(no Caveat rendering Hebrew); notebook margin rule on the right; sticky tape
mirroring; no mixed-direction breakage. Note `js/theme.js` re-applies `lang`
from localStorage on load — with a fresh headless profile it keeps the
hardcoded `lang="he"`; confirm no flash/flip.

**Commit:** `feat: Hebrew-content template variants (mixed he/en) + RTL fixes`

## Step 5 — Print/PDF (scope item 4)

`--print-to-pdf` on 2-3 templates plus the showcase (multi-slide page-break
test). Inspect via `pdftoppm -png` (verify it exists; else another
PDF-to-image route). Check: one slide per page; no clipping at the
`@page { size: 1920px 1080px }` + `.slide { width:100vw; height:100vh }`
combination (**VERIFY** — headless Chrome may letterbox/scale; if broken, fix
`css/print.css`); ink colors preserved (`print-color-adjust`); nothing stuck
at opacity 0; sketch strokes present. Extend `print.css`'s color-adjust list
to new components if needed.

**Commit:** `fix: print/PDF output verified — ...`

## Step 6 — Responsive at non-native widths (scope item 5)

Screenshot 2-3 representative templates at 1440x900, 1366x768, 1100x800.
The system is deliberately fluid (README "Slides are fluid"); expect graceful
reflow. Fix real clipping/overlap (likely candidates: `.bmc` fixed rows,
`.risk-heatmap` inline px `grid-template` values, `.matrix-2x2` at short
heights, `.ai-hub` node positions at narrow widths).

Then implement the documented gap: **`js/scale.js`** — opt-in
`ResizeObserver`-driven `transform: scale()` fit. API: `data-scale-to-fit` on
`.slide` (or a `.slide-scaler` wrapper); `scale = min(vw/1920, vh/1080)`;
`transform-origin: top center`; dependency-free, `file://`-safe. Wire into ONE
template as demo and document usage — fluid stays the default. Verify at
1366x768: proportional, uncropped.

**Commit:** `feat: optional ResizeObserver scale-to-fit wrapper (js/scale.js) + responsive fixes`

## Step 7 — Accessibility pass (scope item 6)

**7a. Contrast matrix** (Python script in scratchpad, WCAG 2.1 ratios):

- Light inks `#1B1E23 #1E5A8C #B0332E #3F7A44 #C1631A #6B4E9E` + neutrals
  (`--color-ink-2/-3/-muted`) against: paper `#FBFAF7`, raised `#FFFFFF`,
  sunken `#F3F1EC`, each `--ink-*-soft`, kraft `#C9AD84`, corkboard
  `#B6875A`, blueprint `#0F3245` (its text is `#EAF1F6`).
- Dark inks against `#14171C`, `#1B1F26`, dark softs, dark kraft `#4A3A22`.
- Also: sticky-note text on its 20% `color-mix` background;
  `.compare-block__tag` (`--color-accent-on` on each ink); heatmap dot border
  on the `critical` cell mix.

Thresholds: 4.5:1 body text; 3:1 large text (≥24px, or ≥18.66px bold) and
non-text UI. Per failure: real text → fix in component CSS (e.g. force
`--color-ink` on kraft/corkboard, darken a label); decorative → document.
Expected failures: mid-tone inks on corkboard/kraft; dark-theme blueprint
(Step 2). **Never fix by remapping the six inks.**

**7b. Focus states:** `:focus-visible` ring (`css/base.css:63`) visible on
toolbar buttons in both themes.

**7c. Reduced motion:** code looks right (`animations.css:89`, `base.css:14`)
— verify nothing is stuck at opacity 0 with reduced motion on, and that
without it animations still run.

**7d. ARIA sweep:** decorative sketch SVGs `aria-hidden="true"`; icon `<use>`
blocks aria-hidden or labelled; toolbar buttons labelled.

**Commit:** `fix: a11y — contrast fixes on kraft/corkboard/blueprint, aria sweep`

## Step 8 — Docs, push, deliverables

- Update `docs/README.md`: gaps filled (journey/value-stream/swimlanes/
  priority-matrix now have templates); document the `.style-sketchbook`
  variant and its deliberate hand-font exception + the Hebrew hand-font
  choice; document `js/scale.js` (replacing the "intentional gap" paragraph);
  document the `.he.html` mixed-language variants; keep the README's terse
  engineering-note tone. Update the folder-structure listing.
- Delete this `PLAN.md` from the repo in the final commit (it's a handoff
  artifact, not documentation) — or move relevant residue into docs first.
- `git push -u origin claude/workshop-design-system-review-wokpr5`
  (retry x4 with 2s/4s/8s/16s backoff on network failure only). **No PR.**
- Final message: findings/changes organized by the numbered scope items
  (1 design pass, 2 component gaps, 3 Hebrew/RTL, 4 print, 5 responsive,
  6 a11y, 7 correctness, plus the sketchbook style), each with file:line
  references, and attach screenshot evidence — before/after for the timeline
  ink clobber, dark blueprint, RTL renders, print PDFs, scale wrapper, and a
  side-by-side of `sketch-dashboard.html` vs the reference image.

## Final verification checklist

- [ ] Every template (7 existing + 4 gap-fills + sketch-dashboard EN/HE +
      Hebrew variants) screenshotted light+dark and actually inspected
- [ ] `grep -rn -- '--_ink:' css/ templates/ index.html` → assignments only in
      `ink-system.css` + the intentional `.swot [data-quad]` block
- [ ] Duplicate-attribute scan clean
- [ ] Every `var(--_ink` / `var(--_ink-soft` use has a fallback
- [ ] All pages open over `file://` with zero console errors
- [ ] No new frameworks, servers, cross-file `<use>`, or 7th ink
- [ ] Sketch-dashboard visually matches `docs/reference/sketch-dashboard-reference.png`
- [ ] Everything committed and pushed to the designated branch
