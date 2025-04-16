"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { GameCard } from "@/types/game"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCardArt } from "./card-art/card-art-mapper"
import { getCardAnimation } from "@/utils/animation-utils"

interface PlayerHandProps {
  cards: GameCard[]
  onSelectCard: (cardIndex: number) => void
  onPlayCard: (cardIndex: number) => void
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
      return "bg-red-900 text-white"
    case "aquatic":
      return "bg-blue-900 text-white"
    case "amphibian":
      return "bg-green-900 text-white"
    default:
      return "bg-gray-900 text-white"
  }
}

export function PlayerHand({
  cards,
  onSelectCard,
  onPlayCard,
  disabled,
  newCardIds = [],
  playingCardId,
}: PlayerHandProps) {
  const [animatedCardIds, setAnimatedCardIds] = useState<number[]>([])
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null)
  const [touchedCardIndex, setTouchedCardIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return

    // Set data for drag operation
    e.dataTransfer.setData("text/plain", index.toString())
    e.dataTransfer.effectAllowed = "move"

    // Add a custom class to the drag image
    if (e.target instanceof HTMLElement) {
      e.target.classList.add("dragging")
    }

    setDraggingIndex(index)

    // Create a custom drag image
    const card = cards[index]
    const dragImage = document.createElement("div")
    dragImage.className = `h-[140px] w-[90px] border ${
      card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
    } rounded-md shadow-lg opacity-80`

    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 45, 70)

    // Remove the element after drag starts
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }

  const handleDragEnd = () => {
    setDraggingIndex(null)

    // Remove dragging class from all cards
    const cardElements = containerRef.current?.querySelectorAll(".card-draggable")
    cardElements?.forEach((el) => {
      el.classList.remove("dragging")
    })
  }

  // Touch handlers for mobile drag and drop
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (disabled) return

    const touch = e.touches[0]
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
    setTouchedCardIndex(index)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || touchStartPos === null || touchedCardIndex === null) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartPos.x
    const deltaY = touch.clientY - touchStartPos.y

    // If the user has moved their finger more than 10px, consider it a drag
    if (!isDragging && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      setIsDragging(true)
    }

    if (isDragging) {
      // Prevent scrolling when dragging
      e.preventDefault()

      // Update the card's position
      const cardElement = e.currentTarget as HTMLElement
      cardElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      cardElement.style.zIndex = "100"
      cardElement.style.opacity = "0.8"
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled || touchedCardIndex === null) return

    const cardElement = e.currentTarget as HTMLElement

    // Reset the card's position
    cardElement.style.transform = ""
    cardElement.style.zIndex = ""
    cardElement.style.opacity = ""

    if (isDragging) {
      // Check if the card was dropped on the game board
      const touch = e.changedTouches[0]
      const dropElement = document.elementFromPoint(touch.clientX, touch.clientY)

      if (dropElement) {
        // Find the closest parent with data-zone attribute
        let target = dropElement
        while (target && !target.getAttribute("data-zone")) {
          target = target.parentElement as HTMLElement
        }

        // If dropped on the field, play the card
        if (
          target &&
          target.getAttribute("data-zone") === "field" &&
          target.getAttribute("data-player") !== "opponent"
        ) {
          // Check if any animations are currently running
          const anyCardAnimating = Array.from(document.querySelectorAll(".card-draggable")).some((card) => {
            return (
              card instanceof HTMLElement &&
              (card.classList.contains("animate-draw") ||
                card.classList.contains("animate-play") ||
                card.classList.contains("animate-hand-to-field"))
            )
          })

          if (!anyCardAnimating) {
            onPlayCard(touchedCardIndex)
          }
        }
      }
    } else {
      // If not dragging, treat it as a tap/click
      onSelectCard(touchedCardIndex)
    }

    // Reset touch state
    setTouchStartPos(null)
    setTouchedCardIndex(null)
    setIsDragging(false)
  }

  // Special handling for Prey card in hover preview
  const getCardEffectPreview = (card: GameCard) => {
    if (card.name === "Prey") {
      return (
        <div className="mt-1 text-[8px] text-center px-1 leading-tight text-white">
          Choose 1 animal. Send all same-environment animals with fewer points to bottom
        </div>
      )
    }

    return <div className="mt-1 text-[9px] text-center px-1 text-white">{card.effect}</div>
  }

  return (
    <div ref={containerRef} className="flex justify-center overflow-visible p-1 min-h-[170px]">
      {cards.map((card, index) => {
        const isHovered = hoveredCardIndex === index
        const isPlaying = card.id === playingCardId
        const isAnimating = animatedCardIds.includes(card.id)
        const isDragging = draggingIndex === index

        // Get the appropriate animation class for this card
        const animationClass = getCardAnimation(card)

        return (
          <div
            key={index}
            className={`relative cursor-pointer transform transition-all ${
              disabled ? "opacity-50" : ""
            } ${isAnimating ? "animate-new-card" : ""} ${isPlaying ? "animate-play-card" : ""}`}
            onClick={() => onSelectCard(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            draggable={!disabled}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            data-card-id={card.id}
            style={{
              marginLeft: index > 0 ? "-15px" : "0", // Make cards overlap
              zIndex: isHovered ? 10 : index, // Reverse stacking order so rightmost cards are on top
            }}
          >
            <Card
              className={`relative h-[140px] w-[90px] transform transition-transform ${
                card.type === "animal"
                  ? card.environment === "terrestrial"
                    ? "bg-red-900/60"
                    : card.environment === "aquatic"
                      ? "bg-blue-900/60"
                      : "bg-green-900/60"
                  : "bg-purple-900/60"
              } ${isDragging ? "scale-105" : "hover:scale-105"} border-0 shadow-md`}
            >
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden p-1">
                <div className="w-full text-center text-[12px] font-bold truncate">{card.name}</div>
                <div className="relative h-[90px] w-full flex items-center justify-center">{getCardArt(card)}</div>
                <div className="w-full text-center text-[10px]">
                  {card.type === "animal" ? (
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-800 px-1 rounded">{card.environment}</span>
                      <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>
                    </div>
                  ) : (
                    <div className="text-gray-300 truncate">{card.effect}</div>
                  )}
                </div>
              </div>
            </Card>

            {/* Enlarged card preview on hover */}
            {isHovered && (
              <div
                className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 z-50 pointer-events-none"
                style={{ display: disabled ? "none" : "block" }}
              >
                <Card
                  className={`h-[280px] w-[180px] border-2 ${
                    card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                  } p-1 shadow-xl relative overflow-hidden`}
                >
                  {/* Card frame decoration */}
                  <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                  <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                  <CardContent className="flex h-full flex-col items-center justify-between p-1">
                    <div className="w-full text-center text-sm font-medium text-white">{card.name}</div>

                    <div className="relative h-[160px] w-full">{getCardArt(card)}</div>

                    <div className="w-full">
                      {card.type === "animal" ? (
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={`${getEnvironmentBadgeColor(card.environment)} text-[10px]`}
                          >
                            {card.environment}
                          </Badge>
                          {card.points && (
                            <div className="absolute top-2 left-2 bg-yellow-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                              {card.points}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="text-center text-white">
                            <span className="text-[10px]">Impact</span>
                          </div>
                          {getCardEffectPreview(card)}
                        </div>
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
