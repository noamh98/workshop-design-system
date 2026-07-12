#!/usr/bin/env node
/*
 * check-links.mjs
 * ------------------------------------------------------------------
 * Wave 3/5 — dependency-free local asset checker.
 *
 * Scans HTML files for href/src/url() references and verifies that every
 * LOCAL reference resolves to a file that exists on disk. External refs
 * (http/https///, data:, mailto:, tel:, #anchors) are ignored.
 *
 * Usage:
 *   node scripts/check-links.mjs [--warn] [paths...]   (default: decks)
 *
 * Exit code: 0 when clean (or --warn), 1 when broken local refs found.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';

const args = process.argv.slice(2);
const warnOnly = args.includes('--warn');
const roots = args.filter((a) => !a.startsWith('--'));
const scanRoots = roots.length ? roots : ['decks'];

function collectHtml(target, acc) {
  if (!existsSync(target)) return acc;
  if (statSync(target).isDirectory()) {
    for (const n of readdirSync(target)) collectHtml(join(target, n), acc);
  } else if (extname(target).toLowerCase() === '.html') acc.push(target);
  return acc;
}

function isLocal(ref) {
  if (!ref) return false;
  return !/^(https?:)?\/\//i.test(ref) &&
    !ref.startsWith('data:') && !ref.startsWith('#') &&
    !ref.startsWith('mailto:') && !ref.startsWith('tel:') &&
    !ref.startsWith('javascript:');
}

const REFS = [
  /(?:href|src)\s*=\s*(["'])(.*?)\1/gi,
  /url\(\s*(["']?)([^)'"]+)\1\s*\)/gi,
];

function checkFile(file) {
  const errors = [];
  const text = readFileSync(file, 'utf8');
  const base = dirname(file);
  for (const re of REFS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const ref = m[2].trim();
      if (!isLocal(ref)) continue;
      const clean = ref.split('#')[0].split('?')[0];
      if (!clean) continue;
      if (!existsSync(resolve(base, clean))) {
        const line = text.slice(0, m.index).split(/\r?\n/).length;
        errors.push({ line, msg: `broken local reference: ${ref}` });
      }
    }
  }
  return errors;
}

const files = [];
for (const r of scanRoots) collectHtml(r, files);

let total = 0;
for (const file of files.sort()) {
  const errors = checkFile(file);
  if (errors.length) {
    total += errors.length;
    console.log(`\n${file}`);
    for (const e of errors) console.log(`  ${file}:${e.line}  ${e.msg}`);
  }
}

if (total === 0) {
  console.log(`check-links: OK — ${files.length} file(s) scanned, no broken local refs.`);
  process.exit(0);
}
console.log(`\ncheck-links: ${total} broken local reference(s).`);
process.exit(warnOnly ? 0 : 1);
