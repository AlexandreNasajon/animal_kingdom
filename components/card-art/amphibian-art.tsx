"use client"

export function AmphibianArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="amphibianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006400" />
          <stop offset="100%" stopColor="#228B22" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#amphibianGradient)" />

      {/* Water and land division */}
      <path d="M0,50 L100,50 L100,100 L0,100 Z" fill="#104e8b" opacity="0.3" />

      {/* Lily pads */}
      <circle cx="30" cy="60" r="10" fill="#3CB371" opacity="0.8" />
      <circle cx="70" cy="70" r="15" fill="#3CB371" opacity="0.8" />

      {/* Frog silhouette */}
      <ellipse cx="50" cy="40" rx="15" ry="10" fill="#ffffff" opacity="0.8" />
      <circle cx="40" cy="35" r="3" fill="#000000" />
      <circle cx="60" cy="35" r="3" fill="#000000" />
      <path d="M35,50 Q50,60 65,50" stroke="#000000" strokeWidth="2" fill="none" />
    </svg>
  )
}
