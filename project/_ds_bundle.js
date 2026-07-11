/* @ds-bundle: {"format":4,"namespace":"WorkshopDesignSystem_aa9a62","components":[{"name":"ICONS","sourcePath":"components/core/icons.js"},{"name":"ICON_NAMES","sourcePath":"components/core/icons.js"}],"sourceHashes":{"components/core/icons.js":"dd402f662458","js/charts.js":"5565487ae6f7","js/icons.js":"e7c0ab34b940","js/reveal.js":"8b44c8cb5de9","js/scale.js":"b6165ee0b4be","js/sketch.js":"fe2e9c7e5042","js/theme.js":"a794fc1215f6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WorkshopDesignSystem_aa9a62 = window.WorkshopDesignSystem_aa9a62 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/icons.js
try { (() => {
// AUTO-GENERATED from icons/sprite.svg — the canonical 40-icon stroke set
// (24x24 grid, stroke-width 1.75, round caps/joins, fill:none).
// Regenerate by re-parsing icons/sprite.svg; do not hand-edit paths.
const ICONS = {};
const ICON_NAMES = Object.keys(ICONS);
Object.assign(__ds_scope, { ICONS, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/icons.js", error: String((e && e.message) || e) }); }

// js/charts.js
try { (() => {
/**
 * Charts — minimal SVG chart renderer (donut, bar, line, progress).
 * No canvas, no external library. Auto-initializes any element carrying
 * data-chart="donut|bar|line" + data-chart-config='{...JSON...}'.
 *
 * Config shapes:
 *   donut: { segments: [{value, color, label}], thickness, centerLabel, centerValue }
 *   bar:   { data: [{label, value, color}], max }
 *   line:  { points: [n, n, n...], color, rough, area }
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function donut(host, cfg) {
    var size = cfg.size || 120;
    var thickness = cfg.thickness || 16;
    var r = (size - thickness) / 2;
    var c = size / 2;
    var circumference = 2 * Math.PI * r;
    var total = cfg.segments.reduce(function (s, seg) {
      return s + seg.value;
    }, 0) || 1;
    var svg = el('svg', {
      viewBox: '0 0 ' + size + ' ' + size,
      width: '100%',
      height: '100%'
    });
    svg.appendChild(el('circle', {
      cx: c,
      cy: c,
      r: r,
      fill: 'none',
      stroke: 'var(--color-hairline)',
      'stroke-width': thickness
    }));
    var offset = 0;
    cfg.segments.forEach(function (seg, i) {
      var frac = seg.value / total;
      var len = frac * circumference;
      var circle = el('circle', {
        cx: c,
        cy: c,
        r: r,
        fill: 'none',
        stroke: seg.color || 'var(--chart-' + (i % 6 + 1) + ')',
        'stroke-width': thickness,
        'stroke-dasharray': len.toFixed(2) + ' ' + (circumference - len).toFixed(2),
        'stroke-dashoffset': (-offset).toFixed(2),
        'stroke-linecap': 'butt',
        transform: 'rotate(-90 ' + c + ' ' + c + ')'
      });
      circle.style.transition = 'stroke-dasharray var(--duration-slow) var(--ease-expressive)';
      svg.appendChild(circle);
      offset += len;
    });
    if (cfg.centerValue) {
      var fo = el('foreignObject', {
        x: 0,
        y: 0,
        width: size,
        height: size
      });
      var div = document.createElement('div');
      div.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;';
      div.innerHTML = '<span style="font-family:var(--font-display);font-weight:600;font-size:' + size * 0.16 + 'px;color:var(--color-ink);">' + cfg.centerValue + '</span>' + (cfg.centerLabel ? '<span style="font-size:' + size * 0.07 + 'px;color:var(--color-ink-3);">' + cfg.centerLabel + '</span>' : '');
      fo.appendChild(div);
      svg.appendChild(fo);
    }
    host.appendChild(svg);
  }
  function bar(host, cfg) {
    var w = 100,
      h = 60;
    var max = cfg.max || Math.max.apply(null, cfg.data.map(function (d) {
      return d.value;
    })) * 1.15;
    var n = cfg.data.length;
    var gap = 2.5;
    var barW = (w - gap * (n - 1)) / n;
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + (h + 14),
      width: '100%',
      height: '100%',
      preserveAspectRatio: 'none'
    });
    cfg.data.forEach(function (d, i) {
      var barH = d.value / max * h;
      var x = i * (barW + gap);
      var y = h - barH;
      svg.appendChild(el('rect', {
        x: x.toFixed(2),
        y: y.toFixed(2),
        width: barW.toFixed(2),
        height: barH.toFixed(2),
        rx: 1.5,
        fill: d.color || 'var(--chart-1)'
      }));
      var label = el('text', {
        x: (x + barW / 2).toFixed(2),
        y: h + 10,
        'font-size': 5.5,
        'text-anchor': 'middle',
        fill: 'var(--color-ink-3)'
      });
      label.textContent = d.label;
      svg.appendChild(label);
    });
    host.appendChild(svg);
  }
  function line(host, cfg) {
    var w = 100,
      h = 40;
    var pts = cfg.points;
    var min = Math.min.apply(null, pts),
      max = Math.max.apply(null, pts);
    var range = max - min || 1;
    var step = w / (pts.length - 1);
    var coords = pts.map(function (v, i) {
      return [i * step, h - (v - min) / range * h];
    });
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      width: '100%',
      height: '100%',
      preserveAspectRatio: 'none'
    });
    var d = 'M ' + coords[0][0].toFixed(2) + ' ' + coords[0][1].toFixed(2) + ' ';
    if (cfg.rough) {
      var rand = mulberry32(cfg.seed || 7);
      for (var i = 1; i < coords.length; i++) {
        var a = coords[i - 1],
          b = coords[i];
        var mx = (a[0] + b[0]) / 2 + (rand() - 0.5) * 1.6;
        var my = (a[1] + b[1]) / 2 + (rand() - 0.5) * 1.6;
        d += 'Q ' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + b[0].toFixed(2) + ' ' + b[1].toFixed(2) + ' ';
      }
    } else {
      for (var j = 1; j < coords.length; j++) d += 'L ' + coords[j][0].toFixed(2) + ' ' + coords[j][1].toFixed(2) + ' ';
    }
    if (cfg.area) {
      var areaD = d + 'L ' + coords[coords.length - 1][0].toFixed(2) + ' ' + h + ' L ' + coords[0][0].toFixed(2) + ' ' + h + ' Z';
      svg.appendChild(el('path', {
        d: areaD,
        fill: cfg.color || 'var(--chart-1)',
        opacity: 0.14,
        stroke: 'none'
      }));
    }
    svg.appendChild(el('path', {
      d: d,
      fill: 'none',
      stroke: cfg.color || 'var(--chart-1)',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    coords.forEach(function (p, i) {
      if (i === coords.length - 1) {
        svg.appendChild(el('circle', {
          cx: p[0],
          cy: p[1],
          r: 2.4,
          fill: cfg.color || 'var(--chart-1)'
        }));
      }
    });
    host.appendChild(svg);
  }
  function render(host) {
    var type = host.getAttribute('data-chart');
    var raw = host.getAttribute('data-chart-config');
    if (!type || !raw) return;
    var cfg;
    try {
      cfg = JSON.parse(raw);
    } catch (e) {
      console.warn('Charts: bad data-chart-config JSON', e);
      return;
    }
    host.innerHTML = '';
    if (type === 'donut') donut(host, cfg);else if (type === 'bar') bar(host, cfg);else if (type === 'line') line(host, cfg);
  }
  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-chart]');
    for (var i = 0; i < nodes.length; i++) render(nodes[i]);
  }
  window.Charts = {
    init: init,
    donut: donut,
    bar: bar,
    line: line
  };
  document.addEventListener('DOMContentLoaded', function () {
    init();
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "js/charts.js", error: String((e && e.message) || e) }); }

// js/icons.js
try { (() => {
/**
 * Workshop icon library — runtime sprite injector.
 * One canonical stroke set (24×24 grid, stroke-width ~1.75, round caps/joins,
 * fill:none, currentColor) injected as a hidden <svg> at document start, so
 * every page — including file:// and single-file bundles — can reference
 * glyphs with <svg class="icon"><use href="#icon-name"></use></svg>.
 * Dependency-free. Safe to load twice (id-guarded).
 */
