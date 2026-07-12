/* @ds-bundle: {"format":4,"namespace":"WorkshopDesignSystem_aa9a62","components":[{"name":"ICONS","sourcePath":"components/core/icons.js"},{"name":"ICON_NAMES","sourcePath":"components/core/icons.js"}],"sourceHashes":{"components/core/icons.js":"dd402f662458","doc-page.js":"5957844bb066","js/charts.js":"c602f83062b4","js/icons.js":"27a447a9ebd6","js/reveal.js":"8b44c8cb5de9","js/scale.js":"b6165ee0b4be","js/sketch.js":"bcf66f971359","js/theme.js":"a794fc1215f6"},"inlinedExternals":[],"unexposedExports":[]} */

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

// doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * On screen the document renders as a single continuous sheet on a desk
 * background (Google Docs' pageless view): you scroll one tall page card.
 * There is no manual page-splitting — write the whole document as normal
 * flow inside <doc-page> and the browser's print engine paginates it at
 * export.
 *
 * At print the component injects `@page { size: …; margin: 0 }` (which
 * leaves Chrome no margin box to draw its date/URL/page-count header in)
 * and moves the visual margin onto the sheet's own padding, so the printed
 * page has the same inset you see on screen. Standard break-hygiene rules
 * (`break-inside: avoid` on figures, code blocks, images and table rows;
 * `orphans/widows: 3`) are applied so paragraphs and groups split cleanly.
 * On screen and at print, headings default to `text-wrap: balance` and
 * body text (p, li, blockquote, figcaption) to `text-wrap: pretty`, so
 * the document avoids widowed/orphaned words; the defaults have zero
 * specificity, so any text-wrap you declare on those elements wins.
 * The component also marks the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page size="letter" margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 *
 * Attributes:
 *   size    — letter | a4 | legal (default letter)
 *   orientation — portrait (default) | landscape. For documents built to
 *           export, always set it explicitly. landscape swaps the named
 *           size's dimensions (letter landscape prints 11in × 8.5in).
 *   width / height — explicit CSS lengths, override `size` and
 *           `orientation`
 *   margin  — printable inset on every page (default 0.75in); margin="0"
 *           makes pages full-bleed (content then owns its own insets)
 *
 * Running header/footer (optional): give an element `slot="header"` or
 * `slot="footer"` and it repeats on every printed page via
 * `position: fixed`. To keep body text from sliding under it, the
 * component prints inside a single-cell table whose <thead>/<tfoot> are
 * spacers sized to the header/footer height — browsers repeat thead/tfoot
 * on every page, so each sheet's content starts below the header and ends
 * above the footer. On screen the header/footer render once at the
 * top/bottom of the sheet.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks: `break-before: page` on an element that must start
 *   a new page (a chapter, an appendix). Add your own kept-together
 *   blocks (callouts, stat tiles, cards) to a `break-inside: avoid`
 *   rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #ece8dd;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 14px rgba(20, 20, 19, 0.12);
      border-radius: 2px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      if (!document.querySelector('doc-page')) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><slot></slot></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      this._vars.textContent = ':host{' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      tag.textContent = '@page { size: ' + this.pageWidth + ' ' + this.pageHeight + '; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "doc-page.js", error: String((e && e.message) || e) }); }

// js/charts.js
try { (() => {
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
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ---- rough helpers -------------------------------------------------------

  // path through points with jittered quadratic midpoints
  function roughPathD(coords, rand, amp, close) {
    var d = 'M ' + coords[0][0].toFixed(2) + ' ' + coords[0][1].toFixed(2) + ' ';
    var list = close ? coords.concat([coords[0]]) : coords;
    for (var i = 1; i < list.length; i++) {
      var a = list[i - 1],
        b = list[i];
      var mx = (a[0] + b[0]) / 2 + (rand() - 0.5) * amp;
      var my = (a[1] + b[1]) / 2 + (rand() - 0.5) * amp;
      d += 'Q ' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + b[0].toFixed(2) + ' ' + b[1].toFixed(2) + ' ';
    }
    if (close) d += 'Z';
    return d;
  }

  // hand-drawn rectangle: translucent fill + jittered outline
  function roughRect(svg, x, y, w, h, color, rand, sw) {
    var j = function () {
      return (rand() - 0.5) * Math.min(1.6, w * 0.12, h * 0.12);
    };
    var corners = [[x + j(), y + j()], [x + w + j(), y + j()], [x + w + j(), y + h + j()], [x + j(), y + h + j()]];
    svg.appendChild(el('rect', {
      x: x.toFixed(2),
      y: y.toFixed(2),
      width: w.toFixed(2),
      height: h.toFixed(2),
      fill: color,
      opacity: 0.16,
      stroke: 'none'
    }));
    svg.appendChild(el('path', {
      d: roughPathD(corners, rand, Math.min(2, w * 0.15, h * 0.15), true),
      fill: 'none',
      stroke: color,
      'stroke-width': sw || 1.4,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
  }
  function plainRect(svg, x, y, w, h, color, rx) {
    svg.appendChild(el('rect', {
      x: x.toFixed(2),
      y: y.toFixed(2),
      width: w.toFixed(2),
      height: h.toFixed(2),
      rx: rx == null ? 1.5 : rx,
      fill: color
    }));
  }
  function txt(svg, x, y, size, anchor, content, fill) {
    var t = el('text', {
      x: (+x).toFixed(2),
      y: (+y).toFixed(2),
      'font-size': size,
      'text-anchor': anchor,
      fill: fill || 'var(--color-ink-3)'
    });
    t.textContent = content;
    svg.appendChild(t);
    return t;
  }
  function chartColor(i, colors) {
    if (colors && colors[i]) return colors[i];
    return 'var(--chart-' + (i % 6 + 1) + ')';
  }

  // ---- donut ---------------------------------------------------------------

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
    var rand = mulberry32(cfg.seed || 7);
    if (cfg.rough) {
      // hairline base ring, hand-drawn
      var base = [];
      for (var bi = 0; bi <= 40; bi++) {
        var ba = bi / 40 * 2 * Math.PI;
        base.push([c + Math.cos(ba) * r, c + Math.sin(ba) * r]);
      }
      svg.appendChild(el('path', {
        d: roughPathD(base, rand, 1.2, false),
        fill: 'none',
        stroke: 'var(--color-hairline)',
        'stroke-width': thickness * 0.9,
        'stroke-linecap': 'round'
      }));
      var start = -Math.PI / 2;
      cfg.segments.forEach(function (seg, i) {
        var frac = seg.value / total;
        var end = start + frac * 2 * Math.PI;
        var steps = Math.max(4, Math.round(frac * 32));
        var pts = [];
        for (var s = 0; s <= steps; s++) {
          var a = start + s / steps * (end - start);
          var rr = r + (rand() - 0.5) * (thickness * 0.18);
          pts.push([c + Math.cos(a) * rr, c + Math.sin(a) * rr]);
        }
        svg.appendChild(el('path', {
          d: roughPathD(pts, rand, 1.4, false),
          fill: 'none',
          stroke: seg.color || chartColor(i),
          'stroke-width': thickness * 0.82,
          'stroke-linecap': 'round'
        }));
        start = end;
      });
    } else {
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

  // ---- bar (vertical) ------------------------------------------------------

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
    var rand = mulberry32(cfg.seed || 11);
    cfg.data.forEach(function (d, i) {
      var barH = d.value / max * h;
      var x = i * (barW + gap);
      var y = h - barH;
      var color = d.color || chartColor(i);
      if (cfg.rough) roughRect(svg, x, y, barW, barH, color, rand);else plainRect(svg, x, y, barW, barH, color);
      txt(svg, x + barW / 2, h + 10, 5.5, 'middle', d.label);
    });
    host.appendChild(svg);
  }

  // ---- bar-h (horizontal, RTL: bars grow right→left) -----------------------

  function barH(host, cfg) {
    var w = 100;
    var n = cfg.data.length;
    var rowH = 9,
      gap = 4;
    var labelW = cfg.labelWidth || 24; // reserved on the RIGHT for labels
    var plotW = w - labelW - 2;
    var h = n * rowH + (n - 1) * gap;
    var max = cfg.max || Math.max.apply(null, cfg.data.map(function (d) {
      return d.value;
    })) * 1.1;
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      width: '100%',
      height: '100%',
      preserveAspectRatio: 'none'
    });
    var rand = mulberry32(cfg.seed || 13);
    cfg.data.forEach(function (d, i) {
      var y = i * (rowH + gap);
      var len = d.value / max * plotW;
      var x = w - labelW - len; // anchored at right edge of plot, grows leftward
      var color = d.color || chartColor(i);
      // faint track
      svg.appendChild(el('rect', {
        x: (w - labelW - plotW).toFixed(2),
        y: (y + rowH * 0.15).toFixed(2),
        width: plotW.toFixed(2),
        height: (rowH * 0.7).toFixed(2),
        rx: 1,
        fill: 'var(--color-hairline)',
        opacity: 0.5
      }));
      if (cfg.rough) roughRect(svg, x, y + rowH * 0.1, len, rowH * 0.8, color, rand, 1.2);else plainRect(svg, x, y + rowH * 0.1, len, rowH * 0.8, color, 1.2);
      txt(svg, w - labelW + 2, y + rowH * 0.72, 5, 'start', d.label, 'var(--color-ink-2)');
    });
    host.appendChild(svg);
  }

  // ---- stacked-bar (vertical stacks) ---------------------------------------

  function stackedBar(host, cfg) {
    var w = 100,
      h = 60;
    var n = cfg.data.length;
    var gap = 3;
    var barW = (w - gap * (n - 1)) / n;
    var max = cfg.max || Math.max.apply(null, cfg.data.map(function (d) {
      return d.values.reduce(function (s, v) {
        return s + v;
      }, 0);
    })) * 1.1;
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + (h + 14),
      width: '100%',
      height: '100%',
      preserveAspectRatio: 'none'
    });
    var rand = mulberry32(cfg.seed || 17);
    cfg.data.forEach(function (d, i) {
      var x = i * (barW + gap);
      var yCursor = h;
      d.values.forEach(function (v, s) {
        var segH = v / max * h;
        yCursor -= segH;
        var color = chartColor(s, cfg.colors);
        if (cfg.rough) roughRect(svg, x, yCursor, barW, segH, color, rand, 1.1);else {
          svg.appendChild(el('rect', {
            x: x.toFixed(2),
            y: yCursor.toFixed(2),
            width: barW.toFixed(2),
            height: segH.toFixed(2),
            fill: color,
            stroke: 'var(--color-paper, #fff)',
            'stroke-width': 0.6
          }));
        }
      });
      txt(svg, x + barW / 2, h + 10, 5.5, 'middle', d.label);
    });
    host.appendChild(svg);
  }

  // ---- line ----------------------------------------------------------------

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
    var last = coords[coords.length - 1];
    svg.appendChild(el('circle', {
      cx: last[0],
      cy: last[1],
      r: 2.4,
      fill: cfg.color || 'var(--chart-1)'
    }));
    host.appendChild(svg);
  }

  // ---- scatter ---------------------------------------------------------------

  function scatter(host, cfg) {
    var w = 100,
      h = 60;
    var pts = cfg.points; // [[x,y],...] any scale
    var xs = pts.map(function (p) {
      return p[0];
    });
    var ys = pts.map(function (p) {
      return p[1];
    });
    var xMin = Math.min.apply(null, xs),
      xMax = Math.max.apply(null, xs);
    var yMin = Math.min.apply(null, ys),
      yMax = Math.max.apply(null, ys);
    var xR = xMax - xMin || 1,
      yR = yMax - yMin || 1;
    var pad = 5;
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      width: '100%',
      height: '100%'
    });
    var rand = mulberry32(cfg.seed || 19);
    var r = cfg.r || 1.8;
    var color = cfg.color || 'var(--chart-1)';

    // axes (bottom + right, RTL-friendly)
    var axStroke = {
      fill: 'none',
      stroke: 'var(--color-ink-3)',
      'stroke-width': 0.7,
      'stroke-linecap': 'round'
    };
    if (cfg.rough) {
      svg.appendChild(el('path', Object.assign({
        d: roughPathD([[pad, h - pad], [w - pad, h - pad]], rand, 1, false)
      }, axStroke)));
      svg.appendChild(el('path', Object.assign({
        d: roughPathD([[w - pad, pad], [w - pad, h - pad]], rand, 1, false)
      }, axStroke)));
    } else {
      svg.appendChild(el('path', Object.assign({
        d: 'M ' + pad + ' ' + (h - pad) + ' H ' + (w - pad) + ' M ' + (w - pad) + ' ' + pad + ' V ' + (h - pad)
      }, axStroke)));
    }
    pts.forEach(function (p) {
      // RTL: larger x → further LEFT
      var cx = w - pad - (p[0] - xMin) / xR * (w - pad * 2);
      var cy = h - pad - (p[1] - yMin) / yR * (h - pad * 2);
      if (cfg.rough) {
        var circ = [];
        var rr = r + (rand() - 0.5) * 0.5;
        var a0 = rand() * Math.PI * 2;
        for (var s = 0; s <= 9; s++) {
          var a = a0 + s / 9 * Math.PI * 2.08;
          circ.push([cx + Math.cos(a) * (rr + (rand() - 0.5) * 0.5), cy + Math.sin(a) * (rr + (rand() - 0.5) * 0.5)]);
        }
        svg.appendChild(el('path', {
          d: roughPathD(circ, rand, 0.5, false),
          fill: 'none',
          stroke: color,
          'stroke-width': 0.9,
          'stroke-linecap': 'round'
        }));
      } else {
        svg.appendChild(el('circle', {
          cx: cx.toFixed(2),
          cy: cy.toFixed(2),
          r: r,
          fill: color,
          opacity: 0.85
        }));
      }
    });
    host.appendChild(svg);
  }

  // ---- gantt (RTL: time flows right → left) ---------------------------------

  function gantt(host, cfg) {
    var w = 100;
    var rows = cfg.rows;
    var rowH = 8,
      gap = 4;
    var labelW = cfg.labelWidth || 22;
    var plotW = w - labelW - 2;
    var h = rows.length * (rowH + gap) - gap;
    var total = cfg.total || Math.max.apply(null, rows.map(function (r) {
      return r.end;
    }));
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      width: '100%',
      height: '100%',
      preserveAspectRatio: 'none'
    });
    var rand = mulberry32(cfg.seed || 23);

    // faint vertical grid
    for (var g = 0; g <= 4; g++) {
      var gx = w - labelW - g / 4 * plotW;
      svg.appendChild(el('path', {
        d: 'M ' + gx.toFixed(2) + ' 0 V ' + h,
        stroke: 'var(--color-hairline)',
        'stroke-width': 0.5,
        fill: 'none'
      }));
    }
    rows.forEach(function (r, i) {
      var y = i * (rowH + gap);
      var x1 = w - labelW - r.end / total * plotW; // RTL: end is further left
      var len = (r.end - r.start) / total * plotW;
      var color = r.color || chartColor(i);
      if (cfg.rough) roughRect(svg, x1, y + rowH * 0.1, len, rowH * 0.8, color, rand, 1.1);else plainRect(svg, x1, y + rowH * 0.1, len, rowH * 0.8, color, 1.4);
      txt(svg, w - labelW + 2, y + rowH * 0.75, 4.6, 'start', r.label, 'var(--color-ink-2)');
    });
    host.appendChild(svg);
  }

  // ---- waterfall -------------------------------------------------------------

  function waterfall(host, cfg) {
    var w = 100,
      h = 60;
    var data = cfg.data; // [{label, value}] — last item may be {label, total:true}
    var n = data.length;
    var gap = 2.5;
    var barW = (w - gap * (n - 1)) / n;
    var colorUp = cfg.colorUp || 'var(--chart-2)';
    var colorDown = cfg.colorDown || 'var(--chart-5)';
    var colorTotal = cfg.colorTotal || 'var(--chart-1)';
    var rand = mulberry32(cfg.seed || 29);

    // compute running levels
    var cum = 0,
      levels = [];
    var maxLevel = 0,
      minLevel = 0;
    data.forEach(function (d) {
      if (d.total) {
        levels.push({
          from: 0,
          to: cum,
          total: true
        });
      } else {
        levels.push({
          from: cum,
          to: cum + d.value
        });
        cum += d.value;
      }
      maxLevel = Math.max(maxLevel, levels[levels.length - 1].from, levels[levels.length - 1].to);
      minLevel = Math.min(minLevel, levels[levels.length - 1].from, levels[levels.length - 1].to);
    });
    var range = maxLevel - minLevel || 1;
    function yOf(v) {
      return h - (v - minLevel) / range * h;
    }
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + (h + 14),
      width: '100%',
      height: '100%',
      preserveAspectRatio: 'none'
    });

    // RTL: first bar at the RIGHT
    levels.forEach(function (lv, i) {
      var x = w - (i + 1) * barW - i * gap;
      var yTop = yOf(Math.max(lv.from, lv.to));
      var barHt = Math.abs(yOf(lv.from) - yOf(lv.to)) || 0.8;
      var color = lv.total ? colorTotal : lv.to >= lv.from ? colorUp : colorDown;
      if (cfg.rough) roughRect(svg, x, yTop, barW, barHt, color, rand, 1.1);else plainRect(svg, x, yTop, barW, barHt, color, 1);
      // connector to next bar (leftward)
      if (i < levels.length - 1) {
        var lvNext = levels[i + 1];
        var cy = yOf(lv.total ? lv.to : lv.to);
        var connY = yOf(lvNext.total ? lvNext.to : lvNext.from);
        svg.appendChild(el('path', {
          d: 'M ' + x.toFixed(2) + ' ' + cy.toFixed(2) + ' H ' + (x - gap).toFixed(2),
          stroke: 'var(--color-ink-3)',
          'stroke-width': 0.6,
          'stroke-dasharray': '1.4 1.2',
          fill: 'none'
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
    try {
      cfg = JSON.parse(raw);
    } catch (e) {
      console.warn('Charts: bad data-chart-config JSON', e);
      return;
    }
    var fn = TYPES[type];
    if (!fn) {
      console.warn('Charts: unknown type "' + type + '"');
      return;
    }
    host.innerHTML = '';
    fn(host, cfg);
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
    barH: barH,
    stackedBar: stackedBar,
    line: line,
    scatter: scatter,
    gantt: gantt,
    waterfall: waterfall
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
  '<symbol id="icon-chev-l" viewBox="0 0 24 24"><path d="M14.5 5.5L8 12l6.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-chev-r" viewBox="0 0 24 24"><path d="M9.5 5.5L16 12l-6.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-expand" viewBox="0 0 24 24"><path d="M4 9.5V4h5.5M20 9.5V4h-5.5M4 14.5V20h5.5M20 14.5V20h-5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' +
  // ---- extended (data & media) ----
  '<symbol id="icon-chart-bar" viewBox="0 0 24 24"><path d="M4 20.5h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path><path d="M7 20.5v-6M12 20.5V7.5M17 20.5v-9.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-chart-pie" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.3" stroke="currentColor" stroke-width="1.7" fill="none"></circle><path d="M12 3.7V12l6 5.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.3" stroke="currentColor" stroke-width="1.7" fill="none"></circle><path d="M3.7 12h16.6M12 3.7c2.3 2.2 3.5 5.1 3.5 8.3s-1.2 6.1-3.5 8.3c-2.3-2.2-3.5-5.1-3.5-8.3s1.2-6.1 3.5-8.3z" stroke="currentColor" stroke-width="1.6" fill="none"></path></symbol>' + '<symbol id="icon-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7" fill="none"></circle><path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M18 6l-1.7 1.7M7.7 16.3L6 18M18 18l-1.7-1.7M7.7 7.7L6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-download" viewBox="0 0 24 24"><path d="M12 4v10.5M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M4.5 19.5h15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-upload" viewBox="0 0 24 24"><path d="M12 15V4.5M7.5 9L12 4.5 16.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M4.5 19.5h15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-link" viewBox="0 0 24 24"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.6 1.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.6-1.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-eye" viewBox="0 0 24 24"><path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="1.6" fill="none"></circle></symbol>' + '<symbol id="icon-bell" viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 2h-15l1.5-2z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M10 21a2.2 2.2 0 004 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-home" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M6 9.5V20h4.5v-5.5h3V20H18V9.5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.6" fill="none"></rect><rect x="13" y="4" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.6" fill="none"></rect><rect x="4" y="13" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.6" fill="none"></rect><rect x="13" y="13" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.6" fill="none"></rect></symbol>' + '<symbol id="icon-list" viewBox="0 0 24 24"><path d="M9 6.5h11M9 12h11M9 17.5h11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path><circle cx="4.8" cy="6.5" r="1" fill="currentColor" stroke="none"></circle><circle cx="4.8" cy="12" r="1" fill="currentColor" stroke="none"></circle><circle cx="4.8" cy="17.5" r="1" fill="currentColor" stroke="none"></circle></symbol>' + '<symbol id="icon-filter" viewBox="0 0 24 24"><path d="M4 5.5h16l-6.2 7.3v5.4l-3.6 2.3v-7.7L4 5.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-refresh" viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 11-2.2-5.3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" fill="none"></path><path d="M19.8 3.8v3.4h-3.4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-play" viewBox="0 0 24 24"><path d="M8 5.5l11 6.5-11 6.5v-13z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-pause" viewBox="0 0 24 24"><path d="M8.5 5.5v13M15.5 5.5v13" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-camera" viewBox="0 0 24 24"><path d="M3.5 8.5A1.5 1.5 0 015 7h2.6l1.6-2.2h5.6L16.4 7H19a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5v-9z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><circle cx="12" cy="12.7" r="3.2" stroke="currentColor" stroke-width="1.6" fill="none"></circle></symbol>' + '<symbol id="icon-mic" viewBox="0 0 24 24"><rect x="9" y="3.5" width="6" height="10.5" rx="3" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v2.7M9 20.7h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"></path></symbol>' + '<symbol id="icon-plane" viewBox="0 0 24 24"><path d="M10.4 13.6L4 11.3l1.6-1.6 5.4.6 4.6-4.6a1.6 1.6 0 012.3 2.3l-4.6 4.6.6 5.4-1.6 1.6-2.3-6.4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" fill="none"></path><path d="M7.5 16.5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-train" viewBox="0 0 24 24"><rect x="5.5" y="3.5" width="13" height="13.5" rx="2.5" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M5.5 10.5h13" stroke="currentColor" stroke-width="1.6"></path><circle cx="9" cy="13.8" r="1" fill="currentColor" stroke="none"></circle><circle cx="15" cy="13.8" r="1" fill="currentColor" stroke="none"></circle><path d="M9 17.5L7 20.5M15 17.5l2 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' + '<symbol id="icon-handshake" viewBox="0 0 24 24"><path d="M3 7.5l4-1.5 5 2 4.5-2 4.5 1.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M3.5 13.5l3.5 3a2 2 0 002.7 0l.4-.4M9 15l1.6 1.4a2 2 0 002.6 0l.4-.4M12.5 14.8l1.2 1a1.9 1.9 0 002.5-.1l3.8-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M12 8l-3.4 3.2a1.5 1.5 0 002 2.2L12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-scale" viewBox="0 0 24 24"><path d="M12 4v16M8 20h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path><path d="M12 5.5L6 7.2M12 5.5l6 1.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><path d="M3.5 13.5L6 7.5l2.5 6a2.9 2.9 0 01-5 0zM15.5 13.5L18 7.5l2.5 6a2.9 2.9 0 01-5 0z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"></path></symbol>' + '<symbol id="icon-battery" viewBox="0 0 24 24"><rect x="3" y="8" width="16" height="8" rx="1.6" stroke="currentColor" stroke-width="1.7" fill="none"></rect><path d="M21 10.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M6 10.5v3M9 10.5v3M12 10.5v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></symbol>' + '</defs>';
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
 * carrying data-sketch="<type>". Types: underline | underline-double |
 * underline-wavy | highlight | scribble | circle | loop | box | bracket |
 * star | arrow-h | arrow-v | arrow-curve | cross | strike-diag.
 *
 * arrow-curve honors data-sketch-curve="up|down" (default down) — a curved
 * annotation arrow sweeping toward its tip; respects RTL like arrow-h.
 * bracket honors data-sketch-side="start|end" (logical, RTL-aware).
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
    if (type === 'highlight' || type === 'underline' || type === 'circle' || type === 'underline-double' || type === 'underline-wavy' || type === 'scribble' || type === 'loop') {
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
      case 'underline-double':
        {
          var yd1 = h * 0.8,
            yd2 = h * 0.94;
          svg.appendChild(path(roughLine(rand, w * 0.02, yd1, w * 0.98, yd1 + jitter(rand, amt * 0.5), amt, 1), 'sketch-underline'));
          svg.appendChild(path(roughLine(rand, w * 0.05, yd2, w * 0.95, yd2 + jitter(rand, amt * 0.5), amt, 1), 'sketch-underline'));
          break;
        }
      case 'underline-wavy':
        {
          var yw = h * 0.88;
          var waves = Math.max(3, Math.round(w / 22));
          var stepW = w * 0.96 / waves;
          var dW = 'M ' + (w * 0.02).toFixed(1) + ' ' + yw.toFixed(1) + ' ';
          for (var wi = 0; wi < waves; wi++) {
            var cxW = w * 0.02 + stepW * (wi + 0.5);
            var exW = w * 0.02 + stepW * (wi + 1);
            var dir = wi % 2 === 0 ? -1 : 1;
            dW += 'Q ' + cxW.toFixed(1) + ' ' + (yw + dir * (h * 0.09 + jitter(rand, amt * 0.4))).toFixed(1) + ' ' + exW.toFixed(1) + ' ' + (yw + jitter(rand, amt * 0.3)).toFixed(1) + ' ';
          }
          svg.appendChild(path(dW, 'sketch-underline'));
          break;
        }
      case 'scribble':
        {
          /* zigzag fill scribble behind the text, like a fast marker fill */
          var nZ = Math.max(4, Math.round(w / 14));
          var dZ = 'M ' + 2 + ' ' + (h * 0.2 + jitter(rand, amt)).toFixed(1) + ' ';
          for (var zi = 1; zi <= nZ; zi++) {
            var xz = 2 + (w - 4) / nZ * zi + jitter(rand, amt * 0.6);
            var yz = (zi % 2 === 0 ? h * 0.18 : h * 0.82) + jitter(rand, amt);
            dZ += 'L ' + xz.toFixed(1) + ' ' + yz.toFixed(1) + ' ';
          }
          var scr = path(dZ, 'sketch-scribble');
          scr.setAttribute('opacity', '0.4');
          svg.appendChild(scr);
          break;
        }
      case 'loop':
        {
          /* lasso circle with an overshooting loop tail — more casual than 'circle' */
          var dL = roughEllipse(rand, w / 2, h / 2, w / 2 - 2, h / 2 - 2, amt, 1);
          var tA = -0.5 + jitter(rand, 0.3);
          var tx0 = w / 2 + Math.cos(tA) * (w / 2 - 2);
          var ty0 = h / 2 + Math.sin(tA) * (h / 2 - 2);
          dL += 'M ' + tx0.toFixed(1) + ' ' + ty0.toFixed(1) + ' Q ' + (tx0 + w * 0.14).toFixed(1) + ' ' + (ty0 - h * 0.5).toFixed(1) + ' ' + (tx0 + w * 0.05).toFixed(1) + ' ' + (ty0 - h * 0.28).toFixed(1) + ' ';
          svg.appendChild(path(dL));
          break;
        }
      case 'bracket':
        {
          /* one square bracket hugging a logical edge; RTL-aware */
          var side = el.getAttribute('data-sketch-side') || 'start';
          var isRtl = getComputedStyle(el).direction === 'rtl';
          var atRight = isRtl ? side === 'start' : side === 'end';
          var armB = Math.min(10, w * 0.4);
          var xB = atRight ? w - 2 : 2;
          var armDir = atRight ? -1 : 1;
          svg.appendChild(path(roughLine(rand, xB, 2, xB, h - 2, amt * 0.7, 1) + roughLine(rand, xB, 2, xB + armDir * armB, 2 + jitter(rand, amt * 0.4), amt * 0.6, 1) + roughLine(rand, xB, h - 2, xB + armDir * armB, h - 2 + jitter(rand, amt * 0.4), amt * 0.6, 1)));
          break;
        }
      case 'star':
        {
          /* hand-drawn 5-point star burst, centered */
          var cxS = w / 2,
            cyS = h / 2;
          var rOut = Math.min(w, h) / 2 - 2;
          var rIn = rOut * 0.42;
          var ptsS = [];
          for (var si = 0; si < 10; si++) {
            var aS = -Math.PI / 2 + si / 10 * Math.PI * 2 + jitter(rand, 0.08);
            var rS = (si % 2 === 0 ? rOut : rIn) * (1 + jitter(rand, 0.12));
            ptsS.push([cxS + Math.cos(aS) * rS, cyS + Math.sin(aS) * rS]);
          }
          var dS = '';
          for (var sj = 0; sj < 10; sj++) {
            var pA = ptsS[sj],
              pB = ptsS[(sj + 1) % 10];
            dS += roughLine(rand, pA[0], pA[1], pB[0], pB[1], amt * 0.5, 1);
          }
          svg.appendChild(path(dS));
          break;
        }
      case 'arrow-curve':
        {
          /* curved annotation arrow; data-sketch-curve="up|down", RTL-aware */
          var up = (el.getAttribute('data-sketch-curve') || 'down') === 'up';
          var rtlC = getComputedStyle(el).direction === 'rtl';
          var sxC = rtlC ? w - 4 : 4,
            exC = rtlC ? 4 : w - 4;
          var syC = up ? h * 0.85 : h * 0.15;
          var eyC = up ? h * 0.15 : h * 0.85;
          var cxC = (sxC + exC) / 2 + jitter(rand, amt);
          var cyC = up ? h * 1.05 : -h * 0.05;
          var dC = '';
          var prevX = sxC,
            prevY = syC;
          var segs = 6;
          dC += 'M ' + sxC.toFixed(1) + ' ' + syC.toFixed(1) + ' ';
          for (var ci = 1; ci <= segs; ci++) {
            var tC = ci / segs;
            var bx = (1 - tC) * (1 - tC) * sxC + 2 * (1 - tC) * tC * cxC + tC * tC * exC;
            var by = (1 - tC) * (1 - tC) * syC + 2 * (1 - tC) * tC * cyC + tC * tC * eyC;
            var mxC = (prevX + bx) / 2 + jitter(rand, amt * 0.6);
            var myC = (prevY + by) / 2 + jitter(rand, amt * 0.6);
            dC += 'Q ' + mxC.toFixed(1) + ' ' + myC.toFixed(1) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1) + ' ';
            prevX = bx;
            prevY = by;
          }
          svg.appendChild(path(dC, 'sketch-arrow-shaft'));
          var tipAngle = Math.atan2(eyC - cyC, exC - cxC);
          drawArrowhead(svg, rand, exC, eyC, tipAngle, Math.min(12, Math.max(w, h) * 0.22));
          break;
        }
      case 'strike-diag':
        {
          /* single decisive diagonal strike, corner to corner */
          var rtlD = getComputedStyle(el).direction === 'rtl';
          if (rtlD) svg.appendChild(path(roughLine(rand, w * 0.97, h * 0.85, w * 0.03, h * 0.15, amt, 1)));else svg.appendChild(path(roughLine(rand, w * 0.03, h * 0.85, w * 0.97, h * 0.15, amt, 1)));
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
