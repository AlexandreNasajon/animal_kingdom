import type { GameCard } from "./game"

// Replace the entire ORIGINAL_DECK array with this updated version
export const ORIGINAL_DECK: GameCard[] = [
  // Terrestrial Animals - 14 cards
  // 3x Mouse
  {
    id: 101,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    effect: "On play, send a terrestrial animal your opponent controls to deck top.",
    imageUrl: "/field-mouse-close-up.png",
  },
  {
    id: 101,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    effect: "On play, send a terrestrial animal your opponent controls to deck top.",
    imageUrl: "/field-mouse-close-up.png",
  },
  {
    id: 101,
    type: "animal",
    name: "Mouse",
    points: 1,
    environment: "terrestrial",
    effect: "On play, send a terrestrial animal your opponent controls to deck top.",
    imageUrl: "/field-mouse-close-up.png",
  },
  // 3x Squirrel
  {
    id: 102,
    type: "animal",
    name: "Squirrel",
    points: 1,
    environment: "terrestrial",
    effect: "On play, look at your opponent's hand and discard 1 card from it.",
    imageUrl: "/bushy-tailed-perch.png",
  },
  {
    id: 102,
    type: "animal",
    name: "Squirrel",
    points: 1,
    environment: "terrestrial",
    effect: "On play, look at your opponent's hand and discard 1 card from it.",
    imageUrl: "/bushy-tailed-perch.png",
  },
  {
    id: 102,
    type: "animal",
    name: "Squirrel",
    points: 1,
    environment: "terrestrial",
    effect: "On play, look at your opponent's hand and discard 1 card from it.",
    imageUrl: "/bushy-tailed-perch.png",
  },
  // 2x Fox
  {
    id: 103,
    type: "animal",
    name: "Fox",
    points: 2,
    environment: "terrestrial",
    effect: "On play, your opponent discards 1 random card from hand.",
    imageUrl: "/alert-fox.png",
  },
  {
    id: 103,
    type: "animal",
    name: "Fox",
    points: 2,
    environment: "terrestrial",
    effect: "On play, your opponent discards 1 random card from hand.",
    imageUrl: "/alert-fox.png",
  },
  // 2x Snake
  {
    id: 104,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    effect: "On play, destroy an animal of 1 point your opponent controls.",
    imageUrl: "/coiled-python.png",
  },
  {
    id: 104,
    type: "animal",
    name: "Snake",
    points: 2,
    environment: "terrestrial",
    effect: "On play, destroy an animal of 1 point your opponent controls.",
    imageUrl: "/coiled-python.png",
  },
  // 3x Deer (was 1x, added 2 more)
  {
    id: 106,
    type: "animal",
    name: "Deer",
    points: 3,
    environment: "terrestrial",
    effect: "On play, if you have 7 or more points, your opponent sends a random card from hand to deck bottom.",
    imageUrl: "/forest-deer.png",
  },
  {
    id: 106,
    type: "animal",
    name: "Deer",
    points: 3,
    environment: "terrestrial",
    effect: "On play, if you have 7 or more points, your opponent sends a random card from hand to deck bottom.",
    imageUrl: "/forest-deer.png",
  },
  {
    id: 106,
    type: "animal",
    name: "Deer",
    points: 3,
    environment: "terrestrial",
    effect: "On play, if you have 7 or more points, your opponent sends a random card from hand to deck bottom.",
    imageUrl: "/forest-deer.png",
  },
  // 1x Lion
  {
    id: 108,
    type: "animal",
    name: "Lion",
    points: 4,
    environment: "terrestrial",
    effect:
      "Sacrifice 1 animal to play this card. On play, your opponent sends 2 random cards from hand to deck bottom.",
    imageUrl: "/majestic-lion-portrait.png",
  },

  // Aquatic Animals - 14 cards
  // 3x Tuna
  {
    id: 109,
    type: "animal",
    name: "Tuna",
    points: 1,
    environment: "aquatic",
    effect: "On play, play an aquatic animal of 3 or fewer points from hand.",
    imageUrl: "/canned-tuna-stack.png",
  },
  {
    id: 109,
    type: "animal",
    name: "Tuna",
    points: 1,
    environment: "aquatic",
    effect: "On play, play an aquatic animal of 3 or fewer points from hand.",
    imageUrl: "/canned-tuna-stack.png",
  },
  {
    id: 109,
    type: "animal",
    name: "Tuna",
    points: 1,
    environment: "aquatic",
    effect: "On play, play an aquatic animal of 3 or fewer points from hand.",
    imageUrl: "/canned-tuna-stack.png",
  },
  // 3x Seahorse
  {
    id: 110,
    type: "animal",
    name: "Seahorse",
    points: 1,
    environment: "aquatic",
    effect: "On play, draw 1 card for every played animal this turn.",
    imageUrl: "/camouflaged-seahorse.png",
  },
  {
    id: 110,
    type: "animal",
    name: "Seahorse",
    points: 1,
    environment: "aquatic",
    effect: "On play, draw 1 card for every played animal this turn.",
    imageUrl: "/camouflaged-seahorse.png",
  },
  {
    id: 110,
    type: "animal",
    name: "Seahorse",
    points: 1,
    environment: "aquatic",
    effect: "On play, draw 1 card for every played animal this turn.",
    imageUrl: "/camouflaged-seahorse.png",
  },
  // 2x Jellyfish
  {
    id: 111,
    type: "animal",
    name: "Jellyfish",
    points: 2,
    environment: "aquatic",
    effect: "On play, draw 1 card.",
    imageUrl: "/bioluminescent-jelly.png",
  },
  {
    id: 111,
    type: "animal",
    name: "Jellyfish",
    points: 2,
    environment: "aquatic",
    effect: "On play, draw 1 card.",
    imageUrl: "/bioluminescent-jelly.png",
  },
  // 2x Turtle
  {
    id: 112,
    type: "animal",
    name: "Turtle",
    points: 2,
    environment: "aquatic",
    effect: "On play, play an aquatic animal of 2 or fewer points from hand.",
    imageUrl: "/serene-sea-turtle.png",
  },
  {
    id: 112,
    type: "animal",
    name: "Turtle",
    points: 2,
    environment: "aquatic",
    effect: "On play, play an aquatic animal of 2 or fewer points from hand.",
    imageUrl: "/serene-sea-turtle.png",
  },
  // 3x Dolphin (renamed from Stingray)
  {
    id: 115,
    type: "animal",
    name: "Dolphin",
    points: 3,
    environment: "aquatic",
    effect: "On play, if you have 7 or more points, draw 1 card.",
    imageUrl: "/graceful-glider.png",
  },
  {
    id: 115,
    type: "animal",
    name: "Dolphin",
    points: 3,
    environment: "aquatic",
    effect: "On play, if you have 7 or more points, draw 1 card.",
    imageUrl: "/graceful-glider.png",
  },
  {
    id: 115,
    type: "animal",
    name: "Dolphin",
    points: 3,
    environment: "aquatic",
    effect: "On play, if you have 7 or more points, draw 1 card.",
    imageUrl: "/graceful-glider.png",
  },
  // 1x Shark
  {
    id: 116,
    type: "animal",
    name: "Shark",
    points: 4,
    environment: "aquatic",
    effect: "Sacrifice 1 animal to play this card. On play, draw cards until you have 4.",
    imageUrl: "/reef-shark-patrol.png",
  },

  // Amphibian Animals - 7 cards
  // 3x Frog
  {
    id: 117,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    effect: "On play, destroy the animal your opponent controls with fewer points (random if tied).",
    imageUrl: "/green-leaf-frog.png",
  },
  {
    id: 117,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    effect: "On play, destroy the animal your opponent controls with fewer points (random if tied).",
    imageUrl: "/green-leaf-frog.png",
  },
  {
    id: 117,
    type: "animal",
    name: "Frog",
    points: 1,
    environment: "amphibian",
    effect: "On play, destroy the animal your opponent controls with fewer points (random if tied).",
    imageUrl: "/green-leaf-frog.png",
  },
  // 2x Crab
  {
    id: 118,
    type: "animal",
    name: "Crab",
    points: 2,
    environment: "amphibian",
    effect: "On play, look at the top 2 cards: add 1 to hand and send the other to deck bottom.",
    imageUrl: "/hermit-crab-shell.png",
  },
  {
    id: 118,
    type: "animal",
    name: "Crab",
    points: 2,
    environment: "amphibian",
    effect: "On play, look at the top 2 cards: add 1 to hand and send the other to deck bottom.",
    imageUrl: "/hermit-crab-shell.png",
  },
  // 1x Otter
  {
    id: 119,
    type: "animal",
    name: "Otter",
    points: 3,
    environment: "amphibian",
    effect:
      "On play, if you have 7 or more points, your opponents gives you a random card from their hand to your hand.",
    imageUrl: "/playful-otter-river.png",
  },
  // 1x Crocodile
  {
    id: 120,
    type: "animal",
    name: "Crocodile",
    points: 4,
    environment: "amphibian",
    effect:
      "Sacrifice 1 animal to play this card. On play, send 1 animal of 3 or fewer points your opponent controls to deck bottom.",
    imageUrl: "/swamp-crocodile.png",
  },

  // Impact Cards - 15 cards
  // 3x Hunter
  {
    id: 121,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal.",
    imageUrl: "/vigilant-watcher.png",
  },
  {
    id: 121,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal.",
    imageUrl: "/vigilant-watcher.png",
  },
  {
    id: 121,
    type: "impact",
    name: "Hunter",
    effect: "Destroy 1 terrestrial animal.",
    imageUrl: "/vigilant-watcher.png",
  },
  // 3x Fisher
  {
    id: 122,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal.",
    imageUrl: "/weathered-net-caster.png",
  },
  {
    id: 122,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal.",
    imageUrl: "/weathered-net-caster.png",
  },
  {
    id: 122,
    type: "impact",
    name: "Fisher",
    effect: "Destroy 1 aquatic animal.",
    imageUrl: "/weathered-net-caster.png",
  },
  // 1x Scare
  {
    id: 123,
    type: "impact",
    name: "Scare",
    effect: "Send 1 animal to deck top.",
    imageUrl: "/forest-fright.png",
  },
  // 1x Veterinarian
  {
    id: 124,
    type: "impact",
    name: "Veterinarian",
    effect: "Play an animal from discard.",
    imageUrl: "/compassionate-vet-care.png",
  },
  // 1x Confusion
  {
    id: 125,
    type: "impact",
    name: "Confusion",
    effect: "Exchange control between 2 animals.",
    imageUrl: "/bewildered-critters.png",
  },
  // 1x Domesticate
  {
    id: 126,
    type: "impact",
    name: "Domesticate",
    effect: "Gain control over an animal of 2 points.",
    imageUrl: "/farm-friends.png",
  },
  // 1x Epidemic
  {
    id: 127,
    type: "impact",
    name: "Epidemic",
    effect: "Send 1 animal you control and all animals of same environment to deck bottom.",
    imageUrl: "/interconnected-disease-spread.png",
  },
  // 1x Compete
  {
    id: 128,
    type: "impact",
    name: "Compete",
    effect: "Discard 1 animal to send all animals of equal points to deck bottom.",
    imageUrl: "/cheetah-gazelle-chase.png",
  },
  // 1x Prey Upon
  {
    id: 129,
    type: "impact",
    name: "Prey Upon",
    effect:
      "Select 1 animal on your field: send all other animals of same environment and fewer points to deck bottom.",
    imageUrl: "/stealthy-stalker.png",
  },
  // 1x Earthquake
  {
    id: 130,
    type: "impact",
    name: "Earthquake",
    effect: "Send all animals of 3 or more points to deck bottom.",
    imageUrl: "/shattered-cityscape.png",
  },
  // 1x Flood
  {
    id: 131,
    type: "impact",
    name: "Flood",
    effect: "Each player sends their 2 animals with fewer points to deck bottom (random if tied).",
    imageUrl: "/flooded-street-city.png",
  },
]
