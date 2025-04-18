"use client"

export function TurtleArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-700/30 to-teal-900/50" />

      {/* Water */}
      <div className="absolute inset-0 bg-blue-800/30" />

      {/* Sand Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-200/50" />

      {/* Turtle Shell */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-10 rounded-full bg-green-800">
        {/* Shell Pattern */}
        <div className="absolute inset-1 rounded-full bg-green-700" />
        <div className="absolute inset-2 rounded-full border-2 border-green-900" />
        <div className="absolute top-3 left-3 w-6 h-4 grid grid-cols-3 grid-rows-2 gap-0.5">
          <div className="bg-green-900 rounded-sm"></div>
          <div className="bg-green-900 rounded-sm"></div>
          <div className="bg-green-900 rounded-sm"></div>
          <div className="bg-green-900 rounded-sm"></div>
          <div className="bg-green-900 rounded-sm"></div>
          <div className="bg-green-900 rounded-sm"></div>
        </div>
      </div>

      {/* Turtle Head */}
      <div className="absolute top-[40%] left-[30%] w-4 h-3 rounded-full bg-green-600">
        {/* Eye */}
        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black" />
      </div>

      {/* Flippers */}
      <div className="absolute top-[40%] left-[70%] w-4 h-2 bg-green-600 rounded-r-full transform rotate-[-20deg]" />
      <div className="absolute top-[60%] left-[70%] w-4 h-2 bg-green-600 rounded-r-full transform rotate-[20deg]" />
      <div className="absolute top-[40%] left-[20%] w-4 h-2 bg-green-600 rounded-l-full transform rotate-[20deg]" />
      <div className="absolute top-[60%] left-[20%] w-4 h-2 bg-green-600 rounded-l-full transform rotate-[-20deg]" />

      {/* Bubbles */}
      <div className="absolute top-2 right-3 w-1 h-1 rounded-full bg-white/70" />
      <div className="absolute top-4 right-5 w-1.5 h-1.5 rounded-full bg-white/70" />
    </div>
  )
}
