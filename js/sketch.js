/**
 * Sketch — hand-drawn SVG primitive engine for the workshop design system.
 *
 * Draws jittered (but seeded/stable) freehand strokes into any element
 * carrying data-sketch="<type>". Types: underline | highlight | circle |
 * box | arrow-h | arrow-v | cross.
 *
 * Usage:
 *   <span class="sketch-host ink-blue" data-sketch="underline">future state</span>
 *   <span class="flow-arrow" data-sketch="arrow-h"></span>
 *
 * Stroke color comes from CSS `color` (the SVG uses stroke="currentColor"),
 * so theme/ink-class changes need no redraw — only geometry changes
 * (resize, font load, direction change) trigger a redraw.
 */
(function () {
  'use strict';

  var SELECTOR = '[data-sketch]';
  var STROKE_W = 'var(--sketch-stroke-w)';

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return h;
  }

  function seedFor(el, idx) {
    var key = el.getAttribute('data-sketch-seed') || (el.id || '') + ':' + idx;
    return hashString(key);
  }

  function svgEl(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }

  function jitter(rand, amt) { return (rand() - 0.5) * amt; }

  /** Rough single line between two points, `passes` overlapping strokes. */
  function roughLine(rand, x1, y1, x2, y2, amt, passes) {
    var d = '';
    for (var p = 0; p < passes; p++) {
      var a = amt * (p === 0 ? 1 : 1.5);
      var sx = x1 + jitter(rand, a * 0.6);
      var sy = y1 + jitter(rand, a * 0.6);
      var ex = x2 + jitter(rand, a * 0.6);
      var ey = y2 + jitter(rand, a * 0.6);
      var mx = (x1 + x2) / 2 + jitter(rand, a);
      var my = (y1 + y2) / 2 + jitter(rand, a);
      d += 'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
           ' Q ' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' +
           ex.toFixed(1) + ' ' + ey.toFixed(1) + ' ';
    }
    return d;
  }

  /** Rough closed rect — 4 independently-jittered sides with slight corner overshoot. */
  function roughRect(rand, x, y, w, h, amt, dashed) {
    var o = amt * 0.9; // corner overshoot
    var pts = [
      [x - o * 0.3, y], [x + w + o * 0.3, y],
      [x + w, y - o * 0.3], [x + w, y + h + o * 0.3],
      [x + w + o * 0.3, y + h], [x - o * 0.3, y + h],
      [x, y + h + o * 0.3], [x, y - o * 0.3]
    ];
    var d = '';
    d += roughLine(rand, pts[0][0], pts[0][1], pts[1][0], pts[1][1], amt, 1);
    d += roughLine(rand, pts[2][0], pts[2][1], pts[3][0], pts[3][1], amt, 1);
    d += roughLine(rand, pts[4][0], pts[4][1], pts[5][0], pts[5][1], amt, 1);
    d += roughLine(rand, pts[6][0], pts[6][1], pts[7][0], pts[7][1], amt, 1);
    return d;
  }

  /** Rough ellipse via perimeter beziers with radial jitter. */
  function roughEllipse(rand, cx, cy, rx, ry, amt, passes) {
    var d = '';
    var steps = 10;
    for (var p = 0; p < passes; p++) {
      var a = amt * (p === 0 ? 1 : 1.4);
      var rot = jitter(rand, 0.15);
      var prevX, prevY, firstX, firstY;
      for (var i = 0; i <= steps; i++) {
        var t = (i / steps) * Math.PI * 2 + rot;
        var jr = 1 + jitter(rand, a / Math.max(rx, ry));
        var x = cx + Math.cos(t) * rx * jr;
        var y = cy + Math.sin(t) * ry * jr;
        if (i === 0) { d += 'M ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' '; firstX = x; firstY = y; }
        else d += 'L ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
        prevX = x; prevY = y;
      }
    }
    return d;
  }

  function path(d, extraClass) {
    var p = svgEl('path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', 'var(--sketch-stroke-w)');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    if (extraClass) p.setAttribute('class', extraClass);
    return p;
  }

  function ensureSvg(el) {
    var svg = el.querySelector(':scope > svg.sketch-svg');
    if (!svg) {
      svg = svgEl('svg');
      svg.setAttribute('class', 'sketch-svg');
      svg.style.position = 'absolute';
      svg.style.inset = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.overflow = 'visible';
      svg.style.pointerEvents = 'none';
      var cs = getComputedStyle(el);
      if (cs.position === 'static') el.style.position = 'relative';
      // Give the host its own stacking context (position != static + a
      // real z-index) so a negative z-index on the svg child is scoped to
      // "behind this element's own content", not to whatever distant
      // ancestor happens to establish the nearest actual stacking context.
      if (cs.zIndex === 'auto') el.style.zIndex = '0';
      el.appendChild(svg);
    }
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    return svg;
  }

  function drawArrowhead(svg, rand, tipX, tipY, angle, size) {
    var a1 = angle + Math.PI - 0.42;
    var a2 = angle + Math.PI + 0.42;
    var x1 = tipX + Math.cos(a1) * size, y1 = tipY + Math.sin(a1) * size;
    var x2 = tipX + Math.cos(a2) * size, y2 = tipY + Math.sin(a2) * size;
    svg.appendChild(path(roughLine(rand, tipX, tipY, x1, y1, 1.4, 1)));
    svg.appendChild(path(roughLine(rand, tipX, tipY, x2, y2, 1.4, 1)));
  }

  function drawOne(el, idx) {
    var type = el.getAttribute('data-sketch');
    var w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    var rand = mulberry32(seedFor(el, idx));
    var amt = parseFloat(getComputedStyle(el).getPropertyValue('--sketch-jitter')) || 3.5;
    var svg = ensureSvg(el);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('preserveAspectRatio', 'none');
    /* Strokes that annotate existing text (highlight/underline/circle) must
       sit BEHIND the glyphs, so those specifically get a negative z-index.
       Standalone marks (arrow-h/arrow-v/box/cross) have no text to hide
       behind — leave them at the default stacking order. A negative
       z-index here previously made every flow-arrow / timeline-track
       invisible: the host span has `position: relative` but no z-index of
       its own, so it never establishes a stacking context, and the SVG's
       z-index:-1 escaped to a distant ancestor's stacking context instead
       of just "behind this element" — rendering behind unrelated opaque
       backgrounds several levels up the tree. */
    if (type === 'highlight' || type === 'underline' || type === 'circle') {
      svg.style.zIndex = '-1';
    }

    switch (type) {
      case 'underline': {
        var y = h * 0.82;
        svg.appendChild(path(roughLine(rand, w * 0.02, y, w * 0.98, y + jitter(rand, amt * 0.6), amt, 1), 'sketch-underline'));
        break;
      }
      case 'highlight': {
        var pad = 3;
        var d = roughRect(rand, pad, h * 0.12, w - pad * 2, h * 0.76, amt * 0.8);
        var fillPath = path(d, 'sketch-highlight-fill');
        fillPath.setAttribute('fill', 'currentColor');
        fillPath.setAttribute('stroke', 'none');
        fillPath.setAttribute('opacity', '0.32');
        svg.insertBefore(fillPath, svg.firstChild);
        break;
      }
      case 'circle': {
        svg.appendChild(path(roughEllipse(rand, w / 2, h / 2, w / 2 - 2, h / 2 - 2, amt, 2)));
        break;
      }
      case 'box': {
        svg.appendChild(path(roughRect(rand, 3, 3, w - 6, h - 6, amt)));
        break;
      }
      case 'arrow-h': {
        var midY = h / 2;
        var rtl = getComputedStyle(el).direction === 'rtl';
        var startX = rtl ? w - 4 : 4, endX = rtl ? 4 : w - 4;
        svg.appendChild(path(roughLine(rand, startX, midY, endX, midY, amt, 1), 'sketch-arrow-shaft'));
        drawArrowhead(svg, rand, endX, midY, rtl ? Math.PI : 0, Math.min(12, w * 0.28));
        break;
      }
      case 'arrow-v': {
        var midX = w / 2;
        svg.appendChild(path(roughLine(rand, midX, 4, midX, h - 4, amt, 1), 'sketch-arrow-shaft'));
        drawArrowhead(svg, rand, midX, h - 4, Math.PI / 2, Math.min(12, h * 0.28));
        break;
      }
      case 'cross': {
        /* two near-horizontal strike lines (consultant crossing out a
           line item) — NOT a full X, which renders illegible over text */
        svg.appendChild(path(roughLine(rand, w * 0.03, h * 0.42, w * 0.97, h * 0.48, amt, 1)));
        svg.appendChild(path(roughLine(rand, w * 0.04, h * 0.62, w * 0.96, h * 0.57, amt, 1)));
        break;
      }
    }
  }

  function refresh(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) drawOne(nodes[i], i);
  }

  var raf = null;
  function scheduleRefresh(root) {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { refresh(root); });
  }

  /** Animate the strokes inside a sketch host drawing themselves on reveal. */
  function animateDraw(hostEl) {
    var paths = hostEl.querySelectorAll('.sketch-svg path');
    paths.forEach(function (p) {
      var len;
      try { len = p.getTotalLength(); } catch (e) { return; }
      p.style.transition = 'none';
      p.style.strokeDasharray = len + ' ' + len;
      p.style.strokeDashoffset = len;
      p.classList.add('sketch-draw-path');
      // force reflow so the transition below actually animates
      p.getBoundingClientRect();
      requestAnimationFrame(function () {
        p.style.transition = '';
        p.style.strokeDashoffset = '0';
      });
    });
  }

  window.Sketch = { refresh: refresh, scheduleRefresh: scheduleRefresh, animateDraw: animateDraw };

  document.addEventListener('DOMContentLoaded', function () { scheduleRefresh(); });
  window.addEventListener('resize', function () { scheduleRefresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { scheduleRefresh(); });
  }
})();
