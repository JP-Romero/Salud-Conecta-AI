// sw.js
const CACHE_NAME = 'salud-conecta-v4';
const urlsToCache = [
  '/',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.gridlayer.googlemutant@0.14.0/dist/Leaflet.GoogleMutant.js'
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

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
            // Guardar en cache recursos externos importantes que no sean de Google Maps API
            // Google Maps API no suele cachearse bien por service worker debido a su naturaleza dinámica
            if (event.request.url.includes('unpkg.com') || event.request.url.includes('openstreetmap.org')) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });
            }
            return response;
        });
      }
    ).catch(function() {
        // Opcional: Fallback si no hay red ni cache
    })
  );
});
