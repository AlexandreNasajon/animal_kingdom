export function StormArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="stormGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#483D8B" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#stormGradient)" />

      {/* Dark clouds */}
      <path d="M0,30 Q10,20 20,30 T40,30 T60,30 T80,30 T100,30 V0 H0 Z" fill="#2F4F4F" opacity="0.7" />
      <path d="M0,40 Q15,30 30,40 T60,40 T90,40 T100,40 V10 H0 Z" fill="#2F4F4F" opacity="0.5" />

      {/* Lightning bolts */}
      <path d="M30,30 L40,50 L35,50 L45,70" fill="none" stroke="#FFD700" strokeWidth="2" />
      <path d="M60,25 L55,45 L60,45 L50,65" fill="none" stroke="#FFD700" strokeWidth="2" />
      <path d="M75,35 L70,55 L75,55 L65,75" fill="none" stroke="#FFD700" strokeWidth="2" />

      {/* Rain */}
      <line x1="20" y1="40" x2="15" y2="50" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />
      <line x1="25" y1="45" x2="20" y2="55" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />
      <line x1="40" y1="40" x2="35" y2="50" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />
      <line x1="45" y1="45" x2="40" y2="55" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />
      <line x1="65" y1="40" x2="60" y2="50" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />
      <line x1="70" y1="45" x2="65" y2="55" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />
      <line x1="85" y1="40" x2="80" y2="50" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />
      <line x1="90" y1="45" x2="85" y2="55" stroke="#87CEEB" strokeWidth="1" opacity="0.7" />

      {/* Wind */}
      <path d="M10,60 Q20,55 30,60 T50,60" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      <path d="M50,70 Q60,65 70,70 T90,70" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      <path d="M30,80 Q40,75 50,80 T70,80" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}
