"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DiscardPileGallery } from "./discard-pile-gallery"
import type { GameCard } from "@/types/game"
import { Clock } from "lucide-react"

// Update the SharedDeckDisplay component to accept lastAction prop

// Add lastAction to the props interface
interface SharedDeckDisplayProps {
  deckCount: number
  discardPile: GameCard[]
  onDrawCards: () => void
  canDraw: boolean
  lastAction?: string
}

// Update the component to display the lastAction
export function SharedDeckDisplay({
  deckCount,
  discardPile,
  onDrawCards,
  canDraw,
  lastAction,
}: SharedDeckDisplayProps) {
  const [showDiscardPile, setShowDiscardPile] = useState(false)

  // Rest of the component remains the same

  // Add this near the return statement to display the lastAction
  return (
    <div className="relative flex items-center gap-2">
      {/* Deck */}
      <div className="relative">
        <div
          className="h-16 w-12 rounded-md border border-green-700 bg-green-900 shadow-md"
          onClick={() => setShowDiscardPile(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-green-300">{deckCount}</span>
          </div>
        </div>
        {canDraw && (
          <Button
            size="sm"
            variant="outline"
            onClick={onDrawCards}
            className="absolute -bottom-2 left-1/2 h-5 -translate-x-1/2 transform rounded-full border border-green-500 bg-green-700 px-1 py-0 text-[8px] text-white hover:bg-green-600"
          >
            Draw
          </Button>
        )}
      </div>

      {/* Discard pile */}
      <div className="relative">
        <div
          className="h-16 w-12 cursor-pointer rounded-md border border-green-700 bg-green-800 shadow-md"
          onClick={() => setShowDiscardPile(true)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-green-300">{discardPile.length}</span>
          </div>
          {discardPile.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div
                className={`h-12 w-10 rounded-sm ${
                  discardPile[discardPile.length - 1].type === "animal"
                    ? discardPile[discardPile.length - 1].environment === "terrestrial"
                      ? "bg-red-700"
                      : discardPile[discardPile.length - 1].environment === "aquatic"
                        ? "bg-blue-700"
                        : "bg-green-700"
                    : "bg-purple-700"
                }`}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Last action display */}
      {lastAction && (
        <div className="flex items-center">
          <Card className="border border-green-700 bg-green-900/40 px-1 py-0.5">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-green-400" />
              <span className="text-[9px] text-green-300">{lastAction}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Discard pile gallery */}
      <DiscardPileGallery open={showDiscardPile} onClose={() => setShowDiscardPile(false)} cards={discardPile} />
    </div>
  )
}
