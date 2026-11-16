/* =========================================================
   LE CASSE DU SIÈCLE — DESSINS (coffres + décor)
   ---------------------------------------------------------
   Style : illustration en aplats, bleu-vert + orange.
   Chaque porte de coffre est dessinée sur une grille de
   300 × 300 (avec 40 de marge autour pour les barres).
   Toutes les couleurs viennent de theme.css (--teal-…,
   --orange-…, --mur-…, --sol-…).
   Classes utiles :
     .barre      une barre de verrouillage (4 par coffre)
     .voyant     le voyant lié à chaque barre
     .molette    la pièce qui tourne (molette ou volant)
   ========================================================= */

let compteurCoffre = 0;

const _c = (cx, cy, r, attrs = '') => `<circle cx="${(+cx).toFixed(1)}" cy="${(+cy).toFixed(1)}" r="${r}" ${attrs}/>`;
const _pol = (cx, cy, r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

// Rivet bombé (un disque + un reflet)
const _rivet = (u, x, y, r) => _c(x, y, r, `fill="url(#${u}-rivet)" stroke="var(--teal-nuit)" stroke-opacity=".35" stroke-width="1"`)
  + _c(x - r * 0.3, y - r * 0.3, r * 0.3, 'fill="#fff" opacity=".55"');

// Reflets de lumière en éventail (style illustration), découpés à la forme de la porte
function _reflets(u, clip) {
  const rayons = [[-0.95, -0.8], [-0.62, -0.5], [-0.3, -0.18]].map(([a1, a2]) => {
    const [x1, y1] = _pol(60, 40, 600, a1 - 0.6), [x2, y2] = _pol(60, 40, 600, a2 - 0.6);
    return `<path d="M60 40 L${x1.toFixed(0)} ${y1.toFixed(0)} L${x2.toFixed(0)} ${y2.toFixed(0)} Z" fill="#fff" opacity=".10"/>`;
  }).join('');
  return `<g clip-path="url(#${u}-${clip})">${rayons}${_c(70, 60, 90, `fill="url(#${u}-eclat)"`)}</g>`;
}

// Barre de verrouillage en acier. sens = 'droite' | 'gauche' | 'haut' | 'bas'
function _barre(u, i, sens, pos, e = 24) {
  const L = 92;
  let x, y, w, h;
  if (sens === 'droite') { x = 300 - L + 36; y = pos - e / 2; w = L; h = e; }
  if (sens === 'gauche') { x = -36; y = pos - e / 2; w = L; h = e; }
  if (sens === 'haut')   { x = pos - e / 2; y = -36; w = e; h = L; }
  if (sens === 'bas')    { x = pos - e / 2; y = 300 - L + 36; w = e; h = L; }
  const vert = sens === 'haut' || sens === 'bas';
  return `<g class="barre b-${sens}" data-i="${i}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${e * 0.3}" fill="url(#${u}-acier${vert ? 'v' : ''})"/>
    ${vert ? `<rect x="${x + e * 0.18}" y="${y}" width="${e * 0.18}" height="${h}" fill="#fff" opacity=".35"/>`
           : `<rect x="${x}" y="${y + e * 0.18}" width="${w}" height="${e * 0.18}" fill="#fff" opacity=".35"/>`}
  </g>`;
}

// Charnière cylindrique
const _charniere = (u, x, y, h) => `<rect x="${x}" y="${y}" width="30" height="${h}" rx="8" fill="url(#${u}-acier)"/>
  <rect x="${x}" y="${y + h * 0.3}" width="30" height="5" fill="var(--teal-nuit)" opacity=".5"/>
  <rect x="${x}" y="${y + h * 0.65}" width="30" height="5" fill="var(--teal-nuit)" opacity=".5"/>
  <rect x="${x + 6}" y="${y}" width="6" height="${h}" fill="#fff" opacity=".35"/>`;

// Molette à combinaison orange
function _molette(u, r) {
  const crans = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * 360;
    return `<rect x="${150 - 3}" y="${150 - r - 5}" width="6" height="9" rx="2" fill="var(--orange-fonce)" transform="rotate(${a} 150 150)"/>`;
  }).join('');
  const graduations = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2, [x1, y1] = _pol(150, 150, r + 12, a), [x2, y2] = _pol(150, 150, r + (i % 5 ? 17 : 21), a);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--teal-clair)" stroke-width="2" stroke-linecap="round"/>`;
  }).join('');
  return `${_c(150, 150, r + 26, 'fill="var(--teal-nuit)"')}${graduations}
    <g class="molette">${crans}
      ${_c(150, 150, r, `fill="url(#${u}-orange)"`)}
      ${_c(150, 150, r * 0.62, 'fill="var(--orange-fonce)" opacity=".35"')}
      ${_c(150, 150, r * 0.5, `fill="url(#${u}-orange)"`)}
      <rect x="146" y="${150 - r + 6}" width="8" height="${r * 0.42}" rx="4" fill="var(--teal-nuit)"/>
      ${_c(150 - r * 0.3, 150 - r * 0.35, r * 0.22, 'fill="#fff" opacity=".35"')}
    </g>`;
}

