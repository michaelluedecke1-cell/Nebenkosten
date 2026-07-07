const CACHE_NAME = 'nebenkosten-v1';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Installations-Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache geöffnet');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivierungs-Event – alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch-Event – Cache-Strategie: Network First, Fallback Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Klon der Antwort für den Cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

