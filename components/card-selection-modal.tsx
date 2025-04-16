"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCardArt } from "./card-art/card-art-mapper"

interface CardSelectionModalProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  onConfirm: (selectedIndices: number[]) => void
  title: string
  description: string
  selectionCount: number
  actionText: string
  filter?: (card: GameCard) => boolean
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

export function CardSelectionModal({
  open,
  onClose,
  cards,
  onConfirm,
  title,
  description,
  selectionCount,
  actionText,
  filter,
}: CardSelectionModalProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])

  // Filter cards if a filter function is provided
  const filteredCards = filter ? cards.filter(filter) : cards

  const handleCardClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      // If already selected, deselect it
      setSelectedIndices(selectedIndices.filter((i) => i !== index))
    } else if (selectedIndices.length < selectionCount) {
      // If not at max selection, select it
      setSelectedIndices([...selectedIndices, index])
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedIndices)
    setSelectedIndices([])
  }

  const handleClose = () => {
    onClose()
    setSelectedIndices([])
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>

        <div className="text-xs text-green-200 mb-2">{description}</div>

        <div className="flex flex-wrap justify-center gap-2 max-h-[300px] overflow-y-auto p-1">
          {filteredCards.length === 0 ? (
            <div className="text-center text-sm text-green-400 py-4">No valid cards available</div>
          ) : (
            filteredCards.map((card, index) => (
              <div
                key={index}
                className={`relative cursor-pointer transition-all duration-200 ease-in-out ${
                  selectedIndices.includes(index) ? "scale-105 ring-2 ring-yellow-400" : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <Card
                  className={`w-[80px] h-[120px] border-2 ${
                    card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                  } p-1 shadow-md relative overflow-hidden`}
                >
                  {/* Card frame decoration */}
                  <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                  <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                  <CardContent className="flex flex-col items-center space-y-1 p-0 h-full">
                    <div className="text-center text-[10px] font-bold truncate w-full">{card.name}</div>
                    <div className="relative h-[70px] w-full flex items-center justify-center">{getCardArt(card)}</div>

                    {card.type === "animal" ? (
                      <div className="flex w-full items-center justify-between mt-auto">
                        <Badge variant="outline" className={`${getEnvironmentBadgeColor(card.environment)} text-[8px]`}>
                          {card.environment}
                        </Badge>
                        {card.points && (
                          <div className="absolute top-1 left-1 bg-yellow-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">
                            {card.points}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-auto w-full">
                        <div className="text-[8px] text-center line-clamp-2">{card.effect}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Selection indicator */}
                {selectedIndices.includes(index) && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {selectedIndices.indexOf(index) + 1}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex justify-between pt-2">
          <Button
            onClick={handleClose}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIndices.length !== selectionCount || filteredCards.length === 0}
            className="bg-green-700 hover:bg-green-600 text-black"
            size="sm"
          >
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
