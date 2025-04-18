import { WatercolorBackground } from "../watercolor-utils"

export function SquirrelArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#8B4513" />

      {/* Tree trunk */}
      <div className="absolute bottom-0 left-1/2 h-3/4 w-1/6 -translate-x-1/2 rounded-t-lg bg-amber-800"></div>

      {/* Squirrel body */}
      <div className="absolute bottom-1/3 left-1/2 h-1/4 w-1/4 -translate-x-1/2 rounded-full bg-orange-400"></div>

      {/* Squirrel head */}
      <div className="absolute bottom-[45%] left-1/2 h-1/6 w-1/6 -translate-x-1/2 rounded-full bg-orange-400"></div>

      {/* Squirrel ears */}
      <div className="absolute bottom-[52%] left-[46%] h-1/8 w-1/12 -translate-x-1/2 rounded-full bg-orange-400"></div>
      <div className="absolute bottom-[52%] left-[54%] h-1/8 w-1/12 -translate-x-1/2 rounded-full bg-orange-400"></div>

      {/* Squirrel tail */}
      <div className="absolute bottom-1/3 left-[60%] h-1/4 w-1/4 -translate-x-1/2 rounded-full bg-orange-400 transform rotate-45"></div>

      {/* Acorn */}
      <div className="absolute bottom-1/4 left-[40%] h-1/12 w-1/12 -translate-x-1/2 rounded-b-full bg-amber-700"></div>
      <div className="absolute bottom-[29%] left-[40%] h-1/24 w-1/12 -translate-x-1/2 rounded-t-full bg-amber-900"></div>
    </div>
  )
}
