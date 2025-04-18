"use client"

export function SeahorseArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-700/30 to-teal-900/50" />

      {/* Water */}
      <div className="absolute inset-0 bg-teal-800/30" />

      {/* Coral */}
      <div className="absolute bottom-0 left-2 w-4 h-6 bg-pink-600 rounded-t-lg" />
      <div className="absolute bottom-0 left-6 w-3 h-4 bg-pink-500 rounded-t-lg" />
      <div className="absolute bottom-0 right-3 w-5 h-8 bg-orange-400 rounded-t-lg" />

      {/* Seahorse Body */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-10 rounded-full bg-yellow-400">
        {/* Seahorse Curve */}
        <div className="absolute top-0 left-0 w-6 h-6 border-4 border-yellow-400 border-r-0 border-b-0 rounded-tl-full" />

        {/* Head */}
        <div className="absolute -top-2 -left-1 w-4 h-4 rounded-full bg-yellow-500 transform rotate-[-30deg]">
          {/* Eye */}
          <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black" />

          {/* Snout */}
          <div className="absolute top-2 left-0 w-3 h-1.5 bg-yellow-600 rounded-l-lg" />
        </div>

        {/* Fin */}
        <div className="absolute top-3 right-0 w-2 h-1.5 bg-yellow-300 rounded-r-full" />

        {/* Tail Curl */}
        <div className="absolute bottom-0 left-0 w-4 h-4 border-4 border-yellow-400 border-t-0 border-l-0 rounded-br-full" />
      </div>

      {/* Bubbles */}
      <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-white/70" />
      <div className="absolute top-6 right-5 w-1.5 h-1.5 rounded-full bg-white/70" />
    </div>
  )
}
