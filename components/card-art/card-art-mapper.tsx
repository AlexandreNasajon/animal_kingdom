"use client"

import type { GameCard } from "@/types/game"
import { AquaticArt } from "./aquatic-art"
import { TerrestrialArt } from "./terrestrial-art"
import { AmphibianArt } from "./amphibian-art"
import { ImpactArt } from "./impact-art"
import { HunterArt } from "./impact-arts/hunter-art"
import { FisherArt } from "./impact-arts/fisher-art"
import { ScareArt } from "./impact-arts/scare-art"
import { VeterinarianArt } from "./impact-arts/veterinarian-art"
import { ConfuseArt } from "./impact-arts/confuse-art"
import { DomesticateArt } from "./impact-arts/domesticate-art"
import { EpidemicArt } from "./impact-arts/epidemic-art"
import { CompeteArt } from "./impact-arts/compete-art"
import { PreyArt } from "./impact-arts/prey-art"
import { EarthquakeArt } from "./impact-arts/earthquake-art"
import { DolphinArt } from "./animal-arts/dolphin-art"
import { OtterArt } from "./animal-arts/otter-art"
import { LionArt } from "./animal-arts/lion-art"
import { FrogArt } from "./animal-arts/frog-art"
import { CrabArt } from "./animal-arts/crab-art"
import { MouseArt } from "./animal-arts/mouse-art"
import { OctopusArt } from "./animal-arts/octopus-art"
import { SnakeArt } from "./animal-arts/snake-art"
import { CrocodileArt } from "./animal-arts/crocodile-art"

export function getCardArt(card: GameCard) {
  // Handle undefined or null card
  if (!card) {
    return <div className="flex h-full w-full items-center justify-center bg-green-900">No Card</div>
  }

  // Default to environment art if no specific art is found
  if (!card.name && card.environment === "aquatic") {
    return <AquaticArt />
  }
  if (!card.name && card.environment === "terrestrial") {
    return <TerrestrialArt />
  }
  if (!card.name && card.environment === "amphibian") {
    return <AmphibianArt />
  }
  if (!card.name && card.type === "impact") {
    return <ImpactArt name="impact" />
  }

  // Impact cards
  if (card.name === "Hunter") {
    return <HunterArt />
  }
  if (card.name === "Fisher") {
    return <FisherArt />
  }
  if (card.name === "Scare") {
    return <ScareArt />
  }
  if (card.name === "Veterinarian") {
    return <VeterinarianArt />
  }
  if (card.name === "Confuse" || card.name === "Confusion") {
    return <ConfuseArt />
  }
  if (card.name === "Domesticate") {
    return <DomesticateArt />
  }
  if (card.name === "Epidemic") {
    return <EpidemicArt />
  }
  if (card.name === "Compete") {
    return <CompeteArt />
  }
  if (card.name === "Prey" || card.name === "Prey Upon") {
    return <PreyArt />
  }
  if (card.name === "Earthquake") {
    return <EarthquakeArt />
  }

  // Animal cards - Terrestrial
  if (card.name === "Mouse") {
    return <MouseArt />
  }
  if (card.name === "Squirrel") {
    return <TerrestrialArt />
  }
  if (card.name === "Fox") {
    return <TerrestrialArt />
  }
  if (card.name === "Snake") {
    return <SnakeArt />
  }
  if (card.name === "Zebra") {
    return <TerrestrialArt />
  }
  if (card.name === "Deer") {
    return <TerrestrialArt />
  }
  if (card.name === "Wolf") {
    return <TerrestrialArt />
  }
  if (card.name === "Lion") {
    return <LionArt />
  }

  // Animal cards - Aquatic
  if (card.name === "Tuna") {
    return <AquaticArt />
  }
  if (card.name === "Seahorse") {
    return <AquaticArt />
  }
  if (card.name === "Jellyfish") {
    return <AquaticArt />
  }
  if (card.name === "Turtle") {
    return <AquaticArt />
  }
  if (card.name === "Dolphin") {
    return <DolphinArt />
  }
  if (card.name === "Octopus") {
    return <OctopusArt />
  }
  if (card.name === "Stingray") {
    return <AquaticArt />
  }
  if (card.name === "Shark") {
    return <AquaticArt />
  }

  // Animal cards - Amphibian
  if (card.name === "Frog") {
    return <FrogArt />
  }
  if (card.name === "Crab") {
    return <CrabArt />
  }
  if (card.name === "Otter") {
    return <OtterArt />
  }
  if (card.name === "Crocodile") {
    return <CrocodileArt />
  }

  // Default to environment art if no specific art is found
  if (card.environment === "aquatic") {
    return <AquaticArt />
  }
  if (card.environment === "terrestrial") {
    return <TerrestrialArt />
  }
  if (card.environment === "amphibian") {
    return <AmphibianArt />
  }
  if (card.type === "impact") {
    return <ImpactArt name={card.name || "impact"} />
  }

  // Fallback
  return <div className="flex h-full w-full items-center justify-center bg-green-900">No Art</div>
}
