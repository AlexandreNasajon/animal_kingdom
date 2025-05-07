"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
import { createCardToDiscardAnimation } from "@/utils/animation-utils"
import { applyAnimalEffect } from "@/utils/game-effects"
import { DiscardPileGallery } from "@/components/discard-pile-gallery"
import { createDrawCardAnimation } from "@/utils/animation-utils"

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

  const [newCardIds, setNewCardIds] = useState<number[]>([])
  const [newPlayerFieldCardId, setNewPlayerFieldCardId] = useState<number | null>(null)
  const [newOpponentFieldCardId, setNewOpponentFieldCardId] = useState<number | null>(null)
  const [playingCardId, setPlayingCardId] = useState<number | null>(null)
  const [aiPlayingCardId, setAiPlayingCardId] = useState<number | null>(null)
  const [aiDrawingCards, setAiDrawingCards] = useState(false)
  const [aiDiscardingCards, setAiDiscardingCards] = useState<number[]>([])
  const [aiDiscardedCardIds, setAiDiscardedCardIds] = useState<number[]>([])
  const [aiDrawnCardCount, setAiDrawnCardCount] = useState(0)

  const [aiPlayedCard, setAiPlayedCard] = useState<GameCard | null>(null)
  const [showAiCardAnimation, setShowAiCardAnimation] = useState(false)
  const [aiCardAnimationPhase, setAiCardAnimationPhase] = useState<"flip" | "toField" | "done">("flip")
  const [aiCardFieldPosition, setAiCardFieldPosition] = useState({ top: 0, left: 0 })

  const [discardingCardId, setDiscardingCardId] = useState<number | null>(null)
  const [returningToDeckCardId, setReturningToDeckCardId] = useState<number | null>(null)

  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [discardCount, setDiscardCount] = useState(0)
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetTitle, setTargetTitle] = useState("")
  const [targetDescription, setTargetDescription] = useState("")
  const [targetFilter, setTargetFilter] = useState<((card: GameCard) => boolean) | undefined>(undefined)
  const [targetCards, setTargetCards] = useState<GameCard[]>([])

  const [playerCardIndices, setPlayerCardIndices] = useState<number[]>([])

  const [showAITrapModal, setShowAITrapModal] = useState(false)

  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false)

  const [isAnimating, setIsAnimating] = useState(false)
  const [animationQueue, setAnimationQueue] = useState<Array<() => Promise<void>>>([])

  const [isHandlingConfuse, setIsHandlingConfuse] = useState(false)

  const skipConfuseModalRef = useRef(false)

  const gameBoardRef = useRef<HTMLDivElement>(null)
  const opponentFieldRef = useRef<HTMLDivElement>(null)

  const lastPlayedCardRef = useRef<GameCard | null>(null)

  const [showDiscardGallery, setShowDiscardGallery] = useState(false)

  const discardPileRef = useRef<HTMLDivElement>(null)

  const deckPileRef = useRef<HTMLDivElement>(null)

  const [showOpponentHand, setShowOpponentHand] = useState(false)

  const [showSquirrelModal, setShowSquirrelModal] = useState(false)

  const [showTunaModal, setShowTunaModal] = useState(false)
  const [showTurtleModal, setShowTurtleModal] = useState(false)

  const [showCrabModal, setShowCrabModal] = useState(false)

  const [showZebraModal, setShowZebraModal] = useState(false)

  const [animationError, setAnimationError] = useState<string | null>(null)

  const [aiDrawing, setAiDrawing] = useState(false)
  const [aiDrawCount, setAiDrawCount] = useState(0)
  const [aiDiscarding, setAiDiscarding] = useState(false)

  const recoverFromError = useCallback(() => {
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

    setShowTargetModal(false)
    setShowDiscardModal(false)
    setShowSquirrelModal(false)
    setShowTunaModal(false)
    setShowTurtleModal(false)
    setShowCrabModal(false)
    setShowZebraModal(false)
    setShowAITrapModal(false)

    setAnimationQueue([])
    setIsAnimating(false)

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

  useEffect(() => {
    if (gameState && gameState.message) {
      setLastGameMessage(gameState.message)
    }
  }, [gameState])

  const handleBackToMenu = useCallback(() => {
    if (gameState?.gameStatus !== "playing") {
      router.push("/")
      return
    }

    setAlertMessage("Are you sure you want to quit the current game?")
    setShowQuitConfirmation(true)
  }, [gameState?.gameStatus, router, setAlertMessage, setShowQuitConfirmation])

  const addParticleEffect = (cardId: number | undefined, color: string) => {
    if (!cardId) return

    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
    if (cardElement instanceof HTMLElement) {
      createParticles(cardElement, color, 15)
    }
  }

  const safeGetCard = (cards: GameCard[] | undefined, index: number): GameCard | null => {
    if (!cards || index < 0 || index >= cards.length) {
      return null
    }
    return cards[index]
  }

  useEffect(() => {
    const newGame = initializeGame(deckId)
    setGameState(newGame)
    setLastGameMessage("Game started. Your turn.")
  }, [deckId])

  // Update the AI turn handling to properly handle and resolve AI card effects

  // Find the useEffect that handles AI turn and update it to better handle AI effects
  // Around line 200-300, update the AI turn effect to include better effect handling:

  // Update the AI turn effect to better handle AI card effects
  useEffect(() => {
    if (!gameState || gameState.currentTurn !== "opponent" || gameState.gameStatus !== "playing") {
      return
    }

    setIsAIThinking(true)
    const aiTimer = setTimeout(() => {
      const currentOpponentHandLength = gameState.opponentHand.length
      const currentOpponentFieldLength = gameState.opponentField.length

      if (
        gameState.opponentHand.length >= 5 &&
        gameState.opponentHand.every((card) => card.type === "impact" || (card.points || 0) <= 1)
      ) {
        setAnimationQueue((prev) => [
          ...prev,
          async () => {
            try {
              setAiDiscardingCards(true)

              const discardCount = gameState.opponentHand.length === 5 ? 1 : 2

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

              const discardedCardIds = discardIndices
                .filter((index) => index >= 0 && index < gameState.opponentHand.length)
                .map((index) => {
                  const card = gameState.opponentHand[index]
                  return card?.id || 0
                })
                .filter((id) => id > 0)

              setAiDiscardedCardIds(discardedCardIds)

              await new Promise((resolve) => setTimeout(resolve, 1200))

              const afterDiscard = sendCardsToBottom(gameState, discardIndices, false)
              console.log(`AI sent ${discardCount} card(s) to the bottom of the deck.`)

              setAiDiscardingCards(false)
              setAiDrawingCards(true)
              setAiDrawnCardCount(2)

              await new Promise((resolve) => setTimeout(resolve, 800))

              const afterDraw = drawCards(afterDiscard, 2, false)
              console.log(`AI drew 2 cards.`)

              await new Promise((resolve) => setTimeout(resolve, 500))

              setAiDrawingCards(false)
              setGameState(endAITurn(afterDraw))
            } catch (error) {
              console.error("AI discard/draw animation error:", error)
              setAiDiscardingCards(false)
              setAiDrawingCards(false)
              const afterDraw = drawCards(gameState, 2, false)
              setGameState(endAITurn(afterDraw))
            }
          },
        ])

        return
      }

      const afterAIMove = makeAIDecision(gameState)

      // Check if AI played a card with an effect
      if (afterAIMove.pendingEffect && !afterAIMove.pendingEffect.forPlayer) {
        console.log(`AI played a card with effect: ${afterAIMove.pendingEffect.type}`)

        // Handle different effect types
        const effectType = afterAIMove.pendingEffect.type

        if (effectType === "squirrel") {
          // For Squirrel effect, AI targets a random card from player's hand
          if (gameState.playerHand.length > 0) {
            // Choose a random card from player's hand
            const randomIndex = Math.floor(Math.random() * gameState.playerHand.length)

            setAnimationQueue((prev) => [
              ...prev,
              async () => {
                try {
                  const targetCard = gameState.playerHand[randomIndex]
                  console.log(`AI used Squirrel to discard ${targetCard.name} from your hand`)

                  if (targetCard.id) {
                    setDiscardingCardId(targetCard.id)
                  }

                  await new Promise((resolve) => setTimeout(resolve, 800))

                  const resolvedState = resolveEffect(afterAIMove, randomIndex)

                  setDiscardingCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(resolvedState))
                } catch (error) {
                  console.error("AI Squirrel effect error:", error)
                  setDiscardingCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(afterAIMove))
                }
              },
            ])
            return
          }
        } else if (effectType === "mouse") {
          // For Mouse effect, AI targets the highest value terrestrial animal
          const targetableCards = gameState.playerField.filter(
            (card) => card.environment === "terrestrial" || card.environment === "amphibian",
          )

          if (targetableCards.length > 0) {
            // Find the highest value target
            const targetIndex = gameState.playerField.findIndex(
              (card) => card.id === targetableCards.sort((a, b) => (b.points || 0) - (a.points || 0))[0].id,
            )

            setAnimationQueue((prev) => [
              ...prev,
              async () => {
                try {
                  const targetCard = gameState.playerField[targetIndex]
                  console.log(`AI used Mouse to send your ${targetCard.name} to the top of the deck`)

                  if (targetCard.id) {
                    setReturningToDeckCardId(targetCard.id)
                  }

                  await new Promise((resolve) => setTimeout(resolve, 800))

                  const resolvedState = resolveEffect(afterAIMove, targetIndex)

                  setReturningToDeckCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(resolvedState))
                } catch (error) {
                  console.error("AI Mouse effect error:", error)
                  setReturningToDeckCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(afterAIMove))
                }
              },
            ])
            return
          }
        } else if (effectType === "tuna" || effectType === "turtle") {
          // For Tuna/Turtle effect, AI plays an aquatic animal from its hand
          const eligibleCards = afterAIMove.opponentHand.filter(
            (card) =>
              card.type === "animal" &&
              (card.environment === "aquatic" || card.environment === "amphibian") &&
              (effectType === "tuna" ? (card.points || 0) <= 3 : (card.points || 0) <= 2),
          )

          if (eligibleCards.length > 0) {
            // Sort by points (highest first)
            const sortedCards = [...eligibleCards].sort((a, b) => (b.points || 0) - (a.points || 0))
            const bestCard = sortedCards[0]
            const cardIndex = afterAIMove.opponentHand.findIndex((card) => card.id === bestCard.id)

            setAnimationQueue((prev) => [
              ...prev,
              async () => {
                try {
                  console.log(
                    `AI used ${effectType === "tuna" ? "Tuna" : "Turtle"} to play ${bestCard.name} from its hand`,
                  )

                  // Resolve the effect by playing the card
                  const resolvedState = resolveEffect(afterAIMove, cardIndex)

                  // If the played card has its own effect, it will be in the pendingEffect
                  if (resolvedState.pendingEffect && !resolvedState.pendingEffect.forPlayer) {
                    // Recursively resolve the new effect
                    const finalState = resolveEffect(resolvedState)
                    setIsAIThinking(false)
                    setGameState(endAITurn(finalState))
                  } else {
                    setIsAIThinking(false)
                    setGameState(endAITurn(resolvedState))
                  }
                } catch (error) {
                  console.error(`AI ${effectType} effect error:`, error)
                  setIsAIThinking(false)
                  setGameState(endAITurn(afterAIMove))
                }
              },
            ])
            return
          }
        } else if (effectType === "crab") {
          // For Crab effect, AI looks at top 2 cards and takes the best one
          setAnimationQueue((prev) => [
            ...prev,
            async () => {
              try {
                console.log(`AI used Crab to look at the top 2 cards of the deck`)

                // AI will automatically choose the best card in resolveEffect
                const resolvedState = resolveEffect(afterAIMove)

                setIsAIThinking(false)
                setGameState(endAITurn(resolvedState))
              } catch (error) {
                console.error("AI Crab effect error:", error)
                setIsAIThinking(false)
                setGameState(endAITurn(afterAIMove))
              }
            },
          ])
          return
        } else if (effectType === "zebra") {
          // For Zebra effect, AI just looks at player's hand and continues
          setAnimationQueue((prev) => [
            ...prev,
            async () => {
              try {
                console.log(`AI used Zebra to look at your hand`)

                // No need to make any choice, just resolve the effect
                const resolvedState = {
                  ...afterAIMove,
                  pendingEffect: null,
                  message: "AI looked at your hand using Zebra.",
                }

                setIsAIThinking(false)
                setGameState(endAITurn(resolvedState))
              } catch (error) {
                console.error("AI Zebra effect error:", error)
                setIsAIThinking(false)
                setGameState(endAITurn(afterAIMove))
              }
            },
          ])
          return
        } else if (effectType === "octopus") {
          // For Octopus effect, AI just looks at the top cards and randomly rearranges them
          setAnimationQueue((prev) => [
            ...prev,
            async () => {
              try {
                console.log(`AI used Octopus to rearrange the top cards of the deck`)

                const topCards = gameState.sharedDeck.slice(0, Math.min(3, gameState.sharedDeck.length))

                if (topCards.length > 0) {
                  // Randomly shuffle the top cards (AI doesn't need to make strategic choices here)
                  const shuffledIndices = Array.from({ length: topCards.length }, (_, i) => i).sort(
                    () => Math.random() - 0.5,
                  )

                  // Resolve the effect with the shuffled indices
                  const resolvedState = resolveEffect(afterAIMove, shuffledIndices)

                  setIsAIThinking(false)
                  setGameState(endAITurn(resolvedState))
                  return
                }

                // If no cards to rearrange, just end the turn
                setIsAIThinking(false)
                setGameState(
                  endAITurn({
                    ...afterAIMove,
                    pendingEffect: null,
                    message: "AI used Octopus but there were no cards to rearrange.",
                  }),
                )
              } catch (error) {
                console.error("AI Octopus effect error:", error)
                setIsAIThinking(false)
                setGameState(endAITurn(afterAIMove))
              }
            },
          ])
          return
        } else if (effectType === "crocodile") {
          // For Crocodile effect, AI targets player's animal with 3 or fewer points
          const targetableCards = gameState.playerField.filter((card) => (card.points || 0) <= 3)

          if (targetableCards.length > 0) {
            // Find the highest value target
            const sortedTargets = [...targetableCards].sort((a, b) => (b.points || 0) - (a.points || 0))
            const targetIndex = gameState.playerField.findIndex((card) => card.id === sortedTargets[0].id)

            setAnimationQueue((prev) => [
              ...prev,
              async () => {
                try {
                  const targetCard = gameState.playerField[targetIndex]
                  console.log(`AI used Crocodile to send your ${targetCard.name} to the bottom of the deck`)

                  if (targetCard.id) {
                    setReturningToDeckCardId(targetCard.id)
                  }

                  await new Promise((resolve) => setTimeout(resolve, 800))

                  const resolvedState = resolveEffect(afterAIMove, targetIndex)

                  setReturningToDeckCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(resolvedState))
                } catch (error) {
                  console.error("AI Crocodile effect error:", error)
                  setReturningToDeckCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(afterAIMove))
                }
              },
            ])
            return
          }
        } else if (effectType === "lion") {
          // For Lion effect, AI targets player's animal with 4+ points
          const targetableCards = gameState.playerField.filter((card) => (card.points || 0) >= 4)

          if (targetableCards.length > 0) {
            // Find the highest value target
            const sortedTargets = [...targetableCards].sort((a, b) => (b.points || 0) - (a.points || 0))
            const targetIndex = gameState.playerField.findIndex((card) => card.id === sortedTargets[0].id)

            setAnimationQueue((prev) => [
              ...prev,
              async () => {
                try {
                  const targetCard = gameState.playerField[targetIndex]
                  console.log(`AI used Lion to destroy your ${targetCard.name}`)

                  if (targetCard.id) {
                    setDiscardingCardId(targetCard.id)
                  }

                  await new Promise((resolve) => setTimeout(resolve, 800))

                  const resolvedState = resolveEffect(afterAIMove, targetIndex)

                  setDiscardingCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(resolvedState))
                } catch (error) {
                  console.error("AI Lion effect error:", error)
                  setDiscardingCardId(null)
                  setIsAIThinking(false)
                  setGameState(endAITurn(afterAIMove))
                }
              },
            ])
            return
          }
        } else {
          // For any other effect, resolve it automatically
          setAnimationQueue((prev) => [
            ...prev,
            async () => {
              try {
                console.log(`AI resolving effect: ${effectType}`)

                // Generic effect resolution
                const resolvedState = resolveEffect(afterAIMove)

                setIsAIThinking(false)
                setGameState(endAITurn(resolvedState))
              } catch (error) {
                console.error(`AI ${effectType} effect error:`, error)
                setIsAIThinking(false)
                setGameState(
                  endAITurn({
                    ...afterAIMove,
                    pendingEffect: null,
                    message: `AI tried to use ${effectType} but it failed.`,
                  }),
                )
              }
            },
          ])
          return
        }
      }

      if (afterAIMove.opponentHand.length > currentOpponentHandLength) {
        setAnimationQueue((prev) => [
          ...prev,
          async () => {
            try {
              setAiDrawingCards(true)
              setAiDrawnCardCount(afterAIMove.opponentHand.length - currentOpponentHandLength)
              console.log(`AI drew ${afterAIMove.opponentHand.length - currentOpponentHandLength} cards.`)

              setIsAIThinking(false)

              await new Promise((resolve) => setTimeout(resolve, 600))

              setAiDrawingCards(false)
              setGameState(endAITurn(afterAIMove))
            } catch (error) {
              console.error("AI draw animation error:", error)
              setAiDrawingCards(false)
              setGameState(endAITurn(afterAIMove))
            }
          },
        ])

        return
      }

      if (
        afterAIMove.opponentField.length > currentOpponentFieldLength ||
        (afterAIMove.sharedDiscard.length > gameState.sharedDiscard.length && afterAIMove.message.includes("AI played"))
      ) {
        let newCard: GameCard | undefined
        let isImpactCard = false

        if (afterAIMove.opponentField.length > currentOpponentFieldLength) {
          newCard = afterAIMove.opponentField[afterAIMove.opponentField.length - 1]
        } else if (afterAIMove.sharedDiscard.length > gameState.sharedDiscard.length) {
          newCard = afterAIMove.sharedDiscard[afterAIMove.sharedDiscard.length - 1]
          isImpactCard = newCard?.type === "impact"
        }

        if (newCard) {
          setAnimationQueue((prev) => [
            ...prev,
            async () => {
              try {
                setAiPlayingCardId(1)

                setAiPlayedCard(newCard)
                setAiCardAnimationPhase("flip")
                setShowAiCardAnimation(true)

                if (afterAIMove.message !== gameState.message) {
                  console.log(afterAIMove.message)
                }

                await new Promise((resolve) => setTimeout(resolve, 1500))

                setAiCardAnimationPhase("toField")

                await new Promise((resolve) => setTimeout(resolve, 1000))

                setShowAiCardAnimation(false)
                setAiPlayingCardId(null)

                if (!isImpactCard && newCard.id) {
                  setNewOpponentFieldCardId(newCard.id)

                  let particleColor = "#ff6666"
                  if (newCard.environment === "aquatic") particleColor = "#6666ff"
                  else if (newCard.environment === "amphibian") particleColor = "#66ff66"

                  setTimeout(() => {
                    if (newCard && newCard.id) {
                      addParticleEffect(newCard.id, particleColor)
                    }
                  }, 100)
                } else if (isImpactCard) {
                  if (discardPileRef.current && newCard) {
                    const tempCard = document.createElement("div")
                    tempCard.className = "fixed pointer-events-none z-50 transition-all duration-1000"
                    tempCard.style.width = "140px"
                    tempCard.style.height = "200px"
                    tempCard.style.left = "50%"
                    tempCard.style.top = "15%"
                    tempCard.style.transform = "translate(-50%, -50%) scale(0.4)"

                    const cardContent = document.createElement("div")
                    cardContent.className =
                      "h-full w-full rounded-md shadow-lg border-2 border-purple-600 bg-purple-900"

                    const nameDiv = document.createElement("div")
                    nameDiv.className = "text-center text-white text-xs font-bold mt-2"
                    nameDiv.textContent = newCard.name || "Impact Card"
                    cardContent.appendChild(nameDiv)

                    tempCard.appendChild(cardContent)
                    document.body.appendChild(tempCard)

                    setTimeout(() => {
                      const rect = tempCard.getBoundingClientRect()
                      for (let i = 0; i < 15; i++) {
                        const particle = document.createElement("div")
                        particle.className = "particle"
                        particle.style.backgroundColor = "#aa66ff"
                        particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px`
                        particle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 100}px`
                        document.body.appendChild(particle)

                        setTimeout(() => {
                          if (document.body.contains(particle)) {
                            document.body.removeChild(particle)
                          }
                        }, 1000)
                      }
                    }, 100)

                    await new Promise((resolve) => setTimeout(resolve, 800))

                    const targetRect = discardPileRef.current.getBoundingClientRect()
                    tempCard.style.transform = "translate(0, 0) scale(0.7) rotate(10deg)"
                    tempCard.style.left = `${targetRect.left + targetRect.width / 2 - 35}px`
                    tempCard.style.top = `${targetRect.top + targetRect.height / 2 - 50}px`
                    tempCard.style.opacity = "0.7"

                    discardPileRef.current.classList.add("discard-highlight")

                    setTimeout(() => {
                      if (document.body.contains(tempCard)) {
                        document.body.removeChild(tempCard)
                      }

                      if (discardPileRef.current) {
                        discardPileRef.current.classList.remove("discard-highlight")
                      }
                    }, 1000)

                    await new Promise((resolve) => setTimeout(resolve, 1000))
                  }
                }

                await new Promise((resolve) => setTimeout(resolve, 600))

                setNewOpponentFieldCardId(null)
                setGameState(endAITurn(afterAIMove))
              } catch (error) {
                console.error("AI card play animation error:", error)
                setShowAiCardAnimation(false)
                setAiPlayingCardId(null)
                setNewOpponentFieldCardId(null)
                setGameState(endAITurn(afterAIMove))
              }
            },
          ])

          return
        }
      }

      if (afterAIMove.message.includes("AI played Trap")) {
        console.log("AI played Trap and selects one of your animals.")

        const highestValueIndex = afterAIMove.playerField
          .map((card, index) => ({ card, index }))
          .sort((a, b) => (b.card.points || 0) - (a.card.points || 0))[0].index

        setIsAIThinking(false)

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

  useEffect(() => {
    if (!gameState || gameState.currentTurn !== "opponent" || gameState.gameStatus !== "playing") {
      return
    }

    const safetyTimer = setTimeout(() => {
      if (gameState.currentTurn === "opponent") {
        console.error("AI turn safety timeout triggered - AI turn was taking too long")

        setIsAIThinking(false)
        setAnimationQueue([])
        setIsAnimating(false)

        setAiPlayingCardId(null)
        setShowAiCardAnimation(false)
        setNewOpponentFieldCardId(null)
        setAiDrawingCards(false)
        setAiDiscardingCards(false)

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

  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    if (gameState.pendingEffect.type === "squirrel" && gameState.pendingEffect.forPlayer) {
      console.log("Squirrel effect triggered - showing opponent hand for selection")
      setShowSquirrelModal(true)
    } else if (gameState.pendingEffect.type === "tuna" && gameState.pendingEffect.forPlayer) {
      // Add logging to help debug
      console.log("Tuna effect triggered - checking for eligible aquatic animals")
      const eligibleCards = gameState.playerHand.filter(
        (card) =>
          card.type === "animal" &&
          (card.environment === "aquatic" || card.environment === "amphibian") &&
          (card.points || 0) <= 3,
      )
      console.log(`Found ${eligibleCards.length} eligible aquatic animals for Tuna effect`)

      if (eligibleCards.length > 0) {
        setShowTunaModal(true)
      } else {
        // Handle the case where there are no eligible cards
        console.log("No eligible aquatic animals found for Tuna effect")
        setGameState({
          ...gameState,
          pendingEffect: null,
          message: "You have no eligible aquatic animals with 3 or fewer points to play.",
        })
      }
    } else if (gameState.pendingEffect.type === "turtle" && gameState.pendingEffect.forPlayer) {
      setShowTurtleModal(true)
    } else if (gameState.pendingEffect.type === "zebra" && gameState.pendingEffect.forPlayer) {
      setShowZebraModal(true)
    }
  }, [gameState])

  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    if (gameState.pendingEffect.type === "crab" && gameState.pendingEffect.forPlayer === true) {
      setShowCrabModal(true)
    }
  }, [gameState])

  useEffect(() => {
    const processQueue = async () => {
      if (animationQueue.length > 0 && !isAnimating) {
        setIsAnimating(true)
        const nextAnimation = animationQueue[0]

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Animation timeout")), 5000),
        )

        try {
          await Promise.race([nextAnimation(), timeoutPromise])
        } catch (error) {
          console.error("Animation error:", error)
          setAnimationError(`Animation error: ${error instanceof Error ? error.message : "Unknown error"}`)

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

          setShowTargetModal(false)
          setShowDiscardModal(false)
          setShowSquirrelModal(false)
          setShowTunaModal(false)
          setShowTurtleModal(false)
          setShowCrabModal(false)
          setShowZebraModal(false)
          setShowAITrapModal(false)
        } finally {
          setAnimationQueue((prev) => prev.slice(1))
          setIsAnimating(false)
        }
      }
    }

    processQueue()
  }, [animationQueue, isAnimating])

  useEffect(() => {
    if (!gameState) return

    if (gameState.gameStatus !== "playing") {
      setAlertMessage(
        gameState.gameStatus === "playerWin" ? "Congratulations! You won the game!" : "The AI has won the game.",
      )
      setShowAlert(true)

      console.log(gameState.gameStatus === "playerWin" ? "🏆 You won the game!" : "AI won the game.")

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

  const handleCancelEffect = () => {
    if (!gameState || !gameState.pendingEffect) return

    const lastPlayedCard = lastPlayedCardRef.current

    if (lastPlayedCard) {
      const newDiscard = [...gameState.sharedDiscard].filter((card) => card.id !== lastPlayedCard.id)

      const newHand = [...gameState.playerHand, lastPlayedCard]

      setGameState({
        ...gameState,
        playerHand: newHand,
        sharedDiscard: newDiscard,
        pendingEffect: null,
        message: "Effect canceled. Card returned to your hand.",
      })

      lastPlayedCardRef.current = null
    } else {
      setGameState({
        ...gameState,
        pendingEffect: null,
        message: "Effect canceled. Your turn continues.",
      })
    }

    console.log("You canceled the effect.")
    setShowTargetModal(false)
  }

  const handleAITrapSelection = (targetIndex: number | number[]) => {
    if (!gameState || !gameState.pendingEffect) return

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          const idx = targetIndex as number
          if (idx >= 0 && idx < gameState.playerField.length) {
            const card = gameState.playerField[idx]
            if (card && card.id) {
              setDiscardingCardId(card.id)

              const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
              if (cardElement instanceof HTMLElement && discardPileRef.current) {
                createCardToDiscardAnimation(card, cardElement, discardPileRef.current)
              }
            }
          }

          await new Promise((resolve) => setTimeout(resolve, 800))

          const newState = resolveEffect(gameState, targetIndex as number)

          if (newState.message !== gameState.message) {
            console.log(newState.message)
          }

          setDiscardingCardId(null)

          setGameState(endAITurn(newState))
          setShowAITrapModal(false)
        } catch (error) {
          console.error("AI trap selection error:", error)
          setDiscardingCardId(null)
          const newState = resolveEffect(gameState, targetIndex as number)
          setGameState(endAITurn(newState))
          setShowAITrapModal(false)
        }
      },
    ])
  }

  const handleSquirrelSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          console.log(`Squirrel effect - processing selection: index ${targetIndex}`)
          if (targetIndex < 0 || targetIndex >= gameState.opponentHand.length) {
            throw new Error("Invalid card index for Squirrel effect")
          }

          const targetCard = gameState.opponentHand[targetIndex]
          if (!targetCard) {
            throw new Error("Card not found for Squirrel effect")
          }

          console.log(`Squirrel effect - selected card: ${targetCard.name}`)

          const newOpponentHand = [...gameState.opponentHand]
          newOpponentHand.splice(targetIndex, 1)

          // Add visual effect for the discarded card
          if (targetCard.id && discardPileRef.current) {
            setDiscardingCardId(targetCard.id)

            // Wait for animation
            await new Promise((resolve) => setTimeout(resolve, 800))

            setDiscardingCardId(null)
          }

          const newState = {
            ...gameState,
            opponentHand: newOpponentHand,
            sharedDiscard: [...gameState.sharedDiscard, targetCard],
            pendingEffect: null,
            message: `You made the opponent discard ${targetCard.name}.`,
          }

          console.log(newState.message)

          setGameState(endPlayerTurn(newState))
          setShowSquirrelModal(false)
        } catch (error) {
          console.error("Squirrel effect error:", error)
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

  const handleZebraEffectClose = () => {
    if (!gameState || !gameState.pendingEffect) return

    setShowZebraModal(false)

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          const newState = {
            ...gameState,
            pendingEffect: null,
            message: "You've seen your opponent's hand.",
          }

          console.log(newState.message)

          setGameState(endPlayerTurn(newState))
        } catch (error) {
          console.error("Zebra effect error:", error)
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Zebra effect completed. Your turn ends.",
          })
        }
      },
    ])
  }

  const handleTunaSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          console.log(`Tuna effect - processing selection: index ${targetIndex}`)
          const filteredCards = gameState.playerHand.filter(
            (card) =>
              card.type === "animal" &&
              (card.environment === "aquatic" || card.environment === "amphibian") &&
              (card.points || 0) <= 3,
          )

          console.log(`Tuna effect - filtered cards: ${filteredCards.length}, selected index: ${targetIndex}`)

          if (targetIndex < 0 || targetIndex >= filteredCards.length) {
            throw new Error(
              `Invalid card index for Tuna effect: ${targetIndex} (filtered cards: ${filteredCards.length})`,
            )
          }

          const targetCard = filteredCards[targetIndex]
          if (!targetCard || !targetCard.id) {
            throw new Error("Card not found for Tuna effect")
          }

          console.log(
            `Tuna effect - selected card: ${targetCard.name} (${targetCard.environment}, ${targetCard.points} points)`,
          )

          const originalHandIndex = gameState.playerHand.findIndex((card) => card.id === targetCard.id)
          if (originalHandIndex === -1) {
            throw new Error("Card not found in player's hand")
          }

          const newPlayerHand = [...gameState.playerHand]
          newPlayerHand.splice(originalHandIndex, 1)

          let tempState = {
            ...gameState,
            playerHand: newPlayerHand,
            playerField: [...gameState.playerField, targetCard],
            playerPoints: gameState.playerPoints + (targetCard.points || 0),
            pendingEffect: null,
            message: `You played ${targetCard.name} from your hand using Tuna's effect.`,
          }

          if (targetCard.type === "animal" && targetCard.effect) {
            console.log(`Tuna effect - played card has effect: ${JSON.stringify(targetCard.effect)}`)
            tempState = applyAnimalEffect(tempState, targetCard, true)
            console.log(`Tuna effect - after applying effect, pendingEffect:`, tempState.pendingEffect)
          }

          console.log(tempState.message)

          setNewPlayerFieldCardId(targetCard.id)

          setTimeout(() => {
            let particleColor = "#ff6666"
            if (targetCard.environment === "aquatic") particleColor = "#6666ff"
            else if (targetCard.environment === "amphibian") particleColor = "#66ff66"

            addParticleEffect(targetCard.id, particleColor)
          }, 400)

          if (tempState.pendingEffect) {
            console.log("Tuna effect - new pending effect detected, not ending turn yet")
            setGameState(tempState)
            setShowTunaModal(false)

            await new Promise((resolve) => setTimeout(resolve, 800))

            setNewPlayerFieldCardId(null)
            return
          }

          console.log("Tuna effect - no pending effect, ending player's turn")
          setGameState(endPlayerTurn(tempState))
          setShowTunaModal(false)

          await new Promise((resolve) => setTimeout(resolve, 800))

          setNewPlayerFieldCardId(null)
        } catch (error) {
          console.error("Tuna effect error:", error)
          setNewPlayerFieldCardId(null)
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

  const handleTurtleSelection = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          const filteredCards = gameState.playerHand.filter(
            (card) =>
              card.type === "animal" &&
              (card.environment === "aquatic" || card.environment === "amphibian") &&
              (card.points || 0) <= 2,
          )

          console.log("Turtle effect - filtered cards:", filteredCards.length, "selected index:", targetIndex)

          if (targetIndex < 0 || targetIndex >= filteredCards.length) {
            throw new Error(
              `Invalid card index for Turtle effect: ${targetIndex} (filtered cards: ${filteredCards.length})`,
            )
          }

          const targetCard = filteredCards[targetIndex]
          if (!targetCard || !targetCard.id) {
            throw new Error("Card not found for Turtle effect")
          }

          const originalHandIndex = gameState.playerHand.findIndex((card) => card.id === targetCard.id)
          if (originalHandIndex === -1) {
            throw new Error("Card not found in player's hand")
          }

          const newPlayerHand = [...gameState.playerHand]
          newPlayerHand.splice(originalHandIndex, 1)

          let tempState = {
            ...gameState,
            playerHand: newPlayerHand,
            playerField: [...gameState.playerField, targetCard],
            playerPoints: gameState.playerPoints + (targetCard.points || 0),
            pendingEffect: null,
            message: `You played ${targetCard.name} from your hand.`,
          }

          if (targetCard.type === "animal" && targetCard.effect) {
            tempState = applyAnimalEffect(tempState, targetCard, true)
          }

          console.log(tempState.message)

          setNewPlayerFieldCardId(targetCard.id)

          setTimeout(() => {
            let particleColor = "#ff6666"
            if (targetCard.environment === "aquatic") particleColor = "#6666ff"
            else if (targetCard.environment === "amphibian") particleColor = "#66ff66"

            addParticleEffect(targetCard.id, particleColor)
          }, 400)

          if (tempState.pendingEffect) {
            setGameState(tempState)
            setShowTurtleModal(false)

            await new Promise((resolve) => setTimeout(resolve, 800))

            setNewPlayerFieldCardId(null)
            return
          }

          setGameState(endPlayerTurn(tempState))
          setShowTurtleModal(false)

          await new Promise((resolve) => setTimeout(resolve, 800))

          setNewPlayerFieldCardId(null)
        } catch (error) {
          console.error("Turtle effect error:", error)
          setNewPlayerFieldCardId(null)
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

  const handleCrabSelection = (selectedIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          const topCards = gameState.sharedDeck.slice(0, 2)

          if (selectedIndex < 0 || selectedIndex >= topCards.length) {
            throw new Error("Invalid card index for Crab effect")
          }

          const selectedCard = topCards[selectedIndex]
          const otherCard = topCards[1 - selectedIndex]

          if (!selectedCard || !otherCard) {
            throw new Error("Cards not found for Crab effect")
          }

          const newState = {
            ...gameState,
            playerHand: [...gameState.playerHand, selectedCard],
            sharedDeck: [...gameState.sharedDeck.slice(2), otherCard],
            pendingEffect: null,
            message: `You added ${selectedCard.name} to your hand and sent ${otherCard.name} to the bottom of the deck.`,
          }

          console.log(newState.message)

          setGameState(endPlayerTurn(newState))
          setShowCrabModal(false)
        } catch (error) {
          console.error("Crab effect error:", error)
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

  const handleConfuseSelection = (playerIdx: number, opponentIdx: number) => {
    if (!gameState || !gameState.pendingEffect) return

    setIsHandlingConfuse(true)

    skipConfuseModalRef.current = true

    setShowTargetModal(false)

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          if (
            playerIdx < 0 ||
            playerIdx >= gameState.playerField.length ||
            opponentIdx < 0 ||
            opponentIdx >= gameState.opponentField.length
          ) {
            throw new Error("Invalid card indices for Confuse effect")
          }

          const playerCard = gameState.playerField[playerIdx]
          const opponentCard = gameState.opponentField[opponentIdx]

          if (!playerCard || !opponentCard || !playerCard.id || !opponentCard.id) {
            throw new Error("Invalid cards for Confuse effect")
          }

          const playerCardId = playerCard.id
          const opponentCardId = opponentCard.id

          const playerCardElement = document.querySelector(`[data-card-id="${playerCardId}"]`)
          const opponentCardElement = document.querySelector(`[data-card-id="${opponentCardId}"]`)

          if (playerCardElement) {
            playerCardElement.classList.add(getExchangeAnimation(true))

            setTimeout(() => {
              addParticleEffect(playerCardId, "#ffff00")
            }, 100)
          }

          if (opponentCardElement) {
            opponentCardElement.classList.add(getExchangeAnimation(false))

            setTimeout(() => {
              addParticleEffect(opponentCardId, "#ffff00")
            }, 100)
          }

          await new Promise((resolve) => setTimeout(resolve, 800))

          const newPlayerField = [...gameState.playerField]
          const newOpponentField = [...gameState.opponentField]

          newPlayerField.splice(playerIdx, 1)
          newOpponentField.splice(opponentIdx, 1)

          newPlayerField.push(opponentCard)
          newOpponentField.push(playerCard)

          const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)
          const newOpponentPoints = newOpponentField.reduce((sum, card) => sum + (card.points || 0), 0)

          const newState = {
            ...gameState,
            playerField: newPlayerField,
            opponentField: newOpponentField,
            playerPoints: newPlayerPoints,
            opponentPoints: newOpponentPoints,
            pendingEffect: null,
            message: `You exchanged ${playerCard.name} with the AI's ${opponentCard.name}.`,
          }

          console.log(newState.message)

          lastPlayedCardRef.current = null

          setGameState(endPlayerTurn(newState))
        } catch (error) {
          console.error("Error in Confuse effect:", error)

          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Confuse effect failed. Your turn continues.",
          })
        } finally {
          setIsHandlingConfuse(false)
          skipConfuseModalRef.current = false
        }
      },
    ])
  }

  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

    if (showTargetModal || isHandlingConfuse || skipConfuseModalRef.current) return

    const type = gameState.pendingEffect?.type
    const forPlayer = gameState.pendingEffect?.forPlayer

    if (!type || forPlayer === undefined) return

    let playerCardIndices: number[] = []

    switch (type) {
      case "hunter":
        setTargetTitle("Select Target")
        setTargetDescription("Select a terrestrial animal to destroy.")
        setTargetFilter((card) => card?.environment === "terrestrial" || card?.environment === "amphibian")
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
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
        setTargetFilter((card) => card?.environment === "aquatic" || card?.environment === "amphibian")
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        playerCardIndices = []
        break

      case "scare":
        setTargetTitle("Select Target")
        setTargetDescription("Select an animal to send to the top of the deck.")
        setTargetFilter(undefined)
        setTargetCards([...gameState.playerField, ...gameState.opponentField])
        setShowTargetModal(true)
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

      case "veterinarian":
        setTargetTitle("Select Animal")
        setTargetDescription("Select an animal from the discard pile to play.")
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards(gameState.sharedDiscard.filter((card) => card.type === "animal"))
        setShowTargetModal(true)
        playerCardIndices = []
        break

      case "confuse":
        setTargetTitle("Exchange Animals")
        setTargetDescription("Select one of your animals and one of the opponent's animals to exchange control.")
        setShowTargetModal(true)
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
        playerCardIndices = []
        break

      case "cage":
        if (!gameState.pendingEffect.firstSelection) {
          setTargetTitle("Select Animal from Field")
          setTargetDescription("Select one of your animals to send to the discard pile.")
          setTargetFilter((card) => card?.type === "animal")
          setTargetCards(gameState.playerField)
          setShowTargetModal(true)
          playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        } else {
          setTargetTitle("Select Animal to Cage")
          setTargetDescription("Select an opponent's animal to gain control of.")
          setTargetFilter((card) => card?.type === "animal")
          setTargetCards(gameState.opponentField)
          setShowTargetModal(true)
          playerCardIndices = []
        }
        break

      case "limit":
        setTargetTitle("Select Target")
        setTargetDescription("Select an animal to destroy.")
        setTargetFilter(undefined)
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        playerCardIndices = []
        break

      case "epidemic":
        setTargetTitle("Select Animal")
        setTargetDescription(
          "Select one of your animals. All animals of the same environment will be sent to the bottom of the deck.",
        )
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards(gameState.playerField)
        setShowTargetModal(true)
        playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        break

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
        playerCardIndices = []
        break

      case "crocodile":
        setTargetTitle("Select Animal")
        setTargetDescription("Select an opponent's animal with 3 or fewer points to send to the bottom of the deck.")
        setTargetFilter((card) => (card?.points || 0) <= 3)
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
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
        playerCardIndices = []
        break

      case "turtle":
        playerCardIndices = []
        break

      case "crab":
        setTargetTitle("Choose a Card")
        setTargetDescription("Select one card to add to your hand. The other will be sent to the bottom of the deck.")
        setShowCrabModal(true)
        playerCardIndices = []
        break

      case "zebra":
        playerCardIndices = []
        break
      case "payCost":
        if (gameState.pendingEffect.selectedCard === undefined) return

        const selectedCardIndex = gameState.pendingEffect.selectedCard
        const costType = gameState.pendingEffect.costType
        const targetCardId = gameState.pendingEffect.targetCardId

        const cardToPlay = gameState.playerHand.find((c) => c.id === targetCardId)
        if (!cardToPlay) return

        const cardToPlayIndex = gameState.playerHand.findIndex((c) => c.id === targetCardId)

        const targetIndex = gameState.pendingEffect.targetIndex
        const sacrificedAnimal = gameState.playerField[targetIndex as number]

        const newPlayerField = [...gameState.playerField]
        newPlayerField.splice(targetIndex as number, 1)

        const newPlayerHand = [...gameState.playerHand]
        newPlayerHand.splice(cardToPlayIndex, 1)

        const newPlayerPoints = newPlayerField.reduce((sum, card) => sum + (card.points || 0), 0)

        let tempState = {
          ...gameState,
          playerField: newPlayerField,
          playerHand: newPlayerHand,
          playerPoints: newPlayerPoints,
          pendingEffect: null,
        }

        if (costType === "return") {
          tempState.playerHand.push(sacrificedAnimal)
          tempState.message = `You returned ${sacrificedAnimal.name} to your hand and played ${cardToPlay.name}.`
        } else {
          tempState.sharedDiscard = [...gameState.sharedDiscard, sacrificedAnimal]
          const send = null
          const to = null
          const discard = null
          tempState.sharedDiscard = [...gameState.sharedDiscard, sacrificedAnimal]
          tempState.message = `You sacrificed ${sacrificedAnimal.name} to play ${cardToPlay.name}.`
        }

        tempState.playerField = [...tempState.playerField, cardToPlay]
        tempState.playerPoints = tempState.playerField.reduce((sum, card) => sum + (card.points || 0), 0)

        if (cardToPlay.type === "animal" && cardToPlay.effect) {
          tempState = applyAnimalEffect(tempState, cardToPlay, true)
        }

        setNewPlayerFieldCardId(cardToPlay.id)

        if (costType !== "return") {
          setDiscardingCardId(sacrificedAnimal.id)
        }

        console.log(tempState.message)

        setShowTargetModal(false)

        if (tempState.pendingEffect) {
          setGameState(tempState)
        } else {
          setGameState(endPlayerTurn(tempState))
        }
        break
    }

    setPlayerCardIndices(playerCardIndices)
  }, [gameState, showTargetModal, isHandlingConfuse])

  // Fix the handleDrawCards function to ensure it works correctly
  const handleDrawCards = () => {
    if (
      !gameState ||
      gameState.currentTurn !== "player" ||
      gameState.gameStatus !== "playing" ||
      gameState.pendingEffect
    ) {
      console.log("Cannot draw cards: not player's turn, game not playing, or pending effect exists")
      return
    }

    // If player hand has 5 or more cards, they must discard first
    if (gameState.playerHand.length >= 5) {
      setDiscardCount(gameState.playerHand.length === 6 ? 2 : 1)
      setShowDiscardModal(true)
      return
    }

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          // Always draw exactly 2 cards if possible
          const drawCount = 2
          const currentHandLength = gameState.playerHand.length
          const maxDraw = Math.min(drawCount, 6 - currentHandLength, gameState.sharedDeck.length)

          if (maxDraw > 0 && deckPileRef.current) {
            const handContainer = document.querySelector(".player-hand-container")
            if (handContainer instanceof HTMLElement) {
              createDrawCardAnimation(deckPileRef.current, handContainer, maxDraw, true)
            }
          }

          console.log(`Drawing ${maxDraw} cards...`)
          const newState = drawCards(gameState, maxDraw, true)
          console.log(`You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`)

          const drawnCardIds = newState.playerHand
            .slice(currentHandLength)
            .map((card) => card?.id || 0)
            .filter((id) => id > 0)

          setNewCardIds(drawnCardIds)

          setGameState(endPlayerTurn(newState))

          await new Promise((resolve) => setTimeout(resolve, 1000))

          setNewCardIds([])
        } catch (error) {
          console.error("Draw cards error:", error)
          setNewCardIds([])
          const newState = drawCards(gameState, 2, true) // Ensure we try to draw 2 cards
          setGameState(endPlayerTurn(newState))
        }
      },
    ])
  }

  const handleSelectCard = (cardIndex: number) => {
    setSelectedCardIndex(cardIndex)
    setShowCardDetail(true)
  }

  const handlePlayCard = () => {
    if (!gameState || gameState.currentTurn !== "player" || selectedCardIndex === null) return

    const card = gameState.playerHand[selectedCardIndex]
    if (!card || !card.type) return

    if (card.type === "animal" && ["Lion", "Shark", "Crocodile"].includes(card.name)) {
      if (gameState.playerField.length === 0) {
        const newState = {
          ...gameState,
          message: `You need an animal on your field to play ${card.name}.`,
        }
        setGameState(newState)
        setShowCardDetail(false)
        setSelectedCardIndex(null)
        return
      }

      const costType = "sacrifice"

      setTargetTitle(`Select an Animal to Sacrifice`)
      setTargetDescription(`Select one of your animals to sacrifice in order to play ${card.name}.`)
      setTargetFilter((c) => c?.type === "animal")
      setTargetCards(gameState.playerField)
      setPlayerCardIndices(Array.from({ length: gameState.playerField.length }, (_, i) => i))

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

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          if (card.id) {
            setPlayingCardId(card.id)
          }

          await new Promise((resolve) => setTimeout(resolve, 300))

          let newState

          if (card.type === "animal") {
            newState = playAnimalCard(gameState, selectedCardIndex, true)
            console.log(`You played ${card.name} (${card.points} points).`)

            if (card.effect) {
              console.log(`Card has effect: ${card.effect}`)
              console.log(`Pending effect after play:`, newState.pendingEffect)
            }

            if (card.id) {
              setNewPlayerFieldCardId(card.id)

              setTimeout(() => {
                let particleColor = "#ff6666"
                if (card.environment === "aquatic") particleColor = "#6666ff"
                else if (card.environment === "amphibian") particleColor = "#66ff66"

                addParticleEffect(card.id, particleColor)
              }, 400)
            }
          } else {
            newState = playImpactCard(gameState, selectedCardIndex, true)

            lastPlayedCardRef.current = card

            const cardPlayFailed =
              newState.message.includes("cannot play") || newState.message.includes("no valid targets")

            if (!cardPlayFailed) {
              console.log(`You played ${card.name}: ${card.effect}`)

              if (card.id) {
                setTimeout(() => {
                  addParticleEffect(card.id, "#aa66ff")
                }, 400)
              }
            } else {
              console.log(newState.message)

              setPlayingCardId(null)

              setGameState(newState)
              setShowCardDetail(false)
              setSelectedCardIndex(null)
              return
            }
          }

          setShowCardDetail(false)
          setSelectedCardIndex(null)

          if (newState && newState.pendingEffect) {
            console.log("Pending effect detected, updating game state without ending turn", newState.pendingEffect)
            setGameState(newState)
            setPlayingCardId(null)
            return
          }

          console.log("No pending effect, ending player's turn")
          setGameState(endPlayerTurn(newState))

          await new Promise((resolve) => setTimeout(resolve, 800))

          setNewPlayerFieldCardId(null)
          setPlayingCardId(null)
        } catch (error) {
          console.error("Play card error:", error)
          setPlayingCardId(null)
          setNewPlayerFieldCardId(null)
          setShowCardDetail(false)
          setSelectedCardIndex(null)
        }
      },
    ])
  }

  // Fix the handleCardDrop function to ensure it works correctly
  const handleCardDrop = (cardIndex: number) => {
    if (
      !gameState ||
      gameState.currentTurn !== "player" ||
      gameState.gameStatus !== "playing" ||
      gameState.pendingEffect
    ) {
      console.log("Cannot play card: not player's turn, game not playing, or pending effect exists")
      return
    }

    const card = gameState.playerHand[cardIndex]
    if (!card) {
      console.log("Invalid card index:", cardIndex)
      return
    }

    if (card.type === "animal" && ["Lion", "Shark", "Crocodile"].includes(card.name)) {
      if (gameState.playerField.length === 0) {
        const newState = {
          ...gameState,
          message: `You need an animal on your field to play ${card.name}.`,
        }
        setGameState(newState)
        return
      }

      const costType = "sacrifice"

      setTargetTitle(`Select an Animal to Sacrifice`)
      setTargetDescription(`Select one of your animals to sacrifice in order to play ${card.name}.`)
      setTargetFilter((c) => c?.type === "animal")
      setTargetCards(gameState.playerField)
      setPlayerCardIndices(Array.from({ length: gameState.playerField.length }, (_, i) => i))

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

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          if (card.id) {
            setPlayingCardId(card.id)
          }

          await new Promise((resolve) => setTimeout(resolve, 300))

          let newState

          if (card.type === "animal") {
            console.log(`Playing animal card: ${card.name}`)
            newState = playAnimalCard(gameState, cardIndex, true)
            console.log(`You played ${card.name} (${card.points} points).`)

            if (card.effect) {
              console.log(`Card has effect: ${JSON.stringify(card.effect)}`)
              console.log(`Pending effect after play:`, newState.pendingEffect)
            }

            if (card.id) {
              setNewPlayerFieldCardId(card.id)

              setTimeout(() => {
                let particleColor = "#ff6666"
                if (card.environment === "aquatic") particleColor = "#6666ff"
                else if (card.environment === "amphibian") particleColor = "#66ff66"

                addParticleEffect(card.id, particleColor)
              }, 400)
            }
          } else {
            console.log(`Playing impact card: ${card.name}`)
            newState = playImpactCard(gameState, cardIndex, true)

            lastPlayedCardRef.current = card

            const cardPlayFailed =
              newState.message.includes("cannot play") || newState.message.includes("no valid targets")

            if (!cardPlayFailed) {
              console.log(`You played ${card.name}: ${card.effect}`)

              if (card.id) {
                setTimeout(() => {
                  addParticleEffect(card.id, "#aa66ff")
                }, 400)
              }
            } else {
              console.log(newState.message)

              setPlayingCardId(null)

              setGameState(newState)
              return
            }
          }

          if (newState && newState.pendingEffect) {
            console.log("Pending effect detected, updating game state without ending turn", newState.pendingEffect)
            setGameState(newState)
            setPlayingCardId(null)
            return
          }

          console.log("No pending effect, ending player's turn")
          setGameState(endPlayerTurn(newState))

          await new Promise((resolve) => setTimeout(resolve, 800))

          setNewPlayerFieldCardId(null)
          setPlayingCardId(null)
        } catch (error) {
          console.error("Card drop error:", error)
          setPlayingCardId(null)
          setNewPlayerFieldCardId(null)
        }
      },
    ])
  }

  const handleDiscardConfirm = (selectedIndices: number[]) => {
    if (!gameState) return

    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          const validIndices = selectedIndices.filter((idx) => idx >= 0 && idx < gameState.playerHand.length)
          if (validIndices.length === 0) {
            throw new Error("No valid cards selected for discard")
          }

          const discardedCardIds = validIndices
            .map((index) => gameState.playerHand[index]?.id || 0)
            .filter((id) => id > 0)

          if (discardedCardIds.length > 0) {
            setPlayingCardId(discardedCardIds[0])
          }

          await new Promise((resolve) => setTimeout(resolve, 300))

          const newState = sendCardsToBottom(gameState, validIndices, true)
          console.log(
            `You sent ${validIndices.length} card${validIndices.length > 1 ? "s" : ""} to the bottom of the deck.`,
          )

          // Always draw exactly 2 cards if possible after discarding
          const currentHandLength = newState.playerHand.length
          const drawCount = 2
          const maxDraw = Math.min(drawCount, 6 - currentHandLength, newState.sharedDeck.length)

          const afterDraw = drawCards(newState, maxDraw, true)
          console.log(`You drew ${maxDraw} card${maxDraw !== 1 ? "s" : ""}.`)

          const drawnCardIds = afterDraw.playerHand
            .slice(currentHandLength)
            .map((card) => card?.id || 0)
            .filter((id) => id > 0)

          setNewCardIds(drawnCardIds)

          setGameState(endPlayerTurn(afterDraw))

          await new Promise((resolve) => setTimeout(resolve, 1000))

          setNewCardIds([])
          setPlayingCardId(null)
          setShowDiscardModal(false)
        } catch (error) {
          console.error("Discard confirm error:", error)
          setPlayingCardId(null)
          setNewCardIds([])
          setShowDiscardModal(false)
          // Try to draw 2 cards after error
          const newState = drawCards(gameState, 2, true)
          setGameState(endPlayerTurn(newState))
        }
      },
    ])
  }

  const handleTargetConfirm = (targetId: string) => {
    if (!gameState.pendingEffect) return

    console.log(`Target confirmed: ${targetId} for effect: ${gameState.pendingEffect.type}`)

    const newState = {
      ...gameState,
      pendingEffect: {
        ...gameState.pendingEffect,
        targetId,
      },
    }

    const stateAfterEffect = resolveEffect(newState)
    setGameState(stateAfterEffect)

    setShowTargetModal(false)
  }

  const handleRestartGame = () => {
    const newGame = initializeGame()
    setGameState(newGame)
    setShowAlert(false)
  }

  const handleDismissError = () => {
    setAnimationError(null)
  }

  // Add a new function to handle Octopus effect specifically
  // Add this after the other handler functions
  const handleOctopusSelection = (selectedIndices: number[]) => {
    if (!gameState || !gameState.pendingEffect || gameState.pendingEffect.type !== "octopus") return

    // Close the modal immediately to prevent UI freezing
    setShowTargetModal(false)

    // Add the animation to the queue
    setAnimationQueue((prev) => [
      ...prev,
      async () => {
        try {
          const topCards = gameState.sharedDeck.slice(0, Math.min(3, gameState.sharedDeck.length))
          const restOfDeck = gameState.sharedDeck.slice(topCards.length)

          // Rearrange the top cards based on the selected order
          const rearrangedCards: GameCard[] = []
          for (const idx of selectedIndices) {
            if (idx >= 0 && idx < topCards.length) {
              rearrangedCards.push(topCards[idx])
            }
          }

          // Add any cards that weren't selected
          for (let i = 0; i < topCards.length; i++) {
            if (!selectedIndices.includes(i)) {
              rearrangedCards.push(topCards[i])
            }
          }

          const newState = {
            ...gameState,
            sharedDeck: [...rearrangedCards, ...restOfDeck],
            pendingEffect: null,
            message: `You looked at the top ${topCards.length} cards of the deck and rearranged them.`,
          }

          // Log the effect resolution
          console.log(newState.message)

          // End player's turn
          setGameState(endPlayerTurn(newState))
        } catch (error) {
          console.error("Octopus effect error:", error)
          // Clear the pending effect and continue
          setGameState({
            ...gameState,
            pendingEffect: null,
            message: "Octopus effect completed. Your turn ends.",
          })
        }
      },
    ])
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
            aiDrawingCards={aiDrawingCards}
            aiDiscardingCards={aiDiscardingCards}
            aiDrawnCardCount={aiDrawnCardCount}
            aiDiscardedCardIds={aiDiscardedCardIds}
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
              id="deck-pile"
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
          className="w-full px-2 pb-0.5 bg-gradient-to-r from-green-950/90 via-green-900/90 to-green-950/90 border-t border-green-800/50 shadow-lg z-10 player-hand-container"
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
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMiI+PC9zdmc+')",
        }}
      ></div>

      {/* Modals */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700">
            <p className="text-white text-center mb-4">{alertMessage}</p>
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleRestartGame} className="text-green-300">
                Restart Game
              </Button>
            </div>
          </div>
        </div>
      )}

      {showQuitConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700">
            <p className="text-white text-center mb-4">{alertMessage}</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowQuitConfirmation(false)} className="text-green-300">
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => router.push("/")} className="text-red-300">
                Confirm Quit
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCardDetail && gameState.playerHand[selectedCardIndex] && (
        <CardDetailModal
          card={gameState.playerHand[selectedCardIndex]}
          showCardDetail={showCardDetail}
          setShowCardDetail={setShowCardDetail}
          handlePlayCard={handlePlayCard}
          disabled={gameState.currentTurn !== "player" || gameState.gameStatus !== "playing"}
        />
      )}

      {showDiscardModal && (
        <CardSelectionModal
          cards={gameState.playerHand}
          discardSelectable={true}
          discardCount={discardCount}
          onDiscardConfirm={handleDiscardConfirm}
          setShowDiscardModal={setShowDiscardModal}
        />
      )}

      {showTargetModal && targetCards && (
        <TargetSelectionModal
          targetTitle={targetTitle}
          targetDescription={targetDescription}
          targetCards={targetCards}
          playerCardIndices={playerCardIndices}
          onTargetConfirm={handleTargetConfirm}
          setShowTargetModal={setShowTargetModal}
          isConfuseEffect={gameState.pendingEffect?.type === "confuse"}
          gameState={gameState}
          handleCancelEffect={handleCancelEffect}
          handleConfuseSelection={handleConfuseSelection}
          handleOctopusSelection={handleOctopusSelection}
        />
      )}

      {showAITrapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700">
            <h2 className="text-white text-center mb-4">AI Trap Selection</h2>
            <p className="text-white text-center mb-4">AI is choosing an animal to give you.</p>
            <div className="flex justify-center">
              <GameBoard
                cards={gameState.playerField}
                isOpponent={false}
                points={0}
                newCardId={null}
                discardingCardId={null}
                returningToDeckCardId={null}
                targetSelectable={true}
                playerCardIndices={Array.from({ length: gameState.playerField.length }, (_, i) => i)}
                onTargetConfirm={handleAITrapSelection}
                setShowTargetModal={setShowAITrapModal}
              />
            </div>
          </div>
        </div>
      )}

      {showSquirrelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700 max-w-3xl">
            <h2 className="text-white text-center mb-4 text-lg font-bold">Squirrel Effect</h2>
            <p className="text-white text-center mb-4">Select a card from your opponent's hand to discard.</p>
            <div className="flex justify-center">
              <OpponentHand
                cards={gameState.opponentHand}
                cardCount={gameState.opponentHand.length}
                isThinking={false}
                playingCardId={null}
                aiDrawingCards={false}
                aiDiscardingCards={false}
                aiDrawnCardCount={0}
                aiDiscardedCardIds={[]}
                squirrelSelectable={true}
                onSquirrelSelection={handleSquirrelSelection}
                setShowSquirrelModal={setShowSquirrelModal}
              />
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSquirrelModal(false)
                  setGameState({
                    ...gameState,
                    pendingEffect: null,
                    message: "Squirrel effect canceled. Your turn continues.",
                  })
                }}
                className="text-green-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showZebraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700">
            <h2 className="text-white text-center mb-4">Zebra Effect</h2>
            <p className="text-white text-center mb-4">You are looking at your opponent's hand.</p>
            <div className="flex justify-center">
              <OpponentHand
                cards={gameState.opponentHand}
                cardCount={gameState.opponentHand.length}
                isThinking={false}
                playingCardId={null}
                aiDrawingCards={false}
                aiDiscardingCards={false}
                aiDrawnCardCount={0}
                aiDiscardedCardIds={[]}
                zebraView={true}
              />
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleZebraEffectClose} className="text-green-300">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTunaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700 max-w-3xl">
            <h2 className="text-white text-center mb-4 text-lg font-bold">Tuna Effect</h2>
            <p className="text-white text-center mb-4">
              Select an aquatic animal with 3 or fewer points to play from your hand.
            </p>
            <div className="flex justify-center">
              {gameState.playerHand.filter(
                (card) =>
                  card.type === "animal" &&
                  (card.environment === "aquatic" || card.environment === "amphibian") &&
                  (card.points || 0) <= 3,
              ).length > 0 ? (
                <PlayerHand
                  cards={gameState.playerHand.filter(
                    (card) =>
                      card.type === "animal" &&
                      (card.environment === "aquatic" || card.environment === "amphibian") &&
                      (card.points || 0) <= 3,
                  )}
                  onSelectCard={() => {}}
                  onPlayCard={() => {}}
                  disabled={true}
                  newCardIds={[]}
                  playingCardId={null}
                  size="sm"
                  tunaSelectable={true}
                  onTunaSelection={handleTunaSelection}
                  setShowTunaModal={setShowTunaModal}
                />
              ) : (
                <div className="text-white text-center p-4">No eligible aquatic animals in your hand.</div>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTunaModal(false)
                  setGameState({
                    ...gameState,
                    pendingEffect: null,
                    message: "Tuna effect canceled. Your turn continues.",
                  })
                }}
                className="text-green-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTurtleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700">
            <h2 className="text-white text-center mb-4">Turtle Effect</h2>
            <p className="text-white text-center mb-4">
              Select an aquatic animal with 2 or fewer points to play from your hand.
            </p>
            <div className="flex justify-center">
              <PlayerHand
                cards={gameState.playerHand.filter(
                  (card) =>
                    card.type === "animal" &&
                    (card.environment === "aquatic" || card.environment === "amphibian") &&
                    (card.points || 0) <= 2,
                )}
                onSelectCard={() => {}}
                onPlayCard={() => {}}
                disabled={true}
                newCardIds={[]}
                playingCardId={null}
                size="sm"
                turtleSelectable={true}
                onTurtleSelection={handleTurtleSelection}
                setShowTurtleModal={setShowTurtleModal}
              />
            </div>
          </div>
        </div>
      )}

      {showCrabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-900 p-4 rounded-md shadow-lg border border-green-700">
            <h2 className="text-white text-center mb-4">Crab Effect</h2>
            <p className="text-white text-center mb-4">
              Choose one card to add to your hand. The other will be sent to the bottom of the deck.
            </p>
            <div className="flex justify-center">
              <GameBoard
                cards={gameState.sharedDeck.slice(0, 2)}
                isOpponent={false}
                points={0}
                newCardId={null}
                discardingCardId={null}
                returningToDeckCardId={null}
                targetSelectable={true}
                playerCardIndices={[]}
                onTargetConfirm={handleCrabSelection}
                setShowTargetModal={setShowCrabModal}
                isCrabEffect={true}
              />
            </div>
          </div>
        </div>
      )}

      {showDiscardGallery && (
        <DiscardPileGallery cards={gameState.sharedDiscard} setShowDiscardGallery={setShowDiscardGallery} />
      )}

      {/* AI Card Play Animation */}
      {showAiCardAnimation && aiPlayedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {aiCardAnimationPhase === "flip" && (
              <div className="animate-ai-card-play">
                <Card className="h-[200px] w-[140px] rounded-md shadow-lg border-2 border-purple-600 bg-purple-900">
                  <div className="text-center text-white text-xs font-bold mt-2">{aiPlayedCard.name}</div>
                </Card>
              </div>
            )}
            {aiCardAnimationPhase === "toField" && (
              <div className="ai-card-animation">
                <Card className="h-[200px] w-[140px] rounded-md shadow-lg border-2 border-purple-600 bg-purple-900 fall-to-field">
                  <div className="text-center text-white text-xs font-bold mt-2">{aiPlayedCard.name}</div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {animationError && (
        <AlertDialog open={!!animationError} onOpenChange={() => setAnimationError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Animation Error</AlertDialogTitle>
              <AlertDialogDescription>{animationError}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleDismissError}>Dismiss</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
