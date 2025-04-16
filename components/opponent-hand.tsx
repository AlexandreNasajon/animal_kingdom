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
    <div className="flex justify-center overflow-visible p-1 min-h-[60px]">
      {Array.from({ length: cardCount }).map((_, index) => (
        <div
          key={index}
          className="relative"
          style={{
            marginLeft: index > 0 ? "-12px" : "0", // Make cards overlap more
            zIndex: cardCount - index,
          }}
        >
          <Card
            className={`h-[50px] w-[35px] cursor-not-allowed border border-red-700 bg-red-900 shadow-md
              ${animatedIndex === index ? "animate-ai-play-from-hand" : ""} 
              ${isThinking && index === 0 ? "animate-ai-thinking-card" : ""}
              relative overflow-hidden`}
          >
            {/* Card frame decoration */}
            <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-red-800/20 to-black/30 pointer-events-none"></div>
            <div className="absolute inset-0 border border-red-400/10 rounded-sm pointer-events-none"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="card-back-pattern"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-red-400 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-red-400">AI</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
