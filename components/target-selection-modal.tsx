"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "@/components/game-card-template"
import { cn } from "@/lib/utils"

interface TargetSelectionModalProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  onConfirm: (targetId: string) => void
  title: string
  description: string
  filter?: (card: GameCard) => boolean
  playerCardIndices?: number[]
  isConfuseEffect?: boolean
  gameState?: any
}

export function TargetSelectionModal({
  open,
  onClose,
  cards,
  onConfirm,
  title,
  description,
  filter,
  playerCardIndices,
  isConfuseEffect,
  gameState,
}: TargetSelectionModalProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const handleCardClick = (card: GameCard) => {
    setSelectedCardId(card.id)
  }

  const handleConfirm = () => {
    if (selectedCardId) {
      onConfirm(selectedCardId)
      setSelectedCardId(null)
    }
  }

  const filteredCards = filter ? cards.filter(filter) : cards

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-green-900 text-white border-2 border-green-700 rounded-md shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-green-200">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-4 gap-4 p-4">
          {filteredCards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={cn(
                "relative h-40 w-28 rounded-md shadow-md border-2 border-transparent transition-transform duration-200 hover:scale-105",
                selectedCardId === card.id && "border-yellow-500",
                playerCardIndices && playerCardIndices.includes(index) ? "bg-blue-900/50" : "",
              )}
            >
              <GameCardTemplate card={card} size="sm" />
              {playerCardIndices && playerCardIndices.includes(index) && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xl font-bold">
                  Player
                </div>
              )}
            </button>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="bg-red-700 hover:bg-red-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selectedCardId}
            className="bg-green-700 hover:bg-green-600"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
