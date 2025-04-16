"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCardArt } from "./card-art/card-art-mapper"

interface ExchangeSelectionModalProps {
  open: boolean
  onClose: () => void
  playerCards: GameCard[]
  opponentCards: GameCard[]
  onConfirm: (selections: number[]) => void
  title: string
  description: string
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

export function ExchangeSelectionModal({
  open,
  onClose,
  playerCards,
  opponentCards,
  onConfirm,
  title,
  description,
}: ExchangeSelectionModalProps) {
  const [selectedPlayerCard, setSelectedPlayerCard] = useState<number | null>(null)
  const [selectedOpponentCard, setSelectedOpponentCard] = useState<number | null>(null)

  const handleConfirm = () => {
    if (selectedPlayerCard !== null && selectedOpponentCard !== null) {
      onConfirm([selectedPlayerCard, selectedOpponentCard])
      resetSelections()
    }
  }

  const resetSelections = () => {
    setSelectedPlayerCard(null)
    setSelectedOpponentCard(null)
  }

  const handleClose = () => {
    resetSelections()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-white">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Player's cards */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Your Animals:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {playerCards.length === 0 ? (
                <div className="text-sm text-white">No animals available</div>
              ) : (
                playerCards.map((card, index) => (
                  <div key={card.id} className="relative">
                    <Card
                      className={`h-[120px] w-[90px] cursor-pointer ${
                        card.type === "animal"
                          ? getEnvironmentColor(card.environment)
                          : "border-purple-600 bg-purple-900"
                      } ${selectedPlayerCard === index ? "ring-2 ring-yellow-400" : ""} relative overflow-hidden`}
                      onClick={() => setSelectedPlayerCard(index)}
                    >
                      {/* Card frame decoration */}
                      <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                      <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                      <CardContent className="flex h-full flex-col items-center justify-between p-1">
                        <div className="w-full text-center text-xs font-medium text-white">{card.name}</div>

                        <div className="relative h-[70px] w-full">{getCardArt(card)}</div>

                        <div className="w-full">
                          {card.type === "animal" && (
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-[9px] text-white">
                                {card.environment}
                              </Badge>
                              <Badge className="bg-yellow-600 text-[9px] text-white">{card.points}</Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    {selectedPlayerCard === index && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        1
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Opponent's cards */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Opponent's Animals:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {opponentCards.length === 0 ? (
                <div className="text-sm text-white">No animals available</div>
              ) : (
                opponentCards.map((card, index) => (
                  <div key={card.id} className="relative">
                    <Card
                      className={`h-[120px] w-[90px] cursor-pointer ${
                        card.type === "animal"
                          ? getEnvironmentColor(card.environment)
                          : "border-purple-600 bg-purple-900"
                      } ${selectedOpponentCard === index ? "ring-2 ring-yellow-400" : ""} relative overflow-hidden`}
                      onClick={() => setSelectedOpponentCard(index)}
                    >
                      {/* Card frame decoration */}
                      <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
                      <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

                      <CardContent className="flex h-full flex-col items-center justify-between p-1">
                        <div className="w-full text-center text-xs font-medium text-white">{card.name}</div>

                        <div className="relative h-[70px] w-full">{getCardArt(card)}</div>

                        <div className="w-full">
                          {card.type === "animal" && (
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-[9px] text-white">
                                {card.environment}
                              </Badge>
                              <Badge className="bg-yellow-600 text-[9px] text-white">{card.points}</Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    {selectedOpponentCard === index && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        2
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={handleClose} className="text-white">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedPlayerCard === null || selectedOpponentCard === null}
              className="text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
