"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "../menu-styles.css"

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
    <div className="bioquest-bg p-2">
      <div className="mb-2 text-center">
        <h1 className="mb-0 text-5xl font-bold tracking-tight embossed-title">BioQuest</h1>
        <p className="text-2xl embossed-title">Online Play</p>
      </div>

      {mode === "main" && (
        <div className="flex flex-col gap-1 w-full max-w-md">
          <button className="menu-button primary-button" onClick={handlePlayAI}>
            Play Against AI
          </button>

          <button className="menu-button primary-button" onClick={() => setMode("host")}>
            Host Online Game
          </button>

          <button className="menu-button primary-button" onClick={() => setMode("join")}>
            Join Online Game
          </button>

          <Link href="/" className="w-full">
            <button className="menu-button small-button w-full">Back to Menu</button>
          </Link>
        </div>
      )}

      {mode === "host" && (
        <div className="flex flex-col gap-2 w-full max-w-md bg-[#2a5e2a]/80 p-3 rounded-2xl shadow-lg">
          <h2 className="text-2xl embossed-title mb-0">Host Game</h2>

          <p className="text-[#c8f5c8] my-0">You'll be hosting a game with the standard BioQuest deck.</p>

          <div className="flex flex-col gap-1 mt-1">
            <button className="menu-button primary-button" onClick={handleHostGame}>
              Create Room
            </button>

            <button className="menu-button small-button" onClick={() => setMode("main")}>
              Back
            </button>
          </div>
        </div>
      )}

      {mode === "join" && (
        <div className="flex flex-col gap-2 w-full max-w-md bg-[#2a5e2a]/80 p-3 rounded-2xl shadow-lg">
          <h2 className="text-2xl embossed-title mb-0">Join Game</h2>

          <div className="space-y-0">
            <Label htmlFor="roomCode" className="text-[#c8f5c8] text-lg">
              Room Code
            </Label>
            <Input
              id="roomCode"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="border-[#1a3a1a] bg-[#1a3a1a]/70 text-[#c8f5c8] placeholder:text-[#8ab88a] h-10 text-lg"
            />
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <button
              className="menu-button primary-button"
              onClick={handleJoinGame}
              disabled={!roomCode}
              style={{ opacity: !roomCode ? 0.7 : 1 }}
            >
              Join Room
            </button>

            <button className="menu-button small-button" onClick={() => setMode("main")}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
