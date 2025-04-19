"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play } from "lucide-react"
import { GameCardTemplate } from "./game-card-template"

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
          <div className={`transition-all ${isPlaying ? "animate-play" : "animate-flip"}`}>
            <GameCardTemplate card={card} size="lg" />
          </div>

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

        <DialogFooter className="flex justify-center pt-2">
          <Button
            onClick={handlePlay}
            disabled={disabled || isPlaying}
            className="flex items-center gap-1 bg-green-700 hover:bg-green-600 text-white h-12 text-lg py-6"
          >
            <Play className="h-5 w-5 mr-2" /> Play Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
