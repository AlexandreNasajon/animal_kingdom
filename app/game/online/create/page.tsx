"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { GameService } from "@/services/game-service"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"

export default function CreateGamePage() {
  const [gameSession, setGameSession] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const deckId = searchParams.get("deck") || "1"
  const guestId = searchParams.get("guestId")
  const guestName = searchParams.get("guestName")
  const { user, isLoading } = useAuth()

  useEffect(() => {
    const createGame = async () => {
      try {
        setIsCreating(true)
        setError(null)

        // Use either the authenticated user ID or the guest ID
        const playerId = user?.id || guestId || ""
        const playerName = guestName || undefined

        if (!playerId) {
          throw new Error("No player ID available")
        }

        // Create the game session with the selected deck
        const session = await GameService.createGameSession(playerId, playerName, Number.parseInt(deckId))
        setGameSession(session)
      } catch (err: any) {
        console.error("Error creating game:", err)
        setError(err.message || "Failed to create game")
      } finally {
        setIsCreating(false)
      }
    }

    if (!isLoading) {
      createGame()
    }
  }, [user, isLoading, deckId, guestId, guestName])

  const handleCopyRoomCode = () => {
    if (gameSession?.id) {
      navigator.clipboard.writeText(gameSession.id)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleStartGame = () => {
    if (gameSession?.id) {
      const queryParams = new URLSearchParams()
      queryParams.append("mode", "host")
      queryParams.append("room", gameSession.id)

      if (guestId && guestName) {
        queryParams.append("guestId", guestId)
        queryParams.append("guestName", guestName)
      }

      router.push(`/game/match?${queryParams.toString()}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900/20 to-black">
      <MenuBackgroundAnimation />

      <div className="w-full max-w-md bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-400 text-center">Game Created</h1>
          <p className="text-green-200 text-sm text-center mt-2">Share this room code with your friend to join</p>
        </div>

        {isCreating ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500 rounded-md p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
            <Button
              onClick={() => router.push("/game/deck-selection?mode=host")}
              className="mt-4 w-full bg-red-700 hover:bg-red-600 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : gameSession ? (
          <>
            <Card className="mb-6 bg-green-900/30 border-green-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-xl font-mono text-green-300">{gameSession.id}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyRoomCode}
                    className="border-green-600 hover:bg-green-700/50 text-white"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2">{isCopied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button onClick={handleStartGame} className="w-full bg-green-700 hover:bg-green-600 text-white h-12">
                Start Game
              </Button>
              <p className="text-green-200 text-sm text-center">Waiting for opponent to join...</p>
            </div>
          </>
        ) : null}

        <div className="mt-6 flex justify-start">
          <Link href="/game/deck-selection?mode=host">
            <Button variant="outline" className="border-green-600 hover:bg-green-700/50 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
