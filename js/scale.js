/**
 * Scale-to-fit — optional pixel-exact slide scaling for kiosk/projector decks.
 *
 * The system is fluid by default (see docs/README.md). This is the one
 * documented escape hatch: when you need a 1920x1080 slide letterboxed to fit
 * an arbitrary viewport *without* reflowing (PowerPoint-style), add
 * `data-scale-to-fit` to a `.slide` or to a wrapper element that contains one.
 *
 * scale = min(availableW / baseW, availableH / baseH)
 *   baseW/baseH default to 1920x1080; override with data-scale-base="W,H".
 *   By default the scale is clamped to <= 1 (only ever shrink, never blow up a
 *   slide past its native size). Opt into upscaling with data-scale-max="2".
 * transform-origin: top center, so the slide stays centered horizontally and
 * pinned to the top of its box.
 *
 * Dependency-free, file://-safe, and a complete no-op if no element opts in —
 * the fluid layout is untouched for every existing template.
 */
(function () {
  'use strict';

  var BASE_W = 1920;
  var BASE_H = 1080;
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The element we scale is the [data-scale-to-fit] host itself if it is a
  // .slide, otherwise the first .slide inside it. The element we measure for
  // available space is the host's parent (the layout box the slide sits in).
  function resolveTarget(host) {
    if (host.classList.contains('slide')) return host;
    return host.querySelector('.slide') || host;
  }

  function parsePair(str, fallbackW, fallbackH) {
    if (!str) return [fallbackW, fallbackH];
    var parts = str.split(',');
    var w = parseFloat(parts[0]);
    var h = parseFloat(parts[1]);
    return [isFinite(w) && w > 0 ? w : fallbackW,
            isFinite(h) && h > 0 ? h : fallbackH];
  }

  function measureBox(host) {
    // Prefer the parent's content box; fall back to the viewport.
    var box = host.parentElement || document.documentElement;
    var rect = box.getBoundingClientRect();
    var w = rect.width || window.innerWidth;
    var h = rect.height || window.innerHeight;
    // If the parent has collapsed to the slide's own (scaled) height we would
    // feedback-loop; fall back to the viewport height in that degenerate case.
    if (h < 2) h = window.innerHeight;
    return [w, h];
  }

  function applyScale(host) {
    var target = resolveTarget(host);
    if (!target) return;

    var base = parsePair(host.getAttribute('data-scale-base'), BASE_W, BASE_H);
    var baseW = base[0], baseH = base[1];

    var maxScale = parseFloat(host.getAttribute('data-scale-max'));
    if (!isFinite(maxScale) || maxScale <= 0) maxScale = 1;

    var box = measureBox(host);
    var scale = Math.min(box[0] / baseW, box[1] / baseH);
    if (scale > maxScale) scale = maxScale;
    if (!isFinite(scale) || scale <= 0) scale = 1;

    // Pin the slide to an exact base pixel size, then scale the whole box.
    target.style.width = baseW + 'px';
    target.style.height = baseH + 'px';
    target.style.aspectRatio = 'auto';
    target.style.maxWidth = 'none';
    target.style.transformOrigin = 'top center';
    target.style.transform = 'scale(' + scale + ')';
    if (!reduceMotion) target.style.transition = 'transform 0.15s ease-out';

    // Reserve the *scaled* footprint so surrounding flow/scrollbars are right,
    // without letting the reserved height feed back into the measured box.
    host.style.height = (baseH * scale) + 'px';
    host.style.overflow = 'hidden';

    host.setAttribute('data-scale-applied', scale.toFixed(4));
  }

  function refreshAll() {
    var hosts = document.querySelectorAll('[data-scale-to-fit]');
    for (var i = 0; i < hosts.length; i++) applyScale(hosts[i]);
  }

  var rafId = null;
  function scheduleRefresh() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(function () {
      rafId = null;
      refreshAll();
    });
  }

  function init() {
    var hosts = document.querySelectorAll('[data-scale-to-fit]');
    if (!hosts.length) return; // no-op: fluid default untouched

    refreshAll();

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(scheduleRefresh);
      for (var i = 0; i < hosts.length; i++) {
        // Observe the layout box, not the scaled slide (avoids feedback loops).
        ro.observe(hosts[i].parentElement || hosts[i]);
      }
      ro.observe(document.documentElement);
    } else {
      window.addEventListener('resize', scheduleRefresh);
    }

    // Re-fit once webfonts settle (metrics shift can change nothing here since
    // we pin px, but keep it consistent with the rest of the system).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleRefresh);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.WorkshopScale = { refresh: refreshAll, apply: applyScale };
})();
