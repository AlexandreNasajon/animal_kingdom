// Skip waiting and immediately activate
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open("bioduel-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/game/play-options",
        "/game/deck-selection",
        "/rules",
        "/credits",
        "/manifest.json",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
      ])
    }),
  )
})

// Activate immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== "bioduel-cache-v1").map((cacheName) => caches.delete(cacheName)),
      )
    }),
  )
})

// Simplified fetch handler to avoid errors
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return

  // Skip non-HTTP(S) requests
  if (!event.request.url.startsWith("http")) return

  // Handle the fetch with a try-catch
  event.respondWith(
    (async () => {
      try {
        // Try to get from cache first
        const cache = await caches.open("bioduel-cache-v1")
        const cachedResponse = await cache.match(event.request)
        if (cachedResponse) return cachedResponse

        // If not in cache, fetch from network
        const response = await fetch(event.request)

        // Only cache successful responses that aren't API calls
        if (response.ok && response.type === "basic" && !event.request.url.includes("/api/")) {
          const responseToCache = response.clone()
          cache.put(event.request, responseToCache)
        }

        return response
      } catch (error) {
        console.error("Fetch handler error:", error)
        // Fall back to network if anything fails
        return fetch(event.request)
      }
    })(),
  )
})
