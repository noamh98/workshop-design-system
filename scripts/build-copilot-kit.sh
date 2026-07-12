#!/usr/bin/env bash
# Assemble the Microsoft Copilot Studio agent kit into a single ZIP.
# Usage: bash scripts/build-copilot-kit.sh [output.zip]
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$REPO/workshop-copilot-agent-kit.zip}"
STAGE="$(mktemp -d)/workshop-copilot-agent-kit"
mkdir -p "$STAGE"/{knowledge,starter,tools,examples,docs}

cp "$REPO/copilot-agent/README-FIRST.he.md"        "$STAGE/"
cp "$REPO/copilot-agent/SETUP-GUIDE.he.md"         "$STAGE/"
cp "$REPO/copilot-agent/INSTRUCTIONS.md"           "$STAGE/"
cp "$REPO/copilot-agent/knowledge/workshop-design-guide.txt" "$STAGE/knowledge/"
cp "$REPO/copilot-agent/knowledge/slide-recipes.txt"         "$STAGE/knowledge/"
cp "$REPO/copilot-agent/knowledge/anti-patterns.md"          "$STAGE/knowledge/"
cp "$REPO/copilot-agent/starter/deck-starter.he.html"        "$STAGE/starter/"
cp "$REPO/scripts/validate-deck.mjs"               "$STAGE/tools/"
cp "$REPO/scripts/render-check.mjs"                "$STAGE/tools/"
cp "$REPO/scripts/package.json"                    "$STAGE/tools/"
# tools live under tools/ inside the kit — adjust paths in the copied README
sed -e 's|scripts/|tools/|g' "$REPO/scripts/README.md" > "$STAGE/tools/README.md"
cp "$REPO/decks/municipa1l-ai-briefing_2.he.html"  "$STAGE/examples/municipal-ai-briefing.he.html"
cp "$REPO/docs/presentation-agent-mvp.he.md"       "$STAGE/docs/"
cp "$REPO/decks/presentation-agent-instructions.md" "$STAGE/docs/"

rm -f "$OUT"
(cd "$(dirname "$STAGE")" && zip -qr "$OUT" "$(basename "$STAGE")")
echo "kit written to $OUT"
unzip -l "$OUT"
