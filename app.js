// ===== Mon site d'histoires — code simple, à moi de le faire évoluer =====
// Les histoires vivent dans le navigateur (localStorage).
// Pour les publier en ligne : Exporter (.json), puis importer le fichier
// dans la copie du site hébergée (voir README.md).
//
// Mon format : des récits de vie complets (ex. ma première relation,
// ma première année à la fac), écrits en PARTIES. Le lecteur lit une
// partie, puis clique sur la flèche « Lire la suite » — pas de défilement.

const CLE = "mes-histoires-v1";
let histoires = JSON.parse(localStorage.getItem(CLE) || "[]");
let enCours = null; // histoire en train d'être éditée

// Migration : les anciens formats (chapitres, ou texte d'un seul bloc)
// deviennent des parties.
let aMigre = false;
histoires.forEach(h => {
  if (!Array.isArray(h.parties)) {
    if (Array.isArray(h.chapitres)) {
      h.parties = h.chapitres.map(c => ({ texte: c.texte || "", image: c.image || "" }));
      delete h.chapitres;
    } else if (h.texte) {
      h.parties = [{ texte: h.texte, image: h.imageTexte || "" }];
    } else {
      h.parties = [{ texte: "", image: "" }];
    }
    delete h.texte; delete h.imageTexte; aMigre = true;
  }
  if (!h.parties.length) { h.parties = [{ texte: "", image: "" }]; aMigre = true; }
});
if (aMigre) localStorage.setItem(CLE, JSON.stringify(histoires));

function sauver() { localStorage.setItem(CLE, JSON.stringify(histoires)); }
function nouvelId() { return Date.now().toString(36); }
function echapper(t) { const d = document.createElement("div"); d.textContent = t || ""; return d.innerHTML; }

// ---------- Vue lecture ----------
function afficherBibliotheque() {
  const zone = document.getElementById("liste-histoires");
  const publiees = histoires.filter(h => h.publie);
  document.getElementById("bibliotheque-vide").hidden = publiees.length > 0;
  zone.innerHTML = publiees.map(h => `
    <article class="carte">
      ${h.couverture ? `<img src="${h.couverture}" alt="">` : ""}
      <div class="corps">${h.categorie ? `<span class="badge">${echapper(h.categorie)}</span>` : ""}<h3>${echapper(h.titre)}</h3><p>${echapper(h.resume || "")}</p>
      <button onclick="lireHistoire('${h.id}')">Lire l'histoire</button></div>
    </article>`).join("");
}

// Lecture partie par partie, avec les flèches
let lecture = null; // { histoire, index }
window.lireHistoire = function(id) {
  const h = histoires.find(x => x.id === id); if (!h) return;
  lecture = { histoire: h, index: 0 };
  document.getElementById("lecture-histoire").hidden = false;
  document.getElementById("lecture-titre").textContent = h.titre;
  document.getElementById("lecture-resume").textContent = h.resume || "";
  const img = document.getElementById("lecture-couverture");
  img.src = h.couverture || ""; img.hidden = !h.couverture;
  afficherPartie();
  document.getElementById("lecture-histoire").scrollIntoView({ behavior: "smooth" });
};
function afficherPartie() {
  if (!lecture) return;
  const parties = lecture.histoire.parties;
  const p = parties[lecture.index];
  const paragraphes = (p.texte || "").split(/\n+/).filter(t => t.trim())
    .map(t => `<p>${echapper(t)}</p>`).join("");
  document.getElementById("lecture-chapitres").innerHTML = `
    <div class="chapitre"><h3>Partie ${lecture.index + 1}</h3>
    ${p.image ? `<img src="${p.image}" alt="">` : ""}${paragraphes}</div>`;
  document.getElementById("compteur-partie").textContent = `Partie ${lecture.index + 1} sur ${parties.length}`;
  document.getElementById("btn-partie-prec").disabled = lecture.index === 0;
  document.getElementById("btn-partie-suiv").disabled = lecture.index >= parties.length - 1;
  document.getElementById("fin-recit").hidden = lecture.index < parties.length - 1;
}
document.getElementById("btn-partie-prec").onclick = () => {
  if (lecture && lecture.index > 0) { lecture.index--; afficherPartie(); document.getElementById("lecture-titre").scrollIntoView({ behavior: "smooth" }); }
};
document.getElementById("btn-partie-suiv").onclick = () => {
  if (lecture && lecture.index < lecture.histoire.parties.length - 1) { lecture.index++; afficherPartie(); document.getElementById("lecture-titre").scrollIntoView({ behavior: "smooth" }); }
};

