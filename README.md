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
- `CASSE:P01` à `CASSE:P04` : Planquez-vous !
- `CASSE:C01`, `CASSE:C02` : Os (chien)
- `CASSE:B01` : Court-circuit (électricien)
- `CASSE:R01` à `CASSE:R04` : rôles (Perceur, Guetteur, Maître-chien, Électricien)

QR standard uniquement (pas de Micro QR).

## Versions

- Le numéro est affiché en bas de l'accueil.
- Quand une nouvelle version est publiée, un bandeau « Nouvelle version disponible » apparaît à l'accueil (jamais pendant une partie). Bouton **Mettre à jour** = l'app se recharge sur la nouvelle version.
- Bouton **Vérifier les mises à jour** en bas de l'accueil pour forcer la vérification.
- Pour publier une version : changer `APP_VERSION` dans `version.js` **et** `VERSION` en haut de `sw.js` (même valeur).

### Historique
- **1.0.0** — Première version jouable : 3 coffres, garde, chien, jauge d'alarme, sons générés, système de versions.
