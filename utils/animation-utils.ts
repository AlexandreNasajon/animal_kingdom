import type { GameCard } from "@/types/game"

// Helper function to get card animation class based on card type and environment
export function getCardAnimation(card: GameCard): string {
  if (!card.type) return ""

  if (card.type === "animal") {
    switch (card.environment) {
      case "terrestrial":
        return "animate-play-terrestrial"
      case "aquatic":
        return "animate-play-aquatic"
      case "amphibian":
        return "animate-play-amphibian"
      default:
        return "animate-play-card"
    }
  } else {
    // Impact cards
    return "animate-play-impact"
  }
}

// Helper function to get zone transfer animation
export function getZoneTransferAnimation(fromZone: string, toZone: string): string {
  const animationMap: Record<string, Record<string, string>> = {
    hand: {
      field: "animate-hand-to-field",
      discard: "animate-hand-to-discard",
      deck: "animate-hand-to-deck",
    },
    field: {
      hand: "animate-field-to-hand",
      discard: "animate-field-to-discard",
      deck: "animate-field-to-deck",
    },
    discard: {
      hand: "animate-discard-to-hand",
      field: "animate-discard-to-field",
      deck: "animate-discard-to-deck",
    },
    deck: {
      hand: "animate-deck-to-hand",
      field: "animate-deck-to-field",
      discard: "animate-deck-to-discard",
    },
  }

  return animationMap[fromZone]?.[toZone] || "animate-zone-transfer"
}

// Helper function to get environment-specific animation
export function getEnvironmentAnimation(environment?: string, id?: number): string {
  // Base animations that cycle based on card ID
  const baseAnimations = ["animate-breathe", "animate-wiggle", "animate-bounce-slow", "animate-sway"]
  const baseAnimation = baseAnimations[(id || 0) % 4]

  // Environment-specific animations
  switch (environment) {
    case "terrestrial":
      return `${baseAnimation} animate-terrestrial`
    case "aquatic":
      return `${baseAnimation} animate-aquatic`
    case "amphibian":
      // Amphibians get a combined animation that includes both terrestrial and aquatic properties
      return `${baseAnimation} animate-amphibian`
    default:
      return baseAnimation
  }
}

// Helper function to get impact card animation
export function getImpactAnimation(id?: number): string {
  const animations = ["animate-pulse-slow", "animate-glow", "animate-rotate-slow"]
  return animations[(id || 0) % 3]
}

// Helper function for exchange animations
export function getExchangeAnimation(isSource: boolean): string {
  return isSource ? "animate-exchange-out" : "animate-exchange-in"
}

// Helper function for targeting animations
export function getTargetingAnimation(): string {
  return "animate-being-targeted"
}

// Helper function to get victory animation
export function getVictoryAnimation(): string {
  return "animate-victory"
}
