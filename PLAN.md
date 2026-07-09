# Execution Plan v2 — Match the Sketchbook Reference Exactly + Real Sketch Fonts

> Handoff document for the executing session. The previous session (PR #1,
> merged) built `templates/sketch-dashboard.html` / `.he.html` and
> `css/style-sketchbook.css` **without ever rendering them** — the user
> reviewed the output and rejected it: it does not look like the reference.
> Your job is to make it actually match. The single most important rule of
> this task: **render → look at the pixels → compare to the reference →
> iterate.** Nothing is "done" until a side-by-side screenshot proves it.
>
> **Reference image (the ground truth): `docs/reference/sketch-dashboard-reference.png`**
> Open and study it before writing any code.

**Branch:** `claude/workshop-design-system-review-wokpr5` (already restarted
from the merged `main` and pushed with this plan on it). Work on it, commit at
milestones, `git push -u origin claude/workshop-design-system-review-wokpr5`
(retry ×4 with 2s/4s/8s/16s backoff on network failures only). **No PR.**

---

## Environment

Linux container. Headless Chromium: `/opt/pw-browsers/chromium`. Never run
`playwright install`.

```bash
# Screenshot (settled state):
/opt/pw-browsers/chromium --headless=new --no-sandbox --disable-gpu \
  --force-prefers-reduced-motion --hide-scrollbars --virtual-time-budget=4000 \
  --screenshot=/path/out.png --window-size=1920,1250 "file:///abs/path/FILE.html"

# Simulated-offline run (verify self-hosted fonts work with zero network):
/opt/pw-browsers/chromium --headless=new --no-sandbox --disable-gpu \
  --force-prefers-reduced-motion --hide-scrollbars --virtual-time-budget=4000 \
  --host-resolver-rules="MAP * ~NOTFOUND" \
  --screenshot=/path/out-offline.png --window-size=1920,1250 "file:///abs/path/FILE.html"

# Print-to-PDF:
/opt/pw-browsers/chromium --headless=new --no-sandbox --disable-gpu \
  --print-to-pdf=/path/out.pdf --no-pdf-header-footer "file:///abs/path/FILE.html"
```

Downloads (fonts) go through the pre-configured HTTPS proxy — plain `curl -L`
works; if TLS errors appear use `--cacert /root/.ccr/ca-bundle.crt`. Keep all
screenshots/scratch files in the session scratchpad, not the repo.

For side-by-side comparison, compose images with Python/PIL (available) —
reference on top, your render below, same pixel width — and actually READ the
composite before deciding anything matches.

## Hard constraints (unchanged, from CLAUDE.md + docs/README.md)

1. Pure HTML/CSS/vanilla JS. No frameworks, no build step. Everything must
   work double-clicked over `file://` — **including fonts, which is why they
   must be committed to the repo and loaded via relative-path `@font-face`,
   not Google Fonts CDN.**
2. Icons: inline `<symbol>` defs per page (canonical source `icons/sprite.svg`);
   never cross-file `<use>`.
3. Six-ink convention fixed (black/blue/red/green/orange/purple); never remap,
   no 7th color. New decorations consume existing ink tokens.
4. Never declare a bare `--_ink`/`--_ink-soft` default on a component class
   outside `css/ink-system.css`; consume via `var(--_ink, fallback)`.
5. `.style-sketchbook` remains the one documented opt-in exception to the
   hand-font rule. Default templates must be completely unaffected by
   everything you do here — verify by re-screenshotting one or two of them at
   the end.

---

## The gap analysis (what the reference has vs. what was built)

Study `docs/reference/sketch-dashboard-reference.png` against a render of the
current `templates/sketch-dashboard.html`. Confirmed gaps from code read —
verify each visually, then fix all of them:

| # | Reference | Current implementation |
|---|-----------|------------------------|
| G1 | All type in the **Excalidraw hand-print font** (Virgil/Excalifont): bouncy baseline, irregular strokes — including the big KPI numbers | `Architects Daughter` from Google Fonts CDN (wrong look, network-dependent); Hebrew face `'Gveret Levin AlefAlefAlef'` referenced but **never loaded from anywhere** (not on Google Fonts) → Hebrew silently falls back to a plain sans |
| G2 | Slide is warm ivory paper (~`#EFEDE7`) with a **fine speckle/grain texture**, floating on a **near-black charcoal surround** with slightly rounded corners | Flat `--color-paper-sunken` page background, no grain, no dark frame |
| G3 | Every box border is a **real wobbly hand stroke** (visible jitter, corner overshoot, occasional double pass) | CSS `border-radius` "wavy" trick + 2px solid border; `data-sketch="box"` present on some cards but the crisp CSS border dominates |
| G4 | Process icons sit in **hand-drawn double-line circles**, joined by short freehand arrows; a red arrow exits the CURRENT box, a blue one enters FUTURE | Flow circles are plain CSS `border-radius:50%` rings; arrow treatment minimal |
| G5 | KPI icons are **hand-colored**: colored marker fill (red car, blue folder, green-hatched clock, orange warning triangle) under the line stroke | Plain single-stroke line icons, no fill |
| G6 | Small colored **scribble doodles in the slide corners** (green, red/blue) + purple AI-chip with circuit tails top-right | None |
| G7 | Sub-labels in small ALL-CAPS hand print; deltas colored by meaning (+18% red = bad rise, −1.3 days green = good drop) | Partially there — re-check every delta's semantic color |

