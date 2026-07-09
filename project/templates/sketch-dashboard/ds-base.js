// templates/sketch-dashboard/ds-base.js
// Loads the Workshop Design System global CSS + runtime JS relative to `base`.
// In a consuming project, point `base` at the bound _ds/<folder> tree.
(() => {
  const base = '../..';
  for (const p of ['styles.css']) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  for (const j of ['js/theme.js', 'js/sketch.js', 'js/charts.js']) {
    const s = document.createElement('script');
    s.src = base + '/' + j;
    s.onerror = () => console.error('ds-base.js: failed to load ' + s.src);
    document.head.appendChild(s);
  }
})();
