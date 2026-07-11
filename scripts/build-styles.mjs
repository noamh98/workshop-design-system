#!/usr/bin/env node
/*
 * build-styles.mjs
 * ------------------------------------------------------------------
 * Wave 4 (build pipeline) — dependency-free CSS bundler.
 *
 * Resolves the @import graph of an entry stylesheet (default
 * project/styles.css) and concatenates every LOCAL stylesheet into a
 * single bundle, in cascade order. External imports (http/https///) are
 * hoisted to the top of the bundle so the output stays valid CSS
 * (@import rules must precede all other rules).
 *
 * The design system stays "zero runtime dependencies": this is an
 * optional authoring convenience, not a required build step.
 *
 * Usage:
 *   node scripts/build-styles.mjs [--entry <file>] [--out <file>]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const entry = arg('--entry', 'project/styles.css');
const out = arg('--out', 'dist/styles.bundle.css');
const IMPORT_RE = /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?\s*;/g;

const seen = new Set();
const externals = [];

function isExternal(spec) {
  return /^(https?:)?\/\//i.test(spec) || spec.startsWith('data:');
}

function expand(file) {
  const abs = resolve(file);
  if (seen.has(abs)) return '';
  seen.add(abs);
  if (!existsSync(abs)) {
    console.error(`build-styles: WARNING missing import: ${file}`);
    return '';
  }
  const css = readFileSync(abs, 'utf8');
  const base = dirname(abs);
  const rel = relative(process.cwd(), abs);
  const expanded = css.replace(IMPORT_RE, (full, spec) => {
    if (isExternal(spec)) {
      if (!externals.includes(spec)) externals.push(spec);
      return '';
    }
    return expand(resolve(base, spec));
  });
  const trimmed = expanded.trim();
  if (!trimmed) return '';
  return `\n/* ==== ${rel} ==== */\n${trimmed}\n`;
}

const body = expand(entry);
const head = `/* Bundled by scripts/build-styles.mjs from ${entry}. Do not edit by hand. */\n`;
const ext = externals.map((s) => `@import url('${s}');`).join('\n');
const bundle = head + (ext ? ext + '\n' : '') + body;

mkdirSync(dirname(resolve(out)), { recursive: true });
writeFileSync(out, bundle, 'utf8');
console.log(`build-styles: wrote ${out} (${seen.size} stylesheet(s) inlined, ${externals.length} external kept).`);
