/* =========================================================
   LE CASSE DU SIÈCLE — PICTOS DES 16 OUTILS
   ---------------------------------------------------------
   Un picto par outil, dans l'ordre de la liste des outils
   (Perceuse = O01-O02, Stéthoscope = O03-O04, etc.).
   Chaque picto est dessiné sur une grille de 64 × 64.
   Style de l'app : métal (cuivre et acier brossé), contour
   presque noir, reflets clairs. Les dégradés sont définis
   une seule fois dans PICTOS_DEFS (à placer une fois dans la page).
   Tu peux remplacer un tracé par ton propre dessin SVG
   (garde juste le viewBox 0 0 64 64).
   ========================================================= */
const _N = '#141110', _O = 'url(#pi-cuivre)', _OF = '#6e3518', _T = 'url(#pi-acier)', _TF = '#7f888c', _L = 'url(#pi-chrome)', _J = '#ffd98a';
// Dégradés métalliques (lumière venant d'en haut à gauche, comme les spots de l'app)
const PICTOS_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="pi-cuivre" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="64" y2="64"><stop offset="0" stop-color="#ffd2a3"/><stop offset=".3" stop-color="#e08a4e"/><stop offset=".6" stop-color="#b8622f"/><stop offset=".8" stop-color="#e3925a"/><stop offset="1" stop-color="#7a3a19"/></linearGradient>
  <linearGradient id="pi-acier" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="64" y2="64"><stop offset="0" stop-color="#f2f4f4"/><stop offset=".35" stop-color="#a9b1b4"/><stop offset=".6" stop-color="#6f777a"/><stop offset=".8" stop-color="#b7bec0"/><stop offset="1" stop-color="#4a5154"/></linearGradient>
  <linearGradient id="pi-chrome" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="64" y2="64"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d4d9db"/><stop offset="1" stop-color="#8d9599"/></linearGradient>
</defs></svg>`;
const _s = `stroke="${_N}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
// Trait épais avec contour : dessine d'abord le contour foncé, puis la couleur par-dessus
const _trait = (d, couleur, ep) => `<path d="${d}" fill="none" stroke="${_N}" stroke-width="${ep + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${couleur}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"/>`;

