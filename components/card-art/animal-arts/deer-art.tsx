"use client"

export function DeerArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-green-700/30 to-green-900/50" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-green-800" />

      {/* Deer Body */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-14 h-8 rounded-full bg-amber-400" />

      {/* Deer Neck */}
      <div className="absolute bottom-8 left-[40%] w-3 h-8 bg-amber-400 transform rotate-[30deg]" />

      {/* Deer Head */}
      <div className="absolute bottom-14 left-[35%] w-5 h-4 rounded-full bg-amber-500">
        {/* Eye */}
        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black" />

        {/* Ear */}
        <div className="absolute -top-2 right-1 w-2 h-3 rounded-t-full bg-amber-400" />

        {/* Muzzle */}
        <div className="absolute top-2 left-0 w-3 h-2 rounded-full bg-amber-600" />
      </div>

      {/* Antlers */}
      <div className="absolute bottom-16 left-[35%] w-1 h-4 bg-amber-800 transform rotate-[-20deg]" />
      <div className="absolute bottom-18 left-[34%] w-3 h-1 bg-amber-800 transform rotate-[-20deg]" />
      <div className="absolute bottom-16 left-[37%] w-1 h-4 bg-amber-800 transform rotate-[20deg]" />
      <div className="absolute bottom-18 left-[37%] w-3 h-1 bg-amber-800 transform rotate-[20deg]" />

      {/* Legs */}
      <div className="absolute bottom-0 left-[40%] w-1 h-5 bg-amber-500" />
      <div className="absolute bottom-0 left-[45%] w-1 h-4 bg-amber-500" />
      <div className="absolute bottom-0 left-[55%] w-1 h-5 bg-amber-500" />
      <div className="absolute bottom-0 left-[60%] w-1 h-4 bg-amber-500" />
    </div>
  )
}
