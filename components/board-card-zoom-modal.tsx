"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
      return "bg-red-900 text-white"
    case "aquatic":
      return "bg-blue-900 text-white"
    case "amphibian":
      return "bg-green-900 text-white"
    default:
      return "bg-gray-900 text-white"
  }
}

export function BoardCardZoomModal({ open, onClose, card, isOpponentCard = false }: BoardCardZoomModalProps) {
  if (!card) return null

  // Adjust font size for longer effect text
  const getEffectFontSize = (effect?: string) => {
    if (!effect) return "text-xs"
    if (effect.length > 60) return "text-[10px]"
    if (effect.length > 40) return "text-[11px]"
    return "text-xs"
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base text-white">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-3">
          <Card
            className={`w-[180px] h-[280px] border-2 ${
              card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
            } p-1 shadow-md transition-all relative overflow-hidden ${
              isOpponentCard ? "border-red-500" : "border-blue-500"
            }`}
          >
            {/* Card frame decoration */}
            <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
            <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none"></div>

            <CardContent className="flex flex-col items-center p-1 h-full">
              <div className="text-center font-bold text-white">{card.name}</div>
              <div className="relative h-[140px] w-full flex items-center justify-center mt-2">{getCardArt(card)}</div>

              {card.type === "animal" ? (
                <div className="w-full mt-auto">
                  <div className="flex w-full items-center justify-between">
                    <Badge variant="outline" className={`${getEnvironmentBadgeColor(card.environment)} text-xs`}>
                      {card.environment}
                    </Badge>
                    {card.points && (
                      <div className="absolute top-2 left-2 bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                        {card.points}
                      </div>
                    )}
                  </div>
                  {card.effect && (
                    <div className="mt-2 text-xs text-center px-1 leading-tight text-white bg-black/30 rounded p-1">
                      {card.effect}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-auto w-full">
                  <Badge variant="outline" className="bg-purple-900 text-white text-xs w-full justify-center">
                    Impact
                  </Badge>
                  <div className="mt-2 text-xs text-center px-1 leading-tight text-white bg-black/30 rounded p-1">
                    {card.effect}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            {card.type === "animal" ? (
              <div>
                <p className="text-sm text-white">
                  {card.environment === "amphibian"
                    ? "This animal can live in both terrestrial and aquatic environments."
                    : `This is a ${card.environment} animal.`}
                </p>
              </div>
            ) : (
              <div>
                <p className={`${getEffectFontSize(card.effect)} text-white`}>{card.effect}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
