#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script to write all redesigned HTML files for the university internship management system."""
import os

BASE = r"D:\Bureau\gestion-stages\frontend"

# ── Shared CSS snippet ────────────────────────────────────────────────────────
UNIV_CSS = """
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
"""

FONT_LINK = """  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">"""

def admin_sidebar(active):
    links = [
        ("dashboard.html", "📊", "Dashboard"),
        ("utilisateurs.html", "👥", "Utilisateurs"),
        ("departement.html", "🏛️", "Départements"),
        ("profil.html", "👤", "Mon Profil"),
    ]
    nav = ""
    for href, icon, label in links:
        cls = "nav-link active" if href == active else "nav-link"
        nav += f'      <a href="{href}" class="{cls}"><span class="nav-icon">{icon}</span> {label}</a>\n'
    return f"""  <aside class="sidebar w-64 flex flex-col fixed h-full z-30">
    <div class="px-5 py-5" style="border-bottom:1px solid rgba(255,255,255,.1)">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
             style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">🎓</div>
        <div>
          <p class="text-white font-bold text-sm">Gestion Stages</p>
          <p class="text-xs" style="color:rgba(255,255,255,.45)">Plateforme Universitaire</p>
        </div>
      </div>
    </div>
    <div class="mx-3 my-3 p-3 rounded-xl" style="background:rgba(255,255,255,.08)">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
             style="background:#c9930a;color:#0c2340">AD</div>
        <div class="min-w-0">
          <p class="text-white text-sm font-semibold">Administrateur</p>
          <p class="text-xs" style="color:#c9930a">Super Admin</p>
        </div>
      </div>
    </div>
    <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
{nav}    </nav>
    <div class="px-3 pb-4 pt-2" style="border-top:1px solid rgba(255,255,255,.1)">
      <button class="nav-link w-full text-left" style="color:#fca5a5">
        <span class="nav-icon">🚪</span> Déconnexion
      </button>
    </div>
  </aside>"""

def chef_sidebar(active):
    links = [
        ("dashboard.html", "📊", "Dashboard"),
        ("demandes.html", "📩", "Demandes"),
        ("affectation.html", "🔗", "Affectation"),
        ("stages.html", "📋", "Stages"),
        ("deadlines.html", "⏰", "Deadlines"),
        ("suggestions.html", "💡", "Suggestions"),
        ("profil.html", "👤", "Mon Profil"),
    ]
    nav = ""
    for href, icon, label in links:
        cls = "nav-link active" if href == active else "nav-link"
        nav += f'      <a href="{href}" class="{cls}"><span class="nav-icon">{icon}</span> {label}</a>\n'
    return f"""  <aside class="sidebar w-64 flex flex-col fixed h-full z-30">
    <div class="px-5 py-5" style="border-bottom:1px solid rgba(255,255,255,.1)">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
             style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">🎓</div>
        <div>
          <p class="text-white font-bold text-sm">Gestion Stages</p>
          <p class="text-xs" style="color:rgba(255,255,255,.45)">Plateforme Universitaire</p>
        </div>
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
{nav}    </nav>
    <div class="px-3 pb-4 pt-2" style="border-top:1px solid rgba(255,255,255,.1)">
      <button class="nav-link w-full text-left" style="color:#fca5a5">
        <span class="nav-icon">🚪</span> Déconnexion
      </button>
    </div>
  </aside>"""

def encadrant_sidebar(active, extra_link=False):
    links = [
        ("dashboard.html", "📊", "Dashboard"),
        ("etudiants.html", "👥", "Mes Étudiants"),
        ("messagerie.html", "💬", "Messagerie"),
        ("rapports.html", "📄", "Rapports"),
        ("suggestions.html", "💡", "Suggestions"),
        ("profil.html", "👤", "Mon Profil"),
    ]
    nav = ""
    for href, icon, label in links:
        cls = "nav-link active" if href == active else "nav-link"
        nav += f'      <a href="{href}" class="{cls}"><span class="nav-icon">{icon}</span> {label}</a>\n'
    return f"""  <aside class="sidebar w-64 flex flex-col fixed h-full z-30">
    <div class="px-5 py-5" style="border-bottom:1px solid rgba(255,255,255,.1)">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
             style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">🎓</div>
        <div>
          <p class="text-white font-bold text-sm">Gestion Stages</p>
          <p class="text-xs" style="color:rgba(255,255,255,.45)">Plateforme Universitaire</p>
        </div>
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
{nav}    </nav>
    <div class="px-3 pb-4 pt-2" style="border-top:1px solid rgba(255,255,255,.1)">
      <button class="nav-link w-full text-left" style="color:#fca5a5">
        <span class="nav-icon">🚪</span> Déconnexion
      </button>
    </div>
  </aside>"""

