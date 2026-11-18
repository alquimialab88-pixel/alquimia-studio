const CACHE_NAME = "aurify-v11";
const OLD_PREFIXES = ["aurify-", "alquimia-cotiza-"];
const APP_SHELL = [
  "./",
  "./index.html",
  "./lang.js",
  "./licencia.js",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./fonts/roboto-latin.woff2",
  "./fonts/roboto-latin-ext.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) =>
        OLD_PREFIXES.some((prefix) => key.startsWith(prefix)) && key !== CACHE_NAME
      ).map((key) => caches.delete(key)))
    ),
    self.clients.claim()
  ]));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          return caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).then(() => response);
        }
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        if (response.ok && url.pathname.startsWith(new URL("./", self.location.href).pathname)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
    )
  );
});
