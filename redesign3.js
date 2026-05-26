const fs   = require('fs');
const path = require('path');
const BASE = path.join(__dirname, 'frontend');

function write(rel, content) {
  fs.writeFileSync(path.join(BASE, rel), content, 'utf8');
  console.log(`Written: ${rel} (${content.length} chars)`);
}

const SIDEBAR_ENC = (active) => `
  <aside class="w-64 flex flex-col fixed h-full z-30" style="background:linear-gradient(180deg,#0c2340 0%,#163a5f 100%)">
    <div class="px-6 py-5 flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm"
           style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">🎓</div>
      <span class="font-bold text-white text-base tracking-wide">Gestion Stages</span>
    </div>
    <div class="mx-4 mb-4 p-3 rounded-2xl flex items-center gap-3" style="background:rgba(255,255,255,.08)">
      <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
           style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340" id="avatarMenu">EN</div>
      <div class="overflow-hidden">
        <p class="text-white text-sm font-semibold truncate" id="nomMenu">--</p>
        <p class="text-xs truncate" style="color:#f5d87e" id="deptMenu">--</p>
      </div>
    </div>
    <nav class="flex-1 px-3 overflow-y-auto space-y-1">
      <a href="dashboard.html" class="nav-link${active==='dashboard'?' active':''}"><span class="nav-icon">📊</span> Dashboard</a>
      <a href="etudiants.html" class="nav-link${active==='etudiants'?' active':''}"><span class="nav-icon">👥</span> Mes Étudiants</a>
      <a href="messagerie.html" class="nav-link${active==='messagerie'?' active':''}"><span class="nav-icon">💬</span> Messagerie</a>
      <a href="rapports.html" class="nav-link${active==='rapports'?' active':''}"><span class="nav-icon">📄</span> Rapports</a>
      <a href="suggestions.html" class="nav-link${active==='suggestions'?' active':''}"><span class="nav-icon">💡</span> Suggestions</a>
      <a href="profil.html" class="nav-link${active==='profil'?' active':''}"><span class="nav-icon">👤</span> Mon Profil</a>
    </nav>
    <div class="px-3 py-4">
      <button class="nav-link w-full" style="color:#fca5a5"
              onmouseover="this.style.background='rgba(239,68,68,.15)'" onmouseout="this.style.background='transparent'">
        <span class="nav-icon">🚪</span> Déconnexion
      </button>
    </div>
  </aside>`;

const NAV_STYLE = `
    <style>
      * { box-sizing:border-box; }
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      body { font-family:'Inter',sans-serif; background:#f0f4fa; }
      .nav-link { display:flex; align-items:center; gap:12px; padding:10px 16px; border-radius:12px;
        color:rgba(255,255,255,.7); font-size:.875rem; font-weight:500;
        transition:background .2s,color .2s; text-decoration:none; }
      .nav-link:hover { background:rgba(255,255,255,.1); color:#fff; }
      .nav-link.active { background:rgba(201,147,10,.2); color:#f5d87e; border-left:3px solid #c9930a; }
      .nav-icon { font-size:1.1rem; width:28px; text-align:center; }
      .fade-in { animation:fadeIn .4s ease; }
      @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    </style>`;

