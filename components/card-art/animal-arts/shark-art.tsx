"use client"

export function SharkArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-blue-950/50" />

      {/* Deep Water */}
      <div className="absolute inset-0 bg-blue-900/40" />

      {/* Shark Body */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-gray-500 rounded-full">
        {/* Shark Head */}
        <div className="absolute top-0 left-0 w-8 h-6 bg-gray-500 rounded-l-full">
          {/* Eye */}
          <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-black" />

          {/* Mouth */}
          <div className="absolute bottom-1 left-1 w-6 h-0.5 bg-white rounded-l-full" />
        </div>

        {/* Dorsal Fin */}
        <div className="absolute -top-3 left-6 w-4 h-4 bg-gray-500 clip-path-triangle" />

        {/* Tail */}
        <div className="absolute top-0 right-0 w-4 h-6 bg-gray-500">
          <div className="absolute top-0 right-0 w-3 h-3 bg-gray-500 clip-path-triangle transform rotate-[-45deg]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 clip-path-triangle transform rotate-[45deg]" />
        </div>

        {/* Pectoral Fin */}
        <div className="absolute bottom-0 left-6 w-3 h-2 bg-gray-500 rounded-b-full transform rotate-[-10deg]" />
      </div>

      {/* Bubbles */}
      <div className="absolute top-3 left-4 w-1 h-1 rounded-full bg-white/70" />
      <div className="absolute top-5 left-6 w-1.5 h-1.5 rounded-full bg-white/70" />
    </div>
  )
}
