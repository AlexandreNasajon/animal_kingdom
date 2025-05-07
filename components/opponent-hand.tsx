"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface OpponentHandProps {
  cardCount: number
  isThinking: boolean
  playingCardId: number | null
  aiDrawingCards: boolean
  aiDiscardingCards: boolean | number[]
  aiDrawnCardCount: number
  aiDiscardedCardIds: number[]
  squirrelSelectable?: boolean
  onSquirrelSelection?: (index: number) => void
  setShowSquirrelModal?: (show: boolean) => void
  cards?: any[]
}

export function OpponentHand({
  cardCount,
  isThinking,
  playingCardId,
  aiDrawingCards,
  aiDiscardingCards,
  aiDrawnCardCount,
  aiDiscardedCardIds,
  squirrelSelectable,
  onSquirrelSelection,
  setShowSquirrelModal,
  cards,
}: OpponentHandProps) {
  const [animatingCards, setAnimatingCards] = useState<number[]>([])

  // Set up animation for AI drawing cards
  useEffect(() => {
    if (aiDrawingCards && aiDrawnCardCount > 0) {
      // Create animation card IDs
      const newAnimatingCards = Array.from({ length: aiDrawnCardCount }, (_, i) => i + 1)
      setAnimatingCards(newAnimatingCards)

      // Clean up animation after it completes
      const timer = setTimeout(() => {
        setAnimatingCards([])
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [aiDrawingCards, aiDrawnCardCount])

  // Calculate a fan-like spread for the cards
  const getCardStyles = (index: number, total: number) => {
    const maxRotation = 6
    const maxTranslateY = 5

    // Calculate rotation and position based on position in hand
    const middleIndex = (total - 1) / 2
    const offset = index - middleIndex
    const rotation = (offset / middleIndex) * maxRotation
    const translateY = Math.abs(offset) * maxTranslateY

    return {
      transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
      zIndex: total - Math.abs(offset),
    }
  }

  return (
    <div className="w-full relative">
      {/* AI hand display with better animations */}
      <div className="flex items-center justify-center relative h-[40px] sm:h-[50px]">
        <div className="flex justify-center items-center gap-0.5 relative">
          {[...Array(cardCount)].map((_, i) => {
            // Determine if this is a card being played
            const isPlayingCard = playingCardId !== null && i === cardCount - 1

            return (
              <Card
                key={`opponent-card-${i}`}
                className={`h-[40px] w-[24px] sm:h-[50px] sm:w-[30px] border border-red-800 bg-green-950 shadow-md rounded-sm transition-all duration-300 overflow-hidden ${
                  isPlayingCard ? "animate-card-play" : ""
                }`}
                style={getCardStyles(i, cardCount)}
              >
                {/* Card back pattern */}
                <div className="h-full w-full bg-gradient-to-br from-green-900 to-green-950">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-[80%] w-[80%] border border-green-500/30 rounded-sm"></div>
                  </div>
                </div>
              </Card>
            )
          })}

          {/* AI's thinking indicator */}
          {isThinking && (
            <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-xs text-yellow-300">
              <div className="flex gap-1 items-center">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-100">●</span>
                <span className="animate-pulse delay-200">●</span>
              </div>
            </div>
          )}

          {/* Animated AI drawing cards */}
          {aiDrawingCards && animatingCards.length > 0 && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {animatingCards.map((id) => (
                <div
                  key={`draw-anim-${id}`}
                  className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 h-[40px] w-[24px] sm:h-[50px] sm:w-[30px] border border-red-800 bg-green-950 rounded-sm"
                  style={{
                    animation: `ai-draw-card 1s forwards ${id * 0.2}s`,
                    boxShadow: "0 0 10px rgba(0, 255, 0, 0.3)",
                    zIndex: 50 + id,
                  }}
                >
                  <div className="h-full w-full bg-gradient-to-br from-green-900 to-green-950">
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-[80%] w-[80%] border border-green-500/30 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI discarding cards animation */}
          {aiDiscardingCards && aiDiscardedCardIds.length > 0 && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {aiDiscardedCardIds.map((id, index) => (
                <div
                  key={`discard-anim-${id}`}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[40px] w-[24px] sm:h-[50px] sm:w-[30px] border border-red-800 bg-green-950 rounded-sm"
                  style={{
                    animation: `ai-discard-card 1s forwards ${index * 0.2}s`,
                    boxShadow: "0 0 10px rgba(255, 0, 0, 0.3)",
                    zIndex: 50 + index,
                  }}
                >
                  <div className="h-full w-full bg-gradient-to-br from-green-900 to-green-950">
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-[80%] w-[80%] border border-green-500/30 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {squirrelSelectable && cards && (
        <div className="flex flex-wrap justify-center gap-2 p-2">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onSquirrelSelection && onSquirrelSelection(index)}
            >
              <div className="w-16 h-24 bg-gradient-to-br from-green-700 to-green-900 rounded-md border border-green-500 flex items-center justify-center shadow-md">
                <div className="text-xs text-center text-white p-1">{card.name || "Card"}</div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                ?
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add the new animations */}
      <style jsx global>{`
        @keyframes ai-draw-card {
          0% {
            opacity: 0;
            transform: translate(-50%, -100px) scale(1.5) rotate(10deg);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1.2) rotate(-5deg);
          }
          85% {
            transform: translate(-50%, -10px) scale(1.1) rotate(2deg);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1) rotate(0);
          }
        }
        
        @keyframes ai-discard-card {
          0% {
            opacity: 1;
            transform: translate(-50%, 0) rotate(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 100px) rotate(15deg);
          }
        }
      `}</style>
    </div>
  )
}
