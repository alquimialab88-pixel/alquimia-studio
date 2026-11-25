/* Este service worker solo sirve para despedirse: borra la caché vieja,
   se desregistra y deja que la red sirva la nueva dirección /planora/ */
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys()
      .then(function (claves) {
        return Promise.all(claves.map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.claim(); })
  );
});