(function () {
  'use strict';

  var SPRITE = '<defs>' +
  // ---- patterns (duotone hatch fills) ----
  '<pattern id="sketch-hatch-red" class="ink-red" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" stroke-width="1.6"></line></pattern>' + '<pattern id="sketch-hatch-blue" class="ink-blue" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" stroke-width="1.6"></line></pattern>' + '<pattern id="sketch-hatch-green" class="ink-green" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="1.2"></line></pattern>' +
  // ---- core ----
  '<symbol id="icon-check" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-warning" viewBox="0 0 24 24"><path d="M12 4.2L21 19.5H3L12 4.2z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" fill="none"></path><path d="M12 10v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path><circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none"></circle></symbol>' + '<symbol id="icon-alert-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.3" stroke="currentColor" stroke-width="1.7" fill="none"></circle><path d="M12 8v5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path><circle cx="12" cy="16.3" r="0.95" fill="currentColor" stroke="none"></circle></symbol>' + '<symbol id="icon-search" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" stroke-width="1.75" fill="none"></circle><path d="M15.5 15.5L20 20" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-pencil" viewBox="0 0 24 24"><path d="M14.5 4.5l5 5L8 21H3v-5L14.5 4.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="1.5" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.75" fill="none"></circle><path d="M5 19.5c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-users" viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3.1" stroke="currentColor" stroke-width="1.7" fill="none"></circle><path d="M3.5 19.5c0-3.1 2.5-5.2 5.5-5.2s5.5 2.1 5.5 5.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path><circle cx="16.6" cy="9.2" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"></circle><path d="M17 14.5c2.1.4 3.9 2.1 3.9 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-book" viewBox="0 0 24 24"><path d="M4 5.5A1.5 1.5 0 015.5 4H12v16H5.5A1.5 1.5 0 014 18.5v-13z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"></path><path d="M20 5.5A1.5 1.5 0 0018.5 4H12v16h6.5a1.5 1.5 0 001.5-1.5v-13z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.3" stroke="currentColor" stroke-width="1.6" fill="none"></circle><circle cx="12" cy="12" r="4.6" stroke="currentColor" stroke-width="1.6" fill="none"></circle><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"></circle></symbol>' + '<symbol id="icon-layers" viewBox="0 0 24 24"><path d="M12 3.5l8.5 4.4L12 12.3 3.5 7.9 12 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"></path><path d="M3.5 12.5L12 16.9l8.5-4.4M3.5 17.1L12 21.5l8.5-4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-shield-check" viewBox="0 0 24 24"><path d="M12 3.5l7 2.5v5.3c0 4.6-3 7.8-7 9.2-4-1.4-7-4.6-7-9.2V6l7-2.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" fill="none"></path><path d="M8.7 12.2l2.2 2.2 4.4-4.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-server" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="6" rx="1.3" stroke="currentColor" stroke-width="1.6" fill="none"></rect><rect x="3.5" y="13.5" width="17" height="6" rx="1.3" stroke="currentColor" stroke-width="1.6" fill="none"></rect><circle cx="7" cy="7.5" r="0.9" fill="currentColor" stroke="none"></circle><circle cx="7" cy="16.5" r="0.9" fill="currentColor" stroke="none"></circle></symbol>' + '<symbol id="icon-database" viewBox="0 0 24 24"><ellipse cx="12" cy="5.8" rx="7.5" ry="2.6" stroke="currentColor" stroke-width="1.6" fill="none"></ellipse><path d="M4.5 5.8V18c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6V5.8" stroke="currentColor" stroke-width="1.6" fill="none"></path><path d="M4.5 12c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6" stroke="currentColor" stroke-width="1.6" fill="none"></path></symbol>' + '<symbol id="icon-lock" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="1.6" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M8 10.5V7.3a4 4 0 018 0v3.2" stroke="currentColor" stroke-width="1.7" fill="none"></path></symbol>' + '<symbol id="icon-cloud" viewBox="0 0 24 24"><path d="M6.5 18a4 4 0 01-.5-8 5.5 5.5 0 0110.7-1.6A4.3 4.3 0 0119 18H6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-cpu" viewBox="0 0 24 24"><rect x="6.5" y="6.5" width="11" height="11" rx="1.4" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-trend-down" viewBox="0 0 24 24"><path d="M4 7l6.5 6.5L14 10l6 6M20 10.5V16h-5.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-trend-up" viewBox="0 0 24 24"><path d="M4 17l6.5-6.5L14 14l6-6M20 13.5V8h-5.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-folder" viewBox="0 0 24 24"><path d="M3.5 6.5a1 1 0 011-1H9l2 2.2h8.5a1 1 0 011 1V17a1 1 0 01-1 1h-15a1 1 0 01-1-1V6.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-file-text" viewBox="0 0 24 24"><path d="M6 3.5h8l4 4V20a.5.5 0 01-.5.5h-11A.5.5 0 016 20V3.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M14 3.5V8h4" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M9 12.5h6M9 16h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="1.5" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.3" stroke="currentColor" stroke-width="1.7" fill="none"></circle><path d="M12 7.5V12l3.2 2.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-chat-question" viewBox="0 0 24 24"><path d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9a1.5 1.5 0 01-1.5 1.5H12l-4.5 4v-4h-2A1.5 1.5 0 014 14.5v-9z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M10.2 8.6a2 2 0 113 2.3c-.7.4-1.2.9-1.2 1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"></path><circle cx="12" cy="14.1" r="0.85" fill="currentColor" stroke="none"></circle></symbol>' + '<symbol id="icon-lightbulb" viewBox="0 0 24 24"><path d="M12 3.5a5.6 5.6 0 013.3 10.1c-.6.5-1 1.1-1.1 1.9l-.1.7h-4.2l-.1-.7c-.1-.8-.5-1.4-1.1-1.9A5.6 5.6 0 0112 3.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M9.6 19h4.8M10.6 21.3h2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-trophy" viewBox="0 0 24 24"><path d="M8 4.5h8v5a4 4 0 01-8 0v-5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M8 6.5H5a2.9 2.9 0 003 3.5M16 6.5h3a2.9 2.9 0 01-3 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"></path><path d="M12 13.5v3M8.5 20.5h7M9.8 20.5c0-2.1 1-3.6 2.2-3.6s2.2 1.5 2.2 3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-sparkle" viewBox="0 0 24 24"><path d="M11 3.5l1.6 4.7 4.7 1.6-4.7 1.6L11 16.1l-1.6-4.7-4.7-1.6 4.7-1.6L11 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"></path><path d="M18.3 14.5l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8.8-2.4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-gauge" viewBox="0 0 24 24"><path d="M4.5 17.5a8.4 8.4 0 1115 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path><path d="M12 15l4.2-5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path><circle cx="12" cy="15" r="1.1" fill="currentColor" stroke="none"></circle></symbol>' + '<symbol id="icon-phone" viewBox="0 0 24 24"><path d="M20.5 16.7v2.3a1.5 1.5 0 01-1.7 1.5A17 17 0 013.5 5.2 1.5 1.5 0 015 3.5h2.3a1.5 1.5 0 011.5 1.3c.1.9.4 1.9.7 2.7a1.5 1.5 0 01-.4 1.6L8 10.2a13.6 13.6 0 005.8 5.8l1.1-1.1a1.5 1.5 0 011.6-.4c.8.3 1.8.6 2.7.7a1.5 1.5 0 011.3 1.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-flag" viewBox="0 0 24 24"><path d="M6 14.5s1.2-1 3.5-1 3.7 1.5 6 1.5c1.6 0 2.5-.7 2.5-.7v-9s-.9.7-2.5.7c-2.3 0-3.7-1.5-6-1.5S6 5.5 6 5.5v9z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M6 21V4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-rocket" viewBox="0 0 24 24"><path d="M12 3c2.8 1.8 4 4.9 4 8l-1.5 4.5h-5L8 11c0-3.1 1.2-6.2 4-8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><circle cx="12" cy="9.5" r="1.7" stroke="currentColor" stroke-width="1.5" fill="none"></circle><path d="M8.6 13.8L6 17.2l3.2-.7M15.4 13.8L18 17.2l-3.2-.7M12 17.5V21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-star" viewBox="0 0 24 24"><path d="M12 3.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 3.8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-building" viewBox="0 0 24 24"><path d="M5.5 20.5V5a1 1 0 011-1H14a1 1 0 011 1v15.5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M15 9.5h3a1 1 0 011 1v10" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M8.5 7.5h3.5M8.5 11h3.5M8.5 14.5h3.5M3.5 20.5h17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' +
  // ---- transport ----
  '<symbol id="icon-car" viewBox="0 0 24 24"><path d="M4 16.5v-3l1.7-4.2a1.4 1.4 0 011.3-.9h10a1.4 1.4 0 011.3.9L20 13.5v3" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M4 13.5h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><circle cx="7.5" cy="17.3" r="1.7" stroke="currentColor" stroke-width="1.6" fill="none"></circle><circle cx="16.5" cy="17.3" r="1.7" stroke="currentColor" stroke-width="1.6" fill="none"></circle></symbol>' + '<symbol id="icon-bus" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="12" rx="1.8" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M4 10.5h16M12 4v6.5" stroke="currentColor" stroke-width="1.6"></path><circle cx="8" cy="18.3" r="1.7" stroke="currentColor" stroke-width="1.6" fill="none"></circle><circle cx="16" cy="18.3" r="1.7" stroke="currentColor" stroke-width="1.6" fill="none"></circle></symbol>' + '<symbol id="icon-truck" viewBox="0 0 24 24"><rect x="2.5" y="6.5" width="12" height="9" rx="1" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M14.5 9.5h3.6l2.4 3.4v2.6h-6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><circle cx="7" cy="17.5" r="1.7" stroke="currentColor" stroke-width="1.6" fill="none"></circle><circle cx="17" cy="17.5" r="1.7" stroke="currentColor" stroke-width="1.6" fill="none"></circle></symbol>' + '<symbol id="icon-wrench" viewBox="0 0 24 24"><path d="M20.7 7.2a4.6 4.6 0 01-6 5.9l-6.9 6.8-2.7-2.7 6.8-6.9a4.6 4.6 0 015.9-6l-2.7 2.7.9 2 2 .9 2.7-2.7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-key" viewBox="0 0 24 24"><circle cx="7.5" cy="14.5" r="3.6" stroke="currentColor" stroke-width="1.7" fill="none"></circle><path d="M10.5 12.5L20 3.5M16.5 7l2.6 2.6M13.8 9.7l2 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-fuel" viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="8" height="15" rx="1.2" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M4.5 9.5h8M3.5 19.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><path d="M12.5 10.5h2a1.5 1.5 0 011.5 1.5v4.5a1.4 1.4 0 002.8 0V8.7L16.5 6.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-route" viewBox="0 0 24 24"><circle cx="5.5" cy="18.5" r="2" stroke="currentColor" stroke-width="1.6" fill="none"></circle><path d="M7.5 18.5H15a3.2 3.2 0 000-6.4H9a3.2 3.2 0 010-6.4h4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path><path d="M18.5 3.5a2.7 2.7 0 012.7 2.7c0 2-2.7 4.6-2.7 4.6s-2.7-2.6-2.7-4.6a2.7 2.7 0 012.7-2.7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-map-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.4-6.5-10a6.5 6.5 0 0113 0c0 4.6-6.5 10-6.5 10z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><circle cx="12" cy="10.8" r="2.3" stroke="currentColor" stroke-width="1.6" fill="none"></circle></symbol>' + '<symbol id="icon-steering" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.3" stroke="currentColor" stroke-width="1.7" fill="none"></circle><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.6" fill="none"></circle><path d="M12 14.6v5.7M9.6 11L4 9.6M14.4 11L20 9.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-robot" viewBox="0 0 24 24"><rect x="5.5" y="8" width="13" height="10" rx="2" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M12 8V5.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><circle cx="12" cy="4.2" r="1.2" stroke="currentColor" stroke-width="1.4" fill="none"></circle><circle cx="9.4" cy="12.6" r="0.95" fill="currentColor" stroke="none"></circle><circle cx="14.6" cy="12.6" r="0.95" fill="currentColor" stroke="none"></circle><path d="M9.5 15.4h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' +
  // ---- ui ----
  '<symbol id="icon-chev-l" viewBox="0 0 24 24"><path d="M14.5 5.5L8 12l6.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-chev-r" viewBox="0 0 24 24"><path d="M9.5 5.5L16 12l-6.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-expand" viewBox="0 0 24 24"><path d="M4 9.5V4h5.5M20 9.5V4h-5.5M4 14.5V20h5.5M20 14.5V20h-5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '</defs>';
  function inject() {
    if (document.getElementById('workshop-icon-sprite')) return;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'workshop-icon-sprite');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = SPRITE;
    (document.body || document.documentElement).appendChild(svg);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  window.WorkshopIcons = {
    inject: inject
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "js/icons.js", error: String((e && e.message) || e) }); }

