/* =========================================================
   Service worker : garde l'app en mémoire (hors ligne)
   et gère les mises à jour.
   ⚠️ Changer VERSION à chaque nouvelle version (même valeur
   que dans version.js), sinon le téléphone ne voit rien.
   ========================================================= */
const VERSION = '3.9.2';
importScripts('version.js');

const CACHE = 'le-coffre-' + VERSION;
const FICHIERS = [
  './',
  'index.html',
  'theme.css',
  'version.js',
  'scene.js',
  'img/cuivre1.webp', 'img/cuivre2.webp', 'img/argent1.webp', 'img/argent2.webp',
  'img/or1.webp', 'img/or2.webp',
  'img/fond1.webp', 'img/fond2.webp', 'img/fond3.webp', 'img/fond4.webp', 'img/fond5.webp', 'img/fond6.webp',
  'img/logo.webp',
  'pictos-outils.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'cartes.html'
];
const EXTERNES = [
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js',
  'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(FICHIERS.map((f) => new Request(f, { cache: 'reload' })));
    // Bibliothèques externes : on essaie, sans bloquer si le réseau échoue
    await Promise.all(EXTERNES.map((u) => c.add(u).catch(() => {})));
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
