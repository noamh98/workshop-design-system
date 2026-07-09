---
name: new-sketchbook-deck
description: Build a new standalone HTML slide or multi-slide deck in this repo's hand-drawn "sketchbook" style (self-hosted Excalifont/Playpen Sans Hebrew fonts, charcoal stage, real hand-drawn SVG strokes, six-ink convention). Use when the user asks to create a new presentation, deck, or slide "in this style" / "like sketch-dashboard" / "in the sketchbook design".
---

# Build a new sketchbook-style presentation

Full tool-agnostic spec (works even outside Claude Code — Copilot 365,
ChatGPT, etc.): `docs/NEW-PRESENTATION-GUIDE.md` (English) /
`docs/NEW-PRESENTATION-GUIDE.he.md` (עברית). Read whichever matches the
user's language before writing any code — it has the copy-paste prompt,
the hard rules, and the two starting-point templates. This skill file is
the short version for when you're already working inside this repo.

## What this is NOT

A `.pptx` PowerPoint file. This system produces standalone `1920x1080`
HTML files viewed in a browser / printed to PDF. If the user actually
wants a native PowerPoint deck, say so explicitly before building
anything — that's a different, incompatible deliverable.

## Steps

1. Ask (or infer from context) whether this is a **single slide** or a
   **multi-slide deck**, and the target language (English / Hebrew+RTL /
   mixed).
2. Copy the closest starting point:
   - Single slide, dashboard-like: `templates/sketch-dashboard.html` /
     `.he.html`.
   - Multi-slide deck with prev/next navigation:
     `templates/finetracker-briefing.he.html`.
3. Keep the `<head>` structure intact (every `<link>` to `css/*.css` and
   `<script>` to `js/*.js`, especially `css/fonts-sketch.css` loaded
   *before* `css/style-sketchbook.css` — that order is load-bearing).
4. Replace content only. Reuse existing classes — do not invent new ones
   unless the existing set genuinely doesn't cover the layout:
   - `.sketch-card` + `data-sketch="box"` + `data-ink="red|blue|green|orange|purple|black"`
   - `.sketch-list.sketch-list--bullets` / `.sketch-list--checks`
   - `.sketch-flow` + `.sketch-flow__circle[data-sketch="circle"]` +
     `.flow-arrow[data-sketch="arrow-h"]`
   - `.sketch-kpi` (icon + value + delta + footer)
5. Hebrew/RTL content: wrap every embedded Latin run in
   `<bdi class="ltr-embed">…</bdi>`, numbers/percentages in
   `<bdi class="tabular">…</bdi>`. Never leave a raw English word loose
   inside a Hebrew sentence — bidi will scramble it.
6. Never hardcode a color. Every ink comes from `data-ink="…"` (six fixed
   values — see `css/ink-system.css`) and is consumed via
   `var(--_ink, fallback)`.
7. **Render-verify before calling it done.** If headless Chromium is
   available (`/opt/pw-browsers/chromium` in this environment, or
   wherever the host provides it), screenshot the result and look at the
   pixels. If not, tell the user to open it in a browser themselves —
   never claim "done" on code you haven't seen rendered.
8. If the deck should also print cleanly, check `@media print` doesn't
   leave a second near-empty page (a common gotcha here: any unconditional
   `body { padding-block-end: … }` rule declared *after* the print
   override wins the cascade and silently reintroduces the overflow — see
   the comments in `templates/finetracker-briefing.he.html` for the fix
   pattern already applied there).
9. **When the user asks for "the HTML" / "send me the presentation as an
   HTML file"** without qualifying it — deliver a standalone bundle, not
   the linked template. Run:
   ```
   python3 scripts/bundle-standalone.py templates/<your-file>.html
   ```
   This inlines every CSS/JS file and embeds every font as base64 — the
   output has zero dependency on the repo's folder structure and can be
   sent as one file. Render-verify the *bundled* output too (open it from
   a directory with none of `css/js/fonts/icons/` present) — the script
   is regex-on-content based specifically because a manual line-slice
   version of this once produced a nested `<script>` tag that silently
   broke slide navigation. Only skip bundling if the user explicitly says
   they want the linked/repo-relative version instead.
