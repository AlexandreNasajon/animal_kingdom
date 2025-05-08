"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function DownloadAppPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed or if user has dismissed the popup recently
    if (typeof window !== "undefined") {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true)
        return
      }

      // Check if user has dismissed the popup in the last 3 days
      const lastDismissed = localStorage.getItem("vegan_install_dismissed")
      if (lastDismissed) {
        const dismissedTime = Number.parseInt(lastDismissed, 10)
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000
        if (Date.now() - dismissedTime < threeDaysInMs) {
          return
        }
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        // Prevent Chrome from automatically showing the prompt
        e.preventDefault()
        // Store the event for later use
        setDeferredPrompt(e as BeforeInstallPromptEvent)

        // Show popup immediately
        setShowPopup(true)
      } catch (error) {
        console.error("Error in beforeinstallprompt handler:", error)
      }
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPopup(false)
      setDeferredPrompt(null)
      // Store that the app was installed
      localStorage.setItem("vegan_installed", "true")
    }

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.addEventListener("appinstalled", handleAppInstalled)

      // Check if we should show the popup immediately on page load
      // This is for browsers that fired the beforeinstallprompt event before our listener was attached
      const showInstallPrompt = sessionStorage.getItem("vegan_show_install_prompt")
      if (showInstallPrompt === "true" && !isInstalled) {
        // We'll show a simulated prompt since we don't have the actual event
        setShowPopup(true)
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.removeEventListener("appinstalled", handleAppInstalled)
      }
    }
  }, [isInstalled])

  // Add a second useEffect to handle the case where the component mounts
  // after the beforeinstallprompt event has already fired
  useEffect(() => {
    if (typeof window !== "undefined" && !isInstalled) {
      // Set a flag in sessionStorage to show the prompt on next page load
      // if the beforeinstallprompt event already fired
      sessionStorage.setItem("vegan_show_install_prompt", "true")
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If we don't have the deferred prompt, try to show the native prompt
      // This is a fallback for when the beforeinstallprompt event wasn't captured
      alert("To install Vegan, tap the browser menu button and select 'Add to Home Screen' or 'Install App'")
      setShowPopup(false)
      return
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
        // Store dismissal time
        localStorage.setItem("vegan_install_dismissed", Date.now().toString())
      }

      // Clear the saved prompt as it can't be used again
      setDeferredPrompt(null)
      setShowPopup(false)
      // Clear the session flag
      sessionStorage.removeItem("vegan_show_install_prompt")
    } catch (error) {
      console.error("Error installing PWA:", error)
      setShowPopup(false)
    }
  }

  const handleDismiss = () => {
    setShowPopup(false)
    // Store dismissal time
    localStorage.setItem("vegan_install_dismissed", Date.now().toString())
    // Clear the session flag
    sessionStorage.removeItem("vegan_show_install_prompt")
  }

  if (!showPopup || isInstalled) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-slide-up">
        <div className="relative p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <img src="/icons/icon-192x192.png" alt="Vegan Logo" className="w-12 h-12" />
            </div>

            <h3 className="font-bold">Install Vegan</h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Add Vegan to your home screen for the best experience
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex-1"
              >
                Not Now
              </button>

              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex-1"
              >
                Install App
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 text-xs text-gray-500 dark:text-gray-400">
          This app uses minimal storage and works offline. No app store required.
        </div>
      </div>
    </div>
  )
}
