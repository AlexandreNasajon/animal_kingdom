export interface GameCard {
  id: number
  type: "animal" | "impact"
  name: string
  points?: number
  environment?: "aquatic" | "terrestrial" | "amphibian"
  effect?: string
  imageUrl?: string
  // Add properties to track card-specific effects
  disabled?: boolean // For cards that are disabled by effects
  boosted?: boolean // For cards with boosted points
  protected?: boolean // For cards that are protected from effects
}

export type CardType = "animal" | "impact"

export type Habitat = "aquatic" | "terrestrial" | "amphibian"

export interface AnimalCard extends GameCard {
  type: "animal"
  points: number
  environment: Habitat
}

export interface ImpactCard extends GameCard {
  type: "impact"
  effect: string
}

export interface PendingEffect {
  type: string
  forPlayer: boolean
  firstSelection?: number
  animalsPlayed?: number
  // Add more properties as needed for different effects
  targetCardId?: number // For effects that target specific cards
  effectDuration?: number // For effects that last multiple turns
  selectedCard?: number // For effects that need to track a selected card
  costType?: string // For effects that require a cost
  targetIndex?: number // For effects that need to track a target index
  sourceEffect?: string // For tracking which effect triggered this one
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
  gameStatus: "playing" | "playerWin" | "opponentWin"
  message: string
  pendingEffect: PendingEffect | null
  // Add properties to track game-wide effects
  effectsThisTurn: {
    playerAnimalsPlayed: number
    opponentAnimalsPlayed: number
    playerCardsDrawn: number
    opponentCardsDrawn: number
    playerExtraDraws: number
    opponentExtraDraws: number
    playerExtraPlays: number
    opponentExtraPlays: number
    limitInEffect: boolean
    droughtInEffect: boolean
  }
  // Add properties to track persistent effects
  persistentEffects: {
    limitUntilTurn?: number // Turn number when Limit effect ends
    cageTargets: number[] // IDs of animals that are caged
    protectedAnimals: number[] // IDs of animals that are protected
    disabledAnimals: number[] // IDs of animals that are disabled
  }
}

// This will be replaced with the selected deck at runtime
export const GAME_DECK: GameCard[] = []
