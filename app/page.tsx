"use client"

import Link from "next/link"
import "@/app/menu-styles.css"
import { Play, Book, Eye, User, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">BioQuest</h1>
        <h2 className="subtitle-text">card game</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <Link href="/game/play-options" className="w-full">
          <button className="menu-button menu-button-large">
            <Play className="menu-icon menu-icon-large" strokeWidth={2.5} />
            Play
          </button>
        </Link>

        <div className="flex w-full gap-4">
          <Link href="/rules" className="w-1/2">
            <button className="menu-button menu-button-medium">
              <Book className="menu-icon menu-icon-medium" strokeWidth={2.5} />
              Rules
            </button>
          </Link>

          <Link href="/game/deck-gallery" className="w-1/2">
            <button className="menu-button menu-button-medium">
              <Eye className="menu-icon menu-icon-medium" strokeWidth={2.5} />
              Gallery
            </button>
          </Link>
        </div>

        <Link href={user ? "/account" : "/auth/sign-in"} className="w-full">
          <button className="menu-button menu-button-small">
            <User className="menu-icon menu-icon-small" strokeWidth={2.5} />
            {user ? "Account" : "Account"}
          </button>
        </Link>

        <Link href="/settings" className="w-full">
          <button className="menu-button menu-button-small">
            <Settings className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Settings
          </button>
        </Link>
      </div>
    </div>
  )
}
