"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { GameCard } from "@/types/game"
import { GameCardTemplate } from "./game-card-template"

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
  // Add support for tracking card click order for Octopus effect
  // Add a new state variable to track the order of card clicks
  const [clickOrder, setClickOrder] = useState<number[]>([])

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIndex(null)
      setSelectedPlayerIndex(null)
      setSelectedOpponentIndex(null)
      // Reset click order when modal opens
      setClickOrder([])
    }
  }, [open])

  // Update the handleCardClick function to track click order for Octopus effect
  const handleCardClick = (index: number) => {
    // For Octopus effect (when title contains "Rearrange"), track click order
    if (title.includes("Rearrange")) {
      // If already clicked, remove from order
      if (clickOrder.includes(index)) {
        setClickOrder(clickOrder.filter((i) => i !== index))
      } else {
        // Add to order
        setClickOrder([...clickOrder, index])
      }
    } else {
      // Normal behavior for other effects
      setSelectedIndex(index)
    }
  }

  const handlePlayerCardClick = (index: number) => {
    setSelectedPlayerIndex(index)
  }

  const handleOpponentCardClick = (index: number) => {
    setSelectedOpponentIndex(index)
  }

  // Update the handleConfirm function to pass the click order for Octopus effect
  const handleConfirm = () => {
    if (isConfuseEffect) {
      if (selectedPlayerIndex !== null && selectedOpponentIndex !== null) {
        onConfirm([selectedPlayerIndex, selectedOpponentIndex])
      }
    } else if (title.includes("Rearrange") && clickOrder.length > 0) {
      // For Octopus effect, pass the click order
      onConfirm(clickOrder)
    } else if (selectedIndex !== null) {
      onConfirm(selectedIndex)
    }
  }

  // Update the isCardSelectable function to properly check if filter is a function before calling it
  const isCardSelectable = (card: GameCard) => {
    if (!filter || typeof filter !== "function") return true
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
                  <div
                    key={`opponent-${index}`}
                    className={`${selectedOpponentIndex === index ? "scale-105 ring-2 ring-yellow-500" : ""} cursor-pointer`}
                    onClick={() => handleOpponentCardClick(index)}
                  >
                    <GameCardTemplate card={card} size="sm" selected={selectedOpponentIndex === index} />
                  </div>
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
                  <div
                    key={`player-${index}`}
                    className={`${selectedPlayerIndex === index ? "scale-105 ring-2 ring-yellow-500" : ""} cursor-pointer`}
                    onClick={() => handlePlayerCardClick(index)}
                  >
                    <GameCardTemplate card={card} size="sm" selected={selectedPlayerIndex === index} />
                  </div>
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
                      <div key={`ai-${aiIndex}`}>
                        <GameCardTemplate
                          card={card}
                          size="sm"
                          selected={selectedIndex === originalIndex}
                          disabled={!isSelectable}
                          onClick={() => isSelectable && handleCardClick(originalIndex)}
                        />
                      </div>
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
                      <div key={`player-${playerIndex}`} className="border-l-4 border-l-blue-500">
                        <GameCardTemplate
                          card={card}
                          size="sm"
                          selected={selectedIndex === originalIndex}
                          disabled={!isSelectable}
                          onClick={() => isSelectable && handleCardClick(originalIndex)}
                        />
                      </div>
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
                  <div key={index} className={isPlayerCard ? "border-l-4 border-l-blue-500" : ""}>
                    <GameCardTemplate
                      card={card}
                      size="sm"
                      selected={selectedIndex === index}
                      disabled={!isSelectable}
                      onClick={() => isSelectable && handleCardClick(index)}
                      orderNumber={
                        title.includes("Rearrange") && clickOrder.includes(index)
                          ? clickOrder.indexOf(index) + 1
                          : undefined
                      }
                    />
                  </div>
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
            disabled={
              selectedIndex === null && !isConfuseEffect && !(title.includes("Rearrange") && clickOrder.length > 0)
            }
            className="bg-green-700 hover:bg-green-600"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
