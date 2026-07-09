# How to build a new presentation in this style — with any agent

A portable, tool-agnostic guide: works with Claude Code, Claude.ai, Copilot
365, ChatGPT, or any other agent. No build step, no dependencies — this is
plain HTML/CSS/JS, so any AI agent needs exactly two things: (a) to see the
system's files, and (b) a clear instruction on how to use them. Both are in
this document.

> Hebrew version: [`NEW-PRESENTATION-GUIDE.he.md`](NEW-PRESENTATION-GUIDE.he.md).

---

## Step 0 — what this actually is (read before anything else)

This system produces **standalone HTML files** that open in a browser
(`file://`, no server) and print to PDF when needed — each slide is a
`1920x1080` `.slide`. **This is not PowerPoint/.pptx.** If you're working
with Copilot 365 expecting a native `.pptx` you can open in PowerPoint —
that's a different pipeline, incompatible with this system. Copilot can
absolutely help you write/edit the HTML files themselves (if you give it
repo access), but the deliverable stays HTML viewed in a browser, not a
native PowerPoint slide.

## Step 1 — what the agent physically needs access to

Any agent — Claude, Copilot, GPT, whichever — needs access to these four
folders from the `workshop-design-system` repo:

```
css/      — tokens, ink system, style-sketchbook.css, fonts-sketch.css
js/       — sketch.js (hand-drawn strokes), charts.js, theme.js
fonts/    — Excalifont + Playpen Sans Hebrew, self-hosted
icons/    — sprite.svg (canonical source for every icon, incl. KPI duotones)
```

Two ways to provide that:

1. **Repo access** — give the agent a link/access to
   `noamh98/workshop-design-system` and have it work against it directly
   (this is what Claude Code does via `add_repo`).
2. **Local copy** — if your agent can't reach git (e.g. a Copilot Chat
   context with no repo access), **download/copy** the four folders above
   plus one example template (`templates/sketch-dashboard.html` or
   `templates/finetracker-briefing.he.html`) into your local project, and
   point the agent there.

Without the actual files present (not just "knowing they exist") — no
agent can produce matching fonts/colors/hand-strokes. This is a real
asset, not general knowledge.

## Step 2 — the prompt to hand any agent (copy-paste ready)

```
I want a new, standalone HTML file (1920x1080) in the same "sketchbook"
style as workshop-design-system — warm ivory grained paper, a dark
charcoal frame, hand-print font (Excalifont for Latin / Playpen Sans
Hebrew for Hebrew via css/fonts-sketch.css), cards with a real jittered
hand-drawn stroke (not a CSS border), hand-colored icons.

Use templates/sketch-dashboard.html (or finetracker-briefing.he.html for
a multi-slide deck) as the base — copy the <head> structure (every <link>
to css/ and <script> to js/), the six-ink convention (--ink-black/blue/
red/green/orange/purple via data-ink, never hardcode a color yourself),
and the existing component classes: .sketch-card, .sketch-list
(--bullets / --checks), .sketch-flow + data-sketch="circle"/"arrow-h",
.sketch-kpi. Don't invent a new design system — reuse what's there.

Content for the deck: [your content here]

Render in a browser and take a screenshot before calling it done — don't
assume it looks right without seeing the pixels.
```

## Step 3 — hard rules that don't change between agents

- **Six fixed inks, never a seventh**: black/blue/red/green/orange/purple.
  Never remap meaning (red=problem, blue=future, etc.) — see
  `css/ink-system.css`.
- **No CDN for sketchbook fonts**: everything goes through
  `css/fonts-sketch.css` pointing at `fonts/*.woff2` via relative paths.
  If a new sketchbook slide's code references `fonts.googleapis.com`,
  that's a mistake.
- **Real hand strokes, not a fake CSS border**: `data-sketch="box"` /
  `"circle"` / `"arrow-h"` on the element + `js/sketch.js` on the page.
  The CSS border is only a fallback for the instant before JS runs.
- **Print-to-PDF and offline `file://`** should both be checked before
  calling a new deck done — see `js/sketch.js`'s comments and
  `css/print.css` for the gotchas already found and fixed.
- **Render-verify**: every change needs an actual screenshot (headless
  Chromium if available, or just opening it in a browser) before it's
  "done". This is exactly why the first version of this dashboard failed
  review the first time around.

## Step 4 — recommended starting point

Copy one of these and start editing:

- **Single slide** (like a KPI dashboard): `templates/sketch-dashboard.html`
- **Multi-slide deck** (prev/next nav, dots, keyboard):
  `templates/finetracker-briefing.he.html`

Both work over `file://` with no server, and both demonstrate every
convention above in practice.

## Step 5 — deliver as a standalone file (default for "give me the HTML")

Files under `templates/` load `css/js/fonts/` via relative paths
(`../css/...`) — great for developing inside the repo, but awkward if
someone wants **one file to send**, or to open outside the folder
structure. **When a user asks "send me the presentation as HTML" without
qualification — the correct deliverable is a single standalone file**,
not the linked one.

There's a tool for this, `scripts/bundle-standalone.py` — a pure Python
script (no pip install, matching the repo's own no-dependencies
philosophy) that packs a template into one HTML file: every CSS/JS
inlined, every font embedded as a base64 data URI. Zero network
requests, zero relative-path dependency:

```bash
python3 scripts/bundle-standalone.py templates/sketch-dashboard.he.html
# writes templates/sketch-dashboard.he.standalone.html
```

**Render-verify the bundled output too** — open it in a browser (or
headless Chromium with `--host-resolver-rules="MAP * ~NOTFOUND"` to
confirm it's genuinely offline) and check that slide navigation (if any)
still works and no nested `<script>` got produced by accident — that's
exactly the bug caught the first time this script was written, which is
why it's regex-on-content rather than line-number based.