def topbar(icon, title, subtitle, extra_html=""):
    return f"""    <div class="bg-white px-6 py-4 sticky top-0 z-20 flex justify-between items-center"
         style="border-bottom:2px solid #eef2f7;box-shadow:0 2px 8px rgba(12,35,64,.06)">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
             style="background:#0c2340">{icon}</div>
        <div>
          <h1 class="text-base font-bold" style="color:#0c2340">{title}</h1>
          <p class="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      {extra_html}
    </div>"""

# ══════════════════════════════════════════════════════════════════════════════
# admin/profil.html
# ══════════════════════════════════════════════════════════════════════════════
admin_profil = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Profil — Administration</title>
{FONT_LINK}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>{UNIV_CSS}  </style>
</head>
<body>
<div class="flex h-screen">
{admin_sidebar("profil.html")}
  <main class="ml-64 flex-1 overflow-y-auto">
{topbar("👤", "Mon Profil", "Consultez et modifiez vos informations")}
    <div class="p-6 fade-in max-w-4xl mx-auto">
      <div id="msgSucces" class="hidden mb-4 rounded-xl p-4 flex items-center gap-3" style="background:#f0fdf4;border:1.5px solid #86efac;color:#166534">
        <span class="text-2xl">✅</span><p id="texteSucces" class="font-medium"></p>
      </div>
      <div id="msgErreur" class="hidden mb-4 rounded-xl p-4 flex items-center gap-3" style="background:#fff1f2;border:1.5px solid #fca5a5;color:#991b1b">
        <span class="text-2xl">❌</span><p id="texteErreur" class="font-medium"></p>
      </div>

      <div class="bg-white rounded-2xl p-8 mb-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="flex items-center gap-6 mb-8 pb-8" style="border-bottom:1px solid #f0f4fa">
          <div id="avatarGrand" class="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl text-white"
               style="background:linear-gradient(135deg,#0c2340,#1e4d7b)">AD</div>
          <div>
            <h2 id="nomComplet" class="text-2xl font-bold" style="color:#0c2340">--</h2>
            <p class="font-medium mt-1" style="color:#c9930a">👑 Administrateur</p>
            <p id="dateInscription" class="text-gray-400 text-sm mt-1">--</p>
          </div>
        </div>
        <h3 class="font-bold mb-4 text-lg" style="color:#0c2340">✏️ Modifier mes informations</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Prénom</label>
            <input id="inputPrenom" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nom</label>
            <input id="inputNom" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Email</label>
            <input id="inputEmail" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Téléphone</label>
            <input id="inputTel" type="text" placeholder="+216 XX XXX XXX" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
        </div>
        <button onclick="sauvegarderProfil()" class="text-white px-6 py-3 rounded-xl font-medium text-sm transition" style="background:#0c2340">
          💾 Sauvegarder les modifications
        </button>
      </div>

      <div class="bg-white rounded-2xl p-8" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <h3 class="font-bold mb-4 text-lg" style="color:#0c2340">🔒 Changer le mot de passe</h3>
        <div class="space-y-4 max-w-md">
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Ancien mot de passe</label>
            <input id="inputAncien" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nouveau mot de passe</label>
            <input id="inputNouveau" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Confirmer le nouveau mot de passe</label>
            <input id="inputConfirm" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <button onclick="changerPassword()" class="text-white px-6 py-3 rounded-xl font-medium text-sm transition" style="background:#163a5f">
            🔒 Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  </main>
