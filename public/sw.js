const CACHE_NAME = "bioduel-cache-v1"

// Only cache essential files that we know exist
const urlsToCache = ["/", "/game/play-options", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]

// Install event - cache essential files
self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting()

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(urlsToCache)
      })
      .catch((err) => {
        console.error("Cache addAll error:", err)
        // Continue even if some files fail to cache
        return Promise.resolve()
      }),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return

  // Skip non-HTTP(S) requests
  if (!event.request.url.startsWith("http")) return

  // Skip blob URLs
  if (event.request.url.startsWith("blob:")) return

  // Handle the fetch with a try-catch
  event.respondWith(
    (async () => {
      try {
        // Try to get from network first (network-first strategy)
        const networkResponse = await fetch(event.request)

        // If successful, clone and cache the response
        if (networkResponse && networkResponse.ok && networkResponse.type === "basic") {
          const cache = await caches.open(CACHE_NAME)
          cache.put(event.request, networkResponse.clone())
        }

        return networkResponse
      } catch (error) {
        // If network fails, try to get from cache
        console.log("Fetch failed, trying cache", error)
        const cachedResponse = await caches.match(event.request)
        if (cachedResponse) {
          return cachedResponse
        }

        // If both network and cache fail, return a simple offline page
        if (event.request.headers.get("Accept")?.includes("text/html")) {
          return new Response("You are offline. Please reconnect to continue using BioDuel.", {
            headers: { "Content-Type": "text/html" },
          })
        }

        // For other resources, just let the error happen
        throw error
      }
    })(),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        // Claim clients to control all open windows
        return self.clients.claim()
      }),
  )
})

// Handle errors
self.addEventListener("error", (event) => {
  console.error("Service worker error:", event.error)
})

// Handle unhandled rejections
self.addEventListener("unhandledrejection", (event) => {
  console.error("Service worker unhandled rejection:", event.reason)
})
