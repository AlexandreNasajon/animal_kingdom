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

  // Make sure the size styles are properly defined for all card sizes
  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return {
          card: "h-[80px] w-[60px]",
          points: "text-[10px] font-bold",
          typeLabel: "text-[6px] px-1 py-0.5",
          name: "text-[7px] mb-0 leading-tight",
          art: "h-[30px] w-full flex items-center justify-center",
          effect: "text-[5px] mt-0.5 max-h-[15px]",
          border: selected ? "border-2" : "border",
        }
      case "sm":
        return {
          card: "h-[120px] w-[90px]",
          points: "text-[14px] font-bold",
          typeLabel: "text-[8px] px-1.5 py-0.5",
          name: "text-[9px] mb-0 leading-tight",
          art: "h-[40px] w-full flex items-center justify-center mt-1",
          effect: "text-[7px] mt-1 max-h-[25px]",
          border: selected ? "border-2" : "border",
        }
      case "md":
        return {
          card: "h-[160px] w-[120px]",
          points: "text-[18px] font-bold",
          typeLabel: "text-[10px] px-2 py-0.5",
          name: "text-[10px] mb-1",
          art: "h-[70px] w-full flex items-center justify-center mt-2",
          effect: "text-[9px] mt-1 max-h-[35px]",
          border: selected ? "border-3" : "border-2",
        }
      case "lg":
        return {
          card: "h-[200px] w-[150px]",
          points: "text-[22px] font-bold",
          typeLabel: "text-xs px-2 py-0.5",
          name: "text-xs mb-1.5",
          art: "h-[90px] w-full flex items-center justify-center mt-3",
          effect: "text-[10px] mt-1.5 max-h-[45px]",
          border: selected ? "border-4" : "border-2",
        }
      case "xl":
        return {
          card: "h-[280px] w-[210px]",
          points: "text-[30px] font-bold",
          typeLabel: "text-sm px-2.5 py-0.5",
          name: "text-sm mb-2",
          art: "h-[130px] w-full flex items-center justify-center mt-4",
          effect: "text-xs mt-2 max-h-[60px]",
          border: selected ? "border-4" : "border-2",
        }
      default:
        return {
          card: "h-[160px] w-[120px]",
          points: "text-[18px] font-bold",
          typeLabel: "text-[10px] px-2 py-0.5",
          name: "text-[10px] mb-1",
          art: "h-[70px] w-full flex items-center justify-center mt-2",
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
      case "aquatic":
        return "bg-blue-900/90"
      case "amphibian":
        return "bg-green-900/90"
      default:
        return "bg-blue-900/90"
    }
  }

  const styles = getSizeStyles()
  const cardBackground = getCardBackground()
  const nameBackground = getNameBackground()
  const effectBackground = getEffectBackground()
  const environmentLabel = getEnvironmentLabel()

  // Define left position offset for the name bar based on card size
  const getNameBarOffset = () => {
    switch (size) {
      case "xs":
        return "left-2" // Smaller offset for xs size
      case "sm":
        return "left-3" // Smaller offset for sm size
      default:
        return "left-8" // Original offset for larger sizes
    }
  }

  const nameBarOffset = getNameBarOffset()

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
        <div className="absolute top-0 left-0 p-1 z-10">
          <div className={`${styles.points} text-white`}>{card.points || ""}</div>
        </div>

        {/* Name bar at top - Extended with height to allow for better text display */}
        <div className={`absolute top-0 right-0 ${nameBarOffset} ${nameBackground} py-1 px-1 rounded-b-lg z-0`}>
          <div
            className={`text-center font-bold text-white uppercase truncate text-ellipsis overflow-hidden ${styles.name}`}
          >
            {card.name}
          </div>
        </div>

        {/* Type label */}
        <div className={`absolute top-8 left-0 bg-black ${styles.typeLabel} text-white font-bold rounded-r-lg z-10`}>
          {environmentLabel}
        </div>

        {/* Card art - Using the styles.art class which now includes margin-top */}
        <div className={`${styles.art} mx-auto relative overflow-visible flex items-center justify-center`}>
          {getCardArt(card)}
        </div>

        {/* Card effect/description - bottom area with dynamic color */}
        <div className={`absolute bottom-0 left-0 right-0 ${effectBackground} p-1 rounded-t-lg`}>
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
