import { WatercolorBackground } from "../watercolor-utils"

export function SeahorseArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#00BFFF" />

      {/* Ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-600 opacity-50"></div>

      {/* Coral */}
      <div className="absolute bottom-0 left-1/4 h-1/3 w-1/12 bg-pink-300 rounded-t-lg"></div>
      <div className="absolute bottom-0 left-1/3 h-1/4 w-1/12 bg-pink-400 rounded-t-lg"></div>
      <div className="absolute bottom-0 left-2/3 h-1/3 w-1/12 bg-pink-500 rounded-t-lg"></div>

      {/* Seahorse body - curved shape */}
      <div className="absolute top-1/3 left-1/2 h-1/3 w-1/6 -translate-x-1/2 rounded-full bg-yellow-200 transform rotate-12"></div>

      {/* Seahorse head */}
      <div className="absolute top-1/4 left-1/2 h-1/6 w-1/8 -translate-x-1/2 rounded-t-lg bg-yellow-200 transform -rotate-12"></div>

      {/* Seahorse snout */}
      <div className="absolute top-1/5 left-[48%] h-1/12 w-1/24 -translate-x-1/2 bg-yellow-200 rounded-t-lg"></div>

      {/* Seahorse tail */}
      <div className="absolute top-2/3 left-1/2 h-1/4 w-1/12 -translate-x-1/2 bg-yellow-200 rounded-b-full transform rotate-12"></div>

      {/* Seahorse fins */}
      <div className="absolute top-[40%] left-[55%] h-1/16 w-1/16 -translate-x-1/2 bg-yellow-100 rounded-full"></div>

      {/* Seahorse eye */}
      <div className="absolute top-1/4 left-[48%] h-1/24 w-1/24 -translate-x-1/2 rounded-full bg-black"></div>

      {/* Seahorse spots */}
      <div className="absolute top-[45%] left-[48%] h-1/32 w-1/32 -translate-x-1/2 rounded-full bg-yellow-600"></div>
      <div className="absolute top-[50%] left-[52%] h-1/32 w-1/32 -translate-x-1/2 rounded-full bg-yellow-600"></div>
      <div className="absolute top-[55%] left-[48%] h-1/32 w-1/32 -translate-x-1/2 rounded-full bg-yellow-600"></div>
    </div>
  )
}
