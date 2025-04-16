"use client"

import Link from "next/link"
import "@/app/menu-styles.css"

export default function HomePage() {
  return (
    <div className="bioquest-bg">
      <div className="mb-16 text-center">
        <h1 className="embossed-title text-6xl mb-2">BioQuest</h1>
        <h2 className="embossed-title text-4xl">Card Game</h2>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-md px-4">
        <Link href="/game/match" className="w-full">
          <button className="menu-button primary-button w-full">Play</button>
        </Link>

        <div className="flex w-full gap-6">
          <Link href="/rules" className="w-1/2">
            <button className="menu-button secondary-button w-full">Rules</button>
          </Link>

          <Link href="/game/deck-gallery" className="w-1/2">
            <button className="menu-button secondary-button w-full">Gallery</button>
          </Link>
        </div>

        <Link href="/credits" className="w-full">
          <button className="menu-button small-button w-full">Credits</button>
        </Link>
      </div>

      <div className="mt-16 text-center text-sm text-green-200 opacity-70">
        <p>© 2025 NasajonGames</p>
      </div>
    </div>
  )
}
