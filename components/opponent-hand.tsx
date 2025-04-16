"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface OpponentHandProps {
  cardCount: number
  isThinking: boolean
  playingCardId?: number // ID of card being played
}

export function OpponentHand({ cardCount, isThinking, playingCardId }: OpponentHandProps) {
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null)

  // Set up animation for playing card
  useEffect(() => {
    if (playingCardId !== undefined) {
      // For simplicity, we'll just animate the first card
      setAnimatedIndex(0)

      // Clear animation class after animation completes
      const timer = setTimeout(() => {
        setAnimatedIndex(null)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [playingCardId])

  return (
    <div className="flex items-center justify-center p-1 pb-0">
      <div className="flex justify-center">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            className={`relative transform transition-all ${index === playingCardId ? "animate-play-card" : ""}`}
            style={{
              marginLeft:
                index > 0 ? (typeof window !== "undefined" && window.innerWidth < 640 ? "-40px" : "-25px") : "0",
              zIndex: index,
            }}
          >
            <Card className="h-[70px] w-[50px] sm:h-[80px] sm:w-[55px] border-2 border-red-700 bg-red-900 shadow-md relative overflow-hidden">
              <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-red-800/20 to-black/30 pointer-events-none"></div>
              <div className="absolute inset-0 border border-red-400/10 rounded-sm pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="card-back-pattern"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full border-2 border-red-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400">AI</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      {isThinking && (
        <div className="absolute right-2 top-2 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-red-500"></div>
        </div>
      )}
    </div>
  )
}
