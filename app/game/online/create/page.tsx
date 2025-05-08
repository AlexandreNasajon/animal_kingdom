"use client"

import { useState } from "react"
import Link from "next/link"
import "@/app/menu-styles.css"
import { ArrowLeft, Copy, Share2 } from "lucide-react"
import { createGame } from "@/services/game-server-actions"

export default function CreateGamePage() {
  const [gameId, setGameId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCreateGame = async () => {
    setIsCreating(true)
    try {
      const id = await createGame()
      setGameId(id)
    } catch (error) {
      console.error("Failed to create game:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = () => {
    if (!gameId) return
    navigator.clipboard.writeText(gameId).then(
      () => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  const shareGame = () => {
    if (!gameId) return
    if (navigator.share) {
      navigator.share({
        title: "Join my Vegan game!",
        text: "Join my Vegan game with this code: " + gameId,
        url: window.location.origin + "/game/online/join?code=" + gameId,
      })
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">Vegan</h1>
        <h2 className="subtitle-text">create game</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        {!gameId ? (
          <button
            className={`menu-button menu-button-large ${isCreating ? "opacity-70" : ""}`}
            onClick={handleCreateGame}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create New Game"}
          </button>
        ) : (
          <>
            <div className="bg-white/10 p-4 rounded-lg text-center">
              <p className="text-white mb-2">Game Code:</p>
              <p className="text-2xl font-bold text-white mb-4">{gameId}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copySuccess ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={shareGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
            <Link href={`/game/online/lobby/${gameId}`} className="w-full">
              <button className="menu-button menu-button-large">Continue to Lobby</button>
            </Link>
          </>
        )}

        <Link href="/game/online" className="w-full">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back
          </button>
        </Link>
      </div>
    </div>
  )
}