/* ── 1. encadrant/etudiants.html ─────────────────────────────────────── */
write('encadrant/etudiants.html', `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mes Étudiants – Encadrant</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  ${NAV_STYLE}
  <style>
    #toast-msg { position:fixed;top:1.5rem;right:1.5rem;z-index:9999;min-width:300px;max-width:420px;
      display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem;border-radius:14px;
      box-shadow:0 8px 30px rgba(0,0,0,.12);font-size:.875rem;
      transition:opacity .35s,transform .35s;opacity:0;transform:translateY(-12px);pointer-events:none; }
    #toast-msg.show { opacity:1;transform:translateY(0);pointer-events:auto; }
    #toast-msg.succes { background:#f0fdf4;border:1.5px solid #86efac;color:#166534; }
    #toast-msg.erreur { background:#fef2f2;border:1.5px solid #fca5a5;color:#991b1b; }
  </style>
</head>
<body>
<div class="flex h-screen overflow-hidden">
  ${SIDEBAR_ENC('etudiants')}
  <main class="ml-64 flex-1 overflow-y-auto">
    <div class="bg-white px-6 py-4 sticky top-0 z-20 flex justify-between items-center"
         style="border-bottom:2px solid #eef2f7;box-shadow:0 1px 4px rgba(0,0,0,.05)">
      <div>
        <h1 class="text-lg font-bold" style="color:#0c2340">👥 Mes Étudiants</h1>
        <p class="text-xs text-gray-400 mt-0.5">Suivez la progression de vos étudiants encadrés</p>
      </div>
    </div>

    <div id="toast-msg">
      <span id="toast-icon" class="text-xl"></span>
      <p id="toast-text" class="text-sm font-medium"></p>
    </div>

    <div class="p-6 fade-in">
      <div id="listeEtudiants" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <p class="text-gray-400 col-span-3 text-center py-8">⏳ Chargement...</p>
      </div>
    </div>
  </main>
</div>

<!-- Modal Progression -->
<div id="modalProgression" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-bold" style="color:#0c2340">📈 Mettre à jour la progression</h3>
      <button onclick="fermerModalProgression()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
    </div>
    <p class="text-sm text-gray-500 mb-4" id="nomEtudiantProg"></p>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-medium text-gray-600 mb-1 block">Progression (%)</label>
        <input id="inputProgression" type="number" min="0" max="100" placeholder="0-100"
               class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
               style="focus:border-color:#c9930a"/>
      </div>
      <div>
        <label class="text-sm font-medium text-gray-600 mb-1 block">Commentaire</label>
        <textarea id="inputCommentaire" rows="3" placeholder="Observations..."
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition"></textarea>
      </div>
    </div>
    <div class="flex gap-3 mt-6">
      <button onclick="fermerModalProgression()"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm transition">
        Annuler
      </button>
      <button onclick="sauvegarderProgression()"
              class="flex-1 text-white py-3 rounded-xl font-medium text-sm transition"
              style="background:linear-gradient(135deg,#0c2340,#163a5f)">
        💾 Sauvegarder
      </button>
    </div>
  </div>
</div>

<!-- Modal Feedback -->
<div id="modalFeedback" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-bold" style="color:#0c2340">💬 Envoyer un feedback</h3>
      <button onclick="fermerModalFeedback()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
    </div>
    <p class="text-sm text-gray-500 mb-4" id="nomEtudiantFeed"></p>
    <div>
      <label class="text-sm font-medium text-gray-600 mb-1 block">Commentaire *</label>
      <textarea id="inputFeedback" rows="4" placeholder="Votre feedback..."
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition"></textarea>
    </div>
    <div class="flex gap-3 mt-6">
      <button onclick="fermerModalFeedback()"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm transition">
        Annuler
      </button>
      <button onclick="envoyerFeedback()"
              class="flex-1 text-white py-3 rounded-xl font-medium text-sm transition"
              style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">
        📨 Envoyer
      </button>
    </div>
  </div>
</div>

<script>
  const API    = 'http://localhost:3000';
  const ENC_ID = 5;
  let stageActif = null;

  async function chargerEtudiants() {
    const r = await fetch(\`\${API}/api/encadrant/\${ENC_ID}/etudiants\`);
    const etudiants = await r.json();
    const container = document.getElementById('listeEtudiants');
    if (!etudiants.length) {
      container.innerHTML = \`<div class="col-span-3 text-center py-16">
        <p class="text-5xl mb-4">👥</p>
        <p class="text-xl font-bold text-gray-700">Aucun étudiant encadré</p>
      </div>\`;
      return;
    }
    container.innerHTML = etudiants.map(e => {
      const pct = e.progression || 0;
      const statusColors = { en_cours:'bg-blue-100 text-blue-700', termine:'bg-green-100 text-green-700', valide:'bg-purple-100 text-purple-700' };
      const statusLabels = { en_cours:'En cours', termine:'Terminé', valide:'Validé' };
      return \`<div class="bg-white rounded-2xl shadow p-5" style="border-top:3px solid #c9930a">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
               style="background:linear-gradient(135deg,#0c2340,#163a5f);color:#f5d87e">
            \${(e.prenom?.[0]||'')+(e.nom?.[0]||'')}
          </div>
          <div>
            <p class="font-bold text-gray-800">\${e.prenom} \${e.nom}</p>
            <span class="text-xs px-2 py-1 rounded-full \${statusColors[e.statut]||'bg-gray-100 text-gray-600'}">\${statusLabels[e.statut]||e.statut}</span>
          </div>
        </div>
        <p class="text-xs text-gray-500 mb-1 font-medium">\${e.titre || 'Stage'}</p>
        <div class="mb-4">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span><span>\${pct}%</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="h-2 rounded-full" style="width:\${pct}%;background:linear-gradient(90deg,#0c2340,#163a5f)"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="ouvrirModalProgression(\${e.stage_id},'\${e.prenom} \${e.nom}',\${pct})"
                  class="flex-1 text-xs py-2 rounded-xl font-medium transition text-white"
                  style="background:#163a5f">📈 Progression</button>
          <button onclick="ouvrirModalFeedback(\${e.stage_id},'\${e.prenom} \${e.nom}')"
                  class="flex-1 text-xs py-2 rounded-xl font-medium transition"
                  style="background:#fef3c7;color:#92400e">💬 Feedback</button>
        </div>
      </div>\`;
    }).join('');
  }

  function ouvrirModalProgression(stageId, nom, progActuel) {
    stageActif = stageId;
    document.getElementById('nomEtudiantProg').textContent = \`Étudiant : \${nom}\`;
    document.getElementById('inputProgression').value = progActuel;
    document.getElementById('inputCommentaire').value = '';
    document.getElementById('modalProgression').classList.remove('hidden');
  }
  function fermerModalProgression() { document.getElementById('modalProgression').classList.add('hidden'); }

  async function sauvegarderProgression() {
    const progression = parseInt(document.getElementById('inputProgression').value);
    const commentaire = document.getElementById('inputCommentaire').value.trim();
    if (isNaN(progression) || progression < 0 || progression > 100) { toast('Progression entre 0 et 100 !', false); return; }
    await fetch(\`\${API}/api/stage/\${stageActif}/progression\`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ progression, commentaire, encadrant_id: ENC_ID })
    });
    fermerModalProgression();
    toast('Progression mise à jour !', true);
    chargerEtudiants();
  }

  function ouvrirModalFeedback(stageId, nom) {
    stageActif = stageId;
    document.getElementById('nomEtudiantFeed').textContent = \`Étudiant : \${nom}\`;
    document.getElementById('inputFeedback').value = '';
    document.getElementById('modalFeedback').classList.remove('hidden');
  }
  function fermerModalFeedback() { document.getElementById('modalFeedback').classList.add('hidden'); }

  async function envoyerFeedback() {
    const commentaire = document.getElementById('inputFeedback').value.trim();
    if (!commentaire) return;
    await fetch(\`\${API}/api/encadrant/feedback\`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ commentaire, stage_id: stageActif, encadrant_id: ENC_ID })
    });
    fermerModalFeedback();
    toast('Feedback envoyé !', true);
  }

  function toast(msg, succes = true) {
    const el = document.getElementById('toast-msg');
    document.getElementById('toast-icon').textContent = succes ? '✅' : '⚠️';
    document.getElementById('toast-text').textContent = msg;
    el.className = succes ? 'show succes' : 'show erreur';
    setTimeout(() => { el.className = succes ? 'succes' : 'erreur'; }, 3000);
  }

  chargerEtudiants();
<\/script>
</body>
</html>`);

