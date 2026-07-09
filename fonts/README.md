# fonts/

Self-hosted, offline-safe (`file://`-safe) hand-print fonts for the
`.style-sketchbook` opt-in variant only. Loaded via `css/fonts-sketch.css`
as one composite family, `'Workshop Sketch'`, split by `unicode-range` so a
single line of mixed Hebrew + English (the primary real-world use case)
picks the correct face per glyph automatically — no `:lang()` hacks.

| File | Family | Script | Source | License |
|---|---|---|---|---|
| `Excalifont-Regular.woff2` | Excalifont | Latin, digits, punctuation | [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw/tree/master/packages/excalidraw/fonts/Excalifont) — the actual Excalidraw hand-print font (basic-Latin unicode-range chunk) | OFL 1.1 — `Excalifont-OFL.txt` |
| `PlaypenSansHebrew.woff2` | Playpen Sans Hebrew | Hebrew | [google/fonts (ofl/playpensanshebrew)](https://github.com/google/fonts/tree/main/ofl/playpensanshebrew), upstream [TypeTogether/Playpen-Sans](https://github.com/TypeTogether/Playpen-Sans) | OFL 1.1 — `PlaypenSansHebrew-OFL.txt` |

## Why Playpen Sans Hebrew

Chosen by rendering, not by name — `Amatic SC` and `Solitreo` were also
pulled from `google/fonts` and compared side-by-side against Excalifont in
mixed Hebrew/English sentences at title and label sizes:

- **Amatic SC**: too condensed, and several Hebrew glyphs render as empty
  tofu boxes in Chromium — disqualifying.
- **Solitreo**: a connected cursive script — elegant, but stylistically a
  mismatch for Excalifont's bouncy *print* hand rather than cursive.
- **Playpen Sans Hebrew**: purpose-built casual handwriting Hebrew face,
  closest weight/bounce/informality match to Excalifont without reading
  childish. Variable font, default instance (`wght` 400) used as-is.

## Wiring (`css/fonts-sketch.css`)

```css
@font-face {
  font-family: 'Workshop Sketch';
  src: url('../fonts/Excalifont-Regular.woff2') format('woff2');
  unicode-range: U+0000-058F, U+2000-206F, U+2212;
}
@font-face {
  font-family: 'Workshop Sketch';
  src: url('../fonts/PlaypenSansHebrew.woff2') format('woff2');
  size-adjust: 112%;
  unicode-range: U+0590-05FF, U+FB1D-FB4F;
}
```

`--font-hand-print: 'Workshop Sketch', 'Caveat', cursive;` in
`style-sketchbook.css` uses this for both directions — the browser picks
the Latin or Hebrew face per-glyph based on `unicode-range`, so
`ניהול תאונות דרכים — Real-time AI Platform` renders with each script in
its correct hand font on one line. Digits/percent stay LTR-embedded via
`.tabular` / `.ltr-embed` in markup regardless of surrounding direction.

`size-adjust: 112%` on the Hebrew face compensates for Playpen Sans
Hebrew's smaller x-height relative to Excalifont so mixed lines have even
visual color — calibrated by rendering, not guessed.

Verify offline: run Chromium headless with
`--host-resolver-rules="MAP * ~NOTFOUND"` against `sketch-dashboard.html`
— both faces must still render (no network requests are made; everything
resolves via relative paths under `fonts/`).
