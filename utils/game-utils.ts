import type { GameCard, GameState } from "@/types/game"
import { ORIGINAL_DECK } from "@/types/original-deck"
import { applyAnimalEffect, resolveAnimalEffect } from "./game-effects"

// Get all animal cards from the deck
export function getAnimalCards(): GameCard[] {
  return ORIGINAL_DECK.filter((card) => card.type === "animal")
}

// Get all impact cards from the deck
export function getImpactCards(): GameCard[] {
  return ORIGINAL_DECK.filter((card) => card.type === "impact")
}

// Shuffle an array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Get all cards for the deck
export function getAllCards(): GameCard[] {
  return ORIGINAL_DECK
}

// Get the appropriate deck based on the deck ID
export function getDeckById(deckId = 1): GameCard[] {
  return ORIGINAL_DECK
}

// Function to shuffle the deck
export function shuffleDeck(deck: GameCard[]): GameCard[] {
  const newDeck = [...deck]
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
  }
  return newDeck
}

// Initialize a new game with the original deck
export function initializeGame(deckId = 1): GameState {
  const deck = ORIGINAL_DECK
  const shuffledDeck = shuffleArray(deck)

  // First player draws 5 cards
  const playerHand = shuffledDeck.slice(0, 5)

  // Second player (AI) draws 6 cards
  const opponentHand = shuffledDeck.slice(5, 11)

  // Remaining cards form the deck
  const sharedDeck = shuffledDeck.slice(11)

  return {
    playerPoints: 0,
    opponentPoints: 0,
    playerHand,
    opponentHand,
    playerField: [],
    opponentField: [],
    sharedDeck,
    sharedDiscard: [],
    currentTurn: "player", // Player goes first
    gameStatus: "playing",
    message: "Your turn. Draw cards or play a card.",
    pendingEffect: null,
    effectsThisTurn: {
      playerAnimalsPlayed: 0,
      opponentAnimalsPlayed: 0,
      playerCardsDrawn: 0,
      opponentCardsDrawn: 0,
      playerExtraDraws: 0,
      opponentExtraPlays: 0,
      limitInEffect: false,
      droughtInEffect: false,
    },
    persistentEffects: {
      limitUntilTurn: undefined,
      cageTargets: [],
      protectedAnimals: [],
      disabledAnimals: [],
    },
  }
}

// Fix the drawCards function to ensure it works correctly
export function drawCards(state: GameState, count: number, forPlayer: boolean): GameState {
  if (state.sharedDeck.length === 0) {
    // No cards in deck
    return {
      ...state,
      message: "No cards left in the deck!",
    }
  }

  const handSize = forPlayer ? state.playerHand.length : state.opponentHand.length

  // Calculate how many cards can be drawn without exceeding the 6-card limit
  const maxDraw = Math.min(6 - handSize, count, state.sharedDeck.length)

  if (maxDraw <= 0) {
    return {
      ...state,
      message: `${forPlayer ? "Your" : "AI's"} hand is full (maximum 6 cards).`,
    }
  }

  const newDeck = [...state.sharedDeck]
  const drawnCards = newDeck.splice(0, maxDraw)

  if (forPlayer) {
    return {
      ...state,
      playerHand: [...state.playerHand, ...drawnCards],
      sharedDeck: newDeck,
      effectsThisTurn: {
        ...state.effectsThisTurn,
        playerCardsDrawn: state.effectsThisTurn.playerCardsDrawn + maxDraw,
      },
      message: `You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.${
        maxDraw < count ? " The deck didn't have enough cards." : ""
      }`,
    }
  } else {
    return {
      ...state,
      opponentHand: [...state.opponentHand, ...drawnCards],
      sharedDeck: newDeck,
      effectsThisTurn: {
        ...state.effectsThisTurn,
        opponentCardsDrawn: state.effectsThisTurn.opponentCardsDrawn + maxDraw,
      },
      message: `AI drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.${
        maxDraw < count ? " The deck didn't have enough cards." : ""
      }`,
    }
  }
}

