"use client"

import { FrogArt } from "./animal-arts/frog-art"
import { CrabArt } from "./animal-arts/crab-art"
import { OtterArt } from "./animal-arts/otter-art"
import { CrocodileArt } from "./animal-arts/crocodile-art"
import { MouseArt } from "./animal-arts/mouse-art"
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
import { LionArt } from "./animal-arts/lion-art"
import { SnakeArt } from "./animal-arts/snake-art"
import { FishArt } from "./animal-arts/fish-art"
import { DolphinArt } from "./animal-arts/dolphin-art"
import { OctopusArt } from "./animal-arts/octopus-art"

// Import impact art components
import { HunterArt } from "./impact-arts/hunter-art"
import { FisherArt } from "./impact-arts/fisher-art"
import { DroughtArt } from "./impact-arts/drought-art"
import { FloodArt } from "./impact-arts/flood-art"
import { ScareArt } from "./impact-arts/scare-art"
import { ConfuseArt } from "./impact-arts/confuse-art"
import { DomesticateArt } from "./impact-arts/domesticate-art"
import { ReleaseArt } from "./impact-arts/release-art"
import { CompeteArt } from "./impact-arts/compete-art"
import { PreyArt } from "./impact-arts/prey-art"
import { FlourishArt } from "./impact-arts/flourish-art"
import { EarthquakeArt } from "./impact-arts/earthquake-art"
import { StormArt } from "./impact-arts/storm-art"
import { EpidemicArt } from "./impact-arts/epidemic-art"
import { VeterinarianArt } from "./impact-arts/veterinarian-art"
import { TrapArt } from "./impact-arts/trap-art"
import { CageArt } from "./impact-arts/cage-art"
import { LimitArt } from "./impact-arts/limit-art"

export function getCardArt(card: any) {
  if (!card) return null

  // For animal cards, return the appropriate art component based on the animal name
  if (card.type === "animal") {
    switch (card.name) {
      case "Frog":
        return <FrogArt />
      case "Crab":
        return <CrabArt />
      case "Otter":
        return <OtterArt />
      case "Crocodile":
        return <CrocodileArt />
      case "Mouse":
        return <MouseArt />
      case "Squirrel":
        return <SquirrelArt />
      case "Fox":
        return <FoxArt />
      case "Zebra":
        return <ZebraArt />
      case "Deer":
        return <DeerArt />
      case "Wolf":
        return <WolfArt />
      case "Tuna":
        return <TunaArt />
      case "Seahorse":
        return <SeahorseArt />
      case "Jellyfish":
        return <JellyfishArt />
      case "Turtle":
        return <TurtleArt />
      case "Stingray":
        return <StingrayArt />
      case "Shark":
        return <SharkArt />
      case "Lion":
        return <LionArt />
      case "Snake":
        return <SnakeArt />
      case "Fish":
        return <FishArt />
      case "Dolphin":
        return <DolphinArt />
      case "Octopus":
        return <OctopusArt />
      default:
        // Default placeholder for unknown animal cards
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
            <span className="text-xs text-gray-600">{card.name}</span>
          </div>
        )
    }
  }

  // For impact cards, return the appropriate art component based on the impact name
  if (card.type === "impact") {
    switch (card.name) {
      case "Hunter":
        return <HunterArt />
      case "Fisher":
        return <FisherArt />
      case "Drought":
        return <DroughtArt />
      case "Flood":
        return <FloodArt />
      case "Scare":
        return <ScareArt />
      case "Confuse":
        return <ConfuseArt />
      case "Domesticate":
        return <DomesticateArt />
      case "Release":
        return <ReleaseArt />
      case "Compete":
        return <CompeteArt />
      case "Prey":
        return <PreyArt />
      case "Flourish":
        return <FlourishArt />
      case "Earthquake":
        return <EarthquakeArt />
      case "Storm":
        return <StormArt />
      case "Epidemic":
        return <EpidemicArt />
      case "Veterinarian":
        return <VeterinarianArt />
      case "Trap":
        return <TrapArt />
      case "Cage":
        return <CageArt />
      case "Limit":
        return <LimitArt />
      default:
        // Default placeholder for unknown impact cards
        return (
          <div className="w-full h-full flex items-center justify-center bg-purple-200 rounded-md">
            <span className="text-xs text-purple-600">{card.name}</span>
          </div>
        )
    }
  }

  // Default placeholder for unknown card types
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
      <span className="text-xs text-gray-600">Unknown Card</span>
    </div>
  )
}
