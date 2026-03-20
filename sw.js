const CACHE_NAME = 'salud-conecta-v2';

// ✅ Rutas relativas para GitHub Pages
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

// 1. Instalación: Cachear activos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando activos estáticos v2');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. Activación: Limpiar cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Fetch: Estrategia híbrida
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 🚫 PRIVACIDAD: Nunca cachear rutas con datos personales
  if (url.pathname.includes('/api/perfil') || url.pathname.includes('/api/sintomas')) {
    return; 
  }

  // ✅ API Públicas (openFDA): Network First
  if (url.hostname.includes('api.fda.gov')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ✅ Activos Estáticos: Cache First
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
