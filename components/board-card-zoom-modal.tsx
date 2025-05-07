"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "./game-card-template"

interface BoardCardZoomModalProps {
  open: boolean
  onClose: () => void
  card: GameCard | null
  isOpponentCard?: boolean
}

export function BoardCardZoomModal({ open, onClose, card, isOpponentCard = false }: BoardCardZoomModalProps) {
  if (!card) return null

  // Adjust font size for longer effect text
  const getEffectFontSize = (effect?: string) => {
    if (!effect) return "text-xs"
    if (effect.length > 60) return "text-[10px]"
    if (effect.length > 40) return "text-[11px]"
    return "text-xs"
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-4 text-white">
        <DialogHeader>
          <DialogTitle className="text-base text-white">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-[180px] h-[240px] relative">
            <GameCardTemplate card={card} size="lg" className="w-full h-full" />
          </div>

          <div className="text-center">
            {card.type === "animal" ? (
              <div>
                <p className="text-sm text-white">
                  {card.environment === "amphibian"
                    ? "This animal can live in both terrestrial and aquatic environments."
                    : `This is a ${card.environment} animal.`}
                </p>
              </div>
            ) : (
              <div>
                <p className={`${getEffectFontSize(card.effect)} text-white`}>{card.effect}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
