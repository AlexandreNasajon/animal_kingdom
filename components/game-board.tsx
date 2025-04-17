"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { GameCard } from "@/types/game"
import { Card } from "@/components/ui/card"
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
      return "bg-red-900 text-white"
    case "aquatic":
      return "bg-blue-900 text-white"
    case "amphibian":
      return "bg-green-900 text-white"
    default:
      return "bg-gray-900 text-white"
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
  const [activeAnimations, setActiveAnimations] = useState<Set<number>>(new Set())
  const [viewportWidth, setViewportWidth] = useState(0)

  // Track viewport size for responsive adjustments
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth)
    }

    // Set initial value
    updateViewportWidth()

    // Add event listener
    window.addEventListener("resize", updateViewportWidth)

    // Clean up
    return () => window.removeEventListener("resize", updateViewportWidth)
  }, [])

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

  const startAnimation = (cardId: number) => {
    setActiveAnimations((prev) => {
      const newSet = new Set(prev)
      newSet.add(cardId)
      return newSet
    })
  }

  const endAnimation = (cardId: number) => {
    setActiveAnimations((prev) => {
      const newSet = new Set(prev)
      newSet.delete(cardId)
      return newSet
    })
  }

  // Handle card movement animations
  useEffect(() => {
    // Create a function to add and remove animation classes
    const animateCardMovement = (cardId: number | null, animationClass: string, duration: number) => {
      if (cardId && cardRefs.current.has(cardId)) {
        const cardElement = cardRefs.current.get(cardId)
        if (cardElement) {
          // Check if this card is already animating
          if (activeAnimations.has(cardId)) {
            return // Skip this animation if the card is already animating
          }

          // Start tracking this animation
          startAnimation(cardId)

          // Add the animation class
          cardElement.classList.add(animationClass)

          // Remove the animation class after it completes
          setTimeout(() => {
            if (cardElement) {
              cardElement.classList.remove(animationClass)
              endAnimation(cardId)
            }
          }, duration)
        }
      }
    }

    // Handle discarding animation
    if (discardingCardId) {
      animateCardMovement(discardingCardId, "animate-field-to-discard", 1500)
    }

    // Handle returning to deck animation
    if (returningToDeckCardId) {
      animateCardMovement(returningToDeckCardId, "animate-field-to-deck", 1500)
    }

    // Handle exchange animation
    if (exchangingCardId) {
      animateCardMovement(exchangingCardId, "animate-exchange", 1500)
    }

    // Handle targeting animation
    if (targetingCardId) {
      animateCardMovement(targetingCardId, "animate-being-targeted", 1500)
    }
  }, [discardingCardId, returningToDeckCardId, exchangingCardId, targetingCardId, activeAnimations])

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

  // Calculate card sizes based on viewport width
  const getCardSize = () => {
    if (viewportWidth < 360) {
      return {
        height: isOpponent ? "70px" : "75px",
        width: isOpponent ? "45px" : "50px",
      }
    } else if (viewportWidth < 640) {
      return {
        height: isOpponent ? "85px" : "90px",
        width: isOpponent ? "55px" : "60px",
      }
    } else {
      return {
        height: isOpponent ? "100px" : "110px",
        width: isOpponent ? "65px" : "70px",
      }
    }
  }

  const cardSize = getCardSize()

  return (
    <>
      <div
        className={`flex ${isOpponent ? "min-h-[100px] sm:min-h-[120px] max-w-[95%] mx-auto" : "min-h-[110px] sm:min-h-[130px]"} items-center justify-center gap-1 sm:gap-2 rounded-lg border ${
          isWinning
            ? `${isOpponent ? "border-yellow-500" : "border-yellow-500"} bg-yellow-900 shadow-inner shadow-yellow-500/30`
            : `${isOpponent ? "border-red-700" : "border-blue-700"} bg-green-950`
        } p-1 transition-all duration-300 ${
          dropHighlight && !isOpponent ? "ring-2 ring-green-400 bg-green-900/50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-zone="field"
        data-player={isOpponent ? "opponent" : "player"}
      >
        {cards.length === 0 ? (
          <div className="flex w-full items-center justify-center p-1 text-xs text-white">
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
                className={`relative cursor-pointer transition-all transform ${animationClass}`}
                style={{
                  height: cardSize.height,
                  width: cardSize.width,
                }}
                key={card.id}
                data-card-id={card.id}
                onDragOver={isOpponent ? undefined : handleDragOver}
                onDrop={isOpponent ? undefined : handleDrop}
                onClick={() => handleCardClick(card)}
                ref={(el) => setCardRef(el, card.id)}
              >
                <Card
                  className={`relative h-full w-full border-2 ${
                    card.type === "animal"
                      ? card.environment === "terrestrial"
                        ? "border-red-600 bg-red-900/60"
                        : card.environment === "aquatic"
                          ? "border-blue-600 bg-blue-900/60"
                          : "border-green-600 bg-green-900/60"
                      : "border-purple-600 bg-purple-900/60"
                  }`}
                >
                  <div className="absolute inset-0 border-[1px] border-transparent bg-gradient-to-br from-white/10 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden p-1">
                    <div className="w-full text-center text-[8px] sm:text-[9px] font-bold line-clamp-1">
                      {card.name}
                    </div>
                    <div className="relative h-[50px] sm:h-[60px] w-full flex items-center justify-center">
                      {getCardArt(card)}
                    </div>
                    <div className="w-full text-center text-[7px] sm:text-[8px]">
                      {card.type === "animal" ? (
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-800 px-1 rounded truncate">{card.environment}</span>
                          <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>
                        </div>
                      ) : (
                        <div className="text-gray-300 truncate">{card.effect}</div>
                      )}
                    </div>
                  </div>
                </Card>
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
