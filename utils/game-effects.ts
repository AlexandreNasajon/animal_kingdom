import type { GameCard, GameState } from "@/types/game"

// Helper function to apply "on play" effects for animal cards
export function applyAnimalEffect(state: GameState, card: GameCard, forPlayer: boolean): GameState {
  if (!card || card.type !== "animal" || !card.effect) {
    return state
  }

  let newState = { ...state }
  const effectText = card.effect.toLowerCase()

  // Lion: "On play, destroy an animal your opponent controls."
  if (card.name === "Lion") {
    if (forPlayer && state.opponentField.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "lion",
          forPlayer,
        },
        message: `You played ${card.name}. Select an opponent's animal to destroy.`,
      }
    } else if (!forPlayer && state.playerField.length > 0) {
      // AI automatically selects the highest value animal
      const targetIndex = state.playerField
        .map((c, i) => ({ card: c, index: i }))
        .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

      const targetCard = state.playerField[targetIndex]
      const newPlayerField = [...state.playerField]
      newPlayerField.splice(targetIndex, 1)

      newState = {
        ...newState,
        playerField: newPlayerField,
        playerPoints: state.playerPoints - (targetCard.points || 0),
        sharedDiscard: [...state.sharedDiscard, targetCard],
        message: `AI played ${card.name} and destroyed your ${targetCard.name}.`,
      }
    }
  }

  // Mouse: "On play, draw a card."
  else if (card.name === "Mouse") {
    if (state.sharedDeck.length > 0) {
      const newDeck = [...state.sharedDeck]
      const drawnCard = newDeck.shift()!

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, drawnCard],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew a card.`,
        }
      } else {
        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, drawnCard],
          sharedDeck: newDeck,
          message: `AI played ${card.name} and drew a card.`,
        }
      }
    }
  }

  // Snake: "On play, your opponent discards a card."
  else if (card.name === "Snake") {
    if (forPlayer && state.opponentHand.length > 0) {
      // AI chooses the least valuable card to discard
      const discardIndex = state.opponentHand
        .map((c, i) => ({ card: c, index: i }))
        .sort((a, b) => {
          if (a.card.type === "animal" && b.card.type === "animal") {
            return (a.card.points || 0) - (b.card.points || 0)
          }
          return a.card.type === "impact" ? -1 : 1
        })[0].index

      const discardedCard = state.opponentHand[discardIndex]
      const newOpponentHand = [...state.opponentHand]
      newOpponentHand.splice(discardIndex, 1)

      newState = {
        ...newState,
        opponentHand: newOpponentHand,
        sharedDiscard: [...state.sharedDiscard, discardedCard],
        message: `You played ${card.name}. AI discarded a card.`,
      }
    } else if (!forPlayer && state.playerHand.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "snake",
          forPlayer,
        },
        message: `AI played ${card.name}. Select a card to discard.`,
      }
    }
  }

  // Dolphin: "On play, look at the top 3 cards of the deck and rearrange them."
  else if (card.name === "Dolphin") {
    if (state.sharedDeck.length > 0) {
      const topCards = state.sharedDeck.slice(0, Math.min(3, state.sharedDeck.length))

      if (forPlayer) {
        newState = {
          ...newState,
          pendingEffect: {
            type: "dolphin",
            forPlayer,
          },
          message: `You played ${card.name}. Look at the top ${topCards.length} cards of the deck.`,
        }
      } else {
        // AI just keeps the cards in the same order
        newState = {
          ...newState,
          message: `AI played ${card.name} and looked at the top cards of the deck.`,
        }
      }
    }
  }

  // Fish: "On play, draw a card if you control another aquatic animal."
  else if (card.name === "Fish") {
    const field = forPlayer ? state.playerField : state.opponentField
    const hasAquatic = field.some(
      (c) => c.id !== card.id && (c.environment === "aquatic" || c.environment === "amphibian"),
    )

    if (hasAquatic && state.sharedDeck.length > 0) {
      const newDeck = [...state.sharedDeck]
      const drawnCard = newDeck.shift()!

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, drawnCard],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew a card because you control another aquatic animal.`,
        }
      } else {
        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, drawnCard],
          sharedDeck: newDeck,
          message: `AI played ${card.name} and drew a card because it controls another aquatic animal.`,
        }
      }
    }
  }

  // Octopus: "On play, look at your opponent's hand."
  else if (card.name === "Octopus") {
    if (forPlayer) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "octopus",
          forPlayer,
        },
        message: `You played ${card.name}. You can now see your opponent's hand.`,
      }
    } else {
      // AI already knows player's hand
      newState = {
        ...newState,
        message: `AI played ${card.name} and looked at your hand.`,
      }
    }
  }

  // Frog: "On play, return an animal with 2 or fewer points to its owner's hand."
  else if (card.name === "Frog") {
    const validTargets = [
      ...state.playerField.filter((c) => c.id !== card.id && (c.points || 0) <= 2),
      ...state.opponentField.filter((c) => (c.points || 0) <= 2),
    ]

    if (validTargets.length > 0) {
      if (forPlayer) {
        newState = {
          ...newState,
          pendingEffect: {
            type: "frog",
            forPlayer,
          },
          message: `You played ${card.name}. Select an animal with 2 or fewer points to return to its owner's hand.`,
        }
      } else {
        // AI targets the highest value eligible animal in player's field, or its own lowest value if no player targets
        const playerTargets = state.playerField.filter((c) => (c.points || 0) <= 2)

        if (playerTargets.length > 0) {
          const targetIndex = playerTargets
            .map((c, i) => ({
              card: c,
              index: state.playerField.findIndex((pc) => pc.id === c.id),
            }))
            .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

          const targetCard = state.playerField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          newState = {
            ...newState,
            playerField: newPlayerField,
            playerHand: [...state.playerHand, targetCard],
            playerPoints: state.playerPoints - (targetCard.points || 0),
            message: `AI played ${card.name} and returned your ${targetCard.name} to your hand.`,
          }
        } else {
          // Return AI's own lowest value eligible animal
          const aiTargets = state.opponentField.filter((c) => c.id !== card.id && (c.points || 0) <= 2)

          if (aiTargets.length > 0) {
            const targetIndex = aiTargets
              .map((c, i) => ({
                card: c,
                index: state.opponentField.findIndex((pc) => pc.id === c.id),
              }))
              .sort((a, b) => (a.card.points || 0) - (b.card.points || 0))[0].index

            const targetCard = state.opponentField[targetIndex]
            const newOpponentField = [...state.opponentField]
            newOpponentField.splice(targetIndex, 1)

            newState = {
              ...newState,
              opponentField: newOpponentField,
              opponentHand: [...state.opponentHand, targetCard],
              opponentPoints: state.opponentPoints - (targetCard.points || 0),
              message: `AI played ${card.name} and returned its own ${targetCard.name} to its hand.`,
            }
          }
        }
      }
    }
  }

  // Crab: "On play, draw a card if you have fewer cards in hand than your opponent."
  else if (card.name === "Crab") {
    const playerHandCount = forPlayer ? state.playerHand.length : state.opponentHand.length
    const opponentHandCount = forPlayer ? state.opponentHand.length : state.playerHand.length

    if (playerHandCount < opponentHandCount && state.sharedDeck.length > 0) {
      const newDeck = [...state.sharedDeck]
      const drawnCard = newDeck.shift()!

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, drawnCard],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew a card because you have fewer cards than your opponent.`,
        }
      } else {
        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, drawnCard],
          sharedDeck: newDeck,
          message: `AI played ${card.name} and drew a card because it has fewer cards than you.`,
        }
      }
    }
  }

  // Otter: "On play, you may play an additional animal this turn."
  else if (card.name === "Otter") {
    if (forPlayer) {
      newState = {
        ...newState,
        effectsThisTurn: {
          ...state.effectsThisTurn,
          playerExtraPlays: (state.effectsThisTurn.playerExtraPlays || 0) + 1,
        },
        message: `You played ${card.name}. You may play an additional animal this turn.`,
      }
    } else {
      newState = {
        ...newState,
        effectsThisTurn: {
          ...state.effectsThisTurn,
          opponentExtraPlays: (state.effectsThisTurn.opponentExtraPlays || 0) + 1,
        },
        message: `AI played ${card.name}. It may play an additional animal this turn.`,
      }
    }
  }

  // Crocodile: "On play, destroy an animal with 3 or fewer points."
  else if (card.name === "Crocodile") {
    const validTargets = [
      ...state.playerField.filter((c) => c.id !== card.id && (c.points || 0) <= 3),
      ...state.opponentField.filter((c) => (c.points || 0) <= 3),
    ]

    if (validTargets.length > 0) {
      if (forPlayer) {
        newState = {
          ...newState,
          pendingEffect: {
            type: "crocodile",
            forPlayer,
          },
          message: `You played ${card.name}. Select an animal with 3 or fewer points to destroy.`,
        }
      } else {
        // AI targets the highest value eligible animal in player's field
        const playerTargets = state.playerField.filter((c) => (c.points || 0) <= 3)

        if (playerTargets.length > 0) {
          const targetIndex = playerTargets
            .map((c, i) => ({
              card: c,
              index: state.playerField.findIndex((pc) => pc.id === c.id),
            }))
            .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

          const targetCard = state.playerField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          newState = {
            ...newState,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDiscard: [...state.sharedDiscard, targetCard],
            message: `AI played ${card.name} and destroyed your ${targetCard.name}.`,
          }
        }
      }
    }
  }

  // Mouse (Advanced): "On play, send a terrestrial animal your opponent controls to deck top."
  else if (card.name === "Mouse" && card.id >= 101 && card.id <= 103) {
    const validTargets = state.opponentField.filter(
      (c) => c.environment === "terrestrial" || c.environment === "amphibian",
    )

    if (validTargets.length > 0) {
      if (forPlayer) {
        newState = {
          ...newState,
          pendingEffect: {
            type: "advMouse",
            forPlayer,
          },
          message: `You played ${card.name}. Select a terrestrial animal your opponent controls to send to deck top.`,
        }
      } else {
        // AI automatically selects the highest value terrestrial animal
        const targetIndex = state.playerField
          .map((c, i) => ({ card: c, index: i }))
          .filter((item) => item.card.environment === "terrestrial" || item.card.environment === "amphibian")
          .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0]?.index

        if (targetIndex !== undefined) {
          const targetCard = state.playerField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          newState = {
            ...newState,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDeck: [targetCard, ...state.sharedDeck], // Add to top of deck
            message: `AI played ${card.name} and sent your ${targetCard.name} to the top of the deck.`,
          }
        }
      }
    }
  }

  // Squirrel (Advanced): "On play, look at your opponent's hand and select a card to be discarded."
  else if (card.name === "Squirrel" && card.id >= 104 && card.id <= 106) {
    if (forPlayer) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "advSquirrel",
          forPlayer,
        },
        message: `You played ${card.name}. Look at your opponent's hand and select a card to discard.`,
      }
    } else {
      // AI automatically selects the highest value card
      if (state.playerHand.length > 0) {
        const discardIndex = state.playerHand
          .map((c, i) => ({ card: c, index: i }))
          .sort((a, b) => {
            if (a.card.type === "animal" && b.card.type === "animal") {
              return (b.card.points || 0) - (a.card.points || 0)
            }
            return a.card.type === "animal" ? 1 : -1 // Prioritize discarding animals
          })[0].index

        const discardedCard = state.playerHand[discardIndex]
        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(discardIndex, 1)

        newState = {
          ...newState,
          playerHand: newPlayerHand,
          sharedDiscard: [...state.sharedDiscard, discardedCard],
          message: `AI played ${card.name} and made you discard ${discardedCard.name}.`,
        }
      }
    }
  }

  // Fox (Advanced): "On play, your opponent discards a card at random."
  else if (card.name === "Fox" && card.id >= 107 && card.id <= 108) {
    if (forPlayer && state.opponentHand.length > 0) {
      // Select a random card from opponent's hand
      const randomIndex = Math.floor(Math.random() * state.opponentHand.length)
      const discardedCard = state.opponentHand[randomIndex]
      const newOpponentHand = [...state.opponentHand]
      newOpponentHand.splice(randomIndex, 1)

      newState = {
        ...newState,
        opponentHand: newOpponentHand,
        sharedDiscard: [...state.sharedDiscard, discardedCard],
        message: `You played ${card.name}. AI discarded a card at random.`,
      }
    } else if (!forPlayer && state.playerHand.length > 0) {
      // Select a random card from player's hand
      const randomIndex = Math.floor(Math.random() * state.playerHand.length)
      const discardedCard = state.playerHand[randomIndex]
      const newPlayerHand = [...state.playerHand]
      newPlayerHand.splice(randomIndex, 1)

      newState = {
        ...newState,
        playerHand: newPlayerHand,
        sharedDiscard: [...state.sharedDiscard, discardedCard],
        message: `AI played ${card.name} and you discarded ${discardedCard.name} at random.`,
      }
    }
  }

  // Snake (Advanced): "On play, destroy an animal of 1 point your opponent controls."
  else if (card.name === "Snake" && card.id >= 109 && card.id <= 110) {
    const validTargets = forPlayer
      ? state.opponentField.filter((c) => (c.points || 0) === 1)
      : state.playerField.filter((c) => (c.points || 0) === 1)

    if (validTargets.length > 0) {
      if (forPlayer) {
        newState = {
          ...newState,
          pendingEffect: {
            type: "advSnake",
            forPlayer,
          },
          message: `You played ${card.name}. Select a 1-point animal your opponent controls to destroy.`,
        }
      } else {
        // AI automatically selects a 1-point animal
        const targetIndex = state.playerField.findIndex((c) => (c.points || 0) === 1)
        if (targetIndex !== -1) {
          const targetCard = state.playerField[targetIndex]
          const newPlayerField = [...state.playerField]
          newPlayerField.splice(targetIndex, 1)

          newState = {
            ...newState,
            playerField: newPlayerField,
            playerPoints: state.playerPoints - (targetCard.points || 0),
            sharedDiscard: [...state.sharedDiscard, targetCard],
            message: `AI played ${card.name} and destroyed your ${targetCard.name}.`,
          }
        }
      }
    }
  }

  // Zebra (Advanced): "On play, look at your opponent's hand."
  else if (card.name === "Zebra" && card.id === 111) {
    if (forPlayer) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "advZebra",
          forPlayer,
        },
        message: `You played ${card.name}. You can now look at your opponent's hand.`,
      }
    } else {
      // AI already knows player's hand
      newState = {
        ...newState,
        message: `AI played ${card.name} and looked at your hand.`,
      }
    }
  }

  // Deer (Advanced): "On play, if you have 7 or more points, your opponent discards 1 card."
  else if (card.name === "Deer" && card.id === 112) {
    const points = forPlayer ? state.playerPoints : state.opponentPoints

    if (points >= 7) {
      if (forPlayer && state.opponentHand.length > 0) {
        // Choose a random card from opponent's hand
        const randomIndex = Math.floor(Math.random() * state.opponentHand.length)
        const discardedCard = state.opponentHand[randomIndex]
        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(randomIndex, 1)

        newState = {
          ...newState,
          opponentHand: newOpponentHand,
          sharedDiscard: [...state.sharedDiscard, discardedCard],
          message: `You played ${card.name}. Since you have 7+ points, AI discarded a card.`,
        }
      } else if (!forPlayer && state.playerHand.length > 0) {
        // AI makes player discard a card
        newState = {
          ...newState,
          pendingEffect: {
            type: "advDeer",
            forPlayer,
          },
          message: `AI played ${card.name}. Since it has 7+ points, select a card to discard.`,
        }
      }
    } else {
      newState = {
        ...newState,
        message: `${forPlayer ? "You" : "AI"} played ${card.name}, but doesn't have 7+ points yet.`,
      }
    }
  }

  // Wolf (Advanced): "On play, each player discards 1 card at random."
  else if (card.name === "Wolf" && card.id === 113) {
    let message = `${forPlayer ? "You" : "AI"} played ${card.name}.`

    // Both players discard a card at random
    if (state.playerHand.length > 0) {
      const playerDiscardIndex = Math.floor(Math.random() * state.playerHand.length)
      const playerDiscardedCard = state.playerHand[playerDiscardIndex]
      const newPlayerHand = [...state.playerHand]
      newPlayerHand.splice(playerDiscardIndex, 1)

      newState.playerHand = newPlayerHand
      newState.sharedDiscard = [...state.sharedDiscard, playerDiscardedCard]
      message += ` You discarded ${playerDiscardedCard.name}.`
    }

    if (state.opponentHand.length > 0) {
      const opponentDiscardIndex = Math.floor(Math.random() * state.opponentHand.length)
      const opponentDiscardedCard = state.opponentHand[opponentDiscardIndex]
      const newOpponentHand = [...state.opponentHand]
      newOpponentHand.splice(opponentDiscardIndex, 1)

      newState.opponentHand = newOpponentHand
      newState.sharedDiscard = [...newState.sharedDiscard, opponentDiscardedCard]
      message += ` AI discarded a card.`
    }

    newState.message = message
  }

  // Tuna (Advanced): "On play, play an aquatic animal from hand."
  else if (card.name === "Tuna" && (card.id === 115 || card.id === 116)) {
    const aquaticCards = forPlayer
      ? state.playerHand.filter(
          (c) => c.type === "animal" && (c.environment === "aquatic" || c.environment === "amphibian"),
        )
      : state.opponentHand.filter(
          (c) => c.type === "animal" && (c.environment === "aquatic" || c.environment === "amphibian"),
        )

    if (forPlayer && aquaticCards.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "advTuna",
          forPlayer,
        },
        message: `You played ${card.name}. You may play an aquatic animal from your hand.`,
      }
    } else if (!forPlayer && aquaticCards.length > 0) {
      // AI automatically selects the highest point aquatic animal
      const bestAquatic = aquaticCards.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
      const cardIndex = state.opponentHand.findIndex((c) => c.id === bestAquatic.id)

      // Remove the card from hand
      const newOpponentHand = [...state.opponentHand]
      newOpponentHand.splice(cardIndex, 1)

      // Play the card to field
      newState = {
        ...newState,
        opponentHand: newOpponentHand,
        opponentField: [...state.opponentField, bestAquatic],
        opponentPoints: state.opponentPoints + (bestAquatic.points || 0),
        message: `AI played ${card.name} and played ${bestAquatic.name} from hand.`,
      }
    }
  }

  // Seahorse (Advanced): "On play, draw 1 card for every played animal."
  else if (card.name === "Seahorse" && (card.id === 117 || card.id === 118)) {
    // Count animals on both fields
    const animalCount = state.playerField.length + state.opponentField.length

    if (animalCount > 0 && state.sharedDeck.length > 0) {
      const cardsToDraw = Math.min(animalCount, state.sharedDeck.length)
      const newDeck = [...state.sharedDeck]
      const drawnCards = newDeck.splice(0, cardsToDraw)

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, ...drawnCards],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew ${cardsToDraw} card${cardsToDraw > 1 ? "s" : ""}.`,
        }
      } else {
        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, ...drawnCards],
          sharedDeck: newDeck,
          message: `AI played ${card.name} and drew ${cardsToDraw} card${cardsToDraw > 1 ? "s" : ""}.`,
        }
      }
    } else {
      newState = {
        ...newState,
        message: `${forPlayer ? "You" : "AI"} played ${card.name}, but couldn't draw any cards.`,
      }
    }
  }

  // Jellyfish (Advanced): "On play, draw 1 card."
  else if (card.name === "Jellyfish" && (card.id === 119 || card.id === 120)) {
    if (state.sharedDeck.length > 0) {
      const newDeck = [...state.sharedDeck]
      const drawnCard = newDeck.shift()!

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, drawnCard],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew a card.`,
        }
      } else {
        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, drawnCard],
          sharedDeck: newDeck,
          message: `AI played ${card.name} and drew a card.`,
        }
      }
    }
  }

  // Turtle (Advanced): "On play, play an aquatic animal of 2 or fewer points from hand."
  else if (card.name === "Turtle" && (card.id === 121 || card.id === 122)) {
    const validCards = forPlayer
      ? state.playerHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 2,
        )
      : state.opponentHand.filter(
          (c) =>
            c.type === "animal" &&
            (c.environment === "aquatic" || c.environment === "amphibian") &&
            (c.points || 0) <= 2,
        )

    if (forPlayer && validCards.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "advTurtle",
          forPlayer,
        },
        message: `You played ${card.name}. You may play an aquatic animal of 2 or fewer points from your hand.`,
      }
    } else if (!forPlayer && validCards.length > 0) {
      // AI automatically selects the highest point valid animal
      const bestAnimal = validCards.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
      const cardIndex = state.opponentHand.findIndex((c) => c.id === bestAnimal.id)

      // Remove the card from hand
      const newOpponentHand = [...state.opponentHand]
      newOpponentHand.splice(cardIndex, 1)

      // Play the card to field
      newState = {
        ...newState,
        opponentHand: newOpponentHand,
        opponentField: [...state.opponentField, bestAnimal],
        opponentPoints: state.opponentPoints + (bestAnimal.points || 0),
        message: `AI played ${card.name} and played ${bestAnimal.name} from hand.`,
      }
    }
  }

  // Add other advanced deck animal effects here...

  // Add more animal effects as needed

  return newState
}

// Helper function to resolve animal effect selections
export function resolveAnimalEffect(state: GameState, targetIndex: number | number[]): GameState {
  if (!state.pendingEffect || !state.pendingEffect.type) return state

  const { type, forPlayer } = state.pendingEffect

  switch (type) {
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
          message: `You destroyed the opponent's ${targetCard.name} with your Lion.`,
        }
      }
      break

    case "snake":
      if (!forPlayer) {
        // Player discarding a card due to AI's Snake
        const targetCard = state.playerHand[targetIndex as number]
        if (!targetCard) return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetIndex as number, 1)
        return {
          ...state,
          playerHand: newPlayerHand,
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `You discarded ${targetCard.name} due to AI's Snake.`,
        }
      }
      break

    case "dolphin":
      if (forPlayer) {
        // Player rearranging top cards
        if (!Array.isArray(targetIndex)) return state

        // Get the top cards
        const topCardCount = Math.min(3, state.sharedDeck.length)
        const remainingDeck = state.sharedDeck.slice(topCardCount)

        // Rearrange according to player's selection
        const rearrangedCards = targetIndex.map((idx) => state.sharedDeck[idx])

        return {
          ...state,
          sharedDeck: [...rearrangedCards, ...remainingDeck],
          pendingEffect: null,
          message: `You rearranged the top cards of the deck.`,
        }
      }
      break

    case "octopus":
      if (forPlayer) {
        // Just close the effect, the UI should have shown the opponent's hand
        return {
          ...state,
          pendingEffect: null,
          message: `You've seen your opponent's hand.`,
        }
      }
      break

    case "frog":
      if (forPlayer) {
        // Determine if target is from player or opponent field
        const playerFieldLength = state.playerField.length
        const totalFieldLength = playerFieldLength + state.opponentField.length
        const singleTargetIndex = targetIndex as number

        if (singleTargetIndex >= 0 && singleTargetIndex < totalFieldLength) {
          let targetCard: GameCard
          const newPlayerField = [...state.playerField]
          const newOpponentField = [...state.opponentField]
          const newPlayerHand = [...state.playerHand]
          const newOpponentHand = [...state.opponentHand]
          let newPlayerPoints = state.playerPoints
          let newOpponentPoints = state.opponentPoints

          if (singleTargetIndex < playerFieldLength) {
            // Target is in player's field
            targetCard = state.playerField[singleTargetIndex]
            newPlayerField.splice(singleTargetIndex, 1)
            newPlayerHand.push(targetCard)
            newPlayerPoints -= targetCard.points || 0
          } else {
            // Target is in opponent's field
            const opponentIndex = singleTargetIndex - playerFieldLength
            targetCard = state.opponentField[opponentIndex]
            newOpponentField.splice(opponentIndex, 1)
            newOpponentHand.push(targetCard)
            newOpponentPoints -= targetCard.points || 0
          }

          return {
            ...state,
            playerField: newPlayerField,
            opponentField: newOpponentField,
            playerHand: newPlayerHand,
            opponentHand: newOpponentHand,
            playerPoints: newPlayerPoints,
            opponentPoints: newOpponentPoints,
            pendingEffect: null,
            message: `${targetCard.name} was returned to its owner's hand.`,
          }
        }
      }
      break

    case "crocodile":
      if (forPlayer) {
        // Determine if target is from player or opponent field
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
            sharedDiscard: [...state.sharedDiscard, targetCard],
            pendingEffect: null,
            message: `Your Crocodile destroyed ${targetCard.name}.`,
          }
        }
      }
      break

    case "advMouse":
      if (forPlayer) {
        // Player selecting opponent's terrestrial animal to send to top of deck
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || (targetCard.environment !== "terrestrial" && targetCard.environment !== "amphibian"))
          return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)

        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDeck: [targetCard, ...state.sharedDeck], // Add to top of deck
          pendingEffect: null,
          message: `You sent the opponent's ${targetCard.name} to the top of the deck.`,
        }
      }
      break

    case "advSquirrel":
      if (forPlayer) {
        // Player selecting a card from opponent's hand to discard
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
      }
      break

    case "advSnake":
      if (forPlayer) {
        // Player selecting a 1-point animal to destroy
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
          message: `You destroyed the opponent's ${targetCard.name}.`,
        }
      }
      break

    case "advZebra":
      if (forPlayer) {
        // Just close the effect, the UI should have shown the opponent's hand
        return {
          ...state,
          pendingEffect: null,
          message: `You've seen your opponent's hand.`,
        }
      }
      break

    case "advDeer":
      if (!forPlayer) {
        // Player selecting a card to discard due to AI's Deer
        const targetCard = state.playerHand[targetIndex as number]
        if (!targetCard) return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetIndex as number, 1)

        return {
          ...state,
          playerHand: newPlayerHand,
          sharedDiscard: [...state.sharedDiscard, targetCard],
          pendingEffect: null,
          message: `You discarded ${targetCard.name} due to AI's Deer.`,
        }
      }
      break

    case "advTuna":
      if (forPlayer) {
        // Player selecting an aquatic animal to play
        const targetCard = state.playerHand[targetIndex as number]
        if (
          !targetCard ||
          targetCard.type !== "animal" ||
          (targetCard.environment !== "aquatic" && targetCard.environment !== "amphibian")
        )
          return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetIndex as number, 1)

        return {
          ...state,
          playerHand: newPlayerHand,
          playerField: [...state.playerField, targetCard],
          playerPoints: state.playerPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `You played ${targetCard.name} from your hand.`,
        }
      }
      break

    case "advTurtle":
      if (forPlayer) {
        // Player selecting an aquatic animal of 2 or fewer points to play
        const targetCard = state.playerHand[targetIndex as number]
        if (
          !targetCard ||
          targetCard.type !== "animal" ||
          (targetCard.environment !== "aquatic" && targetCard.environment !== "amphibian") ||
          (targetCard.points || 0) > 2
        )
          return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetIndex as number, 1)

        return {
          ...state,
          playerHand: newPlayerHand,
          playerField: [...state.playerField, targetCard],
          playerPoints: state.playerPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `You played ${targetCard.name} from your hand.`,
        }
      }
      break

    // Add other advanced deck resolution cases as needed

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

