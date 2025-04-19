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
import { Check } from "lucide-react"
import { GameCardTemplate } from "./game-card-template"

interface DeckTopCardsModalProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  onSelect: (selectedIndex: number) => void
  title: string
  description: string
}

export function DeckTopCardsModal({ open, onClose, cards, onSelect, title, description }: DeckTopCardsModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md bg-green-900/95 border-green-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-green-200">{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 justify-center overflow-y-auto max-h-[60vh] no-scrollbar">
          {cards.length === 0 ? (
            <div className="text-center text-sm text-white py-4">No cards available</div>
          ) : (
            cards.map((card, index) => (
              <div
                key={index}
                className={`relative cursor-pointer h-[120px] w-[80px] sm:h-[150px] sm:w-[100px] transform transition-all ${
                  selectedIndex === index ? "border-2 border-yellow-400 scale-105" : ""
                } hover:scale-105`}
                onClick={() => handleCardClick(index)}
              >
                <div className="relative">
                  <GameCardTemplate
                    card={card}
                    size={typeof window !== "undefined" && window.innerWidth < 640 ? "xs" : "sm"}
                    selected={selectedIndex === index}
                  />
                  {selectedIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Check className="h-6 w-6 text-yellow-400" />
                    </div>
                  )}
                </div>
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
            disabled={selectedIndex === null || cards.length === 0}
            className="bg-green-700 hover:bg-green-600 text-white px-3 py-1"
          >
            Add to Hand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
