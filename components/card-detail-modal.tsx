"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, X } from "lucide-react"
import { GameCardTemplate } from "./game-card-template"

interface CardDetailModalProps {
  card: GameCard | null
  open?: boolean
  showCardDetail?: boolean
  onClose?: () => void
  setShowCardDetail?: (show: boolean) => void
  onPlay?: () => void
  handlePlayCard?: () => void
  disabled?: boolean
  currentTurn?: string
  gameStatus?: string
}

export function CardDetailModal({
  card,
  open,
  showCardDetail,
  onClose,
  setShowCardDetail,
  onPlay,
  handlePlayCard,
  disabled,
  currentTurn,
  gameStatus,
}: CardDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!card) return null

  // Determine if the modal should be open
  const isOpen = open !== undefined ? open : showCardDetail

  // Determine the close handler
  const handleClose = () => {
    if (onClose) onClose()
    if (setShowCardDetail) setShowCardDetail(false)
  }

  // Determine the play handler
  const handlePlay = () => {
    setIsPlaying(true)

    // Add a small delay to allow animation to play
    setTimeout(() => {
      if (onPlay) onPlay()
      if (handlePlayCard) handlePlayCard()
      setIsPlaying(false)
    }, 800)
  }

  // Determine if the play button should be disabled
  const isPlayDisabled =
    disabled !== undefined ? disabled : currentTurn !== "player" || gameStatus !== "playing" || isPlaying

  // Special handling for Prey card
  const getCardEffectDisplay = (card: GameCard) => {
    if (card.name === "Prey") {
      return (
        <div className="mt-2 text-sm text-center px-1 leading-tight text-white">
          Choose 1 animal. Send all same-environment animals with fewer points to bottom
        </div>
      )
    }

    return <div className="mt-2 text-sm text-center px-1 leading-tight text-white">{card.effect}</div>
  }

  return (
    <Dialog open={!!isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-4 text-white max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-lg text-white font-bold">{card.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full bg-green-800 hover:bg-green-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-[240px] h-[320px] relative">
            <GameCardTemplate card={card} size="xl" className="w-full h-full" />
          </div>

          <div className="text-center max-w-xs">
            {card.type === "animal" ? (
              <div>
                <p className="text-sm text-white">
                  {card.environment === "amphibian"
                    ? "This animal can live in both terrestrial and aquatic environments."
                    : `This is a ${card.environment} animal.`}
                </p>
                {card.effect && <p className="text-sm text-white mt-2 font-medium">Effect: {card.effect}</p>}
              </div>
            ) : (
              <div>
                <p className="text-sm text-white font-medium">{card.effect}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-center pt-2">
          <Button
            onClick={handlePlay}
            disabled={isPlayDisabled}
            className={`flex items-center gap-1 ${
              isPlayDisabled ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed" : "bg-green-700 hover:bg-green-600"
            } text-white h-12 text-lg py-6 px-8 transition-all duration-200 ${isPlaying ? "animate-pulse" : ""}`}
          >
            <Play className="h-5 w-5 mr-2" /> Play Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
