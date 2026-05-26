const fs = require('fs');
const path = require('path');
const BASE = 'D:\\Bureau\\gestion-stages\\frontend';

const FONT_LINK = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const UNIV_CSS = `
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f0f4fa; margin: 0; }
    .sidebar { background: linear-gradient(180deg, #0c2340 0%, #163a5f 100%); }
    .nav-link {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      color: rgba(255,255,255,0.65); font-size: .875rem; font-weight: 500;
      text-decoration: none; transition: all .2s;
      border-left: 3px solid transparent;
    }
    .nav-link:hover { background: rgba(255,255,255,.1); color: #fff; }
    .nav-link.active { background: rgba(201,147,10,.2); color: #f5d87e; border-left-color: #c9930a; }
    .nav-icon { width: 22px; text-align: center; }
    .fade-in { animation: fadeIn .4s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    .carte { transition: all .25s; }
    .carte:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(12,35,64,.14); }
`;

function chefSidebar(active) {
  const links = [
    ['dashboard.html','📊','Dashboard'],
    ['demandes.html','📩','Demandes'],
    ['affectation.html','🔗','Affectation'],
    ['stages.html','📋','Stages'],
    ['deadlines.html','⏰','Deadlines'],
    ['suggestions.html','💡','Suggestions'],
    ['profil.html','👤','Mon Profil'],
  ];
  const nav = links.map(([href,icon,label]) =>
    `      <a href="${href}" class="nav-link${href===active?' active':''}"><span class="nav-icon">${icon}</span> ${label}</a>`
  ).join('\n');
  return `  <aside class="sidebar w-64 flex flex-col fixed h-full z-30">
    <div class="px-5 py-5" style="border-bottom:1px solid rgba(255,255,255,.1)">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
             style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">🎓</div>
        <div><p class="text-white font-bold text-sm">Gestion Stages</p>
        <p class="text-xs" style="color:rgba(255,255,255,.45)">Plateforme Universitaire</p></div>
      </div>
    </div>
    <div class="mx-3 my-3 p-3 rounded-xl" style="background:rgba(255,255,255,.08)">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
             style="background:#c9930a;color:#0c2340" id="avatarMenu">CH</div>
        <div class="min-w-0">
          <p class="text-white text-sm font-semibold" id="nomMenu">Chef</p>
          <p class="text-xs truncate" style="color:#c9930a" id="nomDept">Département</p>
        </div>
      </div>
    </div>
    <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
${nav}
    </nav>
    <div class="px-3 pb-4 pt-2" style="border-top:1px solid rgba(255,255,255,.1)">
      <button class="nav-link w-full text-left" style="color:#fca5a5"><span class="nav-icon">🚪</span> Déconnexion</button>
    </div>
  </aside>`;
}

function encadrantSidebar(active) {
  const links = [
    ['dashboard.html','📊','Dashboard'],
    ['etudiants.html','👥','Mes Étudiants'],
    ['messagerie.html','💬','Messagerie'],
    ['rapports.html','📄','Rapports'],
    ['suggestions.html','💡','Suggestions'],
    ['profil.html','👤','Mon Profil'],
  ];
  const nav = links.map(([href,icon,label]) =>
    `      <a href="${href}" class="nav-link${href===active?' active':''}"><span class="nav-icon">${icon}</span> ${label}</a>`
  ).join('\n');
  return `  <aside class="sidebar w-64 flex flex-col fixed h-full z-30">
    <div class="px-5 py-5" style="border-bottom:1px solid rgba(255,255,255,.1)">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
             style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">🎓</div>
        <div><p class="text-white font-bold text-sm">Gestion Stages</p>
        <p class="text-xs" style="color:rgba(255,255,255,.45)">Plateforme Universitaire</p></div>
      </div>
    </div>
    <div class="mx-3 my-3 p-3 rounded-xl" style="background:rgba(255,255,255,.08)">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
             style="background:#c9930a;color:#0c2340" id="avatarMenu">EN</div>
        <div class="min-w-0">
          <p class="text-white text-sm font-semibold" id="nomMenu">Encadrant</p>
          <p class="text-xs truncate" style="color:#c9930a" id="deptMenu">Département</p>
        </div>
      </div>
    </div>
    <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
${nav}
    </nav>
    <div class="px-3 pb-4 pt-2" style="border-top:1px solid rgba(255,255,255,.1)">
      <button class="nav-link w-full text-left" style="color:#fca5a5"><span class="nav-icon">🚪</span> Déconnexion</button>
    </div>
  </aside>`;
}

function topbar(icon, title, subtitle, extra='') {
  return `    <div class="bg-white px-6 py-4 sticky top-0 z-20 flex justify-between items-center"
         style="border-bottom:2px solid #eef2f7;box-shadow:0 2px 8px rgba(12,35,64,.06)">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
             style="background:#0c2340">${icon}</div>
        <div>
          <h1 class="text-base font-bold" style="color:#0c2340">${title}</h1>
          <p class="text-xs text-gray-400">${subtitle}</p>
        </div>
      </div>
      ${extra}
    </div>`;
}

