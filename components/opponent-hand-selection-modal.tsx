"use client"
import { useState } from "react"
import type { GameCard } from "@/types/game"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getCardArt } from "./card-art/card-art-mapper"

interface OpponentHandSelectionProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  onSelect: (index: number) => void
  title: string
  description?: string
}

export function OpponentHandSelectionModal({
  open,
  onClose,
  cards,
  onSelect,
  title,
  description,
}: OpponentHandSelectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleCardClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      onSelect(selectedIndex)
      setSelectedIndex(null)
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedIndex(null)
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

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900/90 text-white max-w-[90%] sm:max-w-[400px] p-4">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription className="text-green-200 text-sm">{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 mt-2 max-h-[300px] overflow-y-auto">
          {cards.map((card, index) => (
            <Card
              key={index}
              className={`cursor-pointer border-2 ${
                card.type === "animal"
                  ? card.environment === "terrestrial"
                    ? "border-red-600 bg-red-900"
                    : card.environment === "aquatic"
                      ? "border-blue-600 bg-blue-900"
                      : "border-green-600 bg-green-900"
                  : "border-purple-600 bg-purple-900"
              } hover:scale-105 transition-transform ${
                selectedIndex === index ? "ring-2 ring-yellow-400 scale-105" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="p-2 flex flex-col items-center h-[120px]">
                <div className="text-center text-xs font-bold mb-1 truncate w-full">{card.name}</div>
                <div className="relative flex-1 w-full flex items-center justify-center">{getCardArt(card)}</div>
                <div className="w-full text-center text-[8px] mt-1">
                  {card.type === "animal" ? (
                    <div className="flex items-center justify-center gap-1">
                      <span className="bg-gray-800 px-1 rounded">{card.environment}</span>
                      {card.points && <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>}
                    </div>
                  ) : (
                    <div className="text-gray-300 line-clamp-1">{card.effect}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedIndex !== null) {
                onSelect(selectedIndex)
              }
            }}
            disabled={selectedIndex === null}
            className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700"
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
