"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { GameService } from "@/services/game-service"
import Link from "next/link"

export default function OnlinePage() {
  const [gameId, setGameId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const handleHostGame = async () => {
    if (!user) {
      // Redirect to sign-in page instead of showing modal
      router.push("/auth/sign-in?redirect=/game/online&action=host")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const gameSession = await GameService.createGameSession(user.id!)
      router.push(`/game/match?id=${gameSession.id}`)
    } catch (err: any) {
      console.error("Error creating game:", err)
      setError(err.message || "Failed to create game")
      setIsCreating(false)
    }
  }

  const handleJoinGame = async () => {
    if (!gameId.trim()) {
      setError("Please enter a game ID")
      return
    }

    if (!user) {
      // Redirect to sign-in page instead of showing modal
      router.push(`/auth/sign-in?redirect=/game/online&action=join&gameId=${encodeURIComponent(gameId)}`)
      return
    }

    setIsJoining(true)
    setError(null)

    try {
      await GameService.joinGameSession(gameId, user.id!)
      router.push(`/game/match?id=${gameId}`)
    } catch (err: any) {
      console.error("Error joining game:", err)
      setError(err.message || "Failed to join game")
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900/20 to-black">
      <div className="w-full max-w-md bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg">
        <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Online Play</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-green-300 mb-2">Host a Game</h2>
            <p className="text-green-200 mb-4 text-sm">Create a new game and invite a friend to join.</p>
            <Button
              onClick={handleHostGame}
              disabled={isCreating || isLoading}
              className="w-full bg-green-700 hover:bg-green-600 text-white"
            >
              {isCreating ? "Creating Game..." : "Host Game"}
            </Button>
          </div>

          <div className="border-t border-green-800 pt-6">
            <h2 className="text-lg font-semibold text-green-300 mb-2">Join a Game</h2>
            <p className="text-green-200 mb-4 text-sm">Enter the game ID provided by your friend.</p>
            <div className="space-y-4">
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter Game ID"
                className="w-full px-3 py-2 bg-black/50 border border-green-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                onClick={handleJoinGame}
                disabled={isJoining || isLoading}
                className="w-full bg-green-700 hover:bg-green-600 text-white"
              >
                {isJoining ? "Joining Game..." : "Join Game"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-md p-3 mt-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/game/play-options">
            <Button variant="outline" className="border-green-600 hover:bg-green-700/50 text-white">
              Back to Play Options
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
