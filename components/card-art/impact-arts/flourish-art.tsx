export function FlourishArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="flourishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#flourishGradient)" />

      {/* Growing plants */}
      <path d="M30,70 L30,50 C30,40 20,40 20,30" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M30,60 L40,50" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M30,50 L20,40" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M20,30 L25,25" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M20,30 L15,25" fill="none" stroke="#228B22" strokeWidth="2" />

      <path d="M50,70 L50,40 C50,30 60,30 60,20" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M50,55 L40,45" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M50,40 L60,30" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M60,20 L65,15" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M60,20 L55,15" fill="none" stroke="#228B22" strokeWidth="2" />

      <path d="M70,70 L70,60 C70,50 80,50 80,40" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M70,65 L60,55" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M70,60 L80,50" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M80,40 L85,35" fill="none" stroke="#228B22" strokeWidth="2" />
      <path d="M80,40 L75,35" fill="none" stroke="#228B22" strokeWidth="2" />

      {/* Flowers */}
      <circle cx="25" cy="25" r="3" fill="#FF69B4" opacity="0.8" />
      <circle cx="15" cy="25" r="3" fill="#FF69B4" opacity="0.8" />
      <circle cx="65" cy="15" r="3" fill="#FF69B4" opacity="0.8" />
      <circle cx="55" cy="15" r="3" fill="#FF69B4" opacity="0.8" />
      <circle cx="85" cy="35" r="3" fill="#FF69B4" opacity="0.8" />
      <circle cx="75" cy="35" r="3" fill="#FF69B4" opacity="0.8" />

      {/* Sun */}
      <circle cx="20" cy="15" r="5" fill="#FFD700" opacity="0.6" />
      <path d="M20,5 L20,10" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <path d="M20,20 L20,25" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <path d="M10,15 L15,15" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <path d="M25,15 L30,15" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <path d="M13,8 L17,12" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <path d="M23,18 L27,22" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <path d="M13,22 L17,18" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <path d="M23,12 L27,8" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}
