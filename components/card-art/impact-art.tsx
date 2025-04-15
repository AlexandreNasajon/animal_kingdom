export function ImpactArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="impactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#impactGradient)" />

      {/* Impact burst */}
      <path d="M50,20 L55,40 L75,40 L60,55 L65,75 L50,65 L35,75 L40,55 L25,40 L45,40 Z" fill="#ffffff" opacity="0.8" />

      {/* Energy waves */}
      <circle cx="50" cy="50" r="30" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.3" />
      <circle cx="50" cy="50" r="20" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5" />
      <circle cx="50" cy="50" r="10" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.7" />
    </svg>
  )
}
