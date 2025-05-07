import type { GameCard, GameState } from "@/types/game"

// Fix the applyAnimalEffect function to properly create pending effects
export function applyAnimalEffect(state: GameState, card: GameCard, forPlayer: boolean): GameState {
  console.log(`Applying animal effect for ${card.name}, forPlayer: ${forPlayer}`)

  // Make a copy of the state to avoid direct mutations
  const newState = { ...state }

  // Special handling for Seahorse
  if (card.name === "Seahorse") {
    console.log(`Applying Seahorse effect, forPlayer: ${forPlayer}`)

    // Calculate how many animals were played before this one this turn
    const animalPlayedCount = forPlayer
      ? state.effectsThisTurn.playerAnimalsPlayed
      : state.effectsThisTurn.opponentAnimalsPlayed

    // Draw 1 card + 1 for each animal played before this one
    const cardsToDraw = 1 + (animalPlayedCount - 1) // -1 because the current animal is already counted
    console.log(`Seahorse will draw ${cardsToDraw} cards (1 base + ${animalPlayedCount - 1} for previous animals)`)

    // Draw the cards
    const stateAfterDraw = drawCards(state, cardsToDraw, forPlayer)

    return {
      ...stateAfterDraw,
      message: `${forPlayer ? "You" : "AI"} drew ${cardsToDraw} card${cardsToDraw !== 1 ? "s" : ""} from Seahorse's effect.`,
    }
  }

  // Set up the pending effect based on the card's effect
  if (card.effect) {
    console.log(`Effect type: ${card.effect.type || card.name.toLowerCase()}`)

    // Special handling for Squirrel
    if (card.name === "Squirrel") {
      console.log(`Creating pending effect for Squirrel, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "squirrel",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: forPlayer ? "opponentHand" : "playerHand",
        resolved: false,
      }
      return newState
    }

    // Special handling for Tuna
    if (card.name === "Tuna") {
      console.log(`Creating pending effect for Tuna, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "tuna",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: forPlayer ? "playerHand" : "opponentHand",
        resolved: false,
      }
      return newState
    }

    // Special handling for Turtle
    if (card.name === "Turtle") {
      console.log(`Creating pending effect for Turtle, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "turtle",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: forPlayer ? "playerHand" : "opponentHand",
        resolved: false,
      }
      return newState
    }

    // Special handling for Crab
    if (card.name === "Crab") {
      console.log(`Creating pending effect for Crab, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "crab",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: "deck",
        resolved: false,
      }
      return newState
    }

    // Special handling for Zebra
    if (card.name === "Zebra") {
      console.log(`Creating pending effect for Zebra, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "zebra",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: forPlayer ? "opponentHand" : "playerHand",
        resolved: false,
      }
      return newState
    }

    // Special handling for Mouse
    if (card.name === "Mouse") {
      console.log(`Creating pending effect for Mouse, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "mouse",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: forPlayer ? "opponentField" : "playerField",
        resolved: false,
      }
      return newState
    }

    // Special handling for Crocodile
    if (card.name === "Crocodile") {
      console.log(`Creating pending effect for Crocodile, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "crocodile",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: forPlayer ? "opponentField" : "playerField",
        resolved: false,
      }
      return newState
    }

    // Special handling for Lion
    if (card.name === "Lion") {
      console.log(`Creating pending effect for Lion, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "lion",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: forPlayer ? "opponentField" : "playerField",
        resolved: false,
      }
      return newState
    }

    // Special handling for Octopus
    if (card.name === "Octopus") {
      console.log(`Creating pending effect for Octopus, forPlayer: ${forPlayer}`)
      newState.pendingEffect = {
        type: "octopus",
        forPlayer: forPlayer,
        requiresTarget: true,
        targetType: "deck",
        resolved: false,
      }
      return newState
    }

    // Create the pending effect
    newState.pendingEffect = {
      type: card.effect.type || card.name.toLowerCase(),
      value: card.effect.value,
      sourceCard: card,
      forPlayer: forPlayer,
      requiresTarget: card.effect.requiresTarget || false,
      targetType: card.effect.targetType || null,
      resolved: false,
    }

    console.log(`Created pending effect:`, newState.pendingEffect)

    // If the effect doesn't require a target, resolve it immediately
    if (!newState.pendingEffect.requiresTarget) {
      console.log(`Effect doesn't require target, resolving immediately`)
      return resolveEffect(newState)
    }
  }

  return newState
}

