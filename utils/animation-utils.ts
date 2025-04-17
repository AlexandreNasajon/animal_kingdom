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

// New function to create a card trail effect from field to discard pile
export const createCardToDiscardAnimation = (
  card: GameCard,
  startElement: HTMLElement,
  discardPileElement: HTMLElement,
): void => {
  // Get the positions of the start element and discard pile
  const startRect = startElement.getBoundingClientRect()
  const discardRect = discardPileElement.getBoundingClientRect()

  // Create a clone of the card to animate
  const cardClone = document.createElement("div")

  // Set initial position and style
  cardClone.className = "card-trail"
  cardClone.style.width = `${startRect.width}px`
  cardClone.style.height = `${startRect.height}px`
  cardClone.style.left = `${startRect.left}px`
  cardClone.style.top = `${startRect.top}px`
  cardClone.style.position = "fixed"
  cardClone.style.zIndex = "1000"
  cardClone.style.pointerEvents = "none"

  // Set background color based on card type/environment
  if (card.type === "animal") {
    switch (card.environment) {
      case "terrestrial":
        cardClone.style.backgroundColor = "rgba(255, 100, 100, 0.7)"
        cardClone.style.borderColor = "rgba(255, 50, 50, 0.8)"
        break
      case "aquatic":
        cardClone.style.backgroundColor = "rgba(100, 100, 255, 0.7)"
        cardClone.style.borderColor = "rgba(50, 50, 255, 0.8)"
        break
      case "amphibian":
        cardClone.style.backgroundColor = "rgba(100, 255, 100, 0.7)"
        cardClone.style.borderColor = "rgba(50, 255, 50, 0.8)"
        break
      default:
        cardClone.style.backgroundColor = "rgba(200, 200, 200, 0.7)"
        cardClone.style.borderColor = "rgba(150, 150, 150, 0.8)"
    }
  } else {
    cardClone.style.backgroundColor = "rgba(147, 51, 234, 0.7)"
    cardClone.style.borderColor = "rgba(147, 51, 234, 0.8)"
  }

  cardClone.style.borderWidth = "2px"
  cardClone.style.borderStyle = "solid"
  cardClone.style.borderRadius = "8px"
  cardClone.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)"

  // Add card content (simplified version)
  cardClone.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; font-size: 10px; text-align: center; padding: 5px;">
      <div style="font-weight: bold; margin-bottom: 5px;">${card.name}</div>
    </div>
  `

  // Add to DOM
  document.body.appendChild(cardClone)

  // Force a reflow to ensure the initial position is applied
  void cardClone.offsetWidth

  // Animate to discard pile position
  cardClone.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
  cardClone.style.left = `${discardRect.left + discardRect.width / 2 - startRect.width / 2}px`
  cardClone.style.top = `${discardRect.top + discardRect.height / 2 - startRect.height / 2}px`
  cardClone.style.transform = "scale(0.7) rotate(-15deg)"
  cardClone.style.opacity = "0"

  // Create particles at the start position
  createParticles(
    startElement,
    10,
    card.type === "impact"
      ? "rgba(147, 51, 234, 0.8)"
      : card.environment === "terrestrial"
        ? "rgba(255, 100, 100, 0.8)"
        : card.environment === "aquatic"
          ? "rgba(100, 100, 255, 0.8)"
          : "rgba(100, 255, 100, 0.8)",
  )

  // Remove after animation completes
  setTimeout(() => {
    document.body.removeChild(cardClone)

    // Create particles at the discard pile
    createParticles(discardPileElement, 5, "rgba(0, 200, 0, 0.5)")

    // Highlight the discard pile
    discardPileElement.classList.add("animate-discard-highlight")
    setTimeout(() => {
      discardPileElement.classList.remove("animate-discard-highlight")
    }, 500)
  }, 800)
}
