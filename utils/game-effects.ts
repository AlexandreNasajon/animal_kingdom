import type { GameCard, GameState } from "@/types/game"

// Helper function to apply "on play" effects for animal cards
export function applyAnimalEffect(state: GameState, card: GameCard, forPlayer: boolean): GameState {
  if (!card || card.type !== "animal" || !card.effect) {
    return state
  }

  let newState = { ...state }
  const effectText = card.effect.toLowerCase()

  // Mouse: "On play, send a terrestrial animal your opponent controls to deck top."
  if (card.name === "Mouse") {
    if (
      forPlayer &&
      state.opponentField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")
    ) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "mouse",
          forPlayer,
        },
        message: `You played ${card.name}. Select a terrestrial animal your opponent controls to send to the top of the deck.`,
      }
    } else if (
      !forPlayer &&
      state.playerField.some((c) => c.environment === "terrestrial" || c.environment === "amphibian")
    ) {
      // AI automatically selects the highest value terrestrial animal
      const targetIndex = state.playerField
        .map((c, i) => ({ card: c, index: i }))
        .filter((item) => item.card.environment === "terrestrial" || item.card.environment === "amphibian")
        .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

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

  // Squirrel: "On play, look at your opponent's hand and select a card to be discarded."
  else if (card.name === "Squirrel") {
    if (forPlayer && state.opponentHand.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "squirrel",
          forPlayer,
        },
        message: `You played ${card.name}. Look at your opponent's hand and select a card to discard.`,
      }
    } else if (!forPlayer && state.playerHand.length > 0) {
      // AI automatically selects the highest value card
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

  // Fox: "On play, your opponent discards a card at random."
  else if (card.name === "Fox") {
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

  // Snake: "On play, destroy an animal of 1 point your opponent controls."
  else if (card.name === "Snake") {
    const validTargets = forPlayer
      ? state.opponentField.filter((c) => (c.points || 0) === 1)
      : state.playerField.filter((c) => (c.points || 0) === 1)

    if (forPlayer && validTargets.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "snake",
          forPlayer,
        },
        message: `You played ${card.name}. Select a 1-point animal your opponent controls to destroy.`,
      }
    } else if (!forPlayer && validTargets.length > 0) {
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

  // Zebra: "On play, look at your opponent's hand."
  else if (card.name === "Zebra") {
    if (forPlayer) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "zebra",
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

  // Deer: "On play, if you have 7 or more points, your opponent discards a card at random."
  else if (card.name === "Deer") {
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
        const randomIndex = Math.floor(Math.random() * state.playerHand.length)
        const discardedCard = state.playerHand[randomIndex]
        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(randomIndex, 1)

        newState = {
          ...newState,
          playerHand: newPlayerHand,
          sharedDiscard: [...state.sharedDiscard, discardedCard],
          message: `AI played ${card.name}. Since it has 7+ points, you discarded ${discardedCard.name}.`,
        }
      }
    } else {
      newState = {
        ...newState,
        message: `${forPlayer ? "You" : "AI"} played ${card.name}, but doesn't have 7+ points yet.`,
      }
    }
  }

  // Wolf: "On play, each player discards 1 card at random."
  else if (card.name === "Wolf") {
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

  // Lion: "Sacrifice 1 animal to play this card. On play, your opponent discards 2 cards at random."
  else if (card.name === "Lion") {
    // Note: The sacrifice part should be handled before playing the card
    // Here we just handle the "on play" effect
    if (forPlayer && state.opponentHand.length > 0) {
      let message = `You played ${card.name}.`
      const newOpponentHand = [...state.opponentHand]
      const discardCount = Math.min(2, newOpponentHand.length)
      const discardedCards: GameCard[] = []

      for (let i = 0; i < discardCount; i++) {
        const randomIndex = Math.floor(Math.random() * newOpponentHand.length)
        const discardedCard = newOpponentHand[randomIndex]
        discardedCards.push(discardedCard)
        newOpponentHand.splice(randomIndex, 1)
        newState.sharedDiscard = [...newState.sharedDiscard, discardedCard]
      }

      message += ` AI discarded ${discardCount} card${discardCount !== 1 ? "s" : ""} at random.`

      newState = {
        ...newState,
        opponentHand: newOpponentHand,
        message,
      }
    } else if (!forPlayer && state.playerHand.length > 0) {
      let message = `AI played ${card.name}.`
      const newPlayerHand = [...state.playerHand]
      const discardCount = Math.min(2, newPlayerHand.length)
      const discardedCards: GameCard[] = []

      for (let i = 0; i < discardCount; i++) {
        const randomIndex = Math.floor(Math.random() * newPlayerHand.length)
        const discardedCard = newPlayerHand[randomIndex]
        discardedCards.push(discardedCard)
        newPlayerHand.splice(randomIndex, 1)
        newState.sharedDiscard = [...newState.sharedDiscard, discardedCard]
      }

      message += ` You discarded ${discardedCards.map((c) => c.name).join(" and ")}.`

      newState = {
        ...newState,
        playerHand: newPlayerHand,
        message,
      }
    }
  }

  // Tuna: "On play, play an aquatic animal from hand."
  else if (card.name === "Tuna") {
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
          type: "tuna",
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

      // Apply the effect of the played aquatic animal
      if (bestAquatic.effect) {
        newState = applyAnimalEffect(newState, bestAquatic, false)
      }
    }
  }

  // Seahorse: "On play, draw 1 card for every animal you played this turn."
  else if (card.name === "Seahorse") {
    // Count animals played this turn, including the Seahorse itself
    const animalCount = forPlayer
      ? state.effectsThisTurn.playerAnimalsPlayed + 1 // +1 for the Seahorse itself
      : state.effectsThisTurn.opponentAnimalsPlayed + 1 // +1 for the Seahorse itself

    if (animalCount > 0 && state.sharedDeck.length > 0) {
      const cardsToDraw = Math.min(animalCount, state.sharedDeck.length)
      const newDeck = [...state.sharedDeck]
      const drawnCards = newDeck.splice(0, cardsToDraw)

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, ...drawnCards],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew ${cardsToDraw} card${cardsToDraw > 1 ? "s" : ""} (one for each animal you played this turn).`,
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

  // Jellyfish: "On play, draw 1 card."
  else if (card.name === "Jellyfish") {
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

  // Turtle: "On play, play an aquatic animal of 2 or fewer points from hand."
  else if (card.name === "Turtle") {
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
          type: "turtle",
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

      // Apply the effect of the played aquatic animal
      if (bestAnimal.effect) {
        newState = applyAnimalEffect(newState, bestAnimal, false)
      }
    }
  }

  // Dolphin: "On play, you may send 1 card from hand to deck bottom to draw 1 card."
  else if (card.name === "Dolphin") {
    if (forPlayer && state.playerHand.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "dolphin",
          forPlayer,
        },
        message: `You played ${card.name}. You may send 1 card from hand to deck bottom to draw 1 card.`,
      }
    } else if (!forPlayer && state.opponentHand.length > 0 && state.sharedDeck.length > 0) {
      // AI automatically selects the least valuable card
      const cardIndex = state.opponentHand
        .map((c, i) => ({ card: c, index: i }))
        .sort((a, b) => {
          if (a.card.type === "animal" && b.card.type === "animal") {
            return (a.card.points || 0) - (b.card.points || 0)
          }
          return a.card.type === "impact" ? -1 : 1
        })[0].index

      const cardToSend = state.opponentHand[cardIndex]
      const newOpponentHand = [...state.opponentHand]
      newOpponentHand.splice(cardIndex, 1)

      // Draw a card
      const newDeck = [...state.sharedDeck]
      const drawnCard = newDeck.shift()!
      newDeck.push(cardToSend)

      newState = {
        ...newState,
        opponentHand: [...newOpponentHand, drawnCard],
        sharedDeck: newDeck,
        message: `AI played ${card.name} and sent a card to the bottom of the deck to draw a card.`,
      }
    }
  }

  // Octopus: "On play, look at the top 3 cards of the deck. You may rearrange them."
  else if (card.name === "Octopus") {
    if (state.sharedDeck.length > 0) {
      const topCards = state.sharedDeck.slice(0, Math.min(3, state.sharedDeck.length))

      if (forPlayer) {
        newState = {
          ...newState,
          pendingEffect: {
            type: "octopus",
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

  // Stingray: "On play, if you have 7 or more points, draw 1 card."
  else if (card.name === "Stingray") {
    const points = forPlayer ? state.playerPoints : state.opponentPoints

    if (points >= 7 && state.sharedDeck.length > 0) {
      const newDeck = [...state.sharedDeck]
      const drawnCard = newDeck.shift()!

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, drawnCard],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew a card because you have 7+ points.`,
        }
      } else {
        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, drawnCard],
          sharedDeck: newDeck,
          message: `AI played ${card.name} and drew a card because it has 7+ points.`,
        }
      }
    } else {
      newState = {
        ...newState,
        message: `${forPlayer ? "You" : "AI"} played ${card.name}, but doesn't have 7+ points yet.`,
      }
    }
  }

  // Shark: "Sacrifice 1 animal to play this card. On play, draw cards until you have 4."
  else if (card.name === "Shark") {
    // Note: The sacrifice part should be handled before playing the card
    // Here we just handle the "on play" effect
    const handSize = forPlayer ? state.playerHand.length : state.opponentHand.length

    if (handSize < 4 && state.sharedDeck.length > 0) {
      const cardsToDraw = Math.min(4 - handSize, state.sharedDeck.length)
      const newDeck = [...state.sharedDeck]
      const drawnCards = newDeck.splice(0, cardsToDraw)

      if (forPlayer) {
        newState = {
          ...newState,
          playerHand: [...state.playerHand, ...drawnCards],
          sharedDeck: newDeck,
          message: `You played ${card.name} and drew ${cardsToDraw} card${cardsToDraw !== 1 ? "s" : ""}.`,
        }
      } else {
        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, ...drawnCards],
          sharedDeck: newDeck,
          message: `AI played ${card.name} and drew ${cardsToDraw} card${cardsToDraw !== 1 ? "s" : ""}.`,
        }
      }
    } else {
      newState = {
        ...newState,
        message: `${forPlayer ? "You" : "AI"} played ${card.name}, but already has 4 or more cards.`,
      }
    }
  }

  // Frog: "On play, destroy the animal your opponent controls with fewer points (your choice if tied)."
  else if (card.name === "Frog") {
    if (forPlayer && state.opponentField.length > 0) {
      // Find all animals with the minimum points
      const minPoints = Math.min(...state.opponentField.map((c) => c.points || 0))
      const minPointAnimals = state.opponentField.filter((c) => (c.points || 0) === minPoints)

      if (minPointAnimals.length === 1) {
        // Only one animal with minimum points
        const targetIndex = state.opponentField.findIndex((c) => c.id === minPointAnimals[0].id)
        const targetCard = state.opponentField[targetIndex]
        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex, 1)

        newState = {
          ...newState,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDiscard: [...state.sharedDiscard, targetCard],
          message: `You played ${card.name} and destroyed the opponent's ${targetCard.name}.`,
        }
      } else if (minPointAnimals.length > 1) {
        // Multiple animals with minimum points, player chooses
        newState = {
          ...newState,
          pendingEffect: {
            type: "frog",
            forPlayer,
          },
          message: `You played ${card.name}. Select an opponent's animal with ${minPoints} point${minPoints !== 1 ? "s" : ""} to destroy.`,
        }
      }
    } else if (!forPlayer && state.playerField.length > 0) {
      // Find all animals with the minimum points
      const minPoints = Math.min(...state.playerField.map((c) => c.points || 0))
      const minPointAnimals = state.playerField.filter((c) => (c.points || 0) === minPoints)

      // AI chooses the animal with the highest points among those with minimum points
      // (in case of a tie in minimum points)
      const targetIndex = state.playerField.findIndex((c) => c.id === minPointAnimals[0].id)
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

  // Crab: "On play, look at the top 2 cards: add 1 to hand and send the other to deck bottom."
  else if (card.name === "Crab") {
    if (state.sharedDeck.length > 0) {
      const topCards = state.sharedDeck.slice(0, Math.min(2, state.sharedDeck.length))

      if (forPlayer) {
        // Always show the selection window, even if there's only 1 card
        newState = {
          ...newState,
          pendingEffect: {
            type: "crab",
            forPlayer,
          },
          message: `You played ${card.name}. Look at the top ${topCards.length} card${topCards.length !== 1 ? "s" : ""} and choose 1 to add to your hand.`,
        }
      } else {
        // AI automatically selects the better card
        if (topCards.length === 1) {
          const newDeck = [...state.sharedDeck]
          const drawnCard = newDeck.shift()!

          newState = {
            ...newState,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `AI played ${card.name} and added the top card to its hand.`,
          }
        } else {
          // AI chooses the better card based on points for animals, or just the first impact card
          const betterCardIndex =
            topCards[0].type === "animal" && topCards[1].type === "animal"
              ? (topCards[0].points || 0) >= (topCards[1].points || 0)
                ? 0
                : 1
              : topCards[0].type === "animal"
                ? 0
                : 1

          const newDeck = [...state.sharedDeck]
          const drawnCard = newDeck.splice(betterCardIndex, 1)[0]
          const bottomCard = newDeck.shift()!
          newDeck.push(bottomCard)

          newState = {
            ...newState,
            opponentHand: [...state.opponentHand, drawnCard],
            sharedDeck: newDeck,
            message: `AI played ${card.name} and added a card to its hand.`,
          }
        }
      }
    }
  }

  // Otter: "On play, if you have 7 or more points, your opponents gives you a random card from their hand to your hand."
  else if (card.name === "Otter") {
    const points = forPlayer ? state.playerPoints : state.opponentPoints

    if (points >= 7) {
      if (forPlayer && state.opponentHand.length > 0) {
        // Select a random card from opponent's hand
        const randomIndex = Math.floor(Math.random() * state.opponentHand.length)
        const targetCard = state.opponentHand[randomIndex]
        const newOpponentHand = [...state.opponentHand]
        newOpponentHand.splice(randomIndex, 1)

        newState = {
          ...newState,
          playerHand: [...state.playerHand, targetCard],
          opponentHand: newOpponentHand,
          message: `You played ${card.name}. Since you have 7+ points, AI gave you a card.`,
        }
      } else if (!forPlayer && state.playerHand.length > 0) {
        // Select a random card from player's hand
        const randomIndex = Math.floor(Math.random() * state.playerHand.length)
        const targetCard = state.playerHand[randomIndex]
        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(randomIndex, 1)

        newState = {
          ...newState,
          opponentHand: [...state.opponentHand, targetCard],
          playerHand: newPlayerHand,
          message: `AI played ${card.name}. Since it has 7+ points, you gave it ${targetCard.name}.`,
        }
      }
    } else {
      newState = {
        ...newState,
        message: `${forPlayer ? "You" : "AI"} played ${card.name}, but doesn't have 7+ points yet.`,
      }
    }
  }

  // Crocodile: "Send 1 animal you control to hand to play this card. On play, send 1 animal of 3 or fewer points your opponent controls to deck bottom."
  else if (card.name === "Crocodile") {
    // Note: The "send to hand" part should be handled before playing the card
    // Here we just handle the "on play" effect
    const validTargets = forPlayer
      ? state.opponentField.filter((c) => (c.points || 0) <= 3)
      : state.playerField.filter((c) => (c.points || 0) <= 3)

    if (forPlayer && validTargets.length > 0) {
      newState = {
        ...newState,
        pendingEffect: {
          type: "crocodile",
          forPlayer,
        },
        message: `You played ${card.name}. Select an opponent's animal with 3 or fewer points to send to the bottom of the deck.`,
      }
    } else if (!forPlayer && validTargets.length > 0) {
      // AI targets the highest value eligible animal
      const targetIndex = validTargets
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
        sharedDeck: [...state.sharedDeck, targetCard], // Add to bottom of deck
        message: `AI played ${card.name} and sent your ${targetCard.name} to the bottom of the deck.`,
      }
    }
  }

  return newState
}

