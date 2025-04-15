"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RefreshCw, Crown, ScrollText, Brain } from "lucide-react"
import { GameBoard } from "@/components/game-board"
import { PlayerHand } from "@/components/player-hand"
import { OpponentHand } from "@/components/opponent-hand"
import { SharedDeckDisplay } from "@/components/shared-deck-display"
import { CardSelectionModal } from "@/components/card-selection-modal"
import { TargetSelectionModal } from "@/components/target-selection-modal"
import { CardDetailModal } from "@/components/card-detail-modal"
import { GameLog } from "@/components/game-log"
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

// Add confetti animation
const confettiAnimation = `
@keyframes confetti {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
.animate-confetti {
  animation: confetti 3s ease-in-out infinite;
}
`

export default function GameMatch() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [gameLogs, setGameLogs] = useState<string[]>([])
  const [showLog, setShowLog] = useState(false)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [showCardDetail, setShowCardDetail] = useState(false)

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

  // Helper function to add logs
  const addLog = (message: string) => {
    setGameLogs((prev) => [...prev, message])
  }

  // Initialize game
  useEffect(() => {
    const newGame = initializeGame()
    setGameState(newGame)
    setGameLogs([])
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

        // Discard cards and then draw
        setTimeout(() => {
          const afterDiscard = sendCardsToBottom(gameState, discardIndices, false)
          addLog(`AI sent ${discardCount} card(s) to the bottom of the deck.`)

          setAiDiscardingCards(false)
          setAiDrawingCards(true)
          setAiDrawnCardCount(2)

          // Draw cards after a delay
          setTimeout(() => {
            const afterDraw = drawCards(afterDiscard, 2, false)
            addLog(`AI drew 2 cards.`)

            // End AI turn after animation completes
            setTimeout(() => {
              setAiDrawingCards(false)
              setGameState(endAITurn(afterDraw))
            }, 1000)
          }, 800)
        }, 1200)

        return
      }

      // Make AI decision
      const afterAIMove = makeAIDecision(gameState)

      // Check if AI drew cards
      if (afterAIMove.opponentHand.length > currentOpponentHandLength) {
        setAiDrawingCards(true)
        setAiDrawnCardCount(afterAIMove.opponentHand.length - currentOpponentHandLength)
        addLog(`AI drew ${afterAIMove.opponentHand.length - currentOpponentHandLength} cards.`)

        // End AI thinking state
        setIsAIThinking(false)

        // End AI turn after animation completes
        setTimeout(() => {
          setAiDrawingCards(false)
          setGameState(endAITurn(afterAIMove))
        }, 1800) // Increased from 1500 to 1800 for longer animation

        return
      }

      // Check if a new card was played to the field
      if (afterAIMove.opponentField.length > currentOpponentFieldLength) {
        // Get the ID of the newly played card
        const newCardId = afterAIMove.opponentField[afterAIMove.opponentField.length - 1].id

        // Set the playing card ID for hand animation
        setAiPlayingCardId(1) // Just use 1 as a dummy ID since we don't know which card in hand was played

        // After a short delay, show the card appearing on the field
        setTimeout(() => {
          setAiPlayingCardId(null)
          setNewOpponentFieldCardId(newCardId)

          // Log AI's action
          if (afterAIMove.message !== gameState.message) {
            addLog(afterAIMove.message)
          }

          // End AI thinking state
          setIsAIThinking(false)

          // End AI turn after animation completes
          setTimeout(() => {
            setNewOpponentFieldCardId(null)
            setGameState(endAITurn(afterAIMove))
          }, 1800) // Increased from 1500 to 1800 for longer animation
        }, 1000) // Increased from 800 to 1000 to better see the card leaving the hand

        return
      }

      // Log AI's action if no card was played or drawn
      if (afterAIMove.message !== gameState.message) {
        addLog(afterAIMove.message)
      }

      // End AI thinking state
      setIsAIThinking(false)

      // End AI turn
      setGameState(endAITurn(afterAIMove))
    }, 1500)

    return () => clearTimeout(aiTimer)
  }, [gameState])

  // Check for game over
  useEffect(() => {
    if (!gameState) return

    if (gameState.gameStatus !== "playing") {
      setAlertMessage(
        gameState.gameStatus === "playerWin" ? "Congratulations! You won the game!" : "The AI has won the game.",
      )
      setShowAlert(true)

      // Log game result
      addLog(gameState.gameStatus === "playerWin" ? "🏆 You won the game!" : "AI won the game.")
    }
  }, [gameState])

  // Add a new function to handle canceling effects
  const handleCancelEffect = () => {
    if (!gameState || !gameState.pendingEffect) return

    // Create a copy of the current state without the pending effect
    setGameState({
      ...gameState,
      pendingEffect: null,
      message: "Effect canceled. Your turn continues.",
    })

    addLog("You canceled the effect.")
    setShowTargetModal(false)
  }

  // Check for pending effects
  useEffect(() => {
    if (!gameState || !gameState.pendingEffect) return

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
        setTargetFilter((card) => card?.environment === "terrestrial" || card?.environment === "amphibian")
        setTargetCards(gameState.opponentField)
        setShowTargetModal(true)
        // All cards are opponent's cards, so playerCardIndices remains empty
        playerCardIndices = []
        break

      case "fisher":
        setTargetTitle("Select Target")
        setTargetDescription("Select an aquatic animal to destroy.")
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
        if (!gameState.pendingEffect.firstSelection) {
          setTargetTitle("Select First Animal")
          setTargetDescription("Select the first animal to exchange control.")
          setTargetFilter(undefined)
          setTargetCards([...gameState.playerField, ...gameState.opponentField])
          setShowTargetModal(true)
          // Mark player's cards
          playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        } else {
          setTargetTitle("Select Second Animal")
          setTargetDescription("Select the second animal to exchange control.")
          setTargetFilter(undefined)
          setTargetCards([...gameState.playerField, ...gameState.opponentField])
          setShowTargetModal(true)
          // Mark player's cards
          playerCardIndices = Array.from({ length: gameState.playerField.length }, (_, i) => i)
        }
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
          "Select an animal. All animals of the same environment with more points will be sent to the bottom of the deck.",
        )
        setTargetFilter((card) => card?.type === "animal")
        setTargetCards([...gameState.playerField, ...gameState.opponentField])
        setShowTargetModal(true)
        // Mark player's cards
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
          setTargetTitle("Select Animal from Hand")
          setTargetDescription("Select an animal from your hand to send to the bottom of the deck.")
          setTargetFilter((card) => card?.type === "animal")
          setTargetCards(gameState.playerHand)
          setShowTargetModal(true)
          // All cards are player's cards
          playerCardIndices = Array.from({ length: gameState.playerHand.length }, (_, i) => i)
        } else {
          setTargetTitle("Select Animal to Cage")
          setTargetDescription("Select an animal on the field to gain control of.")
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
  }, [gameState, showTargetModal])

  // Handle player drawing cards
  const handleDrawCards = () => {
    if (!gameState) return

    // Check if player needs to discard first
    if (gameState.playerHand.length >= 5) {
      setDiscardCount(gameState.playerHand.length === 5 ? 1 : 2)
      setShowDiscardModal(true)
      return
    }

    // Store current hand length to detect new cards
    const currentHandLength = gameState.playerHand.length

    // Draw 2 cards
    const newState = drawCards(gameState, 2, true)
    addLog("You drew 2 cards.")

    // Get IDs of newly drawn cards for animation
    const drawnCardIds = newState.playerHand.slice(currentHandLength).map((card) => card.id)

    setNewCardIds(drawnCardIds)

    // End player's turn
    setGameState(endPlayerTurn(newState))

    // Clear animation state after a delay
    setTimeout(() => {
      setNewCardIds([])
    }, 1000)
  }

  // Handle player selecting a card to view details
  const handleSelectCard = (cardIndex: number) => {
    setSelectedCardIndex(cardIndex)
    setShowCardDetail(true)
  }

  // Handle player playing a card from the detail view
  const handlePlayCard = () => {
    if (!gameState || gameState.currentTurn !== "player" || selectedCardIndex === null) return

    const card = gameState.playerHand[selectedCardIndex]
    if (!card || !card.type) return

    // Set the playing card ID for animation
    setPlayingCardId(card.id)

    // Delay the actual card play to allow animation to start
    setTimeout(() => {
      let newState

      if (card.type === "animal") {
        newState = playAnimalCard(gameState, selectedCardIndex, true)
        addLog(`You played ${card.name} (${card.points} points).`)

        // Set the new card ID for field animation
        setNewPlayerFieldCardId(card.id)
      } else {
        newState = playImpactCard(gameState, selectedCardIndex, true)
        addLog(`You played ${card.name}: ${card.effect}`)
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

      // Clear animation states after a delay
      setTimeout(() => {
        setNewPlayerFieldCardId(null)
        setPlayingCardId(null)
      }, 800)
    }, 300)
  }

  // Handle discard selection
  const handleDiscardConfirm = (selectedIndices: number[]) => {
    if (!gameState) return

    // Get the cards being discarded for animation
    const discardedCardIds = selectedIndices.map((index) => gameState.playerHand[index].id)

    // Set animation state for discarded cards
    setPlayingCardId(discardedCardIds[0]) // Just animate the first one for simplicity

    // Delay the actual discard to allow animation to start
    setTimeout(() => {
      // Send selected cards to bottom of deck
      const newState = sendCardsToBottom(gameState, selectedIndices, true)
      addLog(`You sent ${selectedIndices.length} card(s) to the bottom of the deck.`)

      // Store current hand length to detect new cards
      const currentHandLength = newState.playerHand.length

      // Draw 2 cards
      const afterDraw = drawCards(newState, 2, true)
      addLog("You drew 2 cards.")

      // Get IDs of newly drawn cards for animation
      const drawnCardIds = afterDraw.playerHand.slice(currentHandLength).map((card) => card.id)

      setNewCardIds(drawnCardIds)

      // End player's turn
      setGameState(endPlayerTurn(afterDraw))
      setShowDiscardModal(false)

      // Clear animation states after a delay
      setTimeout(() => {
        setNewCardIds([])
        setPlayingCardId(null)
      }, 1000)
    }, 300)
  }

  // Handle target selection
  const handleTargetConfirm = (targetIndex: number) => {
    if (!gameState) return

    // Resolve the effect
    const newState = resolveEffect(gameState, targetIndex)

    // Log the effect resolution
    if (newState.message !== gameState.message) {
      addLog(newState.message)
    }

    // If there's still a pending effect, don't end turn yet
    if (newState.pendingEffect) {
      setGameState(newState)
      setShowTargetModal(false)
      return
    }

    // End player's turn
    setGameState(endPlayerTurn(newState))
    setShowTargetModal(false)
  }

  // Handle game restart
  const handleRestartGame = () => {
    const newGame = initializeGame()
    setGameState(newGame)
    setGameLogs([])
    setShowAlert(false)
  }

  if (!gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
        <p>Loading game...</p>
      </div>
    )
  }

  // Update the main layout to be more compact
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-800 to-green-950 p-0.5 text-white max-w-sm mx-auto">
      <AnimationStyles />
      <style jsx global>
        {confettiAnimation}
      </style>
      <div className="mb-0.5 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="flex h-6 items-center gap-1 px-2 py-0 text-[10px] text-green-300"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </Button>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLog(!showLog)}
            className="flex h-6 items-center gap-1 px-2 py-0 text-[10px] text-green-300"
          >
            <ScrollText className="h-3 w-3" /> {showLog ? "Hide Log" : "Show Log"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestartGame}
            className="flex h-6 items-center gap-1 px-2 py-0 text-[10px] text-green-300"
          >
            <RefreshCw className="h-3 w-3" /> Restart
          </Button>
        </div>
      </div>

      {/* Game log (conditionally shown) */}
      {showLog && (
        <div className="mb-0.5">
          <GameLog logs={gameLogs} />
        </div>
      )}

      {/* Game board */}
      <div className="flex flex-1 flex-col">
        {/* Opponent area */}
        <div className="mb-0.5">
          <div className="mb-0.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className={`h-3 w-3 rounded-full bg-red-700 ${isAIThinking ? "animate-ai-thinking" : ""}`}></div>
              <span className="text-[8px] flex items-center gap-1">
                AI {isAIThinking && <Brain className="h-2 w-2 animate-pulse" />}
                {aiDrawingCards && <span className="text-yellow-300">(Drawing {aiDrawnCardCount} cards...)</span>}
                {aiDiscardingCards && <span className="text-yellow-300">(Discarding cards...)</span>}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <span
                  className={`rounded-md ${
                    gameState.opponentPoints >= 7 ? "animate-pulse bg-yellow-600" : "bg-green-700"
                  } px-1 py-0 text-[8px]`}
                >
                  Points: {gameState.opponentPoints}
                </span>
                {gameState.opponentPoints >= 7 && (
                  <span className="flex items-center text-yellow-400">
                    <Crown className="h-2 w-2" />
                  </span>
                )}
              </div>
              <span className="rounded-md bg-red-700/80 px-1 py-0 text-[8px]">
                Cards: {gameState.opponentHand.length}
              </span>
            </div>
          </div>

          {/* AI Hand (face down) */}
          <div className="mb-0.5">
            <OpponentHand
              cardCount={gameState.opponentHand.length}
              isThinking={isAIThinking}
              playingCardId={aiPlayingCardId}
            />
          </div>

          <GameBoard
            cards={gameState.opponentField}
            isOpponent={true}
            points={gameState.opponentPoints}
            newCardId={newOpponentFieldCardId}
          />
        </div>

        {/* Center area */}
        <div className="my-0.5 flex justify-center">
          <Card className="border border-green-700 bg-green-900/60 px-1 py-0">
            <span className="text-[8px]">{gameState.message}</span>
          </Card>
        </div>

        {/* Shared deck display */}
        <div className="my-0.5 flex justify-center">
          <SharedDeckDisplay deckCount={gameState.sharedDeck.length} discardPile={gameState.sharedDiscard} />
        </div>

        {/* Player area */}
        <div className="mt-auto">
          <GameBoard
            cards={gameState.playerField}
            isOpponent={false}
            points={gameState.playerPoints}
            newCardId={newPlayerFieldCardId}
          />
          <div className="mt-0.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-blue-700"></div>
              <span className="text-[8px]">You</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`rounded-md ${
                  gameState.playerPoints >= 7 ? "animate-pulse bg-yellow-600" : "bg-green-700"
                } px-1 py-0 text-[8px]`}
              >
                Points: {gameState.playerPoints}
              </span>
              {gameState.playerPoints >= 7 && (
                <span className="flex items-center text-yellow-400">
                  <Crown className="h-2 w-2" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Player hand */}
      <div className="mt-0.5">
        <div className="mb-0.5 flex items-center justify-between">
          <span className="text-[8px]">Your Hand ({gameState.playerHand.length})</span>
          <div className="flex gap-1">
            {gameState.pendingEffect && (
              <Button
                size="sm"
                onClick={() => setShowTargetModal(true)}
                className="h-4 bg-yellow-600 px-1 py-0 text-[8px] hover:bg-yellow-500"
              >
                Select Target
              </Button>
            )}
            <Button
              size="sm"
              disabled={
                gameState.currentTurn !== "player" || gameState.gameStatus !== "playing" || !!gameState.pendingEffect
              }
              onClick={handleDrawCards}
              className="h-4 bg-green-700 px-1 py-0 text-[8px] hover:bg-green-600"
            >
              Draw Cards
            </Button>
          </div>
        </div>
        <PlayerHand
          cards={gameState.playerHand}
          onSelectCard={handleSelectCard}
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
      />

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
    </div>
  )
}