// ---------- Vue écriture ----------
function afficherBrouillons() {
  document.getElementById("liste-brouillons").innerHTML = histoires.map(h =>
    `<p>• ${echapper(h.titre)} ${h.publie ? "(publiée)" : "(brouillon)"} <button onclick="editer('${h.id}')">Écrire / modifier</button></p>`).join("");
}
window.editer = function(id) {
  enCours = histoires.find(x => x.id === id); if (!enCours) return;
  document.getElementById("form-histoire").hidden = false;
  document.getElementById("champ-titre").value = enCours.titre;
  document.getElementById("champ-resume").value = enCours.resume || "";
  document.getElementById("champ-categorie").value = enCours.categorie || "Vie";
  document.getElementById("champ-couverture-lien").value = enCours.couverture && !enCours.couverture.startsWith("data:") ? enCours.couverture : "";
  document.getElementById("apercu-couverture").src = enCours.couverture || "";
  document.getElementById("champ-publie").checked = !!enCours.publie;
  afficherParties();
};
function afficherParties() {
  const zone = document.getElementById("liste-parties");
  zone.innerHTML = "";
  enCours.parties.forEach((p, i) => {
    const bloc = document.createElement("div");
    bloc.innerHTML = `<label>Partie ${i + 1} — texte (le correcteur vérifie pendant que tu écris)
      <textarea data-p="texte" data-i="${i}" rows="10" lang="fr" spellcheck="true" placeholder="Écris cette partie de ton récit...">${echapper(p.texte)}</textarea></label>
      <label>Image de cette partie (lien, facultatif) <input data-p="image" data-i="${i}" value="${echapper(p.image || "")}" placeholder="https://..."></label>
      ${enCours.parties.length > 1 ? `<button type="button" onclick="supprimerPartie(${i})">Supprimer cette partie</button>` : ""}`;
    zone.appendChild(bloc);
  });
  zone.querySelectorAll("textarea").forEach(t => t.addEventListener("input", () => { majPartie(t); verifierTexte(t.value, t); }));
  zone.querySelectorAll("input").forEach(t => t.addEventListener("input", () => majPartie(t)));
}
function majPartie(el) { if (enCours) enCours.parties[+el.dataset.i][el.dataset.p] = el.value; }
window.supprimerPartie = function(i) {
  if (!enCours || enCours.parties.length <= 1) return;
  enCours.parties.splice(i, 1); afficherParties();
};

