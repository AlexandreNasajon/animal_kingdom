"use client"

import { Card } from "@/components/ui/card"
import { getCardArt } from "@/components/card-art/card-art-mapper"
import type { GameCard } from "@/types/game"
import { Mountain, Droplets, Fish, Zap } from "lucide-react"

interface GameCardTemplateProps {
  card: GameCard
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  orderNumber?: number
  className?: string
}

export function GameCardTemplate({
  card,
  size = "md",
  selected = false,
  disabled = false,
  onClick,
  orderNumber,
  className = "",
}: GameCardTemplateProps) {
  // Determine card frame color based on environment
  const getFrameColor = () => {
    if (card.type !== "animal") return "border-purple-600 bg-gradient-to-br from-purple-800 to-purple-950"

    switch (card.environment) {
      case "aquatic":
        return "border-blue-600 bg-gradient-to-br from-blue-800 to-blue-950"
      case "terrestrial":
        return "border-red-600 bg-gradient-to-br from-red-800 to-red-950"
      case "amphibian":
        return "border-green-600 bg-gradient-to-br from-green-800 to-green-950"
      default:
        return "border-gray-600 bg-gradient-to-br from-gray-800 to-gray-950"
    }
  }

  // Get type icon based on card type and environment
  const getTypeIcon = () => {
    if (card.type === "impact") return <Zap className="h-3 w-3 text-purple-300" />

    switch (card.environment) {
      case "aquatic":
        return <Droplets className="h-3 w-3 text-blue-300" />
      case "terrestrial":
        return <Mountain className="h-3 w-3 text-red-300" />
      case "amphibian":
        return <Fish className="h-3 w-3 text-green-300" />
      default:
        return <Fish className="h-3 w-3 text-gray-300" />
    }
  }

  // Get glow color based on card type and environment
  const getGlowColor = () => {
    if (card.type !== "animal") return "shadow-purple-500/30"

    switch (card.environment) {
      case "aquatic":
        return "shadow-blue-500/30"
      case "terrestrial":
        return "shadow-red-500/30"
      case "amphibian":
        return "shadow-green-500/30"
      default:
        return "shadow-gray-500/30"
    }
  }

  // Size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return {
          card: "h-[80px] w-[60px] p-1",
          points: "text-[8px] w-4 h-4",
          name: "text-[7px] mb-0.5",
          art: "h-[30px]",
          effect: "text-[5px] mt-0.5 max-h-[15px]",
          border: selected ? "border-2" : "border",
        }
      case "sm":
        return {
          card: "h-[120px] w-[90px] p-1.5",
          points: "text-[10px] w-5 h-5",
          name: "text-[9px] mb-1",
          art: "h-[50px]",
          effect: "text-[7px] mt-1 max-h-[25px]",
          border: selected ? "border-2" : "border",
        }
      case "md":
        return {
          card: "h-[160px] w-[120px] p-2",
          points: "text-xs w-6 h-6",
          name: "text-xs mb-1",
          art: "h-[70px]",
          effect: "text-[9px] mt-1 max-h-[35px]",
          border: selected ? "border-3" : "border-2",
        }
      case "lg":
        return {
          card: "h-[200px] w-[150px] p-2.5",
          points: "text-sm w-7 h-7",
          name: "text-sm mb-1.5",
          art: "h-[90px]",
          effect: "text-[10px] mt-1.5 max-h-[45px]",
          border: selected ? "border-4" : "border-2",
        }
      case "xl":
        return {
          card: "h-[280px] w-[210px] p-3",
          points: "text-base w-8 h-8",
          name: "text-base mb-2",
          art: "h-[130px]",
          effect: "text-xs mt-2 max-h-[60px]",
          border: selected ? "border-4" : "border-2",
        }
      default:
        return {
          card: "h-[160px] w-[120px] p-2",
          points: "text-xs w-6 h-6",
          name: "text-xs mb-1",
          art: "h-[70px]",
          effect: "text-[9px] mt-1 max-h-[35px]",
          border: selected ? "border-3" : "border-2",
        }
    }
  }

  const styles = getSizeStyles()
  const frameColor = getFrameColor()
  const typeIcon = getTypeIcon()
  const glowColor = getGlowColor()

  return (
    <Card
      className={`${styles.card} ${styles.border} ${frameColor} ${selected ? "ring-2 ring-yellow-500 scale-105" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
      } transition-all relative overflow-hidden shadow-lg ${glowColor} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Enhanced card frame decoration */}
      <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-white/20 to-black/40 pointer-events-none"></div>
      <div className="absolute inset-0 border border-white/20 rounded-sm pointer-events-none"></div>

      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 opacity-30 rounded-sm pointer-events-none"
        style={{ boxShadow: "inset 0 0 15px rgba(255, 255, 255, 0.3)" }}
      ></div>

      {/* Points in top left with enhanced styling */}
      {card.type === "animal" && (
        <div className="absolute top-1 left-1 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center font-bold text-white shadow-md">
          <div className={`${styles.points} flex items-center justify-center`}>{card.points}</div>
        </div>
      )}

      {/* Type icon below points with subtle glow */}
      <div className="absolute top-7 left-1.5 filter drop-shadow-md">{typeIcon}</div>

      {/* Card name at top with text shadow */}
      <div
        className={`${styles.name} text-center font-bold text-white mt-0.5 px-5 drop-shadow-md`}
        style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}
      >
        {card.name}
      </div>

      {/* Card art with enhanced container */}
      <div className={`${styles.art} flex items-center justify-center relative bg-black/20 rounded-sm mx-auto my-1`}>
        {getCardArt(card)}
      </div>

      {/* Card effect/description with improved styling */}
      <div
        className={`${styles.effect} text-center text-gray-200 overflow-hidden bg-black/30 rounded-sm px-1 backdrop-blur-sm`}
      >
        {card.effect || (card.type === "animal" ? `${card.environment} animal` : "Impact card")}
      </div>

      {/* Order number for Octopus effect with improved styling */}
      {orderNumber !== undefined && (
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xs font-bold shadow-md">
          {orderNumber}
        </div>
      )}
    </Card>
  )
}
