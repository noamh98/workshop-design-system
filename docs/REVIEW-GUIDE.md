# Review & Visual Verification Guide

How to render this branch (`claude/workshop-design-system-review-wokpr5`) and
check that everything looks right. The work on this branch was implemented and
validated **statically** (WCAG contrast math, `node --check`, cascade/code
review) but **not rendered in a browser** — the build environment had no
browser available. This guide is the checklist to close that visual gap.

Nothing here needs a build step or dependencies. The whole system runs from
plain files.

---

## 0. Get the branch

```bash
git fetch origin
git checkout claude/workshop-design-system-review-wokpr5
```

---

## 1. Fastest look — just open a file

Double-click any `.html`, or drag it into a browser window. Everything works
over `file://` (icons are inlined per-page for exactly this reason).

- **Start at [`index.html`](../index.html)** in the repo root — the live
  showcase with every component and a card per template.
- Then open individual templates from [`templates/`](../templates/).

## 2. Recommended — tiny local server

`file://` can block Google Fonts from loading (you'll get system-font
fallbacks, which is fine but not the intended look). A static server fixes it:

```bash
# from the repo root
python3 -m http.server 8000
#   or:  npx serve .
```

Open <http://localhost:8000/index.html>. If fonts still fall back (offline /
proxy), that's expected — judge layout, not glyph rendering.

## 3. Toggling theme, language, and direction

Every page with the toolbar has buttons wired via `data-theme-toggle` and
`data-lang-toggle` (see `js/theme.js`). Click them to flip:

- **Theme:** light ⇄ dark (`data-theme` on `<html>`, saved to `localStorage`)
- **Language/direction:** English/LTR ⇄ Hebrew/RTL (`lang` + `dir`)

The `.he.html` templates are already hardcoded to `lang="he" dir="rtl"`, so
they open right-to-left without clicking anything.

---

## 4. What to check, template by template

Open each and eyeball it against the notes. ✅ = should look right; 🔍 = the
specific thing to scrutinise (these are where bugs would hide).

### 4.1 New gap-fill templates (scope item 2)

| File | 🔍 Check |
|---|---|
| `templates/customer-journey.html` | Emotion curve renders (blue path + soft fill); pain row reads red, opportunities blue; stages align under the curve; one "moment of truth" margin-note |
| `templates/value-stream.html` | Green process steps alternate with orange wait blocks; lead-time summary totals; red margin-note on the worst wait; no clipping between steps |
| `templates/swimlanes.html` | 3–4 lanes with labels; items carry varied `data-ink` colors (not all black); sketch arrows between items are **visible** |
| `templates/priority-matrix.html` | 2×2 impact/effort; quadrants green/blue/orange/black; top priority is hand-circled; axis labels present |

### 4.2 Sketchbook style vs. the reference (the big one)

Open **side by side**:
- `templates/sketch-dashboard.html`
- `docs/reference/sketch-dashboard-reference.png`

🔍 They should **match**, not merely be "inspired by". Compare:
- Whole slide is neat **hand-print** typography (headings, body, KPI values) —
  not cursive, not childish. This is the one deliberate exception to the
  "handwriting is not for body copy" rule (see main README).
- Layout: two-line title + underlined blue subtitle (top-left); two
  sketch-bordered chart cards + AI chip (top-right); red **CURRENT SITUATION**
  box → five hand-circled process icons joined by freehand arrows → blue
  **FUTURE SOLUTION** checklist (middle band); four KPI cards
  red/blue/green/orange (bottom); subtle corner doodles.
- **Known intentional deviation:** the reference's risk donut uses yellow;
  yellow is outside the fixed six-ink palette, so it's mapped
  High=red / Medium=orange / Low=green. Confirm that's what you see.

### 4.3 Hebrew / mixed he-en (scope item 3)

Open `sketch-dashboard.he.html`, `executive-summary.he.html`,
`meeting-actions.he.html`, `priority-matrix.he.html`.

🔍 Bidi correctness — this is where RTL bugs show:
- Right-aligned; layout mirrored (title top-right, arrows point right-to-left).
- Embedded English/numbers stay **LTR inside the Hebrew** — e.g. you should see
  `דיווח ב-Real-time` and `עלייה של 28%` cleanly, **not** a jumbled
  `28% של עלייה` or broken `Excel files ב-בעיה`.
- Hebrew text is **not** rendered in a Latin cursive (Caveat) — it uses the
  Hebrew hand/italic fallback.
- Notebook margin rule flips to the right; sticky tape mirrors.

### 4.4 Existing templates (regression check)

Open `title-slide`, `executive-summary`, `meeting-actions`, `swot-risk`,
`workshop-canvas`, `process-flow-roadmap`, `ai-architecture`.