// Send cards from hand to bottom of deck
export function sendCardsToBottom(state: GameState, cardIndices: number[], forPlayer: boolean): GameState {
  const hand = forPlayer ? [...state.playerHand] : [...state.opponentHand]
  const cardsToSend: GameCard[] = []

  // Sort indices in descending order to avoid shifting issues when removing
  const sortedIndices = [...cardIndices].sort((a, b) => b - a)

  // Remove cards from hand
  for (const index of sortedIndices) {
    if (index >= 0 && index < hand.length) {
      const [card] = hand.splice(index, 1)
      if (card) cardsToSend.push(card)
    }
  }

  // Add cards to bottom of deck
  const newDeck = [...state.sharedDeck, ...cardsToSend]

  if (forPlayer) {
    return {
      ...state,
      playerHand: hand,
      sharedDeck: newDeck,
      message: `You sent ${cardsToSend.length} card${cardsToSend.length > 1 ? "s" : ""} to the bottom of the deck.`,
    }
  } else {
    return {
      ...state,
      opponentHand: hand,
      sharedDeck: newDeck,
      message: `AI sent ${cardsToSend.length} card${cardsToSend.length > 1 ? "s" : ""} to the bottom of the deck.`,
    }
  }
}

// Fix the playAnimalCard function to ensure it works correctly
export function playAnimalCard(state: GameState, cardIndex: number, isPlayer: boolean): GameState {
  if (cardIndex < 0 || cardIndex >= (isPlayer ? state.playerHand.length : state.opponentHand.length)) {
    return {
      ...state,
      message: "Invalid card index.",
    }
  }

  const card = isPlayer ? state.playerHand[cardIndex] : state.opponentHand[cardIndex]
  if (!card || card.type !== "animal") {
    return {
      ...state,
      message: "Selected card is not an animal card.",
    }
  }

  // Create a copy of the hand without the played card
  const newHand = isPlayer
    ? [...state.playerHand.slice(0, cardIndex), ...state.playerHand.slice(cardIndex + 1)]
    : [...state.opponentHand.slice(0, cardIndex), ...state.opponentHand.slice(cardIndex + 1)]

  // Add the card to the field
  const newField = isPlayer ? [...state.playerField, card] : [...state.opponentField, card]

  // Update points
  const newPoints = isPlayer ? state.playerPoints + (card.points || 0) : state.opponentPoints + (card.points || 0)

  // Create a new state with the updated hand, field, and points
  const newState = {
    ...state,
    playerHand: isPlayer ? newHand : state.playerHand,
    opponentHand: isPlayer ? state.opponentHand : newHand,
    playerField: isPlayer ? newField : state.playerField,
    opponentField: isPlayer ? state.opponentField : newField,
    playerPoints: isPlayer ? newPoints : state.playerPoints,
    opponentPoints: isPlayer ? state.opponentPoints : newPoints,
    effectsThisTurn: {
      ...state.effectsThisTurn,
      playerAnimalsPlayed: isPlayer
        ? state.effectsThisTurn.playerAnimalsPlayed + 1
        : state.effectsThisTurn.playerAnimalsPlayed,
      opponentAnimalsPlayed: isPlayer
        ? state.effectsThisTurn.opponentAnimalsPlayed
        : state.effectsThisTurn.opponentAnimalsPlayed + 1,
    },
    message: `${isPlayer ? "You" : "AI"} played ${card.name} (${card.points} points).`,
  }

  // Apply the card's effect if it has one
  if (card.effect) {
    console.log(`Applying effect for ${card.name}: ${JSON.stringify(card.effect)}, isPlayer: ${isPlayer}`)
    const stateWithEffect = applyAnimalEffect(newState, card, isPlayer)
    console.log(`After applying effect, pendingEffect:`, stateWithEffect.pendingEffect)
    return stateWithEffect
  }

  return newState
}

