/* =========================================================
   LE CASSE DU SIÈCLE — SCÈNE (tes illustrations)
   ---------------------------------------------------------
   Les images sont dans le dossier img/ :
     cuivre1 / argent1 / or1 = le décor + l'encadrement (trou transparent)
     cuivre2 / argent2 / or2 = la porte
     fond1 = la chambre forte finale
   Toutes les positions sont en pixels de l'image (2378 × 1179).
   ========================================================= */

const SCENE_W = 2378, SCENE_H = 1179;

const NIVEAUX_SCENE = [
  { cadre: 'img/cuivre1.webp', porte: 'img/cuivre2.webp', trou: { x: 1109, y: 225, w: 944, h: 760 }, porteRatio: 947 / 793 },
  { cadre: 'img/argent1.webp', porte: 'img/argent2.webp', trou: { x: 1105, y: 227, w: 964, h: 765 }, porteRatio: 967 / 798 },
  { cadre: 'img/or1.webp',     porte: 'img/or2.webp',     trou: { x: 1099, y: 227, w: 962, h: 769 }, porteRatio: 966 / 801 }
];
// Les salles fortes finales : une est tirée au hasard à chaque partie,
// jamais la même que la partie précédente. Ajoute ou retire des noms ici.
// (Si un fichier .webp n'existe pas, l'app essaie le même nom en .png puis en .jpg.)
const FONDS_FINAUX = ['img/fond1', 'img/fond2', 'img/fond3', 'img/fond4', 'img/fond5', 'img/fond6', 'img/fond7'];
let FOND_FINAL = 'img/fond1.webp';

// Tire une salle forte différente de la dernière
function choisirFondFinal() {
  let dernier = -1;
  try { dernier = parseInt(localStorage.getItem('casse-dernier-fond'), 10); } catch (e) {}
  const choix = FONDS_FINAUX.map((_, i) => i).filter((i) => i !== dernier || FONDS_FINAUX.length === 1);
  const n = choix[Math.floor(Math.random() * choix.length)];
  try { localStorage.setItem('casse-dernier-fond', n); } catch (e) {}
  FOND_FINAL = FONDS_FINAUX[n] + '.webp';
  const pre = new Image(); pre.src = FOND_FINAL;
  return FOND_FINAL;
}
// Si l'image n'existe pas en .webp : on essaie .png, puis .jpg, puis la salle n° 1
function secoursFond(img) {
  const s = img.getAttribute('src');
  if (s.endsWith('.webp')) img.src = s.replace(/\.webp$/, '.png');
  else if (s.endsWith('.png')) img.src = s.replace(/\.png$/, '.jpg');
  else if (s !== 'img/fond1.webp') img.src = 'img/fond1.webp';
}

// Réglages (tu peux les ajuster)
const REGLAGES_SCENE = {
  echelleSuivant: 0.668,   // taille de la scène suivante vue au fond (exemple 3)
  echelleFond: 0.64,       // taille de la chambre finale vue au fond (exemple 7)
  bandeVisible: 62,        // largeur de porte qui reste visible après glissement (pixels de l'image)
  // Zone de la plaque des verrous sur la porte (en % de la porte, exemple 8)
  plaque: { x: 83.4, y: 33.6, w: 15.6, h: 32.9 },
  // Centre et rayon du volant (en % de la largeur de la porte) : la partie qui tourne
  volant: { x: 51.5, y: 50.2, r: 22.5 }
};

// Où se place la scène suivante (ou la chambre finale) au fond de l'ouverture
function _rectSuivant(niveau) {
  const t = NIVEAUX_SCENE[niveau].trou;
  const s = niveau < 2 ? REGLAGES_SCENE.echelleSuivant : REGLAGES_SCENE.echelleFond;
  const centreX = niveau < 2 ? 1585 : SCENE_W / 2;          // centre de l'encadrement (ou du fond) dans son image
  return { s, x: t.x + t.w / 2 - centreX * s, y: t.y + t.h - SCENE_H * s };
}

