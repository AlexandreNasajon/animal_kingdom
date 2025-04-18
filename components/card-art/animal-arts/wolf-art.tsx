"use client"

export function WolfArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-700/30 to-gray-900/50" />

      {/* Night Sky */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-indigo-900">
        {/* Moon */}
        <div className="absolute top-2 right-4 w-4 h-4 rounded-full bg-yellow-100" />
        {/* Stars */}
        <div className="absolute top-1 left-2 w-0.5 h-0.5 rounded-full bg-white" />
        <div className="absolute top-3 left-6 w-0.5 h-0.5 rounded-full bg-white" />
        <div className="absolute top-5 left-4 w-0.5 h-0.5 rounded-full bg-white" />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-800" />

      {/* Wolf Body */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded-full bg-gray-600" />

      {/* Wolf Head */}
      <div className="absolute bottom-10 left-[40%] w-8 h-6 rounded-full bg-gray-700">
        {/* Ears */}
        <div className="absolute -top-2 left-1 w-2 h-3 rounded-t-full bg-gray-700 transform rotate-[-10deg]" />
        <div className="absolute -top-2 right-1 w-2 h-3 rounded-t-full bg-gray-700 transform rotate-[10deg]" />

        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1 h-1 rounded-full bg-yellow-500" />
        <div className="absolute top-2 right-1.5 w-1 h-1 rounded-full bg-yellow-500" />

        {/* Snout */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full bg-gray-800" />
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-full bg-black" />
      </div>

      {/* Tail */}
      <div className="absolute bottom-6 right-2 w-6 h-3 rounded-full bg-gray-600 transform rotate-[-20deg]" />

      {/* Howling Pose */}
      <div className="absolute bottom-12 left-[42%] w-1 h-3 bg-gray-700 transform rotate-[-10deg]" />
    </div>
  )
}
