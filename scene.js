/* =========================================================
   BREAK PROTOCOL — SCÈNE (tes illustrations)
   ---------------------------------------------------------
   Les images sont dans le dossier img/ :
     cuivre1 / argent1 / or1 = le décor + l'encadrement (trou transparent)
                               (porte 1 bleue, porte 2 verte, porte 3 or)
     cuivre2 / argent2 / or2 = la porte
     fond1 à fond6 = les salles fortes finales (une au hasard)
   Toutes les positions sont en pixels de l'image (1783 × 882).
   ========================================================= */

const SCENE_W = 1783, SCENE_H = 882;

// Chaque niveau : décor + encadrement (trou transparent), porte, et réglages de la porte
//   volant : centre et rayon de la roue (en % de la largeur/hauteur de la porte) — la partie qui tourne,
//            coupée pile dans le cercle sombre qui entoure l'anneau intérieur (mesuré sur chaque image)
//   plaque : rectangle de la plaque des verrous sur la porte (en %)
const NIVEAUX_SCENE = [
  { cadre: 'img/cuivre1.webp', porte: 'img/cuivre2.webp', trou: { x: 836, y: 151, w: 682, h: 567 }, porteRatio: 684 / 569,
    volant: { x: 51.26, y: 49.45, r: 24.4 }, plaque: { x: 83.5, y: 36, w: 14, h: 26 } },
  { cadre: 'img/argent1.webp', porte: 'img/argent2.webp', trou: { x: 845, y: 158, w: 665, h: 565 }, porteRatio: 667 / 567,
    volant: { x: 51.85, y: 48.76, r: 24.0 }, plaque: { x: 83.5, y: 36, w: 14, h: 26 } },
  { cadre: 'img/or1.webp',     porte: 'img/or2.webp',     trou: { x: 834, y: 146, w: 687, h: 569 }, porteRatio: 689 / 571,
    volant: { x: 51.08, y: 50.48, r: 24.2 }, plaque: { x: 83, y: 37, w: 14, h: 24 } }
];
// Les deux écrans du décor (en pixels de l'image) : textes + alarme dans le grand, symboles dans le petit
const ECRANS = {
  grand: { x: 84, y: 280, w: 568, h: 336 },
  petit: { x: 1586, y: 312, w: 156, h: 104 }
};
const CENTRE_PORTE = 1177;
// Aperçu caméra : collé dans le coin bas gauche de la vitre du grand écran, mesuré sur chaque décor (pixels de l'image)
// g = bord intérieur gauche du cadre, b = bord intérieur bas, c = taille du coin coupé (45°) ; droite et haut communs
const CAMERA_ECRAN = [{ g: 59, b: 650, c: 35 }, { g: 75, b: 655, c: 33 }, { g: 57, b: 658, c: 37 }];
const CAMERA_DROITE = 243, CAMERA_HAUT = 508;   // milieu de l'encadrement de porte dans les images

// Les salles fortes finales : une est tirée au hasard à chaque partie,
// jamais la même que la partie précédente. Ajoute ou retire des noms ici.
// (Si un fichier .webp n'existe pas, l'app essaie le même nom en .png puis en .jpg.)
const FONDS_FINAUX = ['img/fond1', 'img/fond2', 'img/fond3', 'img/fond4', 'img/fond5', 'img/fond6'];
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
  echelleSuivant: 0.648,   // taille de la scène suivante vue au fond
  echelleFond: 0.648,      // taille de la chambre finale vue au fond (exemple 7)
  bandeVisible: 62,        // largeur de porte qui reste visible après glissement (pixels de l'image)
  traversee: 4,            // de combien l'écran d'avant grossit en plus pendant le zoom (plus grand = il sort plus vite)
  sortiePorte: 1.1,
  dureeZoom: 1.4,          // durée du zoom caméra vers l'écran suivant (secondes) — avant : 2,5
  dureeAllumage: 1.4,      // durée du clignotement des néons quand la lumière s'allume (secondes)        // quand la caméra avance, la porte glisse encore vers la gauche (en largeurs de porte)
};

// Où se place la scène suivante (ou la chambre finale) au fond de l'ouverture
function _rectSuivant(niveau) {
  const t = NIVEAUX_SCENE[niveau].trou;
  const s = niveau < 2 ? REGLAGES_SCENE.echelleSuivant : REGLAGES_SCENE.echelleFond;
  const centreX = niveau < 2 ? CENTRE_PORTE : SCENE_W / 2;          // centre de l'encadrement (ou du fond) dans son image
  return { s, x: t.x + t.w / 2 - centreX * s, y: t.y + t.h - SCENE_H * s };
}

// Où se place la porte fermée (elle recouvre l'ouverture, ses bords passent sous l'encadrement)
function _rectPorte(niveau) {
  const n = NIVEAUX_SCENE[niveau], t = n.trou;
  const w = t.w * 1.016, h = w / n.porteRatio;
  return { x: t.x + t.w / 2 - w / 2, y: t.y + t.h / 2 - h / 2, w, h };
}