## Step 1 — Baseline audit (do not skip)

Screenshot the current `templates/sketch-dashboard.html` and `.he.html`
(light theme, 1920×1250). Build the side-by-side composite vs. the reference.
Record the gap list (should match G1–G7 plus anything new you see). This
baseline is also your final before/after evidence.

## Step 2 — Fonts: self-hosted Excalidraw-style pair (Latin + Hebrew)

Create `fonts/` at the repo root. Everything committed, loaded relatively,
verified offline.

**2a. Latin — get the actual Excalidraw font.**
Try in this order (verify whatever you fetch renders correctly before
committing):
1. **Excalifont** — in the Excalidraw repo, e.g.
   `https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/fonts/Excalifont/Excalifont-Regular.woff2`
   (search the repo for the current path if this 404s).
2. **Virgil** (the classic Excalidraw font, equally faithful to the
   reference) — `https://github.com/excalidraw/virgil` (`fonts/` dir, woff2).
Both are open-licensed (OFL/MIT — confirm from the repo and copy the license
text into `fonts/`). If both are unreachable through the proxy, fall back to
the closest Google-Fonts match by rendered comparison (candidates: `Gochi
Hand`, `Shantell Sans`, `Patrick Hand`) — but self-hosted, never CDN.
Get woff2 from `github.com/google/fonts` (ofl/…, TTF is fine too; Chrome
handles TTF in @font-face) or via the css2 API with a Chrome UA.

**2b. Hebrew — pick the best match by RENDERING, not by name.**
Candidates (all downloadable from `github.com/google/fonts` under `ofl/`):
- `Playpen Sans Hebrew`
- `Amatic SC` (includes Hebrew)
- `Solitreo`
- Any other Google-Fonts family with Hebrew subset + handwriting classification
  you find.
Build a scratchpad HTML page showing, for each candidate paired with the
Latin font from 2a: a mixed sentence (e.g. `ניהול תאונות דרכים — Real-time
AI Platform`, plus digits `1,247 +18%`), at title size and at label size.
Screenshot, compare, choose the one whose weight/bounce/informality sits
closest to Excalifont **without reading childish**. Calibrate the pair with
`@font-face` descriptors (`size-adjust`, and per-selector `letter-spacing`
/ `font-weight`) so x-height and visual color match on one line.

**2c. Wire as ONE family via `unicode-range`.**
New file `css/fonts-sketch.css`:

```css
@font-face {
  font-family: 'Workshop Sketch';
  src: url('../fonts/Excalifont-Regular.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0000-058F, U+2000-20FF; /* Latin, digits, punct — NOT Hebrew */
}
@font-face {
  font-family: 'Workshop Sketch';
  src: url('../fonts/<hebrew-choice>.woff2') format('woff2');
  font-display: swap;
  size-adjust: <calibrated>%;
  unicode-range: U+0590-05FF, U+FB1D-FB4F; /* Hebrew + presentation forms */
}
```

Then in `style-sketchbook.css`: `--font-hand-print: 'Workshop Sketch', 'Caveat',
cursive;` for BOTH directions (delete the broken `:lang(he)` override — the
unicode-range split makes mixed he/en text pick the right face per glyph
automatically, which is exactly the user's "Hebrew slides with English terms"
requirement). Keep digits/percent LTR in RTL context via `.ltr-embed`/`.tabular`
in markup.

**2d. Verify offline.** Run the offline screenshot command (host-resolver
MAP-to-NOTFOUND) on `sketch-dashboard.html` — the hand font must still render
(compare a glyph crop vs. the online run). Add `fonts/README.md` with family
names, sources, and licenses; include the OFL/license files.

**Commit:** `feat(fonts): self-hosted Excalidraw-style Latin+Hebrew sketch pair (offline-safe)`

## Step 3 — Surface: paper grain + charcoal surround

In `style-sketchbook.css` (keep it scoped — nothing leaks to default styles):

- **Stage:** the demo pages' `body` (or a `.sketchbook-stage` wrapper) gets a
  near-black charcoal background (`#141519`-ish; a fixed dark frame is part of
  the reference look in BOTH themes) with the slide inset, `border-radius`
  ~10px, generous padding, soft shadow.
- **Paper:** warm ivory (`#EFEDE7` daylight; reuse/derive from existing paper
  tokens rather than hardcoding if a token fits) + speckle grain. Implement
  grain as pure CSS (two/three tiny `radial-gradient` dot layers at odd sizes
  + the existing `.paper-grain` fiber overlay) or an inline SVG feTurbulence
  data-URI background — must be self-contained, no raster files.
- Dark theme: sketchbook slide may keep dark charcoal paper with chalk inks
  (existing dark tokens); verify it still reads, but the reference-match
  target is the light variant.