// Où se place la porte fermée (elle recouvre l'ouverture, ses bords passent sous l'encadrement)
function _rectPorte(niveau) {
  const n = NIVEAUX_SCENE[niveau], t = n.trou;
  const w = t.w * 1.016, h = w / n.porteRatio;
  return { x: t.x + t.w / 2 - w / 2, y: t.y + t.h / 2 - h / 2, w, h };
}

function _htmlPorte(niveau, actif) {
  const p = _rectPorte(niveau), R = REGLAGES_SCENE, src = NIVEAUX_SCENE[niveau].porte;
  const rv = p.w * R.volant.r / 100, cx = p.w * R.volant.x / 100, cy = p.h * R.volant.y / 100;
  const pilules = [0, 1, 2, 3].map((i) => `<span class="verrou" data-i="${i}"></span>`).join('');
  return `<div class="sc-porte" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">
      <img src="${src}" alt="">
      <div class="sc-volant" style="left:${cx - rv}px;top:${cy - rv}px;width:${rv * 2}px;height:${rv * 2}px;
           background-image:url(${src});background-size:${p.w}px ${p.h}px;background-position:${-(cx - rv)}px ${-(cy - rv)}px"></div>
      <div class="sc-plaque" style="left:${R.plaque.x}%;top:${R.plaque.y}%;width:${R.plaque.w}%;height:${R.plaque.h}%">${pilules}</div>
      ${actif ? `<div id="picto" style="left:${cx - rv * 0.42}px;top:${cy - rv * 0.42}px;width:${rv * 0.84}px;height:${rv * 0.84}px"></div>` : ''}
    </div>`;
}

// Un niveau complet : (ce qu'il y a derrière) + porte + encadrement
function _htmlNiveau(niveau, actif) {
  const n = NIVEAUX_SCENE[niveau];
  let derriere = '';
  if (actif) {
    const r = _rectSuivant(niveau);
    const contenu = niveau < 2 ? _htmlNiveau(niveau + 1, false)
      : `<img class="sc-fond" src="${FOND_FINAL}" alt="" onerror="secoursFond(this)">`;
    derriere = `<div class="sc-derriere" style="left:${r.x}px;top:${r.y}px;width:${SCENE_W}px;height:${SCENE_H}px;transform:scale(${r.s})">${contenu}</div>`;
  }
  return `<div class="sc-niveau" data-niveau="${niveau}">${derriere}${_htmlPorte(niveau, actif)}<img class="sc-cadre" src="${n.cadre}" alt=""></div>`;
}

