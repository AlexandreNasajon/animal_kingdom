"use client"

export function ZebraArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/30 to-yellow-800/50" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-900" />

      {/* Zebra Body */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-14 h-10 rounded-full bg-white" />

      {/* Zebra Stripes on Body */}
      <div className="absolute bottom-3 left-[40%] w-1.5 h-10 bg-black" />
      <div className="absolute bottom-3 left-[50%] w-1.5 h-10 bg-black" />
      <div className="absolute bottom-3 left-[60%] w-1.5 h-10 bg-black" />

      {/* Zebra Neck */}
      <div className="absolute bottom-10 left-[35%] w-4 h-10 bg-white transform rotate-[30deg]" />

      {/* Zebra Stripes on Neck */}
      <div className="absolute bottom-10 left-[36%] w-0.75 h-10 bg-black transform rotate-[30deg]" />
      <div className="absolute bottom-10 left-[38%] w-0.75 h-10 bg-black transform rotate-[30deg]" />

      {/* Zebra Head */}
      <div className="absolute bottom-18 left-[30%] w-6 h-4 bg-white transform rotate-[10deg]">
        {/* Ears */}
        <div className="absolute -top-2 left-0 w-2 h-2.5 rounded-t-full bg-white" />
        <div className="absolute -top-2 left-3 w-2 h-2.5 rounded-t-full bg-white" />

        {/* Eye */}
        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-black" />

        {/* Muzzle */}
        <div className="absolute top-1 left-3 w-4 h-2 rounded-full bg-white transform rotate-[10deg]" />
      </div>

      {/* Legs */}
      <div className="absolute bottom-0 left-[40%] w-1.5 h-5 bg-white" />
      <div className="absolute bottom-0 left-[45%] w-1.5 h-4 bg-white" />
      <div className="absolute bottom-0 left-[55%] w-1.5 h-5 bg-white" />
      <div className="absolute bottom-0 left-[60%] w-1.5 h-4 bg-white" />
    </div>
  )
}
