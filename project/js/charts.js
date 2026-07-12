/**
 * Charts — minimal SVG chart renderer.
 * No canvas, no external library. Auto-initializes any element carrying
 * data-chart="donut|bar|bar-h|stacked-bar|line|scatter|gantt|waterfall"
 * + data-chart-config='{...JSON...}'.
 *
 * Every type supports "rough": true — hand-drawn jittered strokes (seeded, stable).
 *
 * Config shapes:
 *   donut:       { segments: [{value, color, label}], thickness, centerLabel, centerValue, rough }
 *   bar:         { data: [{label, value, color}], max, rough }
 *   bar-h:       { data: [{label, value, color}], max, rough }        // אופקי, RTL — גדל מימין לשמאל
 *   stacked-bar: { data: [{label, values:[n,...]}], colors:[...], max, rough }
 *   line:        { points: [n,...], color, rough, area }
 *   scatter:     { points: [[x,y],...], color, rough, r }
 *   gantt:       { rows: [{label, start, end, color}], total, rough } // RTL — ציר הזמן מימין לשמאל
 *   waterfall:   { data: [{label, value}], colorUp, colorDown, colorTotal, rough }
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
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- rough helpers -------------------------------------------------------

  // path through points with jittered quadratic midpoints
  function roughPathD(coords, rand, amp, close) {
    var d = 'M ' + coords[0][0].toFixed(2) + ' ' + coords[0][1].toFixed(2) + ' ';
    var list = close ? coords.concat([coords[0]]) : coords;
    for (var i = 1; i < list.length; i++) {
      var a = list[i - 1], b = list[i];
      var mx = (a[0] + b[0]) / 2 + (rand() - 0.5) * amp;
      var my = (a[1] + b[1]) / 2 + (rand() - 0.5) * amp;
      d += 'Q ' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + b[0].toFixed(2) + ' ' + b[1].toFixed(2) + ' ';
    }
    if (close) d += 'Z';
    return d;
  }

  // hand-drawn rectangle: translucent fill + jittered outline
  function roughRect(svg, x, y, w, h, color, rand, sw) {
    var j = function () { return (rand() - 0.5) * Math.min(1.6, w * 0.12, h * 0.12); };
    var corners = [
      [x + j(), y + j()], [x + w + j(), y + j()],
      [x + w + j(), y + h + j()], [x + j(), y + h + j()]
    ];
    svg.appendChild(el('rect', {
      x: x.toFixed(2), y: y.toFixed(2), width: w.toFixed(2), height: h.toFixed(2),
      fill: color, opacity: 0.16, stroke: 'none'
    }));
    svg.appendChild(el('path', {
      d: roughPathD(corners, rand, Math.min(2, w * 0.15, h * 0.15), true),
      fill: 'none', stroke: color, 'stroke-width': sw || 1.4,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }));
  }

  function plainRect(svg, x, y, w, h, color, rx) {
    svg.appendChild(el('rect', {
      x: x.toFixed(2), y: y.toFixed(2), width: w.toFixed(2), height: h.toFixed(2),
      rx: rx == null ? 1.5 : rx, fill: color
    }));
  }

  function txt(svg, x, y, size, anchor, content, fill) {
    var t = el('text', {
      x: (+x).toFixed(2), y: (+y).toFixed(2), 'font-size': size,
      'text-anchor': anchor, fill: fill || 'var(--color-ink-3)'
    });
    t.textContent = content;
    svg.appendChild(t);
    return t;
  }

  function chartColor(i, colors) {
    if (colors && colors[i]) return colors[i];
    return 'var(--chart-' + ((i % 6) + 1) + ')';
  }

  // ---- donut ---------------------------------------------------------------

  function donut(host, cfg) {
    var size = cfg.size || 120;
    var thickness = cfg.thickness || 16;
    var r = (size - thickness) / 2;
    var c = size / 2;
    var circumference = 2 * Math.PI * r;
    var total = cfg.segments.reduce(function (s, seg) { return s + seg.value; }, 0) || 1;

    var svg = el('svg', { viewBox: '0 0 ' + size + ' ' + size, width: '100%', height: '100%' });
    var rand = mulberry32(cfg.seed || 7);

    if (cfg.rough) {
      // hairline base ring, hand-drawn
      var base = [];
      for (var bi = 0; bi <= 40; bi++) {
        var ba = (bi / 40) * 2 * Math.PI;
        base.push([c + Math.cos(ba) * r, c + Math.sin(ba) * r]);
      }
      svg.appendChild(el('path', {
        d: roughPathD(base, rand, 1.2, false), fill: 'none',
        stroke: 'var(--color-hairline)', 'stroke-width': thickness * 0.9, 'stroke-linecap': 'round'
      }));
      var start = -Math.PI / 2;
      cfg.segments.forEach(function (seg, i) {
        var frac = seg.value / total;
        var end = start + frac * 2 * Math.PI;
        var steps = Math.max(4, Math.round(frac * 32));
        var pts = [];
        for (var s = 0; s <= steps; s++) {
          var a = start + (s / steps) * (end - start);
          var rr = r + (rand() - 0.5) * (thickness * 0.18);
          pts.push([c + Math.cos(a) * rr, c + Math.sin(a) * rr]);
        }
        svg.appendChild(el('path', {
          d: roughPathD(pts, rand, 1.4, false), fill: 'none',
          stroke: seg.color || chartColor(i), 'stroke-width': thickness * 0.82,
          'stroke-linecap': 'round'
        }));
        start = end;
      });
    } else {
      svg.appendChild(el('circle', {
        cx: c, cy: c, r: r, fill: 'none',
        stroke: 'var(--color-hairline)', 'stroke-width': thickness
      }));
      var offset = 0;
      cfg.segments.forEach(function (seg, i) {
        var frac = seg.value / total;
        var len = frac * circumference;
        var circle = el('circle', {
          cx: c, cy: c, r: r, fill: 'none',
          stroke: seg.color || chartColor(i),
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
    }

    if (cfg.centerValue) {
      var fo = el('foreignObject', { x: 0, y: 0, width: size, height: size });
      var div = document.createElement('div');
      div.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;';
      div.innerHTML =
        '<span style="font-family:var(--font-display);font-weight:600;font-size:' + (size * 0.16) + 'px;color:var(--color-ink);">' + cfg.centerValue + '</span>' +
        (cfg.centerLabel ? '<span style="font-size:' + (size * 0.07) + 'px;color:var(--color-ink-3);">' + cfg.centerLabel + '</span>' : '');
      fo.appendChild(div);
      svg.appendChild(fo);
    }
    host.appendChild(svg);
  }

  // ---- bar (vertical) ------------------------------------------------------

  function bar(host, cfg) {
    var w = 100, h = 60;
    var max = cfg.max || Math.max.apply(null, cfg.data.map(function (d) { return d.value; })) * 1.15;
    var n = cfg.data.length;
    var gap = 2.5;
    var barW = (w - gap * (n - 1)) / n;
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + (h + 14), width: '100%', height: '100%', preserveAspectRatio: 'none' });
    var rand = mulberry32(cfg.seed || 11);

    cfg.data.forEach(function (d, i) {
      var barH = (d.value / max) * h;
      var x = i * (barW + gap);
      var y = h - barH;
      var color = d.color || chartColor(i);
      if (cfg.rough) roughRect(svg, x, y, barW, barH, color, rand);
      else plainRect(svg, x, y, barW, barH, color);
      txt(svg, x + barW / 2, h + 10, 5.5, 'middle', d.label);
    });
    host.appendChild(svg);
  }

  // ---- bar-h (horizontal, RTL: bars grow right→left) -----------------------

  function barH(host, cfg) {
    var w = 100;
    var n = cfg.data.length;
    var rowH = 9, gap = 4;
    var labelW = cfg.labelWidth || 24; // reserved on the RIGHT for labels
    var plotW = w - labelW - 2;
    var h = n * rowH + (n - 1) * gap;
    var max = cfg.max || Math.max.apply(null, cfg.data.map(function (d) { return d.value; })) * 1.1;
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, width: '100%', height: '100%', preserveAspectRatio: 'none' });
    var rand = mulberry32(cfg.seed || 13);

    cfg.data.forEach(function (d, i) {
      var y = i * (rowH + gap);
      var len = (d.value / max) * plotW;
      var x = w - labelW - len; // anchored at right edge of plot, grows leftward
      var color = d.color || chartColor(i);
      // faint track
      svg.appendChild(el('rect', {
        x: (w - labelW - plotW).toFixed(2), y: (y + rowH * 0.15).toFixed(2),
        width: plotW.toFixed(2), height: (rowH * 0.7).toFixed(2),
        rx: 1, fill: 'var(--color-hairline)', opacity: 0.5
      }));
      if (cfg.rough) roughRect(svg, x, y + rowH * 0.1, len, rowH * 0.8, color, rand, 1.2);
      else plainRect(svg, x, y + rowH * 0.1, len, rowH * 0.8, color, 1.2);
      txt(svg, w - labelW + 2, y + rowH * 0.72, 5, 'start', d.label, 'var(--color-ink-2)');
    });
    host.appendChild(svg);
  }

  // ---- stacked-bar (vertical stacks) ---------------------------------------

  function stackedBar(host, cfg) {
    var w = 100, h = 60;
    var n = cfg.data.length;
    var gap = 3;
    var barW = (w - gap * (n - 1)) / n;
    var max = cfg.max || Math.max.apply(null, cfg.data.map(function (d) {
      return d.values.reduce(function (s, v) { return s + v; }, 0);
    })) * 1.1;
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + (h + 14), width: '100%', height: '100%', preserveAspectRatio: 'none' });
    var rand = mulberry32(cfg.seed || 17);

    cfg.data.forEach(function (d, i) {
      var x = i * (barW + gap);
      var yCursor = h;
      d.values.forEach(function (v, s) {
        var segH = (v / max) * h;
        yCursor -= segH;
        var color = chartColor(s, cfg.colors);
        if (cfg.rough) roughRect(svg, x, yCursor, barW, segH, color, rand, 1.1);
        else {
          svg.appendChild(el('rect', {
            x: x.toFixed(2), y: yCursor.toFixed(2), width: barW.toFixed(2), height: segH.toFixed(2),
            fill: color, stroke: 'var(--color-paper, #fff)', 'stroke-width': 0.6
          }));
        }
      });
      txt(svg, x + barW / 2, h + 10, 5.5, 'middle', d.label);
    });
    host.appendChild(svg);
  }

  // ---- line ----------------------------------------------------------------

  function line(host, cfg) {
    var w = 100, h = 40;
    var pts = cfg.points;
    var min = Math.min.apply(null, pts), max = Math.max.apply(null, pts);
    var range = (max - min) || 1;
    var step = w / (pts.length - 1);
    var coords = pts.map(function (v, i) { return [i * step, h - ((v - min) / range) * h]; });

    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, width: '100%', height: '100%', preserveAspectRatio: 'none' });
    var d;
    if (cfg.rough) {
      var rand = mulberry32(cfg.seed || 7);
      d = roughPathD(coords, rand, 1.6, false);
    } else {
      d = 'M ' + coords[0][0].toFixed(2) + ' ' + coords[0][1].toFixed(2) + ' ';
      for (var j = 1; j < coords.length; j++) d += 'L ' + coords[j][0].toFixed(2) + ' ' + coords[j][1].toFixed(2) + ' ';
    }

    if (cfg.area) {
      var areaD = d + 'L ' + coords[coords.length - 1][0].toFixed(2) + ' ' + h + ' L ' + coords[0][0].toFixed(2) + ' ' + h + ' Z';
      svg.appendChild(el('path', { d: areaD, fill: cfg.color || 'var(--chart-1)', opacity: 0.14, stroke: 'none' }));
    }
    svg.appendChild(el('path', {
      d: d, fill: 'none', stroke: cfg.color || 'var(--chart-1)',
      'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }));
    var last = coords[coords.length - 1];
    svg.appendChild(el('circle', { cx: last[0], cy: last[1], r: 2.4, fill: cfg.color || 'var(--chart-1)' }));
    host.appendChild(svg);
  }

  // ---- scatter ---------------------------------------------------------------

  function scatter(host, cfg) {
    var w = 100, h = 60;
    var pts = cfg.points; // [[x,y],...] any scale
    var xs = pts.map(function (p) { return p[0]; });
    var ys = pts.map(function (p) { return p[1]; });
    var xMin = Math.min.apply(null, xs), xMax = Math.max.apply(null, xs);
    var yMin = Math.min.apply(null, ys), yMax = Math.max.apply(null, ys);
    var xR = (xMax - xMin) || 1, yR = (yMax - yMin) || 1;
    var pad = 5;
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, width: '100%', height: '100%' });
    var rand = mulberry32(cfg.seed || 19);
    var r = cfg.r || 1.8;
    var color = cfg.color || 'var(--chart-1)';

    // axes (bottom + right, RTL-friendly)
    var axStroke = { fill: 'none', stroke: 'var(--color-ink-3)', 'stroke-width': 0.7, 'stroke-linecap': 'round' };
    if (cfg.rough) {
      svg.appendChild(el('path', Object.assign({ d: roughPathD([[pad, h - pad], [w - pad, h - pad]], rand, 1, false) }, axStroke)));
      svg.appendChild(el('path', Object.assign({ d: roughPathD([[w - pad, pad], [w - pad, h - pad]], rand, 1, false) }, axStroke)));
    } else {
      svg.appendChild(el('path', Object.assign({ d: 'M ' + pad + ' ' + (h - pad) + ' H ' + (w - pad) + ' M ' + (w - pad) + ' ' + pad + ' V ' + (h - pad) }, axStroke)));
    }

    pts.forEach(function (p) {
      // RTL: larger x → further LEFT
      var cx = (w - pad) - ((p[0] - xMin) / xR) * (w - pad * 2);
      var cy = (h - pad) - ((p[1] - yMin) / yR) * (h - pad * 2);
      if (cfg.rough) {
        var circ = [];
        var rr = r + (rand() - 0.5) * 0.5;
        var a0 = rand() * Math.PI * 2;
        for (var s = 0; s <= 9; s++) {
          var a = a0 + (s / 9) * Math.PI * 2.08;
          circ.push([cx + Math.cos(a) * (rr + (rand() - 0.5) * 0.5), cy + Math.sin(a) * (rr + (rand() - 0.5) * 0.5)]);
        }
        svg.appendChild(el('path', {
          d: roughPathD(circ, rand, 0.5, false), fill: 'none',
          stroke: color, 'stroke-width': 0.9, 'stroke-linecap': 'round'
        }));
      } else {
        svg.appendChild(el('circle', { cx: cx.toFixed(2), cy: cy.toFixed(2), r: r, fill: color, opacity: 0.85 }));
      }
    });
    host.appendChild(svg);
  }

  // ---- gantt (RTL: time flows right → left) ---------------------------------

  function gantt(host, cfg) {
    var w = 100;
    var rows = cfg.rows;
    var rowH = 8, gap = 4;
    var labelW = cfg.labelWidth || 22;
    var plotW = w - labelW - 2;
    var h = rows.length * (rowH + gap) - gap;
    var total = cfg.total || Math.max.apply(null, rows.map(function (r) { return r.end; }));
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, width: '100%', height: '100%', preserveAspectRatio: 'none' });
    var rand = mulberry32(cfg.seed || 23);

    // faint vertical grid
    for (var g = 0; g <= 4; g++) {
      var gx = (w - labelW) - (g / 4) * plotW;
      svg.appendChild(el('path', {
        d: 'M ' + gx.toFixed(2) + ' 0 V ' + h,
        stroke: 'var(--color-hairline)', 'stroke-width': 0.5, fill: 'none'
      }));
    }

    rows.forEach(function (r, i) {
      var y = i * (rowH + gap);
      var x1 = (w - labelW) - (r.end / total) * plotW;   // RTL: end is further left
      var len = ((r.end - r.start) / total) * plotW;
      var color = r.color || chartColor(i);
      if (cfg.rough) roughRect(svg, x1, y + rowH * 0.1, len, rowH * 0.8, color, rand, 1.1);
      else plainRect(svg, x1, y + rowH * 0.1, len, rowH * 0.8, color, 1.4);
      txt(svg, w - labelW + 2, y + rowH * 0.75, 4.6, 'start', r.label, 'var(--color-ink-2)');
    });
    host.appendChild(svg);
  }

  // ---- waterfall -------------------------------------------------------------

  function waterfall(host, cfg) {
    var w = 100, h = 60;
    var data = cfg.data; // [{label, value}] — last item may be {label, total:true}
    var n = data.length;
    var gap = 2.5;
    var barW = (w - gap * (n - 1)) / n;
    var colorUp = cfg.colorUp || 'var(--chart-2)';
    var colorDown = cfg.colorDown || 'var(--chart-5)';
    var colorTotal = cfg.colorTotal || 'var(--chart-1)';
    var rand = mulberry32(cfg.seed || 29);

    // compute running levels
    var cum = 0, levels = [];
    var maxLevel = 0, minLevel = 0;
    data.forEach(function (d) {
      if (d.total) { levels.push({ from: 0, to: cum, total: true }); }
      else {
        levels.push({ from: cum, to: cum + d.value });
        cum += d.value;
      }
      maxLevel = Math.max(maxLevel, levels[levels.length - 1].from, levels[levels.length - 1].to);
      minLevel = Math.min(minLevel, levels[levels.length - 1].from, levels[levels.length - 1].to);
    });
    var range = (maxLevel - minLevel) || 1;
    function yOf(v) { return h - ((v - minLevel) / range) * h; }

    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + (h + 14), width: '100%', height: '100%', preserveAspectRatio: 'none' });

    // RTL: first bar at the RIGHT
    levels.forEach(function (lv, i) {
      var x = w - (i + 1) * barW - i * gap;
      var yTop = yOf(Math.max(lv.from, lv.to));
      var barHt = Math.abs(yOf(lv.from) - yOf(lv.to)) || 0.8;
      var color = lv.total ? colorTotal : (lv.to >= lv.from ? colorUp : colorDown);
      if (cfg.rough) roughRect(svg, x, yTop, barW, barHt, color, rand, 1.1);
      else plainRect(svg, x, yTop, barW, barHt, color, 1);
      // connector to next bar (leftward)
      if (i < levels.length - 1) {
        var lvNext = levels[i + 1];
        var cy = yOf(lv.total ? lv.to : lv.to);
        var connY = yOf(lvNext.total ? lvNext.to : lvNext.from);
        svg.appendChild(el('path', {
          d: 'M ' + x.toFixed(2) + ' ' + cy.toFixed(2) + ' H ' + (x - gap).toFixed(2),
          stroke: 'var(--color-ink-3)', 'stroke-width': 0.6, 'stroke-dasharray': '1.4 1.2', fill: 'none'
        }));
        void connY;
      }
      txt(svg, x + barW / 2, h + 10, 5, 'middle', data[i].label);
    });
    host.appendChild(svg);
  }

  // ---- registry --------------------------------------------------------------

  var TYPES = {
    'donut': donut,
    'bar': bar,
    'bar-h': barH,
    'stacked-bar': stackedBar,
    'line': line,
    'scatter': scatter,
    'gantt': gantt,
    'waterfall': waterfall
  };

  function render(host) {
    var type = host.getAttribute('data-chart');
    var raw = host.getAttribute('data-chart-config');
    if (!type || !raw) return;
    var cfg;
    try { cfg = JSON.parse(raw); } catch (e) { console.warn('Charts: bad data-chart-config JSON', e); return; }
    var fn = TYPES[type];
    if (!fn) { console.warn('Charts: unknown type "' + type + '"'); return; }
    host.innerHTML = '';
    fn(host, cfg);
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-chart]');
    for (var i = 0; i < nodes.length; i++) render(nodes[i]);
  }

  window.Charts = {
    init: init, donut: donut, bar: bar, barH: barH, stackedBar: stackedBar,
    line: line, scatter: scatter, gantt: gantt, waterfall: waterfall
  };
  document.addEventListener('DOMContentLoaded', function () { init(); });
})();
