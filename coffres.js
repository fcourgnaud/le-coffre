/* =========================================================
   LE CASSE DU SIÈCLE — DESSINS DES COFFRES
   ---------------------------------------------------------
   Chaque coffre est dessiné en SVG (grille de 300 × 300 pour
   la porte, avec 40 de marge autour pour les barres).
   Les couleurs viennent de theme.css (variables --metal-…).
   Classes utiles pour le style :
     .barre      une barre de verrouillage (4 par coffre)
     .voyant     le voyant lié à chaque barre
     .molette    la molette centrale (elle tourne)
     .rivet, .laiton, .acier, .gravure
   ========================================================= */

let compteurCoffre = 0;

// Petits outils de dessin
const _cercle = (cx, cy, r, cls, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" class="${cls}" ${extra}/>`;
const _rivets = (cx, cy, r, n, taille) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2;
  return _cercle((cx + Math.cos(a) * r).toFixed(1), (cy + Math.sin(a) * r).toFixed(1), taille, 'rivet');
}).join('');
const _graduations = (cx, cy, r1, r2, n) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2, long = i % 5 === 0 ? 7 : 0;
  return `<line x1="${(cx + Math.cos(a) * (r1 - long)).toFixed(1)}" y1="${(cy + Math.sin(a) * (r1 - long)).toFixed(1)}" x2="${(cx + Math.cos(a) * r2).toFixed(1)}" y2="${(cy + Math.sin(a) * r2).toFixed(1)}" class="gravure"/>`;
}).join('');

// Molette (cadran à combinaison) : anneau gradué fixe + bouton qui tourne
function _molette(u, r) {
  return `<circle cx="150" cy="150" r="${r + 16}" fill="url(#${u}-sombre)" class="contour"/>
    ${_graduations(150, 150, r + 12, r + 4, 60)}
    <g class="molette">
      <circle cx="150" cy="150" r="${r}" fill="url(#${u}-laiton)" class="contour"/>
      ${_graduations(150, 150, r - 2, r - 8, 30)}
      <circle cx="150" cy="150" r="${r * 0.45}" fill="url(#${u}-sombre)"/>
      <rect x="147" y="${150 - r + 4}" width="6" height="${r * 0.5}" rx="3" class="aiguille"/>
    </g>`;
}

// Volant à rayons (coffres 2 et 3)
function _volant(u, r, n) {
  let s = `<circle cx="150" cy="150" r="${r}" fill="none" class="volant" stroke-width="10"/>`;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = 150 + Math.cos(a) * (r + 14), y = 150 + Math.sin(a) * (r + 14);
    s += `<line x1="150" y1="150" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="volant" stroke-width="9" stroke-linecap="round"/>`;
    s += _cercle(x.toFixed(1), y.toFixed(1), 11, 'contour', `fill="url(#${u}-laiton)"`);
  }
  return `<g class="volant-g">${s}</g>`;
}

// Une barre de verrouillage. sens = 'droite' | 'gauche' | 'haut' | 'bas'
function _barre(i, sens, pos, u, epaisseur = 20) {
  const L = 90, e = epaisseur;
  let x, y, w, h;
  if (sens === 'droite') { x = 300 - L + 34; y = pos - e / 2; w = L; h = e; }
  if (sens === 'gauche') { x = -34; y = pos - e / 2; w = L; h = e; }
  if (sens === 'haut')   { x = pos - e / 2; y = -34; w = e; h = L; }
  if (sens === 'bas')    { x = pos - e / 2; y = 300 - L + 34; w = e; h = L; }
  return `<g class="barre b-${sens}" data-i="${i}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${e / 2}" fill="url(#${u}-acier${sens === 'haut' || sens === 'bas' ? 'v' : ''})" class="contour"/>
  </g>`;
}

function _defs(u) {
  return `<defs>
    <linearGradient id="${u}-porte" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style="stop-color:var(--metal-clair)"/><stop offset=".55" style="stop-color:var(--metal)"/><stop offset="1" style="stop-color:var(--metal-fonce)"/>
    </linearGradient>
    <radialGradient id="${u}-laiton" cx=".35" cy=".3" r=".9">
      <stop offset="0" style="stop-color:var(--laiton-clair)"/><stop offset=".6" style="stop-color:var(--laiton)"/><stop offset="1" style="stop-color:var(--laiton-fonce)"/>
    </radialGradient>
    <radialGradient id="${u}-sombre" cx=".5" cy=".4" r=".7">
      <stop offset="0" style="stop-color:var(--metal)"/><stop offset="1" style="stop-color:var(--metal-noir)"/>
    </radialGradient>
    <linearGradient id="${u}-acier" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color:var(--acier-clair)"/><stop offset=".5" style="stop-color:var(--acier)"/><stop offset="1" style="stop-color:var(--metal-fonce)"/>
    </linearGradient>
    <linearGradient id="${u}-acierv" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" style="stop-color:var(--acier-clair)"/><stop offset=".5" style="stop-color:var(--acier)"/><stop offset="1" style="stop-color:var(--metal-fonce)"/>
    </linearGradient>
  </defs>`;
}

