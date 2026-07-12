#!/usr/bin/env node
/*
 * make-offline.mjs
 * ------------------------------------------------------------------
 * Wave 6 — air-gap / offline transform.
 *
 * Neutralises runtime CDN dependencies (primarily Google Fonts) in deck
 * HTML so it renders deterministically on a disconnected network (e.g.
 * IAI / air-gapped). It comments out <link>/<script> tags that point at
 * fonts.googleapis.com, fonts.gstatic.com and other CDNs, leaving a
 * traceable marker so the change is auditable.
 *
 * Usage:
 *   node scripts/make-offline.mjs <file...>          # writes *.offline.html
 *   node scripts/make-offline.mjs --apply <file...>  # rewrites in place
 *
 * NOTE: true offline typography also requires self-hosted @font-face
 * assets in the default style (tracked separately in the roadmap).
 */

import { readFileSync, writeFileSync } from 'node:fs';

const apply = process.argv.includes('--apply');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));

if (files.length === 0) {
  console.error('make-offline: pass one or more HTML files.');
  process.exit(1);
}

const CDN_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
];

// Match <link ...> / <script ...></script> / <script .../> tags.
const TAG_RE = /<link\b[^>]*>|<script\b[^>]*>(?:[\s\S]*?<\/script>)?/gi;

function isCdnTag(tag) {
  const lower = tag.toLowerCase();
  return CDN_HOSTS.some((h) => lower.includes(h));
}

let totalTags = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  let count = 0;
  const out = src.replace(TAG_RE, (tag) => {
    if (!isCdnTag(tag)) return tag;
    count++;
    // Escape angle brackets so the stored tag is inert and cannot be
    // re-matched on a subsequent run (keeps the transform idempotent).
    const inert = tag.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<!-- offline-disabled (make-offline): ${inert} -->`;
  });
  totalTags += count;
  const dest = apply ? file : file.replace(/\.html$/i, '.offline.html');
  writeFileSync(dest, out, 'utf8');
  console.log(`make-offline: ${file} -> ${dest} (${count} CDN tag(s) disabled)`);
}

console.log(`\nmake-offline: ${totalTags} CDN tag(s) disabled across ${files.length} file(s).`);
