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
      return "bg-red-900 text-red-200"
    case "aquatic":
      return "bg-blue-900 text-blue-200"
    case "amphibian":
      return "bg-green-900 text-green-200"
    default:
      return "bg-gray-900 text-gray-200"
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
    dragImage.className = `h-[100px] w-[75px] border ${
      card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
    } rounded-md shadow-lg opacity-80`

    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 37, 50)

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
          onPlayCard(touchedCardIndex)
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

  return (
    <div ref={containerRef} className="flex justify-center overflow-visible p-1 min-h-[130px]">
      {cards.map((card, index) => {
        const isHovered = hoveredCardIndex === index
        const isPlaying = card.id === playingCardId
        const isAnimating = animatedCardIds.includes(card.id)
        const isDragging = draggingIndex === index

        // Get the appropriate animation class for this card
        const animationClass = getCardAnimation(card)

        return (
          <div
            key={card.id}
            className={`card-zoom-container ${isDragging ? "opacity-50" : ""}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            style={{
              marginLeft: index > 0 ? "-15px" : "0", // Make cards overlap
              zIndex: isHovered ? 10 : index, // Reverse stacking order so rightmost cards are on top
            }}
          >
            <Card
              className={`h-[100px] w-[75px] cursor-pointer border card-zoom card-draggable ${
                card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
              } p-0.5 shadow-md ${disabled ? "opacity-70" : ""} 
                ${isAnimating ? "animate-draw" : ""} 
                ${isPlaying ? animationClass : ""}
                relative overflow-hidden transition-all duration-300 ease-in-out`}
              onClick={() => !disabled && onSelectCard(index)}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                animationDelay: `${animatedCardIds.indexOf(card.id) * 0.15}s`,
                zIndex: isHovered ? 10 : 1,
              }}
            >
              {/* Card frame decoration */}
              <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
              <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

              <CardContent className="flex h-full flex-col items-center justify-between p-0.5">
                <div className="w-full text-center text-[11px] font-medium">{card.name}</div>

                <div className="relative h-[55px] w-full overflow-hidden">{getCardArt(card)}</div>

                <div className="w-full px-0.5">
                  {card.type === "animal" ? (
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`${getEnvironmentBadgeColor(card.environment)} text-[9px] px-0.5 py-0`}
                      >
                        {card.environment}
                      </Badge>
                      {card.points && (
                        <div className="absolute top-1 left-1 bg-yellow-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {card.points}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-[9px] text-gray-300 line-clamp-1">{card.effect}</div>
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
      })}
    </div>
  )
}