const Scene = {
  niveau: 0,
  init() {
    [...NIVEAUX_SCENE.flatMap((n) => [n.cadre, n.porte])].forEach((s) => { const i = new Image(); i.src = s; });
    this.cadrer(); window.addEventListener('resize', () => this.cadrer());
    this.afficher(0);
  },
  // Adapte l'image à l'écran (elle le remplit) en gardant le coffre bien visible
  cadrer() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const c = Math.max(vw / SCENE_W, vh / SCENE_H);
    const largeur = SCENE_W * c;
    let x = (vw - largeur) / 2;
    if (largeur > vw) x = Math.min(0, Math.max(vw - largeur, vw * 0.62 - 1585 * c));   // garde le coffre à droite du centre
    const el = document.getElementById('sc-cadrage');
    const y = (vh - SCENE_H * c) / 2;
    this.vue = { x, y, c, vw, vh };
    el.style.transform = `translate(${x}px, ${y}px) scale(${c})`;
  },
  afficher(niveau) {
    this.niveau = niveau;
    document.querySelectorAll('#sc-cadrage > .sc-sticker').forEach((s) => s.remove());
    const cam = document.getElementById('sc-camera');
    cam.classList.add('sans-transition'); cam.classList.remove('avance'); cam.style.transform = '';
    cam.innerHTML = _htmlNiveau(niveau, true);
    void cam.offsetWidth; cam.classList.remove('sans-transition');
  },
  porte() { return document.querySelector('#sc-camera > .sc-niveau > .sc-porte'); },
  // Verrous : les n premiers sont débloqués (verts)
  verrous(n) { (this.porte()?.querySelectorAll('.verrou') || []).forEach((v) => v.classList.toggle('ouvert', +v.dataset.i < n)); },
  tourner() { const v = this.porte()?.querySelector('.sc-volant'); if (v) v.style.transform = `rotate(${Math.floor(Math.random() * 300) - 150}deg)`; },
  secouer() { const p = this.porte(); if (!p) return; p.classList.remove('secoue'); void p.offsetWidth; p.classList.add('secoue'); },
  // La porte glisse vers la gauche, pas jusqu'au bout (exemples 2 et 3)
  ouvrir() {
    const p = this.porte(), r = _rectPorte(this.niveau), t = NIVEAUX_SCENE[this.niveau].trou;
    const dx = (t.x + REGLAGES_SCENE.bandeVisible) - (r.x + r.w);
    p.style.transform = `translateX(${dx}px)`;
    return new Promise((ok) => setTimeout(ok, 1900));
  },
  // La caméra avance par la porte ouverte jusqu'à ce que la scène suivante remplisse l'écran
  avancer() {
    const r = _rectSuivant(this.niveau), k = 1 / r.s;
    const cam = document.getElementById('sc-camera');
    cam.classList.add('avance');                       // l'encadrement et la porte de devant s'effacent pendant l'avancée
    cam.style.transform = `translate(${-r.x * k}px, ${-r.y * k}px) scale(${k})`;
    return new Promise((ok) => setTimeout(() => {
      if (this.niveau < 2) this.afficher(this.niveau + 1);
      ok();
    }, 2600));
  },
  // Fin de partie : un sticker « YOU WIN » sort de la porte ouverte (on reste devant le coffre en or)
  sticker() {
    // Après le zoom final, le sticker se pose au milieu de l'écran
    const v = this.vue, w = Math.min(v.vw * 0.5, v.vh * 1.05) / v.c, h = w * 0.62;
    const cx = (v.vw * 0.56 - v.x) / v.c, cy = (v.vh * 0.5 - v.y) / v.c;
    const t = { x: cx - w / 2 / 0.92, y: cy - h / 2, w: w / 0.92, h };
    const niv = document.getElementById('sc-cadrage'); if (!niv) return;
    niv.querySelectorAll('.sc-sticker').forEach((s) => s.remove());
    const pts = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2, r = i % 2 ? 0.86 : 1;
      return `${(50 + Math.cos(a) * 49 * r).toFixed(2)},${(50 + Math.sin(a) * 49 * r).toFixed(2)}`;
    }).join(' ');
    niv.insertAdjacentHTML('beforeend', `<div class="sc-sticker" style="left:${cx - w / 2}px;top:${cy - h / 2}px;width:${w}px;height:${h}px">
      <svg viewBox="0 0 100 62" preserveAspectRatio="none">
        <defs><linearGradient id="st-or" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".45" stop-color="#f4c445"/><stop offset="1" stop-color="#c47a12"/></linearGradient></defs>
        <g transform="scale(1 .62)"><polygon points="${pts}" fill="#fff" stroke="#1a1208" stroke-width="1.2" stroke-linejoin="round"/>
        <polygon points="${pts}" fill="url(#st-or)" transform="translate(50 50) scale(.9) translate(-50 -50)"/></g>
      </svg>
      <div class="sc-sticker-texte"><span>YOU</span><span>WIN!</span></div>
    </div>`);
  },

  // Le butin se pose sur les étagères de la chambre finale
  butin() {
    const b = document.querySelector('.sc-butin'); if (!b) return;
    const piles = [[150, 548], [310, 548], [150, 662], [310, 662], [2070, 548], [2230, 548], [2070, 662], [2230, 662]];
    b.innerHTML = piles.map(([x, y], i) => `<div class="lingots" style="left:${x}px;top:${y}px;animation-delay:${0.3 + i * 0.25}s"></div>`).join('');
  }
};
