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
  // Get environment label based on card environment - translated to English
  const getEnvironmentLabel = () => {
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
          points: "text-[10px] font-bold",
          typeLabel: "text-[6px] px-1 py-0.5",
          name: "text-[6px] mb-0.5", // Reduced from text-[7px]
          art: "h-[30px]",
          effect: "text-[5px] mt-0.5 max-h-[15px]",
          border: selected ? "border-2" : "border",
        }
      case "sm":
        return {
          card: "h-[120px] w-[90px]",
          points: "text-[14px] font-bold",
          typeLabel: "text-[8px] px-1.5 py-0.5",
          name: "text-[8px] mb-1", // Reduced from text-[9px]
          art: "h-[50px]",
          effect: "text-[7px] mt-1 max-h-[25px]",
          border: selected ? "border-2" : "border",
        }
      case "md":
        return {
          card: "h-[160px] w-[120px]",
          points: "text-[18px] font-bold",
          typeLabel: "text-[10px] px-2 py-0.5",
          name: "text-[10px] mb-1", // Reduced from text-xs
          art: "h-[70px]",
          effect: "text-[9px] mt-1 max-h-[35px]",
          border: selected ? "border-3" : "border-2",
        }
      case "lg":
        return {
          card: "h-[200px] w-[150px]",
          points: "text-[22px] font-bold",
          typeLabel: "text-xs px-2 py-0.5",
          name: "text-xs mb-1.5", // Reduced from text-sm
          art: "h-[90px]",
          effect: "text-[10px] mt-1.5 max-h-[45px]",
          border: selected ? "border-4" : "border-2",
        }
      case "xl":
        return {
          card: "h-[280px] w-[210px]",
          points: "text-[30px] font-bold",
          typeLabel: "text-sm px-2.5 py-0.5",
          name: "text-sm mb-2", // Reduced from text-base
          art: "h-[130px]",
          effect: "text-xs mt-2 max-h-[60px]",
          border: selected ? "border-4" : "border-2",
        }
      default:
        return {
          card: "h-[160px] w-[120px]",
          points: "text-[18px] font-bold",
          typeLabel: "text-[10px] px-2 py-0.5",
          name: "text-[10px] mb-1", // Reduced from text-xs
          art: "h-[70px]",
          effect: "text-[9px] mt-1 max-h-[35px]",
          border: selected ? "border-3" : "border-2",
        }
    }
  }

  // Get background color based on card type and environment
  const getCardBackground = () => {
    if (card.type === "impact") {
      return "bg-purple-700"
    }

    switch (card.environment) {
      case "aquatic":
        return "bg-blue-600"
      case "terrestrial":
        return "bg-red-600"
      case "amphibian":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  // Get name background color
  const getNameBackground = () => {
    if (card.type === "impact") {
      return "bg-purple-900/90"
    }

    switch (card.environment) {
      case "aquatic":
        return "bg-blue-900/90"
      case "terrestrial":
        return "bg-red-900/90"
      case "amphibian":
        return "bg-green-900/90"
      default:
        return "bg-gray-900/90"
    }
  }

  // Get effect background color
  const getEffectBackground = () => {
    if (card.type === "impact") {
      return "bg-purple-900/90"
    }

    switch (card.environment) {
      case "terrestrial":
        return "bg-red-900/90"
      default:
        return "bg-blue-900/90"
    }
  }

  const styles = getSizeStyles()
  const cardBackground = getCardBackground()
  const nameBackground = getNameBackground()
  const effectBackground = getEffectBackground()
  const environmentLabel = getEnvironmentLabel()

  return (
    <Card
      className={`${styles.card} ${styles.border} border-black ${selected ? "ring-2 ring-yellow-500 scale-105" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
      } transition-all relative overflow-hidden shadow-lg ${className} rounded-xl`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Black border frame */}
      <div className={`absolute inset-0 ${cardBackground} overflow-hidden rounded-lg`}>
        {/* Points in top left */}
        <div className="absolute top-0 left-0 p-1">
          <div className={`${styles.points} text-white`}>{card.points || ""}</div>
        </div>

        {/* Name bar at top */}
        <div className={`absolute top-0 right-0 left-8 ${nameBackground} py-1 px-2 rounded-b-lg`}>
          <div className="text-center font-bold text-white uppercase">{card.name}</div>
        </div>

        {/* Type label */}
        <div className={`absolute top-8 left-0 bg-black ${styles.typeLabel} text-white font-bold rounded-r-lg`}>
          {environmentLabel}
        </div>

        {/* Card art */}
        <div className={`${styles.art} mt-12 mx-auto relative overflow-hidden`}>{getCardArt(card)}</div>

        {/* Card effect/description - bottom area with dynamic color */}
        <div className={`absolute bottom-0 left-0 right-0 ${effectBackground} p-2 rounded-t-lg`}>
          <div className={`${styles.effect} text-center text-white`}>
            {card.effect || (card.type === "animal" ? `${card.environment} animal` : "Impact card")}
          </div>
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
