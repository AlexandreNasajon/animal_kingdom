"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bot, Users } from "lucide-react"
import "@/app/menu-styles.css"

export default function PlayOptionsPage() {
  const router = useRouter()

  const handlePlayMode = (mode: string) => {
    router.push(`/game/deck-selection?mode=${mode}`)
  }

  return (
    <div className="vegan-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">Vegan</h1>
        <h2 className="subtitle-text">card game</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <button onClick={() => handlePlayMode("ai")} className="menu-button menu-button-large">
          <Bot className="menu-icon menu-icon-large" strokeWidth={2.5} />
          Play vs AI
        </button>

        <button onClick={() => handlePlayMode("host")} className="menu-button menu-button-large">
          <Users className="menu-icon menu-icon-large" strokeWidth={2.5} />
          Play Online
        </button>

        <Link href="/" className="w-full">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back
          </button>
        </Link>
      </div>
    </div>
  )
}
