"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, Cpu, ArrowLeft } from "lucide-react"
import "@/app/menu-styles.css"

export default function PlayOptionsPage() {
  const router = useRouter()

  const handlePlayMode = (mode: string) => {
    router.push(`/game/deck-selection?mode=${mode}`)
  }

  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">BioQuest</h1>
        <h2 className="subtitle-text">Play Mode</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <button onClick={() => handlePlayMode("host")} className="menu-button menu-button-large">
          <Users className="menu-icon menu-icon-large" strokeWidth={2.5} />
          Online Mode
        </button>

        <button onClick={() => handlePlayMode("ai")} className="menu-button menu-button-large">
          <Cpu className="menu-icon menu-icon-large" strokeWidth={2.5} />
          Against AI
        </button>

        <Link href="/" className="w-full">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back to Menu
          </button>
        </Link>
      </div>
    </div>
  )
}
