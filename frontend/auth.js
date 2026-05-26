/**
 * auth.js — Guard d'authentification partagé
 * Inclure ce fichier dans toutes les pages protégées :
 *   <script src="/auth.js"></script>
 *
 * Utilisation :
 *   checkAuth('chef_departement');   // redirige si mauvais rôle
 *   logout();                        // déconnecte et retourne au login
 */

/* ── Appliquer le thème immédiatement pour éviter le flash ── */
(function () {
  var t = localStorage.getItem('app_theme') || 'light';
  document.documentElement.classList.add(t === 'dark' ? 'dark' : 'light');
  if (t === 'dark') document.documentElement.classList.remove('light');
  else document.documentElement.classList.remove('dark');
})();

/* ── Injecter theme.js (dark mode + i18n + widget flottant) ── */
(function () {
  if (document.getElementById('__theme-js')) return;
  var s = document.createElement('script');
  s.id  = '__theme-js';
  s.src = '/theme.js';
  document.head.appendChild(s);
})();

(function() {

  /**
   * Vérifie que l'utilisateur est connecté et a le bon rôle.
   * @param {string|string[]} expectedRole - rôle(s) autorisé(s)
   */
  window.checkAuth = function(expectedRole) {
    const role = localStorage.getItem('user_role');
    if (!role) {
      window.location.href = '/login.html';
      return false;
    }
    if (expectedRole) {
      const roles = Array.isArray(expectedRole) ? expectedRole : [expectedRole];
      if (!roles.includes(role)) {
        window.location.href = '/login.html';
        return false;
      }
    }
    return true;
  };

  /** Déconnecte l'utilisateur et redirige vers la page de login */
  window.logout = function() {
    localStorage.clear();
    window.location.href = '/login.html?logout=1';
  };

  /** Retourne l'ID de l'utilisateur connecté selon son rôle */
  window.getCurrentId = function() {
    const role = localStorage.getItem('user_role');
    if (role === 'chef_departement') return parseInt(localStorage.getItem('chef_id'));
    if (role === 'encadrant')        return parseInt(localStorage.getItem('enc_id'));
    if (role === 'administrateur')   return parseInt(localStorage.getItem('admin_id'));
    if (role === 'etudiant')         return parseInt(localStorage.getItem('etudiant_id'));
    return parseInt(localStorage.getItem('user_id'));
  };

})();
