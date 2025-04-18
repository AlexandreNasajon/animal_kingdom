"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { GameService } from "@/services/game-service"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import "../menu-styles.css"

export default function OnlinePlay() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [mode, setMode] = useState<"main" | "host" | "join">("main")
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, isLoading, router])

  const handleHostGame = async () => {
    if (!user) {
      setError("You must be signed in to host a game")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const gameSession = await GameService.createGameSession(user.id)
      router.push(`/game/match?mode=host&room=${gameSession.room_code}`)
    } catch (err: any) {
      setError(err.message || "Failed to create game")
      setIsCreating(false)
    }
  }

  const handleJoinGame = async () => {
    if (!user) {
      setError("You must be signed in to join a game")
      return
    }

    setIsJoining(true)
    setError(null)

    try {
      await GameService.joinGameSession(roomCode, user.id)
      router.push(`/game/match?mode=join&room=${roomCode}`)
    } catch (err: any) {
      setError(err.message || "Failed to join game")
      setIsJoining(false)
    }
  }

  const handlePlayAI = () => {
    router.push(`/game/match?mode=ai`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bioquest-bg">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bioquest-bg p-2 min-h-screen">
      <MenuBackgroundAnimation />
      <div className="relative z-10">
        <div className="mb-2 text-center">
          <h1 className="mb-0 text-5xl font-bold tracking-tight embossed-title">Bioquest</h1>
          <p className="text-2xl embossed-title">Online Play</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-900 border-red-700 max-w-md mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mode === "main" && (
          <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
            <button className="menu-button primary-button" onClick={handlePlayAI}>
              Play Against AI
            </button>

            <button className="menu-button primary-button" onClick={() => setMode("host")}>
              Host Online Game
            </button>

            <button className="menu-button primary-button" onClick={() => setMode("join")}>
              Join Online Game
            </button>

            <Link href="/game/play-options" className="w-full">
              <button className="menu-button small-button w-full">Back</button>
            </Link>
          </div>
        )}

        {mode === "host" && (
          <div className="flex flex-col gap-2 w-full max-w-md mx-auto bg-[#2a5e2a]/80 p-3 rounded-2xl shadow-lg">
            <h2 className="text-2xl embossed-title mb-0">Host Game</h2>

            <p className="text-[#c8f5c8] my-0">You'll be hosting a game with the standard Bioquest deck.</p>

            <div className="flex flex-col gap-1 mt-1">
              <button className="menu-button primary-button" onClick={handleHostGame} disabled={isCreating}>
                {isCreating ? "Creating Room..." : "Create Room"}
              </button>

              <button className="menu-button small-button" onClick={() => setMode("main")}>
                Back
              </button>
            </div>
          </div>
        )}

        {mode === "join" && (
          <div className="flex flex-col gap-2 w-full max-w-md mx-auto bg-[#2a5e2a]/80 p-3 rounded-2xl shadow-lg">
            <h2 className="text-2xl embossed-title mb-0">Join Game</h2>

            <div className="space-y-0">
              <Label htmlFor="roomCode" className="text-[#c8f5c8] text-lg">
                Room Code
              </Label>
              <Input
                id="roomCode"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="border-[#1a3a1a] bg-[#1a3a1a]/70 text-[#c8f5c8] placeholder:text-[#8ab88a] h-10 text-lg"
              />
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <button
                className="menu-button primary-button"
                onClick={handleJoinGame}
                disabled={!roomCode || isJoining}
                style={{ opacity: !roomCode ? 0.7 : 1 }}
              >
                {isJoining ? "Joining Game..." : "Join Room"}
              </button>

              <button className="menu-button small-button" onClick={() => setMode("main")}>
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