/* ── 2. encadrant/messagerie.html ─────────────────────────────────────── */
write('encadrant/messagerie.html', `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Messagerie – Encadrant</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  ${NAV_STYLE}
  <style>
    .conv-item { transition:background .18s; cursor:pointer; }
    .conv-item:hover { background:#f0f4fa; }
    .conv-item.active { background:#fef3c7; border-left:3px solid #c9930a; }
    .conv-item.unread { background:#fffbeb; border-left:3px solid #c9930a; }
    #zoneMessages { scroll-behavior:smooth; background:#f0f4fa; }
    #zoneMessages::-webkit-scrollbar { width:4px; }
    #zoneMessages::-webkit-scrollbar-thumb { background:#c9930a44; border-radius:4px; }
    .bubble-me    { background:linear-gradient(135deg,#0c2340,#163a5f); color:#fff; border-radius:18px 4px 18px 18px; }
    .bubble-other { background:#fff; color:#1e293b; border-radius:4px 18px 18px 18px; box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .msg-input:focus { border-color:#c9930a !important; outline:none; }
    .fade-in { animation:fadeIn .25s ease; }
  </style>
</head>
<body>
<div class="flex h-screen overflow-hidden">
  ${SIDEBAR_ENC('messagerie')}
  <main class="ml-64 flex-1 flex overflow-hidden">
    <!-- Liste conversations -->
    <div class="w-80 bg-white flex flex-col" style="border-right:1px solid #eef2f7">
      <div class="px-5 py-4" style="border-bottom:1px solid #eef2f7">
        <p class="text-xs font-semibold uppercase tracking-widest mb-0.5" style="color:#c9930a">Conversations</p>
        <h2 class="font-bold text-gray-800 text-base">Messagerie</h2>
        <p class="text-xs text-gray-400 mt-0.5">Vos échanges avec les étudiants</p>
      </div>
      <div id="listeConversations" class="flex-1 overflow-y-auto"></div>
    </div>

    <!-- Zone chat -->
    <div class="flex-1 flex flex-col">
      <div id="vueVide" class="flex-1 flex items-center justify-center" style="background:#f0f4fa">
        <div class="text-center">
          <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
               style="background:linear-gradient(135deg,#0c2340,#163a5f)">
            <span class="text-4xl">💬</span>
          </div>
          <p class="text-lg font-bold text-gray-700">Sélectionnez une conversation</p>
          <p class="text-gray-400 text-sm mt-1">Choisissez un étudiant à gauche</p>
        </div>
      </div>
      <div id="vueChat" class="hidden flex-1 flex flex-col">
        <div class="bg-white px-6 py-3 flex items-center gap-4"
             style="border-bottom:1px solid #eef2f7;box-shadow:0 1px 4px rgba(12,35,64,.06)">
          <div id="chatAvatar"
               class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
               style="background:linear-gradient(135deg,#0c2340,#163a5f);color:#f5d87e">--</div>
          <div>
            <p id="chatNom" class="font-bold text-gray-800 text-sm">--</p>
            <p id="chatStage" class="text-xs mt-0.5" style="color:#c9930a">--</p>
          </div>
        </div>
        <div id="zoneMessages" class="flex-1 overflow-y-auto p-6 space-y-3"></div>
        <div class="bg-white px-4 py-3 flex gap-3 items-end" style="border-top:1px solid #eef2f7">
          <textarea id="inputMessage" placeholder="Écrivez votre message..." rows="2"
                    onkeydown="envoyerAvecEntree(event)"
                    class="flex-1 rounded-2xl px-4 py-3 text-sm resize-none msg-input"
                    style="border:1.5px solid #dde3ed;background:#f8fafc"></textarea>
          <button onclick="envoyerMessage()"
                  class="p-3 rounded-2xl flex items-center justify-center transition flex-shrink-0"
                  style="background:linear-gradient(135deg,#0c2340,#163a5f);color:#f5d87e"
                  onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </main>
</div>

<script>
  const API    = 'http://localhost:3000';
  const ENC_ID = 5;
  let convActuelle = null;
  let intervalMsg  = null;

  async function chargerConversations() {
    const r = await fetch(\`\${API}/api/encadrant/\${ENC_ID}/conversations\`);
    const convs = await r.json();
    const c = document.getElementById('listeConversations');
    if (!convs.length) {
      c.innerHTML = '<p class="text-center text-gray-400 text-sm py-8">Aucune conversation</p>';
      return;
    }
    c.innerHTML = convs.map(cv => {
      const init = ((cv.prenom?.[0]||'')+(cv.nom?.[0]||'')).toUpperCase();
      return \`<div class="conv-item px-4 py-3 flex items-center gap-3 \${cv.non_lus>0?'unread':''}"
                   onclick="ouvrirConversation(\${cv.etudiant_id},'\${cv.prenom} \${cv.nom}','\${cv.titre||'Stage'}')">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
             style="background:linear-gradient(135deg,#0c2340,#163a5f);color:#f5d87e">\${init}</div>
        <div class="flex-1 overflow-hidden">
          <p class="font-semibold text-gray-800 text-sm truncate">\${cv.prenom} \${cv.nom}</p>
          <p class="text-xs text-gray-400 truncate">\${cv.dernier_message||'Aucun message'}</p>
        </div>
        \${cv.non_lus>0 ? \`<span class="text-xs font-bold text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0" style="background:#c9930a">\${cv.non_lus}</span>\` : ''}
      </div>\`;
    }).join('');
  }

  async function ouvrirConversation(etudiantId, nom, stage) {
    convActuelle = etudiantId;
    document.getElementById('vueVide').classList.add('hidden');
    document.getElementById('vueChat').classList.remove('hidden');
    const init = nom.split(' ').map(n=>n[0]).join('').toUpperCase();
    document.getElementById('chatAvatar').textContent = init;
    document.getElementById('chatNom').textContent    = nom;
    document.getElementById('chatStage').textContent  = stage;
    document.querySelectorAll('.conv-item').forEach(el => el.classList.remove('active'));
    await chargerMessages();
    clearInterval(intervalMsg);
    intervalMsg = setInterval(chargerMessages, 10000);
  }

  async function chargerMessages() {
    if (!convActuelle) return;
    const r = await fetch(\`\${API}/api/encadrant/\${ENC_ID}/messages/\${convActuelle}\`);
    const msgs = await r.json();
    const zone = document.getElementById('zoneMessages');
    zone.innerHTML = msgs.map(m => {
      const mine = m.expediteur_id === ENC_ID;
      return \`<div class="flex \${mine?'justify-end':'justify-start'} fade-in">
        <div class="\${mine?'bubble-me':'bubble-other'} px-4 py-2 max-w-xs text-sm">
          <p>\${m.contenu}</p>
          <p class="text-xs mt-1 \${mine?'text-blue-200':'text-gray-400'}">\${new Date(m.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</p>
        </div>
      </div>\`;
    }).join('');
    zone.scrollTop = zone.scrollHeight;
  }

  async function envoyerMessage() {
    const txt = document.getElementById('inputMessage').value.trim();
    if (!txt || !convActuelle) return;
    document.getElementById('inputMessage').value = '';
    await fetch(\`\${API}/api/messages\`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ expediteur_id: ENC_ID, destinataire_id: convActuelle, contenu: txt })
    });
    chargerMessages();
  }

  function envoyerAvecEntree(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); envoyerMessage(); }
  }

  chargerConversations();
<\/script>
</body>
</html>`);

