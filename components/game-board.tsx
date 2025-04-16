"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { GameCard } from "@/types/game"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BoardCardZoomModal } from "./board-card-zoom-modal"
import { getCardArt } from "./card-art/card-art-mapper"

interface GameBoardProps {
  cards: GameCard[]
  isOpponent: boolean
  points?: number
  newCardId?: number | null // ID of newly played card to animate
  discardingCardId?: number | null // ID of card being discarded
  returningToDeckCardId?: number | null // ID of card returning to deck
  exchangingCardId?: number | null // ID of card being exchanged
  targetingCardId?: number | null // ID of card being targeted
  onCardDrop?: (card: GameCard) => void // New prop for drag and drop
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

// Helper function to get environment-specific animation
const getEnvironmentAnimation = (environment?: string, id?: number) => {
  // Base animations that cycle based on card ID
  const baseAnimations = ["animate-breathe", "animate-wiggle", "animate-bounce-slow", "animate-sway"]
  const baseAnimation = baseAnimations[(id || 0) % 4]

  // Environment-specific animations
  switch (environment) {
    case "terrestrial":
      return `${baseAnimation} animate-terrestrial`
    case "aquatic":
      return `${baseAnimation} animate-aquatic`
    case "amphibian":
      // Amphibians get a combined animation that includes both terrestrial and aquatic properties
      return `${baseAnimation} animate-amphibian`
    default:
      return baseAnimation
  }
}

// Helper function to get impact card animation
const getImpactAnimation = (id?: number) => {
  const animations = ["animate-pulse-slow", "animate-glow", "animate-rotate-slow"]
  return animations[(id || 0) % 3]
}

// Helper function for zone transfer animations
const getZoneTransferAnimation = (sourceZone: string, targetZone: string) => {
  // Different animations based on source and target zones
  if (sourceZone === "hand" && targetZone === "field") {
    return "animate-hand-to-field"
  } else if (sourceZone === "field" && targetZone === "discard") {
    return "animate-field-to-discard"
  } else if (sourceZone === "field" && targetZone === "deck") {
    return "animate-field-to-deck"
  } else if (sourceZone === "deck" && targetZone === "hand") {
    return "animate-deck-to-hand"
  } else if (sourceZone === "discard" && targetZone === "hand") {
    return "animate-discard-to-hand"
  } else if (sourceZone === "discard" && targetZone === "deck") {
    return "animate-discard-to-deck"
  } else {
    return "animate-zone-transfer" // Generic fallback
  }
}

// Helper function for exchange animations
const getExchangeAnimation = (isSource: boolean) => {
  return isSource ? "animate-exchange-out" : "animate-exchange-in"
}

// Helper function for targeting animations
const getTargetingAnimation = () => {
  return "animate-being-targeted"
}

export function GameBoard({
  cards,
  isOpponent,
  points = 0,
  newCardId,
  discardingCardId,
  returningToDeckCardId,
  exchangingCardId,
  targetingCardId,
  onCardDrop,
}: GameBoardProps) {
  const isWinning = points >= 7
  const [animatedCardId, setAnimatedCardId] = useState<number | null>(null)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null)
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [dropHighlight, setDropHighlight] = useState(false)
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Set up animation for new card
  useEffect(() => {
    if (newCardId) {
      setAnimatedCardId(newCardId)

      // Clear animation class after animation completes
      const timer = setTimeout(() => {
        setAnimatedCardId(null)
      }, 1800) // Increased from 1200 to 1800 for longer animation

      return () => clearTimeout(timer)
    }
  }, [newCardId])

  // Handle card movement animations
  useEffect(() => {
    // Create a function to add and remove animation classes
    const animateCardMovement = (cardId: number | null, animationClass: string, duration: number) => {
      if (cardId && cardRefs.current.has(cardId)) {
        const cardElement = cardRefs.current.get(cardId)
        if (cardElement) {
          // Add the animation class
          cardElement.classList.add(animationClass)

          // Remove the animation class after it completes
          setTimeout(() => {
            if (cardElement) {
              cardElement.classList.remove(animationClass)
            }
          }, duration)
        }
      }
    }

    // Handle discarding animation
    if (discardingCardId) {
      animateCardMovement(discardingCardId, "animate-field-to-discard", 1500) // Increased from 1000 to 1500
    }

    // Handle returning to deck animation
    if (returningToDeckCardId) {
      animateCardMovement(returningToDeckCardId, "animate-field-to-deck", 1500) // Increased from 1000 to 1500
    }

    // Handle exchange animation
    if (exchangingCardId) {
      animateCardMovement(exchangingCardId, "animate-exchange", 1500) // Increased from 1000 to 1500
    }

    // Handle targeting animation
    if (targetingCardId) {
      animateCardMovement(targetingCardId, "animate-being-targeted", 1500) // Increased from 1000 to 1500
    }
  }, [discardingCardId, returningToDeckCardId, exchangingCardId, targetingCardId])

