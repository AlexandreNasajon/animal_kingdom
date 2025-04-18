"use client"

export function StingrayArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-700/30 to-blue-900/50" />

      {/* Deep Water */}
      <div className="absolute inset-0 bg-blue-800/30" />

      {/* Sand Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-200/50" />

      {/* Stingray Body */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-gray-400 rounded-full">
        {/* Wing-like Fins */}
        <div className="absolute top-0 left-0 w-16 h-8 bg-gray-400 rounded-full transform scale-x-[1.5]" />

        {/* Spots */}
        <div className="absolute top-2 left-4 w-1 h-1 rounded-full bg-gray-600" />
        <div className="absolute top-3 left-7 w-1.5 h-1.5 rounded-full bg-gray-600" />
        <div className="absolute top-5 left-5 w-1 h-1 rounded-full bg-gray-600" />
        <div className="absolute top-4 left-10 w-1 h-1 rounded-full bg-gray-600" />

        {/* Tail */}
        <div className="absolute top-4 right-0 w-8 h-1 bg-gray-500 rounded-r-full" />
        <div className="absolute top-4 right-0 w-6 h-0.5 bg-gray-600 rounded-r-full" />

        {/* Eyes */}
        <div className="absolute top-3 left-3 w-1 h-1 rounded-full bg-black" />
        <div className="absolute top-5 left-3 w-1 h-1 rounded-full bg-black" />
      </div>

      {/* Bubbles */}
      <div className="absolute top-2 right-4 w-1 h-1 rounded-full bg-white/70" />
      <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-white/70" />
    </div>
  )
}
