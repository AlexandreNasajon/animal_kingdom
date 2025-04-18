"use client"

export function TunaArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-700/30 to-blue-900/50" />

      {/* Water */}
      <div className="absolute inset-0 bg-blue-800/30" />

      {/* Tuna Body */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-8 rounded-full bg-silver-400">
        {/* Tuna Stripes */}
        <div className="absolute top-2 left-3 w-8 h-0.5 bg-blue-900" />
        <div className="absolute top-3 left-3 w-8 h-0.5 bg-blue-900" />
        <div className="absolute top-4 left-3 w-8 h-0.5 bg-blue-900" />
        <div className="absolute top-5 left-3 w-8 h-0.5 bg-blue-900" />

        {/* Eye */}
        <div className="absolute top-3 left-2 w-1.5 h-1.5 rounded-full bg-white">
          <div className="absolute top-0.25 left-0.25 w-1 h-1 rounded-full bg-black" />
        </div>

        {/* Tail */}
        <div className="absolute top-1 right-0 w-4 h-6 bg-silver-400 clip-path-triangle" />

        {/* Fins */}
        <div className="absolute top-0 left-1/2 w-4 h-2 bg-silver-400 transform -translate-x-1/2 rotate-[-10deg]" />
        <div className="absolute bottom-0 left-1/2 w-4 h-2 bg-silver-400 transform -translate-x-1/2 rotate-[10deg]" />
      </div>

      {/* Bubbles */}
      <div className="absolute top-2 right-4 w-1 h-1 rounded-full bg-white/70" />
      <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-white/70" />
      <div className="absolute top-6 right-3 w-1 h-1 rounded-full bg-white/70" />
    </div>
  )
}
