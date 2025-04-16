"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RefreshCw, Crown, Layers } from "lucide-react"
import { GameBoard } from "@/components/game-board"
import { PlayerHand } from "@/components/player-hand"
import { OpponentHand } from "@/components/opponent-hand"
import { CardSelectionModal } from "@/components/card-selection-modal"
import { TargetSelectionModal } from "@/components/target-selection-modal"
import { CardDetailModal } from "@/components/card-detail-modal"
import { AnimationStyles } from "@/components/animation-styles"
import { getCardArt } from "@/components/card-art/card-art-mapper"
import {
  initializeGame,
  drawCards,
  playAnimalCard,
  playImpactCard,
  endPlayerTurn,
  makeAIDecision,
  endAITurn,
  sendCardsToBottom,
  resolveEffect,
} from "@/utils/game-utils"
import type { GameCard, GameState } from "@/types/game"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DiscardPileGallery } from "@/components/discard-pile-gallery"

// Let's completely revise the AI card animation approach to make sure it falls onto the AI field.

// 1. First, update the confettiAnimation with a much simpler animation approach:

const confettiAnimation = `
@keyframes confetti {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
.animate-confetti {
  animation: confetti 3s ease-in-out infinite;
}

@keyframes ai-card-play {
  0% { transform: translateY(0) translateX(0) rotateY(180deg) scale(1); opacity: 0.9; }
  50% { transform: translateY(0) translateX(0) rotateY(90deg) scale(1); opacity: 1; }
  100% { transform: translateY(0) translateX(0) rotateY(0deg) scale(1); opacity: 1; }
}
.animate-ai-card-play {
  animation: ai-card-play 1.5s ease-in-out forwards;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform-origin: center;
  backface-visibility: hidden;
}

@keyframes fall-to-field {
  0% { top: 30%; left: 50%; transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
  100% { top: 15%; left: 50%; transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
}
.ai-card-animation {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
}
.fall-to-field {
  animation: fall-to-field 1s ease-in-out forwards;
}
`

// Helper function to generate zone transfer animation class
const getZoneTransferAnimation = (fromZone: string, toZone: string) => {
  return `animate-zone-transfer-${fromZone}-to-${toZone}`
}

// Helper function to generate exchange animation class
const getExchangeAnimation = (isPlayerCard: boolean) => {
  return `animate-exchange-${isPlayerCard ? "player" : "opponent"}`
}

// Helper function to create particles
const createParticles = (element: HTMLElement, color: string, count = 10) => {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.backgroundColor = color
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.setProperty("--x-offset", `${(Math.random() - 0.5) * 20}px`)

    element.appendChild(particle)

    // Remove particle after animation completes
    setTimeout(() => {
      if (element.contains(particle)) {
        element.removeChild(particle)
      }
    }, 1000)
  }
}

