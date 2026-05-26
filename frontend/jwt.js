// frontend/jwt.js
// Gestion du token JWT pour toutes les requêtes API protégées

(function() {
  // Stockage du token dans localStorage
  function setToken(token) {
    if (token) localStorage.setItem('jwt_token', token);
    else localStorage.removeItem('jwt_token');
  }
  function getToken() {
    return localStorage.getItem('jwt_token') || '';
  }
  // Wrapper fetch qui ajoute automatiquement le header Authorization
  async function jwtFetch(input, init = {}) {
    const token = getToken();
    if (token && typeof input === 'string' && input.includes('/api/')) {
      init.headers = init.headers || {};
      if (!init.headers['Authorization'] && !init.headers['authorization']) {
        init.headers['Authorization'] = 'Bearer ' + token;
      }
    }
    return fetch(input, init);
  }
  window.jwtFetch = jwtFetch;
  window.setJwtToken = setToken;
  window.getJwtToken = getToken;
})();