## Step 4 — Real hand strokes everywhere (G3, G4, G6)

- **Cards:** the drawn stroke becomes the border. Small enhancement to
  `js/sketch.js`: honor an optional `data-sketch-passes="2"` (default 1) so
  boxes can get the reference's double-pass look; `roughRect` already builds
  from `roughLine` — add the passes parameter through. Reduce the CSS border
  on `.sketch-card` to a no-JS fallback that gets **removed when the SVG is
  drawn** (e.g. sketch.js sets `data-sketch-drawn` on the host; CSS:
  `[data-sketch-drawn] { border-color: transparent; }`) — no doubled frames.
- **Flow circles:** replace the CSS ring with `data-sketch="circle"` on the
  circle host (`roughEllipse` already double-passes). Icon stays centered;
  circle stroke colored by context ink.
- **Arrows:** `.flow-arrow` + `data-sketch="arrow-h"` between steps (black);
  a red arrow leaving the CURRENT box and a blue arrow entering FUTURE
  (`.ink-red` / `.ink-blue` on the host). RTL flip is already handled by
  sketch.js — verify in the `.he.html` render.
- **Corner doodles:** small `aria-hidden="true"` inline SVG scribbles
  absolutely positioned at the slide corners (green top-right + bottom-left,
  red/blue accents near top-left, per reference), stroked with ink tokens,
  subtle. Add the purple AI-chip icon with little circuit tails top-right.
- After wiring, **verify no invisible strokes** (the negative-z-index bug
  class) and no console errors.

## Step 5 — Hand-colored KPI icons (G5)

The four KPI icons (car / folder / clock / warning) get a marker-fill layer
under the stroke: per-page inline `<pattern>` of ~45° hatch lines
(`stroke="currentColor"`, low opacity) + a duotone `<symbol>` variant per icon
(a silhouette path `fill="url(#hatch)"` beneath the existing 1.75-stroke
outline). Colored by the card's ink (red car, blue folder, green clock hatch,
orange triangle) via `currentColor`. Keep the 24×24 grid convention; add the
duotone symbols to `icons/sprite.svg` as canonical source too. If the hatch
reads noisy at 22–26px, fall back to a flat `opacity:.28` currentColor fill —
decide from the rendered pixels, not in the abstract.

## Step 6 — Layout + typography parity pass (G7)

With fonts and strokes in, tune the two templates against the reference:
title ~2 lines big black hand print; blue subtitle with sketch underline;
ALL-CAPS small card labels; huge KPI values; delta colors by meaning
(bad rise = red, good drop = green, neutral = blue); trend/donut cards with
`rough:true` charts; spacing/density matching the reference's composition
(current-box | 5-step flow | future-box; 4 KPI cards below; charts + chip on
top). Iterate: screenshot → composite vs. reference → adjust → repeat until a
fresh look at the composite says "same style", not "inspired by".

The Hebrew template (`sketch-dashboard.he.html`): same parity, RTL-mirrored,
mixed he/en content (English product/tech terms inside Hebrew sentences —
this is the user's primary real-world mode), digits LTR. Verify bidi renders
clean in the screenshot.

## Step 7 — System-wide checks

- Re-screenshot 2 default (non-sketchbook) templates — confirm zero visual
  change from your work.
- `grep -rn -- '--_ink:' css/ templates/ index.html` → still only
  `ink-system.css` + the intentional `.swot [data-quad]` block.
- Duplicate-attribute scan on every file you touched.
- Print-to-PDF `sketch-dashboard.html` — strokes, fonts, and fills survive;
  one page, no clipping.
- Offline screenshot (Step 2d command) on both sketch-dashboard pages.
- Console: zero errors over `file://`.
- Update `index.html` showcase: sketchbook section reflects the new fonts
  (and loads `css/fonts-sketch.css` if it demos sketchbook components).

## Step 8 — Docs, cleanup, push

- `docs/README.md`: update the sketchbook-variant section — self-hosted
  `fonts/` (families, licenses, unicode-range mixed he/en mechanism), the
  stage/grain surface, `data-sketch-passes`. Keep the terse tone.
- `fonts/README.md` + license files in place.
- Delete this `PLAN.md` in the final commit.
- Push everything. **No PR.**
- Final message to the user: gap table G1–G7 with what changed per gap
  (file:line), and attach: baseline composite (before), final composite
  (after) for EN and HE, offline-fonts proof, print PDF. Written summary in
  Hebrew (the user communicates in Hebrew), technical terms may stay English.

## Definition of done

- [ ] Side-by-side composite: final `sketch-dashboard.html` genuinely matches
      the reference's style (paper, frame, strokes, fills, typography)
- [ ] `sketch-dashboard.he.html`: same style, RTL, mixed he/en, Hebrew hand
      font actually rendering (screenshot-proven, not assumed)
- [ ] Fonts fully self-hosted; offline screenshot identical to online
- [ ] G1–G7 all closed with visual evidence
- [ ] Default templates unaffected; correctness greps clean; no console errors
- [ ] Print PDF acceptable
- [ ] All commits pushed to `claude/workshop-design-system-review-wokpr5`; PLAN.md removed