  const handleCardClick = (card: GameCard) => {
    setSelectedCard(card)
    setShowZoomModal(true)
  }

  // Save card element references
  const setCardRef = (element: HTMLDivElement | null, cardId: number) => {
    if (element) {
      cardRefs.current.set(cardId, element)
    } else {
      cardRefs.current.delete(cardId)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    // Only allow dropping on player's field, not opponent's
    if (isOpponent) return

    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDropHighlight(true)
  }

  const handleDragLeave = () => {
    setDropHighlight(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    // Only allow dropping on player's field, not opponent's
    if (isOpponent) return

    e.preventDefault()
    setDropHighlight(false)

    // Get the card index from the drag data
    const cardIndex = e.dataTransfer.getData("text/plain")

    if (cardIndex && onCardDrop) {
      // Notify parent component about the drop
      onCardDrop(Number.parseInt(cardIndex))
    }
  }

  return (
    <>
      <div
        className={`flex min-h-[90px] items-center justify-center gap-2 rounded-lg border ${
          isWinning
            ? `${isOpponent ? "border-yellow-500" : "border-yellow-500"} bg-yellow-900 shadow-inner shadow-yellow-500/30`
            : `${isOpponent ? "border-red-700" : "border-blue-700"} bg-green-950`
        } p-2 transition-all duration-300 ${
          dropHighlight && !isOpponent ? "ring-2 ring-green-400 bg-green-900/50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-zone="field"
        data-player={isOpponent ? "opponent" : "player"}
      >
        {cards.length === 0 ? (
          <div className="flex w-full items-center justify-center p-1 text-xs text-green-500">
            {isOpponent ? "Opponent's field is empty" : "Your field is empty"}
          </div>
        ) : (
          cards.map((card, index) => {
            // Determine which animation to use
            let animationClass = ""

            // Check if this card is being discarded
            if (discardingCardId === card.id) {
              animationClass = "animate-field-to-discard"
            }
            // Check if this card is being returned to deck
            else if (returningToDeckCardId === card.id) {
              animationClass = "animate-field-to-deck"
            }
            // Check if this card is being exchanged
            else if (exchangingCardId === card.id) {
              animationClass = "animate-exchange"
            }
            // Check if this card is being targeted
            else if (targetingCardId === card.id) {
              animationClass = "animate-being-targeted"
            }
            // Otherwise use the normal animations
            else if (animatedCardId === card.id) {
              animationClass = "animate-hand-to-field"
            }
            // Idle animations based on card type and environment
            else if (card.type === "animal") {
              animationClass = getEnvironmentAnimation(card.environment, card.id)
            } else {
              // For impact cards, use a more dynamic animation
              animationClass = getImpactAnimation(card.id)
            }

            return (
              <div
                key={card.id}
                className="card-zoom-container"
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                onClick={() => handleCardClick(card)}
                ref={(el) => setCardRef(el, card.id)}
              >
                <Card
                  className={`h-[90px] w-[70px] ${
                    card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                  } shadow-md card-zoom ${animationClass} relative overflow-hidden cursor-pointer transition-all duration-300`}
                  data-card-id={card.id}
                  data-card-type={card.type}
                  data-card-environment={card.environment}
                  data-zone="field"
                >
                  {/* Card frame decoration */}
                  <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                  <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                  {/* Animation overlay for special effects */}
                  {(discardingCardId === card.id ||
                    returningToDeckCardId === card.id ||
                    exchangingCardId === card.id ||
                    targetingCardId === card.id) && (
                    <div className="absolute inset-0 bg-white/20 z-10 pointer-events-none animate-flash"></div>
                  )}

                  <CardContent className="flex h-full flex-col items-center justify-center p-0">
                    <div className="relative h-full w-full overflow-hidden">
                      {/* Use card art based on name */}
                      {getCardArt(card)}

                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-0.5 text-center text-[10px]">
                        {card.name}
                        {card.points && <span className="ml-1 font-bold text-yellow-400">({card.points})</span>}
                      </div>
                    </div>
                  </CardContent>
                  {card.points && (
                    <div className="absolute top-1 left-1 bg-yellow-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {card.points}
                    </div>
                  )}
                </Card>

                {/* Enlarged card preview on hover */}
                {hoveredCardIndex === index && (
                  <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 z-50 pointer-events-none">
                    <Card
                      className={`h-[180px] w-[130px] border-2 ${
                        card.type === "animal"
                          ? getEnvironmentColor(card.environment)
                          : "border-purple-600 bg-purple-900"
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
                              {card.points && (
                                <div className="absolute top-1 left-1 bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                  {card.points}
                                </div>
                              )}
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
          })
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
