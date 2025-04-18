import { WatercolorBackground } from "../watercolor-utils"

export function StingrayArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#4682B4" />

      {/* Ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-800 opacity-60"></div>

      {/* Sandy bottom */}
      <div className="absolute bottom-0 left-0 h-1/6 w-full bg-amber-100 opacity-70"></div>

      {/* Stingray body - diamond shape */}
      <div className="absolute top-1/2 left-1/2 h-1/4 w-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-400 rounded-full transform scale-x-150"></div>

      {/* Stingray wings */}
      <div className="absolute top-1/2 left-[30%] h-1/6 w-1/4 -translate-y-1/2 bg-gray-400 rounded-l-full transform -rotate-12"></div>
      <div className="absolute top-1/2 left-[70%] h-1/6 w-1/4 -translate-y-1/2 bg-gray-400 rounded-r-full transform rotate-12"></div>

      {/* Stingray tail */}
      <div className="absolute top-1/2 left-[75%] h-1/24 w-1/4 -translate-y-1/2 bg-gray-500 rounded-r-full"></div>
      <div className="absolute top-1/2 left-[90%] h-1/48 w-1/12 -translate-y-1/2 bg-gray-600 rounded-r-full transform rotate-12"></div>

      {/* Stingray spots */}
      <div className="absolute top-[45%] left-[45%] h-1/32 w-1/32 rounded-full bg-white opacity-70"></div>
      <div className="absolute top-[55%] left-[55%] h-1/32 w-1/32 rounded-full bg-white opacity-70"></div>
      <div className="absolute top-[45%] left-[55%] h-1/32 w-1/32 rounded-full bg-white opacity-70"></div>
      <div className="absolute top-[55%] left-[45%] h-1/32 w-1/32 rounded-full bg-white opacity-70"></div>

      {/* Stingray eyes */}
      <div className="absolute top-[48%] left-[35%] h-1/32 w-1/32 rounded-full bg-black"></div>
      <div className="absolute top-[52%] left-[35%] h-1/32 w-1/32 rounded-full bg-black"></div>
    </div>
  )
}