// js/reveal.js
try { (() => {
/**
 * Reveal — scroll-triggered entrance for [data-animate] elements, KPI
 * count-up for [data-counter], and progress-bar fill-in. One orchestrated
 * pass per slide: elements reveal in DOM order with a small stagger rather
 * than each firing its own independent animation.
 */
(function () {
  'use strict';

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(target)) return;
    var decimals = (el.getAttribute('data-counter').split('.')[1] || '').length;
    var suffix = el.getAttribute('data-counter-suffix') || '';
    var prefix = el.getAttribute('data-counter-prefix') || '';
    var duration = 900;
    var start = performance.now();
    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = target * eased;
      el.textContent = prefix + val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function fillProgress(el) {
    var fill = el.querySelector('.progress__fill');
    if (!fill) return;
    var pct = el.getAttribute('data-progress') || '0';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fill.style.width = pct + '%';
      });
    });
  }
  function revealTarget(target) {
    target.classList.add('is-visible');
    if (target.hasAttribute('data-sketch') && window.Sketch) {
      window.Sketch.animateDraw(target.closest('[data-animate]') || target);
    }
    if (target.hasAttribute('data-counter')) animateCounter(target);
    if (target.classList.contains('progress')) fillProgress(target);
    target.querySelectorAll('[data-counter]').forEach(animateCounter);
    target.querySelectorAll('.progress[data-progress]').forEach(fillProgress);
  }
  function init(root) {
    var scope = root || document;
    var targets = scope.querySelectorAll('[data-animate]');

    // Counters/progress bars animate even when authored standalone (no
    // [data-animate] wrapper) — don't require every KPI number to remember
    // to opt into the entrance animation just to get its count-up.
    var standaloneSelector = '[data-counter], .progress[data-progress]';
    var standalone = [];
    scope.querySelectorAll(standaloneSelector).forEach(function (el) {
      if (!el.closest('[data-animate]')) standalone.push(el);
    });
    var all = Array.prototype.slice.call(targets).concat(standalone);
    if (!('IntersectionObserver' in window) || all.length === 0) {
      targets.forEach(revealTarget);
      standalone.forEach(function (el) {
        if (el.hasAttribute('data-counter')) animateCounter(el);else fillProgress(el);
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.hasAttribute('data-animate')) {
            el.style.setProperty('--stagger-i', i % 8);
            revealTarget(el);
          } else if (el.hasAttribute('data-counter')) {
            animateCounter(el);
          } else {
            fillProgress(el);
          }
          io.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });
    all.forEach(function (t) {
      io.observe(t);
    });
  }
  window.Reveal = {
    init: init,
    revealTarget: revealTarget
  };
  document.addEventListener('DOMContentLoaded', function () {
    init();
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "js/reveal.js", error: String((e && e.message) || e) }); }

