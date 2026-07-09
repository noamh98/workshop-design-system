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
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function donut(host, cfg) {
    var size = cfg.size || 120;
    var thickness = cfg.thickness || 16;
    var r = (size - thickness) / 2;
    var c = size / 2;
    var circumference = 2 * Math.PI * r;
    var total = cfg.segments.reduce(function (s, seg) { return s + seg.value; }, 0) || 1;

    var svg = el('svg', { viewBox: '0 0 ' + size + ' ' + size, width: '100%', height: '100%' });
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
        stroke: seg.color || 'var(--chart-' + ((i % 6) + 1) + ')',
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

  function bar(host, cfg) {
    var w = 100, h = 60;
    var max = cfg.max || Math.max.apply(null, cfg.data.map(function (d) { return d.value; })) * 1.15;
    var n = cfg.data.length;
    var gap = 2.5;
    var barW = (w - gap * (n - 1)) / n;
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + (h + 14), width: '100%', height: '100%', preserveAspectRatio: 'none' });

    cfg.data.forEach(function (d, i) {
      var barH = (d.value / max) * h;
      var x = i * (barW + gap);
      var y = h - barH;
      svg.appendChild(el('rect', {
        x: x.toFixed(2), y: y.toFixed(2), width: barW.toFixed(2), height: barH.toFixed(2),
        rx: 1.5,
        fill: d.color || 'var(--chart-1)'
      }));
      var label = el('text', {
        x: (x + barW / 2).toFixed(2), y: h + 10, 'font-size': 5.5,
        'text-anchor': 'middle', fill: 'var(--color-ink-3)'
      });
      label.textContent = d.label;
      svg.appendChild(label);
    });
    host.appendChild(svg);
  }

  function line(host, cfg) {
    var w = 100, h = 40;
    var pts = cfg.points;
    var min = Math.min.apply(null, pts), max = Math.max.apply(null, pts);
    var range = (max - min) || 1;
    var step = w / (pts.length - 1);
    var coords = pts.map(function (v, i) { return [i * step, h - ((v - min) / range) * h]; });

    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, width: '100%', height: '100%', preserveAspectRatio: 'none' });
    var d = 'M ' + coords[0][0].toFixed(2) + ' ' + coords[0][1].toFixed(2) + ' ';

    if (cfg.rough) {
      var rand = mulberry32(cfg.seed || 7);
      for (var i = 1; i < coords.length; i++) {
        var a = coords[i - 1], b = coords[i];
        var mx = (a[0] + b[0]) / 2 + (rand() - 0.5) * 1.6;
        var my = (a[1] + b[1]) / 2 + (rand() - 0.5) * 1.6;
        d += 'Q ' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + b[0].toFixed(2) + ' ' + b[1].toFixed(2) + ' ';
      }
    } else {
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
    coords.forEach(function (p, i) {
      if (i === coords.length - 1) {
        svg.appendChild(el('circle', { cx: p[0], cy: p[1], r: 2.4, fill: cfg.color || 'var(--chart-1)' }));
      }
    });
    host.appendChild(svg);
  }

  function render(host) {
    var type = host.getAttribute('data-chart');
    var raw = host.getAttribute('data-chart-config');
    if (!type || !raw) return;
    var cfg;
    try { cfg = JSON.parse(raw); } catch (e) { console.warn('Charts: bad data-chart-config JSON', e); return; }
    host.innerHTML = '';
    if (type === 'donut') donut(host, cfg);
    else if (type === 'bar') bar(host, cfg);
    else if (type === 'line') line(host, cfg);
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-chart]');
    for (var i = 0; i < nodes.length; i++) render(nodes[i]);
  }

  window.Charts = { init: init, donut: donut, bar: bar, line: line };
  document.addEventListener('DOMContentLoaded', function () { init(); });
})();
