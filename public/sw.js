const CACHE_NAME = 'furniture-store-v1'
const STATIC_CACHE = 'static-v1'
const IMAGE_CACHE = 'images-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/materials',
  '/info-order',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== IMAGE_CACHE
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle images with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              if (response) return response
              
              return fetch(request)
                .then((networkResponse) => {
                  // Only cache successful responses
                  if (networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone())
                  }
                  return networkResponse
                })
                .catch(() => {
                  // Return placeholder image on network failure
                  return new Response(
                    '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image not available</text></svg>',
                    { headers: { 'Content-Type': 'image/svg+xml' } }
                  )
                })
            })
        })
    )
    return
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          return caches.match(request)
        })
    )
    return
  }

  // Handle navigation requests with cache-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone()
                caches.open(STATIC_CACHE)
                  .then((cache) => cache.put(request, responseClone))
              }
              return networkResponse
            })
        })
        .catch(() => {
          // Return offline page
          return caches.match('/')
        })
    )
    return
  }

  // Default: try cache first, then network
  event.respondWith(
    caches.match(request)
      .then((response) => response || fetch(request))
  )
})