"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, LogIn, Bot } from "lucide-react"

export default function OnlinePlay() {
  const router = useRouter()
  const [mode, setMode] = useState<"main" | "host" | "join">("main")
  const [roomCode, setRoomCode] = useState("")

  const handleHostGame = () => {
    console.log("Hosting game")
    router.push(`/game/match?mode=host`)
  }

  const handleJoinGame = () => {
    console.log("Joining room:", roomCode)
    router.push(`/game/match?mode=join&room=${roomCode}`)
  }

  const handlePlayAI = () => {
    console.log("Playing against AI")
    router.push(`/game/match?mode=ai`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-5xl font-bold tracking-tight">Animal Kingdom</h1>
        <p className="text-xl text-green-200">Online Play</p>
      </div>

      {mode === "main" && (
        <Card className="w-full max-w-md border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardContent className="p-6">
            <div className="grid gap-4">
              <Button
                className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                size="lg"
                onClick={handlePlayAI}
              >
                <Bot className="h-5 w-5" />
                <span>Play Against AI</span>
              </Button>

              <Button
                className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                size="lg"
                onClick={() => setMode("host")}
              >
                <Plus className="h-5 w-5" />
                <span>Host Online Game</span>
              </Button>

              <Button
                className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                size="lg"
                onClick={() => setMode("join")}
              >
                <LogIn className="h-5 w-5" />
                <span>Join Online Game</span>
              </Button>

              <Link href="/game/menu">
                <Button className="flex w-full items-center justify-start gap-3" variant="outline" size="lg">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Menu</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "host" && (
        <Card className="w-full max-w-md border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Host Game</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <p className="text-green-200">You'll be hosting a game with the standard Animal Kingdom deck.</p>

              <div className="grid gap-4">
                <Button className="w-full bg-green-700 hover:bg-green-600" size="lg" onClick={handleHostGame}>
                  Create Room
                </Button>

                <Button className="w-full" variant="outline" size="lg" onClick={() => setMode("main")}>
                  Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "join" && (
        <Card className="w-full max-w-md border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Join Game</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="roomCode" className="text-white">
                  Room Code
                </Label>
                <Input
                  id="roomCode"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="border-green-700 bg-green-950/50 text-white placeholder:text-green-500"
                />
              </div>

              <div className="grid gap-4">
                <Button
                  className="w-full bg-green-700 hover:bg-green-600"
                  size="lg"
                  onClick={handleJoinGame}
                  disabled={!roomCode}
                >
                  Join Room
                </Button>

                <Button className="w-full" variant="outline" size="lg" onClick={() => setMode("main")}>
                  Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
