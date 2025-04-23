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
import { SquirrelArt } from "./animal-arts/squirrel-art"
import { FoxArt } from "./animal-arts/fox-art"
import { ZebraArt } from "./animal-arts/zebra-art"
import { DeerArt } from "./animal-arts/deer-art"
import { WolfArt } from "./animal-arts/wolf-art"
import { TunaArt } from "./animal-arts/tuna-art"
import { SeahorseArt } from "./animal-arts/seahorse-art"
import { JellyfishArt } from "./animal-arts/jellyfish-art"
import { TurtleArt } from "./animal-arts/turtle-art"
import { StingrayArt } from "./animal-arts/stingray-art"
import { SharkArt } from "./animal-arts/shark-art"
import { FloodArt } from "./impact-arts/flood-art"
import { StormArt } from "./impact-arts/storm-art"
import { DroughtArt } from "./impact-arts/drought-art"
import { ReleaseArt } from "./impact-arts/release-art"
import { TrapArt } from "./impact-arts/trap-art"
import { CageArt } from "./impact-arts/cage-art"
import { LimitArt } from "./impact-arts/limit-art"
import { FlourishArt } from "./impact-arts/flourish-art"

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
  if (card.name === "Flood") {
    return <FloodArt />
  }
  if (card.name === "Storm") {
    return <StormArt />
  }
  if (card.name === "Drought") {
    return <DroughtArt />
  }
  if (card.name === "Release") {
    return <ReleaseArt />
  }
  if (card.name === "Trap") {
    return <TrapArt />
  }
  if (card.name === "Cage") {
    return <CageArt />
  }
  if (card.name === "Limit") {
    return <LimitArt />
  }
  if (card.name === "Flourish") {
    return <FlourishArt />
  }

  // Animal cards - Terrestrial
  if (card.name === "Mouse") {
    return <MouseArt />
  }
  if (card.name === "Squirrel") {
    return <SquirrelArt />
  }
  if (card.name === "Fox") {
    return <FoxArt />
  }
  if (card.name === "Snake") {
    return <SnakeArt />
  }
  if (card.name === "Zebra") {
    return <ZebraArt />
  }
  if (card.name === "Deer") {
    return <DeerArt />
  }
  if (card.name === "Wolf") {
    return <WolfArt />
  }
  if (card.name === "Lion") {
    return <LionArt />
  }

  // Animal cards - Aquatic
  if (card.name === "Tuna") {
    return <TunaArt />
  }
  if (card.name === "Seahorse") {
    return <SeahorseArt />
  }
  if (card.name === "Jellyfish") {
    return <JellyfishArt />
  }
  if (card.name === "Turtle") {
    return <TurtleArt />
  }
  if (card.name === "Dolphin") {
    return <DolphinArt />
  }
  if (card.name === "Octopus") {
    return <OctopusArt />
  }
  if (card.name === "Stingray") {
    return <StingrayArt />
  }
  if (card.name === "Shark") {
    return <SharkArt />
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