function _htmlPorte(niveau, actif) {
  const p = _rectPorte(niveau), R = NIVEAUX_SCENE[niveau], src = R.porte;
  const rv = p.w * R.volant.r / 100, cx = p.w * R.volant.x / 100, cy = p.h * R.volant.y / 100;
  const pilules = [0, 1, 2, 3].map((i) => `<span class="verrou" data-i="${i}"></span>`).join('');
  return `<div class="sc-porte" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">
      <img src="${src}" alt="">
      <div class="sc-volant" style="left:${cx - rv}px;top:${cy - rv}px;width:${rv * 2}px;height:${rv * 2}px;
           background-image:url(${src});background-size:${p.w}px ${p.h}px;background-position:${-(cx - rv)}px ${-(cy - rv)}px"></div>
      <div class="sc-plaque" style="left:${R.plaque.x}%;top:${R.plaque.y}%;width:${R.plaque.w}%;height:${R.plaque.h}%">${pilules}</div>
    </div>`;
}

// Un niveau complet : (ce qu'il y a derrière) + porte + encadrement
function _htmlNiveau(niveau, actif) {
  const n = NIVEAUX_SCENE[niveau];
  let derriere = '';
  if (actif) {
    const r = _rectSuivant(niveau);
    const image = niveau < 2 ? NIVEAUX_SCENE[niveau + 1].cadre : FOND_FINAL;
    const contenu = niveau < 2 ? _htmlNiveau(niveau + 1, false)
      : `<img class="sc-fond" src="${FOND_FINAL}" alt="" onerror="secoursFond(this)">`;
    // Prolongement flou de l'image tout autour : pas de bord noir pendant le zoom
    // Prolongement de l'image tout autour, en miroir (pas de flou, pas de teinte) : on ne voit pas ses bords pendant le zoom
    let prolongement = '';
    for (const dy of [-1, 0, 1]) for (const dx of [-1, 0, 1]) {
      if (!dx && !dy) continue;
      prolongement += `<img class="sc-prolonge" src="${image}" alt="" ${niveau < 2 ? '' : 'onerror="secoursFond(this)"'}
        style="left:${dx * 100}%;top:${dy * 100}%;transform:scale(${dx ? -1 : 1}, ${dy ? -1 : 1})">`;
    }
    derriere = `<div class="sc-derriere" style="left:${r.x}px;top:${r.y}px;width:${SCENE_W}px;height:${SCENE_H}px;transform:scale(${r.s})">${prolongement}${contenu}</div>`;
  }
  return `<div class="sc-niveau" data-niveau="${niveau}">${derriere}${_htmlPorte(niveau, actif)}<img class="sc-cadre" src="${n.cadre}" alt=""></div>`;
}

// Bande noire du côté de la caméra (encoche / Dynamic Island) : on y met rien, le décor commence après.
// Sa largeur = la zone que le téléphone réserve à la caméra. Sur ordinateur : pas de bande.
// BANDE_SECOURS : largeur utilisée si le téléphone ne donne pas la taille de sa caméra (0 = pas de bande)
const BANDE_SECOURS = 0;
function majBande() {
  let sonde = document.getElementById('sonde-encoche');
  if (!sonde) {
    sonde = document.createElement('div'); sonde.id = 'sonde-encoche';
    sonde.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)';
    document.body.appendChild(sonde);
  }
  const cs = getComputedStyle(sonde);
  let largeur = Math.max(parseFloat(cs.paddingLeft) || 0, parseFloat(cs.paddingRight) || 0);
  const paysage = window.innerWidth > window.innerHeight;
  const tactile = matchMedia('(pointer: coarse)').matches;
  if (!largeur && tactile) largeur = BANDE_SECOURS;
  if (!paysage || !tactile) largeur = 0;
  // De quel côté est la caméra ? Téléphone tourné vers la gauche (angle 90) : caméra à gauche ; vers la droite (270) : à droite
  let angle = screen.orientation ? screen.orientation.angle : (window.orientation || 0);
  if (angle < 0) angle += 360;
  const b = angle === 270 ? { g: 0, d: largeur } : { g: largeur, d: 0 };
  const st = document.documentElement.style;
  st.setProperty('--bande-g', b.g + 'px'); st.setProperty('--bande-d', b.d + 'px');
  return b;
}

