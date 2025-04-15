"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import Image from "next/image"
import { DiscardPileGallery } from "./discard-pile-gallery"

interface SharedDeckDisplayProps {
  deckCount: number
  discardPile: GameCard[]
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

export function SharedDeckDisplay({ deckCount, discardPile }: SharedDeckDisplayProps) {
  const topDiscard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null
  const [showDiscardGallery, setShowDiscardGallery] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* Deck */}
        <div className="flex flex-col items-center">
          <div className="relative h-[60px] w-[45px] rounded-lg border border-green-600 bg-green-800 shadow-md card-zoom">
            {deckCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{deckCount}</span>
              </div>
            )}
          </div>
          <span className="mt-0.5 text-[8px] text-green-300">Deck</span>
        </div>

        {/* Discard Pile */}
        <div className="flex flex-col items-center">
          <div
            className="relative h-[60px] w-[45px] rounded-lg border border-green-700 bg-green-900 shadow-md card-zoom cursor-pointer"
            onClick={() => setShowDiscardGallery(true)}
          >
            {topDiscard ? (
              <div className="relative h-full w-full">
                <Image
                  src={topDiscard.imageUrl || "/placeholder.svg?height=120&width=80"}
                  alt={topDiscard.name}
                  fill
                  className="rounded-lg object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-0.5 text-center text-[8px]">
                  {topDiscard.name}
                </div>
                {topDiscard.type === "animal" && (
                  <div
                    className={`absolute left-0 right-0 top-0 ${getEnvironmentColor(topDiscard.environment)} h-1`}
                  ></div>
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-[8px] text-green-500">Empty</span>
              </div>
            )}
          </div>
          <span className="mt-0.5 text-[8px] text-green-300">
            Discard ({discardPile.length})
            {discardPile.length > 0 && <span className="text-yellow-300 ml-0.5">↑ Click</span>}
          </span>
        </div>
      </div>

      {/* Discard Pile Gallery Modal */}
      <DiscardPileGallery open={showDiscardGallery} onClose={() => setShowDiscardGallery(false)} cards={discardPile} />
    </>
  )
}
