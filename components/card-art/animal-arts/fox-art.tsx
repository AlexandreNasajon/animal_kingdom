"use client"

export function FoxArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-600/30 to-orange-900/50" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-900" />

      {/* Fox Body */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded-full bg-orange-600" />

      {/* Fox Head */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-orange-700">
        {/* Ears */}
        <div className="absolute -top-3 -left-1 w-3 h-4 rounded-t-full bg-orange-700 transform rotate-[-10deg]" />
        <div className="absolute -top-3 -right-1 w-3 h-4 rounded-t-full bg-orange-700 transform rotate-[10deg]" />

        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 rounded-full bg-black" />
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 rounded-full bg-black" />

        {/* Snout */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full bg-white" />
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-full bg-black" />
      </div>

      {/* Tail */}
      <div className="absolute bottom-6 right-1 w-8 h-4 rounded-full bg-orange-600 transform rotate-[-20deg]">
        <div className="absolute right-0 top-0 w-2 h-4 rounded-full bg-white" />
      </div>
    </div>
  )
}
