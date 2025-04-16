"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Play } from "lucide-react"
import { getCardArt } from "./card-art/card-art-mapper"

interface CardDetailModalProps {
  open: boolean
  onClose: () => void
  card: GameCard | null
  onPlay: () => void
  disabled: boolean
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

export function CardDetailModal({ open, onClose, card, onPlay, disabled }: CardDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!card) return null

  const handlePlay = () => {
    setIsPlaying(true)

    // Add a class to trigger the flip animation
    const cardElement = document.querySelector(".animate-flip")
    if (cardElement) {
      cardElement.classList.remove("animate-flip")
      void cardElement.offsetWidth // Force reflow to restart animation
      cardElement.classList.add("animate-flip")
    }

    // Add a small delay to allow animation to play
    setTimeout(() => {
      onPlay()
      setIsPlaying(false)
    }, 800)
  }

  // Special handling for Prey card
  const getCardEffectDisplay = (card: GameCard) => {
    if (card.name === "Prey") {
      return (
        <div className="mt-2 text-[8px] text-center px-1 leading-tight text-white">
          Choose 1 animal. Send all same-environment animals with fewer points to bottom
        </div>
      )
    }

    return <div className="mt-2 text-[9px] text-center px-1 leading-tight text-white">{card.effect}</div>
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base text-white">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-2">
          <Card
            className={`w-[180px] h-[280px] border-2 ${
              card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
            } p-1 shadow-md transition-all ${isPlaying ? "animate-play" : "animate-flip"}`}
          >
            <CardContent className="flex flex-col items-center space-y-4 p-1 h-full">
              <div className="text-center font-bold text-white">{card.name}</div>
              <div className="relative h-[160px] w-full flex items-center justify-center">{getCardArt(card)}</div>

              {card.type === "animal" ? (
                <div className="flex w-full items-center justify-between mt-auto">
                  <Badge variant="outline" className={`${getEnvironmentBadgeColor(card.environment)} text-xs`}>
                    {card.environment}
                  </Badge>
                  {card.points && (
                    <div className="absolute top-2 left-2 bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      {card.points}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-auto w-full">
                  <Badge variant="outline" className="bg-purple-900 text-white text-xs w-full justify-center">
                    Impact
                  </Badge>
                  {getCardEffectDisplay(card)}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            {card.type === "animal" ? (
              <div>
                <p className="text-xs text-white">
                  {card.environment === "amphibian"
                    ? "This animal can live in both terrestrial and aquatic environments."
                    : `This is a ${card.environment} animal.`}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-white">{card.effect}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex items-center gap-1 border-red-700 text-white hover:bg-red-900/30 hover:text-white"
            size="sm"
          >
            <X className="h-3 w-3" /> Close
          </Button>
          <Button
            onClick={handlePlay}
            disabled={disabled || isPlaying}
            className="flex items-center gap-1 bg-green-700 hover:bg-green-600 text-white"
            size="sm"
          >
            <Play className="h-3 w-3" /> Play Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