// Import drawCards function from game-utils
import { drawCards } from "./game-utils"

// Resolve animal effect
export function resolveAnimalEffect(state: GameState, targetIndex: number | number[]): GameState {
  if (!state.pendingEffect) return state

  const { type, forPlayer } = state.pendingEffect

  switch (type) {
    case "mouse":
      if (forPlayer) {
        // Player targeting opponent's terrestrial animal
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || (targetCard.environment !== "terrestrial" && targetCard.environment !== "amphibian"))
          return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)
        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDeck: [targetCard, ...state.sharedDeck],
          pendingEffect: null,
          message: `You sent the opponent's ${targetCard.name} to the top of the deck.`,
        }
      } else {
        // AI targeting player's terrestrial animal
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard || (targetCard.environment !== "terrestrial" && targetCard.environment !== "amphibian"))
          return state

        const newPlayerField = [...state.playerField]
        newPlayerField.splice(targetIndex as number, 1)
        return {
          ...state,
          playerField: newPlayerField,
          playerPoints: state.playerPoints - (targetCard.points || 0),
          sharedDeck: [targetCard, ...state.sharedDeck],
          pendingEffect: null,
          message: `AI sent your ${targetCard.name} to the top of the deck.`,
        }
      }

    case "squirrel":
      if (forPlayer) {
        // Player selecting a card from AI's hand to discard
        const targetCard = state.opponentHand[targetIndex as number]
        if (!targetCard) return state

        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(targetIndex as number, 1)

        console.log(`Resolving Squirrel effect: Discarding ${targetCard.name} from opponent's hand`)

        return {
          ...state,
          opponentHand: newOpponentHand,
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `You made the opponent discard ${targetCard.name}.`,
        }
      } else {
        // AI selecting a card from player's hand to discard
        const targetCard = state.playerHand[targetIndex as number]
        if (!targetCard) return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetIndex as number, 1)

        console.log(`Resolving Squirrel effect: AI discarding ${targetCard.name} from player's hand`)

        return {
          ...state,
          playerHand: newPlayerHand,
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `AI made you discard ${targetCard.name}.`,
        }
      }

    case "tuna":
      if (forPlayer) {
        // Player selecting an aquatic animal to play from their hand
        const eligibleAnimals = state.playerHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 3,
        )

        if ((targetIndex as number) >= eligibleAnimals.length) return state

        const targetCard = eligibleAnimals[targetIndex as number]
        const targetHandIndex = state.playerHand.findIndex((c) => c.id === targetCard.id)

        if (targetHandIndex === -1) return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetHandIndex, 1)

        // First add the card to the field
        let tempState = {
          ...state,
          playerHand: newPlayerHand,
          playerField: [...state.playerField, targetCard],
          playerPoints: state.playerPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `You played ${targetCard.name} from your hand.`,
        }

        // Then apply the card's effect if it has one
        if (targetCard.effect) {
          tempState = applyAnimalEffect(tempState, targetCard, true)
        }

        return tempState
      } else {
        // AI selecting an aquatic animal to play from its hand
        const eligibleAnimals = state.opponentHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 3,
        )

        // Fix: Check if there are any eligible animals before proceeding
        if (eligibleAnimals.length === 0) {
          return {
            ...state,
            pendingEffect: null,
            message: `AI played Tuna but had no eligible aquatic animals to play.`,
          }
        }

        // AI chooses the highest value eligible animal
        const targetCard = eligibleAnimals.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
        const targetHandIndex = state.opponentHand.findIndex((c) => c.id === targetCard.id)

        if (targetHandIndex === -1) return state

        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(targetHandIndex, 1)

        // First add the card to the field
        let tempState = {
          ...state,
          opponentHand: newOpponentHand,
          opponentField: [...state.opponentField, targetCard],
          opponentPoints: state.opponentPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `AI played ${targetCard.name} from its hand.`,
        }

        // Then apply the card's effect if it has one
        if (targetCard.effect) {
          tempState = applyAnimalEffect(tempState, targetCard, false)
        }

        return tempState
      }

    case "turtle":
      if (forPlayer) {
        // Player selecting an aquatic animal to play from their hand
        const eligibleAnimals = state.playerHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 2,
        )

        if ((targetIndex as number) >= eligibleAnimals.length) return state

        const targetCard = eligibleAnimals[targetIndex as number]
        const targetHandIndex = state.playerHand.findIndex((c) => c.id === targetCard.id)

        if (targetHandIndex === -1) return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetHandIndex, 1)

        // First add the card to the field
        let tempState = {
          ...state,
          playerHand: newPlayerHand,
          playerField: [...state.playerField, targetCard],
          playerPoints: state.playerPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `You played ${targetCard.name} from your hand.`,
        }

        // Then apply the card's effect if it has one
        if (targetCard.effect) {
          tempState = applyAnimalEffect(tempState, targetCard, true)
        }

        return tempState
      } else {
        // AI selecting an aquatic animal to play from its hand
        const eligibleAnimals = state.opponentHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 2,
        )

        // Fix: Check if there are any eligible animals before proceeding
        if (eligibleAnimals.length === 0) {
          return {
            ...state,
            pendingEffect: null,
            message: `AI played Turtle but had no eligible aquatic animals to play.`,
          }
        }

        // AI chooses the highest value eligible animal
        const targetCard = eligibleAnimals.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
        const targetHandIndex = state.opponentHand.findIndex((c) => c.id === targetCard.id)

        if (targetHandIndex === -1) return state

        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(targetHandIndex, 1)

        // First add the card to the field
        let tempState = {
          ...state,
          opponentHand: newOpponentHand,
          opponentField: [...state.opponentField, targetCard],
          opponentPoints: state.opponentPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `AI played ${targetCard.name} from its hand.`,
        }

        // Then apply the card's effect if it has one
        if (targetCard.effect) {
          tempState = applyAnimalEffect(tempState, targetCard, false)
        }

        return tempState
      }

    case "crab":
      if (forPlayer) {
        // Player selecting a card from the top 2 cards of the deck
        const topCards = state.sharedDeck.slice(0, Math.min(2, state.sharedDeck.length))
        if ((targetIndex as number) >= topCards.length) return state

        const selectedCard = topCards[targetIndex as number]
        const otherCards = topCards.filter((_, i) => i !== targetIndex)

        return {
          ...state,
          playerHand: [...state.playerHand, selectedCard],
          sharedDeck: [...state.sharedDeck.slice(topCards.length), ...otherCards],
          pendingEffect: null,
          message: `You added ${selectedCard.name} to your hand and sent the other card to the bottom of the deck.`,
        }
      } else {
        // AI selecting a card from the top 2 cards of the deck
        const topCards = state.sharedDeck.slice(0, Math.min(2, state.sharedDeck.length))
        if (topCards.length === 0) return state

        // AI prefers animal cards with higher points
        const sortedCards = [...topCards].sort((a, b) => {
          if (a.type === "animal" && b.type === "animal") {
            return (b.points || 0) - (a.points || 0)
          }
          return a.type === "animal" ? -1 : 1
        })

        const selectedCard = sortedCards[0]
        const otherCards = topCards.filter((c) => c.id !== selectedCard.id)

        return {
          ...state,
          opponentHand: [...state.opponentHand, selectedCard],
          sharedDeck: [...state.sharedDeck.slice(topCards.length), ...otherCards],
          pendingEffect: null,
          message: `AI added a card to its hand and sent the other card to the bottom of the deck.`,
        }
      }

    case "crocodile":
      if (forPlayer) {
        // Player targeting opponent's animal with 3 or fewer points
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || (targetCard.points || 0) > 3) return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)
        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDeck: [...state.sharedDeck, targetCard],
          pendingEffect: null,
          message: `You sent the opponent's ${targetCard.name} to the bottom of the deck.`,
        }
      } else {
        // AI targeting player's animal with 3 or fewer points
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard || (targetCard.points || 0) > 3) return state

        const newPlayerField = [...state.playerField]
        newPlayerField.splice(targetIndex as number, 1)
        return {
          ...state,
          playerField: newPlayerField,
          playerPoints: state.playerPoints - (targetCard.points || 0),
          sharedDeck: [...state.sharedDeck, targetCard],
          pendingEffect: null,
          message: `AI sent your ${targetCard.name} to the bottom of the deck.`,
        }
      }

    case "lion":
      if (forPlayer) {
        // Player targeting opponent's animal with 4+ points
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || (targetCard.points || 0) < 4) return state

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
      } else {
        // AI targeting player's animal with 4+ points
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard || (targetCard.points || 0) < 4) return state

        const newPlayerField = [...state.playerField]
        newPlayerField.splice(targetIndex as number, 1)
        return {
          ...state,
          playerField: newPlayerField,
          playerPoints: state.playerPoints - (targetCard.points || 0),
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `AI destroyed your ${targetCard.name}.`,
        }
      }

    // Add the Prey card effect resolution
    case "prey":
      if (forPlayer) {
        // Player selecting one of their animals as the predator
        const predatorCard = state.playerField[targetIndex as number]
        if (!predatorCard) return state

        // Find all opponent animals of the same environment with fewer points
        const preyCards = state.opponentField.filter(
          (card) => card.environment === predatorCard.environment && (card.points || 0) < (predatorCard.points || 0),
        )

        if (preyCards.length === 0) {
          return {
            ...state,
            pendingEffect: null,
            message: `You selected ${predatorCard.name} as the predator, but there are no prey animals to target.`,
          }
        }

        // Create a new opponent field without the prey cards
        const newOpponentField = state.opponentField.filter(
          (card) => card.environment !== predatorCard.environment || (card.points || 0) >= (predatorCard.points || 0),
        )

        // Calculate new opponent points
        const newOpponentPoints = newOpponentField.reduce((sum, card) => sum + (card.points || 0), 0)

        // Send prey cards to the bottom of the deck
        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: newOpponentPoints,
          sharedDeck: [...state.sharedDeck, ...preyCards],
          pendingEffect: null,
          message: `Your ${predatorCard.name} preyed on ${preyCards.length} ${predatorCard.environment} animal${preyCards.length !== 1 ? "s" : ""} with fewer points.`,
        }
      } else {
        // AI selecting one of its animals as the predator
        // AI should choose the animal that will remove the most points from the player
        const aiField = state.opponentField

        // Find the best predator by calculating potential prey for each animal
        let bestPredator = -1
        let maxPointsRemoved = 0

        for (let i = 0; i < aiField.length; i++) {
          const predator = aiField[i]
          const potentialPrey = state.playerField.filter(
            (card) => card.environment === predator.environment && (card.points || 0) < (predator.points || 0),
          )

          const pointsRemoved = potentialPrey.reduce((sum, card) => sum + (card.points || 0), 0)

          if (pointsRemoved > maxPointsRemoved) {
            maxPointsRemoved = pointsRemoved
            bestPredator = i
          }
        }

        // If no good predator was found, just pick the highest point animal
        if (bestPredator === -1 || maxPointsRemoved === 0) {
          return {
            ...state,
            pendingEffect: null,
            message: `AI played Prey but found no advantageous targets.`,
          }
        }

        const predatorCard = aiField[bestPredator]

        // Find all player animals of the same environment with fewer points
        const preyCards = state.playerField.filter(
          (card) => card.environment === predatorCard.environment && (card.points || 0) < (predatorCard.points || 0),
        )

        // Create a new player field without the prey cards
        const newPlayerField = state.playerField.filter(
          (card) => card.environment !== predatorCard.environment || (card.points || 0) >= (predatorCard.points || 0),
        )

        // Calculate new player points
        const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)

        // Send prey cards to the bottom of the deck
        return {
          ...state,
          playerField: newPlayerField,
          playerPoints: newPlayerPoints,
          sharedDeck: [...state.sharedDeck, ...preyCards],
          pendingEffect: null,
          message: `AI's ${predatorCard.name} preyed on ${preyCards.length} of your ${predatorCard.environment} animal${preyCards.length !== 1 ? "s" : ""} with fewer points.`,
        }
      }

    // Add other animal effect resolutions as needed
    default:
      return {
        ...state,
        pendingEffect: null,
        message: "Effect resolved.",
      }
  }
}

