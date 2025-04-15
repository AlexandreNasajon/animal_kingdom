export function TerrestrialArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="terrestrialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#terrestrialGradient)" />

      {/* Ground */}
      <path d="M0,70 Q25,60 50,70 T100,70 L100,100 L0,100 Z" fill="#CD853F" opacity="0.6" />

      {/* Trees/Plants */}
      <path d="M20,70 L25,40 L30,70 Z" fill="#228B22" opacity="0.8" />
      <path d="M70,70 L75,30 L80,70 Z" fill="#228B22" opacity="0.8" />
      <path d="M45,70 L50,50 L55,70 Z" fill="#228B22" opacity="0.8" />

      {/* Animal silhouette (paw print) */}
      <circle cx="40" cy="40" r="5" fill="#ffffff" opacity="0.8" />
      <circle cx="50" cy="35" r="5" fill="#ffffff" opacity="0.8" />
      <circle cx="60" cy="40" r="5" fill="#ffffff" opacity="0.8" />
      <ellipse cx="50" cy="50" rx="8" ry="10" fill="#ffffff" opacity="0.8" />
    </svg>
  )
}
