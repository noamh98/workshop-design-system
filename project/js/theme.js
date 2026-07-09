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

  function toggleTheme() { setTheme(currentTheme() === 'dark' ? 'light' : 'dark'); }
  function toggleLang() { setLang(currentLang() === 'he' ? 'en' : 'he'); }

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

  window.WorkshopTheme = { setTheme: setTheme, setLang: setLang, toggleTheme: toggleTheme, toggleLang: toggleLang };
})();
