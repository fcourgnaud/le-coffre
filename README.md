# Break Protocol (ex « Le Casse du siècle »)

Jeu coopératif en temps réel (2 à 4 joueurs) : le téléphone posé au centre est un coffre-fort. On écoute, on scanne des cartes à QR code, on se tait.

## Fichiers

| Fichier | Rôle | Tu peux le modifier ? |
|---|---|---|
| `index.html` | Les écrans et toute la logique du jeu | Oui, avec prudence |
| `theme.css` | Tout le visuel (couleurs, polices, tailles), rangé par écran | **Oui, c'est fait pour** |
| `scene.js` | Place tes illustrations et règle les animations (porte, caméra, verrous, écrans du décor) | Les réglages en haut du fichier, oui |
| `img/` | Tes illustrations : cuivre1/2, argent1/2, or1/2 (1783 × 882 px), fond1 à fond6, logo (en .webp) | Oui, remplace-les par tes nouvelles versions |
| `audio/` | Les musiques : introfin (accueil + fin), musique1/2/3 (une par porte) | Oui, garde les mêmes noms |
| `polices/` | Les polices pixel VT323 et Press Start 2P (licence libre OFL) | Non |
| `lib/jsQR.js`, `lib/quirc.wasm` | Les deux lecteurs de QR codes (jsQR, licence Apache 2.0 ; quirc, licence ISC, compilé en WebAssembly depuis `outils/`) | Non |
| `version.js` | Numéro de version + notes affichées dans le bandeau | Claude s'en occupe |
| `sw.js` | Garde l'app hors ligne et gère les mises à jour | Non |
| `manifest.webmanifest`, `icon-*.png` | Installation sur l'écran d'accueil | Les icônes, oui |

Les cartes à imprimer sont un PDF à part (A3 recto-verso, style pixel, logo au dos).

## Contenu des QR codes

- `CASSE:O01` à `CASSE:O32` : 16 programmes en 2 exemplaires (O01-O02 Cheval de Troie, O03-O04 Ver, O05-O06 Virus, O07-O08 Hameçonnage, O09-O10 Porte dérobée, O11-O12 Force brute, O13-O14 Cookie espion, O15-O16 Bombe logique, O17-O18 Bot, O19-O20 Araignée du web, O21-O22 Fantôme, O23-O24 Pare-feu percé, O25-O26 Spam, O27-O28 Mot de passe, O29-O30 Clé de chiffrement, O31-O32 Miroir proxy)
- `CASSE:P01` : Planquez-vous ! (milieu de table)
- `CASSE:C01` : Os à moelle (milieu de table)
- `CASSE:B01` : Court-circuit (milieu de table)
- Tout le monde peut scanner les 3 cartes du milieu
- Cartes Plan A à F : sans QR, seul le Cerveau les regarde

QR standard uniquement (pas de Micro QR).

## Versions

- Le numéro est affiché en bas de l'accueil.
- Quand une nouvelle version est publiée, un bandeau « Nouvelle version disponible » apparaît à l'accueil (jamais pendant une partie). Bouton **Mettre à jour** = l'app se recharge sur la nouvelle version.
- Bouton **Vérifier les mises à jour** en bas de l'accueil pour forcer la vérification.
- Pour publier une version : changer `APP_VERSION` dans `version.js` **et** `VERSION` en haut de `sw.js` (même valeur).

