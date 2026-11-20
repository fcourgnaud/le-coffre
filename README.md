# Break Protocol (ex « Le Casse du siècle »)

Jeu coopératif en temps réel (2 à 4 joueurs) : le téléphone posé au centre est un coffre-fort. On écoute, on scanne des cartes à QR code, on se tait.

## Fichiers

| Fichier | Rôle | Tu peux le modifier ? |
|---|---|---|
| `index.html` | Les écrans et toute la logique du jeu | Oui, avec prudence |
| `theme.css` | Tout le visuel (couleurs, polices, tailles), rangé par écran | **Oui, c'est fait pour** |
| `scene.js` | Place tes illustrations et règle les animations (porte, caméra, verrous, écrans du décor) | Les réglages en haut du fichier, oui |
| `img/` | Tes illustrations : cuivre1/2, argent1/2, or1/2 (1783 × 882 px), fond1 à fond6, logo, cyber-dog (chien-corps + chien-tete), drone (en .webp) | Oui, remplace-les par tes nouvelles versions |
| `audio/` | Les musiques : introfin (accueil + fin), musique1/2/3 (une par porte) | Oui, garde les mêmes noms |
| `polices/` | Les polices pixel VT323 et BP Pixel Titre (Press Start 2P modifiée), licence libre OFL | Non |
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
- **3.23.1** — Écran entre deux coffres (bouton « On y va ») : numéro du coffre, nom et texte centrés, comme le grand écran en jeu.
- **3.23.0** — Grand écran : infos du coffre, « Détection », jauge, « Plan » et boutons son et pause agrandis. L'aperçu caméra sort du bloc de texte et se pose dans le coin bas gauche de la vitre du décor, contre le cadre, avec le même coin coupé que la vitre (mesuré sur chaque porte : `CAMERA_ECRAN` dans scene.js) et le coin haut droit coupé pareil ; liseré couleur écran en haut, sur le biais et à droite.
- **3.22.1** — Grand écran : boutons son et pause et cadre caméra en tailles fixes (Safari sur iPhone gérait mal les hauteurs en % et aspect-ratio : boutons invisibles) ; la vidéo n'est plus découpée elle-même, elle est placée dans un bloc découpé (coin haut droit coupé, liseré en haut, sur le biais et à droite).
- **3.22.0** — Grand écran en jeu refait d'après la maquette : tout centré — « Coffre 1 / 3 » et nom du coffre, « Détection x % » au-dessus de la jauge, « Plan X » ; en bas, chrono au centre, son et pause à droite, aperçu caméra collé dans le coin bas gauche avec le coin haut droit coupé. Retirés de l'écran : la ligne de message, « Touchez le coffre pour réécouter », « ! ALERTE ! » et « SANS SCAN » (en mode sans scan, pas de cadre caméra). Le flash « ALERTE +1 » reste.
- **3.21.1** — Annonce du plan : « Plan », la lettre et le chiffre du compte à rebours sont maintenant centrés au pixel près (la police pixel laissait une colonne vide à droite de chaque lettre). Pendant le compte à rebours, l'écran d'annonce bloque les touches sur ce qui est derrière (coffre, boutons, barre d'aide) et aucune carte n'est lue (la caméra n'analyse pas).
- **3.21.0** — Sons dans le thème : le drone fait un bourdonnement d'hélices continu (de plus en plus fort, de la droite vers la gauche) avec un bip radar et son écho ; le cyber-dog « renifle » avec un servomoteur et 3 bips de scan qui montent (le son vient de la gauche puis du centre), aboie en deux « ouaf » synthétiques suivis d'une petite sirène, et joue un arpège 8 bits quand on lui donne l'os. Les pas de l'équipe quand la caméra avance ne changent pas.
- **3.20.0** — Accueil : le drone survole la pièce de droite à gauche, sans halo, avec ses feux d'antennes et sa façade animés, toutes les 45 s (réglage `SURVOL_DRONE`, traversée de 12 s ; premier passage 20 s après le lancement, pour ne pas croiser le chien).
- **3.19.0** — Drone : il entre par la droite dès le début de l'approche et traverse le haut de l'écran en ligne droite à vitesse constante ; au milieu de l'écran il vous voit (+2) ou passe, puis continue vers la gauche et sort ; demi-tour = il repart à droite. Grand halo rouge qui pulse autour de lui (on le voit arriver avant le drone), feux d'antennes rouges, façade qui grésille ; plus d'oscillation, plus de faisceau, plus d'ombre portée ; flash rouge quand il vous voit ; bruit de pas qui va de la droite vers la gauche.
- **3.18.0** — Le drone remplace la lampe du vigile : pendant la première partie de l'approche (`DRONE_ENTREE` = 55 %), seule sa lumière entre par la droite ; ensuite le drone (`img/drone.webp`) apparaît en haut à droite et ralentit jusqu'à sa place, en oscillant, feux d'antennes qui clignotent, projecteur qui balaie la pièce vers le bas à gauche ; au départ (ou demi-tour) il ressort par la droite. Correctif : le cyber-dog n'apparaît plus immobile à gauche au début d'un coffre.
- **3.17.0** — Accueil : le cyber-dog traverse la pièce de gauche à droite au niveau du sol, en reniflant, toutes les 30 s (réglage `PROMENADE_CHIEN`, traversée de 11 s ; premier passage 6 s après le lancement).
- **3.16.2** — Cyber-dog toujours au niveau du sol, même avec l'aide pour les tests : la barre d'aide passe par-dessus lui.
- **3.16.1** — Cyber-dog : il entre par le bord gauche de l'app au niveau du sol, passe devant le grand écran et glisse en continu jusqu'au centre du coffre en `DUREE_CHIEN` secondes (7 s) ; s'il y arrive sans os, il aboie (+1 alarme) et repart vers la droite ; avec l'os, il repart vers la gauche.
- **3.16.0** — Le cyber-dog remplace les empreintes : il sort de derrière le grand écran et avance d'un pas à chaque reniflement (5 pas), la tête flaire et les yeux clignotent ; quand il aboie, la tête se relève d'un coup, il tremble et ses yeux virent au rouge ; os scanné : petit bond puis il repart ; coffre ouvert : il disparaît. Images `img/chien-corps.webp` et `img/chien-tete.webp`.
- **3.15.0** — Annonce du plan : la lettre reste affichée pendant un compte à rebours de 5 s avec un bip par seconde (réglage `DUREE_DECOMPTE`) ; plus de carrés ni de coups de cloche ; le chrono attend la fin du compte à rebours.
- **3.14.1** — Aide pour les tests sur deux lignes (programme à scanner, puis drone, cyber-dog et défausse).
- **3.14.0** — Textes des écrans du décor environ 20 % plus grands ; aide pour les tests sur une seule ligne en bas de l'écran, avec le bouton « Ouvrir ».
- **3.13.3** — Police des titres pixel : majuscules accentuées redessinées à la taille des autres (police « BP Pixel Titre », modifiée depuis Press Start 2P).
- **3.13.2** — Bouton et écran « Les serrures » retirés de l'accueil.
- **3.13.1** — Coffre déverrouillé : le drone et le cyber-dog sont annulés (lumière, empreintes, planque), ils repartent de zéro au coffre suivant.
- **3.13.0** — Textes revus par l'utilisatrice (tableau « textes de l'app et des cartes ») : Cyberrunner / Deckrunner, drone, cyber-dog, run.
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