// Fix the resolveEffect function to properly handle effect resolution
export function resolveEffect(state: GameState): GameState {
  if (!state.pendingEffect || state.pendingEffect.resolved) {
    console.log(`No pending effect to resolve or already resolved`)
    return state
  }

  console.log(`Resolving effect: ${state.pendingEffect.type}`)

  // Make a copy of the state to avoid direct mutations
  const newState = { ...state }
  const effect = newState.pendingEffect

  // Mark the effect as resolved
  effect.resolved = true

  // Apply the effect based on its type
  switch (effect.type) {
    case "dolphin":
      // Draw a card after sending one to the bottom
      if (effect.targetId !== undefined) {
        const targetIndex = Number.parseInt(effect.targetId)
        if (targetIndex >= 0 && targetIndex < state.playerHand.length) {
          const targetCard = state.playerHand[targetIndex]
          const newHand = [...state.playerHand]
          newHand.splice(targetIndex, 1)

          // First send the card to the bottom
          let tempState = {
            ...state,
            playerHand: newHand,
            sharedDeck: [...state.sharedDeck, targetCard],
            message: `You sent ${targetCard.name} to the bottom of the deck.`,
          }

          // Then draw a card
          if (tempState.sharedDeck.length > 0) {
            const drawnCard = tempState.sharedDeck[0]
            tempState = {
              ...tempState,
              playerHand: [...tempState.playerHand, drawnCard],
              sharedDeck: tempState.sharedDeck.slice(1),
              message: `You sent ${targetCard.name} to the bottom of the deck and drew ${drawnCard.name}.`,
            }
          }

          return {
            ...tempState,
            pendingEffect: null,
          }
        }
      }
      break

    // Add other effect cases as needed
  }

  console.log(`Effect resolved, clearing pendingEffect`)
  // Clear the pending effect
  newState.pendingEffect = null

  return newState
}

// Update game state at the end of a turn
export function updateGameStateEndOfTurn(state: GameState): GameState {
  // Reset per-turn effect counters
  const newEffectsThisTurn = {
    playerAnimalsPlayed: 0,
    opponentAnimalsPlayed: 0,
    playerCardsDrawn: 0,
    opponentCardsDrawn: 0,
    playerExtraDraws: 0,
    opponentExtraPlays: 0,
    limitInEffect: state.effectsThisTurn.limitInEffect,
    droughtInEffect: state.effectsThisTurn.droughtInEffect,
  }

  // Update persistent effects
  const newPersistentEffects = { ...state.persistentEffects }

  // Decrement limit effect duration
  if (newPersistentEffects.limitUntilTurn !== undefined) {
    newPersistentEffects.limitUntilTurn -= 1
    if (newPersistentEffects.limitUntilTurn <= 0) {
      newPersistentEffects.limitUntilTurn = undefined
      newEffectsThisTurn.limitInEffect = false
    }
  }

  return {
    ...state,
    effectsThisTurn: newEffectsThisTurn,
    persistentEffects: newPersistentEffects,
  }
}
