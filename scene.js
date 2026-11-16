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
const FOND_FINAL = 'img/fond1.webp';

// Réglages (tu peux les ajuster)
const REGLAGES_SCENE = {
  echelleSuivant: 0.668,   // taille de la scène suivante vue au fond (exemple 3)
  echelleFond: 0.64,       // taille de la chambre finale vue au fond (exemple 7)
  bandeVisible: 62,        // largeur de porte qui reste visible après glissement (pixels de l'image)
  traversee: 3.6,          // de combien l'encadrement grossit quand on passe à travers (plus grand = sort plus vite de l'écran)
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
      : `<img class="sc-fond" src="${FOND_FINAL}" alt=""><div class="sc-butin"></div>`;
    derriere = `<div class="sc-derriere" style="left:${r.x}px;top:${r.y}px;width:${SCENE_W}px;height:${SCENE_H}px;transform:scale(${r.s})">${contenu}</div>`;
  }
  return `<div class="sc-niveau" data-niveau="${niveau}">${derriere}${_htmlPorte(niveau, actif)}<img class="sc-cadre" src="${n.cadre}" alt=""></div>`;
}

const Scene = {
  niveau: 0,
  init() {
    [...NIVEAUX_SCENE.flatMap((n) => [n.cadre, n.porte]), FOND_FINAL].forEach((s) => { const i = new Image(); i.src = s; });
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
    el.style.transform = `translate(${x}px, ${(vh - SCENE_H * c) / 2}px) scale(${c})`;
  },
  afficher(niveau) {
    this.niveau = niveau;
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
    // On traverse l'encadrement : il grossit autour du centre de l'ouverture et sort par les bords
    const t = NIVEAUX_SCENE[this.niveau].trou, hx = t.x + t.w / 2, hy = t.y + t.h / 2, S = REGLAGES_SCENE.traversee;
    const cadre = cam.querySelector(':scope > .sc-niveau > .sc-cadre'), p = this.porte(), rp = _rectPorte(this.niveau);
    const dx = (t.x + REGLAGES_SCENE.bandeVisible) - (rp.x + rp.w);
    cam.classList.add('avance');
    if (cadre) cadre.style.transform = `translate(${hx}px, ${hy}px) scale(${S}) translate(${-hx}px, ${-hy}px)`;
    if (p) p.style.transform = `translate(${hx - rp.x}px, ${hy - rp.y}px) scale(${S}) translate(${rp.x - hx}px, ${rp.y - hy}px) translateX(${dx}px)`;
    cam.style.transform = `translate(${-r.x * k}px, ${-r.y * k}px) scale(${k})`;
    return new Promise((ok) => setTimeout(() => {
      if (this.niveau < 2) this.afficher(this.niveau + 1);
      ok();
    }, 2600));
  },
  // Le butin se pose sur les étagères de la chambre finale
  butin() {
    const b = document.querySelector('.sc-butin'); if (!b) return;
    const piles = [[150, 548], [310, 548], [150, 662], [310, 662], [2070, 548], [2230, 548], [2070, 662], [2230, 662]];
    b.innerHTML = piles.map(([x, y], i) => `<div class="lingots" style="left:${x}px;top:${y}px;animation-delay:${0.3 + i * 0.25}s"></div>`).join('');
  }
};
