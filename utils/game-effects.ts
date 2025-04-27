import type { GameCard, GameState } from "@/types/game"

// Apply animal effect after playing a card
export function applyAnimalEffect(state: GameState, card: GameCard, forPlayer: boolean): GameState {
  if (card.type !== "animal" || !card.effect) return state

  switch (card.name) {
    case "Mouse":
      // On play, send 1 terrestrial animal to the top of the deck
      if (forPlayer) {
        // Check if there are terrestrial animals on the opponent's field
        if (state.opponentField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")) {
          return {
            ...state,
            pendingEffect: {
              type: "mouse",
              forPlayer: true,
            },
            message: `You played ${card.name}. Select a terrestrial animal to send to the top of the deck.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no terrestrial animals to target.`,
          }
        }
      } else {
        // AI plays Mouse - handled in the AI decision making
        return {
          ...state,
          pendingEffect: {
            type: "mouse",
            forPlayer: false,
          },
          message: `AI played ${card.name} and is selecting a terrestrial animal to send to the top of the deck.`,
        }
      }

    case "Squirrel":
      // On play, look at opponent's hand and discard 1 card
      if (forPlayer) {
        return {
          ...state,
          pendingEffect: {
            type: "squirrel",
            forPlayer: true,
          },
          message: `You played ${card.name}. Look at your opponent's hand and select a card to discard.`,
        }
      } else {
        // AI plays Squirrel - handled in the AI decision making
        return {
          ...state,
          pendingEffect: {
            type: "squirrel",
            forPlayer: false,
          },
          message: `AI played ${card.name} and is looking at your hand to select a card to discard.`,
        }
      }

    case "Snake":
      // On play, destroy 1 animal with 1 point
      if (forPlayer) {
        // Check if there are 1-point animals on the opponent's field
        const onePointAnimals = state.opponentField.filter((c) => c.points === 1)
        if (onePointAnimals.length > 0) {
          // Find the first 1-point animal
          const targetIndex = state.opponentField.findIndex((c) => c.points === 1)
          const targetCard = state.opponentField[targetIndex]

          // Remove the animal from the field
          const newOpponentField = [...state.opponentField]
          newOpponentField.splice(targetIndex, 1)

          return {
            ...state,
            opponentField: newOpponentField,
            opponentPoints: state.opponentPoints - 1,
            sharedDiscard: [...state.sharedDiscard, targetCard],
            message: `You played ${card.name} and destroyed the opponent's ${targetCard.name}.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no 1-point animals to destroy.`,
          }
        }
      } else {
        // AI plays Snake
        const onePointAnimals = state.playerField.filter((c) => c.points === 1)
        if (onePointAnimals.length > 0) {
          // Find the first 1-point animal
          const targetIndex = state.playerField.findIndex((c) => c.points === 1)
          const targetCard = state.playerField[targetIndex]

          // Remove the animal from the field
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          return {
            ...state,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - 1,
            sharedDiscard: [...state.sharedDiscard, targetCard],
            message: `AI played ${card.name} and destroyed your ${targetCard.name}.`,
          }
        } else {
          return {
            ...state,
            message: `AI played ${card.name}, but there are no 1-point animals to destroy.`,
          }
        }
      }

    case "Deer":
      // On play, draw 1 card
      if (forPlayer) {
        // Check if there are cards in the deck
        if (state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            playerHand: [...state.playerHand, drawnCard],
            sharedDeck: newDeck,
            message: `You played ${card.name} and drew a card.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no cards left to draw.`,
          }
        }
      } else {
        // AI plays Deer
        if (state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `AI played ${card.name} and drew a card.`,
          }
        } else {
          return {
            ...state,
            message: `AI played ${card.name}, but there are no cards left to draw.`,
          }
        }
      }

    case "Fox":
      // On play, look at the top 3 cards of the deck
      if (forPlayer) {
        // Check if there are cards in the deck
        if (state.sharedDeck.length > 0) {
          const topCards = state.sharedDeck.slice(0, Math.min(3, state.sharedDeck.length))

          return {
            ...state,
            message: `You played ${card.name} and looked at the top ${topCards.length} card(s) of the deck.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no cards left in the deck.`,
          }
        }
      } else {
        // AI plays Fox
        return {
          ...state,
          message: `AI played ${card.name} and looked at the top cards of the deck.`,
        }
      }

    case "Tuna":
      // On play, play 1 aquatic animal with 3 or fewer points from your hand
      if (forPlayer) {
        // Check if there are eligible aquatic animals in hand
        const eligibleAnimals = state.playerHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 3,
        )

        if (eligibleAnimals.length > 0) {
          return {
            ...state,
            pendingEffect: {
              type: "tuna",
              forPlayer: true,
            },
            message: `You played ${card.name}. Select an aquatic animal with 3 or fewer points from your hand to play.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but you have no eligible aquatic animals in your hand.`,
          }
        }
      } else {
        // AI plays Tuna
        return {
          ...state,
          pendingEffect: {
            type: "tuna",
            forPlayer: false,
          },
          message: `AI played ${card.name} and is selecting an aquatic animal to play from its hand.`,
        }
      }

    case "Turtle":
      // On play, play 1 aquatic animal with 2 or fewer points from your hand
      if (forPlayer) {
        // Check if there are eligible aquatic animals in hand
        const eligibleAnimals = state.playerHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 2,
        )

        if (eligibleAnimals.length > 0) {
          return {
            ...state,
            pendingEffect: {
              type: "turtle",
              forPlayer: true,
            },
            message: `You played ${card.name}. Select an aquatic animal with 2 or fewer points from your hand to play.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but you have no eligible aquatic animals in your hand.`,
          }
        }
      } else {
        // AI plays Turtle
        return {
          ...state,
          pendingEffect: {
            type: "turtle",
            forPlayer: false,
          },
          message: `AI played ${card.name} and is selecting an aquatic animal to play from its hand.`,
        }
      }

    case "Dolphin":
      // On play, if you have 7 or more points, draw 1 card
      if (forPlayer) {
        const playerPoints = state.playerPoints

        if (playerPoints >= 7 && state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            playerHand: [...state.playerHand, drawnCard],
            sharedDeck: newDeck,
            message: `You played ${card.name} and drew a card because you have ${playerPoints} points.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}${playerPoints >= 7 ? ", but there are no cards left to draw" : " (need 7+ points to draw a card)"}.`,
          }
        }
      } else {
        // AI plays Dolphin
        const aiPoints = state.opponentPoints

        if (aiPoints >= 7 && state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `AI played ${card.name} and drew a card because it has ${aiPoints} points.`,
          }
        } else {
          return {
            ...state,
            message: `AI played ${card.name}${aiPoints >= 7 ? ", but there are no cards left to draw" : " (needs 7+ points to draw a card)"}.`,
          }
        }
      }

    case "Frog":
      // On play, if you have 3 or more animals on your field, draw 1 card
      if (forPlayer) {
        const fieldCount = state.playerField.length

        if (fieldCount >= 3 && state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            playerHand: [...state.playerHand, drawnCard],
            sharedDeck: newDeck,
            message: `You played ${card.name} and drew a card because you have ${fieldCount} animals on your field.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}${fieldCount >= 3 ? ", but there are no cards left to draw" : " (need 3+ animals to draw a card)"}.`,
          }
        }
      } else {
        // AI plays Frog
        const fieldCount = state.opponentField.length

        if (fieldCount >= 3 && state.sharedDeck.length > 0) {
          const drawnCard = state.sharedDeck[0]
          const newDeck = state.sharedDeck.slice(1)

          return {
            ...state,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `AI played ${card.name} and drew a card because it has ${fieldCount} animals on its field.`,
          }
        } else {
          return {
            ...state,
            message: `AI played ${card.name}${fieldCount >= 3 ? ", but there are no cards left to draw" : " (needs 3+ animals to draw a card)"}.`,
          }
        }
      }

    case "Crab":
      // On play, look at the top 2 cards of the deck, add 1 to your hand and put the other on the bottom
      if (forPlayer) {
        // Check if there are cards in the deck
        if (state.sharedDeck.length > 0) {
          return {
            ...state,
            pendingEffect: {
              type: "crab",
              forPlayer: true,
            },
            message: `You played ${card.name}. Look at the top ${Math.min(2, state.sharedDeck.length)} card(s) of the deck.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no cards left in the deck.`,
          }
        }
      } else {
        // AI plays Crab
        return {
          ...state,
          pendingEffect: {
            type: "crab",
            forPlayer: false,
          },
          message: `AI played ${card.name} and is looking at the top cards of the deck.`,
        }
      }

    case "Crocodile":
      // On play, send 1 animal with 3 or fewer points to the bottom of the deck
      if (forPlayer) {
        // Check if there are eligible animals on the opponent's field
        const eligibleAnimals = state.opponentField.filter((c) => (c.points || 0) <= 3)

        if (eligibleAnimals.length > 0) {
          return {
            ...state,
            pendingEffect: {
              type: "crocodile",
              forPlayer: true,
            },
            message: `You played ${card.name}. Select an animal with 3 or fewer points to send to the bottom of the deck.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no eligible animals to target.`,
          }
        }
      } else {
        // AI plays Crocodile
        return {
          ...state,
          pendingEffect: {
            type: "crocodile",
            forPlayer: false,
          },
          message: `AI played ${card.name} and is selecting an animal to send to the bottom of the deck.`,
        }
      }

    case "Lion":
      // On play, destroy 1 animal
      if (forPlayer) {
        // Check if there are animals on the opponent's field
        if (state.opponentField.length > 0) {
          return {
            ...state,
            pendingEffect: {
              type: "lion",
              forPlayer: true,
            },
            message: `You played ${card.name}. Select an animal to destroy.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no animals to destroy.`,
          }
        }
      } else {
        // AI plays Lion
        return {
          ...state,
          pendingEffect: {
            type: "lion",
            forPlayer: false,
          },
          message: `AI played ${card.name} and is selecting an animal to destroy.`,
        }
      }

    case "Shark":
      // On play, destroy 1 aquatic animal
      if (forPlayer) {
        // Check if there are aquatic animals on the opponent's field
        const aquaticAnimals = state.opponentField.filter(
          (c) => c.environment === "aquatic" || c.environment === "amphibian",
        )

        if (aquaticAnimals.length > 0) {
          return {
            ...state,
            pendingEffect: {
              type: "shark",
              forPlayer: true,
            },
            message: `You played ${card.name}. Select an aquatic animal to destroy.`,
          }
        } else {
          return {
            ...state,
            message: `You played ${card.name}, but there are no aquatic animals to destroy.`,
          }
        }
      } else {
        // AI plays Shark
        const aquaticAnimals = state.playerField.filter(
          (c) => c.environment === "aquatic" || c.environment === "amphibian",
        )

        if (aquaticAnimals.length > 0) {
          // Find the highest value aquatic animal
          const targetIndex = state.playerField
            .map((c, i) => ({ card: c, index: i }))
            .filter((item) => item.card.environment === "aquatic" || item.card.environment === "amphibian")
            .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

          const targetCard = state.playerField[targetIndex]

          // Remove the animal from the field
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          return {
            ...state,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDiscard: [...state.sharedDiscard, targetCard],
            message: `AI played ${card.name} and destroyed your ${targetCard.name}.`,
          }
        } else {
          return {
            ...state,
            message: `AI played ${card.name}, but there are no aquatic animals to destroy.`,
          }
        }
      }

    // Add other animal effects as needed
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
        // Player selecting an aquatic animal to play from hand
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
        // AI selecting an aquatic animal to play from hand
        const eligibleAnimals = state.opponentHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 3,
        )

        if (eligibleAnimals.length === 0)
          return {
            ...state,
            pendingEffect: null,
            message: `AI played Tuna but had no eligible aquatic animals to play.`,
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
        // Player selecting an aquatic animal to play from hand
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
        // AI selecting an aquatic animal to play from hand
        const eligibleAnimals = state.opponentHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 2,
        )

        if (eligibleAnimals.length === 0)
          return {
            ...state,
            pendingEffect: null,
            message: `AI played Turtle but had no eligible aquatic animals to play.`,
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
        // Player targeting opponent's animal
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
        }
      } else {
        // AI targeting player's animal
        const targetCard = state.playerField[targetIndex as number]
        if (!targetCard) return state

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

    // Add other animal effect resolutions as needed
    default:
      return {
        ...state,
        pendingEffect: null,
        message: "Effect resolved.",
      }
  }
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