// Volant orange à n branches (le « gouvernail »)
function _volant(u, r, n, epaisseur = 12) {
  let br = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 360;
    br += `<g transform="rotate(${a} 150 150)">
      <rect x="146" y="${150 - r - 30}" width="8" height="${r + 30}" fill="url(#${u}-orange)"/>
      <path d="M143 ${150 - r - 6} h14 l-2 -32 h-10 z" fill="url(#${u}-orange)"/>
      <rect x="147" y="${150 - r - 36}" width="4" height="28" fill="#fff" opacity=".3"/>
    </g>`;
  }
  return `<g class="molette">
    ${_c(153, 155, r + 4, `fill="none" stroke="var(--teal-nuit)" stroke-opacity=".35" stroke-width="${epaisseur}"`)}
    ${br}
    ${_c(150, 150, r, `fill="none" stroke="url(#${u}-orange)" stroke-width="${epaisseur}"`)}
    ${_c(150, 150, r - epaisseur / 2 - 1, 'fill="none" stroke="var(--orange-fonce)" stroke-opacity=".4" stroke-width="2"')}
    ${_c(150, 150, 18, `fill="url(#${u}-orange)"`)}${_c(150, 150, 7, 'fill="var(--orange-clair)"')}
  </g>`;
}

function _defs(u) {
  const st = (o, v) => `<stop offset="${o}" style="stop-color:var(${v})"/>`;
  return `<defs>
    <radialGradient id="${u}-porte" cx=".3" cy=".25" r="1">${st(0, '--teal-clair')}${st(0.45, '--teal')}${st(1, '--teal-fonce')}</radialGradient>
    <linearGradient id="${u}-anneau" x1="0" y1="0" x2="1" y2="1">${st(0, '--teal')}${st(1, '--teal-fonce')}</linearGradient>
    <radialGradient id="${u}-creux" cx=".4" cy=".35" r=".8">${st(0, '--teal')}${st(1, '--teal-nuit')}</radialGradient>
    <linearGradient id="${u}-orange" x1="0" y1="0" x2="1" y2="1">${st(0, '--orange-clair')}${st(0.5, '--orange')}${st(1, '--orange-fonce')}</linearGradient>
    <linearGradient id="${u}-acier" x1="0" y1="0" x2="0" y2="1">${st(0, '--teal-clair')}${st(0.55, '--teal')}${st(1, '--teal-fonce')}</linearGradient>
    <linearGradient id="${u}-acierv" x1="0" y1="0" x2="1" y2="0">${st(0, '--teal-clair')}${st(0.55, '--teal')}${st(1, '--teal-fonce')}</linearGradient>
    <radialGradient id="${u}-rivet" cx=".35" cy=".3" r=".8">${st(0, '--teal-clair')}${st(1, '--teal-fonce')}</radialGradient>
    <radialGradient id="${u}-eclat"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <clipPath id="${u}-carre"><rect x="0" y="0" width="300" height="300" rx="22"/></clipPath>
    <clipPath id="${u}-rond"><circle cx="150" cy="150" r="150"/></clipPath>
  </defs>`;
}

/* ---------- Coffre 1 : le coffre du directeur ---------- */
function _porte1(u) {
  const ys = [55, 115, 185, 245];
  return `
    ${ys.map((y, i) => _barre(u, i, 'droite', y)).join('')}
    ${_charniere(u, -22, 40, 70)}${_charniere(u, -22, 190, 70)}
    <rect x="0" y="0" width="300" height="300" rx="22" fill="url(#${u}-porte)"/>
    ${_reflets(u, 'carre')}
    <rect x="26" y="26" width="248" height="248" rx="14" fill="none" stroke="var(--teal-fonce)" stroke-width="6"/>
    <rect x="32" y="32" width="236" height="236" rx="10" fill="none" stroke="var(--teal-clair)" stroke-opacity=".6" stroke-width="2"/>
    ${[[46, 46], [254, 46], [46, 254], [254, 254]].map(([x, y]) => _rivet(u, x, y, 9)).join('')}
    ${ys.map((y, i) => _c(278, y, 7, `class="voyant" data-i="${i}"`)).join('')}
    ${_molette(u, 50)}
    <rect x="108" y="236" width="84" height="24" rx="5" fill="url(#${u}-orange)"/>
    <text x="150" y="253" class="plaque">N° 1</text>`;
}

