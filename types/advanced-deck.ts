import type { GameCard } from "./game"

// Terrestrial Animals
const mouse: GameCard = {
  id: 101,
  type: "animal",
  name: "Mouse",
  points: 1,
  environment: "terrestrial",
  effect: "On play, send a terrestrial animal your opponent controls to deck top.",
  imageUrl: "/forest-mouse-foraging.png",
}

const squirrel: GameCard = {
  id: 102,
  type: "animal",
  name: "Squirrel",
  points: 1,
  environment: "terrestrial",
  effect: "On play, look at your opponent's hand and select a card to be discarded.",
  imageUrl: "/bushy-tailed-perch.png",
}

const fox: GameCard = {
  id: 103,
  type: "animal",
  name: "Fox",
  points: 2,
  environment: "terrestrial",
  effect: "On play, your opponent discards a card at random.",
  imageUrl: "/alert-fox.png",
}

const snake: GameCard = {
  id: 104,
  type: "animal",
  name: "Snake",
  points: 2,
  environment: "terrestrial",
  effect: "On play, destroy an animal of 1 point your opponent controls.",
  imageUrl: "/coiled-grass-snake.png",
}

const zebra: GameCard = {
  id: 105,
  type: "animal",
  name: "Zebra",
  points: 3,
  environment: "terrestrial",
  effect: "On play, look at your opponent's hand.",
  imageUrl: "/savanna-zebra.png",
}

const deer: GameCard = {
  id: 106,
  type: "animal",
  name: "Deer",
  points: 3,
  environment: "terrestrial",
  effect: "On play, if you have 7 or more points, your opponent discards a card at random.",
  imageUrl: "/forest-deer.png",
}

const wolf: GameCard = {
  id: 107,
  type: "animal",
  name: "Wolf",
  points: 3,
  environment: "terrestrial",
  effect: "On play, each player discards 1 card at random.",
  imageUrl: "/lone-howler.png",
}

const lion: GameCard = {
  id: 108,
  type: "animal",
  name: "Lion",
  points: 4,
  environment: "terrestrial",
  effect: "Sacrifice 1 animal to play this card.\nOn play, your opponent discards 2 cards at random.",
  imageUrl: "/savanna-king.png",
}

// Aquatic Animals
const tuna: GameCard = {
  id: 109,
  type: "animal",
  name: "Tuna",
  points: 1,
  environment: "aquatic",
  effect: "On play, play an aquatic animal of 3 or fewer points from hand.",
  imageUrl: "/canned-tuna-stack.png",
}

const seahorse: GameCard = {
  id: 110,
  type: "animal",
  name: "Seahorse",
  points: 1,
  environment: "aquatic",
  effect: "On play, draw 1 card for every played animal.",
  imageUrl: "/camouflaged-seahorse.png",
}

const jellyfish: GameCard = {
  id: 111,
  type: "animal",
  name: "Jellyfish",
  points: 2,
  environment: "aquatic",
  effect: "On play, draw 1 card.",
  imageUrl: "/bioluminescent-jelly.png",
}

const turtle: GameCard = {
  id: 112,
  type: "animal",
  name: "Turtle",
  points: 2,
  environment: "aquatic",
  effect: "On play, play an aquatic animal of 2 or fewer points from hand.",
  imageUrl: "/serene-sea-turtle.png",
}

const dolphin: GameCard = {
  id: 113,
  type: "animal",
  name: "Dolphin",
  points: 3,
  environment: "aquatic",
  effect: "On play, you may send 1 card from hand to deck bottom to draw 1 card.",
  imageUrl: "/playful-dolphin.png",
}

const octopus: GameCard = {
  id: 114,
  type: "animal",
  name: "Octopus",
  points: 3,
  environment: "aquatic",
  effect: "On play, look at the top 3 cards of the deck. You may rearrange them.",
  imageUrl: "/curious-octopus.png",
}

const stingray: GameCard = {
  id: 115,
  type: "animal",
  name: "Stingray",
  points: 3,
  environment: "aquatic",
  effect: "On play, if you have 7 or more points, draw 1 card.",
  imageUrl: "/graceful-glider.png",
}

const shark: GameCard = {
  id: 116,
  type: "animal",
  name: "Shark",
  points: 4,
  environment: "aquatic",
  effect: "Sacrifice 1 animal to play this card.\nOn play, draw cards until you have 4.",
  imageUrl: "/reef-shark-patrol.png",
}

// Amphibian Animals
const frog: GameCard = {
  id: 23,
  type: "animal",
  name: "Frog",
  points: 1,
  environment: "amphibian",
  effect: "On play, send an opponent animal with fewest points to deck bottom (random if tied).",
  imageUrl: "/serene-frog.png",
}

const crab: GameCard = {
  id: 118,
  type: "animal",
  name: "Crab",
  points: 2,
  environment: "amphibian",
  effect: "On play, look at the top 2 cards: add 1 to hand and send the other to deck bottom.",
  imageUrl: "/beach-crab-close-up.png",
}