/* ── 3. encadrant/rapports.html ─────────────────────────────────────── */
write('encadrant/rapports.html', `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapports – Encadrant</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  ${NAV_STYLE}
</head>
<body>
<div class="flex h-screen overflow-hidden">
  ${SIDEBAR_ENC('rapports')}
  <main class="ml-64 flex-1 overflow-y-auto">
    <div class="bg-white px-6 py-4 sticky top-0 z-20 flex justify-between items-center"
         style="border-bottom:2px solid #eef2f7;box-shadow:0 1px 4px rgba(0,0,0,.05)">
      <div>
        <h1 class="text-lg font-bold" style="color:#0c2340">📄 Rapports de Stage</h1>
        <p class="text-xs text-gray-400 mt-0.5">Consultez et validez les rapports soumis</p>
      </div>
    </div>

    <div id="msgSucces" class="hidden mx-6 mt-4 px-4 py-3 rounded-xl text-sm font-medium"
         style="background:#f0fdf4;border:1.5px solid #86efac;color:#166534">
      ✅ <span id="texteSucces"></span>
    </div>

    <div class="p-6 fade-in">
      <div id="listeRapports" class="space-y-4">
        <p class="text-center text-gray-400 py-8">⏳ Chargement...</p>
      </div>
    </div>
  </main>
</div>

<!-- Modal Feedback -->
<div id="modalFeedback" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-bold" style="color:#0c2340">💬 Envoyer un feedback</h3>
      <button onclick="fermerModal()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
    </div>
    <p class="text-sm font-medium mb-4" style="color:#c9930a" id="nomEtudiantFeed"></p>
    <div>
      <label class="text-sm font-medium text-gray-600 mb-1 block">Commentaire *</label>
      <textarea id="inputFeedback" rows="4" placeholder="Votre retour sur le rapport..."
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition"></textarea>
    </div>
    <div class="flex gap-3 mt-6">
      <button onclick="fermerModal()"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm transition">
        Annuler
      </button>
      <button onclick="envoyerFeedback()"
              class="flex-1 text-white py-3 rounded-xl font-medium text-sm transition"
              style="background:linear-gradient(135deg,#0c2340,#163a5f)">
        📨 Envoyer
      </button>
    </div>
  </div>
</div>

<script>
  const API    = 'http://localhost:3000';
  const ENC_ID = 5;
  let stageActif = null;

  async function chargerRapports() {
    const r = await fetch(\`\${API}/api/encadrant/\${ENC_ID}/rapports\`);
    const rapports = await r.json();
    const c = document.getElementById('listeRapports');
    if (!rapports.length) {
      c.innerHTML = \`<div class="bg-white rounded-2xl p-12 text-center shadow">
        <p class="text-5xl mb-4">📄</p>
        <p class="text-xl font-bold text-gray-700">Aucun rapport soumis</p>
      </div>\`;
      return;
    }
    c.innerHTML = rapports.map(rap => {
      const statusColors = { soumis:'bg-amber-100 text-amber-700', valide:'bg-green-100 text-green-700', rejete:'bg-red-100 text-red-700' };
      const statusLabels = { soumis:'Soumis', valide:'Validé', rejete:'Rejeté' };
      return \`<div class="bg-white rounded-2xl shadow p-6 flex items-center justify-between" style="border-left:4px solid #c9930a">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
               style="background:#f0f4fa">📄</div>
          <div>
            <p class="font-bold text-gray-800">\${rap.prenom} \${rap.nom}</p>
            <p class="text-sm text-gray-500 mt-0.5">\${rap.titre || 'Rapport de stage'}</p>
            <p class="text-xs text-gray-400 mt-1">\${new Date(rap.date_soumission).toLocaleDateString('fr-FR')}</p>
            \${rap.fichier ? \`<a href="\${API}/\${rap.fichier}" target="_blank" class="text-xs font-medium mt-1 inline-block" style="color:#c9930a">📎 Voir le fichier</a>\` : ''}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-xs font-medium \${statusColors[rap.statut]||'bg-gray-100 text-gray-600'}">\${statusLabels[rap.statut]||rap.statut}</span>
          \${rap.statut === 'soumis' ? \`
            <button onclick="validerRapport(\${rap.id})"
                    class="text-xs text-white px-4 py-2 rounded-xl font-medium transition"
                    style="background:linear-gradient(135deg,#163a5f,#0c2340)">✅ Valider</button>\` : ''}
          <button onclick="ouvrirFeedback(\${rap.stage_id},'\${rap.prenom} \${rap.nom}')"
                  class="text-xs px-4 py-2 rounded-xl font-medium transition"
                  style="background:#fef3c7;color:#92400e">💬 Feedback</button>
          \${badgeType(rap.type_stage)}
        </div>
      </div>\`;
    }).join('');
  }

  async function validerRapport(id) {
    if (!confirm('Valider ce rapport ?')) return;
    await fetch(\`\${API}/api/rapport/\${id}/valider\`, { method:'PUT' });
    afficherSucces('Rapport validé avec succès !');
    chargerRapports();
  }

  function ouvrirFeedback(stageId, nom) {
    stageActif = stageId;
    document.getElementById('nomEtudiantFeed').textContent = \`Étudiant : \${nom}\`;
    document.getElementById('inputFeedback').value = '';
    document.getElementById('modalFeedback').classList.remove('hidden');
  }

  async function envoyerFeedback() {
    const commentaire = document.getElementById('inputFeedback').value.trim();
    if (!commentaire) return;
    await fetch(\`\${API}/api/encadrant/feedback\`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ commentaire, stage_id: stageActif, encadrant_id: ENC_ID })
    });
    fermerModal();
    afficherSucces('Feedback envoyé !');
  }

  function fermerModal() { document.getElementById('modalFeedback').classList.add('hidden'); }
  document.getElementById('modalFeedback').addEventListener('click', function(e) { if (e.target===this) fermerModal(); });

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

  chargerRapports();
<\/script>
</body>
</html>`);

