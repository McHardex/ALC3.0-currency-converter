// Set a name for the current cache
const cacheName = 'currency-converter-v1';

// Default files to always cache
const cacheFiles = [
  './',
  './index.html',
  './src/js/app.js',
  './src/css/styles.css',
  'https://free.currencyconverterapi.com/api/v5/currencies'
]


self.addEventListener('install', (e) => {

  e.waitUntil(
    // Open the cache
    caches.open(cacheName).then((cache) => {
      // Added all the default files to the cache
      return cache.addAll(cacheFiles);
    })
  ); // end e.waitUntil
});


self.addEventListener('activate', (e) => {
  e.waitUntil(
    // Get all the cache keys (cacheName)
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((thisCacheName) => {

        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== cacheName) {

          // Delete that cached file
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      const requestClone = event.request.clone()

      return fetch(requestClone).then(response => {
        const responseClone = response.clone()

        caches.open(cacheName).then(cache => {
          cache.put(event.request, responseClone);
        })
        return response
      })
    })
  )
})

