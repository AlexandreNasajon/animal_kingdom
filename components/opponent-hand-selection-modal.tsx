"use client"
import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCardArt } from "./card-art/card-art-mapper"
import { Check } from "lucide-react"

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
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base text-white">{title}</DialogTitle>
          {description && <p className="text-sm text-green-200 mt-1">{description}</p>}
        </DialogHeader>

        <div className="flex flex-wrap justify-center gap-2 p-2">
          {cards.length === 0 ? (
            <p className="text-center text-sm">Opponent has no cards in hand.</p>
          ) : (
            cards.map((card, index) => (
              <div
                key={index}
                className={`relative cursor-pointer transform transition-all ${
                  selectedIndex === index ? "scale-105" : ""
                } hover:scale-105`}
                onClick={() => handleCardClick(index)}
              >
                <Card
                  className={`w-[120px] h-[180px] border-2 ${
                    card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
                  } p-1 shadow-md ${selectedIndex === index ? "ring-2 ring-yellow-400" : ""}`}
                >
                  <CardContent className="flex flex-col items-center p-1 h-full">
                    <div className="text-center text-xs font-bold text-white">{card.name}</div>
                    <div className="relative h-[90px] w-full flex items-center justify-center mt-1">
                      {getCardArt(card)}
                    </div>

                    <div className="w-full mt-auto">
                      {card.type === "animal" ? (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between">
                            <span className="bg-gray-800 px-1 rounded text-[8px]">{card.environment}</span>
                            <span className="bg-yellow-600 px-1 rounded text-[8px]">{card.points} pts</span>
                          </div>
                          {card.effect && (
                            <div className="text-[7px] text-center px-1 leading-tight text-white bg-black/30 rounded p-0.5">
                              {card.effect}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="bg-purple-900 text-white text-[8px] text-center rounded">Impact</div>
                          <div className="text-[7px] text-center px-1 leading-tight text-white bg-black/30 rounded p-0.5 mt-0.5">
                            {card.effect}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {selectedIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Check className="h-6 w-6 text-yellow-400" />
                    </div>
                  )}
                </Card>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex justify-center pt-2">
          <Button
            onClick={handleConfirm}
            disabled={selectedIndex === null}
            className="bg-green-700 hover:bg-green-600 text-white"
          >
            Discard Selected Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