function head(title, extraScripts='') {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
${FONT_LINK}
  <script src="https://cdn.tailwindcss.com"><\/script>${extraScripts}
  <style>${UNIV_CSS}  </style>
</head>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// chef/affectation.html
// ══════════════════════════════════════════════════════════════════════════════
const chefAffectation = `${head('Affectation — Chef de Département')}
<body>
<div class="flex h-screen">
${chefSidebar('affectation.html')}
  <main class="ml-64 flex-1 overflow-y-auto">
${topbar('🔗','Affectation des Encadrants','Affectez un encadrant à chaque étudiant en attente')}
    <div class="p-6 fade-in">
      <div id="msgSucces" class="hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl text-white" style="background:#059669">
        <span class="text-2xl">✅</span><p id="texteSucces" class="font-medium text-lg"></p>
      </div>

      <!-- Compteur -->
      <div class="bg-white rounded-2xl p-5 mb-6 flex items-center gap-4" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style="background:#fef3c7">⏳</div>
        <div>
          <p class="text-gray-500 text-sm">Étudiants en attente d'affectation</p>
          <p id="compteurAttente" class="text-3xl font-bold" style="color:#0c2340">--</p>
        </div>
      </div>

      <!-- Encadrants disponibles -->
      <div class="bg-white rounded-2xl p-6 mb-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <h3 class="font-bold mb-4" style="color:#0c2340">👨‍🏫 Encadrants disponibles dans votre département</h3>
        <div id="listeEncadrants" class="grid grid-cols-2 gap-3"></div>
      </div>

      <!-- Étudiants en attente -->
      <h3 class="font-bold mb-4 text-lg" style="color:#0c2340">🎓 Étudiants en attente</h3>
      <div id="listeEtudiants" class="space-y-4">
        <p class="text-center text-gray-400 py-8">⏳ Chargement...</p>
      </div>
    </div>
  </main>
</div>
<script>
  const API     = 'http://localhost:3000';
  const DEPT_ID = 1;
  let encadrantsDisponibles = [];

  async function chargerPage() {
    const r0   = await fetch(\`\${API}/api/admin/departements/\${DEPT_ID}\`);
    const dept = await r0.json();
    document.getElementById('nomDept').textContent = dept.dept.nom;

    const r1 = await fetch(\`\${API}/api/chef/encadrants-disponibles/\${DEPT_ID}\`);
    encadrantsDisponibles = await r1.json();

    const contEnc = document.getElementById('listeEncadrants');
    contEnc.innerHTML = '';
    if (encadrantsDisponibles.length === 0) {
      contEnc.innerHTML = \`<p class="text-gray-400 text-sm col-span-2">Aucun encadrant disponible</p>\`;
    } else {
      encadrantsDisponibles.forEach(e => {
        const pct    = e.nb_etudiants_max > 0 ? Math.min(Math.round((e.nb_etudiants_actuel / e.nb_etudiants_max) * 100), 100) : 0;
        const charge = e.nb_etudiants_actuel >= e.nb_etudiants_max ? 'Surchargé' : 'Disponible';
        const couleur = e.nb_etudiants_actuel >= e.nb_etudiants_max ? '#c9930a' : '#059669';
        contEnc.innerHTML += \`<div class="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style="background:#0c2340">\${e.nom.split(' ').map(n=>n[0]).join('')}</div>
            <div class="flex-1">
              <p class="font-medium text-gray-800 text-sm">\${e.nom}</p>
              <p class="text-xs text-gray-400">\${e.grade || '—'}</p>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background:\${e.nb_etudiants_actuel >= e.nb_etudiants_max ? '#fef3c7' : '#dcfce7'};color:\${couleur}">\${charge}</span>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Charge actuelle</span><span>\${e.nb_etudiants_actuel} / \${e.nb_etudiants_max}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="h-2 rounded-full" style="width:\${pct}%;background:\${couleur}"></div>
          </div>
        </div>\`;
      });
    }

    const r2 = await fetch(\`\${API}/api/chef/etudiants-en-attente/\${DEPT_ID}\`);
    const etudiants = await r2.json();
    document.getElementById('compteurAttente').textContent = etudiants.length;
    const container = document.getElementById('listeEtudiants');
    container.innerHTML = '';

    if (etudiants.length === 0) {
      container.innerHTML = \`<div class="bg-white rounded-2xl p-10 text-center" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <p class="text-5xl mb-4">🎉</p><p class="text-xl font-bold" style="color:#0c2340">Tous les étudiants ont un encadrant !</p>
        <p class="text-gray-400 mt-2">Aucune affectation en attente.</p></div>\`;
      return;
    }

    etudiants.forEach(e => {
      container.innerHTML += \`<div class="bg-white rounded-2xl p-6 carte" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="flex justify-between items-start mb-5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white flex-shrink-0" style="background:#0c2340">
              \${e.etudiant.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <p class="font-bold text-gray-800 text-lg">\${e.etudiant}</p>
              <p class="text-gray-400 text-sm">\${e.email}</p>
            </div>
          </div>
          \${badgeType(e.type_stage)}
        </div>
        <div class="rounded-xl p-4 mb-5" style="background:#f0f4fa">
          <p class="text-xs text-gray-400 mb-1">Sujet de stage</p>
          <p class="font-medium text-gray-800">📌 \${e.titre}</p>
          \${e.entreprise ? \`<p class="text-sm text-gray-500 mt-1">🏢 \${e.entreprise}</p>\` : ''}
        </div>
        <div class="flex items-end gap-3">
          <div class="flex-1">
            <p class="text-xs text-gray-400 mb-2">Choisir un encadrant disponible</p>
            <select id="select_\${e.stage_id}" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none bg-white">
              <option value="">-- Sélectionner un encadrant --</option>
              \${encadrantsDisponibles.map(enc => \`<option value="\${enc.id}">\${enc.nom} (\${enc.nb_etudiants_actuel}/\${enc.nb_etudiants_max})\${enc.grade ? ' — ' + enc.grade : ''}</option>\`).join('')}
            </select>
          </div>
          <button onclick="affecter(\${e.stage_id}, \${e.etudiant_id})" class="text-white px-6 py-3 rounded-xl font-medium text-sm transition" style="background:#0c2340">🔗 Affecter</button>
        </div>
      </div>\`;
    });
  }

  async function affecter(stage_id, etudiant_id) {
    const select = document.getElementById(\`select_\${stage_id}\`);
    const encadrant_id = select.value;
    if (!encadrant_id) { alert('⚠️ Veuillez choisir un encadrant !'); return; }
    const reponse = await fetch(\`\${API}/api/chef/affecter\`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage_id, encadrant_id, etudiant_id })
    });
    const data = await reponse.json();
    afficherSucces(data.message);
    chargerPage();
  }

  function afficherSucces(msg) {
    document.getElementById('texteSucces').textContent = msg;
    document.getElementById('msgSucces').classList.remove('hidden');
    setTimeout(() => document.getElementById('msgSucces').classList.add('hidden'), 3000);
  }

  function badgeType(type) {
    const s = { initiation:'bg-green-100 text-green-600', perfectionnement:'bg-amber-100 text-amber-600', fin_etude:'bg-red-100 text-red-600' };
    const l = { initiation:'🟢 Initiation', perfectionnement:'🟡 Perfectionnement', fin_etude:'🔴 PFE' };
    return \`<span class="\${s[type]||'bg-gray-100 text-gray-600'} px-3 py-1 rounded-full text-sm font-medium">\${l[type]||type}</span>\`;
  }
  chargerPage();
<\/script>
</body>
</html>`;

// ══════════════════════════════════════════════════════════════════════════════
// chef/deadlines.html
// ══════════════════════════════════════════════════════════════════════════════
const chefDeadlines = `${head('Deadlines — Chef de Département')}
<body>
<div class="flex h-screen">
${chefSidebar('deadlines.html')}
  <main class="ml-64 flex-1 overflow-y-auto">
${topbar('⏰','Gestion des Deadlines','Gérez les échéances pour votre département')}
    <div class="p-6 fade-in">
      <!-- Bannière info -->
      <div class="rounded-2xl p-6 mb-6 text-white relative overflow-hidden" style="background:linear-gradient(135deg,#0c2340,#1e4d7b)">
        <div class="absolute right-6 top-2 text-8xl opacity-10 select-none">⏰</div>
        <h2 class="text-2xl font-bold mb-2">Aucune deadline configurée</h2>
        <p style="color:rgba(255,255,255,.7)">Cette fonctionnalité sera disponible dans une prochaine version.</p>
      </div>
      <div class="bg-white rounded-2xl p-10 text-center" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <p class="text-6xl mb-4">🚧</p>
        <p class="text-xl font-bold mb-2" style="color:#0c2340">Fonctionnalité en cours de développement</p>
        <p class="text-gray-400">Les deadlines et échéances de votre département seront affichées ici.</p>
      </div>
    </div>
  </main>
</div>
<script>
  const API = 'http://localhost:3000';
  const DEPT_ID = 1;
  async function init() {
    const r = await fetch(\`\${API}/api/admin/departements/\${DEPT_ID}\`);
    const d = await r.json();
    document.getElementById('nomDept').textContent = d.dept.nom;
  }
  init();
<\/script>
</body>
</html>`;

// ══════════════════════════════════════════════════════════════════════════════
// chef/suggestions.html
// ══════════════════════════════════════════════════════════════════════════════
const chefSuggestions = `${head('Suggestions — Chef de Département')}
<body>
<div class="flex h-screen">
${chefSidebar('suggestions.html')}
  <main class="ml-64 flex-1 overflow-y-auto">
${topbar('💡','Suggestions de stages','Publiez des sujets et gérez les propositions des encadrants',
  `<button onclick="ouvrirModal()" class="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-xl transition" style="background:#0c2340">➕ Nouvelle suggestion</button>`)}

    <div class="p-6 fade-in">
      <div id="msgSucces" class="hidden mb-4 rounded-xl p-4 flex items-center gap-3" style="background:#f0fdf4;border:1.5px solid #86efac;color:#166534">
        <span class="text-2xl">✅</span><p id="texteSucces" class="font-medium"></p>
      </div>

      <!-- Suggestions encadrants en attente -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <h2 class="text-base font-bold" style="color:#0c2340">📨 Suggestions des encadrants</h2>
          <span id="badgeAttente" class="hidden text-xs font-bold px-2 py-0.5 rounded-full text-white" style="background:#dc2626"></span>
        </div>
        <div id="listeEncadrants" class="grid grid-cols-2 gap-4">
          <p class="text-sm text-gray-400 col-span-2">⏳ Chargement...</p>
        </div>
      </div>

      <hr class="border-gray-200 mb-6"/>

      <h2 class="text-base font-bold mb-4" style="color:#0c2340">📢 Mes suggestions publiées</h2>
      <div class="bg-white rounded-2xl p-4 mb-6 flex gap-4 items-center" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <select id="filtreType" onchange="filtrer()" class="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none bg-white">
          <option value="">Tous les types</option>
          <option value="initiation">Initiation</option>
          <option value="perfectionnement">Perfectionnement</option>
          <option value="fin_etude">PFE</option>
        </select>
        <select id="filtreDisponible" onchange="filtrer()" class="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none bg-white">
          <option value="">Tous les statuts</option>
          <option value="1">Disponibles</option>
          <option value="0">Désactivées</option>
        </select>
        <span id="compteur" class="ml-auto text-sm text-gray-400"></span>
      </div>
      <div id="listeSuggestions" class="grid grid-cols-2 gap-4">
        <p class="text-center text-gray-400 py-8 col-span-2">⏳ Chargement...</p>
      </div>
    </div>

    <!-- MODAL REJET -->
    <div id="modalRejet" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold mb-4" style="color:#0c2340">❌ Rejeter la suggestion</h3>
        <p class="text-sm text-gray-500 mb-3">Motif du rejet (optionnel) :</p>
        <textarea id="inputMotif" rows="3" placeholder="Expliquez pourquoi..."
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none mb-4"></textarea>
        <div class="flex gap-3">
          <button onclick="fermerModalRejet()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium transition">Annuler</button>
          <button onclick="confirmerRejet()" class="flex-1 text-white py-2 rounded-xl text-sm font-medium transition" style="background:#dc2626">❌ Rejeter</button>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- MODAL NOUVELLE SUGGESTION -->
<div id="modal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold" style="color:#0c2340">➕ Nouvelle suggestion</h3>
      <button onclick="fermerModal()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
    </div>
    <div class="space-y-4">
      <div><label class="text-sm font-medium text-gray-600 mb-1 block">Titre du sujet</label>
        <input id="inputTitre" type="text" placeholder="Ex: Application de gestion..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/></div>
      <div><label class="text-sm font-medium text-gray-600 mb-1 block">Description</label>
        <textarea id="inputDesc" rows="3" placeholder="Décrivez le sujet..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"></textarea></div>
      <div><label class="text-sm font-medium text-gray-600 mb-1 block">Technologies</label>
        <input id="inputTech" type="text" placeholder="Ex: Node.js, React, MySQL" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/></div>
      <div><label class="text-sm font-medium text-gray-600 mb-1 block">Type de stage</label>
        <select id="inputType" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none">
          <option value="initiation">Initiation (1ère année)</option>
          <option value="perfectionnement">Perfectionnement (2ème année)</option>
          <option value="fin_etude">PFE (3ème année)</option>
        </select></div>
    </div>
    <div class="flex gap-3 mt-6">
      <button onclick="fermerModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm transition">Annuler</button>
      <button onclick="publierSuggestion()" class="flex-1 text-white py-3 rounded-xl font-medium text-sm transition" style="background:#0c2340">📢 Publier</button>
    </div>
  </div>
</div>

<script>
  const API     = 'http://localhost:3000';
  const CHEF_ID = 10;
  const DEPT_ID = 1;
  let toutesLesSuggestions = [];
  let suggestionARejeter = null;

  async function chargerSuggestions() {
    const r1   = await fetch(\`\${API}/api/admin/departements/\${DEPT_ID}\`);
    const data = await r1.json();
    document.getElementById('nomDept').textContent = data.dept.nom;

    const r2 = await fetch(\`\${API}/api/chef/suggestions/\${DEPT_ID}\`);
    toutesLesSuggestions = await r2.json();
    const messuggestions = toutesLesSuggestions.filter(s => s.statut === 'approuvee' || s.statut == null || s.statut === undefined);
    document.getElementById('compteur').textContent = \`\${messuggestions.length} suggestion(s)\`;
    afficherSuggestions(messuggestions);
    await chargerSuggestionsEncadrants();
  }

  async function chargerSuggestionsEncadrants() {
    const r = await fetch(\`\${API}/api/chef/suggestions-encadrants/\${DEPT_ID}\`);
    const suggestions = await r.json();
    const badge = document.getElementById('badgeAttente');
    if (suggestions.length > 0) { badge.textContent = suggestions.length; badge.classList.remove('hidden'); }
    else badge.classList.add('hidden');

    const container = document.getElementById('listeEncadrants');
    if (suggestions.length === 0) {
      container.innerHTML = \`<div class="bg-white rounded-2xl p-6 text-center col-span-2" style="box-shadow:0 2px 12px rgba(12,35,64,.07)"><p class="text-gray-400 text-sm">✅ Aucune suggestion en attente d'approbation.</p></div>\`;
      return;
    }
    container.innerHTML = suggestions.map(s => {
      const techHtml = s.technologies ? s.technologies.split(',').map(t => \`<span class="px-2 py-1 rounded-lg text-xs" style="background:#eef2f7;color:#0c2340">\${t.trim()}</span>\`).join('') : '';
      return \`<div class="bg-white rounded-2xl p-5" style="border-left:4px solid #c9930a;box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <h3 class="font-bold text-gray-800">\${s.titre}</h3>
            <p class="text-xs text-gray-400 mt-0.5">Par \${s.auteur} · \${badgeType(s.type_stage)}</p>
          </div>
          <span class="text-xs font-semibold px-2 py-1 rounded-full ml-2" style="background:#fef3c7;color:#c9930a">⏳ En attente</span>
        </div>
        <p class="text-gray-500 text-sm mb-3">\${s.description || '—'}</p>
        \${techHtml ? \`<div class="flex flex-wrap gap-2 mb-3">\${techHtml}</div>\` : ''}
        <div class="flex gap-2 mt-2">
          <button onclick="approuver(\${s.id})" class="flex-1 text-white text-sm py-2 rounded-xl font-medium transition" style="background:#059669">✅ Approuver</button>
          <button onclick="ouvrirModalRejet(\${s.id})" class="flex-1 text-sm py-2 rounded-xl font-medium transition" style="background:#fff1f2;color:#dc2626;border:1px solid #fca5a5">❌ Rejeter</button>
        </div>
      </div>\`;
    }).join('');
  }

  async function approuver(id) {
    const r = await fetch(\`\${API}/api/chef/suggestions/\${id}/approuver\`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chef_id: CHEF_ID })
    });
    const data = await r.json();
    afficherSucces(data.message);
    chargerSuggestions();
  }

  function ouvrirModalRejet(id) {
    suggestionARejeter = id;
    document.getElementById('inputMotif').value = '';
    document.getElementById('modalRejet').classList.remove('hidden');
  }
  function fermerModalRejet() { document.getElementById('modalRejet').classList.add('hidden'); suggestionARejeter = null; }

  async function confirmerRejet() {
    const motif = document.getElementById('inputMotif').value.trim();
    const r = await fetch(\`\${API}/api/chef/suggestions/\${suggestionARejeter}/rejeter\`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motif })
    });
    const data = await r.json();
    fermerModalRejet();
    afficherSucces(data.message);
    chargerSuggestions();
  }
  document.getElementById('modalRejet').addEventListener('click', function(e) { if (e.target === this) fermerModalRejet(); });

  function afficherSuggestions(suggestions) {
    const container = document.getElementById('listeSuggestions');
    container.innerHTML = '';
    if (suggestions.length === 0) {
      container.innerHTML = \`<div class="bg-white rounded-2xl p-10 text-center col-span-2" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <p class="text-5xl mb-4">💡</p><p class="text-xl font-bold" style="color:#0c2340">Aucune suggestion</p>
        <p class="text-gray-400 mt-2">Cliquez sur "Nouvelle suggestion" pour commencer</p></div>\`;
      return;
    }
    suggestions.forEach(s => {
      container.innerHTML += \`<div class="bg-white rounded-2xl p-6 carte" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 text-lg">\${s.titre}</h3>
            <p class="text-xs text-gray-400 mt-1">Par \${s.auteur}</p>
          </div>
          <span class="px-2 py-1 rounded-full text-xs font-medium ml-2 \${s.est_disponible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">\${s.est_disponible ? '🟢 Disponible' : '🔴 Désactivée'}</span>
        </div>
        <p class="text-gray-600 text-sm mb-4">\${s.description || '—'}</p>
        \${s.technologies ? \`<div class="flex flex-wrap gap-2 mb-4">\${s.technologies.split(',').map(t => \`<span class="px-2 py-1 rounded-lg text-xs" style="background:#eef2f7;color:#0c2340">\${t.trim()}</span>\`).join('')}</div>\` : ''}
        <div class="flex justify-between items-center">
          \${badgeType(s.type_stage)}
          <div class="flex gap-2">
            <button onclick="toggleDisponible(\${s.id}, \${s.est_disponible})" class="text-xs px-3 py-1 rounded-lg border transition \${s.est_disponible ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}">\${s.est_disponible ? '🔴 Désactiver' : '🟢 Activer'}</button>
            <button onclick="supprimer(\${s.id})" class="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">🗑️</button>
          </div>
        </div>
      </div>\`;
    });
  }

  function filtrer() {
    const type  = document.getElementById('filtreType').value;
    const dispo = document.getElementById('filtreDisponible').value;
    const result = toutesLesSuggestions.filter(s => {
      const okType  = type  === '' || s.type_stage    === type;
      const okDispo = dispo === '' || String(s.est_disponible) === dispo;
      return okType && okDispo;
    });
    afficherSuggestions(result);
  }

  async function publierSuggestion() {
    const body = { titre: document.getElementById('inputTitre').value, description: document.getElementById('inputDesc').value, technologies: document.getElementById('inputTech').value, type_stage: document.getElementById('inputType').value, dept_id: DEPT_ID, chef_id: CHEF_ID };
    if (!body.titre) { alert('⚠️ Le titre est obligatoire !'); return; }
    const reponse = await fetch(\`\${API}/api/chef/suggestions\`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await reponse.json();
    fermerModal();
    afficherSucces(data.message);
    chargerSuggestions();
  }

  async function toggleDisponible(id, estDispo) {
    await fetch(\`\${API}/api/chef/suggestions/\${id}/disponible\`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ est_disponible: estDispo ? 0 : 1 }) });
    chargerSuggestions();
  }

  async function supprimer(id) {
    if (!confirm('Supprimer cette suggestion ?')) return;
    await fetch(\`\${API}/api/chef/suggestions/\${id}\`, { method: 'DELETE' });
    afficherSucces('Suggestion supprimée !');
    chargerSuggestions();
  }

  function ouvrirModal() { document.getElementById('modal').classList.remove('hidden'); document.getElementById('inputTitre').value = ''; document.getElementById('inputDesc').value = ''; document.getElementById('inputTech').value = ''; }
  function fermerModal() { document.getElementById('modal').classList.add('hidden'); }
  document.getElementById('modal').addEventListener('click', function(e) { if (e.target === this) fermerModal(); });

  function afficherSucces(msg) {
    document.getElementById('texteSucces').textContent = msg;
    document.getElementById('msgSucces').classList.remove('hidden');
    setTimeout(() => document.getElementById('msgSucces').classList.add('hidden'), 3000);
  }
  function badgeType(type) {
    const s = { initiation:'bg-green-100 text-green-600', perfectionnement:'bg-amber-100 text-amber-600', fin_etude:'bg-red-100 text-red-600' };
    const l = { initiation:'Initiation', perfectionnement:'Perfectionnement', fin_etude:'PFE' };
    return \`<span class="\${s[type]||'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full text-xs font-medium">\${l[type]||type}</span>\`;
  }
  chargerSuggestions();
<\/script>
</body>
</html>`;

// ══════════════════════════════════════════════════════════════════════════════
// encadrant/dashboard.html
// ══════════════════════════════════════════════════════════════════════════════
const encadrantDashboard = `${head('Dashboard — Encadrant','\n  <script src="https://cdn.jsdelivr.net/npm/chart.js"><\\/script>')}
<body>
<div class="flex h-screen">
${encadrantSidebar('dashboard.html')}
  <main class="ml-64 flex-1 overflow-y-auto">
${topbar('📊','Dashboard Encadrant','<span id="sousTitre">Chargement...</span>',
  `<div class="flex items-center gap-2">
    <div class="relative">
      <button onclick="toggleDropdown('messagesDropdown')" class="relative p-2 rounded-full hover:bg-gray-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        <span id="badgeMessages" class="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full items-center justify-center font-bold hidden" style="background:#c9930a">0</span>
      </button>
      <div id="messagesDropdown" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-gray-800">Messages</h3>
        </div>
        <div id="listeMessages" class="divide-y divide-gray-50 max-h-72 overflow-y-auto"></div>
        <div class="p-3 border-t border-gray-100 text-center"><a href="messagerie.html" class="text-sm font-medium hover:underline" style="color:#c9930a">Voir tous les messages →</a></div>
      </div>
    </div>
    <div class="relative">
      <button onclick="toggleDropdown('notifsDropdown')" class="relative p-2 rounded-full hover:bg-gray-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        <span id="badgeNotifs" class="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full items-center justify-center font-bold hidden" style="background:#dc2626">0</span>
      </button>
      <div id="notifsDropdown" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-gray-800">Notifications</h3>
          <span onclick="marquerToutLu()" class="text-xs cursor-pointer hover:underline" style="color:#dc2626">Tout marquer lu</span>
        </div>
        <div id="listeNotifs" class="divide-y divide-gray-50 max-h-72 overflow-y-auto"></div>
      </div>
    </div>
    <a href="profil.html" class="flex items-center gap-2 ml-2 pl-4 border-l border-gray-200 hover:opacity-80 transition">
      <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340" id="avatarTop">EN</div>
      <div class="hidden md:block">
        <p class="text-sm font-semibold text-gray-800" id="nomTop">--</p>
        <p class="text-xs font-medium" style="color:#c9930a">Encadrant</p>
      </div>
    </a>
  </div>`
)}
    <div class="p-6 fade-in">
      <!-- Bannière -->
      <div class="rounded-2xl p-6 mb-6 text-white relative overflow-hidden" style="background:linear-gradient(135deg,#0c2340,#1e4d7b)">
        <div class="absolute right-10 bottom-0 text-7xl opacity-20 select-none">👨‍🏫</div>
        <p class="text-sm mb-1" style="color:rgba(201,147,10,.9)">Bienvenue</p>
        <h2 id="nomBanniere" class="text-3xl font-bold">--</h2>
        <p id="infoBanniere" class="text-sm mt-2" style="color:rgba(255,255,255,.7)">--</p>
      </div>

      <!-- 4 cartes -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #c9930a;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">Étudiants encadrés</p>
          <p id="nbEtudiants" class="text-3xl font-bold mt-1" style="color:#c9930a">--</p>
          <div class="mt-3"><div class="w-full bg-gray-200 rounded-full h-1.5"><div id="barreCharge" class="h-1.5 rounded-full" style="width:0%;background:#c9930a"></div></div>
          <p id="texteCharge" class="text-xs mt-1" style="color:#c9930a">-- / -- max</p></div>
        </div>
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #0891b2;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">Rapports à valider</p>
          <p id="nbRapports" class="text-3xl font-bold mt-1" style="color:#0891b2">--</p>
          <p class="text-xs mt-3" style="color:#0891b2">📄 Feedback requis</p>
        </div>
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #0c2340;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">Messages non lus</p>
          <p id="nbMessages" class="text-3xl font-bold mt-1" style="color:#0c2340">--</p>
          <p class="text-xs mt-3" style="color:#0c2340">💬 Messagerie</p>
        </div>
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #059669;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">Suggestions publiées</p>
          <p id="nbSuggestions" class="text-3xl font-bold mt-1" style="color:#059669">--</p>
          <p class="text-xs mt-3" style="color:#059669">💡 Sujets disponibles</p>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl p-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <h3 class="font-bold mb-4" style="color:#0c2340">📊 Mes stages par statut</h3>
          <canvas id="graphStatut" height="220"></canvas>
        </div>
        <div class="bg-white rounded-2xl p-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <h3 class="font-bold mb-4" style="color:#0c2340">📋 Mes stages par type</h3>
          <canvas id="graphType" height="220"></canvas>
        </div>
      </div>

      <!-- Tableau étudiants -->
      <div class="bg-white rounded-2xl p-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="flex justify-between items-center mb-5">
          <h3 class="font-bold" style="color:#0c2340">👥 Mes étudiants encadrés</h3>
          <a href="etudiants.html" class="text-xs font-semibold px-3 py-1.5 rounded-lg transition" style="background:#eef2f7;color:#0c2340">Voir tous →</a>
        </div>
        <table class="w-full text-sm">
          <thead><tr style="background:#f0f4fa">
            <th class="px-4 py-3 text-left rounded-l-xl text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Étudiant</th>
            <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Type</th>
            <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Sujet</th>
            <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Progression</th>
            <th class="px-4 py-3 text-left rounded-r-xl text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Statut</th>
          </tr></thead>
          <tbody id="tableauEtudiants" class="divide-y divide-gray-100">
            <tr><td colspan="5" class="text-center py-8 text-gray-400">⏳ Chargement...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
<script>
  const API    = 'http://localhost:3000';
  const ENC_ID = 5;

  function toggleDropdown(id) {
    document.querySelectorAll('[id$="Dropdown"]').forEach(el => { if (el.id !== id) el.classList.add('hidden'); });
    document.getElementById(id).classList.toggle('hidden');
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('.relative')) document.querySelectorAll('[id$="Dropdown"]').forEach(el => el.classList.add('hidden'));
  });

  async function chargerMessages() {
    const reponse = await fetch(\`\${API}/api/encadrant/derniers-messages/\${ENC_ID}\`);
    const data    = await reponse.json();
    const badge = document.getElementById('badgeMessages');
    if (data.nb_total > 0) { badge.textContent = data.nb_total; badge.classList.remove('hidden'); badge.classList.add('flex'); }
    else badge.classList.add('hidden');
    const liste = document.getElementById('listeMessages');
    if (data.messages.length === 0) { liste.innerHTML = \`<div class="p-6 text-center"><p class="text-3xl mb-2">📭</p><p class="text-sm text-gray-400">Aucun message non lu</p></div>\`; return; }
    liste.innerHTML = '';
    data.messages.forEach(m => {
      const initiales = \`\${m.prenom[0]}\${m.nom[0]}\`;
      const temps = new Date(m.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      liste.innerHTML += \`<div onclick="window.location.href='messagerie.html'" class="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer" style="background:#fef3c7">
        <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white" style="background:#0c2340">\${initiales}</div>
        <div class="flex-1 min-w-0"><p class="font-medium text-gray-800 text-sm">\${m.prenom} \${m.nom}</p><p class="text-gray-500 text-xs truncate">\${m.contenu}</p><p class="text-gray-400 text-xs mt-1">\${temps}</p></div>
        <span class="w-2 h-2 rounded-full mt-1 shrink-0" style="background:#c9930a"></span>
      </div>\`;
    });
  }

  async function chargerNotifications() {
    const reponse = await fetch(\`\${API}/api/encadrant/notifications/\${ENC_ID}\`);
    const data    = await reponse.json();
    const badge = document.getElementById('badgeNotifs');
    if (data.nb_non_lues > 0) { badge.textContent = data.nb_non_lues; badge.classList.remove('hidden'); badge.classList.add('flex'); }
    else badge.classList.add('hidden');
    const liste = document.getElementById('listeNotifs');
    if (data.notifications.length === 0) { liste.innerHTML = \`<div class="p-6 text-center"><p class="text-3xl mb-2">🔔</p><p class="text-sm text-gray-400">Aucune notification</p></div>\`; return; }
    liste.innerHTML = '';
    data.notifications.forEach(n => {
      const icones = { affectation:'👤', rapport:'📄', message:'💬', statut:'📋', deadline:'⏰', compte:'✅' };
      const bg = n.est_lue ? '' : 'background:#fef3c7';
      const date = new Date(n.date_creation).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
      liste.innerHTML += \`<div class="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition" style="\${bg}">
        <div class="text-2xl shrink-0">\${icones[n.type]||'🔔'}</div>
        <div class="flex-1"><p class="text-sm text-gray-800">\${n.message}</p>\${n.stage_titre ? \`<p class="text-xs mt-1" style="color:#c9930a">📋 \${n.stage_titre}</p>\` : ''}<p class="text-xs text-gray-400 mt-1">\${date}</p></div>
        \${!n.est_lue ? \`<span class="w-2 h-2 bg-red-500 rounded-full mt-1 shrink-0"></span>\` : ''}
      </div>\`;
    });
  }

  async function marquerToutLu() {
    await fetch(\`\${API}/api/encadrant/notifications/\${ENC_ID}/lire\`, { method: 'PUT' });
    chargerNotifications();
  }

  async function chargerDashboard() {
    try {
      const r1   = await fetch(\`\${API}/api/encadrant/profil/\${ENC_ID}\`);
      const user = await r1.json();
      const nomComplet = \`\${user.prenom} \${user.nom}\`;
      document.getElementById('nomMenu').textContent     = nomComplet;
      document.getElementById('nomTop').textContent      = nomComplet;
      document.getElementById('nomBanniere').textContent = \`👋 Bonjour \${user.prenom} !\`;
      document.getElementById('infoBanniere').textContent = \`\${user.grade || 'Encadrant'} — \${user.departement || ''}\`;
      document.getElementById('sousTitre').textContent   = \`Département \${user.departement || ''}\`;
      document.getElementById('deptMenu').textContent    = user.departement || '';
      const initiales = \`\${user.prenom[0]}\${user.nom[0]}\`;
      document.getElementById('avatarMenu').textContent = initiales;
      document.getElementById('avatarTop').textContent  = initiales;
      const pct = Math.round((user.nb_etudiants_actuel / user.nb_etudiants_max) * 100);
      document.getElementById('barreCharge').style.width = \`\${pct}%\`;
      document.getElementById('texteCharge').textContent = \`\${user.nb_etudiants_actuel} / \${user.nb_etudiants_max} max\`;
      document.getElementById('nbEtudiants').textContent = user.nb_etudiants_actuel;

      const r2     = await fetch(\`\${API}/api/encadrant/stages/\${ENC_ID}\`);
      const stages = await r2.json();
      const rapports = stages.filter(s => s.statut === 'rapport_depose').length;
      document.getElementById('nbRapports').textContent = rapports;

      const r3 = await fetch(\`\${API}/api/encadrant/messages-non-lus/\${ENC_ID}\`);
      const msgData = await r3.json();
      document.getElementById('nbMessages').textContent = msgData.nb_non_lus;
      document.getElementById('nbSuggestions').textContent = 3;

      const statuts = { en_attente:0, en_cours:0, rapport_depose:0, valide:0 };
      stages.forEach(s => { if(statuts[s.statut]!==undefined) statuts[s.statut]++; });
      new Chart(document.getElementById('graphStatut'), {
        type: 'doughnut',
        data: { labels:['En attente','En cours','Rapport déposé','Validé'], datasets:[{ data:Object.values(statuts), backgroundColor:['#c9930a','#059669','#0c2340','#0891b2'], borderWidth:3, borderColor:'#fff' }] },
        options: { plugins: { legend: { position:'bottom' } } }
      });

      const types = { initiation:0, perfectionnement:0, fin_etude:0 };
      stages.forEach(s => { if(types[s.type_stage]!==undefined) types[s.type_stage]++; });
      new Chart(document.getElementById('graphType'), {
        type: 'bar',
        data: { labels:['Initiation','Perfectionnement','PFE'], datasets:[{ data:Object.values(types), backgroundColor:['#059669','#c9930a','#0c2340'], borderRadius:10 }] },
        options: { plugins:{ legend:{display:false} }, scales:{ y:{beginAtZero:true,ticks:{stepSize:1}} } }
      });

      const tbody = document.getElementById('tableauEtudiants');
      tbody.innerHTML = '';
      if (stages.length === 0) { tbody.innerHTML = \`<tr><td colspan="5" class="text-center py-6 text-gray-400">Aucun étudiant encadré</td></tr>\`; return; }
      stages.forEach(s => {
        tbody.innerHTML += \`<tr class="hover:bg-gray-50 transition">
          <td class="px-4 py-3.5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 text-white" style="background:#0c2340">\${s.etudiant.split(' ').map(n=>n[0]).join('')}</div>
              <span class="font-semibold text-gray-800 text-sm">\${s.etudiant}</span>
            </div>
          </td>
          <td class="px-4 py-3.5">\${badgeType(s.type_stage)}</td>
          <td class="px-4 py-3.5 text-gray-500 text-sm max-w-xs truncate">\${s.titre}</td>
          <td class="px-4 py-3.5"><div class="flex items-center gap-2"><div class="w-20 bg-gray-100 rounded-full h-1.5"><div class="h-1.5 rounded-full" style="width:\${s.progression}%;background:#0c2340"></div></div><span class="text-xs font-semibold text-gray-600">\${s.progression}%</span></div></td>
          <td class="px-4 py-3.5">\${badgeStatut(s.statut)}</td>
        </tr>\`;
      });
    } catch(err) { console.error('Erreur:', err); }
  }

  function badgeType(type) {
    const s = { initiation:'bg-green-100 text-green-600', perfectionnement:'bg-amber-100 text-amber-600', fin_etude:'bg-red-100 text-red-600' };
    const l = { initiation:'Initiation', perfectionnement:'Perfectionnement', fin_etude:'PFE' };
    return \`<span class="\${s[type]||'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full text-xs font-medium">\${l[type]||type}</span>\`;
  }
  function badgeStatut(statut) {
    const s = { en_attente:'bg-amber-100 text-amber-600', affecte:'bg-blue-100 text-blue-600', en_cours:'bg-green-100 text-green-600', rapport_depose:'bg-purple-100 text-purple-600', valide:'bg-cyan-100 text-cyan-600' };
    const l = { en_attente:'En attente', affecte:'Affecté', en_cours:'En cours', rapport_depose:'Rapport déposé', valide:'Validé' };
    return \`<span class="\${s[statut]||'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full text-xs font-medium">\${l[statut]||statut}</span>\`;
  }
  chargerDashboard();
  chargerMessages();
  chargerNotifications();
<\/script>
</body>
</html>`;

// Write batch 2
const files = [
  [path.join(BASE, 'chef', 'affectation.html'), chefAffectation],
  [path.join(BASE, 'chef', 'deadlines.html'), chefDeadlines],
  [path.join(BASE, 'chef', 'suggestions.html'), chefSuggestions],
  [path.join(BASE, 'encadrant', 'dashboard.html'), encadrantDashboard],
];

for (const [filepath, content] of files) {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Written: ${path.relative(BASE, filepath)} (${content.length} chars)`);
}
console.log('Batch 2 done!');
