// Only register the service worker in production or if explicitly enabled
const shouldRegisterSW = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return false

  // Don't register in development unless explicitly enabled
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return localStorage.getItem("enable_pwa_dev") === "true"
  }

  // Register in production
  return true
}

// More robust service worker registration
const registerServiceWorker = async () => {
  try {
    // Check if service workers are supported
    if ("serviceWorker" in navigator) {
      // Only register if we should
      if (shouldRegisterSW()) {
        // Register the service worker
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })

        console.log("Service Worker registered with scope:", registration.scope)

        // Check for updates every hour
        setInterval(
          () => {
            registration.update().catch((err) => {
              console.error("Service worker update error:", err)
            })
          },
          60 * 60 * 1000,
        )
      } else {
        console.log("Service Worker registration skipped in development")
      }
    }
  } catch (error) {
    console.error("Service Worker registration failed:", error)
  }
}

// Wait for the page to load before registering
if (document.readyState === "complete") {
  registerServiceWorker()
} else {
  window.addEventListener("load", registerServiceWorker)
}

// Handle beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome from automatically showing the prompt
  e.preventDefault()
  // Store the event for later use
  window.deferredPrompt = e
  console.log("Install prompt ready")
})