// Check if an impact card has valid targets
export function isImpactCardWithValidTargets(card: GameCard, state: GameState, forPlayer = true): boolean {
  if (card.type !== "impact") return false

  switch (card.name) {
    case "Hunter":
      // Check if there are terrestrial animals to target (including amphibians)
      return forPlayer
        ? state.opponentField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")
        : state.playerField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")

    case "Fisher":
      // Check if there are aquatic animals to target (including amphibians)
      return forPlayer
        ? state.opponentField.some((c) => c.environment === "aquatic" || c.environment === "amphibian")
        : state.playerField.some((c) => c.environment === "aquatic" || c.environment === "amphibian")

    case "Veterinarian":
      // Check if there are animal cards in the discard pile
      return state.sharedDiscard.some((c) => c.type === "animal")

    case "Limit":
      // Check if opponent has 7 or more points
      return forPlayer
        ? state.opponentPoints >= 7 && state.opponentField.length > 0
        : state.playerPoints >= 7 && state.playerField.length > 0

    case "Confuse":
      // Check if there are at least 2 animals on the field
      return state.opponentField.length > 0 && state.playerField.length > 0

    case "Domesticate":
      // Check if there are animals worth 2 points on opponent's field
      return forPlayer ? state.opponentField.some((c) => c.points === 2) : state.playerField.some((c) => c.points === 2)

    case "Trap":
      // Check if opponent has animals on their field
      return forPlayer ? state.opponentField.length > 0 : state.playerField.length > 0

    case "Epidemic":
      // Check if player has animals on their field
      return forPlayer ? state.playerField.length > 0 : state.opponentField.length > 0

    case "Compete":
      // Check if player has animal cards in hand
      return forPlayer
        ? state.playerHand.some((c) => c.type === "animal")
        : state.opponentHand.some((c) => c.type === "animal")

    case "Prey":
      // Check if player has animals on their field
      // AND there are animals of the same environment with fewer points on either field
      if (forPlayer) {
        if (state.playerField.length === 0) return false

        // Check if there's at least one animal that would be a good target
        return state.playerField.some((playerAnimal) => {
          const environment = playerAnimal.environment
          const points = playerAnimal.points || 0

          // Check if there are any animals with the same environment and fewer points
          return (
            state.playerField.some(
              (c) => c.id !== playerAnimal.id && c.environment === environment && (c.points || 0) < points,
            ) || state.opponentField.some((c) => c.environment === environment && (c.points || 0) < points)
          )
        })
      } else {
        if (state.opponentField.length === 0) return false

        // Check if there's at least one animal that would be a good target
        return state.opponentField.some((opponentAnimal) => {
          const environment = opponentAnimal.environment
          const points = opponentAnimal.points || 0

          // Check if there are any animals with the same environment and fewer points
          return (
            state.opponentField.some(
              (c) => c.id !== opponentAnimal.id && c.environment === environment && (c.points || 0) < points,
            ) || state.playerField.some((c) => c.environment === environment && (c.points || 0) < points)
          )
        })
      }

    case "Cage":
      // Check if player has animals on their field and opponent has animals
      return forPlayer
        ? state.playerField.length > 0 && state.opponentField.length > 0
        : state.opponentField.length > 0 && state.playerField.length > 0

    case "Flourish":
      // Check if player has 2 or fewer cards in hand
      return forPlayer ? state.playerHand.length <= 2 : state.opponentHand.length <= 2

    case "Earthquake":
      // Always valid as it affects all animals worth 3+ points
      return true

    case "Flood":
      // Check if there are animals on the field
      return state.playerField.length > 0 || state.opponentField.length > 0

    case "Storm":
      // Always valid as it affects all animals worth 2 or fewer points
      return true

    case "Scare":
      // Check if there are any animals on the field
      return state.playerField.length > 0 || state.opponentField.length > 0

    default:
      return true
  }
}

