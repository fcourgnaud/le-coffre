/* =========================================================
   Service worker : garde l'app en mémoire (hors ligne)
   et gère les mises à jour.
   ⚠️ Changer VERSION à chaque nouvelle version (même valeur
   que dans version.js), sinon le téléphone ne voit rien.
   ========================================================= */
const VERSION = '3.24.0';
importScripts('version.js');

const CACHE = 'le-coffre-' + VERSION;
const FICHIERS = [
  './',
  'index.html',
  'theme.css',
  'version.js',
  'scene.js',
  'lib/jsQR.js', 'lib/quirc.wasm',
  'polices/VT323.woff', 'polices/BPPixelTitre.woff',
  'img/cuivre1.webp', 'img/cuivre2.webp', 'img/argent1.webp', 'img/argent2.webp',
  'img/or1.webp', 'img/or2.webp',
  'img/fond1.webp', 'img/fond2.webp', 'img/fond3.webp', 'img/fond4.webp', 'img/fond5.webp', 'img/fond6.webp',
  'img/logo.webp',
  'img/chien-corps.webp',
  'img/chien-tete.webp',
  'img/drone.webp',
  'img/holo1.webp',
  'img/holo2.webp',
  'img/holo3.webp',
  'img/holo4.webp',
  'img/holo5.webp',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png'
];
// Les musiques (dossier audio/) ne sont pas mises en mémoire ici : le navigateur les lit par morceaux.
// Tout le reste fonctionne sans connexion une fois l'app ouverte une fois.

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(FICHIERS.map((f) => new Request(f, { cache: 'reload' })));
  })());
  // Pas de skipWaiting ici : on attend que le joueur appuie sur « Mettre à jour »
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const cles = await caches.keys();
    await Promise.all(cles.filter((k) => k.startsWith('le-coffre-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // La vérification de version passe toujours par le réseau
  if (url.origin !== location.origin) return;
  if (url.searchParams.has('verif')) return;
  // Les musiques sont lues par morceaux par le navigateur : on les laisse passer directement
  if (url.pathname.includes('/audio/')) return;
  e.respondWith((async () => {
    const enCache = await caches.match(req, { ignoreSearch: req.mode === 'navigate' });
    if (enCache) return enCache;
    try {
      return await fetch(req);
    } catch (err) {
      if (req.mode === 'navigate') return caches.match('index.html');
      throw err;
    }
  })());
});
