# Workshop Design System

A dependency-free HTML/CSS/vanilla-JS design system for executive strategy
decks — "the notebook of a senior consultant mid-workshop": paper textures,
a hand-sketched annotation layer, a fixed six-ink semantic convention.
Hebrew RTL first-class, English LTR supported. No Bootstrap/Tailwind/React.

## Where things live

Documentation is split by audience. Start at the row that matches what
you're doing:

| I want to... | Read |
|---|---|
| Give an AI agent instructions for building a deck (canonical, overrides all others on conflict) | [`docs/AGENT.md`](docs/AGENT.md) |
| Understand the design system itself — tokens, components, CSS/JS index | [`project/docs/README.md`](project/docs/README.md) |
| Contribute code/decks — branch flow, hard design rules, validator | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Set up the Microsoft Copilot Studio presentation agent | [`copilot-agent/README-FIRST.he.md`](copilot-agent/README-FIRST.he.md) |
| See the full presentation-agent workflow (outline → build → validate → render-check) | [`decks/presentation-agent-instructions.md`](decks/presentation-agent-instructions.md) / [`docs/presentation-agent-mvp.he.md`](docs/presentation-agent-mvp.he.md) |
| Read the architecture/process improvement backlog | [`docs/design-system-review.md`](docs/design-system-review.md) |

`docs/AGENT.md` §1 keeps the authoritative map of every instruction file in
the repo and which are stale variants — check there before adding a new one.

## Everyday commands

```bash
npm run check          # validate decks/ against the hard design rules (strict)
npm run check:warn     # same, warnings only (never fails)
npm run check:all      # validate decks/ + project/
npm run check:links    # check links in decks/
npm run check:drift    # verify data-sketch/data-chart allow-lists match the engines
npm run build          # bundle project/styles.css (optional authoring convenience)
```

No build step is required to use the system — everything runs over `file://`
or via jsDelivr CDN in standalone decks.

## Layout

- `project/` — the design system itself (CSS/JS engines, tokens, templates, icons, fonts)
- `decks/` — delivered presentations (build output, not source of the system)
- `copilot-agent/` — Microsoft Copilot Studio agent setup (instructions + knowledge files)
- `docs/`, `project/docs/` — documentation, split as in the table above
- `scripts/` — zero-dependency Node tooling (validator, render-check, drift-check, bundler)
