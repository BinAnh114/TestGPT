self.addEventListener('install', event => {
    console.log('Service worker installing...');
    event.waitUntil(
      caches.open('my-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/icon-192.png',
          '/icon-512.png'
        ]);
      })
    );
  });
  
  self.addEventListener("activate", event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName.startsWith("v") && cacheName !== "v1";
            })
            .map(cacheName => {
              return caches.delete(cacheName);
            })
        );
      })
    );
  });

  self.addEventListener('push', function(event) {
    console.log('Received a push event', event);
  
    const title = 'Tiêu đề của Push notification';
    const options = {
      body: 'Đây là nội dung của push notification',
      icon: 'path/to/icon.png',
      badge: 'path/to/badge.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });

  
  self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          console.log('Found in cache:', event.request.url);
          return response;
        }
        console.log('Not found in cache, fetching from network:', event.request.url);
        return fetch(event.request);
      })
    );
  });