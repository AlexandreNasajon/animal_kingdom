import type { GameCard, GameState } from "@/types/game"

// Apply animal effect after playing the card
export function applyAnimalEffect(state: GameState, card: GameCard, forPlayer: boolean): GameState {
  if (card.type !== "animal") return state

  switch (card.name) {
    case "Mouse":
      // Send a terrestrial animal your opponent controls to the top of the deck
      if (
        (forPlayer &&
          state.opponentField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")) ||
        (!forPlayer && state.playerField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian"))
      ) {
        return {
          ...state,
          pendingEffect: {
            type: "mouse",
            forPlayer,
          },
        }
      }
      return state

    case "Squirrel":
      // Look at your opponent's hand and select a card to be discarded
      if ((forPlayer && state.opponentHand.length > 0) || (!forPlayer && state.playerHand.length > 0)) {
        return {
          ...state,
          pendingEffect: {
            type: "squirrel",
            forPlayer,
          },
        }
      }
      return state

    case "Fox":
      // Your opponent discards a card at random
      if (forPlayer && state.opponentHand.length > 0) {
        // Select a random card from opponent's hand
        const randomIndex = Math.floor(Math.random() * state.opponentHand.length)
        const discardedCard = state.opponentHand[randomIndex]
        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(randomIndex, 1)

        return {
          ...state,
          opponentHand: newOpponentHand,
          sharedDiscard: [...state.sharedDiscard, discardedCard],
          message: `${forPlayer ? "You" : "AI"} played Fox. Your opponent discarded ${discardedCard.name}.`,
        }
      } else if (!forPlayer && state.playerHand.length > 0) {
        // Select a random card from player's hand
        const randomIndex = Math.floor(Math.random() * state.playerHand.length)
        const discardedCard = state.playerHand[randomIndex]
        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(randomIndex, 1)

        return {
          ...state,
          playerHand: newPlayerHand,
          sharedDiscard: [...state.sharedDiscard, discardedCard],
          message: `${forPlayer ? "You" : "AI"} played Fox. Your opponent discarded ${discardedCard.name}.`,
        }
      }
      return state

    case "Snake":
      // Destroy an animal of 1 point your opponent controls
      if (
        (forPlayer && state.opponentField.some((c) => c.points === 1)) ||
        (!forPlayer && state.playerField.some((c) => c.points === 1))
      ) {
        // Find all 1-point animals
        const targetField = forPlayer ? state.opponentField : state.playerField
        const onePointAnimals = targetField.filter((c) => c.points === 1)

        // If there's only one 1-point animal, destroy it immediately
        if (onePointAnimals.length === 1) {
          const targetIndex = targetField.findIndex((c) => c.points === 1)
          const targetCard = targetField[targetIndex]

          if (forPlayer) {
            const newOpponentField = [...state.opponentField]
            newOpponentField.splice(targetIndex, 1)
            return {
              ...state,
              opponentField: newOpponentField,
              opponentPoints: state.opponentPoints - (targetCard.points || 0),
              sharedDiscard: [...state.sharedDiscard, targetCard],
              message: `${forPlayer ? "You" : "AI"} played Snake and destroyed ${targetCard.name}.`,
            }
          } else {
            const newPlayerField = [...state.playerField]
            newPlayerField.splice(targetIndex, 1)
            return {
              ...state,
              playerField: newPlayerField,
              playerPoints: state.playerPoints - (targetCard.points || 0),
              sharedDiscard: [...state.sharedDiscard, targetCard],
              message: `${forPlayer ? "You" : "AI"} played Snake and destroyed ${targetCard.name}.`,
            }
          }
        }
        // If there are multiple 1-point animals, let the player choose
        // For AI, just pick the first one
        else if (!forPlayer) {
          const targetIndex = targetField.findIndex((c) => c.points === 1)
          const targetCard = targetField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)
          return {
            ...state,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDiscard: [...state.sharedDiscard, targetCard],
            message: `${forPlayer ? "You" : "AI"} played Snake and destroyed ${targetCard.name}.`,
          }
        } else {
          // For player, set up target selection
          return {
            ...state,
            pendingEffect: {
              type: "snake",
              forPlayer,
            },
          }
        }
      }
      return state

    case "Zebra":
      // Look at your opponent's hand
      if ((forPlayer && state.opponentHand.length > 0) || (!forPlayer && state.playerHand.length > 0)) {
        return {
          ...state,
          pendingEffect: {
            type: "zebra",
            forPlayer,
          },
        }
      }
      return state

    case "Deer":
      // If you have 7 or more points, your opponent discards 1 card at random
      const playerPoints = forPlayer ? state.playerPoints : state.opponentPoints
      const opponentHand = forPlayer ? state.opponentHand : state.playerHand

      if (playerPoints >= 7 && opponentHand.length > 0) {
        // Select a random card from opponent's hand
        const randomIndex = Math.floor(Math.random() * opponentHand.length)
        const discardedCard = opponentHand[randomIndex]

        if (forPlayer) {
          const newOpponentHand = [...state.opponentHand]
          newOpponentHand.splice(randomIndex, 1)
          return {
            ...state,
            opponentHand: newOpponentHand,
            sharedDiscard: [...state.sharedDiscard, discardedCard],
            message: `${forPlayer ? "You" : "AI"} played Deer and made your opponent discard ${discardedCard.name}.`,
          }
        } else {
          const newPlayerHand = [...state.playerHand]
          newPlayerHand.splice(randomIndex, 1)
          return {
            ...state,
            playerHand: newPlayerHand,
            sharedDiscard: [...state.sharedDiscard, discardedCard],
            message: `${forPlayer ? "You" : "AI"} played Deer and made your opponent discard ${discardedCard.name}.`,
          }
        }
      }
      return state

    case "Wolf":
      // If your opponent has 5 or fewer cards in hand, send 1 terrestrial animal they control to their hand
      const opponentHandCount = forPlayer ? state.opponentHand.length : state.playerHand.length
      const opponentField = forPlayer ? state.opponentField : state.playerField

      if (opponentHandCount <= 5 && opponentField.some((c) => c.environment === "terrestrial")) {
        // For AI, just pick the first terrestrial animal
        if (!forPlayer) {
          const targetIndex = state.playerField.findIndex((c) => c.environment === "terrestrial")
          if (targetIndex !== -1) {
            const targetCard = state.playerField[targetIndex]
            const newPlayerField = [...state.playerField]
            newPlayerField.splice(targetIndex, 1)
            return {
              ...state,
              playerField: newPlayerField,
              playerHand: [...state.playerHand, targetCard],
              playerPoints: state.playerPoints - (targetCard.points || 0),
              message: `${forPlayer ? "You" : "AI"} played Wolf and sent ${targetCard.name} back to your hand.`,
            }
          }
        } else {
          // For player, set up target selection
          return {
            ...state,
            pendingEffect: {
              type: "wolf",
              forPlayer,
            },
          }
        }
      }
      return {
        ...state,
        message: `${forPlayer ? "You" : "AI"} played Wolf, but your opponent has more than 5 cards or no terrestrial animals.`,
      }

    case "Lion":
      // Your opponent discards 2 cards at random
      if (forPlayer && state.opponentHand.length > 0) {
        // Select random cards from opponent's hand
        const discardCount = Math.min(2, state.opponentHand.length)
        const newOpponentHand = [...state.opponentHand]
        const discardedCards: GameCard[] = []

        for (let i = 0; i < discardCount; i++) {
          const randomIndex = Math.floor(Math.random() * newOpponentHand.length)
          const discardedCard = newOpponentHand[randomIndex]
          newOpponentHand.splice(randomIndex, 1)
          discardedCards.push(discardedCard)
        }

        return {
          ...state,
          opponentHand: newOpponentHand,
          sharedDiscard: [...state.sharedDiscard, ...discardedCards],
          message: `${forPlayer ? "You" : "AI"} played Lion. Your opponent discarded ${discardCount} card${discardCount !== 1 ? "s" : ""}.`,
        }
      } else if (!forPlayer && state.playerHand.length > 0) {
        // Select random cards from player's hand
        const discardCount = Math.min(2, state.playerHand.length)
        const newPlayerHand = [...state.playerHand]
        const discardedCards: GameCard[] = []

        for (let i = 0; i < discardCount; i++) {
          const randomIndex = Math.floor(Math.random() * newPlayerHand.length)
          const discardedCard = newPlayerHand[randomIndex]
          newPlayerHand.splice(randomIndex, 1)
          discardedCards.push(discardedCard)
        }

        return {
          ...state,
          playerHand: newPlayerHand,
          sharedDiscard: [...state.sharedDiscard, ...discardedCards],
          message: `${forPlayer ? "You" : "AI"} played Lion. Your opponent discarded ${discardCount} card${discardCount !== 1 ? "s" : ""}.`,
        }
      }
      return state

    case "Tuna":
      // Play an aquatic animal of 3 or fewer points from hand
      const hand = forPlayer ? state.playerHand : state.opponentHand
      const aquaticAnimals = hand.filter(
        (c) =>
          c.type === "animal" && (c.environment === "aquatic" || c.environment === "amphibian") && (c.points || 0) <= 3,
      )

      if (aquaticAnimals.length > 0) {
        // For AI, just play the first valid animal
        if (!forPlayer) {
          const targetCard = aquaticAnimals[0]
          const targetIndex = hand.findIndex((c) => c.id === targetCard.id)
          const newOpponentHand = [...state.opponentHand]
          newOpponentHand.splice(targetIndex, 1)

          return {
            ...state,
            opponentHand: newOpponentHand,
            opponentField: [...state.opponentField, targetCard],
            opponentPoints: state.opponentPoints + (targetCard.points || 0),
            message: `${forPlayer ? "You" : "AI"} played Tuna and then played ${targetCard.name} from hand.`,
          }
        } else {
          // For player, set up target selection
          return {
            ...state,
            pendingEffect: {
              type: "tuna",
              forPlayer,
            },
          }
        }
      }
      return state

    case "Seahorse":
      // Draw 1 card for every animal you played this turn
      const animalsPlayed = forPlayer
        ? state.effectsThisTurn.playerAnimalsPlayed
        : state.effectsThisTurn.opponentAnimalsPlayed

      // Only draw 1 card if this is the only animal played this turn
      const cardsToDrawBase = animalsPlayed === 1 ? 1 : animalsPlayed

      if (cardsToDrawBase > 0 && state.sharedDeck.length > 0) {
        const maxDraw = Math.min(cardsToDrawBase, state.sharedDeck.length)
        const drawnCards = state.sharedDeck.slice(0, maxDraw)
        const newDeck = state.sharedDeck.slice(maxDraw)

        if (forPlayer) {
          // Check if player's hand would exceed 6 cards
          const newHandSize = state.playerHand.length + maxDraw
          const actualDraw = Math.min(maxDraw, 6 - state.playerHand.length)

          if (actualDraw <= 0) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Seahorse but your hand is full.`,
            }
          }

          const actualDrawnCards = drawnCards.slice(0, actualDraw)

          return {
            ...state,
            playerHand: [...state.playerHand, ...actualDrawnCards],
            sharedDeck: [...newDeck, ...drawnCards.slice(actualDraw)],
            message: `${forPlayer ? "You" : "AI"} played Seahorse and drew ${actualDraw} card${actualDraw !== 1 ? "s" : ""}.`,
          }
        } else {
          // Check if AI's hand would exceed 6 cards
          const newHandSize = state.opponentHand.length + maxDraw
          const actualDraw = Math.min(maxDraw, 6 - state.opponentHand.length)

          if (actualDraw <= 0) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Seahorse but your hand is full.`,
            }
          }

          const actualDrawnCards = drawnCards.slice(0, actualDraw)

          return {
            ...state,
            opponentHand: [...state.opponentHand, ...actualDrawnCards],
            sharedDeck: [...newDeck, ...drawnCards.slice(actualDraw)],
            message: `${forPlayer ? "You" : "AI"} played Seahorse and drew ${actualDraw} card${actualDraw !== 1 ? "s" : ""}.`,
          }
        }
      }
      return state

    case "Jellyfish":
      // Draw 1 card
      if (state.sharedDeck.length > 0) {
        const drawnCard = state.sharedDeck[0]
        const newDeck = state.sharedDeck.slice(1)

        if (forPlayer) {
          // Check if player's hand would exceed 6 cards
          if (state.playerHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Jellyfish but your hand is full.`,
            }
          }

          return {
            ...state,
            playerHand: [...state.playerHand, drawnCard],
            sharedDeck: newDeck,
            message: `${forPlayer ? "You" : "AI"} played Jellyfish and drew a card.`,
          }
        } else {
          // Check if AI's hand would exceed 6 cards
          if (state.opponentHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Jellyfish but your hand is full.`,
            }
          }

          return {
            ...state,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `${forPlayer ? "You" : "AI"} played Jellyfish and drew a card.`,
          }
        }
      }
      return state

    case "Turtle":
      // Play an aquatic animal of 2 or fewer points from hand
      const turtleHand = forPlayer ? state.playerHand : state.opponentHand
      const turtleAquaticAnimals = turtleHand.filter(
        (c) =>
          c.type === "animal" && (c.environment === "aquatic" || c.environment === "amphibian") && (c.points || 0) <= 2,
      )

      if (turtleAquaticAnimals.length > 0) {
        // For AI, just play the first valid animal
        if (!forPlayer) {
          const targetCard = turtleAquaticAnimals[0]
          const targetIndex = turtleHand.findIndex((c) => c.id === targetCard.id)
          const newOpponentHand = [...state.opponentHand]
          newOpponentHand.splice(targetIndex, 1)

          return {
            ...state,
            opponentHand: newOpponentHand,
            opponentField: [...state.opponentField, targetCard],
            opponentPoints: state.opponentPoints + (targetCard.points || 0),
            message: `${forPlayer ? "You" : "AI"} played Turtle and then played ${targetCard.name} from hand.`,
          }
        } else {
          // For player, set up target selection
          return {
            ...state,
            pendingEffect: {
              type: "turtle",
              forPlayer,
            },
          }
        }
      }
      return state

    case "Dolphin":
      // You may send 1 card from hand to deck bottom to draw 1 card
      const dolphinHand = forPlayer ? state.playerHand : state.opponentHand

      if (dolphinHand.length > 0 && state.sharedDeck.length > 0) {
        // For AI, just send the first card to the bottom and draw
        if (!forPlayer) {
          const targetCard = dolphinHand[0]
          const newOpponentHand = [...state.opponentHand]
          newOpponentHand.splice(0, 1)

          const drawnCard = state.sharedDeck[0]
          const newDeck = [...state.sharedDeck.slice(1), targetCard]

          return {
            ...state,
            opponentHand: [...newOpponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `${forPlayer ? "You" : "AI"} played Dolphin, sent a card to the bottom of the deck, and drew a card.`,
          }
        } else {
          // For player, set up target selection
          return {
            ...state,
            pendingEffect: {
              type: "dolphin",
              forPlayer,
            },
          }
        }
      }
      return state

    case "Octopus":
      // Look at the top 3 cards of the deck
      if (state.sharedDeck.length > 0) {
        const topCards = state.sharedDeck.slice(0, Math.min(3, state.sharedDeck.length))

        return {
          ...state,
          pendingEffect: {
            type: "octopus",
            forPlayer,
          },
        }
      }
      return state

    case "Stingray":
      // If you have 7 or more points, draw 1 card
      const stingrayPoints = forPlayer ? state.playerPoints : state.opponentPoints

      if (stingrayPoints >= 7 && state.sharedDeck.length > 0) {
        const drawnCard = state.sharedDeck[0]
        const newDeck = state.sharedDeck.slice(1)

        if (forPlayer) {
          // Check if player's hand would exceed 6 cards
          if (state.playerHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Stingray but your hand is full.`,
            }
          }

          return {
            ...state,
            playerHand: [...state.playerHand, drawnCard],
            sharedDeck: newDeck,
            message: `${forPlayer ? "You" : "AI"} played Stingray and drew a card.`,
          }
        } else {
          // Check if AI's hand would exceed 6 cards
          if (state.opponentHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Stingray but your hand is full.`,
            }
          }

          return {
            ...state,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `${forPlayer ? "You" : "AI"} played Stingray and drew a card.`,
          }
        }
      }
      return state

    case "Shark":
      // Draw cards until you have 4
      const sharkHand = forPlayer ? state.playerHand : state.opponentHand
      const cardsToDraw = Math.max(0, 4 - sharkHand.length)

      if (cardsToDraw > 0 && state.sharedDeck.length > 0) {
        const maxDraw = Math.min(cardsToDraw, state.sharedDeck.length)
        const drawnCards = state.sharedDeck.slice(0, maxDraw)
        const newDeck = state.sharedDeck.slice(maxDraw)

        if (forPlayer) {
          return {
            ...state,
            playerHand: [...state.playerHand, ...drawnCards],
            sharedDeck: newDeck,
            message: `${forPlayer ? "You" : "AI"} played Shark and drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`,
          }
        } else {
          return {
            ...state,
            opponentHand: [...state.opponentHand, ...drawnCards],
            sharedDeck: newDeck,
            message: `${forPlayer ? "You" : "AI"} played Shark and drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`,
          }
        }
      }
      return state

    case "Frog":
      // Send the animal with the lowest points your opponent controls to the deck bottom
      const frogTargetField = forPlayer ? state.opponentField : state.playerField

      if (frogTargetField.length > 0) {
        // Find the animal with the lowest points
        const lowestPointsAnimal = [...frogTargetField].sort((a, b) => (a.points || 0) - (b.points || 0))[0]
        const targetIndex = frogTargetField.findIndex((c) => c.id === lowestPointsAnimal.id)

        if (forPlayer) {
          const newOpponentField = [...state.opponentField]
          newOpponentField.splice(targetIndex, 1)

          return {
            ...state,
            opponentField: newOpponentField,
            opponentPoints: state.opponentPoints - (lowestPointsAnimal.points || 0),
            sharedDeck: [...state.sharedDeck, lowestPointsAnimal],
            message: `${forPlayer ? "You" : "AI"} played Frog and sent ${lowestPointsAnimal.name} to the bottom of the deck.`,
          }
        } else {
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          return {
            ...state,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (lowestPointsAnimal.points || 0),
            sharedDeck: [...state.sharedDeck, lowestPointsAnimal],
            message: `${forPlayer ? "You" : "AI"} played Frog and sent ${lowestPointsAnimal.name} to the bottom of the deck.`,
          }
        }
      }
      return state

    case "Crab":
      // Look at the top 2 cards: add 1 to hand and send the other to deck bottom
      if (state.sharedDeck.length >= 2) {
        return {
          ...state,
          pendingEffect: {
            type: "crab",
            forPlayer,
          },
        }
      } else if (state.sharedDeck.length === 1) {
        // If there's only 1 card, just draw it
        const drawnCard = state.sharedDeck[0]

        if (forPlayer) {
          // Check if player's hand would exceed 6 cards
          if (state.playerHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Crab but your hand is full.`,
            }
          }

          return {
            ...state,
            playerHand: [...state.playerHand, drawnCard],
            sharedDeck: [],
            message: `${forPlayer ? "You" : "AI"} played Crab and drew the last card from the deck.`,
          }
        } else {
          // Check if AI's hand would exceed 6 cards
          if (state.opponentHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Crab but your hand is full.`,
            }
          }

          return {
            ...state,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: [],
            message: `${forPlayer ? "You" : "AI"} played Crab and drew the last card from the deck.`,
          }
        }
      }
      return state

    case "Otter":
      // If you have 7 or more points, take a random card from your opponent's hand
      const otterPoints = forPlayer ? state.playerPoints : state.opponentPoints
      const otterOpponentHand = forPlayer ? state.opponentHand : state.playerHand

      if (otterPoints >= 7 && otterOpponentHand.length > 0) {
        // Select a random card from opponent's hand
        const randomIndex = Math.floor(Math.random() * otterOpponentHand.length)
        const takenCard = otterOpponentHand[randomIndex]

        if (forPlayer) {
          // Check if player's hand would exceed 6 cards
          if (state.playerHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Otter but your hand is full.`,
            }
          }

          const newOpponentHand = [...state.opponentHand]
          newOpponentHand.splice(randomIndex, 1)

          return {
            ...state,
            playerHand: [...state.playerHand, takenCard],
            opponentHand: newOpponentHand,
            message: `${forPlayer ? "You" : "AI"} played Otter and took ${takenCard.name} from your opponent's hand.`,
          }
        } else {
          // Check if AI's hand would exceed 6 cards
          if (state.opponentHand.length >= 6) {
            return {
              ...state,
              message: `${forPlayer ? "You" : "AI"} played Otter but your hand is full.`,
            }
          }

          const newPlayerHand = [...state.playerHand]
          newPlayerHand.splice(randomIndex, 1)

          return {
            ...state,
            opponentHand: [...state.opponentHand, takenCard],
            playerHand: newPlayerHand,
            message: `${forPlayer ? "You" : "AI"} played Otter and took ${takenCard.name} from your opponent's hand.`,
          }
        }
      }
      return state

    case "Crocodile":
      // Send 1 animal of 3 or fewer points your opponent controls to deck bottom
      const crocodileTargetField = forPlayer ? state.opponentField : state.playerField
      const validTargets = crocodileTargetField.filter((c) => (c.points || 0) <= 3)

      if (validTargets.length > 0) {
        // For AI, just target the first valid animal
        if (!forPlayer) {
          const targetCard = validTargets[0]
          const targetIndex = crocodileTargetField.findIndex((c) => c.id === targetCard.id)
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          return {
            ...state,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDeck: [...state.sharedDeck, targetCard],
            message: `${forPlayer ? "You" : "AI"} played Crocodile and sent ${targetCard.name} to the bottom of the deck.`,
          }
        } else {
          // For player, set up target selection
          return {
            ...state,
            pendingEffect: {
              type: "crocodile",
              forPlayer,
            },
          }
        }
      }
      return state

    default:
      return state
  }
}

