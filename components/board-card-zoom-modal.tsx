"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { GameCard } from "@/types/game"
import { getCardArt } from "@/components/card-art/card-art-mapper"

interface BoardCardZoomModalProps {
  open: boolean
  onClose: () => void
  card: GameCard | null
  isOpponentCard?: boolean
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

export function BoardCardZoomModal({ open, onClose, card, isOpponentCard = false }: BoardCardZoomModalProps) {
  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base flex justify-between items-center">
            <span>{card.name}</span>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full hover:bg-red-900 text-black bg-green-600 text-white hover:bg-green-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-3">
          <Card
            className={`w-[180px] h-[280px] border-2 ${
              card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
            } p-1 shadow-md transition-all animate-flip relative overflow-hidden ${
              isOpponentCard ? "border-red-500" : "border-blue-500"
            }`}
          >
            {/* Card frame decoration */}
            <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
            <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

            <CardContent className="flex h-full flex-col items-center space-y-2 p-1">
              <div className="text-center text-lg font-bold">{card.name}</div>

              <div className="relative h-[180px] w-full flex items-center justify-center">{getCardArt(card)}</div>

              {card.type === "animal" ? (
                <div className="flex w-full items-center justify-between mt-auto">
                  <Badge variant="outline" className={`${getEnvironmentBadgeColor(card.environment)} text-xs`}>
                    {card.environment}
                  </Badge>
                  {card.points && (
                    <div className="absolute top-2 left-2 bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      {card.points}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-auto w-full">
                  <Badge variant="outline" className="bg-purple-900 text-purple-200 text-xs w-full justify-center">
                    Impact Card
                  </Badge>
                  <div className="mt-2 text-xs text-center line-clamp-3">{card.effect}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            {card.type === "animal" ? (
              <div>
                <p className="text-sm text-green-200">
                  {card.environment === "amphibian"
                    ? "This animal can live in both terrestrial and aquatic environments."
                    : `This is a ${card.environment} animal.`}
                </p>
                <p className="mt-1 text-sm text-yellow-200">Worth {card.points} points when played on your field.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-purple-200">Impact Card</p>
                {/* Removed duplicate effect text */}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
