const CACHE_NAME = 'jenks-alpha-voice-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Core assets for offline functionality
  'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3C/svg%3E'
];

// Install event - cache core resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Jenks Alpha: Caching core assets for voice trading platform');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request for fetch
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if response is valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response for cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      }
    )
  );
});

// Push notification handling for trading alerts
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New trading alert from Jenks Alpha',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100, 50, 100],
    tag: 'trading-alert',
    renotify: true,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'trading-alert',
      url: '/'
    },
    actions: [
      {
        action: 'voice-check',
        title: '🎤 Voice Check',
        icon: '/icons/voice-icon.png'
      },
      {
        action: 'portfolio',
        title: '📊 Portfolio',
        icon: '/icons/portfolio-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Jenks Alpha Alert', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const action = event.action;
  const url = event.notification.data.url || '/';

  if (action === 'voice-check') {
    event.waitUntil(
      clients.openWindow(url + '?action=voice&command=portfolio')
    );
  } else if (action === 'portfolio') {
    event.waitUntil(
      clients.openWindow(url + '?action=portfolio')
    );
  } else if (action !== 'dismiss') {
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'voice-command') {
    event.waitUntil(
      // Handle offline voice commands when connection returns
      syncVoiceCommands()
    );
  }
});

// Sync voice commands function
function syncVoiceCommands() {
  return new Promise((resolve) => {
    // Get stored voice commands from IndexedDB or localStorage
    // Send them to server when online
    console.log('Syncing offline voice commands...');
    resolve();
  });
}

// Update cache when new version available
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Jenks Alpha: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle voice trading specific events
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'VOICE_COMMAND') {
    // Process voice command
    const command = event.data.command;
    console.log('Voice command received:', command);
    
    // Store command if offline for later sync
    if (!navigator.onLine) {
      storeOfflineVoiceCommand(command);
    }
    
    // Send response back to client
    event.ports[0].postMessage({
      type: 'VOICE_RESPONSE',
      response: `Processing voice command: ${command}`
    });
  }
});

function storeOfflineVoiceCommand(command) {
  // Store in IndexedDB or localStorage for later sync
  const commands = JSON.parse(localStorage.getItem('offlineVoiceCommands') || '[]');
  commands.push({
    command: command,
    timestamp: Date.now()
  });
  localStorage.setItem('offlineVoiceCommands', JSON.stringify(commands));
}