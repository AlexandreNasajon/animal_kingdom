"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "./game-card-template"

interface ExchangeSelectionModalProps {
  open: boolean
  onClose: () => void
  playerCards: GameCard[]
  opponentCards: GameCard[]
  onConfirm: (playerIndex: number, opponentIndex: number) => void
  onCancel?: () => void
  title: string
  description: string
}

export function ExchangeSelectionModal({
  open,
  onClose,
  playerCards,
  opponentCards,
  onConfirm,
  onCancel,
  title,
  description,
}: ExchangeSelectionModalProps) {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null)
  const [selectedOpponentIndex, setSelectedOpponentIndex] = useState<number | null>(null)

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedPlayerIndex(null)
      setSelectedOpponentIndex(null)
    }
  }, [open])

  const handlePlayerCardClick = (index: number) => {
    setSelectedPlayerIndex(index)
  }

  const handleOpponentCardClick = (index: number) => {
    setSelectedOpponentIndex(index)
  }

  const handleConfirm = () => {
    if (selectedPlayerIndex !== null && selectedOpponentIndex !== null) {
      onConfirm(selectedPlayerIndex, selectedOpponentIndex)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto bg-green-900 border-2 border-green-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-green-300">{description}</DialogDescription>
        </DialogHeader>

        {/* Opponent's cards (AI) - shown first/on top */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2 text-red-300">AI's Animals</h3>
          <div className="grid grid-cols-3 gap-2">
            {opponentCards.length > 0 ? (
              opponentCards.map((card, index) => (
                <div
                  key={`opponent-${index}`}
                  className={`${
                    selectedOpponentIndex === index ? "scale-105 ring-2 ring-yellow-500" : ""
                  } cursor-pointer h-[120px]`}
                  onClick={() => handleOpponentCardClick(index)}
                >
                  <GameCardTemplate
                    card={card}
                    size="sm"
                    selected={selectedOpponentIndex === index}
                    className="w-full h-full"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-sm text-gray-400 py-4">No animals on AI's field</div>
            )}
          </div>
        </div>

        {/* Player's cards - shown second/below */}
        <div>
          <h3 className="text-sm font-bold mb-2 text-blue-300">Your Animals</h3>
          <div className="grid grid-cols-3 gap-2">
            {playerCards.length > 0 ? (
              playerCards.map((card, index) => (
                <div
                  key={`player-${index}`}
                  className={`${
                    selectedPlayerIndex === index ? "scale-105 ring-2 ring-yellow-500" : ""
                  } cursor-pointer h-[120px]`}
                  onClick={() => handlePlayerCardClick(index)}
                >
                  <GameCardTemplate
                    card={card}
                    size="sm"
                    selected={selectedPlayerIndex === index}
                    className="w-full h-full"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-sm text-gray-400 py-4">No animals on your field</div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="border-red-700 text-red-400">
              Cancel
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={selectedPlayerIndex === null || selectedOpponentIndex === null}
            className="bg-green-700 hover:bg-green-600"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
