const CACHE = 'plan-maestro-pwa-v2';
const FILES = ['./index.html', './manifest.json', './icons/favicon.svg', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('plan-maestro-pwa-') && key !== CACHE)
      .map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope);
  const isDocument = request.mode === 'navigate' &&
    (url.pathname === scope.pathname || url.pathname === scope.pathname + 'index.html');
  const isAsset = FILES.some(file => new URL(file, scope).pathname === url.pathname);
  if (!isDocument && !isAsset) return;
  const cacheKey = isDocument ? new URL('./index.html', scope).href : request;
  event.respondWith(fetch(request, {cache: 'no-store'}).then(response => {
    if (!response.ok) return response;
    return caches.open(CACHE).then(cache => cache.put(cacheKey, response.clone()))
      .then(() => response, error => {
        console.warn('Could not update the offline cache:', error);
        return response;
      });
  }, () => caches.match(cacheKey).then(cached => {
    if (cached) return cached;
    return new Response('No hay conexión y la aplicación aún no está disponible sin conexión.', {
      status: 503,
      headers: {'Content-Type': 'text/plain; charset=utf-8'}
    });
  })));
});