// Helper function to update the game state at the end of a turn
export function updateGameStateEndOfTurn(state: GameState): GameState {
  // Reset per-turn effects
  const newEffectsThisTurn = {
    playerAnimalsPlayed: 0,
    opponentAnimalsPlayed: 0,
    playerCardsDrawn: 0,
    opponentCardsDrawn: 0,
    playerExtraDraws: 0,
    opponentExtraDraws: 0,
    playerExtraPlays: 0,
    opponentExtraPlays: 0,
    limitInEffect: state.effectsThisTurn.limitInEffect,
    droughtInEffect: state.effectsThisTurn.droughtInEffect,
  }

  // Update persistent effects
  const newPersistentEffects = { ...state.persistentEffects }

  // Check if Limit effect should end
  if (newPersistentEffects.limitUntilTurn && state.currentTurn === "opponent") {
    if (newPersistentEffects.limitUntilTurn <= 0) {
      newPersistentEffects.limitUntilTurn = undefined
      newEffectsThisTurn.limitInEffect = false
    } else {
      newPersistentEffects.limitUntilTurn--
    }
  }

  // Reset any disabled animals
  const newPlayerField = state.playerField.map((card) => ({
    ...card,
    disabled: false,
  }))

  const newOpponentField = state.opponentField.map((card) => ({
    ...card,
    disabled: false,
  }))

  return {
    ...state,
    playerField: newPlayerField,
    opponentField: newOpponentField,
    effectsThisTurn: newEffectsThisTurn,
    persistentEffects: newPersistentEffects,
  }
}
