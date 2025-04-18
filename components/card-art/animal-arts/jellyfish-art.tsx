"use client"

export function JellyfishArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-700/30 to-purple-900/50" />

      {/* Deep Water */}
      <div className="absolute inset-0 bg-blue-900/40" />

      {/* Jellyfish Body */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-10 h-6 rounded-t-full bg-purple-400/80">
        {/* Inner Glow */}
        <div className="absolute inset-1 rounded-t-full bg-purple-300/50" />

        {/* Tentacles */}
        <div className="absolute bottom-0 left-1 w-0.5 h-8 bg-purple-300/80 animate-pulse" />
        <div className="absolute bottom-0 left-3 w-0.5 h-10 bg-purple-300/80 animate-pulse" />
        <div className="absolute bottom-0 left-5 w-0.5 h-9 bg-purple-300/80 animate-pulse" />
        <div className="absolute bottom-0 left-7 w-0.5 h-11 bg-purple-300/80 animate-pulse" />
        <div className="absolute bottom-0 left-9 w-0.5 h-7 bg-purple-300/80 animate-pulse" />
      </div>

      {/* Bioluminescent Glow */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded-full bg-purple-400/20 animate-pulse" />

      {/* Bubbles */}
      <div className="absolute top-2 left-3 w-1 h-1 rounded-full bg-white/50" />
      <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-white/50" />
      <div className="absolute top-3 right-4 w-1 h-1 rounded-full bg-white/50" />
    </div>
  )
}
