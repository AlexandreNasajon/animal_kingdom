"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DiscardPileGallery } from "./discard-pile-gallery"
import type { GameCard } from "@/types/game"
import { Layers, Clock } from "lucide-react"

interface SharedDeckDisplayProps {
  deckCount: number
  discardPile: GameCard[]
  onDrawCards: () => void
  canDraw: boolean
  lastAction?: string
}

export function SharedDeckDisplay({
  deckCount,
  discardPile,
  onDrawCards,
  canDraw,
  lastAction,
}: SharedDeckDisplayProps) {
  const [showDiscardGallery, setShowDiscardGallery] = useState(false)

  return (
    <div className="flex items-center justify-between gap-4 relative w-full px-4">
      {/* Left side with Draw button */}
      <div className="flex items-center">
        {canDraw && (
          <Button
            onClick={onDrawCards}
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-1 px-2 text-xs shadow-md"
            size="sm"
          >
            Draw Cards
          </Button>
        )}
      </div>

      {/* Right side with deck and discard pile */}
      <div className="flex items-center gap-4">
        {/* Deck */}
        <div className="relative">
          <Card className="h-[70px] w-[55px] cursor-not-allowed border-2 border-green-700 bg-green-900 shadow-md relative overflow-hidden">
            {/* Card frame decoration */}
            <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
            <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="card-back-pattern"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Layers className="h-5 w-5 text-green-400 mb-1" />
                <div className="text-xs font-bold text-green-400">{deckCount}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Discard pile */}
        <div className="relative">
          <Card
            className={`h-[70px] w-[55px] ${
              discardPile.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
            } border-2 border-green-700 bg-green-900/60 shadow-md relative overflow-hidden`}
            onClick={() => discardPile.length > 0 && setShowDiscardGallery(true)}
          >
            {/* Card frame decoration */}
            <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
            <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              {discardPile.length > 0 ? (
                <div className="text-center">
                  <div className="text-xs font-bold text-green-400">{discardPile.length}</div>
                  <div className="text-[8px] text-green-400">Discard</div>
                </div>
              ) : (
                <div className="text-[8px] text-green-400 text-center">Empty</div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Last action display */}
      {lastAction && (
        <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
          <Card className="border border-green-700 bg-green-900/40 px-1 py-0.5">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-green-400" />
              <span className="text-[9px] text-white">{lastAction}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Discard pile gallery modal */}
      <DiscardPileGallery open={showDiscardGallery} onClose={() => setShowDiscardGallery(false)} cards={discardPile} />
    </div>
  )
}
