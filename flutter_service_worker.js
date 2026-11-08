/*
 * Kill switch for the legacy Flutter web build's service worker.
 *
 * The previous site registered /rakibul-portfolio/flutter_service_worker.js and cached
 * the Flutter app shell. Browsers re-fetch this URL to look for updates, so serving
 * this file at the same path replaces the old worker. It deletes the Flutter caches,
 * unregisters itself and reloads open tabs so returning visitors get the new site.
 * The new site registers no service worker of its own.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const legacy = ['flutter-app-cache', 'flutter-temp-cache', 'flutter-app-manifest'];
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => legacy.includes(k)).map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
