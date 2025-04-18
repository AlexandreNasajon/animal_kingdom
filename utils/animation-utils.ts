import type { GameCard } from "@/types/game"

// Get card animation based on type and environment
export function getCardAnimation(card: GameCard): string {
  if (card.type === "animal") {
    switch (card.environment) {
      case "terrestrial":
        return "animate-terrestrial"
      case "aquatic":
        return "animate-aquatic"
      case "amphibian":
        return "animate-amphibian"
      default:
        return "animate-breathe"
    }
  } else {
    // Impact cards
    return "animate-pulse-slow"
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

// Create a card trail effect during drag operations
export function createCardTrail(event: MouseEvent | TouchEvent, card: GameCard): void {
  // Only create trails occasionally to avoid performance issues
  if (Math.random() > 0.3) return

  // Get position
  let clientX: number, clientY: number

  if ("touches" in event) {
    // Touch event
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  } else {
    // Mouse event
    clientX = event.clientX
    clientY = event.clientY
  }

  // Create trail element
  const trail = document.createElement("div")
  trail.className = "card-trail"

  // Set position
  trail.style.left = `${clientX - 20}px`
  trail.style.top = `${clientY - 30}px`
  trail.style.width = "40px"
  trail.style.height = "60px"

  // Set color based on card type
  if (card.type === "animal") {
    switch (card.environment) {
      case "terrestrial":
        trail.style.backgroundColor = "rgba(220, 38, 38, 0.3)"
        break
      case "aquatic":
        trail.style.backgroundColor = "rgba(37, 99, 235, 0.3)"
        break
      case "amphibian":
        trail.style.backgroundColor = "rgba(22, 163, 74, 0.3)"
        break
      default:
        trail.style.backgroundColor = "rgba(100, 100, 100, 0.3)"
    }
  } else {
    // Impact card
    trail.style.backgroundColor = "rgba(147, 51, 234, 0.3)"
  }

  // Add to document
  document.body.appendChild(trail)

  // Remove after animation completes
  setTimeout(() => {
    if (document.body.contains(trail)) {
      document.body.removeChild(trail)
    }
  }, 500)
}

// Create animation for card moving to discard pile
export function createCardToDiscardAnimation(
  card: GameCard,
  sourceElement: HTMLElement,
  discardPileElement: HTMLElement,
): void {
  // Get positions
  const sourceRect = sourceElement.getBoundingClientRect()
  const targetRect = discardPileElement.getBoundingClientRect()

  // Create clone of the card for animation
  const clone = document.createElement("div")
  clone.className = "fixed pointer-events-none z-50 transition-all duration-700"
  clone.style.width = `${sourceRect.width}px`
  clone.style.height = `${sourceRect.height}px`
  clone.style.left = `${sourceRect.left}px`
  clone.style.top = `${sourceRect.top}px`

  // Create card content
  const cardContent = document.createElement("div")
  cardContent.className = `h-full w-full rounded-md shadow-lg border-2 ${
    card.type === "animal"
      ? card.environment === "terrestrial"
        ? "border-red-600 bg-red-900"
        : card.environment === "aquatic"
          ? "border-blue-600 bg-blue-900"
          : "border-green-600 bg-green-900"
      : "border-purple-600 bg-purple-900"
  }`

  // Add card name
  const nameDiv = document.createElement("div")
  nameDiv.className = "text-center text-white text-xs font-bold mt-1"
  nameDiv.textContent = card.name
  cardContent.appendChild(nameDiv)

  clone.appendChild(cardContent)
  document.body.appendChild(clone)

  // Start animation after a small delay
  setTimeout(() => {
    clone.style.transform = "rotate(10deg) scale(0.7)"
    clone.style.opacity = "0.7"
    clone.style.left = `${targetRect.left + targetRect.width / 2 - sourceRect.width / 2}px`
    clone.style.top = `${targetRect.top + targetRect.height / 2 - sourceRect.height / 2}px`

    // Add highlight to discard pile
    discardPileElement.classList.add("discard-highlight")

    // Remove clone after animation completes
    setTimeout(() => {
      if (document.body.contains(clone)) {
        document.body.removeChild(clone)
      }

      // Remove highlight from discard pile
      discardPileElement.classList.remove("discard-highlight")
    }, 700)
  }, 50)
}

// Add this new function after the createCardToDiscardAnimation function

// Create animation for card moving to deck
export function createCardToDeckAnimation(card: GameCard, sourceElement: HTMLElement, deckElement: HTMLElement): void {
  // Get positions
  const sourceRect = sourceElement.getBoundingClientRect()
  const targetRect = deckElement.getBoundingClientRect()

  // Create clone of the card for animation
  const clone = document.createElement("div")
  clone.className = "fixed pointer-events-none z-50 transition-all duration-700"
  clone.style.width = `${sourceRect.width}px`
  clone.style.height = `${sourceRect.height}px`
  clone.style.left = `${sourceRect.left}px`
  clone.style.top = `${sourceRect.top}px`

  // Create card content
  const cardContent = document.createElement("div")
  cardContent.className = `h-full w-full rounded-md shadow-lg border-2 ${
    card.type === "animal"
      ? card.environment === "terrestrial"
        ? "border-red-600 bg-red-900"
        : card.environment === "aquatic"
          ? "border-blue-600 bg-blue-900"
          : "border-green-600 bg-green-900"
      : "border-purple-600 bg-purple-900"
  }`

  // Add card name
  const nameDiv = document.createElement("div")
  nameDiv.className = "text-center text-white text-xs font-bold mt-1"
  nameDiv.textContent = card.name
  cardContent.appendChild(nameDiv)

  clone.appendChild(cardContent)
  document.body.appendChild(clone)

  // Add environment-specific particle effect
  if (card.type === "animal") {
    let particleColor = "#ff6666" // Default red for terrestrial
    if (card.environment === "aquatic") particleColor = "#6666ff"
    else if (card.environment === "amphibian") particleColor = "#66ff66"

    // Create particles along the path
    setTimeout(() => {
      createPathParticles(sourceRect, targetRect, particleColor)
    }, 100)
  } else {
    // Impact card particles
    setTimeout(() => {
      createPathParticles(sourceRect, targetRect, "#aa66ff")
    }, 100)
  }

  // Start animation after a small delay
  setTimeout(() => {
    clone.style.transform = "translateY(-50px) scale(0.7)"
    clone.style.opacity = "0.7"
    clone.style.left = `${targetRect.left + targetRect.width / 2 - sourceRect.width / 2}px`
    clone.style.top = `${targetRect.top + targetRect.height / 2 - sourceRect.height / 2}px`

    // Add highlight to deck
    deckElement.classList.add("animate-deck-highlight")

    // Remove clone after animation completes
    setTimeout(() => {
      if (document.body.contains(clone)) {
        document.body.removeChild(clone)
      }

      // Remove highlight from deck
      deckElement.classList.remove("animate-deck-highlight")
    }, 700)
  }, 50)
}

// Helper function to create particles along a path
function createPathParticles(sourceRect: DOMRect, targetRect: DOMRect, color: string, count = 12): void {
  const startX = sourceRect.left + sourceRect.width / 2
  const startY = sourceRect.top + sourceRect.height / 2
  const endX = targetRect.left + targetRect.width / 2
  const endY = targetRect.top + targetRect.height / 2

  for (let i = 0; i < count; i++) {
    // Create particle at a point along the path
    const particle = document.createElement("div")
    particle.className = "particle"

    // Position along the path based on index
    const ratio = i / (count - 1)
    const x = startX + (endX - startX) * ratio
    const y = startY + (endY - startY) * ratio + Math.sin(ratio * Math.PI) * -20 // Arc upward

    particle.style.backgroundColor = color
    particle.style.left = `${x}px`
    particle.style.top = `${y}px`
    particle.style.opacity = "0"

    // Add to document
    document.body.appendChild(particle)

    // Animate with varying delays
    setTimeout(() => {
      particle.style.opacity = "0.8"
      // Add a small random offset for more natural movement
      const offset = (Math.random() - 0.5) * 10
      particle.style.setProperty("--x-offset", `${offset}px`)

      // Fade out and remove
      setTimeout(() => {
        particle.style.opacity = "0"
        setTimeout(() => {
          if (document.body.contains(particle)) {
            document.body.removeChild(particle)
          }
        }, 300)
      }, 400)
    }, i * 50)
  }
}
