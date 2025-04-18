"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCardArt } from "./card-art/card-art-mapper"
import type { GameCard } from "@/types/game"

interface CardZoomModalProps {
  open: boolean
  onClose: () => void
  card: GameCard | null
}

// Helper function to get environment color
const getEnvironmentColor = (environment?: string) => {
  switch (environment) {
    case "terrestrial":
      return "border-red-600 bg-red-900/60"
    case "aquatic":
      return "border-blue-600 bg-blue-900/60"
    case "amphibian":
      return "border-green-600 bg-green-900/60"
    default:
      return "border-gray-600 bg-gray-800/60"
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

export function CardZoomModal({ open, onClose, card }: CardZoomModalProps) {
  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-2 border-green-700 bg-green-900 text-white">
        <div className="flex flex-col items-center justify-center p-4">
          <Card
            className={`w-[240px] h-[360px] border-2 ${
              card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900/60"
            } p-2 shadow-md relative`}
          >
            <CardContent className="flex flex-col items-center p-1 h-full">
              <div className="text-center font-bold text-white text-lg">{card.name}</div>
              <div className="relative h-[180px] w-full flex items-center justify-center mt-2">{getCardArt(card)}</div>

              {card.type === "animal" ? (
                <div className="w-full mt-auto">
                  <div className="flex w-full items-center justify-between">
                    <Badge variant="outline" className={`${getEnvironmentBadgeColor(card.environment)} text-xs`}>
                      {card.environment}
                    </Badge>
                  </div>
                  {card.effect && (
                    <div className="mt-2 text-sm text-center px-1 leading-tight text-white bg-black/30 rounded p-1">
                      {card.effect}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-auto w-full">
                  <Badge variant="outline" className="bg-purple-900 text-white text-xs w-full justify-center">
                    Impact
                  </Badge>
                  <div className="mt-2 text-sm text-center px-1 leading-tight text-white bg-black/30 rounded p-1">
                    {card.effect}
                  </div>
                </div>
              )}
            </CardContent>

            {/* Points badge positioned in top left corner */}
            {card.type === "animal" && card.points > 0 && (
              <div className="absolute top-2 left-2 bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                {card.points}
              </div>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