// Play an impact card
export function playImpactCard(state: GameState, cardIndex: number, forPlayer: boolean): GameState {
  const hand = forPlayer ? state.playerHand : state.opponentHand
  const card = hand[cardIndex]

  if (!card || card.type !== "impact") {
    return state
  }

  // Check if the card has valid targets before playing it
  if (!isImpactCardWithValidTargets(card, state, forPlayer)) {
    return {
      ...state,
      message: `${forPlayer ? "You" : "AI"} cannot play ${card.name} as there are no valid targets.`,
    }
  }

  const newHand = [...hand]
  newHand.splice(cardIndex, 1)

  // Add the card to the discard pile
  const newDiscard = [...state.sharedDiscard, card]

  // Create base state with the card played
  const newState = {
    ...state,
    sharedDiscard: newDiscard,
    message: `${forPlayer ? "You" : "AI"} played ${card.name}: ${card.effect}`,
  }

  if (forPlayer) {
    newState.playerHand = newHand
  } else {
    newState.opponentHand = newHand
  }

  // For cards that need target selection, set pendingEffect
  if (forPlayer) {
    switch (card.name) {
      case "Hunter":
        // Check if there are terrestrial animals to target (including amphibians)
        if (state.opponentField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")) {
          return {
            ...newState,
            pendingEffect: {
              type: "hunter",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Hunter, but there are no terrestrial animals to target.",
          }
        }

      case "Fisher":
        // Check if there are aquatic animals to target (including amphibians)
        if (state.opponentField.some((c) => c.environment === "aquatic" || c.environment === "amphibian")) {
          return {
            ...newState,
            pendingEffect: {
              type: "fisher",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Fisher, but there are no aquatic animals to target.",
          }
        }

      case "Veterinarian":
        // Check if there are animal cards in the discard pile
        if (state.sharedDiscard.some((c) => c.type === "animal")) {
          return {
            ...newState,
            pendingEffect: {
              type: "veterinarian",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Veterinarian, but there are no animal cards in the discard pile.",
          }
        }

      case "Limit":
        // Check if opponent has 7 or more points
        if (state.opponentPoints >= 7 && state.opponentField.length > 0) {
          return {
            ...newState,
            pendingEffect: {
              type: "limit",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Limit, but it can only be used when the opponent has 7 or more points.",
          }
        }

      case "Confuse":
        // Check if there are at least 2 animals on the field
        if (state.opponentField.length > 0 && state.playerField.length > 0) {
          return {
            ...newState,
            pendingEffect: {
              type: "confuse",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Confuse, but there aren't enough animals on the field.",
          }
        }

      case "Domesticate":
        // Check if there are animals worth 2 points on opponent's field
        if (state.opponentField.some((c) => c.points === 2)) {
          return {
            ...newState,
            pendingEffect: {
              type: "domesticate",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Domesticate, but there are no 2-point animals to target.",
          }
        }

      case "Trap":
        // Check if opponent has animals on their field
        if (state.opponentField.length > 0) {
          // For trap, the opponent chooses which animal to give
          return {
            ...newState,
            pendingEffect: {
              type: "trap",
              forPlayer: true,
            },
            message: `You played Trap. Your opponent will choose which animal to give you.`,
          }
        } else {
          return {
            ...newState,
            message: "You played Trap, but the opponent has no animals on their field.",
          }
        }

      // Add other impact card cases as needed

      default:
        return newState
    }
  }

  return newState
}

// Fix the resolveEffect function to properly handle targetIndex parameter
export function resolveEffect(state: GameState, targetIndex?: number | number[]): GameState {
  if (!state.pendingEffect) return state

  const { type, forPlayer } = state.pendingEffect

  console.log(`Resolving effect: ${type}, forPlayer: ${forPlayer}, targetIndex:`, targetIndex)

  // If the effect is in game-effects.ts, use that implementation
  if (
    type === "mouse" ||
    type === "squirrel" ||
    type === "tuna" ||
    type === "turtle" ||
    type === "crab" ||
    type === "crocodile" ||
    type === "lion" ||
    type === "prey" ||
    type === "zebra" ||
    type === "octopus"
  ) {
    return resolveAnimalEffect(state, targetIndex as number)
  }

  // Handle different effect types
  switch (type) {
    case "hunter":
      // Implementation for hunter effect
      if (typeof targetIndex === "number") {
        const targetField = forPlayer ? state.opponentField : state.playerField
        if (targetIndex >= 0 && targetIndex < targetField.length) {
          const targetCard = targetField[targetIndex]
          const newField = [...targetField]
          newField.splice(targetIndex, 1)

          return {
            ...state,
            playerField: forPlayer ? state.playerField : newField,
            opponentField: forPlayer ? newField : state.opponentField,
            playerPoints: forPlayer ? state.playerPoints : state.playerPoints - (targetCard.points || 0),
            opponentPoints: forPlayer ? state.opponentPoints - (targetCard.points || 0) : state.opponentPoints,
            sharedDiscard: [...state.sharedDiscard, targetCard],
            pendingEffect: null,
            message: `${forPlayer ? "You" : "AI"} destroyed ${targetCard.name} with Hunter.`,
          }
        }
      }
      break

    case "fisher":
      if (typeof targetIndex === "number") {
        const targetField = forPlayer ? state.opponentField : state.playerField
        if (targetIndex >= 0 && targetIndex < targetField.length) {
          const targetCard = targetField[targetIndex]
          if (targetCard.environment !== "aquatic" && targetCard.environment !== "amphibian") {
            return {
              ...state,
              pendingEffect: null,
              message: `${forPlayer ? "You" : "AI"} tried to use Fisher on a non-aquatic animal.`,
            }
          }

          const newField = [...targetField]
          newField.splice(targetIndex, 1)

          return {
            ...state,
            playerField: forPlayer ? state.playerField : newField,
            opponentField: forPlayer ? newField : state.opponentField,
            playerPoints: forPlayer ? state.playerPoints : state.playerPoints - (targetCard.points || 0),
            opponentPoints: forPlayer ? state.opponentPoints - (targetCard.points || 0) : state.opponentPoints,
            sharedDiscard: [...state.sharedDiscard, targetCard],
            pendingEffect: null,
            message: `${forPlayer ? "You" : "AI"} destroyed ${targetCard.name} with Fisher.`,
          }
        }
      }
      break

    case "scare":
      if (typeof targetIndex === "number") {
        // Determine if the target is in player's field or opponent's field
        const isPlayerField = targetIndex < state.playerField.length
        const actualIndex = isPlayerField ? targetIndex : targetIndex - state.playerField.length

        const targetField = isPlayerField ? state.playerField : state.opponentField
        if (actualIndex >= 0 && actualIndex < targetField.length) {
          const targetCard = targetField[actualIndex]
          const newField = [...targetField]
          newField.splice(actualIndex, 1)

          return {
            ...state,
            playerField: isPlayerField ? newField : state.playerField,
            opponentField: isPlayerField ? state.opponentField : newField,
            playerPoints: isPlayerField ? state.playerPoints - (targetCard.points || 0) : state.playerPoints,
            opponentPoints: isPlayerField ? state.opponentPoints : state.opponentPoints - (targetCard.points || 0),
            sharedDeck: [targetCard, ...state.sharedDeck], // Send to top of deck
            pendingEffect: null,
            message: `${forPlayer ? "You" : "AI"} scared ${targetCard.name} back to the top of the deck.`,
          }
        }
      }
      break

    case "confuse":
      if (Array.isArray(targetIndex) && targetIndex.length === 2) {
        const playerCardIndex = targetIndex[0]
        const opponentCardIndex = targetIndex[1]

        if (
          playerCardIndex >= 0 &&
          playerCardIndex < state.playerField.length &&
          opponentCardIndex >= 0 &&
          opponentCardIndex < state.opponentField.length
        ) {
          const playerCard = state.playerField[playerCardIndex]
          const opponentCard = state.opponentField[opponentCardIndex]

          const newPlayerField = [...state.playerField]
          const newOpponentField = [...state.opponentField]

          newPlayerField.splice(playerCardIndex, 1)
          newOpponentField.splice(opponentCardIndex, 1)

          newPlayerField.push(opponentCard)
          newOpponentField.push(playerCard)

          const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)
          const newOpponentPoints = newOpponentField.reduce((sum, card) => sum + (card.points || 0), 0)

          return {
            ...state,
            playerField: newPlayerField,
            opponentField: newOpponentField,
            playerPoints: newPlayerPoints,
            opponentPoints: newOpponentPoints,
            pendingEffect: null,
            message: `${forPlayer ? "You" : "AI"} exchanged ${playerCard.name} with ${opponentCard.name}.`,
          }
        }
      }
      break

    case "domesticate":
      if (typeof targetIndex === "number") {
        const targetField = forPlayer ? state.opponentField : state.playerField
        if (targetIndex >= 0 && targetIndex < targetField.length) {
          const targetCard = targetField[targetIndex]

          if (targetCard.points !== 2) {
            return {
              ...state,
              pendingEffect: null,
              message: `${forPlayer ? "You" : "AI"} tried to use Domesticate on a non-2-point animal.`,
            }
          }

          const newSourceField = [...targetField]
          newSourceField.splice(targetIndex, 1)

          const newTargetField = forPlayer ? [...state.playerField, targetCard] : [...state.opponentField, targetCard]

          const newPlayerPoints = forPlayer
            ? state.playerPoints + (targetCard.points || 0)
            : state.playerPoints - (targetCard.points || 0)

          const newOpponentPoints = forPlayer
            ? state.opponentPoints - (targetCard.points || 0)
            : state.opponentPoints + (targetCard.points || 0)

          return {
            ...state,
            playerField: forPlayer ? newTargetField : newSourceField,
            opponentField: forPlayer ? newSourceField : newTargetField,
            playerPoints: newPlayerPoints,
            opponentPoints: newOpponentPoints,
            pendingEffect: null,
            message: `${forPlayer ? "You" : "AI"} domesticated ${targetCard.name}.`,
          }
        }
      }
      break

    case "octopus":
      if (Array.isArray(targetIndex)) {
        const topCards = state.sharedDeck.slice(0, Math.min(3, state.sharedDeck.length))
        const restOfDeck = state.sharedDeck.slice(topCards.length)

        // Rearrange the top cards based on the selected order
        const rearrangedCards: GameCard[] = []
        for (const idx of targetIndex) {
          if (idx >= 0 && idx < topCards.length) {
            rearrangedCards.push(topCards[idx])
          }
        }

        // Add any cards that weren't selected
        for (let i = 0; i < topCards.length; i++) {
          if (!targetIndex.includes(i)) {
            rearrangedCards.push(topCards[i])
          }
        }

        return {
          ...state,
          sharedDeck: [...rearrangedCards, ...restOfDeck],
          pendingEffect: null,
          message: `${forPlayer ? "You" : "AI"} looked at the top ${topCards.length} cards of the deck and rearranged them.`,
        }
      }
      break

    // Add other effect type cases as needed

    default:
      // Default case for unhandled effect types
      return {
        ...state,
        pendingEffect: null,
        message: `Effect ${type} was not implemented.`,
      }
  }

  // If this is a Seahorse effect, add animation for card drawing
  if (
    type === "seahorse" &&
    forPlayer &&
    document.querySelector(".player-hand-container") &&
    document.getElementById("deck-pile")
  ) {
    const deckElement = document.getElementById("deck-pile")
    const handContainer = document.querySelector(".player-hand-container")

    if (deckElement instanceof HTMLElement && handContainer instanceof HTMLElement) {
      const animalsPlayedThisTurn = state.effectsThisTurn?.playerAnimalsPlayed || 0
      const drawCount = 1 + animalsPlayedThisTurn

      // Use setTimeout to ensure the animation runs after state update
      setTimeout(() => {
        createDrawCardAnimation(deckElement, handContainer, drawCount, true)
      }, 100)
    }
  }

  // If we reach here, something went wrong with the effect resolution
  return {
    ...state,
    pendingEffect: null,
    message: "Effect could not be resolved.",
  }
}

export function endPlayerTurn(state: GameState): GameState {
  // Check for win conditions
  if (state.playerPoints >= 15) {
    return {
      ...state,
      gameStatus: "playerWin",
      message: "You have won the game!",
    }
  } else if (state.opponentPoints >= 15) {
    return {
      ...state,
      gameStatus: "opponentWin",
      message: "The AI has won the game.",
    }
  }

  // Reset effects for this turn
  const newEffectsThisTurn = {
    ...state.effectsThisTurn,
    playerAnimalsPlayed: 0,
    playerCardsDrawn: 0,
    playerExtraDraws: 0,
  }

  return {
    ...state,
    currentTurn: "opponent",
    effectsThisTurn: newEffectsThisTurn,
    message: "AI's turn to play.",
  }
}

// Update the makeAIDecision function to better handle card effects

// Find the makeAIDecision function and update it to prioritize cards with effects:
export function makeAIDecision(state: GameState): GameState {
  // First, check if AI has any animal cards with effects
  const animalWithEffectIndex = state.opponentHand.findIndex(
    (card) => card.type === "animal" && card.effect && card.effect.type,
  )

  // If AI has an animal card with effect, prioritize playing it
  if (animalWithEffectIndex !== -1) {
    console.log("AI is playing an animal card with effect")
    return playAnimalCard(state, animalWithEffectIndex, false)
  }

  // Next, check for high-value animal cards (4+ points)
  const highValueAnimalIndex = state.opponentHand.findIndex((card) => card.type === "animal" && (card.points || 0) >= 4)

  if (highValueAnimalIndex !== -1) {
    console.log("AI is playing a high-value animal card")
    return playAnimalCard(state, highValueAnimalIndex, false)
  }

  // If AI has an impact card with valid targets, play it
  const impactCardIndex = state.opponentHand.findIndex(
    (card) => card.type === "impact" && isImpactCardWithValidTargets(card, state, false),
  )

  if (impactCardIndex !== -1) {
    console.log("AI is playing an impact card")
    return playImpactCard(state, impactCardIndex, false)
  }

  // If AI has a medium-value animal card (2-3 points), play it
  const mediumValueAnimalIndex = state.opponentHand.findIndex(
    (card) => card.type === "animal" && (card.points || 0) >= 2 && (card.points || 0) <= 3,
  )

  if (mediumValueAnimalIndex !== -1) {
    console.log("AI is playing a medium-value animal card")
    return playAnimalCard(state, mediumValueAnimalIndex, false)
  }

  // If AI has any animal card, play it
  const anyAnimalCardIndex = state.opponentHand.findIndex((card) => card.type === "animal")
  if (anyAnimalCardIndex !== -1) {
    console.log("AI is playing any available animal card")
    return playAnimalCard(state, anyAnimalCardIndex, false)
  }

  // Otherwise, draw cards
  console.log("AI is drawing cards")
  return drawCards(state, 2, false)
}

export function endAITurn(state: GameState): GameState {
  // Check for win conditions
  if (state.playerPoints >= 15) {
    return {
      ...state,
      gameStatus: "playerWin",
      message: "You have won the game!",
    }
  } else if (state.opponentPoints >= 15) {
    return {
      ...state,
      gameStatus: "opponentWin",
      message: "The AI has won the game.",
    }
  }

  // Reset effects for this turn
  const newEffectsThisTurn = {
    ...state.effectsThisTurn,
    opponentAnimalsPlayed: 0,
    opponentCardsDrawn: 0,
    opponentExtraPlays: 0,
  }

  return {
    ...state,
    currentTurn: "player",
    effectsThisTurn: newEffectsThisTurn,
    message: "Your turn to play.",
  }
}

// Declare createDrawCardAnimation
declare function createDrawCardAnimation(
  deckElement: HTMLElement,
  handContainer: HTMLElement,
  drawCount: number,
  isPlayer: boolean,
): void