// Helper function to resolve animal effect selections
export function resolveAnimalEffect(state: GameState, targetIndex: number | number[]): GameState {
  if (!state.pendingEffect || !state.pendingEffect.type) return state

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
          sharedDeck: [targetCard, ...state.sharedDeck], // Add to top of deck
          pendingEffect: null,
          message: `You sent the opponent's ${targetCard.name} to the top of deck.`,
        }
      }
      break

    case "squirrel":
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

    case "snake":
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

    case "zebra":
      if (forPlayer) {
        // Just close the effect, the UI should have shown the opponent's hand
        return {
          ...state,
          pendingEffect: null,
          message: `You've seen your opponent's hand.`,
        }
      }
      break

    case "deer":
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

    case "tuna":
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
      }
      break

    case "turtle":
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
      }
      break

    case "dolphin":
      if (forPlayer) {
        // Player selecting a card to send to bottom of deck
        const targetCard = state.playerHand[targetIndex as number]
        if (!targetCard) return state

        const newPlayerHand = [...state.playerHand]
        newPlayerHand.splice(targetIndex as number, 1)

        // Draw a card if there are cards in the deck
        let drawnCard = null
        let newDeck = [...state.sharedDeck, targetCard] // Add to bottom

        if (state.sharedDeck.length > 0) {
          drawnCard = state.sharedDeck[0]
          newDeck = [...state.sharedDeck.slice(1), targetCard]
        }

        return {
          ...state,
          playerHand: drawnCard ? [...newPlayerHand, drawnCard] : newPlayerHand,
          sharedDeck: newDeck,
          pendingEffect: null,
          message: drawnCard
            ? `You sent ${targetCard.name} to the bottom of the deck and drew a card.`
            : `You sent ${targetCard.name} to the bottom of the deck, but there were no cards to draw.`,
        }
      }
      break

    case "octopus":
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

    case "frog":
      if (forPlayer) {
        // Player selecting an opponent's animal with minimum points to destroy
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
      }
      break

    case "crab":
      if (forPlayer) {
        // Player selecting which card to add to hand
        if (state.sharedDeck.length === 1) {
          // If there's only one card, just add it to hand
          const selectedCard = state.sharedDeck[0]

          return {
            ...state,
            playerHand: [...state.playerHand, selectedCard],
            sharedDeck: state.sharedDeck.slice(1),
            pendingEffect: null,
            message: `You added ${selectedCard.name} to your hand.`,
          }
        } else if (state.sharedDeck.length >= 2) {
          // If there are two cards, add the selected one to hand and the other to bottom
          const topCards = state.sharedDeck.slice(0, 2)
          const selectedCard = topCards[targetIndex as number]
          const otherCard = topCards[1 - (targetIndex as number)]

          // Create new deck without the top 2 cards, add other card to bottom
          const newDeck = [...state.sharedDeck.slice(2), otherCard]

          return {
            ...state,
            playerHand: [...state.playerHand, selectedCard],
            sharedDeck: newDeck,
            pendingEffect: null,
            message: `You added ${selectedCard.name} to your hand and sent ${otherCard.name} to the bottom of the deck.`,
          }
        }
      }
      break

    case "crocodile":
      if (forPlayer) {
        // Player selecting an opponent's animal with 3 or fewer points to send to deck bottom
        const targetCard = state.opponentField[targetIndex as number]
        if (!targetCard || (targetCard.points || 0) > 3) return state

        const newOpponentField = [...state.opponentField]
        newOpponentField.splice(targetIndex as number, 1)

        return {
          ...state,
          opponentField: newOpponentField,
          opponentPoints: state.opponentPoints - (targetCard.points || 0),
          sharedDeck: [...state.sharedDeck, targetCard], // Add to bottom
          pendingEffect: null,
          message: `You sent the opponent's ${targetCard.name} to the bottom of the deck.`,
        }
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
