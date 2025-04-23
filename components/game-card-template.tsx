"use client"

import { Card } from "@/components/ui/card"
import { getCardArt } from "./card-art/card-art-mapper"

interface GameCardTemplateProps {
  card: any
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
  // Get card type label based on card type and environment
  const getCardTypeLabel = () => {
    if (card.type === "impact") return "IMPACT"

    switch (card.environment) {
      case "aquatic":
        return "AQUATIC"
      case "terrestrial":
        return "TERRESTRIAL"
      case "amphibian":
        return "AMPHIBIAN"
      default:
        return ""
    }
  }

  // Size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return {
          card: "h-[80px] w-[60px]",
          points: "text-[8px] w-4 h-4",
          typeLabel: "text-[6px] px-1",
          name: "text-[7px] mb-0.5",
          art: "h-[30px]",
          effect: "text-[5px] mt-0.5 max-h-[15px]",
          border: selected ? "border-2" : "border",
        }
      case "sm":
        return {
          card: "h-[120px] w-[90px]",
          points: "text-[10px] w-5 h-5",
          typeLabel: "text-[8px] px-1.5",
          name: "text-[9px] mb-1",
          art: "h-[50px]",
          effect: "text-[7px] mt-1 max-h-[25px]",
          border: selected ? "border-2" : "border",
        }
      case "md":
        return {
          card: "h-[160px] w-[120px]",
          points: "text-xs w-6 h-6",
          typeLabel: "text-[10px] px-2",
          name: "text-xs mb-1",
          art: "h-[70px]",
          effect: "text-[9px] mt-1 max-h-[35px]",
          border: selected ? "border-3" : "border-2",
        }
      case "lg":
        return {
          card: "h-[200px] w-[150px]",
          points: "text-sm w-7 h-7",
          typeLabel: "text-xs px-2",
          name: "text-sm mb-1.5",
          art: "h-[90px]",
          effect: "text-[10px] mt-1.5 max-h-[45px]",
          border: selected ? "border-4" : "border-2",
        }
      case "xl":
        return {
          card: "h-[280px] w-[210px]",
          points: "text-base w-8 h-8",
          typeLabel: "text-sm px-2.5",
          name: "text-base mb-2",
          art: "h-[130px]",
          effect: "text-xs mt-2 max-h-[60px]",
          border: selected ? "border-4" : "border-2",
        }
      default:
        return {
          card: "h-[160px] w-[120px]",
          points: "text-xs w-6 h-6",
          typeLabel: "text-[10px] px-2",
          name: "text-xs mb-1",
          art: "h-[70px]",
          effect: "text-[9px] mt-1 max-h-[35px]",
          border: selected ? "border-3" : "border-2",
        }
    }
  }

  // Get background color based on card type and environment
  const getCardBackground = () => {
    if (card.type === "impact") {
      return "bg-black"
    }

    switch (card.environment) {
      case "aquatic":
        return "bg-gradient-to-b from-blue-900 to-blue-700"
      case "terrestrial":
        return "bg-gradient-to-b from-red-900 to-red-700"
      case "amphibian":
        return "bg-gradient-to-b from-green-900 to-green-700"
      default:
        return "bg-gradient-to-b from-gray-900 to-gray-700"
    }
  }

  // Get type label background color
  const getTypeLabelBackground = () => {
    if (card.type === "impact") {
      return "bg-black"
    }

    switch (card.environment) {
      case "aquatic":
        return "bg-blue-800"
      case "terrestrial":
        return "bg-red-800"
      case "amphibian":
        return "bg-green-800"
      default:
        return "bg-gray-800"
    }
  }

  const styles = getSizeStyles()
  const cardBackground = getCardBackground()
  const typeLabelBackground = getTypeLabelBackground()
  const typeLabel = getCardTypeLabel()

  // Get smaller font size for specific cards with longer text
  const getEffectFontSize = () => {
    if (card.name && ["crocodile", "shark", "lion"].includes(card.name.toLowerCase())) {
      switch (size) {
        case "xs":
          return "text-[4px]"
        case "sm":
          return "text-[6px]"
        case "md":
          return "text-[8px]"
        case "lg":
          return "text-[9px]"
        case "xl":
          return "text-[11px]"
        default:
          return "text-[8px]"
      }
    }
    return styles.effect
  }

  return (
    <Card
      className={`${styles.card} ${styles.border} border-black ${selected ? "ring-2 ring-yellow-500 scale-105" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
      } transition-all relative overflow-hidden shadow-lg ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Black border frame */}
      <div className={`absolute inset-0 ${cardBackground} overflow-hidden`}>
        {/* Type label at top */}
        <div className={`absolute top-0 right-0 ${typeLabelBackground} ${styles.typeLabel} text-white font-bold`}>
          {typeLabel}
        </div>

        {/* Points in top left for animal cards */}
        {card.type === "animal" && (
          <div className="absolute top-0 left-0 bg-black p-1">
            <div className={`${styles.points} flex items-center justify-center bg-black text-white font-bold`}>
              {card.points}
            </div>
          </div>
        )}

        {/* Card art */}
        <div className={`${styles.art} mt-6 mx-auto relative overflow-hidden`}>{getCardArt(card)}</div>

        {/* Card name */}
        <div className={`${styles.name} text-center font-bold text-white uppercase mt-1 px-1`}>{card.name}</div>

        {/* Card effect/description */}
        <div
          className={`${getEffectFontSize()} text-center text-white px-2 mx-1 mt-1 max-h-[${styles.effect.split("max-h-[")[1]}`}
        >
          {card.effect || (card.type === "animal" ? `${card.environment} animal` : "Impact card")}
        </div>

        {/* Order number for Octopus effect */}
        {orderNumber !== undefined && (
          <div className="absolute top-1 right-7 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-black">
            {orderNumber}
          </div>
        )}
      </div>
    </Card>
  )
}