// js/scale.js
try { (() => {
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
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    return [isFinite(w) && w > 0 ? w : fallbackW, isFinite(h) && h > 0 ? h : fallbackH];
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
    var baseW = base[0],
      baseH = base[1];
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
    host.style.height = baseH * scale + 'px';
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
  window.WorkshopScale = {
    refresh: refreshAll,
    apply: applyScale
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "js/scale.js", error: String((e && e.message) || e) }); }

// js/sketch.js
try { (() => {
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
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hashString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return h;
  }
  function seedFor(el, idx) {
    var key = el.getAttribute('data-sketch-seed') || (el.id || '') + ':' + idx;
    return hashString(key);
  }
  function svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }
  function jitter(rand, amt) {
    return (rand() - 0.5) * amt;
  }

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
      d += 'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' Q ' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ' ';
    }
    return d;
  }

  /** Rough closed rect — 4 independently-jittered sides with slight corner overshoot.
      `passes` overlapping strokes per side gives the reference's occasional
      double-pass redraw look (data-sketch-passes="2" on the host). */
  function roughRect(rand, x, y, w, h, amt, passes) {
    passes = passes || 1;
    var o = amt * 0.9; // corner overshoot
    var pts = [[x - o * 0.3, y], [x + w + o * 0.3, y], [x + w, y - o * 0.3], [x + w, y + h + o * 0.3], [x + w + o * 0.3, y + h], [x - o * 0.3, y + h], [x, y + h + o * 0.3], [x, y - o * 0.3]];
    var d = '';
    d += roughLine(rand, pts[0][0], pts[0][1], pts[1][0], pts[1][1], amt, passes);
    d += roughLine(rand, pts[2][0], pts[2][1], pts[3][0], pts[3][1], amt, passes);
    d += roughLine(rand, pts[4][0], pts[4][1], pts[5][0], pts[5][1], amt, passes);
    d += roughLine(rand, pts[6][0], pts[6][1], pts[7][0], pts[7][1], amt, passes);
    return d;
  }

  /** Rough ellipse — a smooth (not faceted) wobbly ring. A handful of
      radially-jittered control points are threaded with quadratic beziers
      through their midpoints (classic smooth-closed-curve-through-points
      technique), so the wobble reads as a hand bulge rather than a
      polygon facet. `passes` overlapping rings gives the reference's
      double-line circle look. */
  function roughEllipse(rand, cx, cy, rx, ry, amt, passes) {
    var d = '';
    var N = 9;
    for (var p = 0; p < passes; p++) {
      var a = amt * (p === 0 ? 1 : 1.4);
      var rot = jitter(rand, 0.15);
      var pts = [];
      for (var i = 0; i < N; i++) {
        var t = i / N * Math.PI * 2 + rot;
        var jr = 1 + jitter(rand, a / Math.max(rx, ry));
        pts.push([cx + Math.cos(t) * rx * jr, cy + Math.sin(t) * ry * jr]);
      }
      var mids = pts.map(function (pt, i) {
        var next = pts[(i + 1) % N];
        return [(pt[0] + next[0]) / 2, (pt[1] + next[1]) / 2];
      });
      var last = mids[N - 1];
      d += 'M ' + last[0].toFixed(1) + ' ' + last[1].toFixed(1) + ' ';
      for (var j = 0; j < N; j++) {
        d += 'Q ' + pts[j][0].toFixed(1) + ' ' + pts[j][1].toFixed(1) + ' ' + mids[j][0].toFixed(1) + ' ' + mids[j][1].toFixed(1) + ' ';
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
    var x1 = tipX + Math.cos(a1) * size,
      y1 = tipY + Math.sin(a1) * size;
    var x2 = tipX + Math.cos(a2) * size,
      y2 = tipY + Math.sin(a2) * size;
    svg.appendChild(path(roughLine(rand, tipX, tipY, x1, y1, 1.4, 1)));
    svg.appendChild(path(roughLine(rand, tipX, tipY, x2, y2, 1.4, 1)));
  }
  function drawOne(el, idx) {
    var type = el.getAttribute('data-sketch');
    var w = el.clientWidth,
      h = el.clientHeight;
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
      case 'underline':
        {
          var y = h * 0.82;
          svg.appendChild(path(roughLine(rand, w * 0.02, y, w * 0.98, y + jitter(rand, amt * 0.6), amt, 1), 'sketch-underline'));
          break;
        }
      case 'highlight':
        {
          var pad = 3;
          var d = roughRect(rand, pad, h * 0.12, w - pad * 2, h * 0.76, amt * 0.8);
          var fillPath = path(d, 'sketch-highlight-fill');
          fillPath.setAttribute('fill', 'currentColor');
          fillPath.setAttribute('stroke', 'none');
          fillPath.setAttribute('opacity', '0.32');
          svg.insertBefore(fillPath, svg.firstChild);
          break;
        }
      case 'circle':
        {
          svg.appendChild(path(roughEllipse(rand, w / 2, h / 2, w / 2 - 2, h / 2 - 2, amt, 2)));
          break;
        }
      case 'box':
        {
          var passes = parseInt(el.getAttribute('data-sketch-passes'), 10) || 1;
          svg.appendChild(path(roughRect(rand, 3, 3, w - 6, h - 6, amt, passes)));
          break;
        }
      case 'arrow-h':
        {
          var midY = h / 2;
          var rtl = getComputedStyle(el).direction === 'rtl';
          var startX = rtl ? w - 4 : 4,
            endX = rtl ? 4 : w - 4;
          svg.appendChild(path(roughLine(rand, startX, midY, endX, midY, amt, 1), 'sketch-arrow-shaft'));
          drawArrowhead(svg, rand, endX, midY, rtl ? Math.PI : 0, Math.min(12, w * 0.28));
          break;
        }
      case 'arrow-v':
        {
          var midX = w / 2;
          svg.appendChild(path(roughLine(rand, midX, 4, midX, h - 4, amt, 1), 'sketch-arrow-shaft'));
          drawArrowhead(svg, rand, midX, h - 4, Math.PI / 2, Math.min(12, h * 0.28));
          break;
        }
      case 'cross':
        {
          /* two near-horizontal strike lines (consultant crossing out a
             line item) — NOT a full X, which renders illegible over text */
          svg.appendChild(path(roughLine(rand, w * 0.03, h * 0.42, w * 0.97, h * 0.48, amt, 1)));
          svg.appendChild(path(roughLine(rand, w * 0.04, h * 0.62, w * 0.96, h * 0.57, amt, 1)));
          break;
        }
    }
    /* Marks the host as having a real drawn SVG stroke so CSS can retract
       a solid-border fallback (the file:// "not-yet-drawn" state) without
       ever doubling the frame once sketch.js has run. */
    el.setAttribute('data-sketch-drawn', '');
  }
  function refresh(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) drawOne(nodes[i], i);
  }
  var raf = null;
  function scheduleRefresh(root) {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      refresh(root);
    });
  }

  /** Animate the strokes inside a sketch host drawing themselves on reveal. */
  function animateDraw(hostEl) {
    var paths = hostEl.querySelectorAll('.sketch-svg path');
    paths.forEach(function (p) {
      var len;
      try {
        len = p.getTotalLength();
      } catch (e) {
        return;
      }
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
  window.Sketch = {
    refresh: refresh,
    scheduleRefresh: scheduleRefresh,
    animateDraw: animateDraw
  };
  document.addEventListener('DOMContentLoaded', function () {
    scheduleRefresh();
  });
  window.addEventListener('resize', function () {
    scheduleRefresh();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      scheduleRefresh();
    });
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "js/sketch.js", error: String((e && e.message) || e) }); }