</div>
<script>
  const API      = 'http://localhost:3000';
  const ADMIN_ID = 1;

  async function chargerProfil() {{
    const reponse = await fetch(`${{API}}/api/admin/profil/${{ADMIN_ID}}`);
    const user    = await reponse.json();
    document.getElementById('nomComplet').textContent     = `${{user.prenom}} ${{user.nom}}`;
    document.getElementById('nomMenu').textContent        = `${{user.prenom}} ${{user.nom}}`;
    document.getElementById('avatarGrand').textContent    = `${{user.prenom[0]}}${{user.nom[0]}}`;
    document.getElementById('avatarMenu').textContent     = `${{user.prenom[0]}}${{user.nom[0]}}`;
    document.getElementById('dateInscription').textContent = `Membre depuis ${{new Date(user.created_at).toLocaleDateString('fr-FR')}}`;
    document.getElementById('inputPrenom').value = user.prenom;
    document.getElementById('inputNom').value    = user.nom;
    document.getElementById('inputEmail').value  = user.email;
    document.getElementById('inputTel').value    = user.telephone || '';
  }}

  async function sauvegarderProfil() {{
    const body = {{
      prenom: document.getElementById('inputPrenom').value,
      nom: document.getElementById('inputNom').value,
      email: document.getElementById('inputEmail').value,
      telephone: document.getElementById('inputTel').value,
    }};
    const reponse = await fetch(`${{API}}/api/admin/profil/${{ADMIN_ID}}`, {{
      method: 'PUT', headers: {{ 'Content-Type': 'application/json' }}, body: JSON.stringify(body)
    }});
    const data = await reponse.json();
    afficherSucces(data.message);
    chargerProfil();
  }}

  async function changerPassword() {{
    const ancien  = document.getElementById('inputAncien').value;
    const nouveau = document.getElementById('inputNouveau').value;
    const confirm = document.getElementById('inputConfirm').value;
    if (!ancien || !nouveau || !confirm) {{ afficherErreur('Veuillez remplir tous les champs !'); return; }}
    if (nouveau !== confirm) {{ afficherErreur('Les mots de passe ne correspondent pas !'); return; }}
    if (nouveau.length < 6) {{ afficherErreur('Minimum 6 caractères !'); return; }}
    const reponse = await fetch(`${{API}}/api/admin/profil/${{ADMIN_ID}}/password`, {{
      method: 'PUT', headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify({{ ancien, nouveau }})
    }});
    const data = await reponse.json();
    if (reponse.ok) {{
      afficherSucces(data.message);
      ['inputAncien','inputNouveau','inputConfirm'].forEach(id => document.getElementById(id).value = '');
    }} else {{ afficherErreur(data.message); }}
  }}

  function afficherSucces(msg) {{
    document.getElementById('texteSucces').textContent = msg;
    document.getElementById('msgSucces').classList.remove('hidden');
    document.getElementById('msgErreur').classList.add('hidden');
    setTimeout(() => document.getElementById('msgSucces').classList.add('hidden'), 3000);
  }}
  function afficherErreur(msg) {{
    document.getElementById('texteErreur').textContent = msg;
    document.getElementById('msgErreur').classList.remove('hidden');
    document.getElementById('msgSucces').classList.add('hidden');
    setTimeout(() => document.getElementById('msgErreur').classList.add('hidden'), 3000);
  }}
  chargerProfil();
