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
      requestAnimationFrame(function () { fill.style.width = pct + '%'; });
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
        if (el.hasAttribute('data-counter')) animateCounter(el);
        else fillProgress(el);
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
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    all.forEach(function (t) { io.observe(t); });
  }

  window.Reveal = { init: init, revealTarget: revealTarget };
  document.addEventListener('DOMContentLoaded', function () { init(); });
})();
