/**
═══════════════════════════════════════════════════════════════
SERVICE WORKER — Salud-Conecta AI
═══════════════════════════════════════════════════════════════
📌 VERSIÓN: 7.3.0
📌 CAMBIOS v10: Expansión BD Granada + LABORATORIOS
📌 ESTRATEGIAS:
   - Shell (HTML/CSS/JS local): Cache-First
   - Leaflet / CDN:             Cache-First (larga duración)
   - openFDA:                   Network-First con fallback a cache
   - Anthropic API:             Network-Only (nunca cachear respuestas de IA)
   - Google Fonts:              Cache-First (máx. 30 entradas)
   - OpenStreetMap tiles:       Cache-First (máx. 100 tiles)
═══════════════════════════════════════════════════════════════
*/

const CACHE_VERSION   = 'v10';
const CACHE_SHELL     = `salud-conecta-shell-${CACHE_VERSION}`;
const CACHE_CDN       = `salud-conecta-cdn-${CACHE_VERSION}`;
const CACHE_FDA       = `salud-conecta-fda-${CACHE_VERSION}`;
const CACHE_FONTS     = `salud-conecta-fonts-${CACHE_VERSION}`;
const CACHE_MAP_TILES = `salud-conecta-tiles-${CACHE_VERSION}`;

// Todos los nombres de caché actuales (para limpiar versiones viejas)
const ALL_CACHES = [CACHE_SHELL, CACHE_CDN, CACHE_FDA, CACHE_FONTS, CACHE_MAP_TILES];

// Archivos del shell — se cachean en install
const SHELL_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './base-datos-salud.js',
  './manifest.json',
  './imagotipo.jpeg',
  './icon-48.png',
  './icon-72.png',
  './icon-96.png',
  './icon-144.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png'
];

// CDN assets — Leaflet
const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// ─────────────────────────────────────────────
//  INSTALL: pre-cachear shell + CDN
// ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_SHELL).then(cache => {
        console.log('[SW v6] Cacheando shell…');
        return cache.addAll(SHELL_ASSETS);
      }),
      caches.open(CACHE_CDN).then(cache => {
        console.log('[SW v6] Cacheando CDN (Leaflet)…');
        return cache.addAll(CDN_ASSETS);
      })
    ]).then(() => self.skipWaiting())
  );
});

// ─────────────────────────────────────────────
//  ACTIVATE: limpiar cachés de versiones anteriores
// ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !ALL_CACHES.includes(key))
          .map(key => {
            console.log('[SW v6] Eliminando caché viejo:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─────────────────────────────────────────────
//  FETCH: estrategias por tipo de recurso
// ─────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. API de Anthropic — NUNCA cachear (respuestas de IA deben ser siempre frescas)
  if (url.hostname.includes('api.anthropic.com')) {
    return; // Dejar pasar sin interceptar
  }

  // 2. openFDA — Network-First con fallback a caché
  if (url.hostname.includes('api.fda.gov')) {
    event.respondWith(networkFirstStrategy(event.request, CACHE_FDA, 60));
    return;
  }

  // 3. Overpass API (mapa offline) — Network-First con fallback
  if (url.hostname.includes('overpass-api.de')) {
    event.respondWith(networkFirstStrategy(event.request, CACHE_FDA, 20));
    return;
  }

  // 4. Leaflet y otros CDN — Cache-First (no cambian)
  if (url.hostname.includes('unpkg.com') || url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(cacheFirstStrategy(event.request, CACHE_CDN));
    return;
  }

  // 5. Google Fonts — Cache-First con límite de entradas
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirstWithLimit(event.request, CACHE_FONTS, 30));
    return;
  }

  // 6. OpenStreetMap tiles — Cache-First con límite de tiles
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(cacheFirstWithLimit(event.request, CACHE_MAP_TILES, 150));
    return;
  }

  // 7. Shell local (HTML, CSS, JS, manifest) — Network-First (para que las actualizaciones lleguen rápido)
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirstStrategy(event.request, CACHE_SHELL, 20));
    return;
  }

  // 8. Cualquier otra petición — intento de red simple
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ─────────────────────────────────────────────
//  ESTRATEGIAS DE CACHÉ
// ─────────────────────────────────────────────

/**
 * Cache-First: devuelve caché si existe, si no busca en red y guarda.
 */
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Sin red y sin caché — devolver página offline si disponible
    return caches.match('./index.html');
  }
}

/**
 * Cache-First con límite de entradas (para tiles y fuentes).
 * Elimina la entrada más antigua cuando supera maxEntries.
 */
async function cacheFirstWithLimit(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      // Limpiar entradas antiguas
      const keys = await cache.keys();
      if (keys.length > maxEntries) {
        await cache.delete(keys[0]);
      }
    }
    return response;
  } catch {
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

/**
 * Network-First: intenta red primero; si falla usa caché.
 * maxCacheEntries limita el tamaño del caché para esta estrategia.
 */
async function networkFirstStrategy(request, cacheName, maxCacheEntries) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      const keys = await cache.keys();
      if (keys.length > maxCacheEntries) {
        await cache.delete(keys[0]);
      }
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Respuesta de error legible para la app
    return new Response(
      JSON.stringify({ error: 'Sin conexión. Mostrando datos en caché.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ─────────────────────────────────────────────
//  MENSAJES DESDE LA APP (ej. forzar actualización)
// ─────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
