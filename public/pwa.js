// Only register the service worker in production or if explicitly enabled
if (
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  (window.location.hostname !== "localhost" || window.enablePWA === true)
) {
  window.addEventListener("load", () => {
    try {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope)
        },
        (err) => {
          console.log("ServiceWorker registration failed: ", err)
        },
      )
    } catch (error) {
      console.error("Service worker registration failed:", error)
    }
  })
}
