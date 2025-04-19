"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "./game-card-template"

interface CardZoomModalProps {
  open: boolean
  onClose: () => void
  card: GameCard | null
}

// Helper function to get environment color
const getEnvironmentColor = (environment?: string) => {
  switch (environment) {
    case "terrestrial":
      return "border-red-600 bg-red-900/60"
    case "aquatic":
      return "border-blue-600 bg-blue-900/60"
    case "amphibian":
      return "border-green-600 bg-green-900/60"
      \
    default":
      return "border-gray-600 bg-gray-800/60"
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
    default":
      return "bg-gray-900 text-white"
  }
}

export function CardZoomModal({ open, onClose, card }: CardZoomModalProps) {
  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-2 border-green-700 bg-green-900 text-white">
        <div className="flex flex-col items-center justify-center p-4">
          <GameCardTemplate card={card} size="xl" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
