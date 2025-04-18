"use client"

import Link from "next/link"
import "@/app/menu-styles.css"
import { Play, Book, Images, Award, User, LogOut } from "lucide-react"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function HomePage() {
  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
  }

  return (
    <div className="bioquest-bg">
      <MenuBackgroundAnimation />

      <div className="mb-8 sm:mb-16 text-center relative z-10">
        <h1 className="embossed-title text-4xl sm:text-6xl mb-1 sm:mb-2">BioDuel</h1>
        <h2 className="embossed-title text-2xl sm:text-4xl">Card Game</h2>
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-8 w-full max-w-md px-2 sm:px-4 relative z-10">
        <Link href="/game/play-options" className="w-full">
          <button className="menu-button primary-button w-full flex items-center justify-center gap-2">
            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
            Play
          </button>
        </Link>

        <div className="flex w-full gap-3 sm:gap-6">
          <Link href="/rules" className="w-1/2">
            <button className="menu-button secondary-button w-full flex items-center justify-center gap-1 sm:gap-2">
              <Book className="h-3 w-3 sm:h-5 sm:w-5" />
              Rules
            </button>
          </Link>

          <Link href="/game/deck-gallery" className="w-1/2">
            <button className="menu-button secondary-button w-full flex items-center justify-center gap-1 sm:gap-2">
              <Images className="h-3 w-3 sm:h-5 sm:w-5" />
              Gallery
            </button>
          </Link>
        </div>

        {user ? (
          <div className="w-full flex gap-3">
            <div className="w-1/2 text-center py-2 px-3 bg-green-800/30 border border-green-600 rounded-md">
              <p className="text-green-300 text-sm truncate">
                <User className="h-3 w-3 inline-block mr-1" />
                {user.username}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-1/2 menu-button small-button flex items-center justify-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        ) : (
          <Link href="/auth/sign-in" className="w-full">
            <button className="menu-button small-button w-full flex items-center justify-center gap-1 sm:gap-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              Sign In
            </button>
          </Link>
        )}

        <Link href="/credits" className="w-full">
          <button className="menu-button small-button w-full flex items-center justify-center gap-1 sm:gap-2">
            <Award className="h-3 w-3 sm:h-4 sm:w-4" />
            Credits
          </button>
        </Link>
      </div>

      <div className="mt-8 sm:mt-16 text-center text-xs sm:text-sm text-green-200 opacity-70 relative z-10">
        <p>© 2025 NasajonGames</p>
      </div>
    </div>
  )
}
