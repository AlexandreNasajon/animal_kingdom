"use client"

import Link from "next/link"
import "@/app/menu-styles.css"
import { ArrowLeft, Plus, Search } from "lucide-react"

export default function OnlinePage() {
  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">Vegan</h1>
        <h2 className="subtitle-text">online</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <Link href="/game/online/create" className="w-full">
          <button className="menu-button menu-button-large">
            <Plus className="menu-icon menu-icon-large" strokeWidth={2.5} />
            Create Game
          </button>
        </Link>

        <Link href="/game/online/join" className="w-full">
          <button className="menu-button menu-button-large">
            <Search className="menu-icon menu-icon-large" strokeWidth={2.5} />
            Join Game
          </button>
        </Link>

        <Link href="/game/play-options" className="w-full">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back
          </button>
        </Link>
      </div>
    </div>
  )
}
