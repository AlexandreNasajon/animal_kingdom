"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { DiscardPileGallery } from "./discard-pile-gallery"
import type { GameCard } from "@/types/game"
import { Layers } from "lucide-react"

interface SharedDeckDisplayProps {
  deckCount: number
  discardPile: GameCard[]
  onDrawCards: () => void
  canDraw: boolean
}

export function SharedDeckDisplay({ deckCount, discardPile, onDrawCards, canDraw }: SharedDeckDisplayProps) {
  const [showDiscardGallery, setShowDiscardGallery] = useState(false)

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
      {/* Discard pile on the left */}
      <div className="relative">
        <Card
          className={`h-[80px] w-[60px] sm:h-[90px] sm:w-[70px] ${
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
                <div className="text-sm font-bold text-green-400">{discardPile.length}</div>
                <div className="text-[10px] text-green-400">Discard</div>
              </div>
            ) : (
              <div className="text-[10px] text-green-400 text-center">Empty</div>
            )}
          </div>
        </Card>
      </div>

      {/* Deck on the right - now clickable */}
      <div className="relative">
        <Card
          className={`h-[80px] w-[60px] sm:h-[90px] sm:w-[70px] ${
            canDraw ? "cursor-pointer hover:scale-105 transition-transform" : "cursor-not-allowed opacity-70"
          } border-2 border-green-700 bg-green-900 shadow-md relative overflow-hidden`}
          onClick={canDraw ? onDrawCards : undefined}
        >
          {/* Card frame decoration */}
          <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
          <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

          {/* Draw text at the top */}
          {canDraw && (
            <div className="absolute top-0 left-0 right-0 bg-green-700/80 text-[9px] text-center py-0.5 text-white font-bold">
              Draw 2 Cards
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="card-back-pattern"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mb-1" />
              <div className="text-sm font-bold text-green-400">{deckCount}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Discard pile gallery modal */}
      <DiscardPileGallery open={showDiscardGallery} onClose={() => setShowDiscardGallery(false)} cards={discardPile} />
    </div>
  )
}
