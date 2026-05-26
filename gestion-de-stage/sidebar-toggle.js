/* sidebar-toggle.js — partagé par toutes les pages étudiant */

/* ── Appliquer le thème immédiatement pour éviter le flash ── */
(function () {
  var t = localStorage.getItem('app_theme') || 'light';
  var html = document.documentElement;
  if (t === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
    /* Override CSS variables pour les pages étudiant */
    var dv = { '--bg':'#0f172a','--white':'#1e293b','--border':'#334155','--text':'#e2e8f0','--muted':'#94a3b8','--card':'#1e293b','--surface':'#263348' };
    Object.keys(dv).forEach(function(k){ html.style.setProperty(k, dv[k]); });
  } else {
    html.classList.add('light');
    html.classList.remove('dark');
  }
})();

/* ── Injecter theme.js (dark mode + i18n + widget flottant) ── */
(function () {
  if (document.getElementById('__theme-js')) return;
  var s = document.createElement('script');
  s.id  = '__theme-js';
  s.src = '/theme.js';
  document.body.appendChild(s);
})();

function toggleExtra(toggleEl) {
  toggleEl.classList.toggle('open');
  const extra = toggleEl.nextElementSibling;
  if (extra) extra.classList.toggle('open');
  // Mémoriser l'état
  localStorage.setItem('navExtraOpen', toggleEl.classList.contains('open') ? '1' : '0');
}

// Restaurer l'état au chargement
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-section-toggle');
  const extra  = document.querySelector('.nav-extra');
  if (!toggle || !extra) return;

  // Si l'item actif est dans la section extra, l'ouvrir automatiquement
  const activeInExtra = extra.querySelector('.nav-item.active');
  if (activeInExtra) {
    toggle.classList.add('open');
    extra.classList.add('open');
    return;
  }
  // Sinon restaurer la préférence utilisateur
  if (localStorage.getItem('navExtraOpen') === '1') {
    toggle.classList.add('open');
    extra.classList.add('open');
  }
});
