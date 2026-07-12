/**
 * Deck Navigation — optional slideshow layer for Workshop decks.
 *
 * Opt-in: only active when this script is loaded AND the document has at
 * least two top-level <section class="slide"> elements. It turns the default
 * vertical scroll/print page into a navigable presentation:
 *   - one slide per screen (centered, full viewport)
 *   - prev/next arrows + keyboard (←/→, Space, PageUp/Down, Home/End)
 *   - a "N / M" page counter and a top progress bar
 *   - the [data-animate] entrance animation is replayed each time a slide
 *     becomes active (this also fixes the "flash then disappears" issue in
 *     the centered single-viewport layout, where the scroll Intersection
 *     Observer never re-reveals the elements).
 *
 * Print / (prefers-reduced-motion: reduce) is untouched: all styling here is
 * gated to `@media screen`, so printing still yields one slide per page and
 * animations.css forces everything visible.
 *
 * Fully self-contained (injects its own CSS); load it after reveal.js:
 *   <script src="https://cdn.jsdelivr.net/gh/noamh98/workshop-design-system@main/project/js/deck-nav.js"></script>
 */
(function () {
  'use strict';

  function boot() {
    var slides = Array.prototype.slice.call(
      document.querySelectorAll('section.slide')
    );
    if (slides.length < 2) return; // single artifact — leave as scroll/print page

    document.documentElement.classList.add('wds-deck');
    injectStyles();

    var idx = 0;

    // --- navigation UI -----------------------------------------------------
    var nav = document.createElement('nav');
    nav.className = 'wds-deck-nav';
    nav.setAttribute('aria-label', 'ניווט מצגת');

    var next = document.createElement('button'); // advance = leftward in RTL
    next.type = 'button';
    next.className = 'wds-deck-nav__btn';
    next.innerHTML = '\u2039';
    next.setAttribute('aria-label', 'השקף הבא');

    var count = document.createElement('span');
    count.className = 'wds-deck-nav__count';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'wds-deck-nav__btn';
    prev.innerHTML = '\u203A';
    prev.setAttribute('aria-label', 'השקף הקודם');

    nav.appendChild(next);
    nav.appendChild(count);
    nav.appendChild(prev);
    document.body.appendChild(nav);

    var bar = document.createElement('div');
    bar.className = 'wds-deck-progress';
    document.body.appendChild(bar);

    // --- entrance replay ---------------------------------------------------
    function replay(slide) {
      var anim = slide.querySelectorAll('[data-animate]');
      var i;
      for (i = 0; i < anim.length; i++) anim[i].classList.remove('is-visible');
      void slide.offsetWidth; // force reflow so the removal takes effect
      for (i = 0; i < anim.length; i++) {
        var el = anim[i];
        el.style.setProperty('--stagger-i', i % 8);
        if (window.Reveal && window.Reveal.revealTarget) {
          window.Reveal.revealTarget(el);
        } else {
          el.classList.add('is-visible');
        }
      }
      // standalone counters (not wrapped in [data-animate])
      var loose = slide.querySelectorAll('[data-counter]');
      for (i = 0; i < loose.length; i++) {
        if (!loose[i].closest('[data-animate]') &&
            window.Reveal && window.Reveal.revealTarget) {
          window.Reveal.revealTarget(loose[i]);
        }
      }
      if (window.Sketch && window.Sketch.scheduleRefresh) {
        window.Sketch.scheduleRefresh();
      }
    }

    function show(i) {
      idx = Math.max(0, Math.min(slides.length - 1, i));
      for (var k = 0; k < slides.length; k++) {
        slides[k].classList.toggle('is-active', k === idx);
        slides[k].setAttribute('aria-hidden', k === idx ? 'false' : 'true');
      }
      count.textContent = (idx + 1) + ' / ' + slides.length;
      prev.disabled = idx === 0;
      next.disabled = idx === slides.length - 1;
      bar.style.width = ((idx + 1) / slides.length * 100) + '%';
      replay(slides[idx]);
    }

    next.addEventListener('click', function () { show(idx + 1); });
    prev.addEventListener('click', function () { show(idx - 1); });

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowLeft':
        case 'PageDown':
        case ' ':
          show(idx + 1); e.preventDefault(); break;
        case 'ArrowRight':
        case 'PageUp':
          show(idx - 1); e.preventDefault(); break;
        case 'Home':
          show(0); e.preventDefault(); break;
        case 'End':
          show(slides.length - 1); e.preventDefault(); break;
        default: break;
      }
    });

    // basic touch swipe
    var tx = 0;
    document.addEventListener('touchstart', function (e) {
      tx = e.changedTouches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) < 50) return;
      // RTL: swipe left → advance
      if (dx < 0) show(idx + 1); else show(idx - 1);
    }, { passive: true });

    // Start once the deck's own Charts/Sketch bootstrap has had a chance to
    // render (charts/sketches size correctly under visibility:hidden).
    setTimeout(function () { show(0); }, 350);
  }

  function injectStyles() {
    if (document.getElementById('wds-deck-nav-styles')) return;
    var css = [
      '@media screen {',
      '  .wds-deck, .wds-deck body { height: 100%; }',
      '  .wds-deck body { display: block !important; overflow: hidden; padding: 0 !important; margin: 0; }',
      '  .wds-deck body > div[dir="rtl"] { display: block !important; max-width: none !important; margin: 0 !important; gap: 0 !important; }',
      '  .wds-deck section.slide {',
      '    position: fixed; inset: 0; margin: auto;',
      '    width: min(1680px, 96vw); max-height: 100vh;',
      '    display: flex; align-items: center; justify-content: center;',
      '    opacity: 0; visibility: hidden;',
      '    transition: opacity .45s ease;',
      '    padding: clamp(1rem, 3vw, 3rem); box-sizing: border-box; overflow: auto;',
      '  }',
      '  .wds-deck section.slide.is-active { opacity: 1; visibility: visible; z-index: 1; }',
      '  .wds-deck section.slide > * { width: 100%; }',
      '  .wds-deck-nav {',
      '    position: fixed; z-index: 60; bottom: 1rem; left: 50%; transform: translateX(-50%);',
      '    direction: ltr; display: flex; align-items: center; gap: .75rem;',
      '    background: rgba(20, 21, 25, .78); color: #fff;',
      '    padding: .35rem .85rem; border-radius: 999px;',
      '    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;',
      '    box-shadow: 0 4px 16px rgba(0, 0, 0, .3); backdrop-filter: blur(4px);',
      '  }',
      '  .wds-deck-nav__btn {',
      '    all: unset; cursor: pointer; color: #fff; font-size: 1.6rem; line-height: 1;',
      '    padding: .1rem .55rem; border-radius: 50%; transition: background .15s ease;',
      '  }',
      '  .wds-deck-nav__btn:hover:not(:disabled) { background: rgba(255, 255, 255, .15); }',
      '  .wds-deck-nav__btn:disabled { opacity: .3; cursor: default; }',
      '  .wds-deck-nav__count { font-size: .95rem; min-width: 3.5rem; text-align: center; font-variant-numeric: tabular-nums; }',
      '  .wds-deck-progress {',
      '    position: fixed; top: 0; right: 0; height: 4px; z-index: 60; width: 0;',
      '    background: var(--ink-blue, #3b82f6); transition: width .3s ease;',
      '  }',
      '}'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'wds-deck-nav-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
