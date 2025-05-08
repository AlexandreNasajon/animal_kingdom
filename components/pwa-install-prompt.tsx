"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (typeof window !== "undefined") {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true)
        return
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Store the event so it can be triggered later
        setDeferredPrompt(e as BeforeInstallPromptEvent)
        // Show the install button
        setIsInstallable(true)
      } catch (error) {
        console.error("Error in beforeinstallprompt handler:", error)
      }
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.addEventListener("appinstalled", handleAppInstalled)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.removeEventListener("appinstalled", handleAppInstalled)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
        setIsInstallable(false)
      } else {
        console.log("User dismissed the install prompt")
      }

      // Clear the saved prompt as it can't be used again
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Error installing PWA:", error)
    }
  }

  // Don't render anything if not installable or already installed
  if (!isInstallable || isInstalled) return null

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-max z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-3">
      <div>
        <h3 className="font-bold">Install Vegan</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Add to your home screen</p>
      </div>
      <Button onClick={handleInstallClick} className="bg-green-500 hover:bg-green-600">
        Install
      </Button>
    </div>
  )
}
