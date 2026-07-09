---
name: workshop-design
description: Use this skill to generate well-branded interfaces and assets for the Workshop Design System (hand-sketched consultant-notebook style, Hebrew RTL + English, six-ink convention), either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, assets, and slide/dashboard templates for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (css/tokens.css for all tokens; css/style-sketchbook.css for the hand-drawn mode; js/sketch.js + js/charts.js for the hand-drawn strokes and charts; templates/ for ready slides).

Hard rules: keep the six-ink semantic convention (black=structure, blue=future, red=problems, green=solutions, orange=risks, purple=AI); no emoji, no gradients; Hebrew is RTL with Latin terms in <bdi>; hand-print font only inside .style-sketchbook.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
