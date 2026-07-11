#!/usr/bin/env node
/*
 * normalize-filenames.mjs
 * ------------------------------------------------------------------
 * Wave 0/1 — rename Hebrew/spaced deck filenames to latin kebab-case.
 *
 * The heavy (~2 MB) HTML artifacts cannot be safely rewritten through
 * the GitHub contents API, so this script performs the renames with
 * `git mv` inside a real clone (history + blob preserved). It is
 * data-driven (scripts/filename-map.json) and idempotent.
 *
 * Usage:
 *   node scripts/normalize-filenames.mjs            # dry-run (default)
 *   node scripts/normalize-filenames.mjs --apply    # perform git mv
 *
 * Run from the repository root, on a feature branch, then open a PR.
 */

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const apply = process.argv.includes('--apply');
const here = dirname(fileURLToPath(import.meta.url));
const map = JSON.parse(readFileSync(resolve(here, 'filename-map.json'), 'utf8'));

function inGitRepo() {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (apply && !inGitRepo()) {
  console.error('normalize-filenames: not a git repository. Run from the repo root.');
  process.exit(1);
}

let planned = 0;
let done = 0;
let skipped = 0;

for (const { from, to, title } of map.renames) {
  const hasFrom = existsSync(from);
  const hasTo = existsSync(to);
  if (!hasFrom && hasTo) {
    skipped++;
    console.log(`= already renamed: ${to}`);
    continue;
  }
  if (!hasFrom) {
    skipped++;
    console.log(`? source missing (skip): ${from}`);
    continue;
  }
  if (hasTo) {
    skipped++;
    console.log(`! target exists (skip): ${to}`);
    continue;
  }
  planned++;
  if (!apply) {
    console.log(`DRY  ${from}  ->  ${to}   (${title})`);
    continue;
  }
  execFileSync('git', ['mv', '--', from, to], { stdio: 'inherit' });
  done++;
  console.log(`MOVED ${from}  ->  ${to}   (${title})`);
}

console.log(
  `\nnormalize-filenames: ${apply ? `${done} renamed` : `${planned} planned (dry-run)`}, ${skipped} skipped.` +
  (apply ? '' : '  Re-run with --apply to perform the renames.')
);
