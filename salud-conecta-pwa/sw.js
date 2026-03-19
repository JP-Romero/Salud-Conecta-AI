// sw.js
const CACHE_NAME = 'salud-conecta-v1';
const urlsToCache = [
  '/',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Devuelve la respuesta del cache si existe, sino hace fetch
        return response || fetch(event.request);
      }
    )
  );
});