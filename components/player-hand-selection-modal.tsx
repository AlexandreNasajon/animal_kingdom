"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { getCardArt } from "./card-art/card-art-mapper"

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

  // Filter cards if a filter function is provided
  const filteredCards = filter ? cards.filter(filter) : cards

  const handleCardClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      onSelect(selectedIndex)
      setSelectedIndex(null)
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedIndex(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md bg-green-900/95 border-green-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-green-200">{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 justify-center overflow-y-auto max-h-[60vh] no-scrollbar">
          {filteredCards.length === 0 ? (
            <div className="text-center text-sm text-white py-4">No valid cards available</div>
          ) : (
            filteredCards.map((card, index) => (
              <div
                key={index}
                className={`relative cursor-pointer h-[120px] w-[80px] sm:h-[150px] sm:w-[100px] transform transition-all ${
                  selectedIndex === index ? "border-2 border-yellow-400 scale-105" : ""
                } hover:scale-105`}
                onClick={() => handleCardClick(index)}
              >
                <Card
                  className={`relative h-full w-full ${
                    card.type === "animal"
                      ? card.environment === "terrestrial"
                        ? "bg-red-900/60"
                        : card.environment === "aquatic"
                          ? "bg-blue-900/60"
                          : "bg-green-900/60"
                      : "bg-purple-900/60"
                  } border-0 shadow-md`}
                >
                  <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-white/10 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden p-1">
                    <div className="w-full text-center text-[10px] sm:text-xs font-bold truncate">{card.name}</div>
                    <div className="relative h-[60px] sm:h-[80px] w-full flex items-center justify-center">
                      {getCardArt(card)}
                    </div>
                    <div className="w-full text-center text-[8px] sm:text-[10px]">
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
                  {selectedIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Check className="h-6 w-6 text-yellow-400" />
                    </div>
                  )}
                </Card>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300 px-3 py-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIndex === null || filteredCards.length === 0}
            className="bg-green-700 hover:bg-green-600 text-white px-3 py-1"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
