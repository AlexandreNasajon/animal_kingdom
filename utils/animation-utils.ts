import type { GameCard } from "@/types/game"

// Helper function to get the appropriate animation class for a card
export const getCardAnimation = (card: GameCard): string => {
  // If it's an impact card, use the impact animation
  if (card.type === "impact") {
    return "animate-impact-play"
  }

  // For animal cards, use environment-specific animations
  switch (card.environment) {
    case "terrestrial":
      return "animate-play-terrestrial"
    case "aquatic":
      return "animate-play-aquatic"
    case "amphibian":
      return "animate-play-amphibian"
    default:
      return "animate-hand-to-field"
  }
}

// Helper function to create particle effects
export const createParticles = (element: HTMLElement, count = 20, color = "rgba(255, 255, 255, 0.8)"): void => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.backgroundColor = color
    particle.style.left = `${centerX}px`
    particle.style.top = `${centerY}px`
    particle.style.setProperty("--x-offset", `${(Math.random() - 0.5) * 30}px`)

    document.body.appendChild(particle)

    // Remove particle after animation completes
    setTimeout(() => {
      document.body.removeChild(particle)
    }, 1000)
  }
}

// Helper function to create environment-specific particles
export const createEnvironmentParticles = (card: GameCard): void => {
  if (!card || !card.type) return

  const cardElements = document.querySelectorAll(`[data-card-id="${card.id}"]`)
  if (!cardElements.length) return

  const element = cardElements[0] as HTMLElement

  if (card.type === "animal") {
    switch (card.environment) {
      case "terrestrial":
        createParticles(element, 15, "rgba(255, 100, 100, 0.8)")
        break
      case "aquatic":
        createParticles(element, 15, "rgba(100, 100, 255, 0.8)")
        break
      case "amphibian":
        createParticles(element, 15, "rgba(100, 255, 100, 0.8)")
        break
      default:
        createParticles(element, 15)
    }
  } else if (card.type === "impact") {
    createParticles(element, 25, "rgba(147, 51, 234, 0.8)")
  }
}