### Historique
- **3.12.0** — Scan bien plus efficace : 2e lecteur de QR (quirc, compilé en WebAssembly) en pleine définition, image rendue plus nette, centre agrandi, en relais avec jsQR. Sur 70 photos difficiles : 48 lues au lieu de 29. Cadre caméra orange quand un QR est vu mais pas encore lisible.
- **3.11.0** — Vérification complète et optimisation : programmes à la place des outils dans l'app (aide, boutons de test, messages, règles) ; polices et lecteur QR hébergés avec l'app (marche sans connexion) ; images allégées (≈ 1,3 Mo de moins) ; theme.css réécrit et rangé par écran ; pause automatique quand on quitte l'app ; scan suspendu en pause ; code inutilisé retiré (cartes.html, pictos-outils.js, sticker, lingots).
- **3.10.3** — Démarrage du son corrigé sur iPhone (déblocage au doigt levé, à chaque toucher) ; sons joués même en mode silencieux (audioSession).
- **3.10.2** — Indices visuels toujours actifs ; option retirée des réglages.
- **3.10.1** — Grand écran en 4 rangées de hauteur fixe : la caméra, le son et la pause ne sont plus coupés sur les petits téléphones.
- **3.10.0** — Jauge d'alarme en barre de détection : 20 blocs (4 par point), vert (1-2), orange (3), rouge (4-5), pourcentage, « ! ALERTE ! » à 4 ; effet tremblement + flash + « ALERTE +1 » quand l'alarme monte.
- **3.9.2** — Aperçu caméra, bouton son (icône pixel à barres) et pause (icône pixel) rangés en bas du grand écran.
- **3.9.1** — Écran de démarrage « Touche l'écran pour commencer » qui lance la musique ; symboles du petit écran dessinés pixel par pixel en SVG (`SYMBOLES_PIXELS` dans index.html) au lieu d'un canvas.
- **3.9.0** — Scan amélioré : caméra en HD avec mise au point continue, lecteur QR du téléphone quand il existe (Android), sinon lecture à 4 échelles (image entière, centre zoomé, contraste renforcé, cœur très zoomé).
- **3.8.4** — Le logo passe sous la fenêtre des réglages.
- **3.8.3** — Logo remonté sur l'accueil.
- **3.8.2** — Nouvelle icône de l'app (icon-192 / icon-512), couleur de fond bleu nuit.
- **3.8.1** — Logo retiré pendant la partie (seulement sur l'accueil).
- **3.8.0** — 6 nouvelles salles fortes pixel art (fond1 à fond6, les anciennes supprimées) ; logo visible aussi pendant la partie ; pendant le zoom, l'image de derrière est prolongée en miroir (plus de halo flou ni de bords visibles).
- **3.7.3** — Annulation de 3.7.2 : le logo revient comme en 3.7.1 (taille d'avant, seulement sur l'accueil).
- **3.7.1** — Bande noire côté caméra (largeur = zone réservée par le téléphone, réglage `BANDE_SECOURS` dans scene.js), décor recadré à côté ; menus (réglages, règles, serrures, pause, mise à jour, annonce du plan, aide) au style pixel ; textes des écrans qui s'éteignent avant le zoom ; roues recentrées et coupées dans le cercle sombre.
- **3.7.0** — Décors pixel art (portes bleue, verte, or), logo Break Protocol (accueil + page d'intro quand le téléphone est vertical), textes et alarme dans le grand écran du décor, symboles en gros pixels dans le petit écran, musiques (dossier `audio/`) et bouton de volume 🔊.
- **3.6.0** — Pictos des outils en cuivre et acier ; cartes à imprimer au design de l'app (mur sombre, spots, cadres cuivre / argent / or).
- **3.5.1** — Zoom plus rapide (réglage `dureeZoom` dans scene.js).
- **3.5.0** — Pénombre derrière les portes, allumage façon néons après le zoom, plus de bords noirs (réglages `--penombre` dans theme.css, `dureeAllumage` dans scene.js).
- **3.4.2** — Pendant le zoom, l'écran d'avant grossit jusqu'à sortir de l'écran (réglage `traversee`).
- **3.4.1** — Plus de fondu pendant le zoom : l'écran d'avant disparaît d'un coup à la fin.
- **3.4.0** — Bouton de test « Ouvrir la serrure » ; la porte file vers la gauche au début du zoom (réglage `sortiePorte`).
- **3.3.1** — Sticker retiré : la salle forte puis le panneau de résultat.
- **3.3.0** — Zoom final rétabli ; salle forte tirée au hasard parmi fond1 à fond6 (jamais la même deux fois de suite) ; sticker au centre après le zoom.
- **3.2.0** — Fin : pas de zoom dans le dernier coffre, sticker « YOU WIN! » qui sort de la porte, puis le panneau de résultat.
- **3.1.2** — Retour au zoom caméra avec fondu (annule la traversée de la 3.1.1).
- **3.1.0** — Pictos des sons en formes simples : Tic-tac = cercle, Grincement = triangle, Bips = carré, Cliquetis = losange, Bourdon = hexagone, Craquement = croix.
- **3.0.3** — Plus de lingots à la fin : directement le panneau de victoire.
- **3.0.2** — Aide pour les tests en haut des réglages, mémorisée, plus lisible (outil, vigile, chien).
- **3.0.1** — Phrase d'aide de nouveau visible (aussi en mode sans scan) et plus lisible.
- **3.0.0** — Illustrations cuivre → argent → or → salle forte : porte qui glisse, caméra qui avance, verrous sur la plaque, interface à gauche, écran « Tourne ton téléphone ».
- **2.2.1** — Correction : plus de rechargement automatique à la première ouverture.
- **2.2.0** — Pictos des 16 outils (pictos-outils.js), utilisés sur les cartes outils et sur les cartes Plan.
- **2.1.1** — Lampe du vigile à droite, faisceau plus fort qui balaie la pièce et éclaire le coffre ; empreintes du chien à gauche.
- **2.1.0** — Nouvelle direction artistique (aplats bleu-vert et orange, mur à moulures, projecteur, sol en damier), écran en paysage, jauge d'alarme verticale, décor dessiné dans coffres.js.
- **2.0.0** — Nouveau design : grand coffre central, barres de verrouillage, porte qui s'ouvre, caméra qui avance vers le coffre suivant, 3 coffres de plus en plus complexes, butin final.
- **1.6.3** — Le tour de parole commence par le joueur qui suit le dernier à avoir pioché.
- **1.6.2** — Tour de parole sans cartes de rôle, sens horaire, en commençant par celui qui a scanné la dernière carte (« J'ai pas » pour passer).
- **1.6.1** — Plus de cartes de rôle ni de tour de parole : celui qui pense avoir l'outil le scanne.
- **1.6.0** — Indices visuels : pictos des sons dans le cadran, lampe du veilleur, empreintes du chien, annonce du plan en grand. Pictos aussi sur les cartes Plan.
- **1.5.0** — 16 outils × 2 exemplaires, 2 outils possibles par son sur les plans, mains de 6 (10 si seul Porteur), 4 sons différents par coffre.
- **1.4.1** — Planquez-vous !, Os et Court-circuit au milieu de la table, utilisables par tous (1 carte de chaque).
- **1.4.0** — Plus de Perceur : les Porteurs scannent à tour de rôle (« J'ai pas » pour passer) ; le Cerveau gère garde et chien ; Court-circuit commun aux Porteurs.
- **1.3.0** — Mains réparties : outils chez les Porteurs, défausse de tout outil scanné, carte déjà utilisée refusée, serrures toujours ouvrables, compteur d'exemplaires en mode sans scan.
- **1.2.0** — Plan de la banque (option A : un seul Cerveau) : plans A–F annoncés par la cloche, sons aux noms neutres, Électricien supprimé, nuit 12 min par défaut, option réécoutes limitées.
- **1.1.0** — Mode « Sans scan » (boutons, sans caméra, mémorisé) + raccourcis clavier sur ordinateur.
- **1.0.0** — Première version jouable : 3 coffres, garde, chien, jauge d'alarme, sons générés, système de versions.
