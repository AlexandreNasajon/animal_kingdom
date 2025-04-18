import { WatercolorBackground } from "../watercolor-utils"

export function WolfArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#2C3E50" />

      {/* Night sky */}
      <div className="absolute top-0 left-0 h-3/4 w-full bg-gradient-to-b from-indigo-900 to-blue-900"></div>

      {/* Moon */}
      <div className="absolute top-1/6 right-1/6 h-1/6 w-1/6 rounded-full bg-yellow-100"></div>

      {/* Wolf body */}
      <div className="absolute bottom-1/6 left-1/2 h-1/3 w-2/5 -translate-x-1/2 rounded-lg bg-gray-700"></div>

      {/* Wolf head */}
      <div className="absolute bottom-[45%] left-[40%] h-1/5 w-1/5 -translate-x-1/2 rounded-lg bg-gray-700"></div>

      {/* Wolf ears */}
      <div className="absolute bottom-[55%] left-[38%] h-1/12 w-1/16 -translate-x-1/2 rounded-sm bg-gray-700 transform -rotate-12"></div>
      <div className="absolute bottom-[55%] left-[42%] h-1/12 w-1/16 -translate-x-1/2 rounded-sm bg-gray-700 transform rotate-12"></div>

      {/* Wolf tail */}
      <div className="absolute bottom-1/4 left-[65%] h-1/6 w-1/5 -translate-x-1/2 rounded-lg bg-gray-700 transform rotate-30"></div>

      {/* Wolf howling */}
      <div className="absolute bottom-[60%] left-[40%] h-1/12 w-1/24 -translate-x-1/2 rounded-full bg-white opacity-70"></div>
      <div className="absolute bottom-[65%] left-[40%] h-1/12 w-1/20 -translate-x-1/2 rounded-full bg-white opacity-50"></div>
      <div className="absolute bottom-[70%] left-[40%] h-1/12 w-1/16 -translate-x-1/2 rounded-full bg-white opacity-30"></div>
    </div>
  )
}
