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

// Helper function to get environment color
const getEnvironmentColor = (environment?: string) => {
  switch (environment) {
    case "terrestrial":
      return "border-red-600 bg-red-900"
    case "aquatic":
      return "border-blue-600 bg-blue-900"
    case "amphibian":
      return "border-green-600 bg-green-900"
    default:
      return "border-gray-600 bg-gray-800"
  }
}

// Helper function to get environment badge color
const getEnvironmentBadgeColor = (environment?: string) => {
  switch (environment) {
    case "terrestrial":
      return "bg-red-900 text-white"
    case "aquatic":
      return "bg-blue-900 text-white"
    case "amphibian":
      return "bg-green-900 text-white"
    default:
      return "bg-gray-900 text-white"
  }
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
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base text-white">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-3">
          <div className={`${isOpponentCard ? "ring-2 ring-red-500" : "ring-2 ring-blue-500"}`}>
            <GameCardTemplate card={card} size="lg" />
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
