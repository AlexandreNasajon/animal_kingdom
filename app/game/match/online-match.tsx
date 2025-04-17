"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Crown, Layers, Clock, User } from "lucide-react"
import { GameBoard } from "@/components/game-board"
import { PlayerHand } from "@/components/player-hand"
import { OpponentHand } from "@/components/opponent-hand"
import { CardSelectionModal } from "@/components/card-selection-modal"
import { TargetSelectionModal } from "@/components/target-selection-modal"
import { CardDetailModal } from "@/components/card-detail-modal"
import { drawCards, playAnimalCard, playImpactCard, sendCardsToBottom, resolveEffect } from "@/utils/game-utils"
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
import { useAuth } from "@/contexts/auth-context"
import { GameService } from "@/services/game-service"
import { isPlayerTurn, getOpponentId, isHost, formatElapsedTime } from "@/utils/online-utils"

interface OnlineMatchProps {
  roomCode: string
}

export function OnlineMatch({ roomCode }: OnlineMatchProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [gameSession, setGameSession] = useState<any>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isOpponentThinking, setIsOpponentThinking] = useState(false)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [lastGameMessage, setLastGameMessage] = useState<string>("")
  const [gameSequence, setGameSequence] = useState(1)
  const [gameStartTime, setGameStartTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState("0:00")
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null)

  // Animation states
  const [newCardIds, setNewCardIds] = useState<number[]>([])
  const [newPlayerFieldCardId, setNewPlayerFieldCardId] = useState<number | null>(null)
  const [newOpponentFieldCardId, setNewOpponentFieldCardId] = useState<number | null>(null)
  const [playingCardId, setPlayingCardId] = useState<number | null>(null)
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
  const [playerCardIndices, setPlayerCardIndices] = useState<number[]>([])

  // Add a new state for quit confirmation
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false)

  // Add a new state for managing animation queue
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationQueue, setAnimationQueue] = useState<Array<() => Promise<void>>>([])

  // Add a flag to track when we're handling a Confuse effect
  const [isHandlingConfuse, setIsHandlingConfuse] = useState(false)

  // Add a flag to prevent reopening the modal for Confuse effect
  const skipConfuseModalRef = useRef(false)

  // Add a ref to track the game board element for particle effects
  const gameBoardRef = useRef<HTMLDivElement>(null)

  // Add a ref to store the last played card for cancellation
  const lastPlayedCardRef = useRef<GameCard | null>(null)

  // Add a new state to track when the discard gallery should be shown
  const [showDiscardGallery, setShowDiscardGallery] = useState(false)

  // Add a state to track if we're waiting for the opponent to join
  const [waitingForOpponent, setWaitingForOpponent] = useState(false)

  // First, add this effect to update the message whenever gameState changes
  useEffect(() => {
    if (gameState && gameState.message) {
      setLastGameMessage(gameState.message)
    }
  }, [gameState])

  // Initialize game session
  useEffect(() => {
    if (!user) return

    const initializeGameSession = async () => {
      try {
        const session = await GameService.getGameSession(roomCode)
        setGameSession(session)

        // Check if we're waiting for an opponent
        if (session.status === "waiting" && session.host_id === user.id) {
          setWaitingForOpponent(true)
          return
        }

        // Get the latest game state
        const state = await GameService.getLatestGameState(session.id)
        setGameState(state)

        // Set opponent username
        const opponentId = getOpponentId(session, user.id)
        if (opponentId) {
          const opponent = session.host_id === user.id ? session.guest : session.host
          setOpponentUsername(opponent?.username || "Opponent")
        }

        // Set game start time
        setGameStartTime(new Date(session.created_at).getTime())
      } catch (error) {
        console.error("Error initializing game session:", error)
        setAlertMessage("Failed to load game session. Please try again.")
        setShowAlert(true)
      }
    }

    initializeGameSession()
  }, [user, roomCode])

  // Subscribe to game session and state changes
  useEffect(() => {
    if (!gameSession || !user) return

    // Subscribe to game session changes
    const unsubscribeSession = GameService.subscribeToGameSessionChanges(gameSession.id, (updatedSession) => {
      setGameSession(updatedSession)

      // If we were waiting and now the game is playing, get the initial state
      if (waitingForOpponent && updatedSession.status === "playing") {
        setWaitingForOpponent(false)
        GameService.getLatestGameState(updatedSession.id).then((state) => {
          setGameState(state)
        })

        // Set opponent username
        const opponentId = getOpponentId(updatedSession, user.id)
        if (opponentId) {
          GameService.getGameSession(roomCode).then((fullSession) => {
            const opponent = fullSession.host_id === user.id ? fullSession.guest : fullSession.host
            setOpponentUsername(opponent?.username || "Opponent")
          })
        }
      }

      // Check if it's our turn
      setIsOpponentThinking(!isPlayerTurn(updatedSession, user.id))
    })

    // Subscribe to game state changes
    const unsubscribeState = GameService.subscribeToGameStateChanges(gameSession.id, (newState) => {
      setGameState(newState)
      setGameSequence((prev) => prev + 1)
    })

    return () => {
      unsubscribeSession()
      unsubscribeState()
    }
  }, [gameSession, user, waitingForOpponent, roomCode])

  // Update elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(formatElapsedTime(gameStartTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStartTime])

  // Add this at the top of the component as a useCallback hook
  const handleBackToMenu = useCallback(() => {
    if (gameState?.gameStatus !== "playing") {
      router.push("/game/online")
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
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"
        particle.style.backgroundColor = color
        particle.style.left = `${Math.random() * 100}%`
        particle.style.top = `${Math.random() * 100}%`
        particle.style.setProperty("--x-offset", `${(Math.random() - 0.5) * 20}px`)

        cardElement.appendChild(particle)

        // Remove particle after animation completes
        setTimeout(() => {
          if (cardElement.contains(particle)) {
            cardElement.removeChild(particle)
          }
        }, 1000)
      }
    }
  }

  // Add this useEffect to process the animation queue
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
    if (!gameState || !gameSession || !user) return

    if (gameState.gameStatus !== "playing") {
      const isWinner =
        gameState.gameStatus === "playerWin" &&
        ((isHost(gameSession, user.id) && gameState.currentTurn === "player") ||
          (!isHost(gameSession, user.id) && gameState.currentTurn === "opponent"))

      setAlertMessage(isWinner ? "Congratulations! You won the game!" : "Your opponent has won the game.")
      setShowAlert(true)

      // Update game session with winner
      if (gameState.gameStatus !== "playing") {
        const winnerId = isWinner ? user.id : getOpponentId(gameSession, user.id)
        if (winnerId) {
          GameService.endGameSession(gameSession.id, winnerId)
        }
      }

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
  }, [gameState, gameSession, user])

  // Add a new function to handle canceling effects
  const handleCancelEffect = () => {
    if (!gameState || !gameState.pendingEffect || !gameSession || !user) return

    // Find the last played card in the discard pile
    const lastPlayedCard = lastPlayedCardRef.current

    if (lastPlayedCard) {
      // Remove the card from the discard pile
      const newDiscard = [...gameState.sharedDiscard].filter((card) => card.id !== lastPlayedCard.id)

      // Add the card back to the player's hand
      const newHand = [...gameState.playerHand, lastPlayedCard]

      // Create a copy of the current state without the pending effect
      // and with the card back in the player's hand
      const newState = {
        ...gameState,
        playerHand: newHand,
        sharedDiscard: newDiscard,
        pendingEffect: null,
        message: "Effect canceled. Card returned to your hand.",
      }

      // Save the new state
      GameService.saveGameState(gameSession.id, newState, gameSequence + 1)

      // Clear the last played card reference
      lastPlayedCardRef.current = null
    } else {
      // If we can't find the card (shouldn't happen), just clear the pending effect
      const newState = {
        ...gameState,
        pendingEffect: null,
        message: "Effect canceled. Your turn continues.",
      }

      // Save the new state
      GameService.saveGameState(gameSession.id, newState, gameSequence + 1)
    }

    setShowTargetModal(false)
  }

  // Handle confuse effect selection
  const handleConfuseSelection = (playerIdx: number, opponentIdx: number) => {
    if (!gameState || !gameState.pendingEffect || !gameSession) return

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

          // Add particle effect
          setTimeout(() => {
            addParticleEffect(playerCardId, "#ffff00") // Yellow particles for exchange
            addParticleEffect(opponentCardId, "#ffff00") // Yellow particles for exchange
          }, 100)

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
            message: `You exchanged ${playerCard.name} with your opponent's ${opponentCard.name}.`,
            currentTurn: "opponent", // End player's turn
          }

          // Clear the last played card reference since the effect has been resolved
          lastPlayedCardRef.current = null

          // Save the new state
          await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)

          // Update the current turn in the game session
          if (user) {
            const opponentId = getOpponentId(gameSession, user.id)
            if (opponentId) {
              await GameService.updateCurrentTurn(gameSession.id, opponentId)
            }
          }
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
    if (!gameState || !gameState.pendingEffect || !user || !gameSession) return

    // Skip if we're already showing the target modal or handling a Confuse effect
    // or if we've set the flag to skip the Confuse modal
    if (showTargetModal || isHandlingConfuse || skipConfuseModalRef.current) return

    // Check if it's our turn
    if (!isPlayerTurn(gameSession, user.id)) return

    // Safely access properties with optional chaining
    const type = gameState.pendingEffect?.type
    const forPlayer = gameState.pendingEffect?.forPlayer

    if (!type || forPlayer === undefined) return // Opponent handles their own effects or invalid effect

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
  }, [gameState, showTargetModal, isHandlingConfuse, user, gameSession])

  // Handle player drawing cards
  const handleDrawCards = () => {
    if (!gameState || !gameSession || !user || !isPlayerTurn(gameSession, user.id)) return

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
        newState.currentTurn = "opponent" // End player's turn

        // Get IDs of newly drawn cards for animation
        const drawnCardIds = newState.playerHand.slice(currentHandLength).map((card) => card.id)

        setNewCardIds(drawnCardIds)

        // Save the new state
        await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)

        // Update the current turn in the game session
        const opponentId = getOpponentId(gameSession, user.id)
        if (opponentId) {
          await GameService.updateCurrentTurn(gameSession.id, opponentId)
        }

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

  // Handle player playing a card from the detail view
  const handlePlayCard = () => {
    if (!gameState || !gameSession || !user || !isPlayerTurn(gameSession, user.id) || selectedCardIndex === null) return

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
          newState = playImpactCard(gameState, selectedCardIndex, true)

          // Store the card for potential cancellation
          lastPlayedCardRef.current = card

          // Check if the card was successfully played by looking at the message
          const cardPlayFailed =
            newState.message.includes("cannot play") || newState.message.includes("no valid targets")

          if (!cardPlayFailed) {
            // Add purple particle effect for impact cards
            setTimeout(() => {
              addParticleEffect(card.id, "#aa66ff")
            }, 400)
          } else {
            // If card play failed, update the action message
            // Clear animation states
            setPlayingCardId(null)

            // Update game state but don't end turn
            await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)
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
          await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)
          setPlayingCardId(null)
          return
        }

        // End player's turn
        newState.currentTurn = "opponent"
        await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)

        // Update the current turn in the game session
        const opponentId = getOpponentId(gameSession, user.id)
        if (opponentId) {
          await GameService.updateCurrentTurn(gameSession.id, opponentId)
        }

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
      !gameSession ||
      !user ||
      !isPlayerTurn(gameSession, user.id) ||
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
            // Add purple particle effect for impact cards
            setTimeout(() => {
              addParticleEffect(card.id, "#aa66ff")
            }, 400)
          } else {
            // If card play failed, update the action message
            // Clear animation states
            setPlayingCardId(null)

            // Update game state but don't end turn
            await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)
            return
          }
        }

        // If there's a pending effect, don't end turn yet
        if (newState && newState.pendingEffect) {
          await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)
          setPlayingCardId(null)
          return
        }

        // End player's turn
        newState.currentTurn = "opponent"
        await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)

        // Update the current turn in the game session
        const opponentId = getOpponentId(gameSession, user.id)
        if (opponentId) {
          await GameService.updateCurrentTurn(gameSession.id, opponentId)
        }

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
    if (!gameState || !gameSession || !user) return

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

        // Store current hand length to detect new cards
        const currentHandLength = newState.playerHand.length

        // Draw 2 cards
        const afterDraw = drawCards(newState, 2, true)
        afterDraw.currentTurn = "opponent" // End player's turn

        // Get IDs of newly drawn cards for animation
        const drawnCardIds = afterDraw.playerHand.slice(currentHandLength).map((card) => card.id)

        setNewCardIds(drawnCardIds)

        // Save the new state
        await GameService.saveGameState(gameSession.id, afterDraw, gameSequence + 1)

        // Update the current turn in the game session
        const opponentId = getOpponentId(gameSession, user.id)
        if (opponentId) {
          await GameService.updateCurrentTurn(gameSession.id, opponentId)
        }

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
    if (!gameState || !gameState.pendingEffect || !gameSession || !user) return

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

            // Add particle effect
            setTimeout(() => {
              addParticleEffect(cardId, "#ff0000") // Red particles for destruction
            }, 100)
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

              // Add particle effect
              setTimeout(() => {
                addParticleEffect(cardId, "#00ffff") // Cyan particles for return to deck
              }, 100)
            }
          }
          // Add animation for Cage card's first selection (sending to discard)
          else if (type === "cage" && !gameState.pendingEffect.firstSelection) {
            const cardId = gameState.playerField[targetIndex as number].id
            setDiscardingCardId(cardId)

            // Add particle effect
            setTimeout(() => {
              addParticleEffect(cardId, "#ff0000") // Red particles for discard
            }, 100)
          }
          // Add animation for Cage card's second selection (gaining control)
          else if (type === "cage" && gameState.pendingEffect.firstSelection) {
            const cardId = gameState.opponentField[targetIndex as number].id
            // Use a different animation for gaining control
            setNewPlayerFieldCardId(cardId)

            // Add particle effect
            setTimeout(() => {
              addParticleEffect(cardId, "#ffff00") // Yellow particles for control change
            }, 100)
          }
        }

        // Delay the effect resolution to allow animation to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Resolve the effect
        const newState = resolveEffect(gameState, targetIndex)

        // Clear animation states
        setDiscardingCardId(null)
        setReturningToDeckCardId(null)
        setNewPlayerFieldCardId(null)

        // Clear the last played card reference since the effect has been resolved
        lastPlayedCardRef.current = null

        // If there's still a pending effect, don't end turn yet
        if (newState.pendingEffect) {
          await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)
          setShowTargetModal(false)
          return
        }

        // End player's turn
        newState.currentTurn = "opponent"
        await GameService.saveGameState(gameSession.id, newState, gameSequence + 1)

        // Update the current turn in the game session
        const opponentId = getOpponentId(gameSession, user.id)
        if (opponentId) {
          await GameService.updateCurrentTurn(gameSession.id, opponentId)
        }

        setShowTargetModal(false)
      },
    ])
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <p>Loading user...</p>
      </div>
    )
  }

  if (waitingForOpponent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Waiting for Opponent</h1>
        <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-xl mb-8">
          Room Code: <span className="font-bold">{roomCode}</span>
        </p>
        <p className="text-center max-w-md mb-4">Share this code with a friend to join your game.</p>
        <Button onClick={() => router.push("/game/online")} className="bg-green-700 hover:bg-green-600">
          Cancel
        </Button>
      </div>
    )
  }

  if (!gameState || !gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <p>Loading game...</p>
      </div>
    )
  }

  // Update the main layout to be more compact and remove the game log
  return (
    <div
      className="flex flex-col bg-gradient-to-b from-green-800 to-green-950 p-0 text-white w-full h-screen overflow-hidden"
      ref={gameBoardRef}
    >
      <style jsx global>{`
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out infinite;
        }
      `}</style>

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
        <div className="flex gap-1 items-center">
          <div className="flex items-center text-[9px] text-green-300">
            <Clock className="h-3 w-3 mr-1" />
            {elapsedTime}
          </div>
        </div>
      </div>

      {/* Main game content - use flex-1 to take remaining space */}
      <div className="flex flex-col px-2 flex-1 overflow-hidden">
        {/* Opponent info */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-red-700 flex items-center justify-center">
              <User className="h-2 w-2 text-white" />
            </div>
            <span className="text-[10px] text-white">{opponentUsername || "Opponent"}</span>
          </div>
          {isOpponentThinking && (
            <div className="text-[10px] text-yellow-300 flex items-center">
              <div className="h-2 w-2 animate-pulse bg-yellow-500 rounded-full mr-1"></div>
              Thinking...
            </div>
          )}
        </div>

        {/* AI Hand (face down) */}
        <div className="mb-0">
          <OpponentHand cardCount={gameState.opponentHand.length} isThinking={isOpponentThinking} />
        </div>

        {/* Opponent field */}
        <div className="mb-0">
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
                <span className="text-[9px]">{opponentUsername || "Opponent"}</span>
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
                className={`h-[100px] w-[65px] ${
                  isPlayerTurn(gameSession, user.id) && gameState.gameStatus === "playing" && !gameState.pendingEffect
                    ? "cursor-pointer hover:scale-105 transition-transform"
                    : "cursor-not-allowed opacity-70"
                } border-2 border-green-700 bg-green-900 shadow-md relative overflow-hidden`}
                onClick={
                  isPlayerTurn(gameSession, user.id) && gameState.gameStatus === "playing" && !gameState.pendingEffect
                    ? handleDrawCards
                    : undefined
                }
              >
                {/* Card frame decoration */}
                <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-green-800/20 to-black/30 pointer-events-none"></div>
                <div className="absolute inset-0 border border-green-400/10 rounded-sm pointer-events-none"></div>

                {/* Draw text at the top */}
                {isPlayerTurn(gameSession, user.id) &&
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

      {/* Player hand - fixed at bottom of screen */}
      <div className="w-full px-2 pb-1 pt-0 bg-green-950/80 border-t border-green-800">
        <PlayerHand
          cards={gameState.playerHand}
          onSelectCard={handleSelectCard}
          onPlayCard={handleCardDrop}
          disabled={
            !isPlayerTurn(gameSession, user.id) || gameState.gameStatus !== "playing" || !!gameState.pendingEffect
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
        disabled={
          !isPlayerTurn(gameSession, user.id) || gameState.gameStatus !== "playing" || !!gameState.pendingEffect
        }
      />
      {/* Game over alert */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="border-2 border-green-700 bg-green-900/90 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{gameState.gameStatus !== "playing" ? "Game Over" : "Notice"}</AlertDialogTitle>
            <AlertDialogDescription className="text-green-200">{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/game/online")} className="bg-green-700 hover:bg-green-600">
              Back to Lobby
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
            <Button onClick={() => router.push("/game/online")} className="bg-green-700 hover:bg-green-600">
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
