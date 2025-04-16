export interface GameCard {
  id: number
  type: "animal" | "impact"
  name: string
  points?: number
  environment?: "aquatic" | "terrestrial" | "amphibian"
  effect?: string
  imageUrl?: string
}

// Define the deck structure according to the original requirements
export const GAME_DECK: GameCard[] = [
  // 25 Animal Cards
  // 5 aquatic animals worth 1 point
  {
    id: 1,
    type: "animal",
    name: "Fish",
    points: 1,
    environment: "aquatic",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VK-xc5GAd9OoiiSlfbjVO8oIvXwivXi5KWS8oLq0FIr2i8eDoBNB6hFLsFNKTugK10ECJxbv1bXwCBcMDCCOFYeQqJDKJkIxLTkYNaO_x0_sGa8efnowzPY3O8yW0x1f9sNN2-yf6juLyXndPbJE_NkqIdoWeYRFrFiVQtbzVvU_T6k4g=s1024",
  },
  {
    id: 2,
    type: "animal",
    name: "Fish",
    points: 1,
    environment: "aquatic",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VK-xc5GAd9OoiiSlfbjVO8oIvXwivXi5KWS8oLq0FIr2i8eDoBNB6hFLsFNKTugK10ECJxbv1bXwCBcMDCCOFYeQqJDKJkIxLTkYNaO_x0_sGa8efnowzPY3O8yW0x1f9sNN2-yf6juLyXndPbJE_NkqIdoWeYRFrFiVQtbzVvU_T6k4g=s1024",
  },
  {
    id: 3,
    type: "animal",
    name: "Fish",
    points: 1,
    environment: "aquatic",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VK-xc5GAd9OoiiSlfbjVO8oIvXwivXi5KWS8oLq0FIr2i8eDoBNB6hFLsFNKTugK10ECJxbv1bXwCBcMDCCOFYeQqJDKJkIxLTkYNaO_x0_sGa8efnowzPY3O8yW0x1f9sNN2-yf6juLyXndPbJE_NkqIdoWeYRFrFiVQtbzVvU_T6k4g=s1024",
  },
  {
    id: 4,
    type: "animal",
    name: "Fish",
    points: 1,
    environment: "aquatic",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VK-xc5GAd9OoiiSlfbjVO8oIvXwivXi5KWS8oLq0FIr2i8eDoBNB6hFLsFNKTugK10ECJxbv1bXwCBcMDCCOFYeQqJDKJkIxLTkYNaO_x0_sGa8efnowzPY3O8yW0x1f9sNN2-yf6juLyXndPbJE_NkqIdoWeYRFrFiVQtbzVvU_T6k4g=s1024",
  },
  {
    id: 5,
    type: "animal",
    name: "Fish",
    points: 1,
    environment: "aquatic",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VK-xc5GAd9OoiiSlfbjVO8oIvXwivXi5KWS8oLq0FIr2i8eDoBNB6hFLsFNKTugK10ECJxbv1bXwCBcMDCCOFYeQqJDKJkIxLTkYNaO_x0_sGa8efnowzPY3O8yW0x1f9sNN2-yf6juLyXndPbJE_NkqIdoWeYRFrFiVQtbzVvU_T6k4g=s1024",
  },

  // 4 aquatic animals worth 2 points
  {
    id: 6,
    type: "animal",
    name: "Dolphin",
    points: 2,
    environment: "aquatic",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 7,
    type: "animal",
    name: "Dolphin",
    points: 2,
    environment: "aquatic",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 8,
    type: "animal",
    name: "Dolphin",
    points: 2,
    environment: "aquatic",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 9,
    type: "animal",
    name: "Dolphin",
    points: 2,
    environment: "aquatic",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 3 aquatic animals worth 3 points
  {
    id: 10,
    type: "animal",
    name: "Octopus",
    points: 3,
    environment: "aquatic",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 11,
    type: "animal",
    name: "Octopus",
    points: 3,
    environment: "aquatic",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 12,
    type: "animal",
    name: "Octopus",
    points: 3,
    environment: "aquatic",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 5 terrestrial animals worth 1 point
  {
    id: 13,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 14,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 15,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 16,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 17,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 4 terrestrial animals worth 2 points
  {
    id: 18,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 19,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 20,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 21,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 3 terrestrial animals worth 3 points
  {
    id: 22,
    type: "animal",
    name: "Lion",
    points: 3,
    environment: "terrestrial",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VLfVE6FnRRdp5mkHi9n98J8LULbVBEtfcgtyKST3Ez0Jm4JuLFqHAeQn1KsMsHfgFLjtiPprzCEywqQBfqokDxWl_rLMiZYP7p4hNMV-CSrfQZvpHZiWweU3-mNPABoUqmKeCLxQn4fvQTWzFu79HVwnxwIVQaSN5nwBRcsrXNM3S5DqA=s1024",
  },
  {
    id: 23,
    type: "animal",
    name: "Lion",
    points: 3,
    environment: "terrestrial",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VLfVE6FnRRdp5mkHi9n98J8LULbVBEtfcgtyKST3Ez0Jm4JuLFqHAeQn1KsMsHfgFLjtiPprzCEywqQBfqokDxWl_rLMiZYP7p4hNMV-CSrfQZvpHZiWweU3-mNPABoUqmKeCLxQn4fvQTWzFu79HVwnxwIVQaSN5nwBRcsrXNM3S5DqA=s1024",
  },
  {
    id: 24,
    type: "animal",
    name: "Lion",
    points: 3,
    environment: "terrestrial",
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AA8i_VLfVE6FnRRdp5mkHi9n98J8LULbVBEtfcgtyKST3Ez0Jm4JuLFqHAeQn1KsMsHfgFLjtiPprzCEywqQBfqokDxWl_rLMiZYP7p4hNMV-CSrfQZvpHZiWweU3-mNPABoUqmKeCLxQn4fvQTWzFu79HVwnxwIVQaSN5nwBRcsrXNM3S5DqA=s1024",
  },

  // 1 amphibian animal worth 4 points
  {
    id: 25,
    type: "animal",
    name: "Crocodile",
    points: 4,
    environment: "amphibian",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 3 amphibian animals worth 1 point (added 2 more Frogs)
  {
    id: 51,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    imageUrl: "/green-leaf-frog.png",
  },
  {
    id: 54,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    imageUrl: "/green-leaf-frog.png",
  },
  {
    id: 55,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    imageUrl: "/green-leaf-frog.png",
  },

  // 2 amphibian animals worth 2 points (added 1 more Crab)
  {
    id: 52,
    type: "animal",
    name: "Crab",
    points: 2,
    environment: "amphibian",
    imageUrl: "/hermit-crab-shell.png",
  },
  {
    id: 56,
    type: "animal",
    name: "Crab",
    points: 2,
    environment: "amphibian",
    imageUrl: "/hermit-crab-shell.png",
  },

  // 1 amphibian animal worth 3 points
  {
    id: 53,
    type: "animal",
    name: "Otter",
    points: 3,
    environment: "amphibian",
    imageUrl: "/playful-otter-river.png",
  },

  // 25 Impact Cards
  // 4x Hunter (added 1 more)
  {
    id: 26,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 27,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 28,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 57,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 4x Fisher (added 1 more)
  {
    id: 29,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 30,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 31,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 58,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal on the field",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 2x Scare
  {
    id: 32,
    type: "impact",
    name: "Scare",
    effect: "Send 1 animal from the field to the top of the deck",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Veterinarian (removed 1)
  {
    id: 34,
    type: "impact",
    name: "Veterinarian",
    effect: "Play an animal card from the discard pile",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 0x Limit (removed 2)

  // 1x Confuse
  {
    id: 38,
    type: "impact",
    name: "Confuse",
    effect: "Exchange control of 2 animals",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Domesticate
  {
    id: 39,
    type: "impact",
    name: "Domesticate",
    effect: "Gain control of an animal worth 2 points",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 0x Drought (removed 1)

  // 0x Flood (removed 1)

  // 1x Release
  {
    id: 43,
    type: "impact",
    name: "Release",
    effect: "Play up to 2 animals from your hand",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Epidemic
  {
    id: 44,
    type: "impact",
    name: "Epidemic",
    effect: "Send 1 animal to the bottom along with all animals of same environment",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Compete
  {
    id: 45,
    type: "impact",
    name: "Compete",
    effect: "Send 1 animal from your hand to the bottom along with all animals of same points",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Prey - SHORTENED TEXT
  {
    id: 46,
    type: "impact",
    name: "Prey",
    effect: "Choose 1 animal. Send all same-environment animals with fewer points to bottom",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Flourish
  {
    id: 48,
    type: "impact",
    name: "Flourish",
    effect: "If you have 2 or fewer cards in hand, draw until you have 6",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Earthquake
  {
    id: 49,
    type: "impact",
    name: "Earthquake",
    effect: "Send all animals worth 3 or more points to the bottom",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },

  // 1x Storm
  {
    id: 50,
    type: "impact",
    name: "Storm",
    effect: "Send all animals worth 2 or fewer points to the bottom",
    imageUrl: "/placeholder.svg?height=120&width=80",
  },
]

export interface PendingEffect {
  type: string
  forPlayer: boolean
  firstSelection?: number
  animalsPlayed?: number
  // Add more properties as needed for different effects
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
}
