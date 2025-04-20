export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface GameCard {
  id: number
  type: "animal" | "impact"
  name: string
  points?: number
  environment?: "terrestrial" | "aquatic" | "amphibian"
  effect?: string
  imageUrl: string
}

export interface GameState {
  playerPoints: number
  opponentPoints: number
  playerHand: GameCard[]
  opponentHand: GameCard[]
  playerField: GameCard[]
  opponentField: GameCard[]
  sharedDeck: GameCard[]
  sharedDiscard: GameCard[]
  currentTurn: "player" | "opponent"
  gameStatus: "waiting" | "playing" | "completed" | "playerWin" | "opponentWin"
  message: string
  pendingEffect: {
    type: string
    forPlayer: boolean
    targetCardId?: number
    costType?: string
    selectedCard?: number
  } | null
  effectsThisTurn: {
    playerAnimalsPlayed: number
    opponentAnimalsPlayed: number
    playerCardsDrawn: number
    opponentCardsDrawn: number
    playerExtraDraws: number
    opponentExtraPlays: number
    limitInEffect: boolean
    droughtInEffect: boolean
  }
  persistentEffects: {
    limitUntilTurn: number | undefined
    cageTargets: any[]
    protectedAnimals: any[]
    disabledAnimals: any[]
  }
}

export interface Card {
  id: number
  type: string
  name: string
  points?: number
  environment?: string
  effect?: string
  imageUrl: string
}
