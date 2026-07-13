#!/usr/bin/env node
/*
 * check-design-system.mjs
 * ------------------------------------------------------------------
 * Dependency-free validator for Workshop Design System decks.
 *
 * Enforces the hard design rules documented in
 *   decks/presentation-agent-instructions.md  (sections 2.2 and 6)
 *   project/css/ink-system.css                (the six-ink convention)
 *
 * It reads plain HTML with regexes only (no DOM library, no npm install)
 * so it runs on a bare Node runtime and stays true to the project's
 * "zero runtime dependencies" philosophy.
 *
 * Usage:
 *   node scripts/check-design-system.mjs [options] [paths...]
 *
 * Options:
 *   --warn        Report violations but always exit 0 (phased rollout).
 *   --quiet       Only print the final summary line.
 *   -h, --help    Show help.
 *
 * Paths default to "decks" when none are given. Each path may be a file
 * or a directory (directories are scanned recursively for *.html).
 *
 * Exit code: 0 when clean (or --warn), 1 when violations are found.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const VALID_INK = new Set(['black', 'blue', 'red', 'green', 'orange', 'purple']);
// Keep in sync with project/js/sketch.js (`npm run check:drift` catches doc drift,
// but this validator's own allow-list has to be updated here by hand too).
const VALID_SKETCH = new Set([
  'box', 'circle', 'loop', 'underline', 'underline-double', 'underline-wavy',
  'highlight', 'scribble', 'cross', 'strike-diag', 'bracket', 'star',
  'arrow-h', 'arrow-v', 'arrow-curve'
]);
// Keep in sync with project/js/charts.js TYPES registry.
const VALID_CHART = new Set(['donut', 'bar', 'bar-h', 'stacked-bar', 'line', 'scatter', 'gantt', 'waterfall']);
const GRADIENTS = ['linear-gradient', 'radial-gradient', 'conic-gradient'];

// Pictographic emoji blocks (kept narrow to avoid flagging normal punctuation).
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
  console.log(
    'Usage: node scripts/check-design-system.mjs [--warn] [--quiet] [paths...]\n' +
    'Validates Workshop Design System deck HTML against the six-ink and RTL rules.'
  );
  process.exit(0);
}
const warnOnly = args.includes('--warn');
const quiet = args.includes('--quiet');
const roots = args.filter((a) => !a.startsWith('--'));
const scanRoots = roots.length ? roots : ['decks'];

function collectHtml(target, acc) {
  if (!existsSync(target)) return acc;
  const st = statSync(target);
  if (st.isDirectory()) {
    for (const name of readdirSync(target)) collectHtml(join(target, name), acc);
  } else if (extname(target).toLowerCase() === '.html') {
    acc.push(target);
  }
  return acc;
}

/** Return the attribute-string of the first <html ...> tag, or null. */
function htmlOpenTag(text) {
  const m = text.match(/<html\b([^>]*)>/i);
  return m ? m[1] : null;
}

/** Iterate regex matches yielding {value, line} for attribute-style patterns. */
function* attrMatches(lines, re) {
  for (let i = 0; i < lines.length; i++) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(lines[i])) !== null) {
      yield { value: m[2], line: i + 1 };
    }
  }
}

function checkFile(file) {
  const errors = [];
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);

  // 1. <html> must declare lang="he" dir="rtl".
  const htmlAttrs = htmlOpenTag(text);
  if (htmlAttrs === null) {
    errors.push({ line: 1, msg: 'missing <html> tag' });
  } else {
    if (!/\blang\s*=\s*(["'])he\1/i.test(htmlAttrs)) {
      errors.push({ line: 1, msg: '<html> is missing lang="he"' });
    }
    if (!/\bdir\s*=\s*(["'])rtl\1/i.test(htmlAttrs)) {
      errors.push({ line: 1, msg: '<html> is missing dir="rtl"' });
    }
  }

  // 2. Every data-ink value must be one of the six semantic inks.
  for (const { value, line } of attrMatches(lines, /data-ink\s*=\s*(["'])(.*?)\1/gi)) {
    if (!VALID_INK.has(value)) {
      errors.push({ line, msg: `invalid data-ink="${value}" (allowed: ${[...VALID_INK].join(', ')})` });
    }
  }

  // 3. Every data-sketch value must be a known hand-drawn primitive.
  for (const { value, line } of attrMatches(lines, /data-sketch\s*=\s*(["'])(.*?)\1/gi)) {
    if (!VALID_SKETCH.has(value)) {
      errors.push({ line, msg: `invalid data-sketch="${value}" (allowed: ${[...VALID_SKETCH].join(', ')})` });
    }
  }

  // 4. Every data-chart value must be a supported chart type.
  for (const { value, line } of attrMatches(lines, /data-chart\s*=\s*(["'])(donut|bar|line|[^"']*)\1/gi)) {
    if (!VALID_CHART.has(value)) {
      errors.push({ line, msg: `invalid data-chart="${value}" (allowed: ${[...VALID_CHART].join(', ')})` });
    }
  }

  // 5. No CSS gradients, no emoji.
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    for (const g of GRADIENTS) {
      if (lower.includes(g)) errors.push({ line: i + 1, msg: `CSS gradient not allowed (${g})` });
    }
    if (EMOJI_RE.test(lines[i])) {
      errors.push({ line: i + 1, msg: 'emoji character not allowed' });
    }
  }

  // 6. Every <section class="... slide ...> must carry dir="rtl".
  const slideTag = /<section\b[^>]*\bclass\s*=\s*(["'])[^"']*\bslide\b[^"']*\1[^>]*>/gi;
  let sm;
  while ((sm = slideTag.exec(text)) !== null) {
    if (!/\bdir\s*=\s*(["'])rtl\1/i.test(sm[0])) {
      const line = text.slice(0, sm.index).split(/\r?\n/).length;
      errors.push({ line, msg: '<section class="slide"> is missing dir="rtl"' });
    }
  }

  return errors;
}

const files = [];
for (const r of scanRoots) collectHtml(r, files);

let total = 0;
let filesWithErrors = 0;
for (const file of files.sort()) {
  const errors = checkFile(file);
  if (errors.length) {
    filesWithErrors++;
    total += errors.length;
    if (!quiet) {
      console.log(`\n${file}`);
      for (const e of errors) console.log(`  ${file}:${e.line}  ${e.msg}`);
    }
  }
}

const label = warnOnly ? 'warnings' : 'errors';
if (total === 0) {
  console.log(`design-system-check: OK — ${files.length} file(s) scanned, no violations.`);
  process.exit(0);
}
console.log(`\ndesign-system-check: ${total} ${label} in ${filesWithErrors}/${files.length} file(s).`);
process.exit(warnOnly ? 0 : 1);
