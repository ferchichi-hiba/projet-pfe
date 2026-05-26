/**
 * theme.js — Dark Mode + Internationalisation (FR ↔ EN)
 * Inclure dans toutes les pages : <script src="/theme.js"></script>
 * Ou auto-injecté via auth.js (frontend) et sidebar-toggle.js (étudiant)
 */
(function () {
  'use strict';

  var STORAGE_THEME = 'app_theme'; // 'light' | 'dark'
  var STORAGE_LANG  = 'app_lang';  // 'fr'    | 'en'

  /* ═══════════════════════════════════════════════════════════
     APPLIQUER LE THÈME IMMÉDIATEMENT (évite le flash blanc)
  ═══════════════════════════════════════════════════════════ */
  var _initTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  if (_initTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }

  /* ═══════════════════════════════════════════════════════════
     VARIABLES CSS POUR PAGES ÉTUDIANT (override via JS)
  ═══════════════════════════════════════════════════════════ */
  var ETU_DARK_VARS = {
    '--bg'     : '#0f172a',
    '--white'  : '#1e293b',
    '--border' : '#334155',
    '--text'   : '#e2e8f0',
    '--muted'  : '#94a3b8',
    '--card'   : '#1e293b',
    '--surface': '#263348',
  };

  function applyEtuVars(isDark) {
    var root = document.documentElement;
    if (isDark) {
      Object.keys(ETU_DARK_VARS).forEach(function (k) {
        root.style.setProperty(k, ETU_DARK_VARS[k]);
      });
    } else {
      Object.keys(ETU_DARK_VARS).forEach(function (k) {
        root.style.removeProperty(k);
      });
    }
  }

  // Appliquer les vars immédiatement si dark mode actif
  if (_initTheme === 'dark') applyEtuVars(true);

  /* ═══════════════════════════════════════════════════════════
     CSS INJECTÉ — Dark mode pour pages Tailwind + Étudiant
  ═══════════════════════════════════════════════════════════ */
  var DARK_CSS = [
    /* Base */
    'html.dark { color-scheme: dark; }',
    'html.dark body { background: #0f172a !important; color: #e2e8f0 !important; }',

    /* Tailwind background utilities */
    'html.dark .bg-white { background-color: #1e293b !important; }',
    'html.dark .bg-gray-50 { background-color: #1a2537 !important; }',
    'html.dark .bg-gray-100 { background-color: #1e293b !important; }',
    'html.dark .bg-gray-200 { background-color: #263348 !important; }',
    'html.dark .hover\\:bg-gray-100:hover { background-color: #263348 !important; }',
    'html.dark .hover\\:bg-gray-50:hover  { background-color: #1e293b !important; }',

    /* Tailwind text utilities */
    'html.dark .text-gray-900 { color: #f1f5f9 !important; }',
    'html.dark .text-gray-800 { color: #e2e8f0 !important; }',
    'html.dark .text-gray-700 { color: #cbd5e1 !important; }',
    'html.dark .text-gray-600 { color: #94a3b8 !important; }',
    'html.dark .text-gray-500 { color: #64748b !important; }',
    'html.dark .text-gray-400 { color: #475569 !important; }',

    /* Tailwind borders */
    'html.dark .border-gray-200, html.dark .border-gray-300 { border-color: #334155 !important; }',
    'html.dark .divide-gray-200 > * + * { border-color: #334155 !important; }',

    /* Stat cards chef/admin/encadrant */
    'html.dark .stat-card { background: #1e293b !important; box-shadow: 0 2px 16px rgba(0,0,0,0.35) !important; }',
    'html.dark .stat-lbl  { color: #94a3b8 !important; }',
    'html.dark .stat-sub  { color: #64748b !important; }',

    /* Topbar sticky */
    'html.dark .sticky.top-0 { background: #1e293b !important; border-bottom-color: #334155 !important; }',
    'html.dark .sticky.top-0 h1, html.dark .sticky.top-0 h2 { color: #f1f5f9 !important; }',

    /* Headings inline style override (chef pages: style="color:#0c2340") */
    'html.dark h1:not(.text-white):not([style*="color:#fff"]) { color: #f1f5f9 !important; }',
    'html.dark h2:not(.text-white):not([style*="color:#fff"]):not([style*="color:rgba"]) { color: #e2e8f0 !important; }',
    'html.dark h3:not(.text-white):not([style*="color:#fff"]) { color: #cbd5e1 !important; }',
    'html.dark p.text-xs:not([style*="color:#c9930a"]):not([style*="color:rgba"]) { color: #94a3b8 !important; }',

    /* Tables */
    'html.dark table { border-color: #334155 !important; }',
    'html.dark thead, html.dark thead tr { background: #0f172a !important; }',
    'html.dark thead th { background: #0f172a !important; color: #94a3b8 !important; border-color: #334155 !important; }',
    'html.dark tbody tr { border-color: #334155 !important; }',
    'html.dark tbody tr:hover { background: #1e2d45 !important; }',
    'html.dark td { border-color: #334155 !important; color: #e2e8f0; }',

    /* Forms */
    'html.dark input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]) { background: #1e293b !important; color: #e2e8f0 !important; border-color: #475569 !important; }',
    'html.dark select { background: #1e293b !important; color: #e2e8f0 !important; border-color: #475569 !important; }',
    'html.dark textarea { background: #1e293b !important; color: #e2e8f0 !important; border-color: #475569 !important; }',
    'html.dark input::placeholder, html.dark textarea::placeholder { color: #64748b !important; }',
    'html.dark label:not(.text-white) { color: #cbd5e1 !important; }',

    /* Cards / panels generiques */
    'html.dark .rounded-2xl.p-6:not([style*="background:linear-gradient"]):not([style*="background: linear-gradient"]) { background: #1e293b !important; }',
    'html.dark .rounded-xl.p-4:not([class*="bg-"]):not([style*="background"]) { background: #1e293b !important; }',
    'html.dark .shadow, html.dark .shadow-md, html.dark .shadow-lg { box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important; }',

    /* Modals (pattern courant: fixed inset bg overlay + white box) */
    'html.dark .fixed.inset-0 > .bg-white, html.dark .fixed.inset-0 > div > .bg-white { background: #1e293b !important; }',
    'html.dark [id*="Modal"] { background: #1e293b !important; }',
    'html.dark [id*="modal"] { background: #1e293b !important; }',

    /* Select dropdown options */
    'html.dark option { background: #1e293b; color: #e2e8f0; }',

    /* Hover states */
    'html.dark a:not(.nav-link):not(.nav-item):not([class*="btn"]):not(.text-white):not([style*="color:#c9930a"]) { color: #93c5fd; }',

    /* Étudiant pages — sidebar (light version only, étudiant-theme overrides dark one) */
    'html.dark .sidebar:not([style*="linear-gradient(180deg, #0f0c29"]) { background: #0f1729 !important; border-right-color: #1e293b !important; }',
    'html.dark .sidebar .logo { color: #e2e8f0 !important; border-bottom-color: #334155 !important; }',
    'html.dark .sidebar-bottom { border-top-color: #334155 !important; }',
    'html.dark .user-chip { background: #0f172a !important; }',
    'html.dark .user-chip-name { color: #e2e8f0 !important; }',
    'html.dark .topbar { background: #1e293b !important; border-bottom-color: #334155 !important; }',
    'html.dark .topbar h2, html.dark .topbar span:not([style]) { color: #e2e8f0 !important; }',

    /* Cards étudiant */
    'html.dark .card { background: #1e293b !important; border-color: #334155 !important; }',
    'html.dark .stage-card { background: #1e293b !important; border-color: #334155 !important; }',
    'html.dark .ressource-card { background: #1e293b !important; border-color: #334155 !important; }',
    'html.dark .resource-card { background: #1e293b !important; border-color: #334155 !important; }',
    'html.dark .notif-item { background: #1e293b !important; border-color: #334155 !important; }',
    'html.dark .section-card, html.dark .info-card { background: #1e293b !important; border-color: #334155 !important; }',
    'html.dark .msg-bubble.other { background: #263348 !important; }',

    /* Chat/messagerie dark */
    'html.dark .msg-area, html.dark .chat-area { background: #0f172a !important; }',
    'html.dark .conv-item { background: #1e293b !important; border-color: #334155 !important; }',
    'html.dark .conv-item:hover { background: #263348 !important; }',

    /* Scrollbar */
    'html.dark ::-webkit-scrollbar { width: 6px; height: 6px; }',
    'html.dark ::-webkit-scrollbar-track { background: #0f172a; }',
    'html.dark ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }',
    'html.dark ::-webkit-scrollbar-thumb:hover { background: #64748b; }',

    /* ══ WIDGET FLOTTANT ══ */
    '#theme-widget { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 9999; }',
    '#theme-widget button { width: 44px; height: 44px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); cursor: pointer; font-size: 1.1rem; font-weight: 700; box-shadow: 0 4px 14px rgba(0,0,0,0.25); transition: transform 0.2s, box-shadow 0.2s, background 0.3s; background: #1e293b; color: #f1f5f9; display: flex; align-items: center; justify-content: center; }',
    'html.dark #theme-widget button { background: #f1f5f9; color: #1e293b; border-color: rgba(0,0,0,0.1); }',
    '#theme-widget button:hover { transform: scale(1.12); box-shadow: 0 6px 20px rgba(0,0,0,0.35); }',
    '#tw-lang { font-size: 0.7rem !important; letter-spacing: 0.05em; }',

    /* Smooth transition globale */
    'body, .stat-card, .bg-white, input, select, textarea, table, th, td, .card, .topbar { transition: background-color 0.3s, border-color 0.3s, color 0.2s; }',
  ].join('\n');

  /* ═══════════════════════════════════════════════════════════
     DICTIONNAIRE DE TRADUCTION (FR ↔ EN)
  ═══════════════════════════════════════════════════════════ */
  var NAV = {
    fr: {
      /* Chef / Admin / Encadrant — frontend/ */
      'dashboard.html'    : 'Dashboard',
      'demandes.html'     : 'Demandes',
      'affectation.html'  : 'Affectation',
      'stages.html'       : 'Stages',
      'deadlines.html'    : 'Deadlines',
      'suggestions.html'  : 'Suggestions',
      'soutenances.html'  : 'Soutenances',
      'messagerie.html'   : 'Messagerie',
      'ressources.html'   : 'Ressources',
      'notifications.html': 'Notifications',
      'profil.html'       : 'Mon Profil',
      'utilisateurs.html' : 'Utilisateurs',
      'departement.html'  : 'Département',
      'etudiants.html'    : 'Mes Étudiants',
      'rapports.html'     : 'Rapports',
      'journal.html'      : 'Journal',
      'reunion.html'      : 'Réunions',
      'reunions.html'     : 'Réunions',
      /* Étudiant — gestion-de-stage/ */
      'stage.html'        : 'Mon Stage',
      'demande-stage.html': 'Demande de Stage',
      'etudiant.html'     : 'Tableau de bord',
      'ressource.html'    : 'Ressources',
      'suggestion.html'   : 'Suggestions',
      'document.html'     : 'Documents',
      'planning.html'     : 'Planning',
      'chatbot.html'      : 'Chatbot IA',
      'cv.html'           : 'Mon CV',
      'carte-etudiant.html'   : 'Carte Étudiant',
      'carte-stagiaires.html' : 'Carte Stagiaires',
      'rendez-vous.html'  : 'Rendez-vous',
      'soutenance.html'   : 'Soutenance',
    },
    en: {
      /* Chef / Admin / Encadrant */
      'dashboard.html'    : 'Dashboard',
      'demandes.html'     : 'Requests',
      'affectation.html'  : 'Assignment',
      'stages.html'       : 'Internships',
      'deadlines.html'    : 'Deadlines',
      'suggestions.html'  : 'Suggestions',
      'soutenances.html'  : 'Defenses',
      'messagerie.html'   : 'Messaging',
      'ressources.html'   : 'Resources',
      'notifications.html': 'Notifications',
      'profil.html'       : 'My Profile',
      'utilisateurs.html' : 'Users',
      'departement.html'  : 'Department',
      'etudiants.html'    : 'My Students',
      'rapports.html'     : 'Reports',
      'journal.html'      : 'Journal',
      'reunion.html'      : 'Meetings',
      'reunions.html'     : 'Meetings',
      /* Étudiant */
      'stage.html'        : 'My Internship',
      'demande-stage.html': 'Internship Request',
      'etudiant.html'     : 'Dashboard',
      'ressource.html'    : 'Resources',
      'suggestion.html'   : 'Suggestions',
      'document.html'     : 'Documents',
      'planning.html'     : 'Schedule',
      'chatbot.html'      : 'AI Chatbot',
      'cv.html'           : 'My CV',
      'carte-etudiant.html'   : 'Student Card',
      'carte-stagiaires.html' : 'Intern Map',
      'rendez-vous.html'  : 'Appointments',
      'soutenance.html'   : 'Defense',
    }
  };

  /* data-i18n translations */
  var I18N = {
    fr: {
      'btn.save'    : 'Enregistrer',
      'btn.cancel'  : 'Annuler',
      'btn.delete'  : 'Supprimer',
      'btn.edit'    : 'Modifier',
      'btn.close'   : 'Fermer',
      'btn.search'  : 'Rechercher',
      'btn.add'     : 'Ajouter',
      'btn.logout'  : 'Déconnexion',
      'btn.upload'  : 'Importer',
      'btn.download': 'Télécharger',
      'btn.confirm' : 'Confirmer',
      'btn.submit'  : 'Soumettre',
      'lbl.loading' : 'Chargement…',
      'lbl.nodata'  : 'Aucune donnée',
      'lbl.status'  : 'Statut',
      'lbl.actions' : 'Actions',
      'lbl.date'    : 'Date',
      'lbl.name'    : 'Nom',
      'lbl.email'   : 'Email',
    },
    en: {
      'btn.save'    : 'Save',
      'btn.cancel'  : 'Cancel',
      'btn.delete'  : 'Delete',
      'btn.edit'    : 'Edit',
      'btn.close'   : 'Close',
      'btn.search'  : 'Search',
      'btn.add'     : 'Add',
      'btn.logout'  : 'Logout',
      'btn.upload'  : 'Upload',
      'btn.download': 'Download',
      'btn.confirm' : 'Confirm',
      'btn.submit'  : 'Submit',
      'lbl.loading' : 'Loading…',
      'lbl.nodata'  : 'No data',
      'lbl.status'  : 'Status',
      'lbl.actions' : 'Actions',
      'lbl.date'    : 'Date',
      'lbl.name'    : 'Name',
      'lbl.email'   : 'Email',
    }
  };

  /* ═══════════════════════════════════════════════════════════
     ÉTAT
  ═══════════════════════════════════════════════════════════ */
  function getTheme() { return localStorage.getItem(STORAGE_THEME) || 'light'; }
  function getLang()  { return localStorage.getItem(STORAGE_LANG)  || 'fr'; }

  /* ═══════════════════════════════════════════════════════════
     GESTION DU THÈME
  ═══════════════════════════════════════════════════════════ */
  function setTheme(theme) {
    localStorage.setItem(STORAGE_THEME, theme);
    var html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
      applyEtuVars(true);
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      applyEtuVars(false);
    }
    _updateWidget();
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  /* ═══════════════════════════════════════════════════════════
     GESTION DE LA LANGUE
  ═══════════════════════════════════════════════════════════ */
  function setLang(lang) {
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang;
    _applyLang(lang);
    _updateWidget();
  }

  function toggleLang() {
    setLang(getLang() === 'fr' ? 'en' : 'fr');
  }

  function _applyLang(lang) {
    var dict = NAV[lang]  || NAV.fr;
    var i18n = I18N[lang] || I18N.fr;

    /* 1. Éléments avec data-i18n */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (i18n[key] !== undefined) el.textContent = i18n[key];
    });

    /* 2. Liens de navigation — traduit le nœud texte (pas le span icon / <i>) */
    var navLinks = document.querySelectorAll('.nav-link[href], .nav-item[href]');
    navLinks.forEach(function (link) {
      var href     = link.getAttribute('href') || '';
      var filename = href.split('/').pop().split('?')[0];
      var text     = dict[filename];
      if (!text) return;
      // Trouver le nœud texte direct (hors enfants) et le remplacer
      var childNodes = link.childNodes;
      var replaced = false;
      for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        if (node.nodeType === 3 && node.textContent.trim()) { // TEXT_NODE
          node.textContent = ' ' + text;
          replaced = true;
          break;
        }
      }
      // Fallback : si pas de texte direct, ajouter à la fin
      if (!replaced) {
        link.appendChild(document.createTextNode(' ' + text));
      }
    });

    /* 3. Bouton de déconnexion (texte variable selon les pages) */
    document.querySelectorAll('button, a').forEach(function (el) {
      var txt = el.textContent.trim();
      if (txt === 'Déconnexion' || txt === 'Logout') {
        el.textContent = lang === 'en' ? 'Logout' : 'Déconnexion';
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     WIDGET FLOTTANT
  ═══════════════════════════════════════════════════════════ */
  function _injectCSS() {
    if (document.getElementById('__dark-css')) return;
    var style = document.createElement('style');
    style.id  = '__dark-css';
    style.textContent = DARK_CSS;
    document.head.appendChild(style);
  }

  function _createWidget() {
    if (document.getElementById('theme-widget')) return;
    var w = document.createElement('div');
    w.id = 'theme-widget';
    w.innerHTML =
      '<button id="tw-theme" title="Dark / Light" onclick="window.__theme.toggleTheme()">🌙</button>' +
      '<button id="tw-lang"  title="Langue / Language" onclick="window.__theme.toggleLang()">EN</button>';
    document.body.appendChild(w);
    _updateWidget();
  }

  function _updateWidget() {
    var tb = document.getElementById('tw-theme');
    var lb = document.getElementById('tw-lang');
    if (tb) tb.textContent = getTheme() === 'dark' ? '☀️' : '🌙';
    if (lb) lb.textContent = getLang()  === 'fr'   ? 'EN' : 'FR';
  }

  /* ═══════════════════════════════════════════════════════════
     INITIALISATION AU CHARGEMENT DU DOM
  ═══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    _injectCSS();
    _createWidget();
    document.documentElement.lang = getLang();
    // Appliquer la langue si non-français
    if (getLang() !== 'fr') _applyLang(getLang());
    // Réappliquer les vars (cas sidebar-toggle.js en bas de body)
    if (getTheme() === 'dark') applyEtuVars(true);
  });

  /* ═══════════════════════════════════════════════════════════
     API PUBLIQUE
  ═══════════════════════════════════════════════════════════ */
  window.__theme = {
    toggleTheme : toggleTheme,
    toggleLang  : toggleLang,
    setTheme    : setTheme,
    setLang     : setLang,
    getTheme    : getTheme,
    getLang     : getLang,
    /** Traduit une clé i18n (usage dans les pages) */
    t: function (key) {
      return (I18N[getLang()] || I18N.fr)[key] || key;
    },
    /** Ré-applique la langue courante (appeler après un rechargement dynamique du DOM) */
    refresh: function () {
      _applyLang(getLang());
      _updateWidget();
    }
  };

})();
