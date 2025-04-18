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
  const [viewportWidth, setViewportWidth] = useState(0)

  // Drag and drop state
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null)
  const [dragImage, setDragImage] = useState<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Touch handling state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const touchCardIndexRef = useRef<number | null>(null)
  const touchMoveThreshold = 10 // pixels to move before considering it a drag
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())

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

  // Create drag image once on component mount
  useEffect(() => {
    const image = document.createElement("div")
    image.className = "fixed opacity-0 pointer-events-none"
    image.style.width = "80px"
    image.style.height = "120px"
    image.style.zIndex = "9999"
    document.body.appendChild(image)
    setDragImage(image)

    return () => {
      document.body.removeChild(image)
    }
  }, [])

  // Handle mouse click on card
  const handleCardClick = (index: number, event: React.MouseEvent) => {
    if (disabled) return

    // Only handle click if it's not part of a drag operation
    if (!isDragging) {
      onSelectCard(index)
    }

    // Reset drag state
    setIsDragging(false)
  }

  // Drag start handler
  const handleDragStart = (index: number, event: React.DragEvent) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    // Set data for drag operation
    event.dataTransfer.setData("text/plain", index.toString())
    event.dataTransfer.effectAllowed = "move"

    // Set dragged card index
    setDraggedCardIndex(index)
    setIsDragging(true)

    // Create custom drag image
    if (dragImage) {
      const card = cards[index]
      dragImage.innerHTML = ""

      // Create a visual clone of the card
      const cardClone = document.createElement("div")
      cardClone.className = `h-[120px] w-[80px] rounded-md shadow-lg border-2 ${
        card.type === "animal"
          ? card.environment === "terrestrial"
            ? "border-red-600 bg-red-900"
            : card.environment === "aquatic"
              ? "border-blue-600 bg-blue-900"
              : "border-green-600 bg-green-900"
          : "border-purple-600 bg-purple-900"
      }`

      // Add card name
      const nameDiv = document.createElement("div")
      nameDiv.className = "text-center text-white text-xs font-bold mt-1"
      nameDiv.textContent = card.name
      cardClone.appendChild(nameDiv)

      // Add card type/points
      const infoDiv = document.createElement("div")
      infoDiv.className = "text-center text-white text-xs mt-auto mb-1"
      infoDiv.textContent = card.type === "animal" ? `${card.environment} (${card.points} pts)` : "Impact"
      cardClone.appendChild(infoDiv)

      dragImage.appendChild(cardClone)

      // Set the drag image
      event.dataTransfer.setDragImage(dragImage, 40, 60)
    }
  }

  // Drag end handler
  const handleDragEnd = (event: React.DragEvent) => {
    setDraggedCardIndex(null)

    // Small delay to ensure click isn't triggered immediately after drag
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  // Touch handlers for mobile
  const handleTouchStart = (index: number, event: React.TouchEvent) => {
    if (disabled) return

    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    touchCardIndexRef.current = index

    // Set up long press detection for card detail view
    longPressTimeoutRef.current = setTimeout(() => {
      // If finger hasn't moved much, consider it a long press
      if (touchStartRef.current) {
        onSelectCard(index)
        touchStartRef.current = null // Prevent drag after long press
      }
    }, 500) // 500ms for long press
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (disabled || !touchStartRef.current || touchCardIndexRef.current === null) return

    // Clear long press timeout on movement
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }

    const touch = event.touches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // If moved enough to consider it a drag
    if (distance > touchMoveThreshold) {
      setIsDragging(true)

      // Find the card element
      const cardElement = cardRefs.current.get(touchCardIndexRef.current)
      if (cardElement) {
        // Create visual feedback for dragging
        cardElement.style.opacity = "0.7"
        cardElement.style.transform = "scale(1.05)"

        // Check if we're over a drop target
        const elementsUnderTouch = document.elementsFromPoint(touch.clientX, touch.clientY)
        const dropTarget = elementsUnderTouch.find(
          (el) => el.getAttribute("data-zone") === "field" && el.getAttribute("data-player") !== "opponent",
        )

        if (dropTarget) {
          // Visual feedback for valid drop target
          dropTarget.classList.add("drop-target-highlight")
        } else {
          // Remove highlight from all potential drop targets
          document.querySelectorAll(".drop-target-highlight").forEach((el) => {
            el.classList.remove("drop-target-highlight")
          })
        }
      }
    }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }

    // Only process if we have touch start data and card index
    if (touchStartRef.current && touchCardIndexRef.current !== null) {
      const touch = event.changedTouches[0]

      // If we were dragging
      if (isDragging) {
        // Find elements under the touch point
        const elementsUnderTouch = document.elementsFromPoint(touch.clientX, touch.clientY)
        const dropTarget = elementsUnderTouch.find(
          (el) => el.getAttribute("data-zone") === "field" && el.getAttribute("data-player") !== "opponent",
        )

        // If dropped on a valid target
        if (dropTarget) {
          onPlayCard(touchCardIndexRef.current)
        }

        // Reset card appearance
        const cardElement = cardRefs.current.get(touchCardIndexRef.current)
        if (cardElement) {
          cardElement.style.opacity = ""
          cardElement.style.transform = ""
        }

        // Remove highlight from all potential drop targets
        document.querySelectorAll(".drop-target-highlight").forEach((el) => {
          el.classList.remove("drop-target-highlight")
        })
      }
      // If it was a short tap and not a drag, handle as a click
      else if (!isDragging) {
        onSelectCard(touchCardIndexRef.current)
      }
    }

    // Reset touch state
    touchStartRef.current = null
    touchCardIndexRef.current = null
    setIsDragging(false)
  }

  // Save card element references
  const setCardRef = (element: HTMLDivElement | null, index: number) => {
    if (element) {
      cardRefs.current.set(index, element)
    } else {
      cardRefs.current.delete(index)
    }
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

  // Calculate card sizes and overlap based on viewport width
  const getCardSize = () => {
    if (viewportWidth < 360) {
      return {
        height: "90px",
        width: "60px",
        overlap: "-35px",
      }
    } else if (viewportWidth < 640) {
      return {
        height: "110px",
        width: "75px",
        overlap: "-40px",
      }
    } else {
      return {
        height: "120px",
        width: "80px",
        overlap: "-25px",
      }
    }
  }

  const cardSize = getCardSize()

  return (
    <div ref={containerRef} className="flex justify-center overflow-visible p-0 min-h-[100px] sm:min-h-[110px]">
      {cards.map((card, index) => {
        const isHovered = hoveredCardIndex === index
        const isPlaying = card.id === playingCardId
        const isAnimating = animatedCardIds.includes(card.id)
        const isDragged = draggedCardIndex === index

        // Get the appropriate animation class for this card
        const animationClass = getCardAnimation(card)

        return (
          <div
            key={index}
            ref={(el) => setCardRef(el as HTMLDivElement, index)}
            className={`relative cursor-pointer transform transition-all ${
              disabled ? "opacity-50" : "opacity-100"
            } ${isAnimating ? "animate-new-card" : ""} ${isPlaying ? "animate-play-card" : ""}`}
            onClick={(e) => handleCardClick(index, e)}
            onMouseEnter={() => setHoveredCardIndex(index)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            onDragStart={(e) => handleDragStart(index, e)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(index, e)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            draggable={!disabled}
            data-card-id={card.id}
            data-card-index={index}
            style={{
              height: cardSize.height,
              width: cardSize.width,
              marginLeft: index > 0 ? cardSize.overlap : "0",
              zIndex: isHovered ? 10 : index,
              transform: isDragged ? "scale(1.05)" : "",
              opacity: isDragged ? "0.7" : "1",
            }}
          >
            <Card
              className={`relative h-full w-full transform transition-transform ${
                card.type === "animal"
                  ? card.environment === "terrestrial"
                    ? "bg-red-900"
                    : card.environment === "aquatic"
                      ? "bg-blue-900"
                      : "bg-green-900"
                  : "bg-purple-900"
              } ${isHovered && !disabled ? "scale-105" : ""} border-0 shadow-md`}
            >
              {/* Points indicator for animal cards */}
              {card.type === "animal" && card.points && (
                <div className="absolute top-1 left-1 bg-yellow-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold z-10 shadow-md border border-yellow-500">
                  {card.points}
                </div>
              )}

              {/* Add a subtle highlight for the hovered card */}
              {isHovered && !disabled && (
                <div className="absolute inset-0 border-2 border-white/30 rounded-md pointer-events-none z-10"></div>
              )}

              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden p-1">
                <div className="w-full text-center text-[10px] sm:text-[12px] font-bold truncate">{card.name}</div>
                <div className="relative h-[60px] sm:h-[70px] w-full flex items-center justify-center">
                  {getCardArt(card)}
                </div>
                <div className="w-full text-center text-[8px] sm:text-[10px]">
                  {card.type === "animal" ? (
                    <div className="flex items-center justify-center">
                      <span className="bg-gray-800 px-1 rounded">{card.environment}</span>
                    </div>
                  ) : (
                    <div className="text-gray-300 truncate">{card.effect}</div>
                  )}
                </div>
              </div>
            </Card>

            {/* Enlarged card preview on hover - only show on desktop */}
            {isHovered && typeof window !== "undefined" && window.innerWidth >= 640 && !disabled && (
              <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 z-50 pointer-events-none">
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
