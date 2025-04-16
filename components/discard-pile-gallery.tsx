"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { getCardArt } from "./card-art/card-art-mapper"

interface DiscardPileGalleryProps {
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

// Helper function to get font size based on text length
const getEffectFontSize = (effect?: string) => {
  if (!effect) return "text-xs"
  if (effect.length > 60) return "text-[10px]"
  if (effect.length > 40) return "text-[11px]"
  return "text-xs"
}

export function DiscardPileGallery({ open, onClose, cards }: DiscardPileGalleryProps) {
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null)

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base text-white">Discard Pile ({cards.length} cards)</DialogTitle>
          <DialogDescription className="text-white text-xs">
            View all cards in the discard pile. Click on a card to see details.
          </DialogDescription>
        </DialogHeader>

        {selectedCard ? (
          <div className="flex flex-col items-center space-y-2 relative">
            {/* Close button for card detail view */}
            <Button
              onClick={() => setSelectedCard(null)}
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 p-1 h-6 w-6 rounded-full bg-red-900 hover:bg-red-800 text-white"
            >
              <X className="h-4 w-4" />
            </Button>

            <Card
              className={`w-[220px] border-2 ${
                selectedCard.type === "animal"
                  ? getEnvironmentColor(selectedCard.environment)
                  : "border-purple-600 bg-purple-900"
              } p-1 shadow-md transition-all animate-flip`}
            >
              <CardContent className="flex flex-col items-center space-y-2 p-1">
                <div className="relative h-[150px] w-full">{getCardArt(selectedCard)}</div>

                {selectedCard.type === "animal" ? (
                  <div className="flex w-full items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`${getEnvironmentBadgeColor(selectedCard.environment)} text-xs`}
                    >
                      {selectedCard.environment}
                    </Badge>
                    <Badge className="bg-yellow-600 text-xs text-white">{selectedCard.points} pts</Badge>
                  </div>
                ) : (
                  <Badge variant="outline" className="bg-purple-900 text-white text-xs">
                    Impact
                  </Badge>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <h3 className="font-bold text-sm text-white">{selectedCard.name}</h3>
              {selectedCard.type === "animal" ? (
                <div>
                  <p className="text-xs text-white">
                    {selectedCard.environment === "amphibian"
                      ? "This animal can live in both terrestrial and aquatic environments."
                      : `This is a ${selectedCard.environment} animal.`}
                  </p>
                  <p className="mt-0.5 text-xs text-white">
                    Worth {selectedCard.points} points when played on your field.
                  </p>
                </div>
              ) : (
                <div>
                  <p className={`mt-0.5 ${getEffectFontSize(selectedCard.effect)} text-white break-words`}>
                    {selectedCard.effect}
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={() => setSelectedCard(null)}
              variant="outline"
              size="sm"
              className="mt-2 bg-green-600 text-white hover:bg-green-700"
            >
              Back to Gallery
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1 py-1 sm:grid-cols-4">
              {cards.length === 0 ? (
                <div className="col-span-full py-4 text-center text-sm text-white">The discard pile is empty.</div>
              ) : (
                cards.map((card, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedCard(card)}
                  >
                    <Card
                      className={`h-[90px] w-full border-2 ${
                        card.type === "animal"
                          ? getEnvironmentColor(card.environment)
                          : "border-purple-600 bg-purple-900"
                      } p-0.5 shadow-md transition-all hover:ring-2 hover:ring-green-400`}
                    >
                      <CardContent className="flex h-full flex-col items-center justify-between p-0.5">
                        <div className="w-full text-center text-[8px] font-medium text-white">{card.name}</div>

                        <div className="relative h-[40px] w-full">{getCardArt(card)}</div>

                        <div className="w-full">
                          {card.type === "animal" ? (
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className={`${getEnvironmentBadgeColor(card.environment)} text-[6px] px-0.5 py-0`}
                              >
                                {card.environment}
                              </Badge>
                              <Badge className="bg-yellow-600 text-[6px] px-0.5 py-0 text-white">
                                {card.points} pts
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-center text-[6px] text-white line-clamp-1">Impact</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="rounded-full bg-black/50 p-1">
                        <Search className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={onClose}
                size="sm"
                className="bg-green-700 hover:bg-green-600 bg-green-600 text-white hover:bg-green-700"
              >
                Close Gallery
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
