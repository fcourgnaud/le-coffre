# Le Casse du siècle

Jeu coopératif en temps réel (2 à 4 joueurs) : le téléphone posé au centre est un coffre-fort. On écoute, on scanne des cartes à QR code, on se tait.

## Fichiers

| Fichier | Rôle | Tu peux le modifier ? |
|---|---|---|
| `index.html` | Les écrans et toute la logique du jeu | Oui, avec prudence |
| `theme.css` | Tout le visuel (couleurs, polices, cadran…) | **Oui, c'est fait pour** |
| `version.js` | Numéro de version + notes affichées dans le bandeau | Claude s'en occupe |
| `sw.js` | Garde l'app hors ligne et gère les mises à jour | Non |
| `manifest.webmanifest`, `icon-*.png` | Installation sur l'écran d'accueil | Les icônes, oui |
| `cartes.html` | Planche de cartes prototype à imprimer | Oui |

## Contenu des QR codes

- `CASSE:O01` à `CASSE:O32` : 16 outils en 2 exemplaires (O01-O02 Perceuse, O03-O04 Stéthoscope, O05-O06 Pied-de-biche, O07-O08 Crochet, O09-O10 Aimant, O11-O12 Chalumeau, O13-O14 Ventouse, O15-O16 Scie à métaux, O17-O18 Marteau, O19-O20 Tournevis, O21-O22 Lampe torche, O23-O24 Corde, O25-O26 Pince coupante, O27-O28 Loupe, O29-O30 Clé à molette, O31-O32 Dynamite)
- `CASSE:P01` : Planquez-vous ! (milieu de table)
- `CASSE:C01` : Os (milieu de table)
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
