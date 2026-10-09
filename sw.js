const CACHE_NAME = 'bhajan-app-v2';
const APP_SHELL = [
  './',
  './index.html',
  './bhajan.html',
  './css/index.css',
  './lib/sql-wasm.js',
  './lib/sql-wasm.wasm',
  './db/bhajans.sqlite',
  './scripts/sqlite-db.js',
  './scripts/index.js',
  './scripts/indexdata.js',
  './scripts/ntn.js',
  './scripts/b1.js',
  './scripts/b2.js',
  './scripts/dt.js',
  './scripts/mv.js',
  './scripts/rndimgldr.js',
  './images/favicons/site.webmanifest',
  './images/favicons/android-chrome-192x192.png',
  './images/favicons/android-chrome-512x512.png',
  './images/favicons/favicon-32x32.png',
  './images/favicons/apple-touch-icon.png',
  './images/wm-4.png'
];

function shouldUseNetworkFirst(url) {
  const pathname = url.pathname.toLowerCase();
  return pathname.endsWith('/index.html') ||
    pathname.endsWith('/bhajan.html') ||
    pathname.endsWith('/db/bhajans.sqlite') ||
    pathname.endsWith('/scripts/indexdata.js') ||
    pathname.endsWith('/scripts/b1.js') ||
    pathname.endsWith('/scripts/b2.js') ||
    pathname.endsWith('/scripts/dt.js') ||
    pathname.endsWith('/scripts/mv.js') ||
    pathname.endsWith('/scripts/ntn.js') ||
    pathname.endsWith('/scripts/index.js') ||
    pathname.endsWith('/scripts/sqlite-db.js');
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys
        .filter(function (key) {
          return key !== CACHE_NAME;
        })
        .map(function (key) {
          return caches.delete(key);
        }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy);
          });
          return response;
        })
        .catch(function () {
          return caches.match(request)
            .then(function (cached) {
              if (cached) {
                return cached;
              }

              const pathname = url.pathname.toLowerCase();
              if (pathname.endsWith('/bhajan.html')) {
                return caches.match('./bhajan.html');
              }

              return caches.match('./index.html');
            });
        })
    );
    return;
  }

  if (shouldUseNetworkFirst(url)) {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            if (cached) {
              return cached;
            }
            return caches.match('./index.html');
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) {
        return cached;
      }

      return fetch(request).then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, copy);
        });
        return response;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
