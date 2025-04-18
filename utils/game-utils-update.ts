import { applyAnimalEffect } from "./game-effects"
import type { GameState } from "./game-state"

// Update the playAnimalCard function to apply animal effects
export function playAnimalCard(state: GameState, cardIndex: number, forPlayer: boolean): GameState {
  const hand = forPlayer ? state.playerHand : state.opponentHand
  const card = hand[cardIndex]

  if (!card || card.type !== "animal") {
    return state
  }

  // Check if player has already played maximum animals this turn
  if (forPlayer) {
    const animalsPlayedThisTurn = state.effectsThisTurn.playerAnimalsPlayed || 0
    const extraPlays = state.effectsThisTurn.playerExtraPlays || 0

    // If Limit is in effect and player has already played an animal
    if (state.effectsThisTurn.limitInEffect && animalsPlayedThisTurn >= 1 && extraPlays <= 0) {
      return {
        ...state,
        message: "You cannot play more than one animal per turn due to Limit effect.",
      }
    }

    // If player has already played maximum animals (1 by default + any extra plays)
    if (animalsPlayedThisTurn >= 1 + extraPlays) {
      return {
        ...state,
        message: "You cannot play more animals this turn.",
      }
    }
  } else {
    const animalsPlayedThisTurn = state.effectsThisTurn.opponentAnimalsPlayed || 0
    const extraPlays = state.effectsThisTurn.opponentExtraPlays || 0

    // If Limit is in effect and AI has already played an animal
    if (state.effectsThisTurn.limitInEffect && animalsPlayedThisTurn >= 1 && extraPlays <= 0) {
      return {
        ...state,
        message: "AI cannot play more than one animal per turn due to Limit effect.",
      }
    }

    // If AI has already played maximum animals (1 by default + any extra plays)
    if (animalsPlayedThisTurn >= 1 + extraPlays) {
      return {
        ...state,
        message: "AI cannot play more animals this turn.",
      }
    }
  }

  const newHand = [...hand]
  newHand.splice(cardIndex, 1)

  let newState: GameState

  if (forPlayer) {
    newState = {
      ...state,
      playerHand: newHand,
      playerField: [...state.playerField, card],
      playerPoints: state.playerPoints + (card.points || 0),
      effectsThisTurn: {
        ...state.effectsThisTurn,
        playerAnimalsPlayed: (state.effectsThisTurn.playerAnimalsPlayed || 0) + 1,
      },
      message: `You played ${card.name} (${card.points} points).`,
    }
  } else {
    newState = {
      ...state,
      opponentHand: newHand,
      opponentField: [...state.opponentField, card],
      opponentPoints: state.opponentPoints + (card.points || 0),
      effectsThisTurn: {
        ...state.effectsThisTurn,
        opponentAnimalsPlayed: (state.effectsThisTurn.opponentAnimalsPlayed || 0) + 1,
      },
      message: `AI played ${card.name} (${card.points} points).`,
    }
  }

  // Apply the animal's effect if it has one
  if (card.effect) {
    newState = applyAnimalEffect(newState, card, forPlayer)
  }

  return newState
}