// ---------- Correcteur français (LanguageTool, gratuit) pendant la saisie ----------
let minuteur = null, dernieresFautes = [], zoneActive = null;
function verifierTexte(texte, zone) {
  zoneActive = zone;
  clearTimeout(minuteur);
  if (!texte.trim()) { document.getElementById("suggestions").innerHTML = ""; return; }
  minuteur = setTimeout(async () => {
    try {
      const corps = new URLSearchParams({ text: texte, language: "fr" });
      const rep = await fetch("https://api.languagetool.org/v2/check", { method: "POST", body: corps });
      const data = await rep.json();
      dernieresFautes = data.matches || [];
      afficherSuggestions(dernieresFautes, texte);
    } catch { document.getElementById("message-correcteur").textContent = "Correcteur injoignable (pas de connexion ?). Ton texte reste enregistré."; }
  }, 1200); // on attend une petite pause de frappe avant de vérifier
}
function afficherSuggestions(fautes, texte) {
  const zone = document.getElementById("suggestions");
  document.getElementById("message-correcteur").textContent = fautes.length ? fautes.length + " faute(s) possible(s) :" : "Aucune faute détectée. ✓";
  zone.innerHTML = fautes.map((f, i) => {
    const mot = texte.substr(f.offset, f.length);
    const choix = (f.replacements || []).slice(0, 3).map(r => `<button onclick="corriger(${i}, '${r.value.replace(/'/g, "\\'")}')">${echapper(r.value)}</button>`).join(" ");
    return `<div class="suggestion">« ${echapper(mot)} » — ${echapper(f.message)} ${choix}</div>`;
  }).join("");
}
window.corriger = function(i, valeur) {
  const f = dernieresFautes[i]; if (!f || !zoneActive) return;
  zoneActive.value = zoneActive.value.substr(0, f.offset) + valeur + zoneActive.value.substr(f.offset + f.length);
  majPartie(zoneActive); verifierTexte(zoneActive.value, zoneActive);
};

// ---------- Actions principales ----------
document.getElementById("btn-bibliotheque").onclick = () => basculer(false);
document.getElementById("btn-ecriture").onclick = () => basculer(true);
function basculer(ecriture) {
  document.getElementById("vue-lecture").hidden = ecriture;
  document.getElementById("vue-ecriture").hidden = !ecriture;
  document.getElementById("btn-bibliotheque").classList.toggle("nav-actif", !ecriture);
  document.getElementById("btn-ecriture").classList.toggle("nav-actif", ecriture);
}
document.getElementById("btn-retour").onclick = () => { document.getElementById("lecture-histoire").hidden = true; };
document.getElementById("btn-nouvelle").onclick = () => {
  enCours = { id: nouvelId(), titre: "Nouvelle histoire", resume: "", categorie: "Vie", couverture: "", publie: false, parties: [{ texte: "", image: "" }] };
  histoires.push(enCours); sauver(); afficherBrouillons(); window.editer(enCours.id);
};
document.getElementById("btn-partie").onclick = () => {
  if (!enCours) return;
  enCours.parties.push({ texte: "", image: "" }); afficherParties();
};
document.getElementById("champ-couverture-fichier").onchange = e => lireImage(e.target.files[0], url => { enCours.couverture = url; document.getElementById("apercu-couverture").src = url; });
document.getElementById("champ-couverture-lien").oninput = e => { enCours.couverture = e.target.value; document.getElementById("apercu-couverture").src = e.target.value; };
function lireImage(fichier, fini) { if (!fichier) return; const l = new FileReader(); l.onload = () => fini(l.result); l.readAsDataURL(fichier); }
document.getElementById("form-histoire").onsubmit = e => {
  e.preventDefault(); if (!enCours) return;
  enCours.titre = document.getElementById("champ-titre").value;
  enCours.resume = document.getElementById("champ-resume").value;
  enCours.categorie = document.getElementById("champ-categorie").value;
  enCours.publie = document.getElementById("champ-publie").checked;
  sauver(); afficherBibliotheque(); afficherBrouillons();
  alert("Histoire enregistrée ✓");
};
document.getElementById("btn-supprimer").onclick = () => {
  if (!enCours || !confirm("Supprimer cette histoire ?")) return;
  histoires = histoires.filter(h => h.id !== enCours.id); sauver();
  document.getElementById("form-histoire").hidden = true; afficherBibliotheque(); afficherBrouillons();
};
document.getElementById("btn-exporter").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(histoires, null, 2)], { type: "application/json" }));
  a.download = "mes-histoires.json"; a.click();
};
document.getElementById("fichier-import").onchange = e => {
  const l = new FileReader();
  l.onload = () => { try { histoires = JSON.parse(l.result); sauver(); afficherBibliotheque(); afficherBrouillons(); } catch { alert("Fichier non valide."); } };
  l.readAsText(e.target.files[0]);
};

afficherBibliotheque(); afficherBrouillons();
