"use client"

import { useState, useEffect, useRef } from "react"
import type { GameCard } from "@/types/game"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCardArt } from "./card-art/card-art-mapper"

interface PlayerHandProps {
  cards: GameCard[]
  onSelectCard: (cardIndex: number) => void
  disabled: boolean
  newCardIds?: number[] // IDs of newly drawn cards to animate
  playingCardId?: number // ID of card being played
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

export function PlayerHand({ cards, onSelectCard, disabled, newCardIds = [], playingCardId }: PlayerHandProps) {
  const [animatedCardIds, setAnimatedCardIds] = useState<number[]>([])
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Set up animation for new cards
  useEffect(() => {
    if (newCardIds.length > 0) {
      setAnimatedCardIds(newCardIds)

      // Clear animation classes after animation completes
      const timer = setTimeout(() => {
        setAnimatedCardIds([])
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [newCardIds])

  // Handle mouse enter/leave for card zoom effect
  const handleMouseEnter = (index: number) => {
    if (!disabled) {
      setHoveredCardIndex(index)
    }
  }

  const handleMouseLeave = () => {
    setHoveredCardIndex(null)
  }

  return (
    <div ref={containerRef} className="flex justify-center overflow-visible p-1 min-h-[120px]">
      {cards.map((card, index) => {
        const isHovered = hoveredCardIndex === index
        const isPlaying = card.id === playingCardId
        const isAnimating = animatedCardIds.includes(card.id)

        return (
          <div
            key={card.id}
            className="card-zoom-container"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            style={{
              marginLeft: index > 0 ? "-15px" : "0", // Make cards overlap
              zIndex: isHovered ? 10 : cards.length - index,
            }}
          >
            <Card
              className={`h-[90px] w-[65px] cursor-pointer border card-zoom ${
                card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
              } p-0.5 shadow-md ${disabled ? "opacity-70" : ""} 
                ${isAnimating ? "animate-draw" : ""} 
                ${
                  isPlaying
                    ? card.type === "impact"
                      ? "animate-play-impact"
                      : card.environment === "aquatic"
                        ? "animate-play-aquatic"
                        : card.environment === "terrestrial"
                          ? "animate-play-terrestrial"
                          : card.environment === "amphibian"
                            ? "animate-play-amphibian"
                            : "animate-play-animal"
                    : ""
                }
                relative overflow-hidden`}
              onClick={() => !disabled && onSelectCard(index)}
              style={{
                animationDelay: `${animatedCardIds.indexOf(card.id) * 0.15}s`,
                zIndex: isHovered ? 10 : 1,
              }}
            >
              {/* Card frame decoration */}
              <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
              <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

              <CardContent className="flex h-full flex-col items-center justify-between p-0.5">
                <div className="w-full text-center text-[10px] font-medium">{card.name}</div>

                <div className="relative h-[50px] w-full overflow-hidden">{getCardArt(card)}</div>

                <div className="w-full px-0.5">
                  {card.type === "animal" ? (
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`${getEnvironmentBadgeColor(card.environment)} text-[8px] px-0.5 py-0`}
                      >
                        {card.environment}
                      </Badge>
                      <Badge className="bg-yellow-600 text-[8px] px-0.5 py-0">{card.points} pts</Badge>
                    </div>
                  ) : (
                    <div className="text-center text-[8px] text-gray-300 line-clamp-1">{card.effect}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enlarged card preview on hover */}
            {isHovered && (
              <div
                className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 z-50 pointer-events-none"
                style={{ display: disabled ? "none" : "block" }}
              >
                <Card
                  className={`h-[200px] w-[140px] border-2 ${
                    card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                  } p-1 shadow-xl relative overflow-hidden`}
                >
                  {/* Card frame decoration */}
                  <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                  <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                  <CardContent className="flex h-full flex-col items-center justify-between p-1">
                    <div className="w-full text-center text-xs font-medium">{card.name}</div>

                    <div className="relative h-[110px] w-full">{getCardArt(card)}</div>

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
        )
      })}
    </div>
  )
}
