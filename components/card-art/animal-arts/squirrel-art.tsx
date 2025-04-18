"use client"

export function SquirrelArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-700/30 to-amber-900/50" />

      {/* Tree */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-brown-800" />
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 h-12 rounded-full bg-green-800" />

      {/* Squirrel Body */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-10 rounded-full bg-amber-600" />

      {/* Squirrel Head */}
      <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-amber-700">
        {/* Eyes */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-black" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-black" />

        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-full bg-pink-900" />
      </div>

      {/* Tail */}
      <div className="absolute bottom-14 right-2 w-6 h-12 rounded-full bg-amber-600 transform rotate-45" />

      {/* Acorn */}
      <div className="absolute bottom-6 left-4 w-3 h-4 rounded-b-full bg-amber-800" />
      <div className="absolute bottom-10 left-4 w-3 h-2 rounded-t-full bg-amber-900" />
    </div>
  )
}
