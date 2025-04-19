"use client"
import type { GameCard } from "@/types/game"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GameCardTemplate } from "./game-card-template"

interface OpponentHandRevealProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
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

export function OpponentHandReveal({ open, onClose, cards }: OpponentHandRevealProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base text-white">Opponent's Hand</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap justify-center gap-2 p-2">
          {cards.length === 0 ? (
            <p className="text-center text-sm">Opponent has no cards in hand.</p>
          ) : (
            cards.map((card, index) => <GameCardTemplate key={index} card={card} size="md" />)
          )}
        </div>

        <DialogFooter className="flex justify-center pt-2">
          <Button onClick={onClose} className="bg-green-700 hover:bg-green-600 text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
