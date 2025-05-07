"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "./game-card-template"
import { X } from "lucide-react"

interface DiscardPileGalleryProps {
  cards: GameCard[]
  open?: boolean
  onClose?: () => void
  setShowDiscardGallery?: (show: boolean) => void
}

export function DiscardPileGallery({ cards, open, onClose, setShowDiscardGallery }: DiscardPileGalleryProps) {
  // Handle both prop patterns for backward compatibility
  const isOpen = open !== undefined ? open : true
  const handleClose = () => {
    if (onClose) onClose()
    if (setShowDiscardGallery) setShowDiscardGallery(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] border-2 border-green-700 bg-green-900 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-base text-white">Discard Pile ({cards.length} cards)</DialogTitle>
          <button onClick={handleClose} className="text-white hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2 max-h-[70vh] overflow-y-auto">
          {cards.map((card, index) => (
            <div key={`${card.id}-${index}`} className="w-[120px] h-[170px] relative mx-auto">
              <GameCardTemplate card={card} size="md" />
            </div>
          ))}
          {cards.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
              <p>The discard pile is empty.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
