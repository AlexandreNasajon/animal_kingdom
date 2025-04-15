export function CompeteArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="competeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#competeGradient)" />

      {/* Trophy */}
      <path d="M45,30 L55,30 L55,40 Q50,45 45,40 Z" fill="#FFD700" opacity="0.8" />
      <rect x="48" y="40" width="4" height="10" fill="#FFD700" opacity="0.8" />
      <path d="M40,50 L60,50 L55,55 L45,55 Z" fill="#FFD700" opacity="0.8" />

      {/* Competing animals */}
      <path d="M30,60 C25,55 25,50 30,45 L40,45 C45,50 45,55 40,60 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="32" cy="50" r="2" fill="#000000" opacity="0.6" />
      <path d="M35,60 L30,65" fill="none" stroke="#A0522D" strokeWidth="2" opacity="0.6" />

      <path d="M70,60 C65,55 65,50 70,45 L80,45 C85,50 85,55 80,60 Z" fill="#4682B4" opacity="0.6" />
      <circle cx="72" cy="50" r="2" fill="#000000" opacity="0.6" />
      <path d="M75,60 L80,65" fill="none" stroke="#4682B4" strokeWidth="2" opacity="0.6" />

      {/* VS text */}
      <text x="47" y="70" fontSize="15" fill="#ffffff" fontWeight="bold">
        VS
      </text>

      {/* Competition symbols */}
      <path d="M25,30 L35,40" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <path d="M25,40 L35,30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <path d="M65,30 L75,40" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <path d="M65,40 L75,30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}
