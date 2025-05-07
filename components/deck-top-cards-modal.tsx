"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "./game-card-template"

interface DeckTopCardsModalProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  title?: string
}

export function DeckTopCardsModal({ open, onClose, cards, title = "Top Cards of Deck" }: DeckTopCardsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto bg-green-900 border-2 border-green-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <div key={index} className="h-[120px]">
                <GameCardTemplate card={card} size="sm" className="w-full h-full" />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-sm text-gray-400 py-4">No cards in deck</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
