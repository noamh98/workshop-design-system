#!/usr/bin/env node
/**
 * render-check.mjs — visual QA gate for Workshop Design System decks.
 *
 * Opens the deck in headless Chromium, screenshots every .slide, and reports
 * overflow, card overlaps, console errors, and failed network requests.
 *
 * Usage:  node scripts/render-check.mjs <deck.html> [--out <dir>] [--json]
 * Exit codes: 0 = clean, 1 = visual problems found, 2 = usage/launch error.
 *
 * Requires playwright-core (npm install inside scripts/). Chromium binary is
 * resolved from PLAYWRIGHT_BROWSERS_PATH or a system chromium.
 */

import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, basename, join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const outIdx = args.indexOf('--out');
const file = args.find((a) => !a.startsWith('--') && a !== args[outIdx + 1]);
if (!file) {
  console.error('usage: node scripts/render-check.mjs <deck.html> [--out <dir>] [--json]');
  process.exit(2);
}
const outDir = resolve(outIdx > -1 ? args[outIdx + 1] : `render-check-${basename(file, '.html')}`);
mkdirSync(outDir, { recursive: true });

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers'].filter(Boolean);
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const d of readdirSync(root)) {
      if (d.startsWith('chromium-')) {
        const bin = join(root, d, 'chrome-linux', 'chrome');
        if (existsSync(bin)) return bin;
      }
    }
  }
  for (const bin of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
    if (existsSync(bin)) return bin;
  }
  return null;
}

const executablePath = findChromium();
if (!executablePath) {
  console.error('no Chromium binary found (set CHROMIUM_PATH or PLAYWRIGHT_BROWSERS_PATH)');
  process.exit(2);
}

const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1960, height: 1140 } });

// Serve this repo's jsDelivr URLs from the local checkout — deterministic,
// offline-friendly, and always tests the current working-tree assets.
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await page.route('**cdn.jsdelivr.net/gh/noamh98/workshop-design-system@*/**', async (route) => {
  const m = route.request().url().match(/workshop-design-system@[^/]+\/(.+?)(?:\?.*)?$/);
  const local = m && resolve(repoRoot, m[1]);
  if (local && local.startsWith(repoRoot) && existsSync(local)) {
    const types = { css: 'text/css', js: 'text/javascript', svg: 'image/svg+xml', woff2: 'font/woff2' };
    await route.fulfill({ path: local, contentType: types[local.split('.').pop()] || 'application/octet-stream' });
  } else {
    await route.continue();
  }
});

const consoleErrors = [];
const failedRequests = [];
const fontWarnings = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('requestfailed', (req) => {
  const entry = `${req.url()} — ${req.failure()?.errorText}`;
  // Google-hosted display fonts are progressive enhancement; the hand-print
  // fonts ship from the repo. A blocked fonts CDN must not fail the gate.
  if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) fontWarnings.push(entry);
  else failedRequests.push(entry);
});

await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.fonts?.ready);

// reveal.js keeps elements transparent until scrolled into view — neutralize
// that for screenshots. Slide visibility itself is handled per slide below.
await page.addStyleTag({
  content: `[data-animate], [data-reveal], .reveal { opacity: 1 !important; transform: none !important; }`,
});
await page.waitForTimeout(1200); // let sketch.js/charts.js draw strokes

const slides = await page.locator('section.slide').all();
const results = [];

