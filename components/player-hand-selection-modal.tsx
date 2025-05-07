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
  onConfirm: (selectedIndex: number) => void
  onCancel?: () => void
  title: string
  description: string
  filter?: (card: GameCard) => boolean
}

export function PlayerHandSelectionModal({
  open,
  onClose,
  cards,
  onConfirm,
  onCancel,
  title,
  description,
  filter,
}: PlayerHandSelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIndex(null)
    }
  }, [open])

  const handleCardClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      onConfirm(selectedIndex)
    }
  }

  const isCardSelectable = (card: GameCard) => {
    if (!filter) return true
    return filter(card)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto bg-green-900 border-2 border-green-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-green-300">{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {cards.map((card, index) => {
            const isSelectable = isCardSelectable(card)
            return (
              <div key={index} className="h-[120px]">
                <GameCardTemplate
                  card={card}
                  size="sm"
                  selected={selectedIndex === index}
                  disabled={!isSelectable}
                  onClick={() => isSelectable && handleCardClick(index)}
                  className="w-full h-full"
                />
              </div>
            )
          })}
        </div>

        <DialogFooter className="mt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="border-red-700 text-red-400">
              Cancel
            </Button>
          )}
          <Button onClick={handleConfirm} disabled={selectedIndex === null} className="bg-green-700 hover:bg-green-600">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