</script>
</body>
</html>"""

# ══════════════════════════════════════════════════════════════════════════════
# chef/dashboard.html
# ══════════════════════════════════════════════════════════════════════════════
chef_dashboard = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Dashboard — Chef de Département</title>
{FONT_LINK}
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>{UNIV_CSS}  </style>
</head>
<body>
<div class="flex h-screen">
{chef_sidebar("dashboard.html")}
  <main class="ml-64 flex-1 overflow-y-auto">
{topbar("📊", "Dashboard Chef de Département", '<span id="sousTitre">Chargement...</span>')}
    <div class="p-6 fade-in">

      <!-- Bannière -->
      <div class="rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
           style="background:linear-gradient(135deg,#0c2340,#1e4d7b)">
        <div class="absolute right-6 top-2 text-8xl opacity-10 select-none">🏛️</div>
        <p class="text-sm mb-1" style="color:rgba(201,147,10,.9)">Vous gérez le département</p>
        <h2 id="titreBanniere" class="text-3xl font-bold">--</h2>
        <p id="descBanniere" class="text-sm mt-2" style="color:rgba(255,255,255,.7)">--</p>
      </div>

      <!-- 5 cartes statistiques -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #0c2340;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">Total Stages</p>
          <p id="totalStages" class="text-3xl font-bold mt-1" style="color:#0c2340">--</p>
          <p class="text-xs mt-2" style="color:#0c2340">📋 Tous statuts</p>
        </div>
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #c9930a;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">En attente</p>
          <p id="enAttente" class="text-3xl font-bold mt-1" style="color:#c9930a">--</p>
          <p class="text-xs mt-2" style="color:#c9930a">⏳ À affecter</p>
        </div>
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #059669;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">En cours</p>
          <p id="enCours" class="text-3xl font-bold mt-1" style="color:#059669">--</p>
          <p class="text-xs mt-2" style="color:#059669">🟢 Actifs</p>
        </div>
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #0891b2;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">Étudiants</p>
          <p id="nbEtudiants" class="text-3xl font-bold mt-1" style="color:#0891b2">--</p>
          <p class="text-xs mt-2" style="color:#0891b2">🎓 Inscrits</p>
        </div>
        <div class="bg-white rounded-2xl p-5 carte" style="border-top:3px solid #7c3aed;box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <p class="text-gray-500 text-xs">Encadrants</p>
          <p id="nbEncadrants" class="text-3xl font-bold mt-1" style="color:#7c3aed">--</p>
          <p class="text-xs mt-2" style="color:#7c3aed">👨‍🏫 Actifs</p>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl p-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <h3 class="font-bold mb-4" style="color:#0c2340">📊 Stages par statut</h3>
          <canvas id="graphStatut" height="220"></canvas>
        </div>
        <div class="bg-white rounded-2xl p-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
          <h3 class="font-bold mb-4" style="color:#0c2340">👨‍🏫 Charge des encadrants</h3>
          <canvas id="graphEncadrants" height="220"></canvas>
        </div>
      </div>

      <!-- Stages récents -->
      <div class="bg-white rounded-2xl p-6 mb-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold" style="color:#0c2340">📋 Stages récents</h3>
          <a href="stages.html" class="text-sm font-medium hover:underline" style="color:#c9930a">Voir tous →</a>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr style="background:#f0f4fa">
              <th class="px-4 py-3 text-left rounded-l-xl text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Étudiant</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Type</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Sujet</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Encadrant</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Progression</th>
              <th class="px-4 py-3 text-left rounded-r-xl text-xs font-bold uppercase tracking-wide" style="color:#1a2d45">Statut</th>
            </tr>
          </thead>
          <tbody id="tableauStages" class="divide-y divide-gray-100">
            <tr><td colspan="6" class="text-center py-6 text-gray-400">⏳ Chargement...</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Encadrants disponibles -->
      <div class="bg-white rounded-2xl p-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <h3 class="font-bold mb-4" style="color:#0c2340">👨‍🏫 Disponibilité des encadrants</h3>
        <div id="listeEncadrants" class="grid grid-cols-2 gap-4"></div>
      </div>
    </div>
  </main>
</div>
<script>
  const API     = 'http://localhost:3000';
  const DEPT_ID = 1;

  async function chargerDashboard() {{
    const reponse = await fetch(`${{API}}/api/chef/dashboard/${{DEPT_ID}}`);
    const data    = await reponse.json();
    document.getElementById('titreBanniere').textContent = `🏛️ ${{data.dept.nom}}`;
    document.getElementById('descBanniere').textContent  = data.dept.description || '';
    document.getElementById('sousTitre').textContent     = `Département ${{data.dept.nom}}`;
    document.getElementById('nomDept').textContent       = data.dept.nom;
    document.getElementById('totalStages').textContent   = data.stats.total_stages;
    document.getElementById('enAttente').textContent     = data.stats.en_attente;
    document.getElementById('enCours').textContent       = data.stats.en_cours;
    document.getElementById('nbEtudiants').textContent   = data.stats.nb_etudiants;
    document.getElementById('nbEncadrants').textContent  = data.stats.nb_encadrants;
    const stats  = data.stats;
    new Chart(document.getElementById('graphStatut'), {{
      type: 'doughnut',
      data: {{
        labels: ['En attente','Affecté','En cours','Validé','Refusé'],
        datasets: [{{ data: [stats.en_attente, stats.affecte||0, stats.en_cours, stats.valide||0, stats.refuse||0], backgroundColor: ['#c9930a','#0891b2','#059669','#0c2340','#dc2626'], borderWidth:3, borderColor:'#fff' }}]
      }},
      options: {{ plugins: {{ legend: {{ position: 'bottom' }} }} }}
    }});
    const tbody = document.getElementById('tableauStages');
    tbody.innerHTML = '';
    (data.stages || []).slice(0,8).forEach(s => {{
      tbody.innerHTML += `<tr class="hover:bg-gray-50 transition">
        <td class="px-4 py-4 font-medium text-gray-800">${{s.etudiant}}</td>
        <td class="px-4 py-4">${{badgeType(s.type_stage)}}</td>
        <td class="px-4 py-4 text-gray-600">${{s.titre}}</td>
        <td class="px-4 py-4 text-gray-600">${{s.encadrant||'—'}}</td>
        <td class="px-4 py-4"><div class="flex items-center gap-2"><div class="w-20 bg-gray-200 rounded-full h-2"><div class="h-2 rounded-full" style="width:${{s.progression}}%;background:#0c2340"></div></div><span class="text-xs text-gray-600">${{s.progression}}%</span></div></td>
        <td class="px-4 py-4">${{badgeStatut(s.statut)}}</td>
      </tr>`;
    }});
    const encChart = (data.encadrants || []).slice(0,6).map(e => e.prenom + ' ' + e.nom.substring(0,1) + '.');
    const encData  = (data.encadrants || []).slice(0,6).map(e => e.nb_etudiants_actuel);
    new Chart(document.getElementById('graphEncadrants'), {{
      type: 'bar',
      data: {{ labels: encChart, datasets: [{{ label: 'Étudiants', data: encData, backgroundColor: '#0c2340', borderRadius: 8 }}] }},
      options: {{ plugins: {{ legend: {{ display: false }} }}, scales: {{ y: {{ beginAtZero: true, ticks: {{ stepSize: 1 }} }} }} }}
    }});
    const listeEnc = document.getElementById('listeEncadrants');
    listeEnc.innerHTML = '';
    (data.encadrants || []).forEach(e => {{
      const pct = e.nb_etudiants_max > 0 ? Math.round((e.nb_etudiants_actuel / e.nb_etudiants_max) * 100) : 0;
      listeEnc.innerHTML += `<div class="bg-white rounded-2xl p-4" style="border:1px solid #eef2f7">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style="background:#0c2340">${{e.prenom[0]}}${{e.nom[0]}}</div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">${{e.prenom}} ${{e.nom}}</p>
              <p class="text-xs text-gray-400">${{e.grade||'—'}}</p>
            </div>
          </div>
          <span class="text-xs font-semibold px-2 py-1 rounded-full" style="background:#eef2f7;color:#0c2340">${{e.nb_etudiants_actuel}}/${{e.nb_etudiants_max}}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="h-2 rounded-full transition-all" style="width:${{pct}}%;background:${{pct >= 100 ? '#c9930a' : '#0c2340'}}"></div>
        </div>
      </div>`;
    }});
  }}

  function badgeType(type) {{
    const s = {{ initiation:'bg-green-100 text-green-600', perfectionnement:'bg-amber-100 text-amber-600', fin_etude:'bg-red-100 text-red-600' }};
    const l = {{ initiation:'Initiation', perfectionnement:'Perfectionnement', fin_etude:'PFE' }};
    return `<span class="${{s[type]||'bg-gray-100 text-gray-600'}} px-2 py-1 rounded-full text-xs font-medium">${{l[type]||type}}</span>`;
  }}
  function badgeStatut(statut) {{
    const s = {{ en_attente:'bg-amber-100 text-amber-600', affecte:'bg-blue-100 text-blue-600', en_cours:'bg-green-100 text-green-600', valide:'bg-cyan-100 text-cyan-600', refuse:'bg-red-100 text-red-600' }};
    const l = {{ en_attente:'En attente', affecte:'Affecté', en_cours:'En cours', valide:'Validé', refuse:'Refusé' }};
    return `<span class="${{s[statut]||'bg-gray-100 text-gray-600'}} px-2 py-1 rounded-full text-xs font-medium">${{l[statut]||statut}}</span>`;
  }}
  chargerDashboard();
</script>
</body>
</html>"""