/* ── 4. encadrant/profil.html ─────────────────────────────────────── */
write('encadrant/profil.html', `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon Profil – Encadrant</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  ${NAV_STYLE}
  <style>
    #toast { position:fixed;top:1.5rem;right:1.5rem;z-index:9999;min-width:300px;max-width:420px;
      display:flex;align-items:flex-start;gap:.75rem;padding:1rem 1.25rem;border-radius:1rem;
      box-shadow:0 8px 30px rgba(0,0,0,.12);font-size:.875rem;
      transition:opacity .4s ease,transform .4s ease;opacity:0;transform:translateY(-12px);pointer-events:none; }
    #toast.show { opacity:1;transform:translateY(0);pointer-events:auto; }
    #toast.succes { background:#f0fdf4;border:1.5px solid #86efac;color:#166534; }
    #toast.erreur { background:#fff1f2;border:1.5px solid #fca5a5;color:#991b1b; }
    #toast .toast-bar { position:absolute;bottom:0;left:0;height:3px;border-radius:0 0 1rem 1rem;animation:toastBar 3s linear forwards; }
    #toast.succes .toast-bar { background:#22c55e; }
    #toast.erreur .toast-bar  { background:#ef4444; }
    @keyframes toastBar { from{width:100%} to{width:0%} }
  </style>
</head>
<body>
<div class="flex h-screen overflow-hidden">
  ${SIDEBAR_ENC('profil')}
  <main class="ml-64 flex-1 overflow-y-auto">
    <div class="bg-white px-6 py-4 sticky top-0 z-20"
         style="border-bottom:2px solid #eef2f7;box-shadow:0 1px 4px rgba(0,0,0,.05)">
      <h1 class="text-lg font-bold" style="color:#0c2340">👤 Mon Profil</h1>
      <p class="text-xs text-gray-400 mt-0.5">Consultez et modifiez vos informations</p>
    </div>

    <div id="toast">
      <span class="toast-icon text-xl" id="toastIcon"></span>
      <div class="flex-1">
        <p class="font-bold" id="toastTitre"></p>
        <p class="opacity-85 leading-snug" id="toastMsg"></p>
      </div>
      <button onclick="fermerToast()" class="opacity-50 hover:opacity-100 text-xl leading-none">✕</button>
      <div class="toast-bar" id="toastBar"></div>
    </div>

    <div class="p-6 fade-in max-w-4xl mx-auto">
      <!-- Carte profil -->
      <div class="bg-white rounded-2xl shadow p-8 mb-6" style="border-top:3px solid #c9930a">
        <div class="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div id="avatarGrand"
               class="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg"
               style="background:linear-gradient(135deg,#0c2340,#163a5f);color:#f5d87e">EN</div>
          <div>
            <h2 id="nomComplet" class="text-2xl font-bold text-gray-800">--</h2>
            <p class="font-medium mt-1" style="color:#c9930a">👨‍🏫 Encadrant</p>
            <p id="gradeAffiche" class="text-gray-500 text-sm mt-1">--</p>
            <p id="deptAffiche"  class="text-gray-400 text-sm mt-1">--</p>
            <div class="mt-3 flex items-center gap-3">
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div id="barreCharge" class="h-2 rounded-full" style="width:0%;background:linear-gradient(90deg,#c9930a,#f5d87e)"></div>
              </div>
              <span id="texteCharge" class="text-xs text-gray-500">-- / -- étudiants</span>
            </div>
          </div>
        </div>

        <h3 class="font-bold text-gray-700 mb-4 text-lg">✏️ Modifier mes informations</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Prénom</label>
            <input id="inputPrenom" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nom</label>
            <input id="inputNom" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Email</label>
            <input id="inputEmail" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Téléphone</label>
            <input id="inputTel" type="tel" placeholder="+216 XX XXX XXX" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Grade</label>
            <input id="inputGrade" type="text" placeholder="ex: Maître de conférences" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Département</label>
            <input id="inputDept" type="text" disabled class="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"/>
          </div>
        </div>
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Bio</label>
          <textarea id="inputBio" rows="3" placeholder="Décrivez vos spécialités..."
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition"></textarea>
        </div>
        <button onclick="sauvegarderProfil()"
                class="text-white px-6 py-3 rounded-xl font-medium text-sm transition"
                style="background:linear-gradient(135deg,#0c2340,#163a5f)">
          💾 Sauvegarder les modifications
        </button>
      </div>

      <!-- Mot de passe -->
      <div class="bg-white rounded-2xl shadow p-8" style="border-top:3px solid #c9930a">
        <h3 class="font-bold text-gray-700 mb-4 text-lg">🔒 Changer le mot de passe</h3>
        <div class="space-y-4 max-w-md">
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Ancien mot de passe</label>
            <input id="inputAncien" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nouveau mot de passe</label>
            <input id="inputNouveau" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Confirmer</label>
            <input id="inputConfirm" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
          </div>
          <button onclick="changerPassword()"
                  class="text-white px-6 py-3 rounded-xl font-medium text-sm transition"
                  style="background:#1e293b">
            🔑 Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  </main>
</div>

<script>
  const API    = 'http://localhost:3000';
  const ENC_ID = 5;

  async function chargerProfil() {
    const r = await fetch(\`\${API}/api/encadrant/profil/\${ENC_ID}\`);
    const user = await r.json();
    const init = (user.prenom[0]+user.nom[0]).toUpperCase();
    document.getElementById('avatarGrand').textContent  = init;
    document.getElementById('avatarMenu').textContent   = init;
    document.getElementById('nomMenu').textContent      = \`\${user.prenom} \${user.nom}\`;
    document.getElementById('deptMenu').textContent     = user.departement || '–';
    document.getElementById('nomComplet').textContent   = \`\${user.prenom} \${user.nom}\`;
    document.getElementById('gradeAffiche').textContent = user.grade || '–';
    document.getElementById('deptAffiche').textContent  = user.departement || '–';
    const pct = Math.round((user.nb_etudiants_actuel / user.nb_etudiants_max) * 100);
    document.getElementById('barreCharge').style.width = \`\${pct}%\`;
    document.getElementById('texteCharge').textContent = \`\${user.nb_etudiants_actuel} / \${user.nb_etudiants_max} étudiants\`;
    document.getElementById('inputPrenom').value = user.prenom;
    document.getElementById('inputNom').value    = user.nom;
    document.getElementById('inputEmail').value  = user.email;
    document.getElementById('inputTel').value    = user.telephone || '';
    document.getElementById('inputGrade').value  = user.grade || '';
    document.getElementById('inputBio').value    = user.bio || '';
    document.getElementById('inputDept').value   = user.departement || '';
  }

  function validerProfil(prenom, nom, email, telephone, grade, bio) {
    const nomRegex   = /^[A-Za-zÀ-ÖØ-öø-ÿ\\s\\-']{2,50}$/;
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const telRegex   = /^(\\+216\\s?)?[0-9]{2}[\\s]?[0-9]{3}[\\s]?[0-9]{3}$/;
    if (!prenom.trim() || !nom.trim()) { afficherErreur('Le prénom et le nom sont obligatoires.'); return false; }
    if (!nomRegex.test(prenom.trim())) { afficherErreur('Prénom invalide : lettres uniquement, 2 à 50 caractères.'); return false; }
    if (!nomRegex.test(nom.trim()))    { afficherErreur('Nom invalide : lettres uniquement, 2 à 50 caractères.'); return false; }
    if (!email.trim())                 { afficherErreur("L'email est obligatoire."); return false; }
    if (!emailRegex.test(email.trim())) { afficherErreur("Format d'email invalide (ex : nom@domaine.com)."); return false; }
    if (telephone.trim() && !telRegex.test(telephone.trim())) { afficherErreur('Téléphone invalide (ex : +216 12 345 678).'); return false; }
    if (grade.trim() && grade.trim().length < 3) { afficherErreur('Le grade doit contenir au moins 3 caractères.'); return false; }
    if (bio.trim().length > 500) { afficherErreur('La bio ne doit pas dépasser 500 caractères.'); return false; }
    return true;
  }

  async function sauvegarderProfil() {
    const prenom = document.getElementById('inputPrenom').value;
    const nom    = document.getElementById('inputNom').value;
    const email  = document.getElementById('inputEmail').value;
    const tel    = document.getElementById('inputTel').value;
    const grade  = document.getElementById('inputGrade').value;
    const bio    = document.getElementById('inputBio').value;
    if (!validerProfil(prenom, nom, email, tel, grade, bio)) return;
    const reponse = await fetch(\`\${API}/api/encadrant/profil/\${ENC_ID}\`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ prenom, nom, email, telephone: tel, grade, bio })
    });
    const data = await reponse.json();
    afficherSucces(data.message);
    chargerProfil();
  }

  async function changerPassword() {
    const ancien  = document.getElementById('inputAncien').value;
    const nouveau = document.getElementById('inputNouveau').value;
    const confirm = document.getElementById('inputConfirm').value;
    if (!ancien || !nouveau || !confirm) { afficherErreur('Veuillez remplir tous les champs !'); return; }
    if (nouveau !== confirm) { afficherErreur('Les mots de passe ne correspondent pas !'); return; }
    if (nouveau.length < 6) { afficherErreur('Minimum 6 caractères !'); return; }
    const reponse = await fetch(\`\${API}/api/encadrant/profil/\${ENC_ID}/password\`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ancien, nouveau })
    });
    const data = await reponse.json();
    if (reponse.ok) {
      afficherSucces(data.message);
      document.getElementById('inputAncien').value = '';
      document.getElementById('inputNouveau').value = '';
      document.getElementById('inputConfirm').value = '';
    } else { afficherErreur(data.message); }
  }

  let _toastTimer = null;
  function afficherToast(type, titre, msg) {
    const t = document.getElementById('toast');
    const bar = document.getElementById('toastBar');
    t.className = type;
    document.getElementById('toastIcon').textContent  = type === 'succes' ? '✅' : '⚠️';
    document.getElementById('toastTitre').textContent = titre;
    document.getElementById('toastMsg').textContent   = msg;
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    t.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(fermerToast, 3800);
  }
  function fermerToast() { document.getElementById('toast').classList.remove('show'); }
  function afficherSucces(msg) { afficherToast('succes', 'Succès', msg); }
  function afficherErreur(msg) {
    const parts = msg.split(' : ');
    afficherToast('erreur', parts.length > 1 ? parts[0] : 'Champ invalide', parts.length > 1 ? parts.slice(1).join(' : ') : msg);
  }

  chargerProfil();
<\/script>
</body>
</html>`);

