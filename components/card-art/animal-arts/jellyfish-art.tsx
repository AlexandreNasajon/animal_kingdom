import { WatercolorBackground } from "../watercolor-utils"

export function JellyfishArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#4B0082" />

      {/* Deep ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-indigo-900 opacity-70"></div>

      {/* Jellyfish bell */}
      <div className="absolute top-1/3 left-1/2 h-1/4 w-1/3 -translate-x-1/2 rounded-t-full bg-purple-400 opacity-80"></div>

      {/* Jellyfish inner glow */}
      <div className="absolute top-[35%] left-1/2 h-1/5 w-1/4 -translate-x-1/2 rounded-t-full bg-purple-300 opacity-50"></div>

      {/* Jellyfish tentacles */}
      <div className="absolute top-[57%] left-[40%] h-1/3 w-1/32 bg-purple-300 opacity-70 animate-pulse"></div>
      <div className="absolute top-[57%] left-[45%] h-1/4 w-1/32 bg-purple-300 opacity-70 animate-pulse"></div>
      <div className="absolute top-[57%] left-[50%] h-1/3 w-1/32 bg-purple-300 opacity-70 animate-pulse"></div>
      <div className="absolute top-[57%] left-[55%] h-1/4 w-1/32 bg-purple-300 opacity-70 animate-pulse"></div>
      <div className="absolute top-[57%] left-[60%] h-1/3 w-1/32 bg-purple-300 opacity-70 animate-pulse"></div>

      {/* Bioluminescent spots */}
      <div className="absolute top-[40%] left-[45%] h-1/24 w-1/24 rounded-full bg-blue-200 opacity-90 animate-pulse"></div>
      <div className="absolute top-[45%] left-[50%] h-1/24 w-1/24 rounded-full bg-blue-200 opacity-90 animate-pulse"></div>
      <div className="absolute top-[40%] left-[55%] h-1/24 w-1/24 rounded-full bg-blue-200 opacity-90 animate-pulse"></div>

      {/* Small bubbles */}
      <div className="absolute top-1/4 left-1/3 h-1/24 w-1/24 rounded-full bg-white opacity-30"></div>
      <div className="absolute top-1/5 left-2/3 h-1/32 w-1/32 rounded-full bg-white opacity-30"></div>
    </div>
  )
}