const Scene = {
  niveau: 0,
  init() {
    document.documentElement.style.setProperty('--zoom', REGLAGES_SCENE.dureeZoom + 's');
    [...NIVEAUX_SCENE.flatMap((n) => [n.cadre, n.porte])].forEach((s) => { const i = new Image(); i.src = s; });
    this.cadrer(); window.addEventListener('resize', () => this.cadrer());
    window.addEventListener('orientationchange', () => setTimeout(() => this.cadrer(), 300));
    if (screen.orientation) screen.orientation.addEventListener?.('change', () => setTimeout(() => this.cadrer(), 300));
    this.afficher(0);
  },
  // Adapte l'image à l'écran : elle le remplit (on rogne au plus 8 %), sinon un flou complète les bords
  cadrer() {
    const b = majBande();                        // bande noire du côté de la caméra du téléphone
    const vw = window.innerWidth - b.g - b.d, vh = window.innerHeight;
    // On garde toujours visibles les deux écrans (de x 50 à 1772) et presque toute la hauteur
    const c = Math.min(Math.max(vw / SCENE_W, vh / SCENE_H), vw / 1722, vh / 800);
    let x = vw / 2 - 911 * c;
    if (SCENE_W * c >= vw) x = Math.min(0, Math.max(vw - SCENE_W * c, x)); else x = (vw - SCENE_W * c) / 2;
    x += b.g;
    const y = (vh - SCENE_H * c) / 2;
    this.vue = { x, y, c, vw, vh };
    document.getElementById('sc-cadrage').style.transform = `translate(${x}px, ${y}px) scale(${c})`;
    // Position des deux écrans du décor, pour l'interface (variables CSS en pixels)
    const st = document.documentElement.style;
    for (const [nom, e] of Object.entries(ECRANS)) {
      st.setProperty(`--${nom}-x`, (x + e.x * c).toFixed(1) + 'px');
      st.setProperty(`--${nom}-y`, (y + e.y * c).toFixed(1) + 'px');
      st.setProperty(`--${nom}-w`, (e.w * c).toFixed(1) + 'px');
      st.setProperty(`--${nom}-h`, (e.h * c).toFixed(1) + 'px');
    }
    st.setProperty('--u', (ECRANS.grand.h * c / 100).toFixed(3) + 'px');      // 1 unité = 1 % de la hauteur du grand écran
    st.setProperty('--colonne', (x + 700 * c).toFixed(1) + 'px');           // bord droit du grand écran
    this.majCamera();
    this.centrePorte = x + CENTRE_PORTE * c;                                 // centre du coffre à l'écran (le cyber-dog s'y arrête)
  },
  majCamera() {
    if (!this.vue) return;
    const { x, y, c } = this.vue, k = CAMERA_ECRAN[Math.min(2, this.niveau || 0)], st = document.documentElement.style;
    st.setProperty('--cam-x', (x + k.g * c).toFixed(1) + 'px');
    st.setProperty('--cam-y', (y + CAMERA_HAUT * c).toFixed(1) + 'px');
    st.setProperty('--cam-w', ((CAMERA_DROITE - k.g) * c).toFixed(1) + 'px');
    st.setProperty('--cam-h', ((k.b - CAMERA_HAUT) * c).toFixed(1) + 'px');
    st.setProperty('--cam-c', (k.c * c).toFixed(1) + 'px');
  },
  afficher(niveau) {
    this.niveau = niveau;
    this.majCamera();
    document.body.dataset.niveau = niveau;                                   // couleur des écrans (bleu, vert, or)
    document.getElementById('sc-stage').style.setProperty('--fond-flou', `url(${NIVEAUX_SCENE[niveau].cadre})`);
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
    // Point de départ du grossissement (même forme que l'arrivée, sinon le navigateur l'interpole de travers)
    const _c = cam.querySelector(':scope > .sc-niveau > .sc-cadre'), _t = NIVEAUX_SCENE[this.niveau].trou;
    if (_c) { _c.style.transform = `translate(${_t.x + _t.w / 2}px, ${_t.y + _t.h / 2}px) scale(1) translate(${-(_t.x + _t.w / 2)}px, ${-(_t.y + _t.h / 2)}px)`; _c.style.transformOrigin = '0 0'; void _c.offsetWidth; }
    cam.classList.add('avance');                       // l'encadrement et la porte de devant s'effacent pendant l'avancée
    // L'ancienne porte file rapidement vers la gauche, hors de l'ouverture, avant le fondu
    const p = this.porte(), rp = _rectPorte(this.niveau), t = NIVEAUX_SCENE[this.niveau].trou;
    if (p) p.style.transform = `translateX(${(t.x + REGLAGES_SCENE.bandeVisible) - (rp.x + rp.w) - rp.w * REGLAGES_SCENE.sortiePorte}px)`;
    // L'écran d'avant continue de grossir autour de l'ouverture, jusqu'à sortir de l'écran
    const cadre = cam.querySelector(':scope > .sc-niveau > .sc-cadre'), hx = t.x + t.w / 2, hy = t.y + t.h / 2, S = REGLAGES_SCENE.traversee;
    if (cadre) cadre.style.transform = `translate(${hx}px, ${hy}px) scale(${S}) translate(${-hx}px, ${-hy}px)`;
    cam.style.transform = `translate(${-r.x * k}px, ${-r.y * k}px) scale(${k})`;
    return new Promise((ok) => setTimeout(() => {
      if (this.niveau < 2) {
        this.afficher(this.niveau + 1);
        document.querySelector('#sc-camera > .sc-niveau')?.classList.add('neon');     // la lumière s'allume
      } else {
        document.querySelector('#sc-camera .sc-derriere')?.classList.add('neon');     // la salle forte s'allume
      }
      if (this.onAllumage) this.onAllumage();
      setTimeout(ok, REGLAGES_SCENE.dureeAllumage * 1000);
    }, REGLAGES_SCENE.dureeZoom * 1000 + 100));
  }
};
