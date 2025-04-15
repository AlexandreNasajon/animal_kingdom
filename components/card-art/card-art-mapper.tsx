import type { GameCard } from "@/types/game"
import { AquaticArt } from "./aquatic-art"
import { TerrestrialArt } from "./terrestrial-art"
import { AmphibianArt } from "./amphibian-art"
import { ImpactArt } from "./impact-art"
import { FishArt } from "./animal-arts/fish-art"
import { DolphinArt } from "./animal-arts/dolphin-art"
import { OctopusArt } from "./animal-arts/octopus-art"
import { MouseArt } from "./animal-arts/mouse-art"
import { SnakeArt } from "./animal-arts/snake-art"
import { LionArt } from "./animal-arts/lion-art"
import { CrocodileArt } from "./animal-arts/crocodile-art"
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

export function getCardArt(card: GameCard) {
  // Animal cards
  if (card.type === "animal") {
    switch (card.name.toLowerCase()) {
      case "fish":
        return <FishArt />
      case "dolphin":
        return <DolphinArt />
      case "octopus":
        return <OctopusArt />
      case "mouse":
        return <MouseArt />
      case "snake":
        return <SnakeArt />
      case "lion":
        return <LionArt />
      case "crocodile":
        return <CrocodileArt />
      default:
        // Fallback to generic art based on environment
        switch (card.environment) {
          case "aquatic":
            return <AquaticArt />
          case "terrestrial":
            return <TerrestrialArt />
          case "amphibian":
            return <AmphibianArt />
          default:
            return <TerrestrialArt />
        }
    }
  }

  // Impact cards
  if (card.type === "impact") {
    switch (card.name.toLowerCase()) {
      case "hunter":
        return <HunterArt />
      case "fisher":
        return <FisherArt />
      case "scare":
        return <ScareArt />
      case "veterinarian":
        return <VeterinarianArt />
      case "limit":
        return <LimitArt />
      case "confuse":
        return <ConfuseArt />
      case "domesticate":
        return <DomesticateArt />
      case "trap":
        return <TrapArt />
      case "drought":
        return <DroughtArt />
      case "flood":
        return <FloodArt />
      case "release":
        return <ReleaseArt />
      case "epidemic":
        return <EpidemicArt />
      case "compete":
        return <CompeteArt />
      case "prey":
        return <PreyArt />
      case "cage":
        return <CageArt />
      case "flourish":
        return <FlourishArt />
      case "earthquake":
        return <EarthquakeArt />
      case "storm":
        return <StormArt />
      default:
        return <ImpactArt />
    }
  }

  // Default fallback
  return <TerrestrialArt />
}
