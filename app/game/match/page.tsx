"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { OnlineMatch } from "./online-match"
import { useAuth } from "@/contexts/auth-context"
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

// Import the new animation function
import { createCardToDiscardAnimation } from "@/utils/animation-utils"
import { createCardToDeckAnimation } from "@/utils/animation-utils"

// Import the OpponentHandReveal component
import { OpponentHandReveal } from "@/components/opponent-hand-reveal"
import { resolveAnimalEffect } from "@/utils/game-effects"

// Import our modal components
import { OpponentHandSelectionModal } from "@/components/opponent-hand-selection-modal"
import { PlayerHandSelectionModal } from "@/components/player-hand-selection-modal"

// First, import the new DeckTopCardsModal component
import { DeckTopCardsModal } from "@/components/deck-top-cards-modal"

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
function OriginalGameMatch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deckId = Number.parseInt(searchParams.get("deck") || "1")
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
      if (
        afterAIMove.opponentField.length > currentOpponentFieldLength ||
        (afterAIMove.sharedDiscard.length > gameState.sharedDiscard.length && afterAIMove.message.includes("AI played"))
      ) {
        // Get the newly played card - either from field or from discard
        let newCard
        let isImpactCard = false

        if (afterAIMove.opponentField.length > currentOpponentFieldLength) {
          // Animal card was played to the field
          newCard = afterAIMove.opponentField[afterAIMove.opponentField.length - 1]
        } else {
          // Impact card was played - find it in the discard pile
          // Get the most recently added card to the discard pile
          newCard = afterAIMove.sharedDiscard[afterAIMove.sharedDiscard.length - 1]
          isImpactCard = newCard.type === "impact"
        }

        // Update the AI card play animation section
        setAnimationQueue((prev) => [
          ...prev,
          async () => {
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

            if (!isImpactCard) {
              // For animal cards, show on the field
              setNewOpponentFieldCardId(newCard.id)

              // Add particle effect based on card type
              let particleColor = "#ff6666" // Default red for terrestrial
              if (newCard.environment === "aquatic") particleColor = "#6666ff"
              else if (newCard.environment === "amphibian") particleColor = "#66ff66"

              // Wait a moment for the card to appear on the board
              setTimeout(() => {
                addParticleEffect(newCard.id, particleColor)
              }, 100)
            } else {
              // For impact cards, add an animation to the discard pile
              if (discardPileRef.current) {
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
                cardContent.className = "h-full w-full rounded-md shadow-lg border-2 border-purple-600 bg-purple-900"

                // Add card name
                const nameDiv = document.createElement("div")
                nameDiv.className = "text-center text-white text-xs font-bold mt-2"
                nameDiv.textContent = newCard.name
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
                  discardPileRef.current.classList.remove("discard-highlight")
                }, 1000)

                // Wait for animation to complete
                await new Promise((resolve) => setTimeout(resolve, 1000))
              }
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
    }
  }, [gameState])

  // Add this effect to handle the Crab effect
  // Add this with the other useEffect hooks that check for pending effects
  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    // Check if we have a pending effect
    if (gameState.pendingEffect.type === "crab" && gameState.pendingEffect.forPlayer) {
      setShowCrabModal(true)
    }
  }, [gameState])

  // Add this effect to handle the Zebra effect - place it with the other useEffect hooks that check for pending effects
  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    // Check if we have a pending effect
    if (gameState.pendingEffect.type === "zebra" && gameState.pendingEffect.forPlayer) {
      setShowOpponentHand(true)
    }
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
        const card = gameState.playerField[targetIndex as number]
        setDiscardingCardId(cardId)

        // Find the card element and use our new animation
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
        if (cardElement instanceof HTMLElement && discardPileRef.current) {
          // Use our new animation function
          createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
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
        // Get the card being discarded
        const targetCard = gameState.opponentHand[targetIndex]

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
      },
    ])
  }

  // Add handlers for Tuna and Turtle effects
  const handleTunaSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Get the card being played
        const targetCard = gameState.playerHand[targetIndex]

        // Create a new state with the card played
        const newPlayerHand = [...gameState.playerHand]
        newPlayerHand.splice(targetIndex, 1)

        const newState = {
          ...gameState,
          playerHand: newPlayerHand,
          playerField: [...gameState.playerField, targetCard],
          playerPoints: gameState.playerPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `You played ${targetCard.name} from your hand.`,
        }

        // Log the effect resolution
        console.log(newState.message)

        // Set the new card ID for field animation
        setNewPlayerFieldCardId(targetCard.id)

        // Add particle effect based on environment
        setTimeout(() => {
          let particleColor = "#ff6666" // Default red for terrestrial
          if (targetCard.environment === "aquatic") particleColor = "#6666ff"
          else if (targetCard.environment === "amphibian") particleColor = "#66ff66"

          addParticleEffect(targetCard.id, particleColor)
        }, 400)

        // End player's turn
        setGameState(endPlayerTurn(newState))
        setShowTunaModal(false)

        // Wait for field animation to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Clear animation states
        setNewPlayerFieldCardId(null)
      },
    ])
  }

  const handleTurtleSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        // Get the card being played
        const targetCard = gameState.playerHand[targetIndex]

        // Create a new state with the card played
        const newPlayerHand = [...gameState.playerHand]
        newPlayerHand.splice(targetIndex, 1)

        const newState = {
          ...gameState,
          playerHand: newPlayerHand,
          playerField: [...gameState.playerField, targetCard],
          playerPoints: gameState.playerPoints + (targetCard.points || 0),
          pendingEffect: null,
          message: `You played ${targetCard.name} from your hand.`,
        }

        // Log the effect resolution
        console.log(newState.message)

        // Set the new card ID for field animation
        setNewPlayerFieldCardId(targetCard.id)

        // Add particle effect based on environment
        setTimeout(() => {
          let particleColor = "#ff6666" // Default red for terrestrial
          if (targetCard.environment === "aquatic") particleColor = "#6666ff"
          else if (targetCard.environment === "amphibian") particleColor = "#66ff66"

          addParticleEffect(targetCard.id, particleColor)
        }, 400)

        // End player's turn
        setGameState(endPlayerTurn(newState))
        setShowTurtleModal(false)

        // Wait for field animation to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Clear animation states
        setNewPlayerFieldCardId(null)
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
        // Get the selected card and the other card
        const topCards = gameState.sharedDeck.slice(0, 2)
        const selectedCard = topCards[selectedIndex]
        const otherCard = topCards[1 - selectedIndex]

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
          // Show the opponent's hand
          setShowOpponentHand(true)
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

      case "frog":
        setTargetTitle("Select Animal")
        setTargetDescription("Select an animal with 2 or fewer points to return to its owner's hand.")
        setTargetFilter((card) => (card?.points || 0) <= 2)
        setTargetCards([...gameState.playerField, ...gameState.opponentField])
        setShowTargetModal(true)
        // Mark player's cards
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

      case "crocodile":
        setTargetTitle("Select Animal")
        setTargetDescription("Select an animal with 3 or fewer points to destroy.")
        setTargetFilter((card) => (card?.points || 0) <= 3)
        setTargetCards([...gameState.playerField, ...gameState.opponentField])
        setShowTargetModal(true)
        // Mark player's cards
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

      case "dolphin":
        setTargetTitle("Rearrange Cards")
        setTargetDescription("Look at the top cards of the deck and rearrange them.")
        setTargetFilter(undefined)
        setTargetCards(gameState.sharedDeck.slice(0, Math.min(3, gameState.sharedDeck.length)))
        setShowTargetModal(true)
        // No player cards
        playerCardIndices = []
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
        setTargetTitle("Zebra Effect")
        setTargetDescription("View your opponent's hand.")
        setShowOpponentHand(true)
        playerCardIndices = []
        break
    }

    // Store the player card indices
    setPlayerCardIndices(playerCardIndices)
  }, [gameState, showTargetModal, isHandlingConfuse])

  // Handle player drawing cards
  const handleDrawCards = () => {
    if (!gameState) return

    // Check if hand is already full (6 cards)
    if (gameState.playerHand.length >= 6) {
      console.log("Your hand is full (maximum 6 cards). You must play a card first.")
      // Update the message without drawing cards
      setLastGameMessage("Your hand is full (maximum 6 cards). You must play a card first.")
      return
    }

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
        const maxDraw = Math.min(2, 6 - currentHandLength)

        // Draw cards (up to 6 total in hand)
        const newState = drawCards(gameState, maxDraw, true)
        console.log(`You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`)

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
        const maxDraw = Math.min(2, 6 - currentHandLength)

        // Draw cards (up to 6 total in hand)
        const afterDraw = drawCards(newState, maxDraw, true)
        console.log(`You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`)

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
            const card = gameState.opponentField[idx]
            setDiscardingCardId(cardId)

            // Find the card element
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
            if (cardElement instanceof HTMLElement && discardPileRef.current) {
              // Use our new animation function
              createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
            }
          }

          // For effects that return cards to deck
          else if (["scare", "epidemic", "compete", "prey"].includes(type)) {
            // Handle single index or array of indices
            if (typeof targetIndex === "number") {
              let cardId, card
              if (type === "epidemic") {
                // For epidemic, we're only selecting from player field
                cardId = gameState.playerField[targetIndex].id
                card = gameState.playerField[targetIndex]
              } else if (type === "compete" || type === "prey") {
                // For compete, we're selecting from player hand or field
                cardId = gameState.playerHand[targetIndex].id
                card = gameState.playerHand[targetIndex]
              } else {
                // For scare, we need to check if it's player or opponent field
                const playerFieldLength = gameState.playerField.length
                if (targetIndex < playerFieldLength) {
                  cardId = gameState.playerField[targetIndex].id
                  card = gameState.playerField[targetIndex]
                } else {
                  cardId = gameState.opponentField[targetIndex - playerFieldLength].id
                  card = gameState.opponentField[targetIndex - playerFieldLength]
                  card = gameState.opponentField[targetIndex - playerFieldLength]
                }
              }
              setReturningToDeckCardId(cardId)

              // Find card element and use our deck ref for animation
              const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)

              if (cardElement instanceof HTMLElement && deckPileRef.current) {
                // Use our new animation function
                createCardToDeckAnimation(card, cardElement, deckPileRef.current)
              }
            }
          }
          // Add animation for Cage card's first selection (sending to discard)
          else if (type === "cage" && !gameState.pendingEffect.firstSelection) {
            const cardId = gameState.playerField[targetIndex as number].id
            const card = gameState.playerField[targetIndex as number]
            setDiscardingCardId(cardId)

            // Find the card element
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
            if (cardElement instanceof HTMLElement && discardPileRef.current) {
              // Use our new animation function
              createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
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
            const card = gameState.playerField[targetIndex as number]
            setDiscardingCardId(cardId)

            // Find the card element
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
            if (cardElement instanceof HTMLElement && discardPileRef.current) {
              // Use our new animation function
              createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
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
      <div className="flex flex-col px-2 flex-1 overflow-hidden pb-20">
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
          <div className="bg-black/30 rounded-md p-1 mb-0">
            {/* Score display */}
            <div className="flex justify-center items-center gap-4 mb-0">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-700"></div>
                <span className="text-[9px] flex items-center gap-1">
                  AI {isAIThinking && <span className="text-yellow-300">(Thinking...)</span>}
                </span>
                <span
                  className={`rounded-md ${
                    gameState.opponentPoints >= 7 ? "animate-pulse bg-yellow-600" : "bg-green-700"
                  } px-1 py-0 text-xs font-bold flex items-center gap-1`}
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
                  } px-1 py-0 text-xs font-bold flex items-center gap-1`}
                >
                  {gameState.playerPoints}
                  {gameState.playerPoints >= 7 && (
                    <span className="flex items-center text-yellow-400">
                      <Crown className="h-3 w-3" />
                    </span>
                  )}
                </span>
                <span className="text-[9px]">You</span>
                <div className="h-2 w-2 rounded-full bg-blue-700"></div>
              </div>
            </div>

            {/* Game Log */}
            <div className="w-full">
              <div className="text-[9px] text-center overflow-hidden text-white">
                {lastGameMessage || "Game started. Your turn."}
              </div>
            </div>
          </div>
        </div>

        {/* Player field */}
        <div className="mt-0 flex-1">
          <div className="flex items-center justify-between gap-1 h-full">
            {/* Discard pile on the left */}
            <div className="w-[70px] flex-shrink-0">
              <Card
                className={`h-[100px] w-[65px] border-2 border-green-700 bg-green-900 shadow-md relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setShowDiscardGallery(true)}
                ref={discardPileRef}
              >
                {/* Card frame decoration */}
                <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
                <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

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
                ref={deckPileRef}
                className={`h-[100px] w-[65px] ${
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
                    <div className="absolute top-0 left-0 right-0 bg-green-700/80 text-[8px] text-center py-0.5 text-white font-bold">
                      Draw 2
                    </div>
                  )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="card-back-pattern"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Layers className="h-5 w-5 text-green-400 mb-0" />
                    <div className="text-xs font-bold text-green-400">{gameState.sharedDeck.length}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Player hand - positioned higher on screen */}
      <div className="w-full px-2 pb-1 pt-0 bg-green-950/80 border-t border-green-800 absolute bottom-16 left-0 right-0">
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
                <Card className="h-[200px] w-[140px] border-4 border-red-700 bg-red-900 shadow-xl">
                  <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-br from-red-800/20 to-black/30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="card-back-pattern"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full border-4 border-red-400 flex items-center justify-center">
                        <span className="text-lg font-bold text-red-400">AI</span>
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
                  className={`h-[200px] w-[140px] border-4 ${
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
                    <div className="text-center text-xs font-bold">{aiPlayedCard.name}</div>
                    <div className="relative h-[120px] w-full flex items-center justify-center">
                      {getCardArt(aiPlayedCard)}
                    </div>
                    <div className="w-full text-center text-[10px]">
                      {aiPlayedCard.type === "animal" ? (
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-800 px-1 rounded text-[9px]">{aiPlayedCard.environment}</span>
                          <span className="bg-yellow-600 px-1 rounded text-[9px]">{aiPlayedCard.points} pts</span>
                        </div>
                      ) : (
                        <div className="text-[9px] text-gray-300">{aiPlayedCard.effect}</div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="absolute top-full mt-2 text-center w-full">
              <div className="bg-red-900/80 text-white text-xs px-2 py-1 rounded-md">AI plays {aiPlayedCard.name}</div>
            </div>
          </div>
        </div>
      )}
      {/* AI animation overlays */}
      {aiDrawingCards && (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
          <div className="absolute right-1/4 top-1/4 flex items-center justify-center">
            <div className="relative h-16 w-16 rounded-full bg-red-500/20 animate-pulse"></div>
            {Array.from({ length: aiDrawnCardCount }).map((_, i) => (
              <div
                key={i}
                className="absolute h-14 w-10 rounded-md border-2 border-red-600 bg-green-800 shadow-lg animate-ai-draw"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold">
                  AI
                </div>
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
                className="absolute h-14 w-10 rounded-md border border-red-600 bg-red-800 shadow-md animate-discard"
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
              <div className="animate-bounce rounded-full bg-yellow-500/20 p-4 text-center">
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 top-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-confetti absolute h-2 w-2 rounded-full bg-yellow-400"
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
      {/* Opponent Hand Reveal Modal */}
      <OpponentHandReveal
        open={showOpponentHand}
        onClose={() => {
          // If it's the Zebra effect, use the dedicated handler
          if (gameState?.pendingEffect?.type === "zebra") {
            handleZebraEffectClose()
          } else if (gameState?.pendingEffect?.type === "octopus") {
            // Keep the existing octopus handling
            setShowOpponentHand(false)
            const newState = resolveAnimalEffect(gameState, 0)
            setGameState(newState)
          } else {
            // Default close behavior
            setShowOpponentHand(false)
          }
        }}
        cards={gameState?.opponentHand || []}
        title={gameState?.pendingEffect?.type === "zebra" ? "Zebra Effect: Opponent's Hand" : "Opponent's Hand"}
        description={
          gameState?.pendingEffect?.type === "zebra"
            ? "You're looking at your opponent's hand. Click close when done."
            : undefined
        }
      />
      {/* Add the OpponentHandSelectionModal component to the JSX */}
      {/* Add this near the bottom of the component, with the other modals */}
      <OpponentHandSelectionModal
        open={showSquirrelModal}
        onClose={() => setShowSquirrelModal(false)}
        cards={gameState?.opponentHand || []}
        onSelect={handleSquirrelSelection}
        title="Squirrel Effect: Select a Card to Discard"
        description="Choose one of your opponent's cards to send to the discard pile."
      />
      {/* Add the PlayerHandSelectionModal components for Tuna and Turtle effects */}
      <PlayerHandSelectionModal
        open={showTunaModal}
        onClose={() => setShowTunaModal(false)}
        cards={gameState?.playerHand || []}
        onSelect={handleTunaSelection}
        title="Tuna Effect: Play an Aquatic Animal"
        description="Select an aquatic animal from your hand to play."
        filter={(card) =>
          card.type === "animal" && (card.environment === "aquatic" || card.environment === "amphibian")
        }
      />
      <PlayerHandSelectionModal
        open={showTurtleModal}
        onClose={() => setShowTurtleModal(false)}
        cards={gameState?.playerHand || []}
        onSelect={handleTurtleSelection}
        title="Turtle Effect: Play a Small Aquatic Animal"
        description="Select an aquatic animal with 2 or fewer points from your hand to play."
        filter={(card) =>
          card.type === "animal" &&
          (card.environment === "aquatic" || card.environment === "amphibian") &&
          (card.points || 0) <= 2
        }
      />
      {/* Add the DeckTopCardsModal component to the JSX */}
      {/* Add this near the bottom of the component, with the other modals */}
      <DeckTopCardsModal
        open={showCrabModal}
        onClose={() => setShowCrabModal(false)}
        cards={gameState?.sharedDeck.slice(0, Math.min(2, gameState?.sharedDeck.length || 0)) || []}
        onSelect={handleCrabSelection}
        title="Crab Effect: Choose a Card"
        description="Select one card to add to your hand. The other will be sent to the bottom of the deck."
      />
      {/* Add the OpponentHandReveal component for Zebra effect */}
      <OpponentHandReveal
        open={showOpponentHand && gameState?.pendingEffect?.type === "zebra"}
        onClose={handleZebraEffectClose}
        cards={gameState?.opponentHand || []}
        title="Zebra Effect: Opponent's Hand"
        description="Here are the cards in your opponent's hand."
      />
    </div>
  )
}

export default function MatchPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const roomCode = searchParams.get("room")
  const deckId = searchParams.get("deck")
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Redirect to sign in if trying to play online without being logged in
  useEffect(() => {
    if (!isLoading && !user && (mode === "host" || mode === "join") && !isRedirecting) {
      setIsRedirecting(true)
      router.push("/auth/sign-in")
    }
  }, [user, isLoading, mode, router, isRedirecting])

  // Redirect to deck selection if trying to play without selecting a deck
  useEffect(() => {
    if (mode === "ai" && !deckId && !isRedirecting) {
      setIsRedirecting(true)
      router.push("/game/deck-selection?mode=ai")
    }
  }, [mode, deckId, router, isRedirecting])

  // Redirect to online page if trying to play online without a room code
  useEffect(() => {
    if ((mode === "host" || mode === "join") && !roomCode && !isRedirecting) {
      setIsRedirecting(true)
      router.push("/game/online")
    }
  }, [mode, roomCode, router, isRedirecting])

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If mode is AI, use the original game match component
  if (mode === "ai") {
    return <OriginalGameMatch />
  }

  // If mode is host or join, use the online match component
  if ((mode === "host" || mode === "join") && roomCode) {
    return <OnlineMatch roomCode={roomCode} />
  }

  // Default to AI mode if no valid mode is specified
  return <OriginalGameMatch />
}

// Define handleZebraEffectClose
function handleZebraEffectClose() {
  // Implement the logic to close the Zebra effect modal and resolve the effect
  // For example:
  // setShowOpponentHand(false);
  // if (gameState?.pendingEffect?.type === "zebra") {
  //   const newState = resolveAnimalEffect(gameState, 0);
  //   setGameState(newState);
  // }
}
