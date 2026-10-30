/* ===== Alquimia Studio - Service Worker ===== */

const CACHE_NAME = 'alquimia-studio-v12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './css/style.css',
  './css/library.css',
  './css/premium.css',
  './js/library.js',
  './js/pdf.min.js',
  './js/pdf.worker.min.js',
  './planners/calma-y-orden.html',
  './planners/planner-anual.html',
  './planners/planner-tdah.html',
  './planners/planner-menstrual.html',
  './planners/planner-semanal.html'
];

// Install: precache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: cache-first with background refresh
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  // Never intercept Google Fonts or non-same-origin requests
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          if (!fetchResponse || fetchResponse.status !== 200) return fetchResponse;
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return fetchResponse;
        });
      })
      .catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return null;
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
