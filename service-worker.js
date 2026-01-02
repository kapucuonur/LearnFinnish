const CACHE_NAME = 'learnfinnish-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/src/styles/variables.css',
  '/src/styles/reset.css',
  '/src/main.js',
  '/manifest.json'
];

// Install - Add files to cache
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened');
        // Add files one by one to handle errors gracefully
        return Promise.allSettled(
          urlsToCache.map(url =>
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('Service Worker: Files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache error:', error);
      })
  );
});

// Activate - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Old cache being removed:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Control all clients immediately
  self.clients.claim();
});

// Fetch - Serve from cache or network
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if exists
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network and cache (stale-while-revalidate strategy)
        return fetch(event.request).then(networkResponse => {
          // Don't cache invalid responses
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        }).catch(() => {
          // Offline fallback (optional)
          // return caches.match('/offline.html');
        });
      })
  );
});