/* ---------- Coffre 2 : la salle des archives ---------- */
function _porte2(u) {
  const rivets = [];
  for (let i = 0; i < 7; i++) { const p = 40 + i * 36.6; rivets.push([p, 20], [p, 280], [20, p], [280, p]); }
  return `
    ${_barre(u, 0, 'gauche', 85)}${_barre(u, 1, 'droite', 85)}${_barre(u, 2, 'gauche', 215)}${_barre(u, 3, 'droite', 215)}
    <rect x="0" y="0" width="300" height="300" rx="34" fill="url(#${u}-porte)"/>
    ${_reflets(u, 'carre')}
    ${rivets.map(([x, y]) => _rivet(u, x, y, 6.5)).join('')}
    <rect x="38" y="38" width="224" height="224" rx="26" fill="url(#${u}-anneau)"/>
    <rect x="50" y="50" width="200" height="200" rx="20" fill="url(#${u}-porte)"/>
    ${_c(150, 150, 96, `fill="url(#${u}-creux)"`)}
    ${[[66, 85], [234, 85], [66, 215], [234, 215]].map(([x, y], i) => _c(x, y, 7, `class="voyant" data-i="${i}"`)).join('')}
    ${_volant(u, 64, 4, 11)}
    ${_c(150, 150, 30, `fill="url(#${u}-orange)" stroke="var(--teal-nuit)" stroke-opacity=".4" stroke-width="3"`)}
    <rect x="102" y="58" width="96" height="22" rx="5" fill="url(#${u}-orange)"/>
    <text x="150" y="74" class="plaque">ARCHIVES</text>`;
}

/* ---------- Coffre 3 : la chambre forte (porte ronde, volant à 8 branches) ---------- */
function _porte3(u) {
  const segments = Array.from({ length: 24 }, (_, i) => {
    const a1 = (i / 24) * Math.PI * 2, a2 = ((i + 1) / 24) * Math.PI * 2;
    const [x1, y1] = _pol(150, 150, 150, a1), [x2, y2] = _pol(150, 150, 150, a2);
    const [x3, y3] = _pol(150, 150, 112, a2), [x4, y4] = _pol(150, 150, 112, a1);
    const clair = i % 3 === 0;
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A150 150 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A112 112 0 0 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z" fill="${clair ? '#fff' : 'var(--teal-nuit)'}" opacity="${clair ? 0.12 : 0.08}"/>`;
  }).join('');
  const rivets = Array.from({ length: 8 }, (_, i) => _pol(150, 150, 131, (i / 8) * Math.PI * 2 - Math.PI / 2));
  return `
    ${_barre(u, 0, 'haut', 150, 28)}${_barre(u, 1, 'droite', 150, 28)}${_barre(u, 2, 'bas', 150, 28)}${_barre(u, 3, 'gauche', 150, 28)}
    ${_c(150, 150, 150, `fill="url(#${u}-porte)"`)}
    ${segments}
    ${_reflets(u, 'rond')}
    ${_c(150, 150, 150, 'fill="none" stroke="var(--teal-clair)" stroke-opacity=".7" stroke-width="3"')}
    ${rivets.map(([x, y]) => _rivet(u, x, y, 13)).join('')}
    ${_c(150, 150, 112, `fill="url(#${u}-anneau)"`)}
    ${_c(150, 150, 104, `fill="url(#${u}-porte)"`)}
    ${_c(150, 150, 72, `fill="url(#${u}-creux)" opacity=".7"`)}
    ${[[150, 58], [242, 150], [150, 242], [58, 150]].map(([x, y], i) => _c(x, y, 7, `class="voyant" data-i="${i}"`)).join('')}
    ${_volant(u, 52, 8, 12)}`;
}

const PORTES = [_porte1, _porte2, _porte3];

