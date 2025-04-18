"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { GameService } from "@/services/game-service"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"

export default function OnlinePage() {
  const [gameId, setGameId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isCreatingAsGuest, setIsCreatingAsGuest] = useState(false)
  const [isJoiningAsGuest, setIsJoiningAsGuest] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [showGuestNameInput, setShowGuestNameInput] = useState(false)
  const [guestAction, setGuestAction] = useState<"host" | "join">("host")
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

  const handleGuestAction = (action: "host" | "join") => {
    setGuestAction(action)
    setShowGuestNameInput(true)
  }

  const handleGuestSubmit = async () => {
    if (!guestName.trim()) {
      setError("Please enter a guest name")
      return
    }

    // Generate a temporary guest ID
    const guestId = `guest-${uuidv4()}`

    // Store guest info in localStorage
    localStorage.setItem("guestId", guestId)
    localStorage.setItem("guestName", guestName)

    if (guestAction === "host") {
      setIsCreatingAsGuest(true)
      setError(null)

      try {
        const gameSession = await GameService.createGameSession(guestId, guestName)
        router.push(`/game/match?id=${gameSession.id}&guestId=${guestId}&guestName=${encodeURIComponent(guestName)}`)
      } catch (err: any) {
        console.error("Error creating game as guest:", err)
        setError(err.message || "Failed to create game")
        setIsCreatingAsGuest(false)
      }
    } else {
      if (!gameId.trim()) {
        setError("Please enter a game ID")
        return
      }

      setIsJoiningAsGuest(true)
      setError(null)

      try {
        await GameService.joinGameSession(gameId, guestId, guestName)
        router.push(`/game/match?id=${gameId}&guestId=${guestId}&guestName=${encodeURIComponent(guestName)}`)
      } catch (err: any) {
        console.error("Error joining game as guest:", err)
        setError(err.message || "Failed to join game")
        setIsJoiningAsGuest(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900/20 to-black">
      <div className="w-full max-w-md bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg">
        <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Online Play</h1>

        {showGuestNameInput ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-green-300 mb-2">
              {guestAction === "host" ? "Host as Guest" : "Join as Guest"}
            </h2>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your guest name"
              className="w-full px-3 py-2 bg-black/50 border border-green-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {guestAction === "join" && (
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter Game ID"
                className="w-full px-3 py-2 bg-black/50 border border-green-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}
            <div className="flex gap-3">
              <Button
                onClick={handleGuestSubmit}
                disabled={isCreatingAsGuest || isJoiningAsGuest}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white"
              >
                {isCreatingAsGuest || isJoiningAsGuest ? "Processing..." : "Continue"}
              </Button>
              <Button
                onClick={() => setShowGuestNameInput(false)}
                variant="outline"
                className="flex-1 border-green-600 hover:bg-green-700/50 text-white"
              >
                Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-green-300 mb-2">Host a Game</h2>
              <p className="text-green-200 mb-4 text-sm">Create a new game and invite a friend to join.</p>
              <div className="space-y-2">
                <Button
                  onClick={handleHostGame}
                  disabled={isCreating || isLoading}
                  className="w-full bg-green-700 hover:bg-green-600 text-white"
                >
                  {isCreating ? "Creating Game..." : "Host Game"}
                </Button>
                <Button
                  onClick={() => handleGuestAction("host")}
                  disabled={isCreatingAsGuest || isLoading}
                  variant="outline"
                  className="w-full border-green-600 hover:bg-green-700/50 text-white"
                >
                  Host as Guest
                </Button>
              </div>
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
                <div className="space-y-2">
                  <Button
                    onClick={handleJoinGame}
                    disabled={isJoining || isLoading}
                    className="w-full bg-green-700 hover:bg-green-600 text-white"
                  >
                    {isJoining ? "Joining Game..." : "Join Game"}
                  </Button>
                  <Button
                    onClick={() => handleGuestAction("join")}
                    disabled={isJoiningAsGuest || isLoading}
                    variant="outline"
                    className="w-full border-green-600 hover:bg-green-700/50 text-white"
                  >
                    Join as Guest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-md p-3 mt-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

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
