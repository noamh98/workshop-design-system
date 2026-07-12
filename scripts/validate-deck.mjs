#!/usr/bin/env node
/**
 * validate-deck.mjs — static validator for Workshop Design System decks.
 *
 * Usage:  node scripts/validate-deck.mjs <deck.html> [--json]
 * Exit codes: 0 = clean (warnings allowed), 1 = errors found, 2 = bad usage.
 *
 * Rules V1–V10 come from decks/presentation-agent-instructions.md §6 and
 * docs/presentation-agent-mvp.he.md §WP2.
 */

import { readFileSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const INKS = new Set(['black', 'blue', 'red', 'green', 'orange', 'purple']);
const SKETCHES = new Set(['underline', 'highlight', 'circle', 'box', 'arrow-h', 'arrow-v', 'cross']);
const CHARTS = new Set(['donut', 'bar', 'line']);
const ALLOWED_HOSTS = [
  'cdn.jsdelivr.net/gh/noamh98/workshop-design-system',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];
// Glyphs that look like emoji to the Unicode check but are sanctioned by the
// design system (● legend dots and simple arrows/geometry used in flows).
const EMOJI_ALLOWLIST = new Set(['●', '◦', '▸', '▹', '→', '←', '↑', '↓', '↔', '✓', '✗', '·']);

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('usage: node scripts/validate-deck.mjs <deck.html> [--json]');
  process.exit(2);
}

const html = readFileSync(file, 'utf8');
const findings = [];

// Blank a region with spaces so indexes/line numbers stay stable.
const blank = (s) => s.replace(/[^\n]/g, ' ');
// Copy of the document with HTML comments blanked — documentation comments
// (e.g. `data-ink="black|blue|..."` in the starter) must not trip the rules.
const scan = html.replace(/<!--[\s\S]*?-->/g, blank);
// Markup-only copy: embedded <style>/<script> blocks blanked as well — the
// deck inlines the design system's own CSS/JS whose comments mention the
// data-* attributes and must not trip the attribute rules.
const markup = scan
  .replace(/<script\b[\s\S]*?<\/script>/gi, blank)
  .replace(/<style\b[\s\S]*?<\/style>/gi, blank);

function lineOf(index) {
  return html.slice(0, index).split('\n').length;
}
function report(rule, severity, index, message) {
  findings.push({ rule, severity, line: index == null ? null : lineOf(index), message });
}
function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// ---------------------------------------------------------------- slides ---
const slideRe = /<section\b[^>]*class="[^"]*\bslide\b[^"]*"[^>]*>/g;
const slideTags = [...scan.matchAll(slideRe)];
const slideStarts = slideTags.map((m) => m.index);
const slideChunks = slideStarts.map((start, i) => ({
  start,
  tag: slideTags[i][0],
  body: scan.slice(start, slideStarts[i + 1] ?? scan.length),
}));

const isHebrew = /\.he\.html?$/i.test(basename(file)) || /<html[^>]*lang="he"/i.test(html);

// ------------------------------------------------------------------- V1 ---
if (isHebrew) {
  const htmlTag = html.match(/<html\b[^>]*>/i);
  if (!htmlTag || !/dir="rtl"/.test(htmlTag[0]) || !/lang="he"/.test(htmlTag[0])) {
    report('V1', 'error', htmlTag?.index ?? 0, '<html> must carry lang="he" dir="rtl"');
  }
  for (const s of slideChunks) {
    if (!/dir="rtl"/.test(s.tag)) {
      report('V1', 'error', s.start, 'Hebrew .slide <section> missing dir="rtl"');
    }
  }
}
if (slideChunks.length === 0) {
  report('V1', 'error', 0, 'no <section class="slide"> found — is this a deck?');
}

// ------------------------------------------------------------------- V2 ---
for (const m of markup.matchAll(/data-ink="([^"]*)"/g)) {
  if (!INKS.has(m[1])) {
    report('V2', 'error', m.index, `invalid data-ink="${m[1]}" (allowed: ${[...INKS].join('|')})`);
  }
}

// ------------------------------------------------------------------- V3 ---
for (const m of html.matchAll(/\p{Extended_Pictographic}/gu)) {
  if (!EMOJI_ALLOWLIST.has(m[0])) {
    report('V3', 'error', m.index, `emoji "${m[0]}" is forbidden`);
  }
}

// ------------------------------------------------------------------- V4 ---
// Only author-written content is checked: gradients inside slide markup and
// inline style attributes. The design system's own embedded CSS legitimately
// uses gradients for paper textures (paper-textures.css) and is exempt.
for (const s of slideChunks) {
  for (const m of s.body.matchAll(/(?:linear|radial|conic)-gradient\(/g)) {
    report('V4', 'error', s.start + m.index, 'CSS gradients are forbidden in slide content');
  }
}

// ------------------------------------------------------------------- V5 ---
for (const m of html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) {
  const url = m[1];
  if (!ALLOWED_HOSTS.some((h) => url.includes(h))) {
    report('V5', 'error', m.index, `external resource not on the approved CDN list: ${url}`);
  }
}

// ------------------------------------------------------------------- V6 ---
for (const m of markup.matchAll(/data-sketch="([^"]*)"/g)) {
  if (!SKETCHES.has(m[1])) {
    report('V6', 'error', m.index, `invalid data-sketch="${m[1]}" (allowed: ${[...SKETCHES].join('|')})`);
  }
}
for (const m of markup.matchAll(/data-chart="([^"]*)"/g)) {
  if (!CHARTS.has(m[1])) {
    report('V6', 'error', m.index, `invalid data-chart="${m[1]}" (allowed: ${[...CHARTS].join('|')})`);
  }
}
for (const m of markup.matchAll(/data-chart-config=(?:'([^']*)'|"([^"]*)")/g)) {
  const raw = decodeEntities(m[1] ?? m[2] ?? '');
  try {
    JSON.parse(raw);
  } catch (e) {
    report('V6', 'error', m.index, `data-chart-config is not valid JSON: ${e.message}`);
  }
}