export default function GameMatch() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false) // Fixed initialization
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [lastGameMessage, setLastGameMessage] = useState<string>("")

  // Animation states
  const [newCardIds, setNewCardIds] = useState<number[]>([])
  const [newPlayerFieldCardId, setNewPlayerFieldCardId] = useState<number | null>(null)
  const [newOpponentFieldCardId, setNewOpponentFieldCardId] = useState<number | null>(null)
  const [playingCardId, setPlayingCardId] = useState<number | null>(null)
  const [aiPlayingCardId, setAiPlayingCardId] = useState<number | null>(null)
  const [aiDrawingCards, setAiDrawingCards] = useState(false)
  const [aiDiscardingCards, setAiDiscardingCards] = useState(false)
  const [aiDiscardedCardIds, setAiDiscardedCardIds] = useState<number[]>([])
  const [aiDrawnCardCount, setAiDrawnCardCount] = useState(0)

  // Add new state for AI card play animation
  const [aiPlayedCard, setAiPlayedCard] = useState<GameCard | null>(null)
  const [showAiCardAnimation, setShowAiCardAnimation] = useState(false)
  const [aiCardAnimationPhase, setAiCardAnimationPhase] = useState<"flip" | "toField" | "done">("flip")
  const [aiCardFieldPosition, setAiCardFieldPosition] = useState({ top: 0, left: 0 })

  // Add new animation states for discard/return to deck
  const [discardingCardId, setDiscardingCardId] = useState<number | null>(null)
  const [returningToDeckCardId, setReturningToDeckCardId] = useState<number | null>(null)

  // States for card selection modals
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [discardCount, setDiscardCount] = useState(0)
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetTitle, setTargetTitle] = useState("")
  const [targetDescription, setTargetDescription] = useState("")
  const [targetFilter, setTargetFilter] = useState<((card: GameCard) => boolean) | undefined>(undefined)
  const [targetCards, setTargetCards] = useState<GameCard[]>([])

  // Add a new state for player card indices
  const [playerCardIndices, setPlayerCardIndices] = useState<number[]>([])

  // First, add a new state for handling AI trap selection
  // Add this with the other state declarations:
  const [showAITrapModal, setShowAITrapModal] = useState(false)

  // Add a new state for quit confirmation
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false)

  // Add a new state for managing animation queue
  // Add this with the other state declarations near the top of the component
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationQueue, setAnimationQueue] = useState<Array<() => Promise<void>>>([])

  // Add a flag to track when we're handling a Confuse effect
  const [isHandlingConfuse, setIsHandlingConfuse] = useState(false)

  // Add a flag to prevent reopening the modal for Confuse effect
  const skipConfuseModalRef = useRef(false)

  // Add a ref to track the game board element for particle effects
  const gameBoardRef = useRef<HTMLDivElement>(null)
  const opponentFieldRef = useRef<HTMLDivElement>(null)

  // Add a ref to store the last played card for cancellation
  const lastPlayedCardRef = useRef<GameCard | null>(null)

  // Add a new state to track when the discard gallery should be shown
  // Add this with the other state declarations near the top of the component
  const [showDiscardGallery, setShowDiscardGallery] = useState(false)

  // First, add this effect to update the message whenever gameState changes
  useEffect(() => {
    if (gameState && gameState.message) {
      setLastGameMessage(gameState.message)
    }
  }, [gameState])

  // Add this at the top of the component as a useCallback hook
  const handleBackToMenu = useCallback(() => {
    if (gameState?.gameStatus !== "playing") {
      router.push("/")
      return
    }

    // Show confirmation dialog if the game is in progress
    setAlertMessage("Are you sure you want to quit the current game?")
    setShowQuitConfirmation(true)
  }, [gameState?.gameStatus, router])

  // Helper function to add particle effects
  const addParticleEffect = (cardId: number, color: string) => {
    // Find the card element
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
    if (cardElement instanceof HTMLElement) {
      createParticles(cardElement, color, 15)
    }
  }

  // Initialize game
  useEffect(() => {
    const newGame = initializeGame()
    setGameState(newGame)
    setLastGameMessage("Game started. Your turn.")
  }, [])

  // AI turn logic
  useEffect(() => {
    if (!gameState || gameState.currentTurn !== "opponent" || gameState.gameStatus !== "playing") {
      return
    }

    // Add a delay to simulate AI thinking
    setIsAIThinking(true)
    const aiTimer = setTimeout(() => {
      // Store the current hand and field length to detect changes
      const currentOpponentHandLength = gameState.opponentHand.length
      const currentOpponentFieldLength = gameState.opponentField.length

      // Check if AI needs to discard cards before drawing
      if (
        gameState.opponentHand.length >= 5 &&
        gameState.opponentHand.every((card) => card.type === "impact" || (card.points || 0) <= 1)
      ) {
        // AI has only impact cards or low-value animals, so it should draw
        setAnimationQueue((prev) => [
          ...prev,
          async () => {
            setAiDiscardingCards(true)

            // Determine how many cards to discard
            const discardCount = gameState.opponentHand.length === 5 ? 1 : 2

            // Choose cards to discard
            const discardIndices: number[] = []
            const sortedCards = [...gameState.opponentHand]
              .map((card, index) => ({ card, index }))
              .sort((a, b) => {
                if (a.card.type === "animal" && b.card.type === "animal") {
                  return (a.card.points || 0) - (b.card.points || 0)
                }
                return a.card.type === "impact" ? -1 : 1
              })

            for (let i = 0; i < discardCount; i++) {
              discardIndices.push(sortedCards[i].index)
            }

            // Get the IDs of cards being discarded for animation
            const discardedCardIds = discardIndices.map((index) => gameState.opponentHand[index].id)
            setAiDiscardedCardIds(discardedCardIds)

            // Allow discard animation to run
            await new Promise((resolve) => setTimeout(resolve, 1200))

            const afterDiscard = sendCardsToBottom(gameState, discardIndices, false)
            console.log(`AI sent ${discardCount} card(s) to the bottom of the deck.`)

            setAiDiscardingCards(false)
            setAiDrawingCards(true)
            setAiDrawnCardCount(2)

            // Allow draw animation to run
            await new Promise((resolve) => setTimeout(resolve, 800))

            const afterDraw = drawCards(afterDiscard, 2, false)
            console.log(`AI drew 2 cards.`)

            // End AI turn after animation completes
            await new Promise((resolve) => setTimeout(resolve, 500))

            setAiDrawingCards(false)
            setGameState(endAITurn(afterDraw))
          },
        ])

        return
      }

      // Make AI decision
      const afterAIMove = makeAIDecision(gameState)

      // Check if AI drew cards
      if (afterAIMove.opponentHand.length > currentOpponentHandLength) {
        // Add the animation to the queue
        setAnimationQueue((prev) => [
          ...prev,
          async () => {
            setAiDrawingCards(true)
            setAiDrawnCardCount(afterAIMove.opponentHand.length - currentOpponentHandLength)
            console.log(`AI drew ${afterAIMove.opponentHand.length - currentOpponentHandLength} cards.`)

            // End AI thinking state
            setIsAIThinking(false)

            // Allow draw animation to complete
            await new Promise((resolve) => setTimeout(resolve, 600))

            setAiDrawingCards(false)
            setGameState(endAITurn(afterAIMove))
          },
        ])

        return
      }

      // Check if a new card was played to the field
      if (afterAIMove.opponentField.length > currentOpponentFieldLength) {
        // Get the newly played card
        const newCard = afterAIMove.opponentField[afterAIMove.opponentField.length - 1]

        // Update the AI card play animation section
        // Find the setAnimationQueue where AI plays a card (look for newOpponentFieldCardId)
        setAnimationQueue((prev) => [
          ...prev,
          async () => {
            // Set the playing card ID for hand animation
            setAiPlayingCardId(1) // Just use 1 as a dummy ID since we don't know which card in hand was played

            // Show the AI card play animation
            setAiPlayedCard(newCard)
            setAiCardAnimationPhase("flip")
            setShowAiCardAnimation(true)

            // Log AI's action
            if (afterAIMove.message !== gameState.message) {
              console.log(afterAIMove.message)
            }

            // Wait for the flip animation to complete
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Set animation phase to move card to field position
            setAiCardAnimationPhase("toField")

            // Wait for card to fall to field
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Hide the animation overlay and show the card on the field
            setShowAiCardAnimation(false)
            setAiPlayingCardId(null)
            setNewOpponentFieldCardId(newCard.id)

            // End AI thinking state
            setIsAIThinking(false)

            // Add particle effect based on card type
            if (newCard.type === "animal") {
              let particleColor = "#ff6666" // Default red for terrestrial
              if (newCard.environment === "aquatic") particleColor = "#6666ff"
              else if (newCard.environment === "amphibian") particleColor = "#66ff66"

              // Wait a moment for the card to appear on the board
              setTimeout(() => {
                addParticleEffect(newCard.id, particleColor)
              }, 100)
            } else {
              // Impact card
              setTimeout(() => {
                addParticleEffect(newCard.id, "#aa66ff")
              }, 100)
            }

            // Allow field animation to complete
            await new Promise((resolve) => setTimeout(resolve, 600))

            setNewOpponentFieldCardId(null)
            setGameState(endAITurn(afterAIMove))
          },
        ])

        return
      }

      // Check if AI played Trap card
      if (afterAIMove.message.includes("AI played Trap")) {
        console.log("AI played Trap. You must choose an animal to give.")

        // End AI thinking state
        setIsAIThinking(false)

        // Set up the trap selection modal
        setTargetTitle("Choose Animal to Give")
        setTargetDescription("AI played Trap. Select one of your animals to give to the AI.")
        setTargetFilter(undefined)
        setTargetCards(afterAIMove.playerField)
        setPlayerCardIndices(Array.from({ length: afterAIMove.playerField.length }, (_, i) => i))

        // Show the trap selection modal
        setShowAITrapModal(true)

        // Store the current state but don't end AI turn yet
        setGameState({
          ...afterAIMove,
          pendingEffect: {
            type: "trap",
            forPlayer: false,
          },
        })
      }
      // Check if player played Trap - need to let AI choose an animal
      else if (
        afterAIMove.pendingEffect &&
        afterAIMove.pendingEffect.type === "trap" &&
        afterAIMove.pendingEffect.forPlayer
      ) {
        // AI automatically selects the lowest value animal
        console.log("AI is choosing an animal to give you.")

        // Resolve the effect automatically without showing a modal
        const resolvedState = resolveEffect(afterAIMove, 0) // The AI choice logic is in resolveEffect

        if (resolvedState.message !== afterAIMove.message) {
          console.log(resolvedState.message)
        }

        // End AI thinking state
        setIsAIThinking(false)

        // End AI turn
        setGameState(endAITurn(resolvedState))
      } else {
        // Log AI's action if no card was played or drawn
        if (afterAIMove.message !== gameState.message) {
          console.log(afterAIMove.message)
        }

        // End AI thinking state
        setIsAIThinking(false)

        // End AI turn
        setGameState(endAITurn(afterAIMove))
      }
    }, 500)

    return () => clearTimeout(aiTimer)
  }, [gameState])

  // Add this useEffect to process the animation queue
  // Add this after the other useEffect hooks
  useEffect(() => {
    const processQueue = async () => {
      if (animationQueue.length > 0 && !isAnimating) {
        setIsAnimating(true)
        const nextAnimation = animationQueue[0]

        try {
          await nextAnimation()
        } catch (error) {
          console.error("Animation error:", error)
        } finally {
          // Remove the processed animation from queue
          setAnimationQueue((prev) => prev.slice(1))
          setIsAnimating(false)
        }
      }
    }

    processQueue()
  }, [animationQueue, isAnimating])

  // Check for game over
  useEffect(() => {
    if (!gameState) return

    if (gameState.gameStatus !== "playing") {
      setAlertMessage(
        gameState.gameStatus === "playerWin" ? "Congratulations! You won the game!" : "The AI has won the game.",
      )
      setShowAlert(true)

      // Log game result
      console.log(gameState.gameStatus === "playerWin" ? "🏆 You won the game!" : "AI won the game.")

      // Add victory particles
      if (gameBoardRef.current) {
        const colors = ["#ffd700", "#ffff00", "#ff9900", "#ff0000", "#00ff00", "#0000ff"]
        for (let i = 0; i < 30; i++) {
          setTimeout(() => {
            const color = colors[Math.floor(Math.random() * colors.length)]
            const particle = document.createElement("div")
            particle.className = "confetti"
            particle.style.backgroundColor = color
            particle.style.left = `${Math.random() * 100}%`
            particle.style.top = "0"
            particle.style.animationDelay = `${Math.random() * 2}s`
            particle.style.animationDuration = `${Math.random() * 2 + 2}s`

            gameBoardRef.current?.appendChild(particle)

            // Remove particle after animation completes
            setTimeout(() => {
              if (gameBoardRef.current?.contains(particle)) {
                gameBoardRef.current.removeChild(particle)
              }
            }, 4000)
          }, i * 100)
        }
      }
    }
  }, [gameState])

  // Add a new function to handle canceling effects
  const handleCancelEffect = () => {
    if (!gameState || !gameState.pendingEffect) return

    // Find the last played card in the discard pile
    // We need to find the most recently added impact card
    const lastPlayedCard = lastPlayedCardRef.current

    if (lastPlayedCard) {
      // Remove the card from the discard pile
      const newDiscard = [...gameState.sharedDiscard].filter((card) => card.id !== lastPlayedCard.id)

      // Add the card back to the player's hand
      const newHand = [...gameState.playerHand, lastPlayedCard]

      // Create a copy of the current state without the pending effect
      // and with the card back in the player's hand
      setGameState({
        ...gameState,
        playerHand: newHand,
        sharedDiscard: newDiscard,
        pendingEffect: null,
        message: "Effect canceled. Card returned to your hand.",
      })

      // Clear the last played card reference
      lastPlayedCardRef.current = null
    } else {
      // If we can't find the card (shouldn't happen), just clear the pending effect
      setGameState({
        ...gameState,
        pendingEffect: null,
        message: "Effect canceled. Your turn continues.",
      })
    }

    console.log("You canceled the effect.")
    setShowTargetModal(false)
  }

  // Handle AI trap selection
  const handleAITrapSelection = (targetIndex: number | number[]) => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Show discard animation for the selected card
        const cardId = gameState.playerField[targetIndex as number].id
        setDiscardingCardId(cardId)

        // Add particle effect for the trap
        setTimeout(() => {
          addParticleEffect(cardId, "#aa66ff")
        }, 100)

        // Allow animation to play
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Resolve the trap effect
        const newState = resolveEffect(gameState, targetIndex as number)

        // Log the effect resolution
        if (newState.message !== gameState.message) {
          console.log(newState.message)
        }

        // Clear the animation state
        setDiscardingCardId(null)

        // End AI's turn
        setGameState(endAITurn(newState))
        setShowAITrapModal(false)
      },
    ])
  }

  // Handle confuse effect selection - completely rewritten
  const handleConfuseSelection = (playerIdx: number, opponentIdx: number) => {
    if (!gameState || !gameState.pendingEffect) return

    // Set the flag to indicate we're handling a Confuse effect
    setIsHandlingConfuse(true)

    // Set the flag to prevent reopening the modal
    skipConfuseModalRef.current = true

    // Close the modal immediately
    setShowTargetModal(false)

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Get the card IDs
          const playerCardId = gameState.playerField[playerIdx].id
          const opponentCardId = gameState.opponentField[opponentIdx].id

          // Add animation classes for zone transfer
          const playerCardElement = document.querySelector(`[data-card-id="${playerCardId}"]`)
          const opponentCardElement = document.querySelector(`[data-card-id="${opponentCardId}"]`)

          if (playerCardElement) {
            playerCardElement.classList.add(getExchangeAnimation(true))

            // Add particle effect
            setTimeout(() => {
              addParticleEffect(playerCardId, "#ffff00") // Yellow particles for exchange
            }, 100)
          }

          if (opponentCardElement) {
            opponentCardElement.classList.add(getExchangeAnimation(false))

            // Add particle effect
            setTimeout(() => {
              addParticleEffect(opponentCardId, "#ffff00") // Yellow particles for exchange
            }, 100)
          }

          // Delay the effect resolution to allow animation to complete
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Directly exchange the cards without using resolveEffect
          const playerCard = gameState.playerField[playerIdx]
          const opponentCard = gameState.opponentField[opponentIdx]

          // Create new arrays with the cards exchanged
          const newPlayerField = [...gameState.playerField]
          const newOpponentField = [...gameState.opponentField]

          // Remove the cards from their original positions
          newPlayerField.splice(playerIdx, 1)
          newOpponentField.splice(opponentIdx, 1)

          // Add the cards to their new positions
          newPlayerField.push(opponentCard)
          newOpponentField.push(playerCard)

          // Calculate new points
          const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)
          const newOpponentPoints = newOpponentField.reduce((sum, card) => sum + (card.points || 0), 0)

          // Create the new state
          const newState = {
            ...gameState,
            playerField: newPlayerField,
            opponentField: newOpponentField,
            playerPoints: newPlayerPoints,
            opponentPoints: newOpponentPoints,
            pendingEffect: null,
            message: `You exchanged ${playerCard.name} with the AI's ${opponentCard.name}.`,
          }

          // Log the effect resolution
          console.log(newState.message)

          // Clear the last played card reference since the effect has been resolved
          lastPlayedCardRef.current = null

          // End player's turn
          setGameState(endPlayerTurn(newState))
        } finally {
          // Reset the flags after the animation is complete
          setIsHandlingConfuse(false)
          skipConfuseModalRef.current = false
        }
      },
    ])
  }

  // Check for pending effects
  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    // Skip if we're already showing the target modal or handling a Confuse effect
    // or if we've set the flag to skip the Confuse modal
    if (showTargetModal || isHandlingConfuse || skipConfuseModalRef.current) return

    // Safely access properties with optional chaining
    const type = gameState.pendingEffect?.type
    const forPlayer = gameState.pendingEffect?.forPlayer

    if (!type || forPlayer === undefined) return // AI handles its own effects or invalid effect

    // For the "scare" effect, we need to determine which cards belong to the player
    let playerCardIndices: number[] = []

    // Set up target selection for different effect types
    switch (type) {
      case "hunter":
        setTargetTitle("Select Target")
        setTargetDescription("Select a terrestrial animal to destroy.")
        // Updated to include amphibians as valid targets for terrestrial effects
        setTargetFilter((card) => card?.environment === "terrestrial" || card?.environment === "amphibian")
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // All cards are opponent's cards, so playerCardIndices remains empty
        playerCardIndices = []
        break

      case "fisher":
        setTargetTitle("Select Target")
        setTargetDescription("Select an aquatic animal to destroy.")
        // Updated to include amphibians as valid targets for aquatic effects
        setTargetFilter((card) => card?.environment === "aquatic" || card?.environment === "amphibian")
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // All cards are opponent's cards, so playerCardIndices remains empty
        playerCardIndices = []
        break

      case "scare":
        setTargetTitle("Select Target")
        setTargetDescription("Select an animal to send to the top of the deck.")
        setTargetFilter(undefined)
        setTargetCards([...gameState.playerField, ...gameState.opponentField])
        setShowTargetModal(true)
        // Mark player's cards
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

      case "veterinarian":
        setTargetTitle("Select Animal")
        setTargetDescription("Select an animal from the discard pile to play.")
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards(gameState.sharedDiscard.filter((card) => card.type === "animal"))
        setShowTargetModal(true)
        // Discard pile cards don't belong to either player
        playerCardIndices = []
        break

      case "confuse":
        setTargetTitle("Exchange Animals")
        setTargetDescription("Select one of your animals and one of the opponent's animals to exchange control.")
        // For Confuse, we'll use the special UI that shows both boards separately
        setShowTargetModal(true)
        // We don't need these for the Confuse effect as we're using a different UI
        setTargetCards([])
        setTargetFilter(undefined)
        playerCardIndices = []
        break

      case "domesticate":
        setTargetTitle("Select Animal")
        setTargetDescription("Select a 2-point animal to gain control of.")
        setTargetFilter((card) => card?.points === 2)
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // All cards are opponent's cards
        playerCardIndices = []
        break

      case "trap":
        setTargetTitle("Select Animal")
        setTargetDescription("Select an animal to trap and gain control of.")
        setTargetFilter(undefined)
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // All cards are opponent's cards
        playerCardIndices = []
        break

      case "release":
        setTargetTitle("Select Animal")
        setTargetDescription(`Play an animal from your hand (${gameState.pendingEffect.animalsPlayed || 0}/2).`)
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards(gameState.playerHand)
        setShowTargetModal(true)
        // All cards are player's cards
        playerCardIndices = Array.from({ length: gameState.playerHand.length }, (_, i) => i)
        break

      case "epidemic":
        setTargetTitle("Select Target Animal")
        setTargetDescription(
          "Select one of your animals. All animals of the same environment with more points will be sent to the bottom of the deck.",
        )
        setTargetFilter((card) => card?.type === "animal")
        // Only show player's field for epidemic
        setTargetCards(gameState.playerField)
        setShowTargetModal(true)
        // All cards are player's cards
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

      case "compete":
        setTargetTitle("Select Animal from Hand")
        setTargetDescription(
          "Select an animal from your hand. All animals on the field with the same point value will be sent to the bottom of the deck.",
        )
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards(gameState.playerHand)
        setShowTargetModal(true)
        // All cards are player's cards
        playerCardIndices = Array.from({ length: gameState.playerHand.length }, (_, i) => i)
        break

      case "prey":
        setTargetTitle("Select Your Animal")
        setTargetDescription(
          "Select an animal on your field. All animals of the same environment with fewer points will be sent to the bottom of the deck.",
        )
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards(gameState.playerField)
        setShowTargetModal(true)
        // All cards are player's cards
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

      case "cage":
        if (!gameState.pendingEffect.firstSelection) {
          // First selection: animal from field to send to discard pile
          setTargetTitle("Select Animal from Field")
          setTargetDescription("Select one of your animals to send to the discard pile.")
          setTargetFilter((card) => card?.type === "animal")
          setTargetCards(gameState.playerField)
          setShowTargetModal(true)
          // All cards are player's cards
          playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        } else {
          // Second selection: animal on opponent's field to gain control of
          setTargetTitle("Select Animal to Cage")
          setTargetDescription("Select an opponent's animal to gain control of.")
          setTargetFilter((card) => card?.type === "animal")
          setTargetCards(gameState.opponentField)
          setShowTargetModal(true)
          // All cards are opponent's cards
          playerCardIndices = []
        }
        break

      case "limit":
        setTargetTitle("Select Target")
        setTargetDescription("Select an animal to destroy.")
        setTargetFilter(undefined)
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // All cards are opponent's cards
        playerCardIndices = []
        break

      // Add more cases as needed
    }

    // Store the player card indices
    setPlayerCardIndices(playerCardIndices)
  }, [gameState, showTargetModal, isHandlingConfuse])

  // Handle player drawing cards
  const handleDrawCards = () => {
    if (!gameState) return

    // Check if player needs to discard first
    if (gameState.playerHand.length >= 5) {
      setDiscardCount(gameState.playerHand.length === 5 ? 1 : 2)
      setShowDiscardModal(true)
      return
    }

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Store current hand length to detect new cards
        const currentHandLength = gameState.playerHand.length

        // Draw 2 cards
        const newState = drawCards(gameState, 2, true)
        console.log("You drew 2 cards.")

        // Get IDs of newly drawn cards for animation
        const drawnCardIds = newState.playerHand.slice(currentHandLength).map((card) => card.id)

        setNewCardIds(drawnCardIds)

        // End player's turn
        setGameState(endPlayerTurn(newState))

        // Clear animation state after a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setNewCardIds([])
      },
    ])
  }

  // Handle player selecting a card to view details
  const handleSelectCard = (cardIndex: number) => {
    setSelectedCardIndex(cardIndex)
    setShowCardDetail(true)
  }

  // Find the handlePlayCard function and update it to check if the card was successfully played
  // Handle player playing a card from the detail view
  const handlePlayCard = () => {
    if (!gameState || gameState.currentTurn !== "player" || selectedCardIndex === null) return

    const card = gameState.playerHand[selectedCardIndex]
    if (!card || !card.type) return

    // Add the animation to the queue instead of playing immediately
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Set the playing card ID for animation
        setPlayingCardId(card.id)

        // Delay the actual card play to allow animation to start
        await new Promise((resolve) => setTimeout(resolve, 300))

        let newState

        if (card.type === "animal") {
          newState = playAnimalCard(gameState, selectedCardIndex, true)
          console.log(`You played ${card.name} (${card.points} points).`)

          // Set the new card ID for field animation
          setNewPlayerFieldCardId(card.id)

          // Add particle effect based on environment
          setTimeout(() => {
            let particleColor = "#ff6666" // Default red for terrestrial
            if (card.environment === "aquatic") particleColor = "#6666ff"
            else if (card.environment === "amphibian") particleColor = "#66ff66"

            addParticleEffect(card.id, particleColor)
            particleColor = "#66ff66"

            addParticleEffect(card.id, particleColor)
          }, 400)
        } else {
          newState = playImpactCard(gameState, selectedCardIndex, true)

          // Store the card for potential cancellation
          lastPlayedCardRef.current = card

          // Check if the card was successfully played by looking at the message
          const cardPlayFailed =
            newState.message.includes("cannot play") || newState.message.includes("no valid targets")

          if (!cardPlayFailed) {
            console.log(`You played ${card.name}: ${card.effect}`)

            // Add purple particle effect for impact cards
            setTimeout(() => {
              addParticleEffect(card.id, "#aa66ff")
            }, 400)
          } else {
            // If card play failed, update the action message
            console.log(newState.message)

            // Clear animation states
            setPlayingCardId(null)

            // Update game state but don't end turn
            setGameState(newState)
            setShowCardDetail(false)
            setSelectedCardIndex(null)
            return
          }
        }

        // Close the card detail view
        setShowCardDetail(false)
        setSelectedCardIndex(null)

        // If there's a pending effect, don't end turn yet
        if (newState && newState.pendingEffect) {
          setGameState(newState)
          setPlayingCardId(null)
          return
        }

        // End player's turn
        setGameState(endPlayerTurn(newState))

        // Wait for field animation to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Clear animation states
        setNewPlayerFieldCardId(null)
        setPlayingCardId(null)
      },
    ])
  }

  // Handle card drop from drag and drop
  const handleCardDrop = (cardIndex: number) => {
    if (
      !gameState ||
      gameState.currentTurn !== "player" ||
      gameState.gameStatus !== "playing" ||
      gameState.pendingEffect
    )
      return

    const card = gameState.playerHand[cardIndex]
    if (!card) return

    // Add the animation to the queue instead of playing immediately
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Set the playing card ID for animation
        setPlayingCardId(card.id)

        // Wait for the card play animation
        await new Promise((resolve) => setTimeout(resolve, 300))

        let newState

        if (card.type === "animal") {
          newState = playAnimalCard(gameState, cardIndex, true)
          console.log(`You played ${card.name} (${card.points} points).`)

          // Set the new card ID for field animation
          setNewPlayerFieldCardId(card.id)

          // Add particle effect based on environment
          setTimeout(() => {
            let particleColor = "#ff6666" // Default red for terrestrial
            if (card.environment === "aquatic") particleColor = "#6666ff"
            else if (card.environment === "amphibian") particleColor = "#66ff66"

            addParticleEffect(card.id, particleColor)
          }, 400)
        } else {
          newState = playImpactCard(gameState, cardIndex, true)

          // Store the card for potential cancellation
          lastPlayedCardRef.current = card

          // Check if the card was successfully played by looking at the message
          const cardPlayFailed =
            newState.message.includes("cannot play") || newState.message.includes("no valid targets")

          if (!cardPlayFailed) {
            console.log(`You played ${card.name}: ${card.effect}`)

            // Add purple particle effect for impact cards
            setTimeout(() => {
              addParticleEffect(card.id, "#aa66ff")
            }, 400)
          } else {
            // If card play failed, update the action message
            console.log(newState.message)

            // Clear animation states
            setPlayingCardId(null)

            // Update game state but don't end turn
            setGameState(newState)
            return
          }
        }

        // If there's a pending effect, don't end turn yet
        if (newState && newState.pendingEffect) {
          setGameState(newState)
          setPlayingCardId(null)
          return
        }

        // End player's turn
        setGameState(endPlayerTurn(newState))

        // Wait for field animation to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Clear animation states
        setNewPlayerFieldCardId(null)
        setPlayingCardId(null)
      },
    ])
  }

  // Handle discard selection
  const handleDiscardConfirm = (selectedIndices: number[]) => {
    if (!gameState) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Get the cards being discarded for animation
        const discardedCardIds = selectedIndices.map((index) => gameState.playerHand[index].id)

        // Set animation state for discarded cards
        setPlayingCardId(discardedCardIds[0]) // Just animate the first one for simplicity

        // Allow animation to start
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Send selected cards to bottom of deck
        const newState = sendCardsToBottom(gameState, selectedIndices, true)
        console.log(`You sent ${selectedIndices.length} card(s) to the bottom of the deck.`)

        // Store current hand length to detect new cards
        const currentHandLength = newState.playerHand.length

        // Draw 2 cards
        const afterDraw = drawCards(newState, 2, true)
        console.log("You drew 2 cards.")

        // Get IDs of newly drawn cards for animation
        const drawnCardIds = afterDraw.playerHand.slice(currentHandLength).map((card) => card.id)

        setNewCardIds(drawnCardIds)

        // End player's turn
        setGameState(endPlayerTurn(afterDraw))
        setShowDiscardModal(false)

        // Clear animation states after a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setNewCardIds([])
        setPlayingCardId(null)
      },
    ])
  }

  // Handle target selection
  const handleTargetConfirm = (targetIndex: number | number[]) => {
    if (!gameState || !gameState.pendingEffect) return

    // Special handling for Confuse effect
    if (gameState.pendingEffect.type === "confuse" && Array.isArray(targetIndex) && targetIndex.length === 2) {
      handleConfuseSelection(targetIndex[0], targetIndex[1])
      return
    }

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Show appropriate animation based on the effect type
        if (gameState.pendingEffect) {
          const { type } = gameState.pendingEffect

          // For effects that discard cards
          if (["hunter", "fisher", "limit"].includes(type)) {
            // Get the card ID for animation
            const idx = targetIndex as number
            const cardId = gameState.opponentField[idx].id
            setDiscardingCardId(cardId)

            // Add animation class for zone transfer
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
            if (cardElement) {
              cardElement.classList.add(getZoneTransferAnimation("field", "discard"))

              // Add particle effect
              setTimeout(() => {
                addParticleEffect(cardId, "#ff0000") // Red particles for destruction
              }, 100)
            }
          }

          // For effects that return cards to deck
          else if (["scare", "epidemic", "compete", "prey"].includes(type)) {
            // Handle single index or array of indices
            if (typeof targetIndex === "number") {
              let cardId
              if (type === "epidemic") {
                // For epidemic, we're only selecting from player field
                cardId = gameState.playerField[targetIndex].id
              } else if (type === "compete" || type === "prey") {
                // For compete, we're selecting from player hand or field
                cardId = gameState.playerHand[targetIndex].id
              } else {
                // For scare, we need to check if it's player or opponent field
                const playerFieldLength = gameState.playerField.length
                if (targetIndex < playerFieldLength) {
                  cardId = gameState.playerField[targetIndex].id
                } else {
                  cardId = gameState.opponentField[targetIndex - playerFieldLength].id
                }
              }
              setReturningToDeckCardId(cardId)

              // Add animation class for zone transfer
              const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
              if (cardElement) {
                cardElement.classList.add(getZoneTransferAnimation("field", "deck"))

                // Add particle effect
                setTimeout(() => {
                  addParticleEffect(cardId, "#00ffff") // Cyan particles for return to deck
                }, 100)
              }
            }
          }
          // Add animation for Cage card's first selection (sending to discard)
          else if (type === "cage" && !gameState.pendingEffect.firstSelection) {
            const cardId = gameState.playerField[targetIndex as number].id
            setDiscardingCardId(cardId)

            // Add animation class for zone transfer
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
            if (cardElement) {
              cardElement.classList.add(getZoneTransferAnimation("field", "discard"))

              // Add particle effect
              setTimeout(() => {
                addParticleEffect(cardId, "#ff0000") // Red particles for discard
              }, 100)
            }
          }
          // Add animation for Cage card's second selection (gaining control)
          else if (type === "cage" && gameState.pendingEffect.firstSelection) {
            const cardId = gameState.opponentField[targetIndex as number].id
            // Use a different animation for gaining control
            setNewPlayerFieldCardId(cardId)

            // Add animation class for zone transfer
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
            if (cardElement) {
              cardElement.classList.add(getZoneTransferAnimation("field", "opponent-field"))

              // Add particle effect
              setTimeout(() => {
                addParticleEffect(cardId, "#ffff00") // Yellow particles for control change
              }, 100)
            }
          }
          // Add animation for Trap card (when AI plays it and player selects)
          else if (type === "trap" && !gameState.pendingEffect.forPlayer) {
            const cardId = gameState.playerField[targetIndex as number].id
            setDiscardingCardId(cardId)

            // Add animation class for zone transfer
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
            if (cardElement) {
              cardElement.classList.add(getZoneTransferAnimation("field", "opponent-field"))

              // Add particle effect
              setTimeout(() => {
                addParticleEffect(cardId, "#ffff00") // Yellow particles for control change
              }, 100)
            }
          }
        }

        // Delay the effect resolution to allow animation to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Resolve the effect
        const newState = resolveEffect(gameState, targetIndex)

        // Log the effect resolution
        if (newState.message !== gameState.message) {
          console.log(newState.message)
        }

        // Clear animation states
        setDiscardingCardId(null)
        setReturningToDeckCardId(null)
        setNewPlayerFieldCardId(null)

        // Clear the last played card reference since the effect has been resolved
        lastPlayedCardRef.current = null

        // If there's still a pending effect, don't end turn yet
        if (newState.pendingEffect) {
          setGameState(newState)
          setShowTargetModal(false)
          return
        }

        // End player's turn
        setGameState(endPlayerTurn(newState))
        setShowTargetModal(false)
      },
    ])
  }

  // Handle game restart
  const handleRestartGame = () => {
    const newGame = initializeGame()
    setGameState(newGame)
    setShowAlert(false)
  }

  if (!gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <p>Loading game...</p>
      </div>
    )
  }

  // Update the main layout to be more compact and remove the game log
  return (
    <div
      className="flex flex-col bg-gradient-to-b from-green-800 to-green-950 p-0 text-white w-full min-h-screen"
      ref={gameBoardRef}
    >
      <AnimationStyles />
      <style jsx global>
        {confettiAnimation}
      </style>
      <div className="mb-0 flex items-center justify-between p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToMenu}
          className="flex h-6 items-center gap-1 px-2 py-0 text-[10px] text-green-300"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </Button>
        <div className="text-center text-sm font-bold text-green-300">Bioquest</div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestartGame}
            className="flex h-6 items-center gap-1 px-2 py-0 text-[10px] text-green-300"
          >
            <RefreshCw className="h-3 w-3" /> New
          </Button>
        </div>
      </div>
      {/* Game board */}
      <div className="flex flex-col px-2 overflow-hidden">
        {/* AI Hand (face down) */}
        <div className="mb-0">
          <OpponentHand
            cardCount={gameState.opponentHand.length}
            isThinking={isAIThinking}
            playingCardId={aiPlayingCardId}
          />
        </div>

        {/* Opponent field */}
        <div className="mb-0" ref={opponentFieldRef}>
          <GameBoard
            cards={gameState.opponentField}
            isOpponent={true}
            points={gameState.opponentPoints}
            newCardId={newOpponentFieldCardId}
            discardingCardId={discardingCardId}
            returningToDeckCardId={returningToDeckCardId}
          />
        </div>

        {/* Score display and game log between fields - NO EXTRA SPACE */}
        <div className="flex flex-col">
          {/* Score display and game log in one compact area */}
          <div className="bg-black/30 rounded-md p-1">
            {/* Score display */}
            <div className="flex justify-center items-center gap-4 mb-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-700"></div>
                <span className="text-[10px] flex items-center gap-1">
                  AI {isAIThinking && <span className="text-yellow-300">(Thinking...)</span>}
                </span>
                <span
                  className={`rounded-md ${
                    gameState.opponentPoints >= 7 ? "animate-pulse bg-yellow-600" : "bg-green-700"
                  } px-1 py-0 text-sm font-bold flex items-center gap-1`}
                >
                  {gameState.opponentPoints}
                  {gameState.opponentPoints >= 7 && (
                    <span className="flex items-center text-yellow-400">
                      <Crown className="h-3 w-3" />
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span
                  className={`rounded-md ${
                    gameState.playerPoints >= 7 ? "animate-pulse bg-yellow-600" : "bg-green-700"
                  } px-1 py-0 text-sm font-bold flex items-center gap-1`}
                >
                  {gameState.playerPoints}
                  {gameState.playerPoints >= 7 && (
                    <span className="flex items-center text-yellow-400">
                      <Crown className="h-3 w-3" />
                    </span>
                  )}
                </span>
                <span className="text-[10px]">You</span>
                <div className="h-2 w-2 rounded-full bg-blue-700"></div>
              </div>
            </div>

            {/* Game Log */}
            <div className="w-full">
              <div className="text-xs text-center overflow-hidden text-white">
                {lastGameMessage || "Game started. Your turn."}
              </div>
            </div>
          </div>
        </div>

        {/* Player field */}
        <div className="mt-0 mb-4">
          <div className="flex items-center justify-between gap-1">
            {/* Discard pile on the left */}
            <div className="w-[70px] flex-shrink-0">
              <Card
                className={`h-[90px] w-[65px] border-2 border-green-700 bg-green-900 shadow-md relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setShowDiscardGallery(true)}
              >
                {/* Card frame decoration */}
                <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
                <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  {gameState.sharedDiscard.length > 0 ? (
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-400">{gameState.sharedDiscard.length}</div>
                      <div className="text-[10px] text-green-400">Discard</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-green-400 text-center">Empty</div>
                  )}
                </div>
              </Card>
            </div>

            {/* Player field in the middle */}
            <div className="flex-1">
              <GameBoard
                cards={gameState.playerField}
                isOpponent={false}
                points={gameState.playerPoints}
                newCardId={newPlayerFieldCardId}
                discardingCardId={discardingCardId}
                returningToDeckCardId={returningToDeckCardId}
                onCardDrop={handleCardDrop}
              />
            </div>

            {/* Deck on the right */}
            <div className="w-[70px] flex-shrink-0">
              <Card
                className={`h-[90px] w-[65px] ${
                  gameState.currentTurn === "player" && gameState.gameStatus === "playing" && !gameState.pendingEffect
                    ? "cursor-pointer hover:scale-105 transition-transform"
                    : "cursor-not-allowed opacity-70"
                } border-2 border-green-700 bg-green-900 shadow-md relative overflow-hidden`}
                onClick={
                  gameState.currentTurn === "player" && gameState.gameStatus === "playing" && !gameState.pendingEffect
                    ? handleDrawCards
                    : undefined
                }
              >
                {/* Card frame decoration */}
                <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
                <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

                {/* Draw text at the top */}
                {gameState.currentTurn === "player" &&
                  gameState.gameStatus === "playing" &&
                  !gameState.pendingEffect && (
                    <div className="absolute top-0 left-0 right-0 bg-green-700/80 text-[9px] text-center py-0.5 text-white font-bold">
                      Draw 2
                    </div>
                  )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="card-back-pattern"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Layers className="h-6 w-6 text-green-400 mb-1" />
                    <div className="text-sm font-bold text-green-400">{gameState.sharedDeck.length}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Player hand */}
        <div className="px-2 pb-0 mt-[-10px]">
          <div className="flex items-center justify-center">
            <PlayerHand
              cards={gameState.playerHand}
              onSelectCard={handleSelectCard}
              onPlayCard={handleCardDrop}
              disabled={
                gameState.currentTurn !== "player" || gameState.gameStatus !== "playing" || !!gameState.pendingEffect
              }
              newCardIds={newCardIds}
              playingCardId={playingCardId}
            />
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        open={showCardDetail}
        onClose={() => setShowCardDetail(false)}
        card={selectedCardIndex !== null ? gameState.playerHand[selectedCardIndex] : null}
        onPlay={handlePlayCard}
        disabled={gameState.currentTurn !== "player" || gameState.gameStatus !== "playing" || !!gameState.pendingEffect}
      />
      {/* Game over alert */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="border-2 border-green-700 bg-green-900/90 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{gameState.gameStatus !== "playing" ? "Game Over" : "Notice"}</AlertDialogTitle>
            <AlertDialogDescription className="text-green-200">{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={gameState.gameStatus !== "playing" ? handleRestartGame : () => setShowAlert(false)}
              className="bg-green-700 hover:bg-green-600"
            >
              {gameState.gameStatus !== "playing" ? "Play Again" : "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Discard selection modal */}
      <CardSelectionModal
        open={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        cards={gameState.playerHand}
        onConfirm={handleDiscardConfirm}
        title="Discard Cards"
        description={`You need to send ${discardCount} card${discardCount > 1 ? "s" : ""} to the bottom of the deck before drawing.`}
        selectionCount={discardCount}
        actionText="Send to Bottom"
      />
      {/* Target selection modal */}
      <TargetSelectionModal
        open={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        cards={targetCards}
        onConfirm={handleTargetConfirm}
        onCancel={handleCancelEffect}
        title={targetTitle}
        description={targetDescription}
        filter={targetFilter}
        playerCardIndices={playerCardIndices}
        isConfuseEffect={gameState?.pendingEffect?.type === "confuse"}
        playerField={gameState?.playerField || []}
        opponentField={gameState?.opponentField || []}
      />
      {/* AI Trap selection modal */}
      <TargetSelectionModal
        open={showAITrapModal}
        onClose={() => setShowAITrapModal(false)}
        cards={targetCards}
        onConfirm={handleAITrapSelection}
        onCancel={() => {
          setShowAITrapModal(false)
          // If player cancels, AI will choose the lowest value animal
          if (gameState && gameState.playerField.length > 0) {
            const lowestValueIndex = gameState.playerField
              .map((card, index) => ({ card, index }))
              .sort((a, b) => (a.card.points || 0) - (b.card.points || 0))[0].index
            handleAITrapSelection(lowestValueIndex)
          } else {
            // If no animals on field, just end AI turn
            setGameState(endAITurn(gameState!))
          }
        }}
        title={targetTitle}
        description={targetDescription}
        filter={targetFilter}
        playerCardIndices={playerCardIndices}
      />
      {/* AI card play animation overlay */}
      {showAiCardAnimation && aiPlayedCard && (
        <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
          <div className={`ai-card-animation ${aiCardAnimationPhase === "toField" ? "fall-to-field" : ""}`}>
            {/* Card container with 3D flip animation */}
            <div className="relative">
              {/* Card back */}
              <div
                className="absolute inset-0 backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: aiCardAnimationPhase === "flip" ? "rotateY(180deg)" : "rotateY(180deg)",
                  transition: "transform 1.5s ease-in-out",
                  opacity: aiCardAnimationPhase === "flip" ? 1 : 0,
                }}
              >
                <Card className="h-[240px] w-[160px] border-4 border-red-700 bg-red-900 shadow-xl">
                  <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-red-800/20 to-black/30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="card-back-pattern"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-4 border-red-400 flex items-center justify-center">
                        <span className="text-xl font-bold text-red-400">AI</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Card front */}
              <div
                className="backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: aiCardAnimationPhase === "flip" ? "rotateY(0deg)" : "rotateY(0deg)",
                  transition: "transform 1.5s ease-in-out",
                }}
              >
                <Card
                  className={`h-[240px] w-[160px] border-4 ${
                    aiPlayedCard.type === "animal"
                      ? aiPlayedCard.environment === "terrestrial"
                        ? "border-red-600 bg-red-900"
                        : aiPlayedCard.environment === "aquatic"
                          ? "border-blue-600 bg-blue-900"
                          : "border-green-600 bg-green-900"
                      : "border-purple-600 bg-purple-900"
                  } shadow-xl`}
                >
                  <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-white/10 to-black/20"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-2">
                    <div className="text-center text-sm font-bold">{aiPlayedCard.name}</div>
                    <div className="relative h-[140px] w-full flex items-center justify-center">
                      {getCardArt(aiPlayedCard)}
                    </div>
                    <div className="w-full text-center text-xs">
                      {aiPlayedCard.type === "animal" ? (
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-800 px-1 rounded text-[10px]">{aiPlayedCard.environment}</span>
                          <span className="bg-yellow-600 px-1 rounded text-[10px]">{aiPlayedCard.points} pts</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-300">{aiPlayedCard.effect}</div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="absolute top-full mt-2 text-center w-full">
              <div className="bg-red-900/80 text-white text-sm px-2 py-1 rounded-md">AI plays {aiPlayedCard.name}</div>
            </div>
          </div>
        </div>
      )}
      {/* AI animation overlays */}
      {aiDrawingCards && (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
          <div className="absolute right-1/4 top-1/4 flex items-center justify-center">
            <div className="relative h-20 w-20 rounded-full bg-red-500/20 animate-pulse"></div>
            {Array.from({ length: aiDrawnCardCount }).map((_, i) => (
              <div
                key={i}
                className="absolute h-16 w-12 rounded-md border-2 border-red-600 bg-green-800 shadow-lg animate-ai-draw"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">AI</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {aiDiscardingCards && (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
          <div className="absolute right-1/4 top-1/4">
            {aiDiscardedCardIds.map((_, i) => (
              <div
                key={i}
                className="absolute h-16 w-12 rounded-md border border-red-600 bg-red-800 shadow-md animate-discard"
                style={{
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      {/* Victory animation overlay */}
      {(gameState.playerPoints >= 7 || gameState.opponentPoints >= 7) && (
        <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {gameState.playerPoints >= 7 && (
              <div className="animate-bounce rounded-full bg-yellow-500/20 p-6 text-center">
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 top-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-confetti absolute h-3 w-3 rounded-full bg-yellow-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      <AlertDialog open={showQuitConfirmation} onOpenChange={setShowQuitConfirmation}>
        <AlertDialogContent className="border-2 border-green-700 bg-green-900/90 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Quit Game</AlertDialogTitle>
            <AlertDialogDescription className="text-green-200">
              Are you sure you want to quit the current game? Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setShowQuitConfirmation(false)}
              variant="outline"
              className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
            >
              Cancel
            </Button>
            <Button onClick={() => router.push("/")} className="bg-green-700 hover:bg-green-600">
              Quit Game
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Discard Pile Gallery */}
      <DiscardPileGallery
        open={showDiscardGallery}
        onClose={() => setShowDiscardGallery(false)}
        cards={gameState.sharedDiscard}
      />
    </div>
  )
}
