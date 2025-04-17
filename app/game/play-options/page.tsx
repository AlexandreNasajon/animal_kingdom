"use client"

import Link from "next/link"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"
import { Users, Cpu, ArrowLeft } from "lucide-react"
import "@/app/menu-styles.css"

export default function PlayOptionsPage() {
  return (
    <div className="bioquest-bg">
      <MenuBackgroundAnimation />

      <div className="mb-6 sm:mb-8 text-center relative z-10">
        <h1 className="embossed-title text-3xl sm:text-5xl mb-1 sm:mb-2">BioQuest</h1>
        <h2 className="embossed-title text-xl sm:text-3xl">Play Mode</h2>
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-md mx-auto px-2 sm:px-4 relative z-10">
        <Link href="/game/online" className="w-full">
          <button className="menu-button primary-button w-full flex items-center justify-center gap-2 sm:gap-3">
            <Users className="h-4 w-4 sm:h-6 sm:w-6" />
            Online Mode
          </button>
        </Link>

        <Link href="/game/match?mode=ai" className="w-full">
          <button className="menu-button primary-button w-full flex items-center justify-center gap-2 sm:gap-3">
            <Cpu className="h-4 w-4 sm:h-6 sm:w-6" />
            Against AI
          </button>
        </Link>

        <Link href="/" className="w-full mt-2 sm:mt-4">
          <button className="menu-button small-button w-full flex items-center justify-center gap-1 sm:gap-2">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Menu
          </button>
        </Link>
      </div>

      <div className="mt-8 sm:mt-16 text-center text-xs sm:text-sm text-green-200 opacity-70 relative z-10">
        <p>© 2025 NasajonGames</p>
      </div>
    </div>
  )
}