# ══════════════════════════════════════════════════════════════════════════════
# chef/profil.html
# ══════════════════════════════════════════════════════════════════════════════
chef_profil = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Profil — Chef de Département</title>
{FONT_LINK}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>{UNIV_CSS}  </style>
</head>
<body>
<div class="flex h-screen">
{chef_sidebar("profil.html")}
  <main class="ml-64 flex-1 overflow-y-auto">
{topbar("👤", "Mon Profil", "Consultez et modifiez vos informations")}
    <div class="p-6 fade-in max-w-4xl mx-auto">
      <div id="msgSucces" class="hidden mb-4 rounded-xl p-4 flex items-center gap-3" style="background:#f0fdf4;border:1.5px solid #86efac;color:#166534">
        <span class="text-2xl">✅</span><p id="texteSucces" class="font-medium"></p>
      </div>
      <div id="msgErreur" class="hidden mb-4 rounded-xl p-4 flex items-center gap-3" style="background:#fff1f2;border:1.5px solid #fca5a5;color:#991b1b">
        <span class="text-2xl">❌</span><p id="texteErreur" class="font-medium"></p>
      </div>

      <div class="bg-white rounded-2xl p-8 mb-6" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <div class="flex items-center gap-6 mb-8 pb-8" style="border-bottom:1px solid #f0f4fa">
          <div id="avatarGrand" class="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl text-white"
               style="background:linear-gradient(135deg,#c9930a,#f5d87e);color:#0c2340">CH</div>
          <div>
            <h2 id="nomComplet" class="text-2xl font-bold" style="color:#0c2340">--</h2>
            <p class="font-medium mt-1" style="color:#c9930a">👨‍💼 Chef de Département</p>
            <p id="deptAffiche" class="text-gray-400 text-sm mt-1">--</p>
            <p id="dateInscription" class="text-gray-400 text-sm mt-1">--</p>
          </div>
        </div>
        <h3 class="font-bold mb-4 text-lg" style="color:#0c2340">✏️ Modifier mes informations</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Prénom</label>
            <input id="inputPrenom" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nom</label>
            <input id="inputNom" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Email</label>
            <input id="inputEmail" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Téléphone</label>
            <input id="inputTel" type="text" placeholder="+216 XX XXX XXX" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Département</label>
            <input id="inputDept" type="text" disabled class="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"/>
          </div>
        </div>
        <button onclick="sauvegarderProfil()" class="text-white px-6 py-3 rounded-xl font-medium text-sm transition" style="background:#0c2340">
          💾 Sauvegarder les modifications
        </button>
      </div>

      <div class="bg-white rounded-2xl p-8" style="box-shadow:0 2px 12px rgba(12,35,64,.07)">
        <h3 class="font-bold mb-4 text-lg" style="color:#0c2340">🔒 Changer le mot de passe</h3>
        <div class="space-y-4 max-w-md">
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Ancien mot de passe</label>
            <input id="inputAncien" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nouveau mot de passe</label>
            <input id="inputNouveau" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 mb-1 block">Confirmer</label>
            <input id="inputConfirm" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
          </div>
          <button onclick="changerPassword()" class="text-white px-6 py-3 rounded-xl font-medium text-sm transition" style="background:#163a5f">
            🔒 Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  </main>