// js/theme.js
try { (() => {
/**
 * Theme — dark/light + language(He/En, drives RTL/LTR) persistence.
 * Sets data-theme and lang/dir on <html>, persists to localStorage,
 * and wires up any [data-theme-toggle] / [data-lang-toggle] buttons.
 */
(function () {
  'use strict';

  var STORAGE_THEME = 'workshop-ds:theme';
  var STORAGE_LANG = 'workshop-ds:lang';
  var root = document.documentElement;
  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
    root.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }
  function applyLang(lang) {
    lang = lang === 'he' ? 'he' : 'en';
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    root.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(lang === 'he'));
    });
  }
  function currentTheme() {
    var stored = localStorage.getItem(STORAGE_THEME);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function currentLang() {
    return localStorage.getItem(STORAGE_LANG) || root.getAttribute('lang') || 'en';
  }
  function setTheme(theme) {
    localStorage.setItem(STORAGE_THEME, theme);
    applyTheme(theme);
  }
  function setLang(lang) {
    localStorage.setItem(STORAGE_LANG, lang);
    applyLang(lang);
    if (window.Sketch) window.Sketch.scheduleRefresh();
  }
  function toggleTheme() {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }
  function toggleLang() {
    setLang(currentLang() === 'he' ? 'en' : 'he');
  }

  // Apply immediately (before DOMContentLoaded) to avoid a flash of wrong theme
  applyTheme(currentTheme());
  applyLang(currentLang());
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleLang);
    });
    applyTheme(currentTheme());
    applyLang(currentLang());
  });
  window.WorkshopTheme = {
    setTheme: setTheme,
    setLang: setLang,
    toggleTheme: toggleTheme,
    toggleLang: toggleLang
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "js/theme.js", error: String((e && e.message) || e) }); }

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

})();
