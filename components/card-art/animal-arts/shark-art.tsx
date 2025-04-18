import { WatercolorBackground } from "../watercolor-utils"

export function SharkArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#00008B" />

      {/* Deep ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-700 to-blue-900 opacity-70"></div>

      {/* Light rays */}
      <div className="absolute top-0 left-1/4 h-full w-1/12 bg-blue-200 opacity-10 transform rotate-12"></div>
      <div className="absolute top-0 left-1/2 h-full w-1/12 bg-blue-200 opacity-10 transform -rotate-6"></div>
      <div className="absolute top-0 left-3/4 h-full w-1/12 bg-blue-200 opacity-10 transform rotate-6"></div>

      {/* Shark body */}
      <div className="absolute top-1/2 left-1/2 h-1/5 w-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-500 rounded-full transform scale-x-150"></div>

      {/* Shark head */}
      <div className="absolute top-1/2 left-[30%] h-1/6 w-1/6 -translate-y-1/2 bg-gray-500 rounded-l-lg"></div>

      {/* Shark tail */}
      <div className="absolute top-1/2 left-[75%] h-1/6 w-1/6 -translate-y-1/2 bg-gray-500">
        <div className="absolute top-0 right-0 h-1/2 w-full bg-gray-500 transform origin-right -rotate-30"></div>
        <div className="absolute bottom-0 right-0 h-1/2 w-full bg-gray-500 transform origin-right rotate-30"></div>
      </div>

      {/* Shark dorsal fin */}
      <div className="absolute top-[35%] left-1/2 h-1/6 w-1/12 -translate-x-1/2 bg-gray-500 transform origin-bottom -rotate-12"></div>

      {/* Shark pectoral fins */}
      <div className="absolute top-[55%] left-[40%] h-1/12 w-1/6 -translate-y-1/2 bg-gray-500 transform origin-left rotate-30"></div>
      <div className="absolute top-[45%] left-[40%] h-1/12 w-1/6 -translate-y-1/2 bg-gray-500 transform origin-left -rotate-30"></div>

      {/* Shark eye */}
      <div className="absolute top-1/2 left-[32%] h-1/32 w-1/32 -translate-y-1/2 rounded-full bg-black"></div>

      {/* Shark mouth */}
      <div className="absolute top-[53%] left-[28%] h-1/48 w-1/12 -translate-y-1/2 bg-white rounded-l-sm"></div>
    </div>
  )
}
