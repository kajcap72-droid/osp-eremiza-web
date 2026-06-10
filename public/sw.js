// Service Worker dla OSP e-Remiza PWA
const CACHE_NAME = 'osp-eremiza-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Instalacja - cache plików
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Aktywacja - usuwanie starych cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - strategia cache-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - zwróć z cache
        if (response) {
          return response;
        }

        // Clone request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Sprawdź czy odpowiedź jest prawidłowa
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nowy alarm!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'jade',
        title: '✅ Jadę',
        icon: '/icon-192.png'
      },
      {
        action: 'nie_jade',
        title: '❌ Nie jadę',
        icon: '/icon-192.png'
      },
    ],
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification('🚒 OSP e-Remiza - ALARM!', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'jade') {
    // Obsługa "Jadę"
    console.log('User confirmed: Jadę');
  } else if (event.action === 'nie_jade') {
    // Obsługa "Nie jadę"
    console.log('User confirmed: Nie jadę');
  }

  event.waitUntil(
    clients.openWindow('/')
  );
});
