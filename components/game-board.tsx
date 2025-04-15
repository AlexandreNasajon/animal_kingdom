"use client"

import { useState, useEffect } from "react"
import type { GameCard } from "@/types/game"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BoardCardZoomModal } from "./board-card-zoom-modal"
import { getCardArt } from "./card-art/card-art-mapper"

interface GameBoardProps {
  cards: GameCard[]
  isOpponent: boolean
  points?: number
  newCardId?: number // ID of newly played card to animate
}

// Helper function to get environment color
const getEnvironmentColor = (environment?: string) => {
  switch (environment) {
    case "terrestrial":
      return "border-red-600 bg-red-900"
    case "aquatic":
      return "border-blue-600 bg-blue-900"
    case "amphibian":
      return "border-green-600 bg-green-900"
    default:
      return "border-gray-600 bg-gray-800"
  }
}

// Helper function to get environment badge color
const getEnvironmentBadgeColor = (environment?: string) => {
  switch (environment) {
    case "terrestrial":
      return "bg-red-900 text-red-200"
    case "aquatic":
      return "bg-blue-900 text-blue-200"
    case "amphibian":
      return "bg-green-900 text-green-200"
    default:
      return "bg-gray-900 text-gray-200"
  }
}

export function GameBoard({ cards, isOpponent, points = 0, newCardId }: GameBoardProps) {
  const isWinning = points >= 7
  const [animatedCardId, setAnimatedCardId] = useState<number | null>(null)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null)
  const [showZoomModal, setShowZoomModal] = useState(false)

  // Set up animation for new card
  useEffect(() => {
    if (newCardId) {
      setAnimatedCardId(newCardId)

      // Clear animation class after animation completes
      const timer = setTimeout(() => {
        setAnimatedCardId(null)
      }, 1200) // Increased for longer animation

      return () => clearTimeout(timer)
    }
  }, [newCardId])

  const handleCardClick = (card: GameCard) => {
    setSelectedCard(card)
    setShowZoomModal(true)
  }

  return (
    <>
      <div
        className={`flex min-h-[70px] items-center gap-1 rounded-lg border ${
          isWinning
            ? `${isOpponent ? "border-yellow-500" : "border-yellow-500"} bg-yellow-900 shadow-inner shadow-yellow-500/30`
            : `${isOpponent ? "border-red-700" : "border-blue-700"} bg-green-950`
        } p-1 ${isOpponent ? "justify-end" : "justify-start"} transition-all duration-300`}
      >
        {cards.length === 0 ? (
          <div className="flex w-full items-center justify-center p-0.5 text-[8px] text-green-500">
            {isOpponent ? "Opponent's field is empty" : "Your field is empty"}
          </div>
        ) : (
          cards.map((card, index) => (
            <div
              key={card.id}
              className="card-zoom-container"
              onMouseEnter={() => setHoveredCardIndex(index)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              onClick={() => handleCardClick(card)}
            >
              <Card
                className={`h-[70px] w-[50px] ${
                  card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                } shadow-md card-zoom ${
                  animatedCardId === card.id
                    ? isOpponent
                      ? "animate-ai-play border-2 border-red-500"
                      : "animate-appear"
                    : ""
                } relative overflow-hidden cursor-pointer`}
              >
                {/* Card frame decoration */}
                <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                <CardContent className="flex h-full flex-col items-center justify-center p-0">
                  <div className="relative h-full w-full overflow-hidden">
                    {/* Use card art based on name */}
                    {getCardArt(card)}

                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-0.5 text-center text-[8px]">
                      {card.name}
                      {card.points && <span className="ml-1 font-bold text-yellow-400">({card.points})</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enlarged card preview on hover */}
              {hoveredCardIndex === index && (
                <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 z-50 pointer-events-none">
                  <Card
                    className={`h-[180px] w-[130px] border-2 ${
                      card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                    } p-1 shadow-xl relative overflow-hidden`}
                  >
                    {/* Card frame decoration */}
                    <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                    <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                    <CardContent className="flex h-full flex-col items-center justify-between p-1">
                      <div className="w-full text-center text-xs font-medium">{card.name}</div>

                      <div className="relative h-[100px] w-full">{getCardArt(card)}</div>

                      <div className="w-full">
                        {card.type === "animal" ? (
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={`${getEnvironmentBadgeColor(card.environment)} text-[9px]`}
                            >
                              {card.environment}
                            </Badge>
                            <Badge className="bg-yellow-600 text-[9px]">{card.points} pts</Badge>
                          </div>
                        ) : (
                          <div className="text-center text-[9px] text-gray-300">{card.effect}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Card Zoom Modal */}
      <BoardCardZoomModal
        open={showZoomModal}
        onClose={() => setShowZoomModal(false)}
        card={selectedCard}
        isOpponentCard={isOpponent}
      />
    </>
  )
}
