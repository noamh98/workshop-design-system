# PowerPoint template — Workshop Design System

`Workshop-Design-System-Template.pptx` — a 15-slide, bilingual (English +
עברית) PowerPoint template that carries every core building block of the
design system as **native, editable** objects. Use it as a starting deck, or
hand it to another AI agent so it generates on-brand slides with the correct
colors, fonts and metrics.

## The 15 slides

1. Cover
2. How to use this template (EN + HE)
3. The six-ink color system — swatches, hex, semantic meaning
4. Typography — display / body / label / mono / hand
5. Text styles, labels & numbers — tracked labels, deltas, tabular figures
6. Icon library — 36 stroke icons (from the real SVG sprite)
7. KPI cards
8. Problem ↔ Solution
9. Process flow (one AI step in purple)
10. Charts — donut / bar / line (native PowerPoint charts, fully editable)
11. Comparison table (ink-colored values)
12. Roadmap — four quarters
13. Risks & mitigation
14. 2×2 matrix
15. Closing

## Fonts to install (free / Google Fonts)

Fraunces · Frank Ruhl Libre · Inter · Heebo · IBM Plex Mono · Caveat.
If they aren't installed, PowerPoint substitutes a fallback — the layout still
holds, but install them for the true look.

## Rules the template follows

- Six inks are **semantic**, never remapped: black=structure, blue=future,
  red=problems, green=solutions, orange=risks, purple=AI.
- No emoji, no gradients. Hebrew is RTL; numbers and Latin terms stay LTR.
- The hand-drawn sketch stroke and the sketchbook hand-print font are
  **HTML/CSS/JS only** — this `.pptx` uses the system's clean brand mode
  (thin ink outlines stand in for the sketch border).

## Regenerating

```bash
# 1. (optional) re-render the icon PNGs from the sprite
cd scripts && npm install          # playwright-core, one-time
node render-pptx-icons.mjs         # writes assets/pptx-icons/*.png

# 2. rebuild the deck
python3 scripts/build-pptx-template.py assets/Workshop-Design-System-Template.pptx
```

`build-pptx-template.py` requires `python-pptx` (`pip install python-pptx`).
`pptx-icons/` holds the 36 icon PNGs the deck embeds.
