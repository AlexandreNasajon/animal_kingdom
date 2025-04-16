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
import { LimitArt } from "./impact-arts/limit-art"
import { ConfuseArt } from "./impact-arts/confuse-art"
import { DomesticateArt } from "./impact-arts/domesticate-art"
import { TrapArt } from "./impact-arts/trap-art"
import { DroughtArt } from "./impact-arts/drought-art"
import { FloodArt } from "./impact-arts/flood-art"
import { ReleaseArt } from "./impact-arts/release-art"
import { EpidemicArt } from "./impact-arts/epidemic-art"
import { CompeteArt } from "./impact-arts/compete-art"
import { PreyArt } from "./impact-arts/prey-art"
import { CageArt } from "./impact-arts/cage-art"
import { FlourishArt } from "./impact-arts/flourish-art"
import { EarthquakeArt } from "./impact-arts/earthquake-art"
import { StormArt } from "./impact-arts/storm-art"
import { DolphinArt } from "./animal-arts/dolphin-art"
import { OtterArt } from "./animal-arts/otter-art"
import { LionArt } from "./animal-arts/lion-art"
import { FrogArt } from "./animal-arts/frog-art"
import { CrabArt } from "./animal-arts/crab-art"
import { FishArt } from "./animal-arts/fish-art"
import { MouseArt } from "./animal-arts/mouse-art"
import { OctopusArt } from "./animal-arts/octopus-art"
import { SnakeArt } from "./animal-arts/snake-art"
import { CrocodileArt } from "./animal-arts/crocodile-art"

export function getCardArt(card: GameCard) {
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
    return <ImpactArt />
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
  if (card.name === "Limit") {
    return <LimitArt />
  }
  if (card.name === "Confuse") {
    return <ConfuseArt />
  }
  if (card.name === "Domesticate") {
    return <DomesticateArt />
  }
  if (card.name === "Trap") {
    return <TrapArt />
  }
  if (card.name === "Drought") {
    return <DroughtArt />
  }
  if (card.name === "Flood") {
    return <FloodArt />
  }
  if (card.name === "Release") {
    return <ReleaseArt />
  }
  if (card.name === "Epidemic") {
    return <EpidemicArt />
  }
  if (card.name === "Compete") {
    return <CompeteArt />
  }
  if (card.name === "Prey") {
    return <PreyArt />
  }
  if (card.name === "Cage") {
    return <CageArt />
  }
  if (card.name === "Flourish") {
    return <FlourishArt />
  }
  if (card.name === "Earthquake") {
    return <EarthquakeArt />
  }
  if (card.name === "Storm") {
    return <StormArt />
  }

  // Animal cards
  if (card.name === "Dolphin") {
    return <DolphinArt />
  }
  if (card.name === "Otter") {
    return <OtterArt />
  }
  if (card.name === "Lion") {
    return <LionArt />
  }
  if (card.name === "Frog") {
    return <FrogArt />
  }
  if (card.name === "Crab") {
    return <CrabArt />
  }
  if (card.name === "Fish") {
    return <FishArt />
  }
  if (card.name === "Mouse") {
    return <MouseArt />
  }
  if (card.name === "Octopus") {
    return <OctopusArt />
  }
  if (card.name === "Snake") {
    return <SnakeArt />
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
    return <ImpactArt />
  }

  // Fallback
  return <div className="flex h-full w-full items-center justify-center bg-green-900">No Art</div>
}
