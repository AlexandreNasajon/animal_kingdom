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
import { Check, User, Bot } from "lucide-react"
import { getCardArt } from "./card-art/card-art-mapper"

interface TargetSelectionModalProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  onConfirm: (selectedIndex: number) => void
  onCancel: () => void
  title: string
  description: string
  filter?: (card: GameCard) => boolean
  playerCardIndices?: number[]
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
      return "bg-red-900 text-red-200"
    case "aquatic":
      return "bg-blue-900 text-blue-200"
    case "amphibian":
      return "bg-green-900 text-green-200"
    default:
      return "bg-gray-900 text-gray-200"
  }
}

export function TargetSelectionModal({
  open,
  onClose,
  cards,
  onConfirm,
  onCancel,
  title,
  description,
  filter,
  playerCardIndices = [],
}: TargetSelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const filteredCards = filter ? cards.filter((card) => card && filter(card)) : cards

  // Separate player and opponent cards
  const playerCards = filteredCards.filter((_, index) => playerCardIndices.includes(index))
  const opponentCards = filteredCards.filter((_, index) => !playerCardIndices.includes(index))

  // Create a mapping from the new index to the original index
  const indexMapping: Record<string, number> = {}
  playerCards.forEach((_, i) => {
    const originalIndex = playerCardIndices[i]
    indexMapping[`player-${i}`] = originalIndex
  })
  opponentCards.forEach((_, i) => {
    const originalIndex = filteredCards.findIndex(
      (card, idx) => !playerCardIndices.includes(idx) && card === opponentCards[i],
    )
    indexMapping[`opponent-${i}`] = originalIndex
  })

  const handleCardClick = (section: string, index: number) => {
    const mappedIndex = indexMapping[`${section}-${index}`]
    setSelectedIndex(mappedIndex)
  }

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      onConfirm(selectedIndex)
      setSelectedIndex(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-green-200 text-xs">{description}</DialogDescription>
        </DialogHeader>

        {filteredCards.length === 0 ? (
          <div className="py-1 text-center text-xs text-yellow-400">No valid targets available.</div>
        ) : (
          <div className="space-y-3">
            {/* Player's cards section */}
            {playerCards.length > 0 && (
              <div>
                <div className="mb-1 flex items-center gap-1 border-b border-blue-500/50 pb-1">
                  <User className="h-3 w-3 text-blue-400" />
                  <h3 className="text-xs font-medium text-blue-400">Your Cards</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {playerCards.map((card, index) => {
                    const mappedIndex = indexMapping[`player-${index}`]
                    const isSelected = selectedIndex === mappedIndex

                    return (
                      <div
                        key={`player-${card.id}-${index}`}
                        className="relative cursor-pointer"
                        onClick={() => handleCardClick("player", index)}
                      >
                        <Card
                          className={`h-[110px] w-full border-2 ${
                            card.type === "animal"
                              ? getEnvironmentColor(card.environment)
                              : "border-purple-600 bg-purple-900"
                          } p-0.5 shadow-md transition-all ${
                            isSelected ? "ring-2 ring-yellow-400" : "hover:ring-1 hover:ring-green-400"
                          } border-blue-500`}
                        >
                          <CardContent className="flex h-full flex-col items-center justify-between p-0.5">
                            <div className="w-full text-center text-[10px] font-medium">{card.name}</div>

                            <div className="relative h-[50px] w-full overflow-hidden">{getCardArt(card)}</div>

                            <div className="w-full">
                              {card.type === "animal" ? (
                                <div className="flex items-center justify-between">
                                  <Badge
                                    variant="outline"
                                    className={`${getEnvironmentBadgeColor(card.environment)} text-[8px] px-0.5 py-0`}
                                  >
                                    {card.environment}
                                  </Badge>
                                  <Badge className="bg-yellow-600 text-[8px] px-0.5 py-0">{card.points} pts</Badge>
                                </div>
                              ) : (
                                <div className="text-center text-[8px] text-gray-300 line-clamp-1">{card.effect}</div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Owner indicator */}
                        <div className="absolute left-0 top-0 p-0.5">
                          <div className="rounded-full bg-blue-600 p-0.5">
                            <User className="h-2 w-2 text-white" />
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute right-0.5 top-0.5 rounded-full bg-yellow-500 p-0.5">
                            <Check className="h-2 w-2 text-green-900" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Opponent's cards section */}
            {opponentCards.length > 0 && (
              <div>
                <div className="mb-1 flex items-center gap-1 border-b border-red-500/50 pb-1">
                  <Bot className="h-3 w-3 text-red-400" />
                  <h3 className="text-xs font-medium text-red-400">AI's Cards</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {opponentCards.map((card, index) => {
                    const mappedIndex = indexMapping[`opponent-${index}`]
                    const isSelected = selectedIndex === mappedIndex

                    return (
                      <div
                        key={`opponent-${card.id}-${index}`}
                        className="relative cursor-pointer"
                        onClick={() => handleCardClick("opponent", index)}
                      >
                        <Card
                          className={`h-[110px] w-full border-2 ${
                            card.type === "animal"
                              ? getEnvironmentColor(card.environment)
                              : "border-purple-600 bg-purple-900"
                          } p-0.5 shadow-md transition-all ${
                            isSelected ? "ring-2 ring-yellow-400" : "hover:ring-1 hover:ring-green-400"
                          } border-red-500`}
                        >
                          <CardContent className="flex h-full flex-col items-center justify-between p-0.5">
                            <div className="w-full text-center text-[10px] font-medium">{card.name}</div>

                            <div className="relative h-[50px] w-full overflow-hidden">{getCardArt(card)}</div>

                            <div className="w-full">
                              {card.type === "animal" ? (
                                <div className="flex items-center justify-between">
                                  <Badge
                                    variant="outline"
                                    className={`${getEnvironmentBadgeColor(card.environment)} text-[8px] px-0.5 py-0`}
                                  >
                                    {card.environment}
                                  </Badge>
                                  <Badge className="bg-yellow-600 text-[8px] px-0.5 py-0">{card.points} pts</Badge>
                                </div>
                              ) : (
                                <div className="text-center text-[8px] text-gray-300 line-clamp-1">{card.effect}</div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Owner indicator */}
                        <div className="absolute right-0 top-0 p-0.5">
                          <div className="rounded-full bg-red-600 p-0.5">
                            <Bot className="h-2 w-2 text-white" />
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute right-0.5 top-0.5 rounded-full bg-yellow-500 p-0.5">
                            <Check className="h-2 w-2 text-green-900" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIndex === null || filteredCards.length === 0}
            className="bg-green-700 hover:bg-green-600"
            size="sm"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
