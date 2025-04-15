"use client"

import { useState } from "react"
import type { GameCard } from "@/types/game"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Play } from "lucide-react"
import { getCardArt } from "./card-art/card-art-mapper"

interface CardDetailModalProps {
  open: boolean
  onClose: () => void
  card: GameCard | null
  onPlay: () => void
  disabled: boolean
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

export function CardDetailModal({ open, onClose, card, onPlay, disabled }: CardDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!card) return null

  const handlePlay = () => {
    setIsPlaying(true)
    // Add a small delay to allow animation to play
    setTimeout(() => {
      onPlay()
      setIsPlaying(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-2 border-green-700 bg-green-900 p-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-base">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-2">
          <Card
            className={`w-[150px] border-2 ${
              card.type === "animal" ? getEnvironmentColor(card.environment) : "border-purple-600 bg-purple-900"
            } p-1 shadow-md transition-all ${isPlaying ? "animate-play" : "animate-flip"}`}
          >
            <CardContent className="flex flex-col items-center space-y-2 p-1">
              <div className="relative h-[100px] w-full">{getCardArt(card)}</div>

              {card.type === "animal" ? (
                <div className="flex w-full items-center justify-between">
                  <Badge variant="outline" className={`${getEnvironmentBadgeColor(card.environment)} text-xs`}>
                    {card.environment}
                  </Badge>
                  <Badge className="bg-yellow-600 text-xs">{card.points} pts</Badge>
                </div>
              ) : (
                <Badge variant="outline" className="bg-purple-900 text-purple-200 text-xs">
                  Impact Card
                </Badge>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            {card.type === "animal" ? (
              <div>
                <p className="text-xs text-green-200">
                  {card.environment === "amphibian"
                    ? "This animal can live in both terrestrial and aquatic environments."
                    : `This is a ${card.environment} animal.`}
                </p>
                <p className="mt-0.5 text-xs text-yellow-200">Worth {card.points} points when played on your field.</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-purple-200">Effect:</p>
                <p className="mt-0.5 text-xs text-white">{card.effect}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex items-center gap-1 border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
            size="sm"
          >
            <X className="h-3 w-3" /> Close
          </Button>
          <Button
            onClick={handlePlay}
            disabled={disabled || isPlaying}
            className="flex items-center gap-1 bg-green-700 hover:bg-green-600"
            size="sm"
          >
            <Play className="h-3 w-3" /> Play Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
