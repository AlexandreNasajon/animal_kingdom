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

interface PlayerHandSelectionModalProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  onSelect: (index: number) => void
  title: string
  description: string
  filter?: (card: GameCard) => boolean
}

export function PlayerHandSelectionModal({
  open,
  onClose,
  cards,
  onSelect,
  title,
  description,
  filter,
}: PlayerHandSelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [filteredCards, setFilteredCards] = useState<GameCard[]>([])

  // Reset selection when modal opens and filter cards
  useEffect(() => {
    if (open) {
      setSelectedIndex(null)

      // Apply filter if provided
      if (filter && typeof filter === "function") {
        setFilteredCards(cards.filter(filter))
      } else {
        setFilteredCards(cards)
      }
    }
  }, [open, cards, filter])

  const handleCardClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      onSelect(selectedIndex)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto bg-green-900 border-2 border-green-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-green-300">{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {filteredCards.length > 0 ? (
            filteredCards.map((card, index) => (
              <div
                key={index}
                className={`${selectedIndex === index ? "scale-105 ring-2 ring-yellow-500" : ""} cursor-pointer`}
                onClick={() => handleCardClick(index)}
              >
                <GameCardTemplate card={card} size="sm" selected={selectedIndex === index} />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-sm text-gray-400 py-4">No valid cards available</div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="border-red-700 text-red-400">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIndex === null || filteredCards.length === 0}
            className="bg-green-700 hover:bg-green-600"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
