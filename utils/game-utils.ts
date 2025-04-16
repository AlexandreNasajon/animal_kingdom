import type { GameCard, GameState } from "@/types/game"
import { GAME_DECK } from "@/types/game"

// Shuffle an array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Initialize a new game
export function initializeGame(): GameState {
  const shuffledDeck = shuffleArray(GAME_DECK)

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
  }
}

// Draw cards from the deck
export function drawCards(state: GameState, count: number, forPlayer: boolean): GameState {
  if (state.sharedDeck.length < count) {
    // Not enough cards in deck
    return {
      ...state,
      message: "Not enough cards in the deck!",
    }
  }

  const newDeck = [...state.sharedDeck]
  const drawnCards = newDeck.splice(0, count)

  if (forPlayer) {
    return {
      ...state,
      playerHand: [...state.playerHand, ...drawnCards],
      sharedDeck: newDeck,
      message: `You drew ${count} cards.`,
    }
  } else {
    return {
      ...state,
      opponentHand: [...state.opponentHand, ...drawnCards],
      sharedDeck: newDeck,
      message: `AI drew ${count} cards.`,
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

  if (forPlayer) {
    return {
      ...state,
      playerHand: newHand,
      playerField: [...state.playerField, card],
      playerPoints: state.playerPoints + (card.points || 0),
      message: `You played ${card.name} (${card.points} points).`,
    }
  } else {
    return {
      ...state,
      opponentHand: newHand,
      opponentField: [...state.opponentField, card],
      opponentPoints: state.opponentPoints + (card.points || 0),
      message: `AI played ${card.name} (${card.points} points).`,
    }
  }
}

// Play an impact card
export function playImpactCard(state: GameState, cardIndex: number, forPlayer: boolean): GameState {
  const hand = forPlayer ? state.playerHand : state.opponentHand
  const card = hand[cardIndex]

  if (!card || card.type !== "impact") {
    return state
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

      case "Scare":
        // Check if there are any animals on the field
        if (state.opponentField.length > 0 || state.playerField.length > 0) {
          return {
            ...newState,
            pendingEffect: {
              type: "scare",
              forPlayer: true,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Scare, but there are no animals on the field.",
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
        // Each player sends 2 animals from their field to the bottom
        const playerField = [...state.playerField]
        const opponentField = [...state.opponentField]
        let playerPoints = state.playerPoints
        let opponentPoints = state.opponentPoints
        let cardsToBottom: GameCard[] = []

        // Process player's field
        if (playerField.length > 0) {
          const count = Math.min(2, playerField.length)
          const removed = playerField.splice(0, count)
          cardsToBottom = [...cardsToBottom, ...removed]
          playerPoints -= removed.reduce((sum, card) => sum + (card.points || 0), 0)
        }

        // Process opponent's field
        if (opponentField.length > 0) {
          const count = Math.min(2, opponentField.length)
          const removed = opponentField.splice(0, count)
          cardsToBottom = [...cardsToBottom, ...removed]
          opponentPoints -= removed.reduce((sum, card) => sum + (card.points || 0), 0)
        }

        return {
          ...newState,
          playerField,
          opponentField,
          playerPoints,
          opponentPoints,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          message: `You played Flood. Each player sent up to 2 animals to the bottom of the deck.`,
        }

      case "Release":
        // Play up to 2 animals from your hand
        if (newState.playerHand.some((c) => c.type === "animal")) {
          return {
            ...newState,
            pendingEffect: {
              type: "release",
              forPlayer: true,
              animalsPlayed: 0,
            },
          }
        } else {
          return {
            ...newState,
            message: "You played Release, but you have no animal cards in your hand.",
          }
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

      case "Scare":
        // Send 1 animal from the field to the top of the deck
        if (state.playerField.length > 0) {
          // Find the highest value animal in player's field
          const targetIndex = state.playerField
            .map((c, i) => ({ card: c, index: i }))
            .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

          const targetCard = state.playerField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          return {
            ...newState,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDeck: [targetCard, ...state.sharedDeck], // Add to top of deck
            message: `AI played Scare and sent your ${targetCard.name} to the top of the deck.`,
          }
        } else {
          return {
            ...newState,
            message: "AI played Scare, but there are no animals to target.",
          }
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

      case "Flood":
        // Each player sends 2 animals from their field to the bottom
        const playerField = [...state.playerField]
        const opponentField = [...state.opponentField]
        let playerPoints = state.playerPoints
        let opponentPoints = state.opponentPoints
        let cardsToBottom: GameCard[] = []

        // Process player's field - AI strategically removes player's highest point cards
        if (playerField.length > 0) {
          const count = Math.min(2, playerField.length)
          // Sort by points (highest first) and remove the top ones
          const sortedPlayerField = [...playerField].sort((a, b) => (b.points || 0) - (a.points || 0))
          const removedCards = sortedPlayerField.slice(0, count)

          // Remove these cards from the player's field
          for (const card of removedCards) {
            const index = playerField.findIndex((c) => c.id === card.id)
            if (index !== -1) {
              playerField.splice(index, 1)
            }
          }

          cardsToBottom = [...cardsToBottom, ...removedCards]
          playerPoints -= removedCards.reduce((sum, card) => sum + (card.points || 0), 0)
        }

        // Process opponent's field - AI strategically removes its lowest point cards
        if (opponentField.length > 0) {
          const count = Math.min(2, opponentField.length)
          // Sort by points (lowest first) and remove the bottom ones
          const sortedOpponentField = [...opponentField].sort((a, b) => (a.points || 0) - (b.points || 0))
          const removedCards = sortedOpponentField.slice(0, count)

          // Remove these cards from the opponent's field
          for (const card of removedCards) {
            const index = opponentField.findIndex((c) => c.id === card.id)
            if (index !== -1) {
              opponentField.splice(index, 1)
            }
          }

          cardsToBottom = [...cardsToBottom, ...removedCards]
          opponentPoints -= removedCards.reduce((sum, card) => sum + (card.points || 0), 0)
        }

        return {
          ...newState,
          playerField,
          opponentField,
          playerPoints,
          opponentPoints,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          message: `AI played Flood. Each player sent up to 2 animals to the bottom of the deck.`,
        }

      // Implement other AI card effects with improved strategy
      default:
        return newState
    }
  }
}

// Handle effect resolution
export function resolveEffect(state: GameState, targetIndex: number | number[]): GameState {
  if (!state.pendingEffect || !state.pendingEffect.type) return state

  const { type, forPlayer } = state.pendingEffect

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

    case "scare":
      // Send 1 animal from the field to the top of the deck
      // targetIndex refers to the combined array of [playerField, opponentField]
      const playerFieldLength = state.playerField.length
      const totalFieldLength = playerFieldLength + state.opponentField.length
      const singleTargetIndex = targetIndex as number

      if (singleTargetIndex >= 0 && singleTargetIndex < totalFieldLength) {
        let targetCard: GameCard
        const newPlayerField = [...state.playerField]
        const newOpponentField = [...state.opponentField]
        let newPlayerPoints = state.playerPoints
        let newOpponentPoints = state.opponentPoints

        if (singleTargetIndex < playerFieldLength) {
          // Target is in player's field
          targetCard = state.playerField[singleTargetIndex]
          newPlayerField.splice(singleTargetIndex, 1)
          newPlayerPoints -= targetCard.points || 0
        } else {
          // Target is in opponent's field
          const opponentIndex = singleTargetIndex - playerFieldLength
          targetCard = state.opponentField[opponentIndex]
          newOpponentField.splice(opponentIndex, 1)
          newOpponentPoints -= targetCard.points || 0
        }

        return {
          ...state,
          playerField: newPlayerField,
          opponentField: newOpponentField,
          playerPoints: newPlayerPoints,
          opponentPoints: newOpponentPoints,
          sharedDeck: [targetCard, ...state.sharedDeck], // Add to top of deck
          pendingEffect: null,
          message: `${targetCard.name} was sent to the top of the deck.`,
        }
      }
      // If we reach here, the target index is invalid, but we'll keep the effect pending
      return state

    case "veterinarian":
      // Play an animal card from the discard pile
      const discardAnimals = state.sharedDiscard.filter((card) => card.type === "animal")
      if ((targetIndex as number) >= 0 && (targetIndex as number) < discardAnimals.length) {
        const targetCard = discardAnimals[targetIndex as number]
        const newDiscard = state.sharedDiscard.filter((card) => card.id !== targetCard.id)

        if (forPlayer) {
          // Fixed: Add the animal to player's field and update points
          return {
            ...state,
            playerField: [...state.playerField, targetCard],
            playerPoints: state.playerPoints + (targetCard.points || 0),
            sharedDiscard: newDiscard,
            pendingEffect: null,
            message: `You played ${targetCard.name} from the discard pile.`,
          }
        }
      }
      break

    case "limit":
      // Destroy 1 animal on opponent's field
      if (forPlayer) {
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
          message: `You destroyed the opponent's ${targetCard.name} with Limit.`,
        }
      }
      break

    case "confuse":
      // Handle exchange of two animals
      if (Array.isArray(targetIndex) && targetIndex.length === 2) {
        const firstIndex = targetIndex[0]
        const secondIndex = targetIndex[1]

        // Determine which fields the animals are in
        const playerFieldLength = state.playerField.length

        if (firstIndex >= 0 && firstIndex < playerFieldLength && secondIndex >= playerFieldLength) {
          // First card is from player's field, second is from opponent's field
          const newPlayerField = [...state.playerField]
          const newOpponentField = [...state.opponentField]
          let newPlayerPoints = state.playerPoints
          let newOpponentPoints = state.opponentPoints

          // Get first card (player's) and remove from original field
          const firstCard = state.playerField[firstIndex]
          newPlayerField.splice(firstIndex, 1)
          newPlayerPoints -= firstCard.points || 0

          // Get second card (opponent's) and remove from original field
          const opponentIndex = secondIndex - playerFieldLength
          const secondCard = state.opponentField[opponentIndex]
          newOpponentField.splice(opponentIndex, 1)
          newOpponentPoints -= secondCard.points || 0

          // Add cards to their new fields
          newOpponentField.push(firstCard)
          newPlayerField.push(secondCard)
          newOpponentPoints += firstCard.points || 0
          newPlayerPoints += secondCard.points || 0

          return {
            ...state,
            playerField: newPlayerField,
            opponentField: newOpponentField,
            playerPoints: newPlayerPoints,
            opponentPoints: newOpponentPoints,
            pendingEffect: null,
            message: `You exchanged control of ${firstCard.name} and ${secondCard.name}.`,
          }
        }
      }
      // If we reach here, the target indices are invalid
      return state

    case "domesticate":
      // Gain control of an animal worth 2 points
      if (forPlayer) {
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
        // When player uses trap, AI gives an animal
        // For now, we'll make AI give the lowest point value animal
        const sortedAICards = state.opponentField
          .map((card, idx) => ({ card, idx }))
          .sort((a, b) => (a.card.points || 0) - (b.card.points || 0))

        const aiChoiceIndex = sortedAICards[0].idx
        const targetCard = state.opponentField[aiChoiceIndex]

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(aiChoiceIndex, 1)

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
        // AI played trap, player chooses which animal to give
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

    case "cage":
      // First select an animal from your field to send to the discard pile
      if (forPlayer) {
        if (!state.pendingEffect.firstSelection) {
          // First selection: animal from field to send to discard pile
          const targetCard = state.playerField[targetIndex as number]
          if (!targetCard) return state

          // Remove the card from field
          const newField = [...state.playerField]
          newField.splice(targetIndex as number, 1)

          return {
            ...state,
            playerField: newField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            pendingEffect: {
              type: "cage",
              forPlayer: true,
              firstSelection: targetCard.id,
            },
            sharedDiscard: [...state.sharedDiscard, targetCard], // Send to discard pile
            message: `You sent ${targetCard.name} to the discard pile. Now select an opponent's animal to gain control of.`,
          }
        } else {
          // Second selection: animal on the opponent's field to gain control of
          const targetCard = state.opponentField[targetIndex as number]
          if (!targetCard) return state

          // Remove the card from opponent's field
          const newOpponentField = [...state.opponentField]
          newOpponentField.splice(targetIndex as number, 1)

          // Add the card to player's field and update points
          return {
            ...state,
            playerField: [...state.playerField, targetCard],
            opponentField: newOpponentField,
            playerPoints: state.playerPoints + (targetCard.points || 0),
            opponentPoints: state.opponentPoints - (targetCard.points || 0),
            pendingEffect: null,
            message: `You caged and gained control of ${targetCard.name}.`,
          }
        }
      }
      break

    case "epidemic":
      // Send 1 animal to the bottom along with all animals of same environment with more points
      if (forPlayer) {
        // Fixed: For epidemic, we're only selecting from player's field
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard) return state

        const targetEnvironment = targetCard.environment
        if (!targetEnvironment) return state

        // Find all animals of the same environment with more points
        // Modified to handle amphibians properly
        const playerCardsToRemove = state.playerField.filter((card) => {
          // If target is amphibian, it affects both terrestrial and aquatic
          if (targetEnvironment === "amphibian") {
            return (
              (card.environment === "terrestrial" ||
                card.environment === "aquatic" ||
                card.environment === "amphibian") &&
              (card.points || 0) > (targetCard.points || 0) &&
              card !== targetCard
            )
          }
          // If target is terrestrial or aquatic, it also affects amphibians
          return (
            (card.environment === targetEnvironment || card.environment === "amphibian") &&
            (card.points || 0) > (targetCard.points || 0) &&
            card !== targetCard
          )
        })

        const opponentCardsToRemove = state.opponentField.filter((card) => {
          // If target is amphibian, it affects both terrestrial and aquatic
          if (targetEnvironment === "amphibian") {
            return (
              (card.environment === "terrestrial" ||
                card.environment === "aquatic" ||
                card.environment === "amphibian") &&
              (card.points || 0) > (targetCard.points || 0)
            )
          }
          // If target is terrestrial or aquatic, it also affects amphibians
          return (
            (card.environment === targetEnvironment || card.environment === "amphibian") &&
            (card.points || 0) > (targetCard.points || 0)
          )
        })

        // Also remove the target card
        const newPlayerField = state.playerField.filter(
          (card) => !(card === targetCard || playerCardsToRemove.includes(card)),
        )
        const newOpponentField = state.opponentField.filter((card) => !opponentCardsToRemove.includes(card))

        // Calculate point changes
        const playerPointsChange = playerCardsToRemove.reduce(
          (sum, card) => sum - (card.points || 0),
          -(targetCard.points || 0), // Include target card in point calculation
        )
        const opponentPointsChange = opponentCardsToRemove.reduce((sum, card) => sum - (card.points || 0), 0)

        // Combine all cards to send to bottom
        const cardsToBottom = [targetCard, ...playerCardsToRemove, ...opponentCardsToRemove]

        return {
          ...state,
          playerField: newPlayerField,
          opponentField: newOpponentField,
          playerPoints: state.playerPoints + playerPointsChange,
          opponentPoints: state.opponentPoints + opponentPointsChange,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          pendingEffect: null,
          message: `You played Epidemic. ${targetCard.name} and all ${targetEnvironment} animals with more points were sent to the bottom of the deck.`,
        }
      }
      break

    case "compete":
      // Send 1 animal from your hand to the bottom along with all animals of same points
      if (forPlayer) {
        const targetCard = state.playerHand[targetIndex as number]
        if (!targetCard || targetCard.type !== "animal") return state

        const targetPoints = targetCard.points || 0

        // Remove the target card from hand
        const newHand = [...state.playerHand]
        newHand.splice(targetIndex as number, 1)

        // Find all animals on the field with the same points
        const playerCardsToRemove = state.playerField.filter((card) => (card.points || 0) === targetPoints)
        const opponentCardsToRemove = state.opponentField.filter((card) => (card.points || 0) === targetPoints)

        // Create new fields without the removed cards
        const newPlayerField = state.playerField.filter((card) => !playerCardsToRemove.includes(card))
        const newOpponentField = state.opponentField.filter((card) => !opponentCardsToRemove.includes(card))

        // Calculate point changes
        const playerPointsChange = playerCardsToRemove.reduce((sum, card) => sum - (card.points || 0), 0)
        const opponentPointsChange = opponentCardsToRemove.reduce((sum, card) => sum - (card.points || 0), 0)

        // Combine all cards to send to bottom
        const cardsToBottom = [targetCard, ...playerCardsToRemove, ...opponentCardsToRemove]

        return {
          ...state,
          playerHand: newHand,
          playerField: newPlayerField,
          opponentField: newOpponentField,
          playerPoints: state.playerPoints + playerPointsChange,
          opponentPoints: state.opponentPoints + opponentPointsChange,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          pendingEffect: null,
          message: `You played Compete. ${targetCard.name} and all animals worth ${targetPoints} points were sent to the bottom of the deck.`,
        }
      }
      break

    case "prey":
      // Choose 1 animal on your field. Send all animals of same environment with fewer points to the bottom
      if (forPlayer) {
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard) return state

        const targetEnvironment = targetCard.environment
        const targetPoints = targetCard.points || 0

        if (!targetEnvironment) return state

        // Find all animals of the same environment with fewer points
        // Modified to handle amphibians properly
        const playerCardsToRemove = state.playerField.filter((card) => {
          // If target is amphibian, it affects both terrestrial and aquatic
          if (targetEnvironment === "amphibian") {
            return (
              (card.environment === "terrestrial" ||
                card.environment === "aquatic" ||
                card.environment === "amphibian") &&
              (card.points || 0) < targetPoints &&
              card !== targetCard
            )
          }
          // If target is terrestrial or aquatic, it also affects amphibians
          return (
            (card.environment === targetEnvironment || card.environment === "amphibian") &&
            (card.points || 0) < targetPoints &&
            card !== targetCard
          )
        })

        const opponentCardsToRemove = state.opponentField.filter((card) => {
          // If target is amphibian, it affects both terrestrial and aquatic
          if (targetEnvironment === "amphibian") {
            return (
              (card.environment === "terrestrial" ||
                card.environment === "aquatic" ||
                card.environment === "amphibian") &&
              (card.points || 0) < targetPoints
            )
          }
          // If target is terrestrial or aquatic, it also affects amphibians
          return (
            (card.environment === targetEnvironment || card.environment === "amphibian") &&
            (card.points || 0) < targetPoints
          )
        })

        // Create new fields without the removed cards
        const newPlayerField = state.playerField.filter((card) => !playerCardsToRemove.includes(card))
        const newOpponentField = state.opponentField.filter((card) => !opponentCardsToRemove.includes(card))

        // Calculate point changes
        const playerPointsChange = playerCardsToRemove.reduce((sum, card) => sum - (card.points || 0), 0)
        const opponentPointsChange = opponentCardsToRemove.reduce((sum, card) => sum - (card.points || 0), 0)

        // Combine all cards to send to bottom
        const cardsToBottom = [...playerCardsToRemove, ...opponentCardsToRemove]

        return {
          ...state,
          playerField: newPlayerField,
          opponentField: newOpponentField,
          playerPoints: state.playerPoints + playerPointsChange,
          opponentPoints: state.opponentPoints + opponentPointsChange,
          sharedDeck: [...state.sharedDeck, ...cardsToBottom],
          pendingEffect: null,
          message: `You played Prey. All ${targetEnvironment} animals with fewer points than ${targetCard.name} were sent to the bottom of the deck.`,
        }
      }
      break

    case "cage":
      // First select an animal from your field to send to the discard pile
      if (forPlayer) {
        if (!state.pendingEffect.firstSelection) {
          // First selection: animal from field to send to discard pile
          const targetCard = state.playerField[targetIndex as number]
          if (!targetCard) return state

          // Remove the card from field
          const newField = [...state.playerField]
          newField.splice(targetIndex as number, 1)

          return {
            ...state,
            playerField: newField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            pendingEffect: {
              type: "cage",
              forPlayer: true,
              firstSelection: targetCard.id,
            },
            sharedDiscard: [...state.sharedDiscard, targetCard], // Send to discard pile
            message: `You sent ${targetCard.name} to the discard pile. Now select an opponent's animal to gain control of.`,
          }
        } else {
          // Second selection: animal on the opponent's field to gain control of
          const targetCard = state.opponentField[targetIndex as number]
          if (!targetCard) return state

          // Remove the card from opponent's field
          const newOpponentField = [...state.opponentField]
          newOpponentField.splice(targetIndex as number, 1)

          // Add the card to player's field and update points
          return {
            ...state,
            playerField: [...state.playerField, targetCard],
            opponentField: newOpponentField,
            playerPoints: state.playerPoints + (targetCard.points || 0),
            opponentPoints: state.opponentPoints - (targetCard.points || 0),
            pendingEffect: null,
            message: `You caged and gained control of ${targetCard.name}.`,
          }
        }
      }
      break

    // Add more effect resolutions as needed
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
  // DEFENSIVE STRATEGY: If player is close to winning (6+ points), prioritize removing their animals
  if (state.playerPoints >= 6) {
    // Check for impact cards that can remove player's animals
    const hunterIndex = state.opponentHand.findIndex(
      (card) =>
        card.name === "Hunter" &&
        state.playerField.some((field) => field.environment === "terrestrial" || field.environment === "amphibian"),
    )

    if (hunterIndex !== -1) {
      return playImpactCard(state, hunterIndex, false)
    }

    const fisherIndex = state.opponentHand.findIndex(
      (card) =>
        card.name === "Fisher" &&
        state.playerField.some((field) => field.environment === "aquatic" || field.environment === "amphibian"),
    )

    if (fisherIndex !== -1) {
      return playImpactCard(state, fisherIndex, false)
    }

    // Try to use Scare to send a high-value animal back to the deck
    const scareIndex = state.opponentHand.findIndex((card) => card.name === "Scare")
    if (scareIndex !== -1 && state.playerField.some((card) => (card.points || 0) >= 2)) {
      return playImpactCard(state, scareIndex, false)
    }

    // Try to use Earthquake if player has high-value animals
    const earthquakeIndex = state.opponentHand.findIndex((card) => card.name === "Earthquake")
    if (earthquakeIndex !== -1 && state.playerField.some((card) => (card.points || 0) >= 3)) {
      return playImpactCard(state, earthquakeIndex, false)
    }

    // Try to use any impact card that might help
    const anyImpactIndex = state.opponentHand.findIndex((card) => card.type === "impact")
    if (anyImpactIndex !== -1) {
      return playImpactCard(state, anyImpactIndex, false)
    }
  }

  // WINNING STRATEGY: If AI can win by playing an animal card
  const winningAnimalIndex = state.opponentHand.findIndex(
    (card) => card.type === "animal" && (card.points || 0) + state.opponentPoints >= 7,
  )

  if (winningAnimalIndex !== -1) {
    // Play the winning animal card
    return playAnimalCard(state, winningAnimalIndex, false)
  }

  // BUILDING STRATEGY: Play high-value animals to build points
  // Check if there's a high-value animal card to play (3+ points)
  const highValueAnimalIndex = state.opponentHand.findIndex((card) => card.type === "animal" && (card.points || 0) >= 3)
  if (highValueAnimalIndex !== -1) {
    return playAnimalCard(state, highValueAnimalIndex, false)
  }

  // OPPORTUNISTIC STRATEGY: Use Veterinarian if there's a good animal in discard
  const veterinarianIndex = state.opponentHand.findIndex((card) => card.name === "Veterinarian")
  if (
    veterinarianIndex !== -1 &&
    state.sharedDiscard.some((card) => card.type === "animal" && (card.points || 0) >= 2)
  ) {
    return playImpactCard(state, veterinarianIndex, false)
  }

  // TACTICAL STRATEGY: Play medium-value animals (2 points)
  const mediumValueAnimalIndex = state.opponentHand.findIndex(
    (card) => card.type === "animal" && (card.points || 0) === 2,
  )
  if (mediumValueAnimalIndex !== -1) {
    return playAnimalCard(state, mediumValueAnimalIndex, false)
  }

  // CARD ADVANTAGE STRATEGY: If AI has few cards, try to draw
  if (state.opponentHand.length <= 3 && state.sharedDeck.length >= 2) {
    // Check if AI needs to discard first
    if (state.opponentHand.length >= 5) {
      // AI needs to discard before drawing
      const discardIndices: number[] = []

      // Choose cards to discard (lowest value animals or random impacts)
      if (state.opponentHand.length === 5) {
        // Need to discard 1 card - choose the least valuable
        const lowestValueIndex = state.opponentHand
          .map((card, index) => ({ card, index }))
          .sort((a, b) => {
            if (a.card.type === "animal" && b.card.type === "animal") {
              return (a.card.points || 0) - (b.card.points || 0)
            }
            // Prioritize keeping animals over impact cards when points are low
            if (state.opponentPoints < 4) {
              return a.card.type === "animal" ? 1 : -1
            }
            // Otherwise, keep impact cards that can disrupt the player
            return a.card.type === "impact" ? 1 : -1
          })[0].index

        discardIndices.push(lowestValueIndex)
      } else {
        // Need to discard 2 cards
        const sortedCards = state.opponentHand
          .map((card, index) => ({ card, index }))
          .sort((a, b) => {
            if (a.card.type === "animal" && b.card.type === "animal") {
              return (a.card.points || 0) - (b.card.points || 0)
            }
            // Prioritize keeping animals over impact cards when points are low
            if (state.opponentPoints < 4) {
              return a.card.type === "animal" ? 1 : -1
            }
            // Otherwise, keep impact cards that can disrupt the player
            return a.card.type === "impact" ? 1 : -1
          })

        discardIndices.push(sortedCards[0].index, sortedCards[1].index)
      }

      // Send cards to bottom
      const afterDiscard = sendCardsToBottom(state, discardIndices, false)

      // Now draw
      return drawCards(afterDiscard, 2, false)
    }

    return drawCards(state, 2, false)
  }

  // FALLBACK STRATEGY: Play any animal card
  const anyAnimalIndex = state.opponentHand.findIndex((card) => card.type === "animal")
  if (anyAnimalIndex !== -1) {
    return playAnimalCard(state, anyAnimalIndex, false)
  }

  // If no animal cards, play an impact card
  const anyImpactIndex = state.opponentHand.findIndex((card) => card.type === "impact")
  if (anyImpactIndex !== -1) {
    return playImpactCard(state, anyImpactIndex, false)
  }

  // If no cards to play, draw
  return drawCards(state, 2, false)
}

// Handle player's turn end and start AI turn
export function endPlayerTurn(state: GameState): GameState {
  let newState = {
    ...state,
    currentTurn: "opponent",
    message: "AI's turn...",
  }

  // Check if game is over before AI's turn
  newState = checkGameOver(newState)
  if (newState.gameStatus !== "playing") {
    return newState
  }

  return newState
}

// Handle AI's turn end and start player turn
export function endAITurn(state: GameState): GameState {
  let newState = {
    ...state,
    currentTurn: "player",
    message: "Your turn. Draw cards or play a card.",
  }

  // Check if game is over before player's turn
  newState = checkGameOver(newState)

  return newState
}

export const getAllCards = () => {
  return GAME_DECK
}
