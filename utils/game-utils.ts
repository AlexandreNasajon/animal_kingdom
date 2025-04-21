import type { GameCard, GameState } from "@/types/game"
import { ADVANCED_DECK } from "@/types/advanced-deck"
// Import the applyAnimalEffect function from game-effects
import { applyAnimalEffect, updateGameStateEndOfTurn, resolveAnimalEffect } from "./game-effects"

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
  return ADVANCED_DECK
}

// Get the appropriate deck based on the deck ID
export function getDeckById(deckId = 1): GameCard[] {
  return ADVANCED_DECK
}

// Initialize a new game with the advanced deck
// Function to create a new game state
export function createNewGameState(): GameState {
  const shuffledDeck = shuffleDeck([...ADVANCED_DECK])

  // Deal 5 cards to each player
  const player1Hand: GameCard[] = []
  const player2Hand: GameCard[] = []

  for (let i = 0; i < 5; i++) {
    if (shuffledDeck.length > 0) player1Hand.push(shuffledDeck.pop()!)
    if (shuffledDeck.length > 0) player2Hand.push(shuffledDeck.pop()!)
  }

  return {
    playerPoints: 0,
    opponentPoints: 0,
    playerHand: player1Hand,
    opponentHand: player2Hand,
    playerField: [],
    opponentField: [],
    sharedDeck: shuffledDeck,
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
      opponentExtraDraws: 0,
      playerExtraPlays: 0,
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

// Function to shuffle the deck
export function shuffleDeck(deck: GameCard[]): GameCard[] {
  const newDeck = [...deck]
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
  }
  return newDeck
}

export function initializeGame(deckId = 1): GameState {
  const deck = ADVANCED_DECK
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

// Draw cards from the deck
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
      message: `You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.${maxDraw < count ? " Your hand is now full (maximum 6 cards)." : ""}`,
    }
  } else {
    return {
      ...state,
      opponentHand: [...state.opponentHand, ...drawnCards],
      sharedDeck: newDeck,
      message: `AI drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.${maxDraw < count ? " AI's hand is now full (maximum 6 cards)." : ""}`,
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

// Play an animal card
export function playAnimalCard(state: GameState, cardIndex: number, forPlayer: boolean): GameState {
  const hand = forPlayer ? state.playerHand : state.opponentHand
  const card = hand[cardIndex]

  if (!card || card.type !== "animal") {
    return state
  }

  const newHand = [...hand]
  newHand.splice(cardIndex, 1)

  let newState
  if (forPlayer) {
    newState = {
      ...state,
      playerHand: newHand,
      playerField: [...state.playerField, card],
      playerPoints: state.playerPoints + (card.points || 0),
      message: `You played ${card.name} (${card.points} points).`,
    }
  } else {
    newState = {
      ...state,
      opponentHand: newHand,
      opponentField: [...state.opponentField, card],
      opponentPoints: state.opponentPoints + (card.points || 0),
      message: `AI played ${card.name} (${card.points} points).`,
    }
  }

  // Update the count of animals played this turn
  if (forPlayer) {
    newState.effectsThisTurn.playerAnimalsPlayed += 1
  } else {
    newState.effectsThisTurn.opponentAnimalsPlayed += 1
  }

  // Apply animal effect after playing the card
  return applyAnimalEffect(newState, card, forPlayer)
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
      return forPlayer ? state.playerField.length > 0 : state.opponentField.length > 0

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

      case "Drought":
        // Each player sends animals to the bottom until they have 2
        const playerFieldCopy = [...state.playerField]
        const opponentFieldCopy = [...state.opponentField]
        let playerPointsChange = 0
        let opponentPointsChange = 0
        let sentToBottom: GameCard[] = []

        // Process player's field
        if (playerFieldCopy.length > 2) {
          const toRemove = playerFieldCopy.length - 2
          const removedCards = playerFieldCopy.splice(0, toRemove)
          sentToBottom = [...sentToBottom, ...removedCards]
          playerPointsChange = removedCards.reduce((sum, card) => sum - (card.points || 0), 0)
        }

        // Process opponent's field
        if (opponentFieldCopy.length > 2) {
          const toRemove = opponentFieldCopy.length - 2
          const removedCards = opponentFieldCopy.splice(0, toRemove)
          sentToBottom = [...sentToBottom, ...removedCards]
          opponentPointsChange = removedCards.reduce((sum, card) => sum - (card.points || 0), 0)
        }

        return {
          ...newState,
          playerField: playerFieldCopy,
          opponentField: opponentFieldCopy,
          playerPoints: state.playerPoints + playerPointsChange,
          opponentPoints: state.opponentPoints + opponentPointsChange,
          sharedDeck: [...state.sharedDeck, ...sentToBottom],
          message: `You played Drought. Each player now has at most 2 animals on their field.`,
        }

      case "Flood":
        // Each player sends their 2 smallest animals to deck bottom (random if tied)
        const playerField = [...state.playerField]
        const opponentField = [...state.opponentField]
        let playerPoints = state.playerPoints
        let opponentPoints = state.opponentPoints
        const cardsToBottom: GameCard[] = []

        // Process player's field - find the 2 smallest animals
        if (playerField.length > 0) {
          // Sort by points (ascending)
          const sortedPlayerField = [...playerField].sort((a, b) => (a.points || 0) - (b.points || 0))
          const count = Math.min(2, sortedPlayerField.length)
          const smallestCards = sortedPlayerField.slice(0, count)

          // Remove the smallest cards from player's field
          for (const card of smallestCards) {
            const index = playerField.findIndex((c) => c.id === card.id)
            if (index !== -1) {
              playerField.splice(index, 1)
              cardsToBottom.push(card)
              playerPoints -= card.points || 0
            }
          }
        }

        // Process opponent's field - find the 2 smallest animals
        if (opponentField.length > 0) {
          // Sort by points (ascending)
          const sortedOpponentField = [...opponentField].sort((a, b) => (a.points || 0) - (b.points || 0))
          const count = Math.min(2, sortedOpponentField.length)
          const smallestCards = sortedOpponentField.slice(0, count)

          // Remove the smallest cards from opponent's field
          for (const card of smallestCards) {
            const index = opponentField.findIndex((c) => c.id === card.id)
            if (index !== -1) {
              opponentField.splice(index, 1)
              cardsToBottom.push(card)
              opponentPoints -= card.points || 0
            }
          }
        }

        return {
          ...newState,
          playerField,
          opponentField,
          playerPoints,
          opponentPoints,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          message: `You played Flood. Each player sent their 2 smallest animals to the bottom of the deck.`,
        }

      case "Epidemic":
        // Send 1 animal to the bottom along with all animals of same environment with more points
        // Fixed: Only allow selecting from player's field
        if (state.playerField.length > 0) {
          return {
            ...newState,
            pendingEffect: {
              type: "epidemic",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Epidemic, but you have no animals on your field.",
          }
        }

      case "Compete":
        // Send 1 animal from your hand to the bottom along with all animals of same points
        if (newState.playerHand.some((c) => c.type === "animal")) {
          return {
            ...newState,
            pendingEffect: {
              type: "compete",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Compete, but you have no animal cards in your hand.",
          }
        }

      case "Prey":
        // Choose 1 animal on your field. Send all animals of same environment with fewer points to the bottom
        if (state.playerField.length > 0) {
          return {
            ...newState,
            pendingEffect: {
              type: "prey",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Prey, but you have no animals on your field.",
          }
        }

      case "Cage":
        // Send 1 animal from your field to the discard pile to gain control of an opponent's animal
        if (state.playerField.length > 0 && state.opponentField.length > 0) {
          return {
            ...newState,
            pendingEffect: {
              type: "cage",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message:
              "You played Cage, but you either have no animals on your field or there are no opponent animals to target.",
          }
        }

      case "Flourish":
        // If you have 2 or fewer cards in hand, draw until you have 6
        if (newState.playerHand.length <= 2) {
          const cardsToDraw = 6 - newState.playerHand.length
          if (state.sharedDeck.length >= cardsToDraw) {
            const drawnCards = state.sharedDeck.slice(0, cardsToDraw)
            return {
              ...newState,
              playerHand: [...newState.playerHand, ...drawnCards],
              sharedDeck: state.sharedDeck.slice(cardsToDraw),
              message: `You played Flourish and drew ${cardsToDraw} cards.`,
            }
          } else {
            return {
              ...newState,
              message: "You played Flourish, but there aren't enough cards in the deck.",
            }
          }
        } else {
          return {
            ...newState,
            message: "You played Flourish, but you already have more than 2 cards in hand.",
          }
        }

      case "Earthquake":
        // Send all animals worth 3 or more points to the bottom
        let pField = [...state.playerField]
        let oField = [...state.opponentField]
        let pPoints = state.playerPoints
        let oPoints = state.opponentPoints
        let bottomCards: GameCard[] = []

        // Filter out animals worth 3+ points
        const pHighValue = pField.filter((c) => (c.points || 0) >= 3)
        const oHighValue = oField.filter((c) => (c.points || 0) >= 3)
        pField = pField.filter((c) => (c.points || 0) < 3)
        oField = oField.filter((c) => (c.points || 0) < 3)

        // Update points
        pPoints -= pHighValue.reduce((sum, card) => sum + (card.points || 0), 0)
        oPoints -= oHighValue.reduce((sum, card) => sum + (card.points || 0), 0)

        // Add cards to bottom
        bottomCards = [...bottomCards, ...pHighValue, ...oHighValue]

        return {
          ...newState,
          playerField: pField,
          opponentField: oField,
          playerPoints: pPoints,
          opponentPoints: oPoints,
          sharedDeck: [...state.sharedDeck, ...bottomCards],
          message: `You played Earthquake. All animals worth 3+ points were sent to the bottom of the deck.`,
        }

      case "Storm":
        // Send all animals worth 2 or fewer points to the bottom
        let pFieldStorm = [...state.playerField]
        let oFieldStorm = [...state.opponentField]
        let pPointsStorm = state.playerPoints
        let oPointsStorm = state.opponentPoints
        let bottomCardsStorm: GameCard[] = []

        // Filter out animals worth 2 or fewer points
        const pLowValue = pFieldStorm.filter((c) => (c.points || 0) <= 2)
        const oLowValue = oFieldStorm.filter((c) => (c.points || 0) <= 2)
        pFieldStorm = pFieldStorm.filter((c) => (c.points || 0) > 2)
        oFieldStorm = oFieldStorm.filter((c) => (c.points || 0) > 2)

        // Update points
        pPointsStorm -= pLowValue.reduce((sum, card) => sum + (card.points || 0), 0)
        oPointsStorm -= oLowValue.reduce((sum, card) => sum + (card.points || 0), 0)

        // Add cards to bottom
        bottomCardsStorm = [...bottomCardsStorm, ...pLowValue, ...oLowValue]

        return {
          ...newState,
          playerField: pFieldStorm,
          opponentField: oFieldStorm,
          playerPoints: pPointsStorm,
          opponentPoints: oPointsStorm,
          sharedDeck: [...state.sharedDeck, ...bottomCardsStorm],
          message: `You played Storm. All animals worth 2 or fewer points were sent to the bottom of the deck.`,
        }

      // Add more card effects as needed
      default:
        return newState
    }
  } else {
    // AI plays impact card - improved implementation with more strategic choices
    switch (card.name) {
      case "Hunter":
        // Destroy 1 terrestrial animal (including amphibians)
        if (state.playerField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")) {
          // Find the highest value terrestrial animal in player's field
          const targetIndex = state.playerField
            .map((c, i) => ({ card: c, index: i }))
            .filter((item) => item.card.environment === "terrestrial" || item.card.environment === "amphibian")
            .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

          const targetCard = state.playerField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)
          return {
            ...newState,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDiscard: [...newState.sharedDiscard, targetCard],
            message: `AI played Hunter and destroyed your ${targetCard.name}.`,
          }
        } else {
          return {
            ...newState,
            message: "AI played Hunter, but there are no terrestrial animals to target.",
          }
        }

      case "Fisher":
        // Destroy 1 aquatic animal (including amphibians)
        if (state.playerField.some((c) => c.environment === "aquatic" || c.environment === "amphibian")) {
          // Find the highest value aquatic animal in player's field
          const targetIndex = state.playerField
            .map((c, i) => ({ card: c, index: i }))
            .filter((item) => item.card.environment === "aquatic" || item.card.environment === "amphibian")
            .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

          const targetCard = state.playerField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)
          return {
            ...newState,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDiscard: [...newState.sharedDiscard, targetCard],
            message: `AI played Fisher and destroyed your ${targetCard.name}.`,
          }
        } else {
          return {
            ...newState,
            message: "AI played Fisher, but there are no aquatic animals to target.",
          }
        }

      case "Flood":
        // Each player sends their 2 smallest animals to deck bottom (random if tied)
        const playerField = [...state.playerField]
        const opponentField = [...state.opponentField]
        let playerPoints = state.playerPoints
        let opponentPoints = state.opponentPoints
        const cardsToBottom: GameCard[] = []

        // Process player's field - find the 2 smallest animals
        if (playerField.length > 0) {
          // Sort by points (ascending)
          const sortedPlayerField = [...playerField].sort((a, b) => (a.points || 0) - (b.points || 0))
          const count = Math.min(2, sortedPlayerField.length)
          const smallestCards = sortedPlayerField.slice(0, count)

          // Remove the smallest cards from player's field
          for (const card of smallestCards) {
            const index = playerField.findIndex((c) => c.id === card.id)
            if (index !== -1) {
              playerField.splice(index, 1)
              cardsToBottom.push(card)
              playerPoints -= card.points || 0
            }
          }
        }

        // Process opponent's field - find the 2 smallest animals
        if (opponentField.length > 0) {
          // Sort by points (ascending)
          const sortedOpponentField = [...opponentField].sort((a, b) => (a.points || 0) - (b.points || 0))
          const count = Math.min(2, sortedOpponentField.length)
          const smallestCards = sortedOpponentField.slice(0, count)

          // Remove the smallest cards from opponent's field
          for (const card of smallestCards) {
            const index = opponentField.findIndex((c) => c.id === card.id)
            if (index !== -1) {
              opponentField.splice(index, 1)
              cardsToBottom.push(card)
              opponentPoints -= card.points || 0
            }
          }
        }

        return {
          ...newState,
          playerField,
          opponentField,
          playerPoints,
          opponentPoints,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          message: `AI played Flood. Each player sent their 2 smallest animals to the bottom of the deck.`,
        }

      case "Veterinarian":
        // Play an animal card from the discard pile
        const discardAnimals = state.sharedDiscard.filter((c) => c.type === "animal")
        if (discardAnimals.length > 0) {
          // Find the highest value animal in the discard pile
          const targetCard = discardAnimals.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
          const newDiscard = state.sharedDiscard.filter((c) => c.id !== targetCard.id)

          return {
            ...newState,
            opponentField: [...state.opponentField, targetCard],
            opponentPoints: state.opponentPoints + (targetCard.points || 0),
            sharedDiscard: newDiscard,
            message: `AI played Veterinarian and returned ${targetCard.name} from the discard pile.`,
          }
        } else {
          return {
            ...newState,
            message: "AI played Veterinarian, but there are no animal cards in the discard pile.",
          }
        }

      case "Drought":
        // Each player sends animals to the bottom until they have 2
        const playerFieldCopy = [...state.playerField]
        const opponentFieldCopy = [...state.opponentField]
        let playerPointsChange = 0
        let opponentPointsChange = 0
        let sentToBottom: GameCard[] = []

        // Process player's field
        if (playerFieldCopy.length > 2) {
          // Sort player's field by points (highest first) and keep the top 2
          const sortedPlayerField = [...playerFieldCopy].sort((a, b) => (b.points || 0) - (a.points || 0))
          const keptCards = sortedPlayerField.slice(0, 2)
          const removedCards = sortedPlayerField.slice(2)

          sentToBottom = [...sentToBottom, ...removedCards]
          playerPointsChange = removedCards.reduce((sum, card) => sum - (card.points || 0), 0)

          // Update player's field to only contain the kept cards
          playerFieldCopy.length = 0
          playerFieldCopy.push(...keptCards)
        }

        // Process opponent's field - AI strategically keeps its highest point cards
        if (opponentFieldCopy.length > 2) {
          // Sort opponent's field by points (highest first) and keep the top 2
          const sortedOpponentField = [...opponentFieldCopy].sort((a, b) => (b.points || 0) - (a.points || 0))
          const keptCards = sortedOpponentField.slice(0, 2)
          const removedCards = sortedOpponentField.slice(2)

          sentToBottom = [...sentToBottom, ...removedCards]
          opponentPointsChange = removedCards.reduce((sum, card) => sum - (card.points || 0), 0)

          // Update opponent's field to only contain the kept cards
          opponentFieldCopy.length = 0
          opponentFieldCopy.push(...keptCards)
        }

        return {
          ...newState,
          playerField: playerFieldCopy,
          opponentField: opponentFieldCopy,
          playerPoints: state.playerPoints + playerPointsChange,
          opponentPoints: state.opponentPoints + opponentPointsChange,
          sharedDeck: [...state.sharedDeck, ...sentToBottom],
          message: `AI played Drought. Each player now has at most 2 animals on their field.`,
        }

      // Add other AI card effects here...
      default:
        return newState
    }
  }
}

// Handle effect resolution
export function resolveEffect(state: GameState, targetIndex: number | number[]): GameState {
  if (!state.pendingEffect || !state.pendingEffect.type) return state

  const { type, forPlayer } = state.pendingEffect

  // Check for animal effects first
  const animalEffects = [
    "mouse",
    "squirrel",
    "snake",
    "zebra",
    "deer",
    "tuna",
    "turtle",
    "dolphin",
    "octopus",
    "frog",
    "crab",
    "crocodile",
    "wolf",
  ]
  if (animalEffects.includes(type)) {
    return resolveAnimalEffect(state, targetIndex)
  }

  // Handle impact card effects
  switch (type) {
    case "hunter":
      if (forPlayer) {
        // Player targeting opponent's terrestrial animal (or amphibian)
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || (targetCard.environment !== "terrestrial" && targetCard.environment !== "amphibian"))
          return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)
        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `You destroyed the opponent's ${targetCard.name}.`,
        }
      }
      break

    case "fisher":
      if (forPlayer) {
        // Player targeting opponent's aquatic animal (or amphibian)
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || (targetCard.environment !== "aquatic" && targetCard.environment !== "amphibian"))
          return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)
        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `You destroyed the opponent's ${targetCard.name}.`,
        }
      }
      break

    case "veterinarian":
      if (forPlayer) {
        // Player selecting an animal from the discard pile to play
        const targetCard = state.sharedDiscard[targetIndex as number]
        if (!targetCard || targetCard.type !== "animal") return state

        const newDiscard = [...state.sharedDiscard]
        newDiscard.splice(targetIndex as number, 1)

        return {
          ...state,
          playerField: [...state.playerField, targetCard],
          playerPoints: state.playerPoints + (targetCard.points || 0),
          sharedDiscard: newDiscard,
          pendingEffect: null,
          message: `You played ${targetCard.name} from the discard pile.`,
        }
      }
      break

    case "limit":
      if (forPlayer) {
        // Player selecting an opponent's animal to destroy
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard) return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)

        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `You destroyed the opponent's ${targetCard.name}.`,
          // Set the Limit effect to last for 2 turns
          persistentEffects: {
            ...state.persistentEffects,
            limitUntilTurn: 2,
          },
          effectsThisTurn: {
            ...state.effectsThisTurn,
            limitInEffect: true,
          },
        }
      }
      break

    case "confuse":
      if (forPlayer && Array.isArray(targetIndex) && targetIndex.length === 2) {
        // Player selecting one of their animals and one of the opponent's to exchange
        const playerIdx = targetIndex[0]
        const opponentIdx = targetIndex[1]

        const playerCard = state.playerField[playerIdx]
        const opponentCard = state.opponentField[opponentIdx]

        if (!playerCard || !opponentCard) return state

        // Create new arrays with the cards exchanged
        const newPlayerField = [...state.playerField]
        const newOpponentField = [...state.opponentField]

        // Remove the cards from their original positions
        newPlayerField.splice(playerIdx, 1)
        newOpponentField.splice(opponentIdx, 1)

        // Add the cards to their new positions
        newPlayerField.push(opponentCard)
        newOpponentField.push(playerCard)

        // Calculate new points
        const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)
        const newOpponentPoints = newOpponentField.reduce((sum, card) => sum + (card.points || 0), 0)

        return {
          ...state,
          playerField: newPlayerField,
          opponentField: newOpponentField,
          playerPoints: newPlayerPoints,
          opponentPoints: newOpponentPoints,
          pendingEffect: null,
          message: `You exchanged ${playerCard.name} with the opponent's ${opponentCard.name}.`,
        }
      }
      break

    case "domesticate":
      if (forPlayer) {
        // Player selecting a 2-point animal to gain control of
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || targetCard.points !== 2) return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)

        return {
          ...state,
          playerField: [...state.playerField, targetCard],
          opponentField: newOpponentField,
          playerPoints: state.playerPoints + (targetCard.points || 0),
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          pendingEffect: null,
          message: `You gained control of the opponent's ${targetCard.name}.`,
        }
      }
      break

    case "trap":
      if (forPlayer) {
        // AI selecting an animal to give to the player
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard) return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)

        return {
          ...state,
          playerField: [...state.playerField, targetCard],
          opponentField: newOpponentField,
          playerPoints: state.playerPoints + (targetCard.points || 0),
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          pendingEffect: null,
          message: `AI gave you their ${targetCard.name}.`,
        }
      } else {
        // Player selecting an animal to give to the AI
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard) return state

        const newPlayerField = [...state.playerField]
        newPlayerField.splice(targetIndex as number, 1)

        return {
          ...state,
          opponentField: [...state.opponentField, targetCard],
          playerField: newPlayerField,
          opponentPoints: state.opponentPoints + (targetCard.points || 0),
          playerPoints: state.playerPoints - (targetCard.points || 0),
          pendingEffect: null,
          message: `You gave your ${targetCard.name} to the AI.`,
        }
      }
      break

    case "epidemic":
      if (forPlayer) {
        // Player selecting an animal from their field
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard || targetCard.type !== "animal") return state

        // Find all animals of the same environment with more points
        const environment = targetCard.environment
        const points = targetCard.points || 0

        // Get all animals of the same environment with more points from both fields
        const playerAnimalsToRemove = state.playerField.filter(
          (c) => c.environment === environment && (c.points || 0) > points,
        )
        const opponentAnimalsToRemove = state.opponentField.filter(
          (c) => c.environment === environment && (c.points || 0) > points,
        )

        // Create new fields without the removed animals
        const newPlayerField = state.playerField.filter(
          (c) => c.environment !== environment || (c.points || 0) <= points || c.id === targetCard.id,
        )
        const newOpponentField = state.opponentField.filter(
          (c) => c.environment !== environment || (c.points || 0) <= points,
        )

        // Calculate point changes
        const playerPointsChange = state.playerField
          .filter((c) => !newPlayerField.includes(c))
          .reduce((sum, card) => sum + (card.points || 0), 0)
        const opponentPointsChange = state.opponentField
          .filter((c) => !newOpponentField.includes(c))
          .reduce((sum, card) => sum + (card.points || 0), 0)

        // Add all removed animals to the bottom of the deck
        const cardsToBottom = [...playerAnimalsToRemove, ...opponentAnimalsToRemove]

        return {
          ...state,
          playerField: newPlayerField,
          opponentField: newOpponentField,
          playerPoints: state.playerPoints - playerPointsChange,
          opponentPoints: state.opponentPoints - opponentPointsChange,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          pendingEffect: null,
          message: `You sent all ${environment} animals with more than ${points} points to the bottom of the deck.`,
        }
      }
      break

    case "compete":
      if (forPlayer) {
        // Player selecting an animal from their hand
        const targetCard = state.playerHand[targetIndex as number]
        if (!targetCard || targetCard.type !== "animal") return state

        // Find all animals with the same points in both hands
        const points = targetCard.points || 0

        // Get all animals with the same points from both hands
        const playerHandAnimalsToRemove = state.playerHand.filter(
          (c) => c.type === "animal" && (c.points || 0) === points && c.id !== targetCard.id,
        )
        const opponentHandAnimalsToRemove = state.opponentHand.filter(
          (c) => c.type === "animal" && (c.points || 0) === points,
        )

        // Create new hands without the removed animals
        const newPlayerHand = state.playerHand.filter(
          (c) => c.id === targetCard.id || c.type !== "animal" || (c.points || 0) !== points,
        )
        const newOpponentHand = state.opponentHand.filter((c) => c.type !== "animal" || (c.points || 0) !== points)

        // Remove the selected card from player's hand
        const finalPlayerHand = newPlayerHand.filter((c) => c.id !== targetCard.id)

        // Add all removed animals to the bottom of the deck
        const cardsToBottom = [targetCard, ...playerHandAnimalsToRemove, ...opponentHandAnimalsToRemove]

        return {
          ...state,
          playerHand: finalPlayerHand,
          opponentHand: newOpponentHand,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          pendingEffect: null,
          message: `You sent ${targetCard.name} and all ${points}-point animals to the bottom of the deck.`,
        }
      }
      break

    case "prey":
      if (forPlayer) {
        // Player selecting an animal from their field
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard || targetCard.type !== "animal") return state

        // Find all animals of the same environment with fewer points
        const environment = targetCard.environment
        const points = targetCard.points || 0

        // Get all animals of the same environment with fewer points from both fields
        const playerAnimalsToRemove = state.playerField.filter(
          (c) => c.environment === environment && (c.points || 0) < points,
        )
        const opponentAnimalsToRemove = state.opponentField.filter(
          (c) => c.environment === environment && (c.points || 0) < points,
        )

        // Create new fields without the removed animals
        const newPlayerField = state.playerField.filter(
          (c) => c.environment !== environment || (c.points || 0) >= points,
        )
        const newOpponentField = state.opponentField.filter(
          (c) => c.environment !== environment || (c.points || 0) >= points,
        )

        // Calculate point changes
        const playerPointsChange = state.playerField
          .filter((c) => !newPlayerField.includes(c))
          .reduce((sum, card) => sum + (card.points || 0), 0)
        const opponentPointsChange = state.opponentField
          .filter((c) => !newOpponentField.includes(c))
          .reduce((sum, card) => sum + (card.points || 0), 0)

        // Add all removed animals to the bottom of the deck
        const cardsToBottom = [...playerAnimalsToRemove, ...opponentAnimalsToRemove]

        return {
          ...state,
          playerField: newPlayerField,
          opponentField: newOpponentField,
          playerPoints: state.playerPoints - playerPointsChange,
          opponentPoints: state.opponentPoints - opponentPointsChange,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          pendingEffect: null,
          message: `You sent all ${environment} animals with fewer than ${points} points to the bottom of the deck.`,
        }
      }
      break

    case "cage":
      if (forPlayer) {
        if (!state.pendingEffect.firstSelection) {
          // First selection: player selecting an animal from their field to discard
          const targetCard = state.playerField[targetIndex as number]
          if (!targetCard) return state

          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex as number, 1)

          return {
            ...state,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDiscard: [...state.sharedDiscard, targetCard],
            pendingEffect: {
              ...state.pendingEffect,
              firstSelection: targetIndex,
            },
            message: `You sent ${targetCard.name} to the discard pile. Now select an opponent's animal to gain control of.`,
          }
        } else {
          // Second selection: player selecting an opponent's animal to gain control of
          const targetCard = state.opponentField[targetIndex as number]
          if (!targetCard) return state

          const newOpponentField = [...state.opponentField]
          newOpponentField.splice(targetIndex as number, 1)

          return {
            ...state,
            playerField: [...state.playerField, targetCard],
            opponentField: newOpponentField,
            playerPoints: state.playerPoints + (targetCard.points || 0),
            opponentPoints: state.opponentPoints - (targetCard.points || 0),
            pendingEffect: null,
            message: `You gained control of the opponent's ${targetCard.name}.`,
          }
        }
      }
      break

    case "payCost":
      if (forPlayer) {
        // Process sacrifice or return to hand
        const selectedCardIndex = state.pendingEffect.selectedCard
        const costType = state.pendingEffect.costType
        const targetCardId = state.pendingEffect.targetCardId

        // Find the card to be played from player's hand
        const cardToPlay = state.playerHand.find((c) => c.id === targetCardId)
        if (!cardToPlay) return state

        // Find the index of the card to play
        const cardToPlayIndex = state.playerHand.findIndex((c) => c.id === targetCardId)

        // Get the animal being sacrificed
        const sacrificedAnimal = state.playerField[targetIndex as number]

        // Create a new player field with the sacrificed animal removed
        const newPlayerField = [...state.playerField]
        newPlayerField.splice(targetIndex as number, 1)

        // Create a new player hand with the played card removed
        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(cardToPlayIndex, 1)

        // Temporarily update points
        const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)

        // Create a temporary new state
        let tempState = {
          ...state,
          playerField: newPlayerField,
          playerHand: newPlayerHand,
          playerPoints: newPlayerPoints,
          pendingEffect: null,
        }

        if (costType === "return") {
          // For Crocodile, return the animal to hand
          tempState.playerHand.push(sacrificedAnimal)
          tempState.message = `You returned ${sacrificedAnimal.name} to your hand and played ${cardToPlay.name}.`
        } else {
          // For Lion and Shark, send to discard
          tempState.sharedDiscard = [...state.sharedDiscard, sacrificedAnimal]
          tempState.message = `You sacrificed ${sacrificedAnimal.name} to play ${cardToPlay.name}.`
        }

        // Now add the played card to the field
        tempState.playerField = [...tempState.playerField, cardToPlay]
        tempState.playerPoints = tempState.playerField.reduce((sum, card) => sum + (card.points || 0), 0)

        // Apply the card's effect
        if (cardToPlay.type === "animal" && cardToPlay.effect) {
          tempState = applyAnimalEffect(tempState, cardToPlay, true)
        }

        return tempState
      }
      break

    default:
      return {
        ...state,
        pendingEffect: null,
        message: "Effect resolved.",
      }
  }

  return state
}

