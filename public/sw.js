// Versioning
const VERSION = 'v2';
const CORE_CACHE = `vip-core-${VERSION}`;
const IMAGE_CACHE = `vip-img-${VERSION}`;
const RUNTIME_CACHE = `vip-runtime-${VERSION}`;

// Core shell assets (keep minimal)
const CORE = [
  '/',
  '/offline.html',
  '/manifest.json'
];

// Immediate activation path (still allow skipWaiting message)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CORE_CACHE).then(cache => cache.addAll(CORE)).catch(()=>null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => ![CORE_CACHE, IMAGE_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)));
    await clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isImageRequest(url){
  return /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(url.pathname) || (url.hostname.includes('unsplash') || url.hostname.includes('pexels'));
}

function networkFirst(req, cacheName){
  return fetch(req).then(res => {
    const copy = res.clone();
    if (res.ok) caches.open(cacheName).then(c => c.put(req, copy));
    return res;
  }).catch(() => caches.open(cacheName).then(c => c.match(req)).then(cached => cached || new Response('Offline', { status: 503 })));
}

function staleWhileRevalidate(req, cacheName){
  return caches.open(cacheName).then(cache => cache.match(req).then(cached => {
    const fetchPromise = fetch(req).then(res => {
      if (res && res.status === 200) {
        cache.put(req, res.clone()).then(() => {
          if (cacheName === IMAGE_CACHE) enforceImageCacheLimit(cache);
        });
      }
      return res;
    }).catch(()=>null);
    return cached ? Promise.resolve(cached) : fetchPromise.then(r => r || cached);
  }));
}

// Simple LRU-ish eviction: keep insertion order by listing keys; delete oldest if above MAX
const MAX_IMAGES = 60; // tune as needed
async function enforceImageCacheLimit(cache){
  const keys = await cache.keys();
  if (keys.length <= MAX_IMAGES) return;
  const excess = keys.length - MAX_IMAGES;
  for (let i = 0; i < excess; i++) {
    await cache.delete(keys[i]);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  const isNavigate = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isNavigate){
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CORE_CACHE);
        const offline = await cache.match('/offline.html');
        return offline || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      })
    );
    return;
  }

  // Image requests (including third-party Unsplash/Pexels) → stale-while-revalidate
  if (isImageRequest(url)) {
    event.respondWith(staleWhileRevalidate(req, IMAGE_CACHE));
    return;
  }

  // Same-origin JS/CSS (hashed) → cache-first (since they are versioned by build hash)
  if (url.origin === location.origin && /\.(js|css)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res.ok) caches.open(CORE_CACHE).then(c => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }

  // JSON / runtime data (future API) → network-first fallback to runtime cache
  if (/\.json$/i.test(url.pathname)) {
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
    return;
  }

  // Fallback: try runtime cache, else fetch, then populate runtime cache (stale-while-revalidate style)
  event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
});
