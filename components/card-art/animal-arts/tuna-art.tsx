import { WatercolorBackground } from "../watercolor-utils"

export function TunaArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#0077BE" />

      {/* Ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-900 opacity-50"></div>

      {/* Tuna body */}
      <div className="absolute top-1/2 left-1/2 h-1/4 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300"></div>

      {/* Tuna tail */}
      <div className="absolute top-1/2 left-[75%] h-1/6 w-1/6 -translate-x-1/2 -translate-y-1/2 bg-blue-300">
        <div className="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 transform origin-left rotate-45 bg-blue-300"></div>
        <div className="absolute bottom-0 left-1/2 h-full w-full -translate-x-1/2 transform origin-left -rotate-45 bg-blue-300"></div>
      </div>

      {/* Tuna fins */}
      <div className="absolute top-[40%] left-[40%] h-1/12 w-1/12 -translate-x-1/2 transform -rotate-30 bg-blue-300"></div>
      <div className="absolute top-[60%] left-[40%] h-1/12 w-1/12 -translate-x-1/2 transform rotate-30 bg-blue-300"></div>

      {/* Tuna eye */}
      <div className="absolute top-1/2 left-[35%] h-1/16 w-1/16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
      <div className="absolute top-1/2 left-[35%] h-1/32 w-1/32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"></div>

      {/* Tuna stripes */}
      <div className="absolute top-[45%] left-1/2 h-1/24 w-1/3 -translate-x-1/2 bg-blue-400"></div>
      <div className="absolute top-[55%] left-1/2 h-1/24 w-1/3 -translate-x-1/2 bg-blue-400"></div>
    </div>
  )
}