/* ── 5. encadrant/suggestions.html ─────────────────────────────────────── */
write('encadrant/suggestions.html', `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mes Suggestions – Encadrant</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  ${NAV_STYLE}
  <style>
    .carte { background:#fff;border-radius:18px;box-shadow:0 1px 6px rgba(0,0,0,.06);transition:transform .25s,box-shadow .25s; }
    .carte:hover { transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.1); }
    #toast { position:fixed;top:1.5rem;right:1.5rem;z-index:9999;min-width:290px;
      display:flex;align-items:flex-start;gap:.75rem;padding:1rem 1.25rem;border-radius:14px;
      box-shadow:0 8px 30px rgba(0,0,0,.12);transition:opacity .35s,transform .35s;
      opacity:0;transform:translateY(-12px);pointer-events:none; }
    #toast.show { opacity:1;transform:translateY(0);pointer-events:auto; }
    #toast.succes { background:#f0fdf4;border:1.5px solid #86efac;color:#166534; }
    #toast.erreur { background:#fef2f2;border:1.5px solid #fca5a5;color:#991b1b; }
  </style>
</head>
<body>
<div class="flex h-screen overflow-hidden">
  ${SIDEBAR_ENC('suggestions')}
  <main class="ml-64 flex-1 overflow-y-auto">
    <div class="bg-white px-6 py-4 sticky top-0 z-20 flex justify-between items-center"
         style="border-bottom:2px solid #eef2f7;box-shadow:0 1px 4px rgba(0,0,0,.05)">
      <div>
        <h1 class="text-lg font-bold" style="color:#0c2340">💡 Mes Suggestions de Stage</h1>
        <p class="text-xs text-gray-400 mt-0.5">Proposez des sujets au chef de département</p>
      </div>
      <button onclick="ouvrirModal()"
              class="text-white px-5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
              style="background:linear-gradient(135deg,#0c2340,#163a5f)">
        ➕ Nouvelle suggestion
      </button>
    </div>

    <div class="p-6 fade-in">
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="carte p-5 flex items-center gap-4" style="border-top:3px solid #c9930a">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style="background:#fef3c7">⏳</div>
          <div>
            <p class="text-2xl font-bold text-gray-800" id="nbAttente">--</p>
            <p class="text-xs text-gray-500">En attente</p>
          </div>
        </div>
        <div class="carte p-5 flex items-center gap-4" style="border-top:3px solid #22c55e">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-green-100">✅</div>
          <div>
            <p class="text-2xl font-bold text-gray-800" id="nbApprouvees">--</p>
            <p class="text-xs text-gray-500">Approuvées</p>
          </div>
        </div>
        <div class="carte p-5 flex items-center gap-4" style="border-top:3px solid #ef4444">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-red-100">❌</div>
          <div>
            <p class="text-2xl font-bold text-gray-800" id="nbRejetees">--</p>
            <p class="text-xs text-gray-500">Rejetées</p>
          </div>
        </div>
      </div>

      <!-- Mes suggestions -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-gray-700">💡 Mes suggestions
          <span class="text-sm font-normal text-gray-400 ml-2" id="compteur"></span>
        </h2>
        <div class="flex gap-3">
          <select id="filtreStatut" onchange="filtrer()"
                  class="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none">
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="approuvee">Approuvée</option>
            <option value="rejetee">Rejetée</option>
          </select>
          <select id="filtreType" onchange="filtrer()"
                  class="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none">
            <option value="">Tous les types</option>
            <option value="initiation">Initiation</option>
            <option value="perfectionnement">Perfectionnement</option>
            <option value="fin_etude">PFE</option>
          </select>
        </div>
      </div>
      <div id="listeSuggestions" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <p class="text-center text-gray-400 py-8 col-span-2">⏳ Chargement...</p>
      </div>

      <hr class="border-gray-200 my-8"/>

      <!-- Suggestions du département -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-gray-700">🏢 Toutes les suggestions du département</h2>
        <div class="flex gap-3">
          <select id="filtreTypeDept" onchange="filtrerDept()"
                  class="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none">
            <option value="">Tous les types</option>
            <option value="initiation">Initiation</option>
            <option value="perfectionnement">Perfectionnement</option>
            <option value="fin_etude">PFE</option>
          </select>
          <input id="searchDept" oninput="filtrerDept()" type="text" placeholder="🔍 Rechercher..."
                 class="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"/>
        </div>
      </div>
      <div id="listeDept" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p class="text-center text-gray-400 py-8 col-span-2">⏳ Chargement...</p>
      </div>
    </div>
  </main>
</div>

<!-- Modal -->
<div id="modal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold" style="color:#0c2340">💡 Proposer un sujet</h3>
      <button onclick="fermerModal()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">×</button>
    </div>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-medium text-gray-600 mb-1 block">Titre du sujet *</label>
        <input id="inputTitre" type="text" placeholder="Ex: Application de gestion..."
               class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
      </div>
      <div>
        <label class="text-sm font-medium text-gray-600 mb-1 block">Description</label>
        <textarea id="inputDesc" rows="3" placeholder="Décrivez le sujet de stage..."
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition"></textarea>
      </div>
      <div>
        <label class="text-sm font-medium text-gray-600 mb-1 block">Technologies</label>
        <input id="inputTech" type="text" placeholder="Ex: Node.js, React, MySQL"
               class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"/>
      </div>
      <div>
        <label class="text-sm font-medium text-gray-600 mb-1 block">Type de stage *</label>
        <select id="inputType" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition">
          <option value="initiation">Initiation (1ère année)</option>
          <option value="perfectionnement">Perfectionnement (2ème année)</option>
          <option value="fin_etude">PFE (3ème année)</option>
        </select>
      </div>
    </div>
    <div class="flex gap-3 mt-6">
      <button onclick="fermerModal()"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm transition">
        Annuler
      </button>
      <button onclick="soumettreSuggestion()"
              class="flex-1 text-white py-3 rounded-xl font-medium text-sm transition"
              style="background:linear-gradient(135deg,#0c2340,#163a5f)">
        📨 Soumettre au chef
      </button>
    </div>
  </div>
</div>

<div id="toast">
  <span class="text-xl" id="toastIcon"></span>
  <p id="toastMsg" class="text-sm font-medium"></p>
</div>

<script>
  const API     = 'http://localhost:3000';
  const ENC_ID  = 5;
  const DEPT_ID = 1;
  let toutesLesSuggestions = [];
  let suggestionsDept = [];

  async function init() {
    const r = await fetch(\`\${API}/api/encadrant/profil/\${ENC_ID}\`);
    const enc = await r.json();
    document.getElementById('nomMenu').textContent    = \`\${enc.prenom} \${enc.nom}\`;
    document.getElementById('deptMenu').textContent   = enc.departement || '--';
    document.getElementById('avatarMenu').textContent = (enc.prenom[0]+enc.nom[0]).toUpperCase();
    await Promise.all([chargerSuggestions(), chargerSuggestionsDept()]);
  }

  async function chargerSuggestions() {
    const r = await fetch(\`\${API}/api/encadrant/suggestions/\${ENC_ID}\`);
    toutesLesSuggestions = await r.json();
    document.getElementById('nbAttente').textContent   = toutesLesSuggestions.filter(s=>s.statut==='en_attente').length;
    document.getElementById('nbApprouvees').textContent= toutesLesSuggestions.filter(s=>s.statut==='approuvee').length;
    document.getElementById('nbRejetees').textContent  = toutesLesSuggestions.filter(s=>s.statut==='rejetee').length;
    document.getElementById('compteur').textContent    = \`\${toutesLesSuggestions.length} suggestion(s)\`;
    afficher(toutesLesSuggestions);
  }

  async function chargerSuggestionsDept() {
    const r = await fetch(\`\${API}/api/encadrant/suggestions-departement/\${DEPT_ID}\`);
    suggestionsDept = await r.json();
    afficherDept(suggestionsDept);
  }

  function afficher(suggestions) {
    const c = document.getElementById('listeSuggestions');
    if (!suggestions.length) {
      c.innerHTML = \`<div class="carte p-10 text-center col-span-2">
        <p class="text-5xl mb-4">💡</p>
        <p class="text-xl font-bold text-gray-700">Aucune suggestion</p>
        <p class="text-gray-400 mt-2">Proposez un sujet de stage au chef de département.</p>
      </div>\`; return;
    }
    c.innerHTML = suggestions.map(s => {
      const badge = badgeStatut(s.statut);
      const techHtml = s.technologies ? s.technologies.split(',').map(t=>\`<span class="bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">\${t.trim()}</span>\`).join('') : '';
      const motif = s.statut==='rejetee' && s.motif_rejet ? \`<div class="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600"><strong>Motif du rejet :</strong> \${s.motif_rejet}</div>\` : '';
      return \`<div class="carte p-6" style="border-top:3px solid #c9930a">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-bold text-gray-800 text-base flex-1 pr-2">\${s.titre}</h3>\${badge}
        </div>
        <p class="text-gray-500 text-sm mb-3">\${s.description||'–'}</p>
        \${techHtml ? \`<div class="flex flex-wrap gap-2 mb-3">\${techHtml}</div>\` : ''}
        <div class="flex justify-between items-center">\${badgeType(s.type_stage)}<span class="text-xs text-gray-400">\${formatDate(s.created_at)}</span></div>
        \${motif}
      </div>\`;
    }).join('');
  }

  function afficherDept(suggestions) {
    const c = document.getElementById('listeDept');
    if (!suggestions.length) {
      c.innerHTML = \`<div class="carte p-8 text-center col-span-2"><p class="text-3xl mb-2">🔍</p><p class="text-gray-400 text-sm">Aucune suggestion disponible dans le département.</p></div>\`; return;
    }
    c.innerHTML = suggestions.map(s => {
      const techHtml = s.technologies ? s.technologies.split(',').map(t=>\`<span class="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs">\${t.trim()}</span>\`).join('') : '';
      return \`<div class="carte p-5">
        <div class="flex justify-between items-start mb-2"><h3 class="font-bold text-gray-800 text-sm flex-1 pr-2">\${s.titre}</h3>\${badgeType(s.type_stage)}</div>
        <p class="text-gray-500 text-xs mb-3">\${s.description||'–'}</p>
        \${techHtml ? \`<div class="flex flex-wrap gap-1 mb-3">\${techHtml}</div>\` : ''}
        <div class="flex justify-between items-center text-xs text-gray-400">
          <span>Par <strong class="text-gray-600">\${s.auteur}</strong></span><span>\${formatDate(s.created_at)}</span>
        </div>
      </div>\`;
    }).join('');
  }

  function filtrer() {
    const statut = document.getElementById('filtreStatut').value;
    const type   = document.getElementById('filtreType').value;
    const result = toutesLesSuggestions.filter(s=>(!statut||s.statut===statut)&&(!type||s.type_stage===type));
    document.getElementById('compteur').textContent = \`\${result.length} suggestion(s)\`;
    afficher(result);
  }

  function filtrerDept() {
    const type   = document.getElementById('filtreTypeDept').value;
    const search = document.getElementById('searchDept').value.toLowerCase();
    afficherDept(suggestionsDept.filter(s=>(!type||s.type_stage===type)&&(!search||s.titre.toLowerCase().includes(search)||(s.description||'').toLowerCase().includes(search)||(s.technologies||'').toLowerCase().includes(search))));
  }

  async function soumettreSuggestion() {
    const titre = document.getElementById('inputTitre').value.trim();
    if (!titre) { toast('Titre obligatoire !', false); return; }
    const body = { titre, description:document.getElementById('inputDesc').value.trim()||null,
      technologies:document.getElementById('inputTech').value.trim()||null,
      type_stage:document.getElementById('inputType').value, encadrant_id:ENC_ID, dept_id:DEPT_ID };
    const r = await fetch(\`\${API}/api/encadrant/suggestions\`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) { toast(data.message, false); return; }
    fermerModal();
    toast(data.message, true);
    chargerSuggestions();
  }

  function ouvrirModal() {
    document.getElementById('inputTitre').value = '';
    document.getElementById('inputDesc').value  = '';
    document.getElementById('inputTech').value  = '';
    document.getElementById('modal').classList.remove('hidden');
  }
  function fermerModal() { document.getElementById('modal').classList.add('hidden'); }
  document.getElementById('modal').addEventListener('click', e => { if (e.target===document.getElementById('modal')) fermerModal(); });

  function toast(msg, succes=true) {
    const el = document.getElementById('toast');
    document.getElementById('toastIcon').textContent = succes ? '✅' : '⚠️';
    document.getElementById('toastMsg').textContent  = msg;
    el.className = succes ? 'show succes' : 'show erreur';
    setTimeout(() => { el.className = succes ? 'succes' : 'erreur'; }, 3000);
  }

  function badgeStatut(s) {
    const m = { en_attente:['bg-amber-100 text-amber-700','⏳ En attente'], approuvee:['bg-green-100 text-green-700','✅ Approuvée'], rejetee:['bg-red-100 text-red-700','❌ Rejetée'] };
    const [cls,lbl] = m[s]||['bg-gray-100 text-gray-600',s];
    return \`<span class="\${cls} px-2 py-1 rounded-full text-xs font-medium">\${lbl}</span>\`;
  }

  function badgeType(t) {
    const s = { initiation:'bg-green-100 text-green-600', perfectionnement:'bg-amber-100 text-amber-600', fin_etude:'bg-red-100 text-red-600' };
    const l = { initiation:'Initiation', perfectionnement:'Perfectionnement', fin_etude:'PFE' };
    return \`<span class="\${s[t]||'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full text-xs font-medium">\${l[t]||t}</span>\`;
  }

  function formatDate(d) {
    if (!d) return '–';
    return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
  }

  init();
<\/script>
</body>
</html>`);

console.log('Batch 3 done! All encadrant files written.');