for (let i = 0; i < slides.length; i++) {
  const slide = slides[i];
  // Fullscreen decks and templates show one slide at a time (.is-active on
  // the slide, or a display:none wrapper like .brief-stage.inactive). Drive
  // the deck's own mechanism where possible, force visibility otherwise, and
  // undo any forcing from the previous slide first.
  const activated = await slide.evaluate((el) => {
    for (const n of document.querySelectorAll('[data-rc-forced]')) {
      n.style.display = '';
      if (n.dataset.rcForced === 'inactive') n.classList.add('inactive');
      delete n.dataset.rcForced;
    }
    const hidden = [];
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (getComputedStyle(n).display === 'none') hidden.push(n);
    }
    if (hidden.length === 0) return false;
    document.querySelectorAll('section.slide').forEach((s) => s.classList.remove('is-active'));
    el.classList.add('is-active');
    for (const n of hidden) {
      if (n.classList.contains('inactive')) {
        n.classList.remove('inactive');
        n.dataset.rcForced = 'inactive';
      }
      if (getComputedStyle(n).display === 'none') {
        n.style.setProperty('display', 'block', 'important');
        n.dataset.rcForced = n.dataset.rcForced || 'display';
      }
    }
    return true;
  });
  if (activated) {
    await page.evaluate(() => {
      window.Charts?.init?.();
      window.Sketch?.refresh?.();
    });
    await page.waitForTimeout(700);
  }
  await slide.scrollIntoViewIfNeeded().catch(() => {});
  const problems = [];

  const metrics = await slide.evaluate((el) => {
    const overflow = {
      x: el.scrollWidth - el.clientWidth,
      y: el.scrollHeight - el.clientHeight,
    };
    // any descendant spilling outside the slide box
    const box = el.getBoundingClientRect();
    const spills = [];
    for (const child of el.querySelectorAll('.sketch-card, .sketch-dash__title, .sketch-flow, table, [data-chart]')) {
      const r = child.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > box.right + 4 || r.bottom > box.bottom + 4 || r.left < box.left - 4) {
        spills.push(`${child.className || child.tagName} spills outside the slide`);
      }
    }
    // pairwise card overlap (non-nested cards only)
    const cards = [...el.querySelectorAll('.sketch-card')].filter(
      (c) => !c.parentElement.closest('.sketch-card'),
    );
    const overlaps = [];
    for (let a = 0; a < cards.length; a++) {
      for (let b = a + 1; b < cards.length; b++) {
        const ra = cards[a].getBoundingClientRect();
        const rb = cards[b].getBoundingClientRect();
        const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (ox > 8 && oy > 8) overlaps.push(`cards ${a + 1} and ${b + 1} overlap ${Math.round(ox)}×${Math.round(oy)}px`);
      }
    }
    return { overflow, spills, overlaps, label: el.getAttribute('aria-label') || '' };
  });

  if (metrics.overflow.x > 2) problems.push(`horizontal overflow of ${metrics.overflow.x}px`);
  if (metrics.overflow.y > 2) problems.push(`vertical overflow of ${metrics.overflow.y}px`);
  problems.push(...metrics.spills, ...metrics.overlaps);

  const shot = join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await slide.screenshot({ path: shot, timeout: 15000 }).catch((e) => {
    problems.push(`screenshot failed: ${e.message.split('\n')[0]}`);
  });
  results.push({ slide: i + 1, label: metrics.label, problems, screenshot: shot });
}

await browser.close();

// "Failed to load resource" console noise duplicates requestfailed events,
// which are already classified above (font CDN = warning, anything else =
// blocking via failedRequests) — count only genuine script errors here.
const blockingConsoleErrors = consoleErrors.filter((e) => !/Failed to load resource/.test(e));
const summary = {
  file,
  slides: results.length,
  consoleErrors,
  failedRequests,
  fontWarnings,
  results,
  clean: results.every((r) => r.problems.length === 0) && failedRequests.length === 0 && blockingConsoleErrors.length === 0,
};

if (asJson) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  for (const r of results) {
    const status = r.problems.length === 0 ? 'ok  ' : 'FAIL';
    console.log(`${status} slide ${r.slide} "${r.label}" → ${r.screenshot}`);
    for (const p of r.problems) console.log(`       - ${p}`);
  }
  for (const e of consoleErrors) console.log(`console error: ${e}`);
  for (const f of failedRequests) console.log(`request failed: ${f}`);
  console.log(`\n${basename(file)}: ${results.length} slides, ${summary.clean ? 'CLEAN' : 'PROBLEMS FOUND'}`);
}
process.exit(summary.clean ? 0 : 1);
