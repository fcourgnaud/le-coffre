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

- `CASSE:O01` à `CASSE:O30` : outils (5 par type, dans l'ordre Stéthoscope, Perceuse, Brouilleur, Crochet, Aimant, Pied-de-biche)
- `CASSE:P01` : Planquez-vous ! (milieu de table)
- `CASSE:C01` : Os (milieu de table)
- `CASSE:B01` : Court-circuit (milieu de table)
- Tout le monde peut scanner les 3 cartes du milieu
- `CASSE:R01` à `CASSE:R04` : rôles (Porteur 1, Porteur 2, Porteur 3, Cerveau)
- Cartes Plan A à F : sans QR, seul le Cerveau les regarde

QR standard uniquement (pas de Micro QR).

## Versions

- Le numéro est affiché en bas de l'accueil.
- Quand une nouvelle version est publiée, un bandeau « Nouvelle version disponible » apparaît à l'accueil (jamais pendant une partie). Bouton **Mettre à jour** = l'app se recharge sur la nouvelle version.
- Bouton **Vérifier les mises à jour** en bas de l'accueil pour forcer la vérification.
- Pour publier une version : changer `APP_VERSION` dans `version.js` **et** `VERSION` en haut de `sw.js` (même valeur).

### Historique
- **1.4.1** — Planquez-vous !, Os et Court-circuit au milieu de la table, utilisables par tous (1 carte de chaque).
- **1.4.0** — Plus de Perceur : les Porteurs scannent à tour de rôle (« J'ai pas » pour passer) ; le Cerveau gère garde et chien ; Court-circuit commun aux Porteurs.
- **1.3.0** — Mains réparties : outils chez les Porteurs, défausse de tout outil scanné, carte déjà utilisée refusée, serrures toujours ouvrables, compteur d'exemplaires en mode sans scan.
- **1.2.0** — Plan de la banque (option A : un seul Cerveau) : plans A–F annoncés par la cloche, sons aux noms neutres, Électricien supprimé, nuit 12 min par défaut, option réécoutes limitées.
- **1.1.0** — Mode « Sans scan » (boutons, sans caméra, mémorisé) + raccourcis clavier sur ordinateur.
- **1.0.0** — Première version jouable : 3 coffres, garde, chien, jauge d'alarme, sons générés, système de versions.