</div>
<script>
  const API     = 'http://localhost:3000';
  const CHEF_ID = 11;

  async function chargerProfil() {{
    const reponse = await fetch(`${{API}}/api/chef/profil/${{CHEF_ID}}`);
    const user    = await reponse.json();
    document.getElementById('nomComplet').textContent     = `${{user.prenom}} ${{user.nom}}`;
    document.getElementById('nomMenu').textContent        = `${{user.prenom}} ${{user.nom}}`;
    document.getElementById('avatarGrand').textContent    = `${{user.prenom[0]}}${{user.nom[0]}}`;
    document.getElementById('avatarMenu').textContent     = `${{user.prenom[0]}}${{user.nom[0]}}`;
    document.getElementById('deptAffiche').textContent    = `🏛️ ${{user.departement || '—'}}`;
    document.getElementById('deptMenu').textContent       = user.departement || '—';
    document.getElementById('dateInscription').textContent = `Membre depuis ${{new Date(user.created_at).toLocaleDateString('fr-FR')}}`;
    document.getElementById('inputPrenom').value = user.prenom;
    document.getElementById('inputNom').value    = user.nom;
    document.getElementById('inputEmail').value  = user.email;
    document.getElementById('inputTel').value    = user.telephone || '';
    document.getElementById('inputDept').value   = user.departement || '';
  }}

  async function sauvegarderProfil() {{
    const body = {{
      prenom: document.getElementById('inputPrenom').value,
      nom: document.getElementById('inputNom').value,
      email: document.getElementById('inputEmail').value,
      telephone: document.getElementById('inputTel').value,
    }};
    const reponse = await fetch(`${{API}}/api/chef/profil/${{CHEF_ID}}`, {{
      method: 'PUT', headers: {{ 'Content-Type': 'application/json' }}, body: JSON.stringify(body)
    }});
    const data = await reponse.json();
    afficherSucces(data.message);
    chargerProfil();
  }}

  async function changerPassword() {{
    const ancien  = document.getElementById('inputAncien').value;
    const nouveau = document.getElementById('inputNouveau').value;
    const confirm = document.getElementById('inputConfirm').value;
    if (!ancien || !nouveau || !confirm) {{ afficherErreur('Veuillez remplir tous les champs !'); return; }}
    if (nouveau !== confirm) {{ afficherErreur('Les mots de passe ne correspondent pas !'); return; }}
    if (nouveau.length < 6) {{ afficherErreur('Minimum 6 caractères !'); return; }}
    const reponse = await fetch(`${{API}}/api/chef/profil/${{CHEF_ID}}/password`, {{
      method: 'PUT', headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify({{ ancien, nouveau }})
    }});
    const data = await reponse.json();
    if (reponse.ok) {{
      afficherSucces(data.message);
      ['inputAncien','inputNouveau','inputConfirm'].forEach(id => document.getElementById(id).value = '');
    }} else {{ afficherErreur(data.message); }}
  }}

  function afficherSucces(msg) {{
    document.getElementById('texteSucces').textContent = msg;
    document.getElementById('msgSucces').classList.remove('hidden');
    document.getElementById('msgErreur').classList.add('hidden');
    setTimeout(() => document.getElementById('msgSucces').classList.add('hidden'), 3000);
  }}
  function afficherErreur(msg) {{
    document.getElementById('texteErreur').textContent = msg;
    document.getElementById('msgErreur').classList.remove('hidden');
    document.getElementById('msgSucces').classList.add('hidden');
    setTimeout(() => document.getElementById('msgErreur').classList.add('hidden'), 3000);
  }}
  chargerProfil();
</script>
</body>
</html>"""

# Write the files
files = [
    (os.path.join(BASE, "admin", "profil.html"), admin_profil),
    (os.path.join(BASE, "chef", "dashboard.html"), chef_dashboard),
    (os.path.join(BASE, "chef", "profil.html"), chef_profil),
]

for path, content in files:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {path} ({len(content)} chars)")

print("Done!")