const PICTOS_OUTILS = [
  // 1. Perceuse
  `<rect x="27" y="30" width="11" height="24" rx="4" fill="${_O}" ${_s}/>
   <rect x="10" y="16" width="36" height="17" rx="7" fill="${_O}" ${_s}/>
   <rect x="16" y="20" width="14" height="4" rx="2" fill="#fff" opacity=".45"/>
   <rect x="46" y="19" width="8" height="11" rx="2" fill="${_T}" ${_s}/>
   ${_trait('M54 24.5 H61', _L, 3)}
   <rect x="31" y="33" width="4" height="6" rx="1.5" fill="${_N}"/>`,
  // 2. Stéthoscope
  `${_trait('M20 8 V22 Q20 36 32 36 Q44 36 44 22 V8', _TF, 4)}
   ${_trait('M32 36 Q32 52 44 50', _TF, 4)}
   <circle cx="20" cy="8" r="3.5" fill="${_O}" ${_s}/><circle cx="44" cy="8" r="3.5" fill="${_O}" ${_s}/>
   <circle cx="47" cy="50" r="9" fill="${_O}" ${_s}/><circle cx="47" cy="50" r="4.5" fill="${_L}" ${_s}/>`,
  // 3. Pied-de-biche
  `${_trait('M16 56 L44 16 Q48 9 54 12 L56 17', _O, 6)}
   ${_trait('M16 56 L11 54 M16 56 L15 61', _O, 4)}
   <path d="M38 22 L42 17" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`,
  // 4. Crochet (outils de crochetage)
  `${_trait('M12 52 L36 28', _O, 8)}
   ${_trait('M36 28 L52 12 L56 15', _L, 3)}
   ${_trait('M18 60 L44 34 L48 38', _TF, 3)}
   <path d="M16 46 L22 40" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`,
  // 5. Aimant
  `${_trait('M18 10 V32 A14 14 0 0 0 46 32 V10', _O, 11)}
   <path d="M18 9 V18 M46 9 V18" stroke="${_L}" stroke-width="11"/>
   <path d="M12.5 18.5 H23.5 M40.5 18.5 H51.5" stroke="${_N}" stroke-width="2.5"/>
   <path d="M10 6 L6 2 M54 6 L58 2 M32 6 V1" stroke="${_TF}" stroke-width="2.5" stroke-linecap="round"/>`,
  // 6. Chalumeau
  `<rect x="12" y="28" width="20" height="30" rx="6" fill="${_T}" ${_s}/>
   <rect x="16" y="32" width="4" height="20" rx="2" fill="#fff" opacity=".45"/>
   ${_trait('M22 28 V20 H42', _TF, 4)}
   <path d="M43 20 Q52 10 62 20 Q52 30 43 20 Z" fill="${_O}" ${_s}/>
   <path d="M46 20 Q52 15 57 20 Q52 25 46 20 Z" fill="${_J}"/>`,
  // 7. Ventouse
  `<rect x="28.5" y="6" width="7" height="30" rx="3" fill="${_TF}" ${_s}/>
   <circle cx="32" cy="7" r="5" fill="${_O}" ${_s}/>
   <path d="M10 48 Q32 18 54 48 Z" fill="${_O}" ${_s}/>
   <rect x="8" y="46" width="48" height="7" rx="3.5" fill="${_OF}" ${_s}/>
   <path d="M20 40 Q26 32 32 30" stroke="#fff" stroke-width="2.5" opacity=".5" fill="none" stroke-linecap="round"/>`,
  // 8. Scie à métaux
  `${_trait('M14 20 H52 V42', _TF, 4)}
   <path d="M14 42 H52 l-2.5 4 l-2.5 -4 l-2.5 4 l-2.5 -4 l-2.5 4 l-2.5 -4 l-2.5 4 l-2.5 -4 l-2.5 4 l-2.5 -4 l-2.5 4 l-2.5 -4 l-2.5 4 l-2.5 -4 l-2.5 4 l-2.5 -4" fill="${_L}" ${_s}/>
   <path d="M4 18 Q14 14 16 24 V46 Q10 50 4 46 Z" fill="${_O}" ${_s}/>`,
  // 9. Marteau
  `<rect x="27" y="22" width="10" height="36" rx="4" fill="${_O}" ${_s}/>
   <rect x="30" y="26" width="3" height="28" rx="1.5" fill="#fff" opacity=".45"/>
   <path d="M12 10 H44 V24 H12 Q8 17 12 10 Z" fill="${_T}" ${_s}/>
   <path d="M44 12 Q54 12 58 6 M44 22 Q54 22 58 28" fill="none" stroke="${_N}" stroke-width="6" stroke-linecap="round"/>
   <path d="M44 12 Q54 12 58 6 M44 22 Q54 22 58 28" fill="none" stroke="${_T}" stroke-width="3" stroke-linecap="round"/>`,
  // 10. Tournevis
  `<g transform="rotate(-40 32 32)">
     <rect x="4" y="24" width="24" height="16" rx="7" fill="${_O}" ${_s}/>
     <path d="M10 28 H22" stroke="#fff" stroke-width="2.5" opacity=".5" stroke-linecap="round"/>
     <path d="M10 36 H22" stroke="${_OF}" stroke-width="2" stroke-linecap="round"/>
     ${_trait('M28 32 H54', _L, 4)}
     <path d="M54 29 L60 31 V33 L54 35 Z" fill="${_L}" ${_s}/>
   </g>`,
  // 11. Lampe torche
  `<path d="M44 18 L64 6 V50 L44 38 Z" fill="${_J}" opacity=".55"/>
   <rect x="6" y="22" width="28" height="12" rx="4" fill="${_T}" ${_s}/>
   <path d="M34 20 L46 16 V40 L34 36 Z" fill="${_O}" ${_s}/>
   <rect x="10" y="25" width="16" height="3" rx="1.5" fill="#fff" opacity=".5"/>
   <rect x="16" y="32" width="6" height="5" rx="1.5" fill="${_OF}" ${_s}/>`,
  // 12. Corde
  `<circle cx="30" cy="30" r="20" fill="none" stroke="${_N}" stroke-width="12"/>
   <circle cx="30" cy="30" r="20" fill="none" stroke="${_O}" stroke-width="7"/>
   <circle cx="30" cy="30" r="20" fill="none" stroke="${_OF}" stroke-width="7" stroke-dasharray="3 5"/>
   <circle cx="30" cy="30" r="9" fill="none" stroke="${_N}" stroke-width="10"/>
   <circle cx="30" cy="30" r="9" fill="none" stroke="${_O}" stroke-width="5"/>
   ${_trait('M46 42 Q54 50 58 60', _O, 5)}`,
  // 13. Pince coupante
  `${_trait('M29 34 Q20 46 17 59', _O, 6)}
   ${_trait('M35 34 Q44 46 47 59', _O, 6)}
   <path d="M29 34 L21 10 Q31 12 34 30 Z" fill="${_TF}" ${_s}/>
   <path d="M35 34 L43 10 Q33 12 30 30 Z" fill="${_T}" ${_s}/>
   <circle cx="32" cy="32" r="4.5" fill="${_L}" ${_s}/>`,
  // 14. Loupe
  `${_trait('M38 38 L56 56', _O, 8)}
   <circle cx="26" cy="26" r="16" fill="${_L}" stroke="${_N}" stroke-width="9"/>
   <circle cx="26" cy="26" r="16" fill="none" stroke="${_TF}" stroke-width="5"/>
   <path d="M17 22 Q19 15 26 14" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  // 15. Clé à molette
  `<g transform="rotate(35 32 32)">
     <rect x="27" y="22" width="10" height="38" rx="5" fill="${_TF}" ${_s}/>
     <path d="M18 4 H46 V24 H38 V12 H26 V24 H18 Z" fill="${_T}" ${_s}/>
     <circle cx="32" cy="28" r="4" fill="${_O}" ${_s}/>
     <rect x="30" y="34" width="4" height="20" rx="2" fill="#fff" opacity=".35"/>
   </g>`,
  // 16. Dynamite
  `${_trait('M32 20 Q30 12 38 10 Q46 8 46 4', '#8a5a34', 2)}
   <path d="M46 4 l2 -3 l1 3.5 l3.5 -1 l-2.5 3 l3 2 l-3.5 .5 l.5 3.5 l-2.5 -2.5 l-2.5 2.5 l.5 -3.5 l-3.5 -.5 l3 -2 l-2.5 -3 l3.5 1 z" fill="${_J}" stroke="${_O}" stroke-width="1"/>
   <rect x="14" y="20" width="12" height="38" rx="4" fill="#e2483a" ${_s}/>
   <rect x="38" y="20" width="12" height="38" rx="4" fill="#e2483a" ${_s}/>
   <rect x="26" y="18" width="12" height="40" rx="4" fill="#ef5a45" ${_s}/>
   <rect x="11" y="36" width="42" height="8" rx="2" fill="${_TF}" ${_s}/>`
];