/* Derrière la porte ouverte : le coffre suivant au loin, ou le butin */
function _derriere(niveau) {
  if (niveau < 2) return `<div class="loin">${dessinerCoffre(niveau + 1, { mini: true })}</div>`;
  const lingots = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5 - r; c++) {
    const x = 20 + c * 34 + r * 17, y = 96 - r * 20;
    lingots.push(`<path d="M${x} ${y} l6 -14 h22 l6 14 z" class="lingot"/><path d="M${x + 7} ${y - 12} h20 l1 3 h-22 z" fill="#fff" opacity=".35"/>`);
  }
  return `<div class="butin"><svg viewBox="0 0 200 120">${lingots.join('')}</svg></div>`;
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

/* =========================================================
   DÉCOR : mur à moulures sous un projecteur, sol en damier
   (format 1600 × 900, recadré pour remplir l'écran)
   ========================================================= */
function dessinerDecor() {
  const st = (o, v) => `<stop offset="${o}" style="stop-color:var(${v})"/>`;
  const trait = 'fill="none" stroke="var(--mur-ligne)" stroke-linejoin="round"';
  // Panneau à coins arrondis vers l'intérieur
  const panneau = (x, y, w, h, r) => `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 0 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 0 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 0 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 0 ${x + r} ${y} Z`;
  // Grand encadrement autour du coffre (arche à pans coupés)
  const arche = (m) => `M${560 - m} ${80 - m} H${1040 + m} L${1180 + m} 220 V${740 + m} H${420 - m} V220 Z`;
  // Sol en damier en perspective (point de fuite au centre)
  const fuite = [800, 420], solHaut = 770, solBas = 900, cases = [];
  const xs = Array.from({ length: 17 }, (_, i) => -400 + i * 150);
  const lignes = [770, 795, 830, 900];
  const proj = (x, y) => fuite[0] + (x - fuite[0]) * ((y - fuite[1]) / (solBas - fuite[1]));
  for (let r = 0; r < lignes.length - 1; r++) for (let i = 0; i < xs.length - 1; i++) {
    if ((i + r) % 2) continue;
    const y1 = lignes[r], y2 = lignes[r + 1];
    cases.push(`<path d="M${proj(xs[i], y1).toFixed(0)} ${y1} L${proj(xs[i + 1], y1).toFixed(0)} ${y1} L${proj(xs[i + 1], y2).toFixed(0)} ${y2} L${proj(xs[i], y2).toFixed(0)} ${y2} Z" fill="var(--sol-fonce)" opacity=".35"/>`);
  }
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
    <defs>
      <radialGradient id="d-mur" cx="800" cy="400" r="900" gradientUnits="userSpaceOnUse">${st(0, '--mur-lumiere')}${st(0.32, '--mur')}${st(0.7, '--mur-ombre')}${st(1, '--mur-nuit')}</radialGradient>
      <linearGradient id="d-sol" x1="0" y1="0" x2="0" y2="1">${st(0, '--sol-clair')}${st(1, '--sol-fonce')}</linearGradient>
      <radialGradient id="d-solspot" cx="800" cy="790" r="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
      <linearGradient id="d-rideau" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#d-mur)"/>
    <rect width="1600" height="34" fill="var(--mur-nuit)" opacity=".6"/>
    <path d="${arche(0)}" ${trait} stroke-width="10"/>
    <path d="${arche(-26)}" ${trait} stroke-width="4"/>
    <path d="${panneau(120, 120, 300, 600, 34)}" ${trait} stroke-width="8"/>
    <path d="${panneau(140, 140, 260, 560, 26)}" ${trait} stroke-width="3"/>
    <path d="${panneau(1180, 120, 300, 600, 34)}" ${trait} stroke-width="8"/>
    <path d="${panneau(1200, 140, 260, 560, 26)}" ${trait} stroke-width="3"/>
    <rect x="0" y="742" width="1600" height="28" fill="var(--teal-fonce)"/>
    <rect x="0" y="742" width="1600" height="6" fill="var(--teal-clair)" opacity=".35"/>
    <rect x="0" y="${solHaut}" width="1600" height="${solBas - solHaut}" fill="url(#d-sol)"/>
    ${cases.join('')}
    <rect x="0" y="${solHaut}" width="1600" height="${solBas - solHaut}" fill="url(#d-solspot)"/>
    <rect x="0" y="0" width="260" height="900" fill="url(#d-rideau)"/>
    <rect x="1340" y="0" width="260" height="900" fill="url(#d-rideau)" transform="rotate(180 1470 450)"/>
  </svg>`;
}