const otter: GameCard = {
  id: 119,
  type: "animal",
  name: "Otter",
  points: 3,
  environment: "amphibian",
  effect: "On play, if you have 7 or more points, your opponents gives you a random card from their hand to your hand.",
  imageUrl: "/playful-river-otter.png",
}

const crocodile: GameCard = {
  id: 120,
  type: "animal",
  name: "Crocodile",
  points: 4,
  environment: "amphibian",
  effect:
    "Sacrifice 1 animal to play this card.\nOn play, send 1 animal of 3 or fewer points your opponent controls to deck bottom.",
  imageUrl: "/swamp-crocodile.png",
}

// Impact Cards
const hunter: GameCard = {
  id: 121,
  type: "impact",
  name: "Hunter",
  environment: "any",
  points: 0,
  effect: "Destroy 1 terrestrial animal.",
  imageUrl: "/vigilant-watcher.png",
}

const fisher: GameCard = {
  id: 122,
  type: "impact",
  name: "Fisher",
  environment: "any",
  points: 0,
  effect: "Destroy 1 aquatic animal.",
  imageUrl: "/weathered-net-caster.png",
}

const scare: GameCard = {
  id: 123,
  type: "impact",
  name: "Scare",
  environment: "any",
  points: 0,
  effect: "Send 1 animal to deck top.",
  imageUrl: "/forest-fright.png",
}

const flood: GameCard = {
  id: 220,
  type: "impact",
  name: "Flood",
  environment: "any",
  points: 0,
  effect: "Send the 2 animal with fewest points of each player to deck bottom.",
  imageUrl: "/flooded-street-city.png",
}

const veterinarian: GameCard = {
  id: 124,
  type: "impact",
  name: "Veterinarian",
  environment: "any",
  points: 0,
  effect: "Play an animal from discard.",
  imageUrl: "/compassionate-vet-care.png",
}

const confusion: GameCard = {
  id: 125,
  type: "impact",
  name: "Confusion",
  environment: "any",
  points: 0,
  effect: "Exchange control between 2 animals.",
  imageUrl: "/bewildered-critters.png",
}

const domesticate: GameCard = {
  id: 126,
  type: "impact",
  name: "Domesticate",
  environment: "any",
  points: 0,
  effect: "Gain control over an animal of 2 points.",
  imageUrl: "/tamed-creature.png",
}

const epidemic: GameCard = {
  id: 127,
  type: "impact",
  name: "Epidemic",
  environment: "any",
  points: 0,
  effect: "Send 1 animal you control and all animals of same environment to deck bottom.",
  imageUrl: "/spreading-illness.png",
}

const compete: GameCard = {
  id: 128,
  type: "impact",
  name: "Compete",
  environment: "any",
  points: 0,
  effect: "Discard 1 animal to send all animals of equal points to deck bottom.",
  imageUrl: "/territorial-dispute.png",
}

const preyUpon: GameCard = {
  id: 129,
  type: "impact",
  name: "Prey Upon",
  environment: "any",
  points: 0,
  effect: "Select 1 animal on your field: send all other animals of same environment and fewer points to deck bottom.",
  imageUrl: "/hunting-predator.png",
}

const earthquake: GameCard = {
  id: 130,
  type: "impact",
  name: "Earthquake",
  environment: "any",
  points: 0,
  effect: "Send all animals of 3 or more points to deck bottom.",
  imageUrl: "/ground-tremor.png",
}

// Create the advanced deck
export const ADVANCED_DECK: GameCard[] = [
  // Terrestrial Animals (14)
  mouse,
  { ...mouse, id: 201 },
  { ...mouse, id: 202 },
  squirrel,
  { ...squirrel, id: 203 },
  { ...squirrel, id: 204 },
  fox,
  { ...fox, id: 205 },
  snake,
  { ...snake, id: 206 },
  zebra,
  deer,
  wolf,
  lion,

  // Aquatic Animals (14)
  tuna,
  { ...tuna, id: 207 },
  { ...tuna, id: 208 },
  seahorse,
  { ...seahorse, id: 209 },
  { ...seahorse, id: 210 },
  jellyfish,
  { ...jellyfish, id: 211 },
  turtle,
  { ...turtle, id: 212 },
  dolphin,
  octopus,
  stingray,
  shark,

  // Amphibian Animals (7)
  frog,
  { ...frog, id: 213 },
  { ...frog, id: 214 },
  crab,
  { ...crab, id: 215 },
  otter,
  crocodile,

  // Impact Cards (15)
  hunter,
  { ...hunter, id: 216 },
  { ...hunter, id: 217 },
  fisher,
  { ...fisher, id: 218 },
  { ...fisher, id: 219 },
  scare,
  // Removed one scare card (id: 220) and replaced with flood
  flood,
  veterinarian,
  confusion,
  domesticate,
  epidemic,
  compete,
  preyUpon,
  earthquake,
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
