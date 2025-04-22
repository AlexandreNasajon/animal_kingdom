"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

import { useCallback, useRef } from "react"
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

// Import the new animation function
import { createCardToDiscardAnimation, createCardToDeckAnimation } from "@/utils/animation-utils"
import { applyAnimalEffect } from "@/utils/game-effects"
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

/* Add these new styles for discard highlight and impact effects */
.discard-highlight {
  animation: pulse-highlight 0.8s ease-in-out;
  box-shadow: 0 0 15px rgba(147, 51, 234, 0.7);
}

@keyframes pulse-highlight {
  0% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
  50% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.8); }
  100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.8;
  animation: particle-float 1s ease-out forwards;
}

@keyframes particle-float {
  0% { transform: translateY(0) translateX(0); opacity: 0.8; }
  100% { transform: translateY(-20px) translateX(var(--x-offset, 0)); opacity: 0; }
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
  if (!element) return

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

// Original Game Match Component
export default function OriginalGameMatch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deckId = Number.parseInt(searchParams.get("deck") || "1")
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)
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
  const [aiDiscardingCards, setAiDiscardingCards] = useState<number[]>([])
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

  // Add a ref for the discard pile element
  const discardPileRef = useRef<HTMLDivElement>(null)

  // Add this ref after the other useRef declarations
  const deckPileRef = useRef<HTMLDivElement>(null)

  // Add a new state for the opponent hand reveal modal
  // Add this with the other state declarations
  const [showOpponentHand, setShowOpponentHand] = useState(false)

  // Add a new state for the squirrel effect modal
  // Add this with the other state declarations
  const [showSquirrelModal, setShowSquirrelModal] = useState(false)

  // Add new states for Tuna and Turtle effect modals
  const [showTunaModal, setShowTunaModal] = useState(false)
  const [showTurtleModal, setShowTurtleModal] = useState(false)

  // Add a new state for the Crab effect modal
  // Add this with the other state declarations near the top of the component
  const [showCrabModal, setShowCrabModal] = useState(false)

  // Add a state to track the Zebra effect
  const [showZebraModal, setShowZebraModal] = useState(false)

  // Add a state to track animation errors
  const [animationError, setAnimationError] = useState<string | null>(null)

  // Add a global error recovery function
  const recoverFromError = useCallback(() => {
    // Reset all animation and modal states
    setDiscardingCardId(null)
    setReturningToDeckCardId(null)
    setNewPlayerFieldCardId(null)
    setAiPlayingCardId(null)
    setPlayingCardId(null)
    setNewCardIds([])
    setShowAiCardAnimation(false)
    setAiDrawingCards(false)
    setAiDiscardingCards(false)
    setIsHandlingConfuse(false)

    // Close all modals
    setShowTargetModal(false)
    setShowDiscardModal(false)
    setShowSquirrelModal(false)
    setShowTunaModal(false)
    setShowTurtleModal(false)
    setShowCrabModal(false)
    setShowZebraModal(false)
    setShowAITrapModal(false)

    // Clear animation queue
    setAnimationQueue([])
    setIsAnimating(false)

    // If game is stuck in AI's turn, force it back to player's turn
    if (gameState && gameState.currentTurn === "opponent") {
      setIsAIThinking(false)
      setGameState({
        ...gameState,
        currentTurn: "player",
        pendingEffect: null,
        message: "Game recovered from error. Your turn now.",
      })
    }
  }, [
    gameState,
    setDiscardingCardId,
    setReturningToDeckCardId,
    setNewPlayerFieldCardId,
    setAiPlayingCardId,
    setPlayingCardId,
    setNewCardIds,
    setShowAiCardAnimation,
    setAiDrawingCards,
    setAiDiscardingCards,
    setIsHandlingConfuse,
    setShowTargetModal,
    setShowDiscardModal,
    setShowSquirrelModal,
    setShowTunaModal,
    setShowTurtleModal,
    setShowCrabModal,
    setShowZebraModal,
    setShowAITrapModal,
    setAnimationQueue,
    setIsAnimating,
    setIsAIThinking,
    setGameState,
  ])

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
  }, [gameState?.gameStatus, router, setAlertMessage, setShowQuitConfirmation])

  // Helper function to add particle effects
  const addParticleEffect = (cardId: number | undefined, color: string) => {
    if (!cardId) return

    // Find the card element
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
    if (cardElement instanceof HTMLElement) {
      createParticles(cardElement, color, 15)
    }
  }

  // Helper function to safely get a card by index
  const safeGetCard = (cards: GameCard[] | undefined, index: number): GameCard | null => {
    if (!cards || index < 0 || index >= cards.length) {
      return null
    }
    return cards[index]
  }

  // Initialize game
  useEffect(() => {
    const newGame = initializeGame(deckId)
    setGameState(newGame)
    setLastGameMessage("Game started. Your turn.")
  }, [deckId])

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
            try {
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

              for (let i = 0; i < discardCount && i < sortedCards.length; i++) {
                discardIndices.push(sortedCards[i].index)
              }

              // Get the IDs of cards being discarded for animation
              const discardedCardIds = discardIndices
                .filter((index) => index >= 0 && index < gameState.opponentHand.length)
                .map((index) => {
                  const card = gameState.opponentHand[index]
                  return card?.id || 0
                })
                .filter((id) => id > 0)

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
            } catch (error) {
              console.error("AI discard/draw animation error:", error)
              // Reset animation states
              setAiDiscardingCards(false)
              setAiDrawingCards(false)
              // End AI turn anyway
              const afterDraw = drawCards(gameState, 2, false)
              setGameState(endAITurn(afterDraw))
            }
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
            try {
              setAiDrawingCards(true)
              setAiDrawnCardCount(afterAIMove.opponentHand.length - currentOpponentHandLength)
              console.log(`AI drew ${afterAIMove.opponentHand.length - currentOpponentHandLength} cards.`)

              // End AI thinking state
              setIsAIThinking(false)

              // Allow draw animation to complete
              await new Promise((resolve) => setTimeout(resolve, 600))

              setAiDrawingCards(false)
              setGameState(endAITurn(afterAIMove))
            } catch (error) {
              console.error("AI draw animation error:", error)
              // Reset animation states
              setAiDrawingCards(false)
              // End AI turn anyway
              setGameState(endAITurn(afterAIMove))
            }
          },
        ])

        return
      }

      // Check if a new card was played to the field
      if (
        afterAIMove.opponentField.length > currentOpponentFieldLength ||
        (afterAIMove.sharedDiscard.length > gameState.sharedDiscard.length && afterAIMove.message.includes("AI played"))
      ) {
        // Get the newly played card - either from field or from discard
        let newCard: GameCard | undefined
        let isImpactCard = false

        if (afterAIMove.opponentField.length > currentOpponentFieldLength) {
          // Animal card was played to the field
          newCard = afterAIMove.opponentField[afterAIMove.opponentField.length - 1]
        } else if (afterAIMove.sharedDiscard.length > gameState.sharedDiscard.length) {
          // Impact card was played - find it in the discard pile
          // Get the most recently added card to the discard pile
          newCard = afterAIMove.sharedDiscard[afterAIMove.sharedDiscard.length - 1]
          isImpactCard = newCard?.type === "impact"
        }

        // Only proceed if we found a valid card
        if (newCard) {
          // Update the AI card play animation section
          setAnimationQueue((prev) => [
            ...prev,
            async () => {
              try {
                // Set the playing card ID for hand animation
                setAiPlayingCardId(1) // Just use 1 as a dummy ID

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

                // Hide the animation overlay
                setShowAiCardAnimation(false)
                setAiPlayingCardId(null)

                if (!isImpactCard && newCard.id) {
                  // For animal cards, show on the field
                  setNewOpponentFieldCardId(newCard.id)

                  // Add particle effect based on card type
                  let particleColor = "#ff6666" // Default red for terrestrial
                  if (newCard.environment === "aquatic") particleColor = "#6666ff"
                  else if (newCard.environment === "amphibian") particleColor = "#66ff66"

                  // Wait a moment for the card to appear on the board
                  setTimeout(() => {
                    if (newCard && newCard.id) {
                      addParticleEffect(newCard.id, particleColor)
                    }
                  }, 100)
                } else if (isImpactCard) {
                  // For impact cards, add an animation to the discard pile
                  if (discardPileRef.current && newCard) {
                    // Create temporary div that looks like the impact card
                    const tempCard = document.createElement("div")
                    tempCard.className = "fixed pointer-events-none z-50 transition-all duration-1000"
                    tempCard.style.width = "140px"
                    tempCard.style.height = "200px"
                    tempCard.style.left = "50%"
                    tempCard.style.top = "15%"
                    tempCard.style.transform = "translate(-50%, -50%) scale(0.4)"

                    // Create card content
                    const cardContent = document.createElement("div")
                    cardContent.className =
                      "h-full w-full rounded-md shadow-lg border-2 border-purple-600 bg-purple-900"

                    // Add card name
                    const nameDiv = document.createElement("div")
                    nameDiv.className = "text-center text-white text-xs font-bold mt-2"
                    nameDiv.textContent = newCard.name || "Impact Card"
                    cardContent.appendChild(nameDiv)

                    tempCard.appendChild(cardContent)
                    document.body.appendChild(tempCard)

                    // Add purple particle effect for impact cards
                    setTimeout(() => {
                      const rect = tempCard.getBoundingClientRect()
                      for (let i = 0; i < 15; i++) {
                        const particle = document.createElement("div")
                        particle.className = "particle"
                        particle.style.backgroundColor = "#aa66ff"
                        particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px`
                        particle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 100}px`
                        document.body.appendChild(particle)

                        // Remove particle after animation
                        setTimeout(() => {
                          if (document.body.contains(particle)) {
                            document.body.removeChild(particle)
                          }
                        }, 1000)
                      }
                    }, 100)

                    // Wait briefly to show the impact in place
                    await new Promise((resolve) => setTimeout(resolve, 800))

                    // Now animate to discard pile
                    const targetRect = discardPileRef.current.getBoundingClientRect()
                    tempCard.style.transform = "translate(0, 0) scale(0.7) rotate(10deg)"
                    tempCard.style.left = `${targetRect.left + targetRect.width / 2 - 35}px`
                    tempCard.style.top = `${targetRect.top + targetRect.height / 2 - 50}px`
                    tempCard.style.opacity = "0.7"

                    // Add highlight to discard pile
                    discardPileRef.current.classList.add("discard-highlight")

                    // Remove temporary card after animation
                    setTimeout(() => {
                      if (document.body.contains(tempCard)) {
                        document.body.removeChild(tempCard)
                      }

                      // Remove highlight from discard pile
                      if (discardPileRef.current) {
                        discardPileRef.current.classList.remove("discard-highlight")
                      }
                    }, 1000)

                    // Wait for animation to complete
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                  }
                }

                // Allow field animation to complete
                await new Promise((resolve) => setTimeout(resolve, 600))

                setNewOpponentFieldCardId(null)
                setGameState(endAITurn(afterAIMove))
              } catch (error) {
                console.error("AI card play animation error:", error)
                // Reset animation states
                setShowAiCardAnimation(false)
                setAiPlayingCardId(null)
                setNewOpponentFieldCardId(null)
                // End AI turn anyway
                setGameState(endAITurn(afterAIMove))
              }
            },
          ])

          return
        }
      }

      // Check if AI played Trap card
      if (afterAIMove.message.includes("AI played Trap")) {
        console.log("AI played Trap and selects one of your animals.")

        // AI automatically selects the highest value animal
        const highestValueIndex = afterAIMove.playerField
          .map((card, index) => ({ card, index }))
          .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

        // End AI thinking state
        setIsAIThinking(false)

        // Resolve the effect with the AI's choice
        const resolvedState = resolveEffect(
          {
            ...afterAIMove,
            pendingEffect: {
              type: "trap",
              forPlayer: false,
            },
          },
          highestValueIndex,
        )

        if (resolvedState.message !== afterAIMove.message) {
          console.log(resolvedState.message)
        }

        // End AI turn
        setGameState(endAITurn(resolvedState))
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
      } else if (afterAIMove.pendingEffect && !afterAIMove.pendingEffect.forPlayer) {
        console.log("AI is resolving its own effect automatically.")

        // Get the effect type
        const effectType = afterAIMove.pendingEffect.type

        // Handle different effect types
        if (effectType === "mouse") {
          // For Mouse effect, AI targets the highest value terrestrial animal
          const targetableCards = gameState.playerField.filter(
            (card) => card.environment === "terrestrial" || card.environment === "amphibian",
          )

          if (targetableCards.length > 0) {
            // Find the highest value target
            const targetIndex = gameState.playerField.findIndex(
              (card) => card.id === targetableCards.sort((a, b) => (b.points || 0) - (a.points || 0))[0].id,
            )

            // Resolve the effect
            const resolvedState = resolveEffect(afterAIMove, targetIndex)

            if (resolvedState.message !== afterAIMove.message) {
              console.log(resolvedState.message)
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        } else if (effectType === "octopus") {
          // For Octopus effect, AI just looks at the top cards and randomly rearranges them
          const topCards = gameState.sharedDeck.slice(0, Math.min(3, gameState.sharedDeck.length))

          if (topCards.length > 0) {
            // Randomly shuffle the top cards (AI doesn't need to make strategic choices here)
            const shuffledIndices = Array.from({ length: topCards.length }, (_, i) => i).sort(() => Math.random() - 0.5)

            // Resolve the effect with the shuffled indices
            const resolvedState = resolveEffect(afterAIMove, shuffledIndices)

            if (resolvedState.message !== afterAIMove.message) {
              console.log(resolvedState.message)
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        } else if (effectType === "zebra") {
          // For Zebra effect, AI just looks at player's hand and continues
          // No need to make any choice, just resolve the effect
          const resolvedState = {
            ...afterAIMove,
            pendingEffect: null,
            message: "AI looked at your hand using Zebra.",
          }

          // End AI thinking state
          setIsAIThinking(false)

          // End AI turn
          setGameState(endAITurn(resolvedState))
          return
        } else if (effectType === "tuna") {
          // For Tuna effect, AI selects an aquatic animal of 3 or fewer points to play
          const aquaticAnimals = afterAIMove.opponentHand.filter(
            (c) =>
              c.type === "animal" &&
              (c.environment === "aquatic" || c.environment === "amphibian") &&
              (c.points || 0) <= 3,
          )

          if (aquaticAnimals.length > 0) {
            // Find the highest value aquatic animal that meets criteria
            const targetCard = aquaticAnimals.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
            const targetIndex = afterAIMove.opponentHand.findIndex((c) => c.id === targetCard.id)

            // Create a new state with the card played
            const newOpponentHand = [...afterAIMove.opponentHand]
            newOpponentHand.splice(targetIndex, 1)

            const resolvedState = {
              ...afterAIMove,
              opponentHand: newOpponentHand,
              opponentField: [...afterAIMove.opponentField, targetCard],
              opponentPoints: afterAIMove.opponentPoints + (targetCard.points || 0),
              pendingEffect: null,
              message: `AI played Tuna and then played ${targetCard.name} from hand.`,
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        } else if (effectType === "turtle") {
          // For Turtle effect, AI selects an aquatic animal of 2 or fewer points to play
          const aquaticAnimals = afterAIMove.opponentHand.filter(
            (c) =>
              c.type === "animal" &&
              (c.environment === "aquatic" || c.environment === "amphibian") &&
              (c.points || 0) <= 2,
          )

          if (aquaticAnimals.length > 0) {
            // Find the highest value aquatic animal that meets criteria
            const targetCard = aquaticAnimals.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
            const targetIndex = afterAIMove.opponentHand.findIndex((c) => c.id === targetCard.id)

            // Create a new state with the card played
            const newOpponentHand = [...afterAIMove.opponentHand]
            newOpponentHand.splice(targetIndex, 1)

            const resolvedState = {
              ...afterAIMove,
              opponentHand: newOpponentHand,
              opponentField: [...afterAIMove.opponentField, targetCard],
              opponentPoints: afterAIMove.opponentPoints + (targetCard.points || 0),
              pendingEffect: null,
              message: `AI played Turtle and then played ${targetCard.name} from hand.`,
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        } else if (effectType === "squirrel") {
          // For Squirrel effect, AI just looks at player's hand and chooses a card to discard
          if (afterAIMove.playerHand.length > 0) {
            // Choose highest value card or first impact card to discard
            const animalCards = afterAIMove.playerHand.filter((c) => c.type === "animal")
            const impactCards = afterAIMove.playerHand.filter((c) => c.type === "impact")

            let targetIndex = 0
            let targetCard = afterAIMove.playerHand[0]

            if (impactCards.length > 0) {
              // Prefer to discard impact cards
              targetCard = impactCards[0]
              targetIndex = afterAIMove.playerHand.findIndex((c) => c.id === targetCard.id)
            } else if (animalCards.length > 0) {
              // If no impact cards, discard highest point animal
              targetCard = animalCards.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
              targetIndex = afterAIMove.playerHand.findIndex((c) => c.id === targetCard.id)
            }

            // Create a new player hand with the chosen card removed
            const newPlayerHand = [...afterAIMove.playerHand]
            newPlayerHand.splice(targetIndex, 1)

            const resolvedState = {
              ...afterAIMove,
              playerHand: newPlayerHand,
              sharedDiscard: [...afterAIMove.sharedDiscard, targetCard],
              pendingEffect: null,
              message: `AI used Squirrel to make you discard ${targetCard.name}.`,
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        } else if (effectType === "dolphin") {
          // For Dolphin effect, AI sends a card to bottom of deck and draws one
          if (afterAIMove.opponentHand.length > 0 && afterAIMove.sharedDeck.length > 0) {
            // Choose lowest value card to send to bottom
            const sortedHand = [...afterAIMove.opponentHand].sort((a, b) => {
              if (a.type === "animal" && b.type === "animal") {
                return (a.points || 0) - (b.points || 0)
              }
              return a.type === "impact" ? -1 : 1 // Prefer sending impact cards to bottom
            })

            const targetCard = sortedHand[0]
            const targetIndex = afterAIMove.opponentHand.findIndex((c) => c.id === targetCard.id)

            // Remove card from hand
            const newOpponentHand = [...afterAIMove.opponentHand]
            newOpponentHand.splice(targetIndex, 1)

            // Draw a card
            const drawnCard = afterAIMove.sharedDeck[0]
            const newDeck = [...afterAIMove.sharedDeck.slice(1), targetCard]

            const resolvedState = {
              ...afterAIMove,
              opponentHand: [...newOpponentHand, drawnCard],
              sharedDeck: newDeck,
              pendingEffect: null,
              message: `AI played Dolphin, sent a card to bottom of deck, and drew a card.`,
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        } else if (effectType === "crab") {
          // For Crab effect, AI selects one card to add to hand, sends other to bottom
          if (afterAIMove.sharedDeck.length >= 2) {
            const topCards = afterAIMove.sharedDeck.slice(0, 2)

            // Sort cards by value (prefer animals with higher points)
            const sortedCards = [...topCards].sort((a, b) => {
              if (a.type === "animal" && b.type === "animal") {
                return (b.points || 0) - (a.points || 0)
              }
              return a.type === "animal" ? 1 : -1 // Prefer animals over impacts
            })

            const selectedCard = sortedCards[0]
            const otherCard = sortedCards[1]

            // Create a new state
            const resolvedState = {
              ...afterAIMove,
              opponentHand: [...afterAIMove.opponentHand, selectedCard],
              sharedDeck: [...afterAIMove.sharedDeck.slice(2), otherCard],
              pendingEffect: null,
              message: `AI played Crab, selected a card for its hand, and sent another to the bottom of the deck.`,
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          } else if (afterAIMove.sharedDeck.length === 1) {
            // If there's only one card, just draw it
            const drawnCard = afterAIMove.sharedDeck[0]

            const resolvedState = {
              ...afterAIMove,
              opponentHand: [...afterAIMove.opponentHand, drawnCard],
              sharedDeck: [],
              pendingEffect: null,
              message: `AI played Crab and drew the last card from the deck.`,
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        } else if (effectType === "crocodile") {
          // For Crocodile effect, AI targets a player animal with 3 or fewer points
          const targetableCards = gameState.playerField.filter((c) => (c.points || 0) <= 3)

          if (targetableCards.length > 0) {
            // Target the highest value animal that meets the criteria
            const targetCard = targetableCards.sort((a, b) => (b.points || 0) - (a.points || 0))[0]
            const targetIndex = gameState.playerField.findIndex((c) => c.id === targetCard.id)

            // Resolve the effect
            const resolvedState = resolveEffect(afterAIMove, targetIndex)

            if (resolvedState.message !== afterAIMove.message) {
              console.log(resolvedState.message)
            }

            // End AI thinking state
            setIsAIThinking(false)

            // End AI turn
            setGameState(endAITurn(resolvedState))
            return
          }
        }
        // Find the section that handles AI effects for other cards and ensure they're properly handled
        // Add this to the AI effect handling section:

        // Add this default case to handle any other animal effects that weren't explicitly handled
        // This ensures all AI effects are resolved and AI thinking state is cleared
        else {
          // End AI thinking state
          setIsAIThinking(false)

          // For any other effect, resolve it automatically
          const resolvedState = {
            ...afterAIMove,
            pendingEffect: null,
            message: `AI resolved its ${effectType} effect.`,
          }

          // End AI turn
          setGameState(endAITurn(resolvedState))
          return
        }
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

  // Add a safety timeout to prevent AI turn from freezing
  useEffect(() => {
    if (!gameState || gameState.currentTurn !== "opponent" || gameState.gameStatus !== "playing") {
      return
    }

    // Add a timeout to force-end AI turn if it's taking too long
    const safetyTimer = setTimeout(() => {
      if (gameState.currentTurn === "opponent") {
        console.error("AI turn safety timeout triggered - AI turn was taking too long")

        // Force end the AI turn and clear any pending effects
        setIsAIThinking(false)
        setAnimationQueue([])
        setIsAnimating(false)

        // Reset animation states
        setAiPlayingCardId(null)
        setShowAiCardAnimation(false)
        setNewOpponentFieldCardId(null)
        setAiDrawingCards(false)
        setAiDiscardingCards(false)

        // Create a safe state without any pending effects
        const safeState = {
          ...gameState,
          currentTurn: "player",
          pendingEffect: null,
          message: "Your turn. AI action was interrupted.",
        }

        setGameState(safeState)
      }
    }, 8000) // 8 second timeout

    return () => clearTimeout(safetyTimer)
  }, [gameState])

  // Add this effect to handle the squirrel, tuna, and turtle effects
  // Add this with the other useEffect hooks that check for pending effects
  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    // Check if we have a pending effect
    if (gameState.pendingEffect.type === "squirrel" && gameState.pendingEffect.forPlayer) {
      setShowSquirrelModal(true)
    } else if (gameState.pendingEffect.type === "tuna" && gameState.pendingEffect.forPlayer) {
      setShowTunaModal(true)
    } else if (gameState.pendingEffect.type === "turtle" && gameState.pendingEffect.forPlayer) {
      setShowTurtleModal(true)
    } else if (gameState.pendingEffect.type === "zebra" && gameState.pendingEffect.forPlayer) {
      setShowZebraModal(true)
    }
  }, [gameState])

  // Add this effect to handle the Crab effect
  // Add this with the other useEffect hooks that check for pending effects
  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    // Check if we have a pending effect that belongs to the player
    if (gameState.pendingEffect.type === "crab" && gameState.pendingEffect.forPlayer === true) {
      setShowCrabModal(true)
    }
  }, [gameState])

  // Add this useEffect to process the animation queue
  // Add this after the other useEffect hooks
  useEffect(() => {
    const processQueue = async () => {
      if (animationQueue.length > 0 && !isAnimating) {
        setIsAnimating(true)
        const nextAnimation = animationQueue[0]

        // Add a safety timeout to prevent infinite animations
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Animation timeout")), 5000),
        )

        try {
          // Race the animation against a timeout to prevent hanging
          await Promise.race([nextAnimation(), timeoutPromise])
        } catch (error) {
          console.error("Animation error:", error)
          setAnimationError(`Animation error: ${error instanceof Error ? error.message : "Unknown error"}`)

          // When an error occurs, clear all animation states to avoid UI getting stuck
          setDiscardingCardId(null)
          setReturningToDeckCardId(null)
          setNewPlayerFieldCardId(null)
          setAiPlayingCardId(null)
          setPlayingCardId(null)
          setNewCardIds([])
          setShowAiCardAnimation(false)
          setAiDrawingCards(false)
          setAiDiscardingCards(false)
          setIsHandlingConfuse(false)

          // Close any open modals that might be causing issues
          setShowTargetModal(false)
          setShowDiscardModal(false)
          setShowSquirrelModal(false)
          setShowTunaModal(false)
          setShowTurtleModal(false)
          setShowCrabModal(false)
          setShowZebraModal(false)
          setShowAITrapModal(false)
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
        try {
          // Show discard animation for the selected card - add null checking
          const idx = targetIndex as number
          if (idx >= 0 && idx < gameState.playerField.length) {
            const card = gameState.playerField[idx]
            if (card && card.id) {
              setDiscardingCardId(card.id)

              // Find the card element and use our new animation
              const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
              if (cardElement instanceof HTMLElement && discardPileRef.current) {
                // Use our new animation function
                createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
              }
            }
          }

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
        } catch (error) {
          console.error("AI trap selection error:", error)
          // Reset animation states
          setDiscardingCardId(null)
          // End AI's turn anyway
          const newState = resolveEffect(gameState, targetIndex as number)
          setGameState(endAITurn(newState))
          setShowAITrapModal(false)
        }
      },
    ])
  }

  // Add a handler for the squirrel effect selection
  // Add this with the other handler functions
  const handleSquirrelSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Validate the index
          if (targetIndex < 0 || targetIndex >= gameState.opponentHand.length) {
            throw new Error("Invalid card index for Squirrel effect")
          }

          // Get the card being discarded
          const targetCard = gameState.opponentHand[targetIndex]
          if (!targetCard) {
            throw new Error("Card not found for Squirrel effect")
          }

          // Create a new state with the card discarded
          const newOpponentHand = [...gameState.opponentHand]
          newOpponentHand.splice(targetIndex, 1)

          const newState = {
            ...gameState,
            opponentHand: newOpponentHand,
            sharedDiscard: [...gameState.sharedDiscard, targetCard],
            pendingEffect: null,
            message: `You made the opponent discard ${targetCard.name}.`,
          }

          // Log the effect resolution
          console.log(newState.message)

          // End player's turn
          setGameState(endPlayerTurn(newState))
          setShowSquirrelModal(false)
        } catch (error) {
          console.error("Squirrel effect error:", error)
          // Clear the pending effect and continue
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Squirrel effect failed. Your turn continues.",
          })
          setShowSquirrelModal(false)
        }
      },
    ])
  }

  // Add handler for Zebra effect
  const handleZebraEffectClose = () => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Create a new state resolving the Zebra effect
          const newState = {
            ...gameState,
            pendingEffect: null,
            message: "You've seen your opponent's hand.",
          }

          // Log the effect resolution
          console.log(newState.message)

          // End player's turn
          setGameState(endPlayerTurn(newState))
          setShowZebraModal(false)
        } catch (error) {
          console.error("Zebra effect error:", error)
          // Clear the pending effect and continue
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Zebra effect completed. Your turn ends.",
          })
          setShowZebraModal(false)
        }
      },
    ])
  }

  // Find the handleTunaSelection function and replace it with this updated version:

  const handleTunaSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // First, get the filtered cards that match the Tuna criteria
          const filteredCards = gameState.playerHand.filter(
            (card) =>
              card.type === "animal" &&
              (card.environment === "aquatic" || card.environment === "amphibian") &&
              (card.points || 0) <= 3,
          )

          // Validate the index
          if (targetIndex < 0 || targetIndex >= filteredCards.length) {
            throw new Error("Invalid card index for Tuna effect")
          }

          // Get the actual card from the filtered list
          const targetCard = filteredCards[targetIndex]
          if (!targetCard || !targetCard.id) {
            throw new Error("Card not found for Tuna effect")
          }

          // Find the index of this card in the original hand
          const originalHandIndex = gameState.playerHand.findIndex((card) => card.id === targetCard.id)
          if (originalHandIndex === -1) {
            throw new Error("Card not found in player's hand")
          }

          // Create a new state with the card played
          const newPlayerHand = [...gameState.playerHand]
          newPlayerHand.splice(originalHandIndex, 1)

          // First, add the card to the field
          let tempState = {
            ...gameState,
            playerHand: newPlayerHand,
            playerField: [...gameState.playerField, targetCard],
            playerPoints: gameState.playerPoints + (targetCard.points || 0),
            pendingEffect: null,
            message: `You played ${targetCard.name} from your hand.`,
          }

          // Now apply the card's effect, if it has one
          if (targetCard.type === "animal" && targetCard.effect) {
            tempState = applyAnimalEffect(tempState, targetCard, true)
          }

          // Log the effect resolution
          console.log(tempState.message)

          // Set the new card ID for field animation
          setNewPlayerFieldCardId(targetCard.id)

          // Add particle effect based on environment
          setTimeout(() => {
            let particleColor = "#ff6666" // Default red for terrestrial
            if (targetCard.environment === "aquatic") particleColor = "#6666ff"
            else if (targetCard.environment === "amphibian") particleColor = "#66ff66"

            addParticleEffect(targetCard.id, particleColor)
          }, 400)

          // If there's a pending effect from the played card, don't end the turn yet
          if (tempState.pendingEffect) {
            setGameState(tempState)
            setShowTunaModal(false)

            // Wait for field animation to complete
            await new Promise((resolve) => setTimeout(resolve, 800))

            // Clear animation states
            setNewPlayerFieldCardId(null)
            return
          }

          // End player's turn if no pending effect
          setGameState(endPlayerTurn(tempState))
          setShowTunaModal(false)

          // Wait for field animation to complete
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Clear animation states
          setNewPlayerFieldCardId(null)
        } catch (error) {
          console.error("Tuna effect error:", error)
          // Reset animation states
          setNewPlayerFieldCardId(null)
          // Clear the pending effect and continue
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Tuna effect failed. Your turn continues.",
          })
          setShowTunaModal(false)
        }
      },
    ])
  }

  // Find the handleTurtleSelection function and replace it with this corrected version:

  const handleTurtleSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // First, get the filtered cards that match the Turtle criteria
          const filteredCards = gameState.playerHand.filter(
            (card) =>
              card.type === "animal" &&
              (card.environment === "aquatic" || card.environment === "amphibian") &&
              (card.points || 0) <= 2,
          )

          // Log for debugging
          console.log("Turtle effect - filtered cards:", filteredCards.length, "selected index:", targetIndex)

          // Validate the index
          if (targetIndex < 0 || targetIndex >= filteredCards.length) {
            throw new Error(
              `Invalid card index for Turtle effect: ${targetIndex} (filtered cards: ${filteredCards.length})`,
            )
          }

          // Get the actual card from the filtered list
          const targetCard = filteredCards[targetIndex]
          if (!targetCard || !targetCard.id) {
            throw new Error("Card not found for Turtle effect")
          }

          // Find the index of this card in the original hand
          const originalHandIndex = gameState.playerHand.findIndex((card) => card.id === targetCard.id)
          if (originalHandIndex === -1) {
            throw new Error("Card not found in player's hand")
          }

          // Create a new state with the card played
          const newPlayerHand = [...gameState.playerHand]
          newPlayerHand.splice(originalHandIndex, 1)

          // First, add the card to the field
          let tempState = {
            ...gameState,
            playerHand: newPlayerHand,
            playerField: [...gameState.playerField, targetCard],
            playerPoints: gameState.playerPoints + (targetCard.points || 0),
            pendingEffect: null,
            message: `You played ${targetCard.name} from your hand.`,
          }

          // Now apply the card's effect, if it has one
          if (targetCard.type === "animal" && targetCard.effect) {
            tempState = applyAnimalEffect(tempState, targetCard, true)
          }

          // Log the effect resolution
          console.log(tempState.message)

          // Set the new card ID for field animation
          setNewPlayerFieldCardId(targetCard.id)

          // Add particle effect based on environment
          setTimeout(() => {
            let particleColor = "#ff6666" // Default red for terrestrial
            if (targetCard.environment === "aquatic") particleColor = "#6666ff"
            else if (targetCard.environment === "amphibian") particleColor = "#66ff66"

            addParticleEffect(targetCard.id, particleColor)
          }, 400)

          // If there's a pending effect from the played card, don't end the turn yet
          if (tempState.pendingEffect) {
            setGameState(tempState)
            setShowTurtleModal(false)

            // Wait for field animation to complete
            await new Promise((resolve) => setTimeout(resolve, 800))

            // Clear animation states
            setNewPlayerFieldCardId(null)
            return
          }

          // End player's turn if no pending effect
          setGameState(endPlayerTurn(tempState))
          setShowTurtleModal(false)

          // Wait for field animation to complete
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Clear animation states
          setNewPlayerFieldCardId(null)
        } catch (error) {
          console.error("Turtle effect error:", error)
          // Reset animation states
          setNewPlayerFieldCardId(null)
          // Clear the pending effect and continue
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Turtle effect failed. Your turn continues.",
          })
          setShowTurtleModal(false)
        }
      },
    ])
  }

  // Add a handler for the Crab effect selection
  // Add this with the other handler functions
  const handleCrabSelection = (selectedIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Get the selected card and the other card
          const topCards = gameState.sharedDeck.slice(0, 2)

          // Validate the index
          if (selectedIndex < 0 || selectedIndex >= topCards.length) {
            throw new Error("Invalid card index for Crab effect")
          }

          const selectedCard = topCards[selectedIndex]
          const otherCard = topCards[1 - selectedIndex]

          if (!selectedCard || !otherCard) {
            throw new Error("Cards not found for Crab effect")
          }

          // Create a new state with the selected card added to hand and the other sent to bottom
          const newDeck = [...gameState.sharedDeck.slice(2), otherCard]

          const newState = {
            ...gameState,
            playerHand: [...gameState.playerHand, selectedCard],
            sharedDeck: newDeck,
            pendingEffect: null,
            message: `You added ${selectedCard.name} to your hand and sent ${otherCard.name} to the bottom of the deck.`,
          }

          // Log the effect resolution
          console.log(newState.message)

          // End player's turn
          setGameState(endPlayerTurn(newState))
          setShowCrabModal(false)
        } catch (error) {
          console.error("Crab effect error:", error)
          // If there's an error, just draw the top card
          if (gameState.sharedDeck.length > 0) {
            const topCard = gameState.sharedDeck[0]
            const newDeck = gameState.sharedDeck.slice(1)
            const newState = {
              ...gameState,
              playerHand: [...gameState.playerHand, topCard],
              sharedDeck: newDeck,
              pendingEffect: null,
              message: `Crab effect: You drew ${topCard.name}.`,
            }
            setGameState(endPlayerTurn(newState))
          } else {
            // If deck is empty, just end the turn
            setGameState({
              ...gameState,
              pendingEffect: null,
              message: "Crab effect failed. Your turn ends.",
            })
          }
          setShowCrabModal(false)
        }
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
          // Validate the indices first
          if (
            playerIdx < 0 ||
            playerIdx >= gameState.playerField.length ||
            opponentIdx < 0 ||
            opponentIdx >= gameState.opponentField.length
          ) {
            throw new Error("Invalid card indices for Confuse effect")
          }

          // Get the cards and validate they exist
          const playerCard = gameState.playerField[playerIdx]
          const opponentCard = gameState.opponentField[opponentIdx]

          if (!playerCard || !opponentCard || !playerCard.id || !opponentCard.id) {
            throw new Error("Invalid cards for Confuse effect")
          }

          // Get the card IDs
          const playerCardId = playerCard.id
          const opponentCardId = opponentCard.id

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
        } catch (error) {
          console.error("Error in Confuse effect:", error)

          // Reset the game state without the pending effect
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Confuse effect failed. Your turn continues.",
          })
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

      case "mouse":
        setTargetTitle("Select Target")
        setTargetDescription("Select a terrestrial animal to send to the top of the deck.")
        setTargetFilter((card) => card?.environment === "terrestrial" || card?.environment === "amphibian")
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
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

      // Find the section in the useEffect that handles the "confuse" case in the switch statement
      // and replace it with this corrected version:

      case "confuse":
        setTargetTitle("Exchange Animals")
        setTargetDescription("Select one of your animals and one of the opponent's animals to exchange control.")
        // For Confuse, we need to set the isConfuseEffect flag to true in the TargetSelectionModal
        setShowTargetModal(true) // We don't need these for the Confuse effect as we're using a different UI
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
      case "epidemic":
        setTargetTitle("Select Animal")
        setTargetDescription(
          "Select one of your animals. All animals of the same environment will be sent to the bottom of the deck.",
        )
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards(gameState.playerField)
        setShowTargetModal(true)
        // All cards are player's cards
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

      // Add this case in the switch statement that handles pendingEffect.type
      case "octopus":
        if (forPlayer) {
          setTargetTitle("Rearrange Cards")
          setTargetDescription(
            "Click the cards in the order you want them to be placed on top of the deck (first click = top card).",
          )
          setTargetFilter(undefined)
          setTargetCards(gameState.sharedDeck.slice(0, Math.min(3, gameState.sharedDeck.length)))
          setShowTargetModal(true)
          playerCardIndices = []
        }
        break

      case "lion":
        setTargetTitle("Select Target")
        setTargetDescription("Select an animal to destroy.")
        setTargetFilter(undefined)
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // All cards are opponent's cards
        playerCardIndices = []
        break

      case "crocodile":
        setTargetTitle("Select Animal")
        setTargetDescription("Select an opponent's animal with 3 or fewer points to send to the bottom of the deck.")
        setTargetFilter((card) => (card?.points || 0) <= 3)
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // No player cards as we're only targeting opponent field
        playerCardIndices = []
        break

      case "dolphin":
        setTargetTitle("Select Card")
        setTargetDescription("Select a card from your hand to send to the bottom of the deck and draw a card.")
        setTargetFilter(undefined)
        setTargetCards(gameState.playerHand)
        setShowTargetModal(true)
        playerCardIndices = Array.from({ length: gameState.playerHand.length }, (_, i) => i)
        break

      case "squirrel":
        setTargetTitle("Select Card")
        setTargetDescription("Select a card from your opponent's hand to discard.")
        setShowSquirrelModal(true)
        playerCardIndices = []
        break

      case "tuna":
        // Don't show the target modal, we'll use our custom modal
        playerCardIndices = []
        break

      case "turtle":
        // Don't show the target modal, we'll use our custom modal
        playerCardIndices = []
        break

      case "crab":
        setTargetTitle("Choose a Card")
        setTargetDescription("Select one card to add to your hand. The other will be sent to the bottom of the deck.")
        setShowCrabModal(true)
        playerCardIndices = []
        break

      case "zebra":
        // Don't show the target modal, we'll use our custom modal for Zebra
        playerCardIndices = []
        break
      case "payCost":
        if (gameState.pendingEffect.selectedCard === undefined) return

        // Process sacrifice or return to hand
        const selectedCardIndex = gameState.pendingEffect.selectedCard
        const costType = gameState.pendingEffect.costType
        const targetCardId = gameState.pendingEffect.targetCardId

        // Find the card to be played from player's hand
        const cardToPlay = gameState.playerHand.find((c) => c.id === targetCardId)
        if (!cardToPlay) return

        // Find the index of the card to play
        const cardToPlayIndex = gameState.playerHand.findIndex((c) => c.id === targetCardId)

        // Get the animal being sacrificed
        const targetIndex = gameState.pendingEffect.targetIndex
        const sacrificedAnimal = gameState.playerField[targetIndex as number]

        // Create a new player field with the sacrificed animal removed
        const newPlayerField = [...gameState.playerField]
        newPlayerField.splice(targetIndex as number, 1)

        // Create a new player hand with the played card removed
        const newPlayerHand = [...gameState.playerHand]
        newPlayerHand.splice(cardToPlayIndex, 1)

        // Temporarily update points
        const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)

        // Create a temporary new state
        let tempState = {
          ...gameState,
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
          // For Lion, Shark, and Crocodile, send to discard\
          tempState.sharedDiscard = [...gameState.sharedDiscard, sacrificedAnimal]
          const send = null
          const to = null
          const discard = null
          tempState.sharedDiscard = [...gameState.sharedDiscard, sacrificedAnimal]
          tempState.message = `You sacrificed ${sacrificedAnimal.name} to play ${cardToPlay.name}.`
        }

        // Now add the played card to the field
        tempState.playerField = [...tempState.playerField, cardToPlay]
        tempState.playerPoints = tempState.playerField.reduce((sum, card) => sum + (card.points || 0), 0)

        // Apply the card's effect
        if (cardToPlay.type === "animal" && cardToPlay.effect) {
          tempState = applyAnimalEffect(tempState, cardToPlay, true)
        }

        // Set the new player field card for animation
        setNewPlayerFieldCardId(cardToPlay.id)

        // Show discard animation if needed
        if (costType !== "return") {
          setDiscardingCardId(sacrificedAnimal.id)
        }

        // Log the effect
        console.log(tempState.message)

        // Close the target modal
        setShowTargetModal(false)

        // Update the game state
        if (tempState.pendingEffect) {
          // If there's a pending effect from the played card, don't end turn yet
          setGameState(tempState)
        } else {
          // End player's turn if no pending effect
          setGameState(endPlayerTurn(tempState))
        }
        break
    }

    // Store the player card indices
    setPlayerCardIndices(playerCardIndices)
  }, [gameState, showTargetModal, isHandlingConfuse])

  // Find the handleDrawCards function and replace it with this updated version:

  // Handle player drawing cards
  const handleDrawCards = () => {
    if (!gameState) return

    // Check if player needs to discard first
    if (gameState.playerHand.length >= 5) {
      // If hand is full (6 cards), player must discard 2 cards
      // If hand has 5 cards, player must discard 2 cards
      setDiscardCount(gameState.playerHand.length === 6 ? 2 : 1)
      setShowDiscardModal(true)
      return
    }

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Store current hand length to detect new cards
          const currentHandLength = gameState.playerHand.length
          const maxDraw = Math.min(2, 6 - currentHandLength)

          // Draw cards (up to 6 total in hand)
          const newState = drawCards(gameState, maxDraw, true)
          console.log(`You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`)

          // Get IDs of newly drawn cards for animation
          const drawnCardIds = newState.playerHand
            .slice(currentHandLength)
            .map((card) => card?.id || 0)
            .filter((id) => id > 0)

          setNewCardIds(drawnCardIds)

          // End player's turn
          setGameState(endPlayerTurn(newState))

          // Clear animation state after a delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          setNewCardIds([])
        } catch (error) {
          console.error("Draw cards error:", error)
          // Reset animation states
          setNewCardIds([])
          // End player's turn anyway
          const newState = drawCards(gameState, 1, true)
          setGameState(endPlayerTurn(newState))
        }
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

    if (card.type === "animal" && ["Lion", "Shark", "Crocodile"].includes(card.name)) {
      // Check if there are enough animals on the field to pay the cost
      if (gameState.playerField.length === 0) {
        // Create a new state with a message that the player can't play the card
        const newState = {
          ...gameState,
          message: `You need an animal on your field to play ${card.name}.`,
        }
        setGameState(newState)
        setShowCardDetail(false)
        setSelectedCardIndex(null)
        return
      }

      // For Lion and Shark, set up target selection for sacrifice
      // For Crocodile, set up target selection for sacrifice (not returning to hand)
      const costType = "sacrifice"

      setTargetTitle(`Select an Animal to Sacrifice`)
      setTargetDescription(`Select one of your animals to sacrifice in order to play ${card.name}.`)
      setTargetFilter((c) => c?.type === "animal")
      setTargetCards(gameState.playerField)
      setPlayerCardIndices(Array.from({ length: gameState.playerField.length }, (_, i) => i))

      // Store the card to play after cost is paid
      gameState.pendingEffect = {
        type: "payCost",
        forPlayer: true,
        targetCardId: card.id,
        costType: costType,
        selectedCard: selectedCardIndex,
        targetIndex: null,
      }

      setShowCardDetail(false)
      setSelectedCardIndex(null)
      setShowTargetModal(true)
      return
    }

    // Add the animation to the queue instead of playing immediately
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Set the playing card ID for animation
          if (card.id) {
            setPlayingCardId(card.id)
          }

          // Delay the actual card play to allow animation to start
          await new Promise((resolve) => setTimeout(resolve, 300))

          let newState

          if (card.type === "animal") {
            newState = playAnimalCard(gameState, selectedCardIndex, true)
            console.log(`You played ${card.name} (${card.points} points).`)

            // Set the new card ID for field animation
            if (card.id) {
              setNewPlayerFieldCardId(card.id)

              // Add particle effect based on environment
              setTimeout(() => {
                let particleColor = "#ff6666" // Default red for terrestrial
                if (card.environment === "aquatic") particleColor = "#6666ff"
                else if (card.environment === "amphibian") particleColor = "#66ff66"

                addParticleEffect(card.id, particleColor)
              }, 400)
            }
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
              if (card.id) {
                setTimeout(() => {
                  addParticleEffect(card.id, "#aa66ff")
                }, 400)
              }
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
        } catch (error) {
          console.error("Play card error:", error)
          // Reset animation states
          setPlayingCardId(null)
          setNewPlayerFieldCardId(null)
          // Close the card detail view
          setShowCardDetail(false)
          setSelectedCardIndex(null)
        }
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

    if (card.type === "animal" && ["Lion", "Shark", "Crocodile"].includes(card.name)) {
      // Check if there are enough animals on the field to pay the cost
      if (gameState.playerField.length === 0) {
        // Create a new state with a message that the player can't play the card
        const newState = {
          ...gameState,
          message: `You need an animal on your field to play ${card.name}.`,
        }
        setGameState(newState)
        return
      }

      // For Lion and Shark, set up target selection for sacrifice
      // For Crocodile, set up target selection for sacrifice (not returning to hand)
      const costType = "sacrifice"

      setTargetTitle(`Select an Animal to Sacrifice`)
      setTargetDescription(`Select one of your animals to sacrifice in order to play ${card.name}.`)
      setTargetFilter((c) => c?.type === "animal")
      setTargetCards(gameState.playerField)
      setPlayerCardIndices(Array.from({ length: gameState.playerField.length }, (_, i) => i))

      // Store the card to play after cost is paid
      gameState.pendingEffect = {
        type: "payCost",
        forPlayer: true,
        targetCardId: card.id,
        costType: costType,
        selectedCard: cardIndex,
        targetIndex: null,
      }

      setShowTargetModal(true)
      return
    }

    // Add the animation to the queue instead of playing immediately
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Set the playing card ID for animation
          if (card.id) {
            setPlayingCardId(card.id)
          }

          // Wait for the card play animation
          await new Promise((resolve) => setTimeout(resolve, 300))

          let newState

          if (card.type === "animal") {
            newState = playAnimalCard(gameState, cardIndex, true)
            console.log(`You played ${card.name} (${card.points} points).`)

            // Set the new card ID for field animation
            if (card.id) {
              setNewPlayerFieldCardId(card.id)

              // Add particle effect based on environment
              setTimeout(() => {
                let particleColor = "#ff6666" // Default red for terrestrial
                if (card.environment === "aquatic") particleColor = "#6666ff"
                else if (card.environment === "amphibian") particleColor = "#66ff66"

                addParticleEffect(card.id, particleColor)
              }, 400)
            }
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
              if (card.id) {
                setTimeout(() => {
                  addParticleEffect(card.id, "#aa66ff")
                }, 400)
              }
            } else {
              // If card play failed, update the action message
              console.log(`You played ${card.name}: ${card.effect}`)

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
        } catch (error) {
          console.error("Card drop error:", error)
          // Reset animation states
          setPlayingCardId(null)
          setNewPlayerFieldCardId(null)
        }
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
        try {
          // Validate indices
          const validIndices = selectedIndices.filter((idx) => idx >= 0 && idx < gameState.playerHand.length)
          if (validIndices.length === 0) {
            throw new Error("No valid cards selected for discard")
          }

          // Get the cards being discarded for animation
          const discardedCardIds = validIndices
            .map((index) => gameState.playerHand[index]?.id || 0)
            .filter((id) => id > 0)

          // Set animation state for discarded cards
          if (discardedCardIds.length > 0) {
            setPlayingCardId(discardedCardIds[0]) // Just animate the first one for simplicity
          }

          // Allow animation to start
          await new Promise((resolve) => setTimeout(resolve, 300))

          // Send selected cards to bottom of deck
          const newState = sendCardsToBottom(gameState, validIndices, true)
          console.log(`You sent ${validIndices.length} card(s) to the bottom of the deck.`)

          // Store current hand length to detect new cards
          const currentHandLength = newState.playerHand.length
          const maxDraw = Math.min(2, 6 - currentHandLength)

          // Draw cards (up to 6 total in hand)
          const afterDraw = drawCards(newState, maxDraw, true)
          console.log(`You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`)

          // Get IDs of newly drawn cards for animation
          const drawnCardIds = afterDraw.playerHand
            .slice(currentHandLength)
            .map((card) => card?.id || 0)
            .filter((id) => id > 0)

          setNewCardIds(drawnCardIds)

          // End player's turn
          setGameState(endPlayerTurn(afterDraw))
          setShowDiscardModal(false)

          // Clear animation states after a delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          setNewCardIds([])
          setPlayingCardId(null)
        } catch (error) {
          console.error("Discard confirm error:", error)
          // Reset animation states
          setPlayingCardId(null)
          setNewCardIds([])
          // Close the modal
          setShowDiscardModal(false)
          // End player's turn anyway
          const newState = drawCards(gameState, 1, true)
          setGameState(endPlayerTurn(newState))
        }
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
        try {
          // Show appropriate animation based on the effect type
          if (gameState.pendingEffect) {
            const { type } = gameState.pendingEffect

            // For effects that discard cards
            if (["hunter", "fisher", "limit"].includes(type)) {
              // Get the card ID for animation - add null checking
              const idx = targetIndex as number
              if (idx >= 0 && idx < gameState.opponentField.length) {
                const card = gameState.opponentField[idx]
                if (card && card.id) {
                  setDiscardingCardId(card.id)

                  // Find the card element
                  const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
                  if (cardElement instanceof HTMLElement && discardPileRef.current) {
                    createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
                  }
                }
              }
            }

            // For effects that return cards to deck
            else if (["scare", "epidemic", "compete", "prey"].includes(type)) {
              // Handle single index or array of indices with better error checking
              if (typeof targetIndex === "number") {
                let cardId, card

                // For epidemic - selecting from player field
                if (type === "epidemic" && targetIndex >= 0 && targetIndex < gameState.playerField.length) {
                  card = gameState.playerField[targetIndex]
                  if (card && card.id) {
                    cardId = card.id
                    setReturningToDeckCardId(cardId)

                    // Find card element and use our deck ref for animation
                    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
                    if (cardElement instanceof HTMLElement && deckPileRef.current) {
                      createCardToDeckAnimation(card, cardElement, deckPileRef.current)
                    }
                  }
                }
                // For compete/prey - selecting from player hand
                else if (
                  (type === "compete" || type === "prey") &&
                  targetIndex >= 0 &&
                  targetIndex < gameState.playerHand.length
                ) {
                  card = gameState.playerHand[targetIndex]
                  if (card && card.id) {
                    cardId = card.id
                    setReturningToDeckCardId(cardId)

                    // Find card element and use our deck ref for animation
                    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
                    if (cardElement instanceof HTMLElement && deckPileRef.current) {
                      createCardToDeckAnimation(card, cardElement, deckPileRef.current)
                    }
                  }
                }
                // For scare - checking if player or opponent field
                else if (type === "scare") {
                  const playerFieldLength = gameState.playerField.length
                  if (targetIndex < playerFieldLength && targetIndex >= 0) {
                    card = gameState.playerField[targetIndex]
                  } else if (
                    targetIndex >= playerFieldLength &&
                    targetIndex < playerFieldLength + gameState.opponentField.length
                  ) {
                    card = gameState.opponentField[targetIndex - playerFieldLength]
                  }

                  if (card && card.id) {
                    cardId = card.id
                    setReturningToDeckCardId(cardId)

                    // Find card element and use our deck ref for animation
                    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
                    if (cardElement instanceof HTMLElement && deckPileRef.current) {
                      createCardToDeckAnimation(card, cardElement, deckPileRef.current)
                    }
                  }
                }
              }
            }
            // Add animation for Cage card's first selection (sending to discard)
            else if (type === "cage" && !gameState.pendingEffect.firstSelection) {
              const idx = targetIndex as number
              if (idx >= 0 && idx < gameState.playerField.length) {
                const card = gameState.playerField[idx]
                if (card && card.id) {
                  setDiscardingCardId(card.id)

                  // Find the card element
                  const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
                  if (cardElement instanceof HTMLElement && discardPileRef.current) {
                    createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
                  }
                }
              }
            }
            // Add animation for Cage card's second selection (gaining control)
            else if (type === "cage" && gameState.pendingEffect.firstSelection) {
              const idx = targetIndex as number
              if (idx >= 0 && idx < gameState.opponentField.length) {
                const card = gameState.opponentField[idx]
                if (card && card.id) {
                  // Use a different animation for gaining control
                  setNewPlayerFieldCardId(card.id)

                  // Add animation class for zone transfer
                  const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
                  if (cardElement) {
                    cardElement.classList.add(getZoneTransferAnimation("field", "opponent-field"))

                    // Add particle effect
                    setTimeout(() => {
                      addParticleEffect(card.id, "#ffff00") // Yellow particles for control change
                    }, 100)
                  }
                }
              }
            }
            // Add animation for Trap card (when AI plays it and player selects)
            else if (type === "trap" && !gameState.pendingEffect.forPlayer) {
              const idx = targetIndex as number
              if (idx >= 0 && idx < gameState.playerField.length) {
                const card = gameState.playerField[idx]
                if (card && card.id) {
                  setDiscardingCardId(card.id)

                  // Find the card element
                  const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
                  if (cardElement instanceof HTMLElement && discardPileRef.current) {
                    createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
                  }
                }
              }
            }
            // Find the section in handleTargetConfirm that handles the "epidemic" effect
            // Inside the handleTargetConfirm function, in the try block, add this case for epidemic:
            if (type === "epidemic") {
              const idx = targetIndex as number
              if (idx >= 0 && idx < gameState.playerField.length) {
                const selectedCard = gameState.playerField[idx]
                if (selectedCard && selectedCard.environment) {
                  // Find all cards with the same environment (including the selected card)
                  const cardsToRemove = gameState.playerField.filter(
                    (card) =>
                      card.environment === selectedCard.environment ||
                      (selectedCard.environment === "amphibian" &&
                        (card.environment === "terrestrial" || card.environment === "aquatic")) ||
                      (card.environment === "amphibian" &&
                        (selectedCard.environment === "terrestrial" || selectedCard.environment === "aquatic")),
                  )

                  // Animate each card being sent to the deck bottom
                  cardsToRemove.forEach((card) => {
                    if (card && card.id) {
                      const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
                      if (cardElement instanceof HTMLElement && deckPileRef.current) {
                        createCardToDeckAnimation(card, cardElement, deckPileRef.current)
                      }
                    }
                  })
                }
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
        } catch (error) {
          console.error("Target confirm error:", error)
          // Reset animation states
          setDiscardingCardId(null)
          setReturningToDeckCardId(null)
          setNewPlayerFieldCardId(null)
          // Close the modal
          setShowTargetModal(false)
          // Clear the pending effect and continue
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Effect failed. Your turn continues.",
          })
        }
      },
    ])
  }

  // Handle game restart
  const handleRestartGame = () => {
    const newGame = initializeGame()
    setGameState(newGame)
    setShowAlert(false)
  }

  // Handle animation error dismissal
  const handleDismissError = () => {
    setAnimationError(null)
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
      className="flex flex-col bg-gradient-to-b from-green-800 to-green-950 p-0 text-white w-full h-screen overflow-hidden relative"
      ref={gameBoardRef}
    >
      <AnimationStyles />
      <style jsx global>
        {confettiAnimation}
      </style>

      {/* Header */}
      <div className="flex items-center justify-between p-1 h-8">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToMenu}
          className="flex h-5 items-center gap-1 px-2 py-0 text-[9px] text-green-300"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </Button>
        <div className="text-center text-xs font-bold text-green-300">Bioquest</div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestartGame}
            className="flex h-5 items-center gap-1 px-2 py-0 text-[9px] text-green-300"
          >
            <RefreshCw className="h-3 w-3" /> New
          </Button>
        </div>
      </div>

      {/* Main game content - use flex-1 to take remaining space */}
      <div className="flex flex-col px-2 flex-1 overflow-hidden pb-16">
        {/* AI Hand (face down) */}
        <div className="mb-1">
          <OpponentHand
            cardCount={gameState.opponentHand.length}
            isThinking={isAIThinking}
            playingCardId={aiPlayingCardId}
          />
        </div>

        {/* Opponent field with enhanced styling */}
        <div className="mb-2" ref={opponentFieldRef}>
          <GameBoard
            cards={gameState.opponentField}
            isOpponent={true}
            points={gameState.opponentPoints}
            newCardId={newOpponentFieldCardId}
            discardingCardId={discardingCardId}
            returningToDeckCardId={returningToDeckCardId}
          />
        </div>

        {/* Score display and game log between fields - with enhanced styling */}
        <div className="flex flex-col mb-2">
          {/* Score display and game log in one compact area */}
          <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-sm rounded-md p-1 border border-gray-700/50 shadow-inner">
            {/* Score display */}
            <div className="flex justify-center items-center gap-4 mb-0">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-sm"></div>
                <span className="text-[9px] flex items-center gap-1">
                  AI {isAIThinking && <span className="text-yellow-300 animate-pulse">(Thinking...)</span>}
                </span>
                <span
                  className={`rounded-md ${
                    gameState.opponentPoints >= 7
                      ? "animate-pulse bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-green-700 to-green-800"
                  } px-1 py-0 text-xs font-bold flex items-center gap-1 shadow-sm`}
                >
                  {gameState.opponentPoints}
                  {gameState.opponentPoints >= 7 && (
                    <span className="flex items-center text-yellow-200">
                      <Crown className="h-3 w-3" />
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span
                  className={`rounded-md ${
                    gameState.playerPoints >= 7
                      ? "animate-pulse bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-green-700 to-green-800"
                  } px-1 py-0 text-xs font-bold flex items-center gap-1 shadow-sm`}
                >
                  {gameState.playerPoints}
                  {gameState.playerPoints >= 7 && (
                    <span className="flex items-center text-yellow-200">
                      <Crown className="h-3 w-3" />
                    </span>
                  )}
                </span>
                <span className="text-[9px]">You</span>
                <div className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm"></div>
              </div>
            </div>

            {/* Game Log with enhanced styling */}
            <div className="w-full">
              <div className="text-[9px] text-center overflow-hidden text-white/90 font-medium">
                {lastGameMessage || "Game started. Your turn."}
              </div>
            </div>
          </div>
        </div>

        {/* Player field - moved higher up */}
        <div className="mb-2">
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

        {/* Deck and discard area */}
        <div className="flex items-center justify-between px-16 mb-4 relative z-20">
          {/* Discard pile on the left */}
          <div className="w-[70px] flex-shrink-0">
            <Card
              className={`h-[100px] w-[120px] border-2 border-green-700 bg-gradient-to-br from-green-800 to-green-950 shadow-md relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => setShowDiscardGallery(true)}
              ref={discardPileRef}
            >
              {/* Card frame decoration */}
              <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
              <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

              {/* Inner glow effect */}
              <div
                className="absolute inset-0 opacity-30 rounded-sm pointer-events-none"
                style={{ boxShadow: "inset 0 0 15px rgba(255, 255, 255, 0.2)" }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center">
                {gameState.sharedDiscard.length > 0 ? (
                  <div className="text-center">
                    <div className="text-xs font-bold text-green-400">{gameState.sharedDiscard.length}</div>
                    <div className="text-[8px] text-green-400">Discard</div>
                  </div>
                ) : (
                  <div className="text-[8px] text-green-400 text-center">Empty</div>
                )}
              </div>
            </Card>
          </div>

          {/* Deck on the right */}
          <div className="w-[70px] flex-shrink-0">
            <Card
              ref={deckPileRef}
              className={`h-[100px] w-[120px] ${
                gameState.currentTurn === "player" && gameState.gameStatus === "playing" && !gameState.pendingEffect
                  ? "cursor-pointer hover:scale-105 transition-transform"
                  : "cursor-not-allowed opacity-70"
              } border-2 border-green-700 bg-gradient-to-br from-green-800 to-green-950 shadow-md relative overflow-hidden`}
              onClick={
                gameState.currentTurn === "player" && gameState.gameStatus === "playing" && !gameState.pendingEffect
                  ? handleDrawCards
                  : undefined
              }
            >
              {/* Card frame decoration */}
              <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
              <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

              {/* Inner glow effect */}
              <div
                className="absolute inset-0 opacity-30 rounded-sm pointer-events-none"
                style={{ boxShadow: "inset 0 0 15px rgba(255, 255, 255, 0.2)" }}
              ></div>

              {/* Draw text at the top with enhanced styling */}
              {gameState.currentTurn === "player" && gameState.gameStatus === "playing" && !gameState.pendingEffect && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-700/80 via-green-600/80 to-green-700/80 text-[8px] text-center py-0.5 text-white font-bold shadow-sm">
                  Draw 2
                </div>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="card-back-pattern"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Layers className="h-5 w-5 text-green-400 mb-0 drop-shadow-md" />
                  <div className="text-xs font-bold text-green-400">{gameState.sharedDeck.length}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div
          className="w-full px-2 pb-0.5 bg-gradient-to-r from-green-950/90 via-green-900/90 to-green-950/90 border-t border-green-800/50 shadow-lg z-10"
          style={{ height: "200px", minHeight: "200px", overflow: "visible", paddingTop: "20px" }}
        >
          <PlayerHand
            cards={gameState.playerHand}
            onSelectCard={handleSelectCard}
            onPlayCard={handleCardDrop}
            disabled={
              gameState.currentTurn !== "player" || gameState.gameStatus !== "playing" || !!gameState.pendingEffect
            }
            newCardIds={newCardIds}
            playingCardId={playingCardId}
            size="lg"
          />
        </div>
      </div>

      {/* Add a subtle background pattern to the entire game */}
      <div
        className="absolute inset-0 pointer-events-none bg-repeat opacity-5"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2ZmZiI+PC9jaXJjbGU+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiNmZmYiPjwvY2lyY2xlPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSIxIiBmaWxsPSIjZmZmIj48L2NpcmNsZT4KPC9zdmc+')",
        }}
      ></div>

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

      {/* Find the section where we render the modals for specific effects */}
      {/* Add the missing modal components that aren't being rendered */}

      {/* After the AI Trap selection modal, add these modal components: */}

      {/* Squirrel effect modal */}
      {showSquirrelModal && gameState && (
        <TargetSelectionModal
          open={showSquirrelModal}
          onClose={() => setShowSquirrelModal(false)}
          cards={gameState.opponentHand}
          onConfirm={handleSquirrelSelection}
          title="Select Card to Discard"
          description="Select a card from your opponent's hand to discard."
          filter={undefined}
          playerCardIndices={[]}
        />
      )}

      {/* Find the Tuna effect modal and add a cancel button by modifying it: */}
      {showTunaModal && gameState && (
        <TargetSelectionModal
          open={showTunaModal}
          onClose={() => {
            // When closed without selection, skip the effect
            setShowTunaModal(false)
            // End player's turn without applying the effect
            setGameState(
              endPlayerTurn({
                ...gameState,
                pendingEffect: null,
                message: "You chose not to play an aquatic animal from your hand.",
              }),
            )
          }}
          cards={gameState.playerHand.filter(
            (card) =>
              card.type === "animal" &&
              (card.environment === "aquatic" || card.environment === "amphibian") &&
              (card.points || 0) <= 3,
          )}
          onConfirm={handleTunaSelection}
          title="Play Aquatic Animal"
          description="Select an aquatic or amphibian animal with 3 or fewer points from your hand to play, or close to skip this effect."
          filter={undefined}
          playerCardIndices={[]}
        />
      )}

      {/* Find the Turtle effect modal and add a cancel button by modifying it: */}
      {showTurtleModal && gameState && (
        <TargetSelectionModal
          open={showTurtleModal}
          onClose={() => {
            // When closed without selection, skip the effect
            setShowTurtleModal(false)
            // End player's turn without applying the effect
            setGameState(
              endPlayerTurn({
                ...gameState,
                pendingEffect: null,
                message: "You chose not to play an aquatic animal from your hand.",
              }),
            )
          }}
          cards={gameState.playerHand.filter(
            (card) =>
              card.type === "animal" &&
              (card.environment === "aquatic" || card.environment === "amphibian") &&
              (card.points || 0) <= 2,
          )}
          onConfirm={handleTurtleSelection}
          title="Play Aquatic Animal"
          description="Select an aquatic or amphibian animal with 2 or fewer points from your hand to play, or close to skip this effect."
          filter={undefined}
          playerCardIndices={[]}
        />
      )}

      {/* Crab effect modal */}
      {showCrabModal && gameState && gameState.sharedDeck.length >= 2 && (
        <TargetSelectionModal
          open={showCrabModal}
          onClose={() => setShowCrabModal(false)}
          cards={gameState.sharedDeck.slice(0, 2)}
          onConfirm={handleCrabSelection}
          title="Choose a Card"
          description="Select one card to add to your hand. The other will be sent to the bottom of the deck."
          filter={undefined}
          playerCardIndices={[]}
        />
      )}

      {/* Zebra effect modal */}
      {showZebraModal && gameState && (
        <TargetSelectionModal
          open={showZebraModal}
          onClose={handleZebraEffectClose}
          cards={gameState.opponentHand}
          onConfirm={() => {}}
          title="Opponent's Hand"
          description="You can see your opponent's hand. Click Close when done."
          filter={undefined}
          playerCardIndices={[]}
        />
      )}

      {/* Quit confirmation dialog */}
      <AlertDialog open={showQuitConfirmation} onOpenChange={setShowQuitConfirmation}>
        <AlertDialogContent className="border-2 border-green-700 bg-green-900/90 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Quit Game</AlertDialogTitle>
            <AlertDialogDescription className="text-green-200">{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogAction
              onClick={() => setShowQuitConfirmation(false)}
              className="bg-green-700 hover:bg-green-600"
            >
              Continue Playing
            </AlertDialogAction>
            <AlertDialogAction onClick={() => router.push("/")} className="bg-red-700 hover:bg-red-600">
              Quit Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard pile gallery */}
      <DiscardPileGallery
        open={showDiscardGallery}
        onClose={() => setShowDiscardGallery(false)}
        cards={gameState.sharedDiscard}
      />

      {/* Error recovery UI */}
      {animationError && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-white p-2 rounded-md shadow-lg z-50 flex flex-col items-center">
          <p className="text-xs mb-1">{animationError}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={recoverFromError} className="text-[10px] h-6 py-0">
              Recover Game
            </Button>
            <Button size="sm" variant="outline" onClick={handleDismissError} className="text-[10px] h-6 py-0">
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