// Check if the game is over
export function checkGameOver(state: GameState): GameState {
  // Check if player has 7 or more points at the start of their turn
  if (state.currentTurn === "player" && state.playerPoints >= 7) {
    return {
      ...state,
      gameStatus: "playerWin",
      message: "🏆 You win! You have 7 or more points.",
    }
  }

  // Check if AI has 7 or more points at the start of their turn
  if (state.currentTurn === "opponent" && state.opponentPoints >= 7) {
    return {
      ...state,
      gameStatus: "opponentWin",
      message: "AI wins! They have 7 or more points.",
    }
  }

  // Update message if either player is close to winning but it's not their turn yet
  if (state.playerPoints >= 7 && state.currentTurn === "opponent") {
    return {
      ...state,
      message: "You have 7+ points! Win at the start of your next turn!",
    }
  }

  if (state.opponentPoints >= 7 && state.currentTurn === "player") {
    return {
      ...state,
      message: "AI has 7+ points! Stop them before their next turn!",
    }
  }

  return state
}

// AI decision making - improved with better strategy
export function makeAIDecision(state: GameState): GameState {
  // WINNING STRATEGY: If AI can win by playing an animal card, do it immediately
  const winningAnimalIndex = state.opponentHand.findIndex(
    (card) => card.type === "animal" && (card.points || 0) + state.opponentPoints >= 7,
  )

  if (winningAnimalIndex !== -1) {
    // Check if it's a card that requires sacrifice (Lion, Shark, Crocodile)
    const cardToPlay = state.opponentHand[winningAnimalIndex]
    if (["Lion", "Shark", "Crocodile"].includes(cardToPlay.name)) {
      // Check if AI has animals on the field to pay the cost
      if (state.opponentField.length === 0) {
        // Can't play the card, try to draw instead
        return drawCards(state, 2, false)
      }

      // AI has animals on the field, so it can pay the cost
      // First, sacrifice an animal (choose the lowest value one)
      const sacrificeIndex = state.opponentField
        .map((card, index) => ({ card, index }))
        .sort((a, b) => (a.card.points || 0) - (b.card.points || 0))[0].index

      const sacrificedAnimal = state.opponentField[sacrificeIndex]
      const newOpponentField = [...state.opponentField]
      newOpponentField.splice(sacrificeIndex, 1)

      // Remove the card from hand
      const newOpponentHand = [...state.opponentHand]
      newOpponentHand.splice(winningAnimalIndex, 1)

      // Calculate new points after sacrifice
      const newOpponentPoints = state.opponentPoints - (sacrificedAnimal.points || 0)

      // Create a new state with the sacrificed animal removed and the card played
      const newState = {
        ...state,
        opponentField: [...newOpponentField, cardToPlay],
        opponentHand: newOpponentHand,
        opponentPoints: newOpponentPoints + (cardToPlay.points || 0),
        sharedDiscard: [...state.sharedDiscard, sacrificedAnimal],
        message: `AI sacrificed ${sacrificedAnimal.name} to play ${cardToPlay.name}.`,
        effectsThisTurn: {
          ...state.effectsThisTurn,
          opponentAnimalsPlayed: state.effectsThisTurn.opponentAnimalsPlayed + 1,
        },
      }

      // Apply the card's effect
      return applyAnimalEffect(newState, cardToPlay, false)
    }

    // Play the winning animal card (not a cost card)
    return playAnimalCard(state, winningAnimalIndex, false)
  }

  // Check if there are any playable animal cards
  const playableAnimalCards = state.opponentHand
    .map((card, index) => ({ card, index }))
    .filter((item) => item.card.type === "animal")

  if (playableAnimalCards.length > 0) {
    // Sort by points (highest first)
    playableAnimalCards.sort((a, b) => (b.card.points || 0) - (a.card.points || 0))

    // 70% chance to play an animal card if we have one
    if (Math.random() < 0.7) {
      // Check if the highest value card is a Lion, Shark, or Crocodile that requires a cost
      const highestCard = playableAnimalCards[0]

      if (["Lion", "Shark", "Crocodile"].includes(highestCard.card.name)) {
        // Check if AI has animals on the field to pay the cost
        if (state.opponentField.length === 0) {
          // Can't play the card, try the next best card or draw
          if (playableAnimalCards.length > 1) {
            return playAnimalCard(state, playableAnimalCards[1].index, false)
          } else {
            // No other animal cards, so draw
            return drawCards(state, 2, false)
          }
        }

        // AI has animals on the field, so it can pay the cost
        // First, sacrifice an animal (choose the lowest value one)
        const sacrificeIndex = state.opponentField
          .map((card, index) => ({ card, index }))
          .sort((a, b) => (a.card.points || 0) - (b.card.points || 0))[0].index

        const sacrificedAnimal = state.opponentField[sacrificeIndex]
        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(sacrificeIndex, 1)

        // Remove the card from hand
        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(highestCard.index, 1)

        // Calculate new points after sacrifice
        const newOpponentPoints = state.opponentPoints - (sacrificedAnimal.points || 0)

        // Create a new state with the sacrificed animal removed and the card played
        const newState = {
          ...state,
          opponentField: [...newOpponentField, highestCard.card],
          opponentHand: newOpponentHand,
          opponentPoints: newOpponentPoints + (highestCard.card.points || 0),
          sharedDiscard: [...state.sharedDiscard, sacrificedAnimal],
          message: `AI sacrificed ${sacrificedAnimal.name} to play ${highestCard.card.name}.`,
          effectsThisTurn: {
            ...state.effectsThisTurn,
            opponentAnimalsPlayed: state.effectsThisTurn.opponentAnimalsPlayed + 1,
          },
        }

        // Apply the card's effect
        return applyAnimalEffect(newState, highestCard.card, false)
      }

      // Play the highest value animal card
      return playAnimalCard(state, playableAnimalCards[0].index, false)
    }
  }

  // Check if there are any playable impact cards with valid targets
  const playableImpactCards = state.opponentHand
    .map((card, index) => ({ card, index }))
    .filter((item) => item.card.type === "impact" && isImpactCardWithValidTargets(item.card, state, false))

  if (playableImpactCards.length > 0) {
    // Sort by strategic importance (customize this logic as needed)
    const strategicOrder = ["Trap", "Flood", "Drought", "Limit", "Confuse"]
    playableImpactCards.sort((a, b) => {
      const aIndex = strategicOrder.indexOf(a.card.name)
      const bIndex = strategicOrder.indexOf(b.card.name)

      // If both cards are in the strategic order, sort by their order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }
      // If only one card is in the strategic order, prioritize it
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1

      // Default sort - random
      return Math.random() - 0.5
    })

    // 60% chance to play an impact card if we have one with valid targets
    if (Math.random() < 0.6) {
      // Play the highest priority impact card
      return playImpactCard(state, playableImpactCards[0].index, false)
    }
  }

  // Check if AI needs to discard before drawing
  if (state.opponentHand.length >= 5) {
    // Choose cards to discard
    const discardIndices: number[] = []
    const sortedCards = [...state.opponentHand]
      .map((card, index) => ({ card, index }))
      .sort((a, b) => {
        if (a.card.type === "animal" && b.card.type === "animal") {
          return (a.card.points || 0) - (b.card.points || 0)
        }
        return a.card.type === "impact" ? -1 : 1
      })

    // Determine how many cards to discard
    // If hand is full (6 cards), discard 2 cards
    // If hand has 5 cards, discard 1 card
    const discardCount = state.opponentHand.length === 6 ? 2 : 1

    for (let i = 0; i < discardCount; i++) {
      if (i < sortedCards.length) {
        discardIndices.push(sortedCards[i].index)
      }
    }

    // Send cards to bottom
    const afterDiscard = sendCardsToBottom(state, discardIndices, false)

    // Draw cards
    return drawCards(afterDiscard, 2, false)
  }

  // If no good moves and hand isn't full, draw
  return drawCards(state, 2, false)
}

// Handle player's turn end and start AI turn
export function endPlayerTurn(state: GameState): GameState {
  // Update game state for end of turn effects
  let newState = updateGameStateEndOfTurn({
    ...state,
    currentTurn: "opponent",
    message: "AI's turn...",
  })

  // Check if game is over before AI's turn
  newState = checkGameOver(newState)
  if (newState.gameStatus !== "playing") {
    return newState
  }

  return newState
}

// Handle AI's turn end and start player turn
export function endAITurn(state: GameState): GameState {
  // Update game state for end of turn effects
  let newState = updateGameStateEndOfTurn({
    ...state,
    currentTurn: "player",
    message: "Your turn. Draw cards or play a card.",
  })

  // Check if game is over before player's turn
  newState = checkGameOver(newState)

  return newState
}
