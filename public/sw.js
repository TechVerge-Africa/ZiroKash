const CACHE_NAME = 'zirokash-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
// Cache and return requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Ignore API calls, Supabase requests, and non-GET requests (Everything dynamic)
  // Let the browser handle these directly for best real-time performance.
  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/rest') ||
    url.hostname.includes('supabase') || 
    url.hostname.includes('paystack')
  ) {
    return;
  }

  // 2. For HTML (Navigation), use Network First, fallback to cached offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // 3. For Static Assets (CSS, JS, Images), use Stale-While-Revalidate
  // Serve from cache immediately, but update in background
  event.respondWith(
    caches.match(event.request).then(response => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
      return response || fetchPromise;
    })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});