import type { GameCard } from "./game"

// Advanced deck with exactly 50 cards
export const ADVANCED_DECK: GameCard[] = [
  // 14 Terrestrial Animals
  // 3x Mouse - 1 point
  {
    id: 101,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    effect: "On play, send a terrestrial animal your opponent controls to deck top.",
    imageUrl: "/forest-mouse-foraging.png",
  },
  {
    id: 102,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    effect: "On play, send a terrestrial animal your opponent controls to deck top.",
    imageUrl: "/forest-mouse-foraging.png",
  },
  {
    id: 103,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    effect: "On play, send a terrestrial animal your opponent controls to deck top.",
    imageUrl: "/forest-mouse-foraging.png",
  },

  // 3x Squirrel - 1 point
  {
    id: 104,
    type: "animal",
    name: "Squirrel",
    points: 1,
    environment: "terrestrial",
    effect: "On play, look at your opponent's hand and select a card to be discarded.",
    imageUrl: "/bushy-tailed-perch.png",
  },
  {
    id: 105,
    type: "animal",
    name: "Squirrel",
    points: 1,
    environment: "terrestrial",
    effect: "On play, look at your opponent's hand and select a card to be discarded.",
    imageUrl: "/bushy-tailed-perch.png",
  },
  {
    id: 106,
    type: "animal",
    name: "Squirrel",
    points: 1,
    environment: "terrestrial",
    effect: "On play, look at your opponent's hand and select a card to be discarded.",
    imageUrl: "/bushy-tailed-perch.png",
  },

  // 2x Fox - 2 points
  {
    id: 107,
    type: "animal",
    name: "Fox",
    points: 2,
    environment: "terrestrial",
    effect: "On play, your opponent discards a card at random.",
    imageUrl: "/alert-fox.png",
  },
  {
    id: 108,
    type: "animal",
    name: "Fox",
    points: 2,
    environment: "terrestrial",
    effect: "On play, your opponent discards a card at random.",
    imageUrl: "/alert-fox.png",
  },

  // 2x Snake - 2 points
  {
    id: 109,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    effect: "On play, destroy an animal of 1 point your opponent controls.",
    imageUrl: "/coiled-grass-snake.png",
  },
  {
    id: 110,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    effect: "On play, destroy an animal of 1 point your opponent controls.",
    imageUrl: "/coiled-grass-snake.png",
  },

  // 1x Zebra - 3 points
  {
    id: 111,
    type: "animal",
    name: "Zebra",
    points: 3,
    environment: "terrestrial",
    effect: "On play, look at your opponent's hand.",
    imageUrl: "/savanna-zebra.png",
  },

  // 1x Deer - 3 points
  {
    id: 112,
    type: "animal",
    name: "Deer",
    points: 3,
    environment: "terrestrial",
    effect: "On play, if you have 7 or more points, your opponent discards a card at random.",
    imageUrl: "/forest-deer.png",
  },

  // 1x Wolf - 3 points
  {
    id: 113,
    type: "animal",
    name: "Wolf",
    points: 3,
    environment: "terrestrial",
    effect: "On play, each player discards 1 card at random.",
    imageUrl: "/lone-howler.png",
  },

  // 1x Lion - 4 points
  {
    id: 114,
    type: "animal",
    name: "Lion",
    points: 4,
    environment: "terrestrial",
    effect: "Sacrifice 1 animal to play this card. On play, your opponent discards 2 cards at random.",
    imageUrl: "/savanna-king.png",
  },

  // 14 Aquatic Animals
  // 2x Tuna - 1 point
  {
    id: 115,
    type: "animal",
    name: "Tuna",
    points: 1,
    environment: "aquatic",
    effect: "On play, play an aquatic animal from hand.",
    imageUrl: "/canned-tuna-stack.png",
  },
  {
    id: 116,
    type: "animal",
    name: "Tuna",
    points: 1,
    environment: "aquatic",
    effect: "On play, play an aquatic animal from hand.",
    imageUrl: "/canned-tuna-stack.png",
  },

  // 2x Seahorse - 1 point
  {
    id: 117,
    type: "animal",
    name: "Seahorse",
    points: 1,
    environment: "aquatic",
    effect: "On play, draw 1 card for every played animal.",
    imageUrl: "/camouflaged-seahorse.png",
  },
  {
    id: 118,
    type: "animal",
    name: "Seahorse",
    points: 1,
    environment: "aquatic",
    effect: "On play, draw 1 card for every played animal.",
    imageUrl: "/camouflaged-seahorse.png",
  },

  // 2x Jellyfish - 2 points
  {
    id: 119,
    type: "animal",
    name: "Jellyfish",
    points: 2,
    environment: "aquatic",
    effect: "On play, draw 1 card.",
    imageUrl: "/bioluminescent-jelly.png",
  },
  {
    id: 120,
    type: "animal",
    name: "Jellyfish",
    points: 2,
    environment: "aquatic",
    effect: "On play, draw 1 card.",
    imageUrl: "/bioluminescent-jelly.png",
  },

  // 2x Turtle - 2 points
  {
    id: 121,
    type: "animal",
    name: "Turtle",
    points: 2,
    environment: "aquatic",
    effect: "On play, play an aquatic animal of 2 or fewer points from hand.",
    imageUrl: "/serene-sea-turtle.png",
  },
  {
    id: 122,
    type: "animal",
    name: "Turtle",
    points: 2,
    environment: "aquatic",
    effect: "On play, play an aquatic animal of 2 or fewer points from hand.",
    imageUrl: "/serene-sea-turtle.png",
  },

  // 2x Dolphin - 3 points
  {
    id: 123,
    type: "animal",
    name: "Dolphin",
    points: 3,
    environment: "aquatic",
    effect: "On play, you may send 1 card from hand to deck bottom to draw 1 card.",
    imageUrl: "/playful-dolphin.png",
  },
  {
    id: 124,
    type: "animal",
    name: "Dolphin",
    points: 3,
    environment: "aquatic",
    effect: "On play, you may send 1 card from hand to deck bottom to draw 1 card.",
    imageUrl: "/playful-dolphin.png",
  },

  // 1x Octopus - 3 points
  {
    id: 125,
    type: "animal",
    name: "Octopus",
    points: 3,
    environment: "aquatic",
    effect: "On play, look at the top 3 cards of the deck. You may rearrange them.",
    imageUrl: "/curious-octopus.png",
  },

  // 1x Stingray - 3 points
  {
    id: 126,
    type: "animal",
    name: "Stingray",
    points: 3,
    environment: "aquatic",
    effect: "On play, if you have 7 or more points, draw 1 card.",
    imageUrl: "/graceful-glider.png",
  },

  // 1x Shark - 4 points
  {
    id: 127,
    type: "animal",
    name: "Shark",
    points: 4,
    environment: "aquatic",
    effect: "Sacrifice 1 animal to play this card. On play, draw cards until you have 4.",
    imageUrl: "/reef-shark-patrol.png",
  },

  // 7 Amphibian Animals
  // 3x Frog - 1 point
  {
    id: 128,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    effect: "On play, destroy the animal your opponent controls with fewer points (your choice if tied).",
    imageUrl: "/serene-frog.png",
  },
  {
    id: 129,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    effect: "On play, destroy the animal your opponent controls with fewer points (your choice if tied).",
    imageUrl: "/serene-frog.png",
  },
  {
    id: 130,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    effect: "On play, destroy the animal your opponent controls with fewer points (your choice if tied).",
    imageUrl: "/serene-frog.png",
  },

  // 2x Crab - 2 points
  {
    id: 131,
    type: "animal",
    name: "Crab",
    points: 2,
    environment: "amphibian",
    effect: "On play, look at the top 2 cards: add 1 to hand and send the other to deck bottom.",
    imageUrl: "/beach-crab-close-up.png",
  },
  {
    id: 132,
    type: "animal",
    name: "Crab",
    points: 2,
    environment: "amphibian",
    effect: "On play, look at the top 2 cards: add 1 to hand and send the other to deck bottom.",
    imageUrl: "/beach-crab-close-up.png",
  },

  // 1x Otter - 3 points
  {
    id: 133,
    type: "animal",
    name: "Otter",
    points: 3,
    environment: "amphibian",
    effect:
      "On play, if you have 7 or more points, your opponents gives you a random card from their hand to your hand.",
    imageUrl: "/playful-river-otter.png",
  },

  // 1x Crocodile - 4 points
  {
    id: 134,
    type: "animal",
    name: "Crocodile",
    points: 4,
    environment: "amphibian",
    effect:
      "Send 1 animal you control to hand to play this card. On play, send 1 animal of 3 or fewer points your opponent controls to deck bottom.",
    imageUrl: "/swamp-crocodile.png",
  },

  // 15 Impact Cards
  // 3x Hunter
  {
    id: 135,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal.",
    imageUrl: "/vigilant-watcher.png",
  },
  {
    id: 136,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal.",
    imageUrl: "/vigilant-watcher.png",
  },
  {
    id: 137,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal.",
    imageUrl: "/vigilant-watcher.png",
  },

  // 3x Fisher
  {
    id: 138,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal.",
    imageUrl: "/weathered-net-caster.png",
  },
  {
    id: 139,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal.",
    imageUrl: "/weathered-net-caster.png",
  },
  {
    id: 140,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal.",
    imageUrl: "/weathered-net-caster.png",
  },

  // 2x Scare
  {
    id: 141,
    type: "impact",
    name: "Scare",
    effect: "Send 1 animal to deck top.",
    imageUrl: "/forest-fright.png",
  },
  {
    id: 142,
    type: "impact",
    name: "Scare",
    effect: "Send 1 animal to deck top.",
    imageUrl: "/forest-fright.png",
  },

  // 1x Veterinarian
  {
    id: 143,
    type: "impact",
    name: "Veterinarian",
    effect: "Play an animal from discard.",
    imageUrl: "/compassionate-vet-care.png",
  },

  // 1x Confusion
  {
    id: 144,
    type: "impact",
    name: "Confusion",
    effect: "Exchange control between 2 animals.",
    imageUrl: "/bewildered-critters.png",
  },

  // 1x Domesticate
  {
    id: 145,
    type: "impact",
    name: "Domesticate",
    effect: "Gain control over an animal of 2 points.",
    imageUrl: "/tamed-creature.png",
  },

  // 1x Epidemic
  {
    id: 146,
    type: "impact",
    name: "Epidemic",
    effect: "Send 1 animal you control and all animals of same environment to deck bottom.",
    imageUrl: "/spreading-illness.png",
  },

  // 1x Compete
  {
    id: 147,
    type: "impact",
    name: "Compete",
    effect: "Discard 1 animal to send all animals of equal points to deck bottom.",
    imageUrl: "/territorial-dispute.png",
  },

  // 1x Prey Upon
  {
    id: 148,
    type: "impact",
    name: "Prey Upon",
    effect:
      "Select 1 animal on your field: send all other animals of same environment and fewer points to deck bottom.",
    imageUrl: "/hunting-predator.png",
  },

  // 1x Earthquake
  {
    id: 149,
    type: "impact",
    name: "Earthquake",
    effect: "Send all animals of 3 or more points to deck bottom.",
    imageUrl: "/ground-tremor.png",
  },
]

// Define a single deck configuration
export const DECK_CONFIGURATIONS = [
  {
    id: 1,
    name: "Advanced Deck",
    description: "Enhanced deck with powerful animal abilities and strategic impacts.",
    deckType: "advanced",
  },
]
