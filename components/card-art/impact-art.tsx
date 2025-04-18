import { HunterArt } from "./impact-arts/hunter-art"
import { StormArt } from "./impact-arts/storm-art"
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

interface ImpactArtProps {
  name?: string
  size?: "small" | "medium" | "large"
  isActive?: boolean
}

export function ImpactArt({ name = "impact", size = "medium", isActive = false }: ImpactArtProps) {
  // Common animation classes for all impact arts
  const animationClass = isActive ? "animate-pulse-fast" : "animate-pulse-slow"

  // Size classes
  const sizeClass = size === "small" ? "h-full w-full" : size === "large" ? "h-[200px] w-[200px]" : "h-full w-full"

  // Base wrapper classes
  const wrapperClass = `relative ${sizeClass} overflow-hidden ${animationClass}`

  // Render the appropriate impact art based on name
  switch (name.toLowerCase()) {
    case "hunter":
      return (
        <div className={wrapperClass}>
          <HunterArt />
        </div>
      )
    case "storm":
      return (
        <div className={wrapperClass}>
          <StormArt />
        </div>
      )
    case "fisher":
      return (
        <div className={wrapperClass}>
          <FisherArt />
        </div>
      )
    case "scare":
      return (
        <div className={wrapperClass}>
          <ScareArt />
        </div>
      )
    case "veterinarian":
      return (
        <div className={wrapperClass}>
          <VeterinarianArt />
        </div>
      )
    case "limit":
      return (
        <div className={wrapperClass}>
          <LimitArt />
        </div>
      )
    case "confuse":
    case "confusion": // Handle both naming variants
      return (
        <div className={wrapperClass}>
          <ConfuseArt />
        </div>
      )
    case "domesticate":
      return (
        <div className={wrapperClass}>
          <DomesticateArt />
        </div>
      )
    case "trap":
      return (
        <div className={wrapperClass}>
          <TrapArt />
        </div>
      )
    case "drought":
      return (
        <div className={wrapperClass}>
          <DroughtArt />
        </div>
      )
    case "flood":
      return (
        <div className={wrapperClass}>
          <FloodArt />
        </div>
      )
    case "release":
      return (
        <div className={wrapperClass}>
          <ReleaseArt />
        </div>
      )
    case "epidemic":
      return (
        <div className={wrapperClass}>
          <EpidemicArt />
        </div>
      )
    case "compete":
      return (
        <div className={wrapperClass}>
          <CompeteArt />
        </div>
      )
    case "prey":
    case "prey upon": // Handle both naming variants
      return (
        <div className={wrapperClass}>
          <PreyArt />
        </div>
      )
    case "cage":
      return (
        <div className={wrapperClass}>
          <CageArt />
        </div>
      )
    case "flourish":
      return (
        <div className={wrapperClass}>
          <FlourishArt />
        </div>
      )
    case "earthquake":
      return (
        <div className={wrapperClass}>
          <EarthquakeArt />
        </div>
      )
    default:
      // Default impact art for unknown impacts
      return (
        <div className={`${wrapperClass} bg-purple-900 flex items-center justify-center`}>
          <div className="text-white text-xs text-center">
            {name}
            <div className="mt-1 w-8 h-8 mx-auto rounded-full bg-purple-700 animate-pulse-slow flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5 text-white animate-spin-slow"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      )
  }
}
