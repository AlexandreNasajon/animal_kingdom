export function EarthquakeArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="earthquakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#earthquakeGradient)" />

      {/* Cracked earth */}
      <path d="M10,50 L30,60 L50,40 L70,60 L90,50" fill="none" stroke="#8B4513" strokeWidth="3" />
      <path d="M10,60 L30,70 L50,50 L70,70 L90,60" fill="none" stroke="#8B4513" strokeWidth="3" />
      <path d="M10,70 L30,80 L50,60 L70,80 L90,70" fill="none" stroke="#8B4513" strokeWidth="3" />

      {/* Fault lines */}
      <path d="M30,40 L30,80" fill="none" stroke="#8B4513" strokeWidth="2" />
      <path d="M50,30 L50,80" fill="none" stroke="#8B4513" strokeWidth="2" />
      <path d="M70,40 L70,80" fill="none" stroke="#8B4513" strokeWidth="2" />

      {/* Shaking buildings */}
      <rect x="20" y="20" width="10" height="20" fill="#A9A9A9" opacity="0.8" transform="rotate(5)" />
      <rect x="40" y="15" width="10" height="25" fill="#A9A9A9" opacity="0.8" transform="rotate(-3)" />
      <rect x="60" y="20" width="10" height="20" fill="#A9A9A9" opacity="0.8" transform="rotate(7)" />
      <rect x="80" y="25" width="10" height="15" fill="#A9A9A9" opacity="0.8" transform="rotate(-5)" />

      {/* Shaking effect */}
      <path d="M15,30 L25,25" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      <path d="M35,25 L45,20" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      <path d="M55,30 L65,25" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      <path d="M75,25 L85,30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}
