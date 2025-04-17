"use client"

import { CardContent } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

export default function GameMatch() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [newCardIds, setNewCardIds] = useState<number[]>([])
  const [newPlayerFieldCardId, setNewPlayerFieldCardId] = useState<number | null>(null)
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
  const [newOpponentFieldCardId, setNewOpponentFieldCardId] = useState<number | null>(null)
  const [showDiscardGallery, setShowDiscardGallery] = useState(false)

  useEffect(() => {
    const newGame = initializeGame()
    setGameState(newGame)
  }, [])

  useEffect(() => {
    if (!gameState || gameState.currentTurn !== "opponent" || gameState.gameStatus !== "playing") {
      return
    }

    setIsAIThinking(true)
    setTimeout(() => {
      const afterAIMove = makeAIDecision(gameState)
      setGameState(endAITurn(afterAIMove))
      setIsAIThinking(false)
    }, 1500)
  }, [gameState])

  useEffect(() => {
    if (!gameState) return

    if (gameState.gameStatus !== "playing") {
      setAlertMessage(
        gameState.gameStatus === "playerWin" ? "Congratulations! You won the game!" : "The AI has won the game.",
      )
      setShowAlert(true)
    }
  }, [gameState])

  const handleDrawCards = () => {
    if (!gameState) return

    if (gameState.playerHand.length >= 5) {
      setDiscardCount(gameState.playerHand.length === 5 ? 1 : 2)
      setShowDiscardModal(true)
      return
    }

    const newState = drawCards(gameState, 2, true)
    setGameState(endPlayerTurn(newState))
  }

  const handleSelectCard = (cardIndex: number) => {
    setSelectedCardIndex(cardIndex)
    setShowCardDetail(true)
  }

  const handlePlayCard = () => {
    if (!gameState || gameState.currentTurn !== "player" || selectedCardIndex === null) return

    const card = gameState.playerHand[selectedCardIndex]
    if (!card || !card.type) return

    let newState

    if (card.type === "animal") {
      newState = playAnimalCard(gameState, selectedCardIndex, true)
      setNewPlayerFieldCardId(card.id)
    } else {
      newState = playImpactCard(gameState, selectedCardIndex, true)
    }

    setShowCardDetail(false)
    setSelectedCardIndex(null)

    if (newState && newState.pendingEffect) {
      setGameState(newState)
      return
    }

    setGameState(endPlayerTurn(newState))
  }

  const handleDiscardConfirm = (selectedIndices: number[]) => {
    if (!gameState) return

    const newState = sendCardsToBottom(gameState, selectedIndices, true)
    const afterDraw = drawCards(newState, 2, true)
    setGameState(endPlayerTurn(afterDraw))
    setShowDiscardModal(false)
  }

  const handleTargetConfirm = (targetIndex: number) => {
    if (!gameState || !gameState.pendingEffect) return

    const newState = resolveEffect(gameState, targetIndex)
    setGameState(endPlayerTurn(newState))
    setShowTargetModal(false)
  }

  const handleRestartGame = () => {
    const newGame = initializeGame()
    setGameState(newGame)
    setShowAlert(false)
  }

  return (
    <div className="flex flex-col bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
      <AnimationStyles />
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Bioquest</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestartGame}>
            <RefreshCw className="h-4 w-4" /> New Game
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="w-full md:w-1/4">
          <Card className="border-2 border-green-700 bg-green-900/60 shadow-xl">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">You</div>
                  <div className="text-xs">Points: {gameState.playerPoints}</div>
                </div>
                <div>
                  <div className="text-sm font-bold">AI</div>
                  <div className="text-xs">Points: {gameState.opponentPoints}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-700 bg-green-900/60 shadow-xl mt-4">
            <CardContent>
              <div className="text-sm">
                {gameState.message}
                {isAIThinking && <span className="animate-pulse">Thinking...</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          <div className="flex flex-col gap-4">
            <OpponentHand cardCount={gameState.opponentHand.length} isThinking={isAIThinking} />
            <GameBoard
              cards={gameState.opponentField}
              isOpponent={true}
              points={gameState.opponentPoints}
              newCardId={newOpponentFieldCardId}
            />
            <GameBoard
              cards={gameState.playerField}
              isOpponent={false}
              points={gameState.playerPoints}
              newCardId={newPlayerFieldCardId}
            />
            <PlayerHand
              cards={gameState.playerHand}
              onSelectCard={handleSelectCard}
              onPlayCard={() => {}}
              disabled={gameState.currentTurn !== "player" || gameState.gameStatus !== "playing"}
              newCardIds={newCardIds}
            />
          </div>
        </div>
      </div>

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

      <TargetSelectionModal
        open={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        cards={targetCards}
        onConfirm={handleTargetConfirm}
        title={targetTitle}
        description={targetDescription}
        filter={targetFilter}
        playerCardIndices={playerCardIndices}
      />

      <CardDetailModal
        open={showCardDetail}
        onClose={() => setShowCardDetail(false)}
        card={selectedCardIndex !== null ? gameState.playerHand[selectedCardIndex] : null}
        onPlay={handlePlayCard}
        disabled={gameState.currentTurn !== "player" || gameState.gameStatus !== "playing"}
      />

      <DiscardPileGallery
        open={showDiscardGallery}
        onClose={() => setShowDiscardGallery(false)}
        cards={gameState.sharedDiscard}
      />
    </div>
  )
}
