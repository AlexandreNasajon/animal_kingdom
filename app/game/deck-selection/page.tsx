"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"

export default function DeckSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const roomCode = searchParams.get("room")
  const guestId = searchParams.get("guestId")
  const guestName = searchParams.get("guestName")

  useEffect(() => {
    // Store the selected deck in localStorage (always 1 for advanced deck)
    localStorage.setItem("selectedDeck", "1")

    // Determine where to navigate based on the mode
    if (mode === "ai") {
      router.push(`/game/match?mode=ai&deck=1`)
    } else if (mode === "host") {
      // For hosting, we'll include the deck selection
      if (guestId && guestName) {
        router.push(`/game/online/create?deck=1&guestId=${guestId}&guestName=${encodeURIComponent(guestName || "")}`)
      } else {
        router.push(`/game/online/create?deck=1`)
      }
    } else if (mode === "join" && roomCode) {
      // For joining, we'll just pass along the room code
      if (guestId && guestName) {
        router.push(
          `/game/match?mode=join&room=${roomCode}&guestId=${guestId}&guestName=${encodeURIComponent(guestName || "")}`,
        )
      } else {
        router.push(`/game/match?mode=join&room=${roomCode}`)
      }
    } else {
      // Default fallback
      router.push("/game/play-options")
    }
  }, [mode, roomCode, guestId, guestName, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900/20 to-black">
      <MenuBackgroundAnimation />
      <div className="w-full max-w-md bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-400 text-center">Loading Game</h1>
          <p className="text-green-200 text-sm text-center mt-2">Preparing your BioDuel experience...</p>
        </div>
      </div>
    </div>
  )
}