/* ---------- Coffre 1 : le coffre du directeur (simple) ---------- */
function _porte1(u) {
  const ys = [55, 115, 185, 245];
  return `
    ${ys.map((y, i) => _barre(i, 'droite', y, u)).join('')}
    <rect x="-16" y="45" width="24" height="60" rx="6" fill="url(#${u}-laiton)" class="contour"/>
    <rect x="-16" y="195" width="24" height="60" rx="6" fill="url(#${u}-laiton)" class="contour"/>
    <rect x="0" y="0" width="300" height="300" rx="10" fill="url(#${u}-porte)" class="contour"/>
    <rect x="22" y="22" width="256" height="256" rx="6" fill="none" class="gravure" stroke-width="3"/>
    ${ys.map((y, i) => _cercle(272, y, 6, 'voyant', `data-i="${i}"`)).join('')}
    ${_molette(u, 52)}
    <rect x="105" y="250" width="90" height="22" rx="3" fill="url(#${u}-laiton)" class="contour"/>
    <text x="150" y="266" class="plaque">N° 1</text>`;
}

/* ---------- Coffre 2 : la salle des archives (rivets, volant) ---------- */
function _porte2(u) {
  const rivetsCadre = [];
  for (let i = 0; i <= 10; i++) { const p = 18 + i * 26.4; rivetsCadre.push([p, 14], [p, 286], [14, p], [286, p]); }
  return `
    ${_barre(0, 'gauche', 85, u)}${_barre(1, 'droite', 85, u)}${_barre(2, 'gauche', 215, u)}${_barre(3, 'droite', 215, u)}
    <rect x="0" y="0" width="300" height="300" rx="26" fill="url(#${u}-porte)" class="contour"/>
    ${rivetsCadre.map(([x, y]) => _cercle(x, y, 3.2, 'rivet')).join('')}
    <rect x="28" y="28" width="244" height="244" rx="18" fill="none" class="gravure" stroke-width="4"/>
    <rect x="40" y="40" width="220" height="220" rx="12" fill="none" class="gravure" stroke-width="1.5"/>
    ${[[56, 85], [244, 85], [56, 215], [244, 215]].map(([x, y], i) => _cercle(x, y, 6, 'voyant', `data-i="${i}"`)).join('')}
    ${_volant(u, 74, 3)}
    ${_molette(u, 36)}
    <rect x="100" y="44" width="100" height="20" rx="3" fill="url(#${u}-laiton)" class="contour"/>
    <text x="150" y="59" class="plaque">ARCHIVES</text>`;
}

/* ---------- Coffre 3 : la chambre forte (ronde, engrenages, 4 barres radiales) ---------- */
function _porte3(u) {
  const dents = Array.from({ length: 56 }, (_, i) => {
    const a = (i / 56) * 360;
    return `<rect x="146" y="-6" width="8" height="12" rx="2" class="dent" transform="rotate(${a} 150 150)"/>`;
  }).join('');
  const leds = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return _cercle((150 + Math.cos(a) * 104).toFixed(1), (150 + Math.sin(a) * 104).toFixed(1), 2.6, 'led', `style="animation-delay:${(i * 0.12).toFixed(2)}s"`);
  }).join('');
  return `
    ${_barre(0, 'haut', 150, u, 24)}${_barre(1, 'droite', 150, u, 24)}${_barre(2, 'bas', 150, u, 24)}${_barre(3, 'gauche', 150, u, 24)}
    <g class="engrenage">${dents}</g>
    <circle cx="150" cy="150" r="150" fill="url(#${u}-porte)" class="contour"/>
    <circle cx="150" cy="150" r="138" fill="none" class="gravure" stroke-width="4"/>
    ${_rivets(150, 150, 128, 40, 3)}
    <circle cx="150" cy="150" r="116" fill="url(#${u}-sombre)" class="contour"/>
    ${leds}
    ${[[150, 30], [270, 150], [150, 270], [30, 150]].map(([x, y], i) => _cercle(x, y, 7, 'voyant', `data-i="${i}"`)).join('')}
    ${_volant(u, 70, 6)}
    ${_molette(u, 34)}
    <path d="M110 214 A70 70 0 0 0 190 214" fill="none" class="gravure" stroke-width="1.5"/>
    <text x="150" y="232" class="plaque plaque-gravee">CHAMBRE FORTE</text>`;
}

const PORTES = [_porte1, _porte2, _porte3];

/* Ce qu'on voit derrière la porte ouverte : le coffre suivant au loin, ou le butin */
function _derriere(niveau) {
  if (niveau < 2) return `<div class="loin">${dessinerCoffre(niveau + 1, { mini: true })}</div>`;
  return `<div class="butin">
    <svg viewBox="0 0 200 120">
      ${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].slice(0, 5 - r).map((c) => {
        const x = 20 + c * 34 + r * 17, y = 96 - r * 20;
        return `<path d="M${x} ${y} l6 -14 h22 l6 14 z" class="lingot"/>`;
      }).join('')).join('')}
    </svg></div>`;
}

/* Construit un coffre complet (cadre + intérieur + porte). niveau = 0, 1 ou 2 */
function dessinerCoffre(niveau, { mini = false } = {}) {
  const u = 'c' + (compteurCoffre++);
  return `<div class="coffre niveau-${niveau + 1}${mini ? ' mini' : ''}">
    <div class="cadre"></div>
    <div class="trou">${mini ? '' : _derriere(niveau)}</div>
    <div class="porte">
      <svg viewBox="-40 -40 380 380" class="porte-svg">${_defs(u)}${PORTES[niveau](u)}</svg>
      ${mini ? '' : '<div id="picto"></div>'}
    </div>
  </div>`;
}
