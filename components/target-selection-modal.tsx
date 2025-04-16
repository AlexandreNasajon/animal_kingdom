"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getCardArt } from "@/components/card-art/card-art-mapper"
import type { GameCard } from "@/types/game"

interface TargetSelectionModalProps {
  open: boolean
  onClose: () => void
  cards: GameCard[]
  onConfirm: (targetIndex: number | number[]) => void
  onCancel?: () => void
  title: string
  description: string
  filter?: (card: GameCard) => boolean
  playerCardIndices?: number[]
  isConfuseEffect?: boolean
  playerField?: GameCard[]
  opponentField?: GameCard[]
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
  isConfuseEffect = false,
  playerField = [],
  opponentField = [],
}: TargetSelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null)
  const [selectedOpponentIndex, setSelectedOpponentIndex] = useState<number | null>(null)

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIndex(null)
      setSelectedPlayerIndex(null)
      setSelectedOpponentIndex(null)
    }
  }, [open])

  const handleCardClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handlePlayerCardClick = (index: number) => {
    setSelectedPlayerIndex(index)
  }

  const handleOpponentCardClick = (index: number) => {
    setSelectedOpponentIndex(index)
  }

  const handleConfirm = () => {
    if (isConfuseEffect) {
      if (selectedPlayerIndex !== null && selectedOpponentIndex !== null) {
        onConfirm([selectedPlayerIndex, selectedOpponentIndex])
      }
    } else if (selectedIndex !== null) {
      onConfirm(selectedIndex)
    }
  }

  const isCardSelectable = (card: GameCard) => {
    if (!filter) return true
    return filter(card)
  }

  // Special UI for Confuse effect
  if (isConfuseEffect) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto bg-green-900 border-2 border-green-700 text-white">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-green-300">{description}</DialogDescription>
          </DialogHeader>

          {/* Opponent's field (AI) - shown first/on top */}
          <div className="mb-4">
            <h3 className="text-sm font-bold mb-2 text-red-300">AI's Animals</h3>
            <div className="grid grid-cols-3 gap-2">
              {opponentField.length > 0 ? (
                opponentField.map((card, index) => (
                  <Card
                    key={`opponent-${index}`}
                    className={`p-2 h-[120px] cursor-pointer transition-all ${
                      selectedOpponentIndex === index
                        ? "border-4 border-yellow-500 scale-105"
                        : "border border-green-700 hover:border-green-500"
                    } ${
                      card.type === "animal"
                        ? card.environment === "terrestrial"
                          ? "bg-red-900/60"
                          : card.environment === "aquatic"
                            ? "bg-blue-900/60"
                            : "bg-green-900/60"
                        : "bg-purple-900/60"
                    }`}
                    onClick={() => handleOpponentCardClick(index)}
                  >
                    <div className="text-center text-xs font-bold mb-1">{card.name}</div>
                    <div className="relative h-[60px] flex items-center justify-center">{getCardArt(card)}</div>
                    <div className="mt-1 text-center text-[10px]">
                      <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center text-sm text-gray-400 py-4">No animals on AI's field</div>
              )}
            </div>
          </div>

          {/* Player's field - shown second/below */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-blue-300">Your Animals</h3>
            <div className="grid grid-cols-3 gap-2">
              {playerField.length > 0 ? (
                playerField.map((card, index) => (
                  <Card
                    key={`player-${index}`}
                    className={`p-2 h-[120px] cursor-pointer transition-all ${
                      selectedPlayerIndex === index
                        ? "border-4 border-yellow-500 scale-105"
                        : "border border-green-700 hover:border-green-500"
                    } ${
                      card.type === "animal"
                        ? card.environment === "terrestrial"
                          ? "bg-red-900/60"
                          : card.environment === "aquatic"
                            ? "bg-blue-900/60"
                            : "bg-green-900/60"
                        : "bg-purple-900/60"
                    }`}
                    onClick={() => handlePlayerCardClick(index)}
                  >
                    <div className="text-center text-xs font-bold mb-1">{card.name}</div>
                    <div className="relative h-[60px] flex items-center justify-center">{getCardArt(card)}</div>
                    <div className="mt-1 text-center text-[10px]">
                      <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center text-sm text-gray-400 py-4">No animals on your field</div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="border-red-700 text-red-400">
                Cancel
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              disabled={selectedPlayerIndex === null || selectedOpponentIndex === null}
              className="bg-green-700 hover:bg-green-600"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Standard UI for other effects
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto bg-green-900 border-2 border-green-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-green-300">{description}</DialogDescription>
        </DialogHeader>

        {/* Check if we need to separate player and AI animals */}
        {cards.length > 0 &&
        cards[0].type === "animal" &&
        playerCardIndices.length > 0 &&
        playerCardIndices.length < cards.length ? (
          <>
            {/* AI's animals - shown first/on top */}
            <div className="mb-4">
              <h3 className="text-sm font-bold mb-2 text-red-300">AI's Animals</h3>
              <div className="grid grid-cols-3 gap-2">
                {cards
                  .filter((_, index) => !playerCardIndices.includes(index))
                  .map((card, aiIndex) => {
                    const originalIndex = cards.findIndex(
                      (c, i) =>
                        !playerCardIndices.includes(i) &&
                        cards.filter((_, idx) => !playerCardIndices.includes(idx)).indexOf(c) === aiIndex,
                    )
                    const isSelectable = isCardSelectable(card)

                    return (
                      <Card
                        key={`ai-${aiIndex}`}
                        className={`p-2 h-[120px] transition-all ${
                          selectedIndex === originalIndex
                            ? "border-4 border-yellow-500 scale-105"
                            : "border border-green-700 hover:border-green-500"
                        } ${
                          card.type === "animal"
                            ? card.environment === "terrestrial"
                              ? "bg-red-900/60"
                              : card.environment === "aquatic"
                                ? "bg-blue-900/60"
                                : "bg-green-900/60"
                            : "bg-purple-900/60"
                        } ${!isSelectable ? "opacity-50" : "cursor-pointer"}`}
                        onClick={() => isSelectable && handleCardClick(originalIndex)}
                      >
                        <div className="text-center text-xs font-bold mb-1">{card.name}</div>
                        <div className="relative h-[60px] flex items-center justify-center">{getCardArt(card)}</div>
                        <div className="mt-1 text-center text-[10px]">
                          {card.type === "animal" ? (
                            <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>
                          ) : (
                            <span className="bg-purple-800 px-1 rounded">Impact</span>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                {cards.filter((_, index) => !playerCardIndices.includes(index)).length === 0 && (
                  <div className="col-span-3 text-center text-sm text-gray-400 py-4">No AI animals available</div>
                )}
              </div>
            </div>

            {/* Player's animals - shown second/below */}
            <div>
              <h3 className="text-sm font-bold mb-2 text-blue-300">Your Animals</h3>
              <div className="grid grid-cols-3 gap-2">
                {cards
                  .filter((_, index) => playerCardIndices.includes(index))
                  .map((card, playerIndex) => {
                    const originalIndex = playerCardIndices[playerIndex]
                    const isSelectable = isCardSelectable(card)

                    return (
                      <Card
                        key={`player-${playerIndex}`}
                        className={`p-2 h-[120px] transition-all ${
                          selectedIndex === originalIndex
                            ? "border-4 border-yellow-500 scale-105"
                            : "border border-green-700 hover:border-green-500"
                        } ${
                          card.type === "animal"
                            ? card.environment === "terrestrial"
                              ? "bg-red-900/60"
                              : card.environment === "aquatic"
                                ? "bg-blue-900/60"
                                : "bg-green-900/60"
                            : "bg-purple-900/60"
                        } ${!isSelectable ? "opacity-50" : "cursor-pointer"} border-l-4 border-l-blue-500`}
                        onClick={() => isSelectable && handleCardClick(originalIndex)}
                      >
                        <div className="text-center text-xs font-bold mb-1">{card.name}</div>
                        <div className="relative h-[60px] flex items-center justify-center">{getCardArt(card)}</div>
                        <div className="mt-1 text-center text-[10px]">
                          {card.type === "animal" ? (
                            <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>
                          ) : (
                            <span className="bg-purple-800 px-1 rounded">Impact</span>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                {cards.filter((_, index) => playerCardIndices.includes(index)).length === 0 && (
                  <div className="col-span-3 text-center text-sm text-gray-400 py-4">No player animals available</div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Regular grid for non-animal cards or when we don't need to separate
          <div className="grid grid-cols-3 gap-2">
            {cards.length > 0 ? (
              cards.map((card, index) => {
                const isSelectable = isCardSelectable(card)
                const isPlayerCard = playerCardIndices.includes(index)

                return (
                  <Card
                    key={index}
                    className={`p-2 h-[120px] transition-all ${
                      selectedIndex === index
                        ? "border-4 border-yellow-500 scale-105"
                        : "border border-green-700 hover:border-green-500"
                    } ${
                      card.type === "animal"
                        ? card.environment === "terrestrial"
                          ? "bg-red-900/60"
                          : card.environment === "aquatic"
                            ? "bg-blue-900/60"
                            : "bg-green-900/60"
                        : "bg-purple-900/60"
                    } ${!isSelectable ? "opacity-50" : "cursor-pointer"} ${
                      isPlayerCard ? "border-l-4 border-l-blue-500" : ""
                    }`}
                    onClick={() => isSelectable && handleCardClick(index)}
                  >
                    <div className="text-center text-xs font-bold mb-1">{card.name}</div>
                    <div className="relative h-[60px] flex items-center justify-center">{getCardArt(card)}</div>
                    <div className="mt-1 text-center text-[10px]">
                      {card.type === "animal" ? (
                        <span className="bg-yellow-600 px-1 rounded">{card.points} pts</span>
                      ) : (
                        <span className="bg-purple-800 px-1 rounded">Impact</span>
                      )}
                    </div>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-3 text-center text-sm text-gray-400 py-4">No valid targets available</div>
            )}
          </div>
        )}

        <DialogFooter className="mt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="border-red-700 text-red-400">
              Cancel
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={selectedIndex === null && !isConfuseEffect}
            className="bg-green-700 hover:bg-green-600"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
