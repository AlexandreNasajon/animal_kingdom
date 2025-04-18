"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AnimationStyles } from "@/components/animation-styles"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@supabase/supabase-js"
import type { GameState } from "@/types/game"

// Helper functions and components will be defined here
const confettiAnimation = `
@keyframes confetti {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
.animate-confetti {
  animation: confetti 3s ease-in-out infinite;
}
`

export function OnlineMatch({ roomCode }: { roomCode: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [showDiscardGallery, setShowDiscardGallery] = useState(false)
  const supabaseRef = useRef<any>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in")
      return
    }

    // Initialize Supabase client
    if (!supabaseRef.current) {
      supabaseRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )
    }

    const setupRoom = async () => {
      try {
        setIsConnecting(true)
        // Here we would check if the room exists, join it, etc.
        // For now, we'll just set a mock game state

        // Mock checking if user is host
        const isUserHost = roomCode.startsWith("host-")
        setIsHost(isUserHost)

        // Mock setting opponent name
        setOpponentUsername(isUserHost ? "Guest Player" : "Room Host")

        // Set mock game state (simple version for now)
        setGameState({
          playerHand: [],
          playerField: [],
          opponentHand: [],
          opponentField: [],
          sharedDeck: [],
          sharedDiscard: [],
          playerPoints: 0,
          opponentPoints: 0,
          currentTurn: isUserHost ? "player" : "opponent",
          gameStatus: "playing",
          message: "Connected to online game. Waiting for opponent to make a move.",
          pendingEffect: null,
        })

        setIsConnecting(false)
      } catch (error) {
        console.error("Error connecting to game room:", error)
        setConnectionError("Failed to connect to the game room. Please try again.")
        setIsConnecting(false)
      }
    }

    setupRoom()

    // Cleanup function
    return () => {
      // Disconnect from real-time subscription, etc.
    }
  }, [roomCode, router, user])

  const handleBackToMenu = () => {
    router.push("/game/online")
  }

  if (isConnecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Connecting to game room {roomCode}...</p>
        </div>
      </div>
    )
  }

  if (connectionError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <div className="text-center bg-red-900/50 p-6 rounded-lg max-w-md">
          <div className="text-red-300 mb-4 text-lg font-bold">Connection Error</div>
          <p className="mb-4">{connectionError}</p>
          <Button onClick={handleBackToMenu} className="bg-green-700 hover:bg-green-600">
            Back to Menu
          </Button>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <p>Loading game...</p>
      </div>
    )
  }

  // Basic game UI - simplified for now
  return (
    <div className="flex flex-col bg-gradient-to-b from-green-800 to-green-950 p-0 text-white w-full h-screen overflow-hidden">
      <AnimationStyles />
      <style jsx global>
        {confettiAnimation}
      </style>

      {/* Header */}
      <div className="flex items-center justify-between p-1 h-8">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToMenu}
          className="flex h-5 items-center gap-1 px-2 py-0 text-[9px] text-green-300"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </Button>
        <div className="text-center text-xs font-bold text-green-300">BioDuel Online - Room: {roomCode}</div>
        <div className="text-[9px] text-green-300">{isHost ? "You are the host" : "You joined this game"}</div>
      </div>

      {/* Main game content - placeholder for now */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center bg-black/20 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">Online Game</h2>
          <p className="mb-4">
            Connected to room: <span className="font-bold">{roomCode}</span>
          </p>
          <p className="mb-4">
            Playing against: <span className="font-bold">{opponentUsername || "Unknown opponent"}</span>
          </p>
          <p className="text-yellow-300">
            Online game mode is still under development. Full functionality will be available soon!
          </p>
        </div>
      </div>

      {/* Placeholder for player hand */}
      <div className="w-full px-2 pb-1 pt-0 bg-green-950/80 border-t border-green-800 h-20">
        {/* Player hand will go here */}
      </div>
    </div>
  )
}
