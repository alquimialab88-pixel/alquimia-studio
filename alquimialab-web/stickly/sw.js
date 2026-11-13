/* ==========================================================================
   Stickly · service worker
   Mantiene la app disponible sin conexión y sirve actualizaciones limpias.
   ========================================================================== */

const VERSION = "stickly-v7";
const SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./css/stickly.css",
  "./assets/antonio-1.webp",
  "./assets/antonio-2.webp",
  "./assets/antonio-3.webp",
  "./fonts/roboto-latin.woff2",
  "./fonts/roboto-latin-ext.woff2",
  "./js/app.js",
  "./js/crypto.js",
  "./js/db.js",
  "./js/i18n.js",
  "./js/i18n-base.js",
  "./js/i18n-extra.js",
  "./js/pin.js",
  "./js/pwa.js",
  "./js/store.js",
  "./js/ui.js",
  "./js/screens/calendar.js",
  "./js/screens/home.js",
  "./js/screens/menu.js",
  "./js/screens/note-editor.js",
  "./js/screens/notebook.js",
  "./js/screens/notebooks.js",
  "./js/screens/notes.js",
  "./js/screens/onboarding.js",
  "./js/screens/passwords.js",
  "./js/screens/profile.js",
  "./js/screens/settings.js",
  "./js/screens/task-sheet.js",
  "./js/screens/timer.js",
  "./icons/favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL.map((path) => new Request(new URL(path, self.registration.scope), { cache: "reload" })));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((name) => (name === VERSION ? null : caches.delete(name))));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      return response;
    }
    // Un portal cautivo o un proxy puede devolver 5xx: mejor la copia local.
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    return response;
  } catch (e) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const shell = await cache.match(new URL("./index.html", self.registration.scope));
    if (shell) return shell;
    return new Response("Stickly no está disponible sin conexión todavía.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(request, { ignoreSearch: false });
  if (cached) {
    // Refresca en segundo plano sin bloquear la respuesta.
    fetch(request).then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
    }).catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (e) {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}