// Resolve animal effect
export function resolveAnimalEffect(state: GameState, targetIndex: number | number[]): GameState {
  if (!state.pendingEffect) return state

  const { type, forPlayer } = state.pendingEffect

  switch (type) {
    case "mouse":
      // Send a terrestrial animal your opponent controls to the top of the deck
      if (forPlayer) {
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
          message: `You sent ${targetCard.name} to the top of the deck.`,
        }
      } else {
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
          message: `AI sent ${targetCard.name} to the top of the deck.`,
        }
      }

    case "snake":
      // Destroy an animal of 1 point your opponent controls
      if (forPlayer) {
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || targetCard.points !== 1) return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)

        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `You destroyed ${targetCard.name}.`,
        }
      } else {
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard || targetCard.points !== 1) return state

        const newPlayerField = [...state.playerField]
        newPlayerField.splice(targetIndex as number, 1)

        return {
          ...state,
          playerField: newPlayerField,
          playerPoints: state.playerPoints - (targetCard.points || 0),
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `AI destroyed ${targetCard.name}.`,
        }
      }

    case "crocodile":
      // Send 1 animal of 3 or fewer points your opponent controls to deck bottom
      if (forPlayer) {
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
          message: `You sent ${targetCard.name} to the bottom of the deck.`,
        }
      } else {
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
          message: `AI sent ${targetCard.name} to the bottom of the deck.`,
        }
      }

    case "wolf":
      // If your opponent has 5 or fewer cards in hand, send 1 terrestrial animal they control to their hand
      if (forPlayer) {
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || targetCard.environment !== "terrestrial") return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)

        return {
          ...state,
          opponentField: newOpponentField,
          opponentHand: [...state.opponentHand, targetCard],
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          pendingEffect: null,
          message: `You sent ${targetCard.name} back to your opponent's hand.`,
        }
      } else {
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard || targetCard.environment !== "terrestrial") return state

        const newPlayerField = [...state.playerField]
        newPlayerField.splice(targetIndex as number, 1)

        return {
          ...state,
          playerField: newPlayerField,
          playerHand: [...state.playerHand, targetCard],
          playerPoints: state.playerPoints - (targetCard.points || 0),
          pendingEffect: null,
          message: `AI sent ${targetCard.name} back to your hand.`,
        }
      }

    case "dolphin":
      // You may send 1 card from hand to deck bottom to draw 1 card
      if (forPlayer) {
        const targetCard = state.playerHand[targetIndex as number]
        if (!targetCard) return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetIndex as number, 1)

        // Draw a card if there are cards in the deck
        if (state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            playerHand: [...newPlayerHand, drawnCard],
            sharedDeck: [...newDeck, targetCard],
            pendingEffect: null,
            message: `You sent ${targetCard.name} to the bottom of the deck and drew ${drawnCard.name}.`,
          }
        } else {
          return {
            ...state,
            playerHand: newPlayerHand,
            sharedDeck: [targetCard],
            pendingEffect: null,
            message: `You sent ${targetCard.name} to the bottom of the deck, but there were no cards to draw.`,
          }
        }
      } else {
        const targetCard = state.opponentHand[targetIndex as number]
        if (!targetCard) return state

        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(targetIndex as number, 1)

        // Draw a card if there are cards in the deck
        if (state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            opponentHand: [...newOpponentHand, drawnCard],
            sharedDeck: [...newDeck, targetCard],
            pendingEffect: null,
            message: `AI sent a card to the bottom of the deck and drew a card.`,
          }
        } else {
          return {
            ...state,
            opponentHand: newOpponentHand,
            sharedDeck: [targetCard],
            pendingEffect: null,
            message: `AI sent a card to the bottom of the deck, but there were no cards to draw.`,
          }
        }
      }

    case "octopus":
      // Look at the top 3 cards of the deck and rearrange them
      if (Array.isArray(targetIndex) && targetIndex.length > 0) {
        const topCards = state.sharedDeck.slice(0, Math.min(3, state.sharedDeck.length))
        const restOfDeck = state.sharedDeck.slice(Math.min(3, state.sharedDeck.length))

        // Rearrange the top cards based on the selected order
        const rearrangedCards: GameCard[] = []
        for (const idx of targetIndex) {
          if (idx >= 0 && idx < topCards.length) {
            rearrangedCards.push(topCards[idx])
          }
        }

        // Add any cards that weren't selected (shouldn't happen, but just in case)
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
      return state

    default:
      return state
  }
}

// Update game state at the end of a turn
export function updateGameStateEndOfTurn(state: GameState): GameState {
  // Reset effects for this turn
  const newEffectsThisTurn = {
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
  }

  // Update persistent effects
  const newPersistentEffects = { ...state.persistentEffects }

  // Update Limit effect duration
  if (newPersistentEffects.limitUntilTurn !== undefined) {
    newPersistentEffects.limitUntilTurn -= 1
    if (newPersistentEffects.limitUntilTurn <= 0) {
      newPersistentEffects.limitUntilTurn = undefined
    } else {
      newEffectsThisTurn.limitInEffect = true
    }
  }

  return {
    ...state,
    effectsThisTurn: newEffectsThisTurn,
    persistentEffects: newPersistentEffects,
  }
}
