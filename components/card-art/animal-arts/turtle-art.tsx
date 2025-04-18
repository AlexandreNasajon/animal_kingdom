import { WatercolorBackground } from "../watercolor-utils"

export function TurtleArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#20B2AA" />

      {/* Ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-700 opacity-50"></div>

      {/* Ocean floor */}
      <div className="absolute bottom-0 left-0 h-1/6 w-full bg-amber-200 opacity-70"></div>

      {/* Turtle shell */}
      <div className="absolute top-1/2 left-1/2 h-1/3 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-700"></div>

      {/* Shell pattern */}
      <div className="absolute top-1/2 left-1/2 h-1/4 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600"></div>
      <div className="absolute top-[40%] left-1/2 h-1/16 w-1/16 -translate-x-1/2 rounded-full bg-green-800"></div>
      <div className="absolute top-[50%] left-[40%] h-1/16 w-1/16 -translate-x-1/2 rounded-full bg-green-800"></div>
      <div className="absolute top-[50%] left-[60%] h-1/16 w-1/16 -translate-x-1/2 rounded-full bg-green-800"></div>
      <div className="absolute top-[60%] left-1/2 h-1/16 w-1/16 -translate-x-1/2 rounded-full bg-green-800"></div>

      {/* Turtle head */}
      <div className="absolute top-1/2 left-[30%] h-1/8 w-1/8 -translate-y-1/2 rounded-full bg-green-500"></div>

      {/* Turtle flippers */}
      <div className="absolute top-[40%] left-[65%] h-1/12 w-1/6 rounded-full bg-green-500 transform rotate-45"></div>
      <div className="absolute top-[60%] left-[65%] h-1/12 w-1/6 rounded-full bg-green-500 transform -rotate-45"></div>
      <div className="absolute top-[40%] left-[35%] h-1/12 w-1/6 rounded-full bg-green-500 transform -rotate-45"></div>
      <div className="absolute top-[60%] left-[35%] h-1/12 w-1/6 rounded-full bg-green-500 transform rotate-45"></div>

      {/* Turtle eye */}
      <div className="absolute top-1/2 left-[28%] h-1/32 w-1/32 -translate-y-1/2 rounded-full bg-black"></div>
    </div>
  )
}
