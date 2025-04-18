import { WatercolorBackground } from "../watercolor-utils"

export function DeerArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#8B4513" />

      {/* Forest background */}
      <div className="absolute bottom-0 left-0 h-1/4 w-full bg-green-800"></div>

      {/* Deer body */}
      <div className="absolute bottom-1/4 left-1/2 h-1/3 w-1/2 -translate-x-1/2 rounded-t-lg bg-amber-300"></div>

      {/* Deer head */}
      <div className="absolute bottom-[55%] left-[40%] h-1/5 w-1/5 -translate-x-1/2 rounded-lg bg-amber-300 transform -rotate-12"></div>

      {/* Deer legs */}
      <div className="absolute bottom-0 left-[40%] h-1/4 w-1/20 -translate-x-1/2 bg-amber-400"></div>
      <div className="absolute bottom-0 left-[45%] h-1/4 w-1/20 -translate-x-1/2 bg-amber-400"></div>
      <div className="absolute bottom-0 left-[55%] h-1/4 w-1/20 -translate-x-1/2 bg-amber-400"></div>
      <div className="absolute bottom-0 left-[60%] h-1/4 w-1/20 -translate-x-1/2 bg-amber-400"></div>

      {/* Deer antlers */}
      <div className="absolute bottom-[65%] left-[38%] h-1/6 w-1/20 -translate-x-1/2 bg-amber-700 transform -rotate-30"></div>
      <div className="absolute bottom-[65%] left-[42%] h-1/6 w-1/20 -translate-x-1/2 bg-amber-700 transform rotate-30"></div>

      {/* Deer spots */}
      <div className="absolute bottom-[35%] left-[40%] h-1/16 w-1/16 -translate-x-1/2 rounded-full bg-white"></div>
      <div className="absolute bottom-[40%] left-[50%] h-1/16 w-1/16 -translate-x-1/2 rounded-full bg-white"></div>
      <div className="absolute bottom-[30%] left-[60%] h-1/16 w-1/16 -translate-x-1/2 rounded-full bg-white"></div>
    </div>
  )
}
