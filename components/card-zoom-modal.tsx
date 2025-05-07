"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "./game-card-template"

interface CardZoomModalProps {
  open: boolean
  onClose: () => void
  card: GameCard | null
}

export function CardZoomModal({ open, onClose, card }: CardZoomModalProps) {
  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-2 border-green-700 bg-green-900 text-white">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-[210px] h-[280px] relative">
            <GameCardTemplate card={card} size="xl" className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