// ------------------------------------------------------------------- V7 ---
// Heuristic: inside Hebrew text nodes (outside <bdi>, <script>, <style>,
// <svg>, <code>), Latin runs of 2+ letters or digit runs must be <bdi>-wrapped.
if (isHebrew) {
  for (const s of slideChunks) {
    const stripped = s.body
      .replace(/<script\b[\s\S]*?<\/script>/gi, blank)
      .replace(/<style\b[\s\S]*?<\/style>/gi, blank)
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, blank)
      .replace(/&[a-z#0-9]+;/gi, blank);
    let depthBdi = 0;
    const tokenRe = /<\/?bdi\b[^>]*>|<[^>]+>|[^<]+/g;
    let m;
    while ((m = tokenRe.exec(stripped)) !== null) {
      const tok = m[0];
      if (/^<bdi\b/i.test(tok)) depthBdi++;
      else if (/^<\/bdi/i.test(tok)) depthBdi = Math.max(0, depthBdi - 1);
      else if (!tok.startsWith('<') && depthBdi === 0) {
        const hasHebrew = /[֐-׿]/.test(tok);
        if (!hasHebrew) continue;
        for (const t of tok.matchAll(/[A-Za-z]{2,}|\d[\d,.:%+-]*\d|\d{2,}/g)) {
          report('V7', 'warn', s.start + m.index + t.index, `Latin/number "${t[0]}" inside Hebrew text without <bdi>`);
        }
      }
    }
  }
}

// ------------------------------------------------------------------- V8 ---
if (slideChunks.length >= 3) {
  const first = slideChunks[0].body;
  if (!/מקרא|legend/i.test(first)) {
    report('V8', 'warn', slideChunks[0].start, '3+ slides but no ink legend (מקרא) on the first slide');
  }
}

// ------------------------------------------------------------------- V9 ---
for (const s of slideChunks) {
  for (const ul of s.body.matchAll(/<ul\b[^>]*class="[^"]*sketch-list[^"]*"[^>]*>([\s\S]*?)<\/ul>/g)) {
    const items = (ul[1].match(/<li\b/g) || []).length;
    if (items < 3 || items > 6) {
      report('V9', 'warn', s.start + ul.index, `sketch-list has ${items} items (recommended 3–6)`);
    }
  }
  const cards = (s.body.match(/class="[^"]*sketch-card/g) || []).length;
  if (cards > 8) {
    report('V9', 'warn', s.start, `slide has ${cards} cards (recommended ≤ 8) — consider splitting`);
  }
}

// ------------------------------------------------------------------ V10 ---
const symbolIds = new Set([...markup.matchAll(/<symbol\b[^>]*id="([^"]+)"/g)].map((m) => m[1]));
// Icons the design system can inject at runtime (js/icons.js). A <use> that
// references one of these without inlining it is only a warning — it works in
// templates that load ds-base.js, but standalone decks should inline symbols.
let dsIcons = new Set();
try {
  const iconsJs = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '..', 'project', 'js', 'icons.js'),
    'utf8',
  );
  dsIcons = new Set([...iconsJs.matchAll(/['"](icon-[a-z0-9-]+)['"]/g)].map((m) => m[1]));
} catch { /* repo layout not available — treat every missing symbol as error */ }
for (const m of markup.matchAll(/<use\b[^>]*href="#([^"]+)"/g)) {
  if (symbolIds.has(m[1]) || /^sketch-hatch-/.test(m[1])) continue;
  if (dsIcons.has(m[1])) {
    report('V10', 'warn', m.index, `<use href="#${m[1]}"> relies on runtime sprite injection — inline the <symbol> for standalone decks`);
  } else {
    report('V10', 'error', m.index, `<use href="#${m[1]}"> has no matching inline <symbol> and is not a known DS icon`);
  }
}
for (const m of scan.matchAll(/class="[^"]*\b(fa-[a-z-]+|material-icons)\b[^"]*"/g)) {
  report('V10', 'error', m.index, `icon font "${m[1]}" is forbidden — inline SVG only`);
}

// ------------------------------------------------------------------ out ---
const errors = findings.filter((f) => f.severity === 'error');
const warns = findings.filter((f) => f.severity === 'warn');

if (asJson) {
  console.log(JSON.stringify({ file, slides: slideChunks.length, errors, warns }, null, 2));
} else {
  for (const f of findings.sort((a, b) => (a.line ?? 0) - (b.line ?? 0))) {
    console.log(`${f.severity === 'error' ? 'ERROR' : 'warn '} ${f.rule} L${f.line ?? '?'}: ${f.message}`);
  }
  console.log(`\n${basename(file)}: ${slideChunks.length} slides, ${errors.length} errors, ${warns.length} warnings`);
}
process.exit(errors.length > 0 ? 1 : 0);