🔍 In particular, the timeline in `process-flow-roadmap.html`: give milestones
different `data-ink` values (or just confirm the shipped ones) — each dot/date
should keep **its own color**, not all snap to blue. That was the headline
cascade bug fixed on this branch (`css/components/flow.css:57`).

---

## 5. Dark theme + accessibility (scope item 6)

Flip to dark theme and re-open at least one page using each paper surface.
🔍 The contrast fixes to verify:

- **Corkboard** (`.paper-corkboard`) and **kraft** (`.paper-kraft`): text stays
  readable in **both** themes. Corkboard previously inherited a light ink over
  its tan surface in dark theme (2.81:1, failing) — now pinned.
- **Blueprint** (`.paper-blueprint`): light text on deep navy in both themes
  (not near-invisible in dark).
- Sticky-note / colored-ink-directly-on-kraft-or-corkboard is a **documented
  decorative** combination (real content rides on notes with their own fills),
  so don't flag those as failures.

Other a11y spot-checks:
- **Focus ring:** Tab through the toolbar buttons — a visible focus ring in
  both themes (`:focus-visible`, `css/base.css`).
- **Reduced motion:** turn on "reduce motion" in your OS, reload — content must
  appear **fully visible** (nothing stuck transparent), just without the
  entrance animation.

Optional — re-run the contrast matrix yourself:

```bash
# there is no script committed (it lived in the build scratchpad),
# but any WCAG 2.1 calculator works; the ink hexes are in css/tokens.css.
```

---

## 6. Print / PDF (scope item 4)

On any template and on `index.html`: **Ctrl/Cmd + P → Save as PDF**.

🔍 Expect:
- One `.slide` per page at 1920×1080 proportions.
- Toolbars / nav / animations stripped.
- **Ink colors preserved** (they carry meaning — `print-color-adjust: exact`).
- Nothing stuck at opacity 0; sketch strokes present.
- No card sliced across a page break.

Headless alternative (if you have Chrome/Chromium):

```bash
chrome --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=out.pdf \
  "file://$PWD/templates/sketch-dashboard.html"
```

---

## 7. Kiosk / projector scaling (scope item 5)

Open `templates/kiosk-scaled.html` and **resize the window**.

🔍 The slide should scale **proportionally** (letterbox-fit), never crop. This
is the opt-in `js/scale.js` (`data-scale-to-fit`). Every other page is
deliberately **fluid** and should simply reflow — that's by design, not a bug.

---

## 8. Console check

Open DevTools (F12) → Console on a few pages, including a `.he.html` one.
🔍 Expect **zero errors**. (A blocked Google-Fonts request over `file://` is
a warning, not a code error — ignore it.)

---

## 9. Optional — headless screenshots for the record

If you have Chrome/Chromium and want the screenshot evidence the original plan
called for:

```bash
SHOT() { # usage: SHOT file.html out.png
  chrome --headless=new --disable-gpu --hide-scrollbars \
    --force-prefers-reduced-motion --virtual-time-budget=4000 \
    --window-size=1920,1250 --screenshot="$2" "file://$PWD/$1"
}

SHOT templates/sketch-dashboard.html   sketch-dashboard.png
SHOT templates/sketch-dashboard.he.html sketch-dashboard-he.png
SHOT templates/customer-journey.html   customer-journey.png
SHOT templates/value-stream.html       value-stream.png
SHOT templates/swimlanes.html          swimlanes.png
SHOT templates/priority-matrix.html    priority-matrix.png
```

For **dark theme** headlessly, copy the file and inject `data-theme="dark"`
onto `<html>` first (localStorage isn't practical headless):

```bash
sed 's/<html /<html data-theme="dark" /' templates/sketch-dashboard.html \
  > /tmp/dark.html
SHOT ../../tmp/dark.html sketch-dashboard-dark.png   # adjust path as needed
```

Then place `sketch-dashboard.png` next to
`docs/reference/sketch-dashboard-reference.png` and compare one-to-one
(§4.2). Keep screenshots out of the repo — they're not committed artifacts.

---

## 10. Quick pass/fail summary to fill in

- [ ] All templates open over `file://` with **zero console errors**
- [ ] Timeline milestones keep individual `data-ink` colors (cascade fix)
- [ ] New templates (journey / value-stream / swimlanes / priority-matrix) look right, light + dark
- [ ] `sketch-dashboard.html` genuinely **matches** the reference image
- [ ] `.he.html` variants: clean bidi, mirrored, Hebrew not in Latin cursive
- [ ] Corkboard / blueprint text readable in **dark** theme
- [ ] Focus ring visible; reduced-motion shows content (not blank)
- [ ] Print → PDF: one slide/page, ink colors kept
- [ ] `kiosk-scaled.html` scales proportionally on resize
- [ ] No new frameworks / servers / cross-file `<use>` / 7th ink
