#!/usr/bin/env node
/*
 * check-knowledge-drift.mjs
 * ------------------------------------------------------------------
 * Dependency-free drift checker between the design system's engines
 * (source of truth) and the instruction/knowledge docs that hand-copy
 * their allow-lists (Claude skills, Copilot Studio knowledge, agent
 * instructions, contributor docs).
 *
 * Every engine that accepts a fixed set of attribute values keeps
 * that set in exactly one place in code. Docs that repeat the set as
 * a pipe-delimited allow-list (data-sketch="a|b|c") drift silently
 * when the engine grows a new value and nobody updates every copy —
 * this happened in practice (see MERGE_REPORT.md / git history on
 * project/readme.md and .claude/skills/workshop-design/SKILL.md).
 *
 * This script does not fix drift, only reports it. Exit codes:
 *   0 = no drift found
 *   1 = drift found (missing and/or unknown values in at least one doc)
 *
 * Usage: node scripts/check-knowledge-drift.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

function read(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

// ---- canonical allow-lists, extracted from the engines themselves ---------

function extractCanonSketch() {
  const src = read('project/js/sketch.js');
  const values = new Set();
  for (const m of src.matchAll(/case '([a-z-]+)':/g)) values.add(m[1]);
  return values;
}

function extractCanonChart() {
  const src = read('project/js/charts.js');
  const block = src.match(/var TYPES = \{([\s\S]*?)\};/);
  if (!block) throw new Error('Could not locate TYPES registry in project/js/charts.js');
  const values = new Set();
  for (const m of block[1].matchAll(/'([a-z-]+)':/g)) values.add(m[1]);
  return values;
}

const CANON = {
  'data-sketch': extractCanonSketch(),
  'data-chart': extractCanonChart(),
};

// ---- walk the repo for doc files that hard-code an allow-list -------------

const SCAN_DIRS = ['docs', 'project/docs', 'copilot-agent', 'decks', '.claude/skills'];
const SCAN_ROOT_FILES = ['README.md', 'CONTRIBUTING.md', 'project/readme.md'];
const SCAN_EXT = new Set(['.md', '.txt', '.html']);
const SKIP_DIRS = new Set(['node_modules', '.git']);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(join(ROOT, dir));
  } catch {
    return out;
  }
  for (const name of entries) {
    const rel = join(dir, name);
    if (SKIP_DIRS.has(name)) continue;
    const abs = join(ROOT, rel);
    if (statSync(abs).isDirectory()) {
      walk(rel, out);
    } else if (SCAN_EXT.has(extname(name))) {
      out.push(rel);
    }
  }
  return out;
}

const files = new Set(SCAN_ROOT_FILES);
for (const dir of SCAN_DIRS) for (const f of walk(dir)) files.add(f);

// Generated deck output isn't an instruction doc — real decks only ever use
// a single data-chart/data-sketch value per element, never a pipe-list, so
// they wouldn't match anyway, but exclude them explicitly for clarity.
const EXCLUDE_RE = /^decks\/(?!presentation-agent-instructions\.md$).*\.html$/;

// ---- check each file for a pipe-delimited enumeration of each attribute ---

// Two ways docs write out an allow-list: the literal HTML attribute
// (`data-sketch="a|b|c"`) and a markdown paren-aside (`` `data-sketch`
// (`a|b|c`) ``, as used in docs/AGENT.md).
const ATTR_RE = {
  'data-sketch': /data-sketch(?:="|`\s*\(`)([a-z][a-z-]*(?:\|[a-z][a-z-]*)+)[`"]/g,
  'data-chart': /data-chart(?:="?|`\s*\(`)([a-z][a-z-]*(?:\|[a-z][a-z-]*)+)[`"]/g,
};

let drift = 0;

for (const rel of files) {
  if (EXCLUDE_RE.test(rel)) continue;
  const text = read(rel);
  for (const [attr, re] of Object.entries(ATTR_RE)) {
    for (const m of text.matchAll(re)) {
      const found = new Set(m[1].split('|'));
      const canon = CANON[attr];
      const missing = [...canon].filter((v) => !found.has(v));
      const unknown = [...found].filter((v) => !canon.has(v));
      if (missing.length || unknown.length) {
        drift++;
        console.log(`\n${rel}: ${attr} list is stale`);
        console.log(`  found:   ${[...found].sort().join('|')}`);
        if (missing.length) console.log(`  missing: ${missing.sort().join('|')}`);
        if (unknown.length) console.log(`  unknown: ${unknown.sort().join('|')}`);
      }
    }
  }
}

if (drift) {
  console.log(`\n${drift} stale allow-list(s) found. Source of truth: project/js/sketch.js, project/js/charts.js.`);
  process.exit(1);
} else {
  console.log('check-knowledge-drift: no drift found.');
  process.exit(0);
}
