"use client"

export function HunterArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="hunterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#hunterGradient)" />

      {/* Forest background */}
      <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#006400" opacity="0.3" />

      {/* Trees */}
      <path d="M10,70 L15,40 L20,70 Z" fill="#006400" opacity="0.7" />
      <path d="M80,70 L85,35 L90,70 Z" fill="#006400" opacity="0.7" />

      {/* Hunter silhouette */}
      <path d="M40,60 L45,40 L55,40 L60,60 Z" fill="#000000" opacity="0.8" />
      <circle cx="50" cy="35" r="5" fill="#000000" opacity="0.8" />

      {/* Bow and arrow */}
      <path d="M35,50 Q50,40 65,50" fill="none" stroke="#ffffff" strokeWidth="2" />
      <line x1="50" y1="40" x2="70" y2="30" stroke="#ffffff" strokeWidth="1" />

      {/* Target animal */}
      <circle cx="75" cy="40" r="5" fill="#ffffff" opacity="0.6" />
      <circle cx="75" cy="40" r="3" fill="#ff0000" opacity="0.6" />
      <circle cx="75" cy="40" r="1" fill="#ffffff" opacity="0.6" />
    </svg>
  )
}
