import { WatercolorBackground } from "../watercolor-utils"

export function ZebraArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <WatercolorBackground baseColor="#D4D4D8" />

      {/* Savanna background */}
      <div className="absolute bottom-0 left-0 h-1/4 w-full bg-amber-300"></div>

      {/* Zebra body */}
      <div className="absolute bottom-1/4 left-1/2 h-1/3 w-1/2 -translate-x-1/2 rounded-t-lg bg-white"></div>

      {/* Zebra head */}
      <div className="absolute bottom-[55%] left-[40%] h-1/4 w-1/4 -translate-x-1/2 rounded-lg bg-white transform -rotate-12"></div>

      {/* Zebra legs */}
      <div className="absolute bottom-0 left-[40%] h-1/4 w-1/16 -translate-x-1/2 bg-white"></div>
      <div className="absolute bottom-0 left-[45%] h-1/4 w-1/16 -translate-x-1/2 bg-white"></div>
      <div className="absolute bottom-0 left-[55%] h-1/4 w-1/16 -translate-x-1/2 bg-white"></div>
      <div className="absolute bottom-0 left-[60%] h-1/4 w-1/16 -translate-x-1/2 bg-white"></div>

      {/* Zebra stripes - body */}
      <div className="absolute bottom-[30%] left-[40%] h-1/16 w-1/2 -translate-x-1/2 bg-black"></div>
      <div className="absolute bottom-[35%] left-[40%] h-1/16 w-1/2 -translate-x-1/2 bg-black"></div>
      <div className="absolute bottom-[40%] left-[40%] h-1/16 w-1/2 -translate-x-1/2 bg-black"></div>

      {/* Zebra stripes - head */}
      <div className="absolute bottom-[60%] left-[40%] h-1/24 w-1/4 -translate-x-1/2 bg-black"></div>
      <div className="absolute bottom-[65%] left-[40%] h-1/24 w-1/4 -translate-x-1/2 bg-black"></div>

      {/* Zebra mane */}
      <div className="absolute bottom-[70%] left-[40%] h-1/12 w-1/8 -translate-x-1/2 bg-black"></div>
    </div>
  )
}
