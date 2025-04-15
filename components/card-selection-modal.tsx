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
import { Check } from "lucide-react"
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
}: CardSelectionModalProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])

  const toggleCardSelection = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index))
    } else {
      if (selectedIndices.length < selectionCount) {
        setSelectedIndices([...selectedIndices, index])
      }
    }
  }

  const handleConfirm = () => {
    if (selectedIndices.length === selectionCount) {
      onConfirm(selectedIndices)
      setSelectedIndices([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-green-200 text-xs">
            {description} {selectionCount > 1 ? `Select ${selectionCount} cards.` : "Select 1 card."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-1 py-1 sm:grid-cols-5 md:grid-cols-6">
          {cards.map((card, index) => {
            const isSelected = selectedIndices.includes(index)

            return (
              <div
                key={`${card.id}-${index}`}
                className="relative cursor-pointer"
                onClick={() => toggleCardSelection(index)}
              >
                <Card
                  className={`h-[90px] w-full border-2 ${
                    card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                  } p-0.5 shadow-md transition-all ${
                    isSelected ? "ring-2 ring-yellow-400" : "hover:ring-1 hover:ring-green-400"
                  }`}
                >
                  <CardContent className="flex h-full flex-col items-center justify-between p-0.5">
                    <div className="w-full text-center text-[8px] font-medium">{card.name}</div>

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
                          <Badge className="bg-yellow-600 text-[6px] px-0.5 py-0">{card.points} pts</Badge>
                        </div>
                      ) : (
                        <div className="text-center text-[6px] text-gray-300 line-clamp-1">{card.effect}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {isSelected && (
                  <div className="absolute right-0.5 top-0.5 rounded-full bg-yellow-500 p-0.5">
                    <Check className="h-2 w-2 text-green-900" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={selectedIndices.length !== selectionCount}
            className="bg-green-700 hover:bg-green-600"
            size="sm"
          >
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
