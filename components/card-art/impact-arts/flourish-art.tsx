"use client"

export function FlourishArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="flourishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#flourishGradient)" />

      {/* Background - flourishing garden */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="#228B22" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z; 
                 M0,72 Q25,67 50,72 Q75,77 100,72 L100,100 L0,100 Z; 
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Growing plants */}
      <g>
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0.5; 1"
          dur="3s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="15,30; 0,0"
          dur="3s"
          repeatCount="indefinite"
          additive="sum"
        />
        <path d="M30,70 Q30,60 35,55 Q40,50 30,45" fill="none" stroke="#32CD32" strokeWidth="2" />
        <path d="M30,70 Q30,60 25,55 Q20,50 30,45" fill="none" stroke="#32CD32" strokeWidth="2" />
        <path d="M30,55 Q30,50 35,45 Q40,40 30,35" fill="none" stroke="#32CD32" strokeWidth="2" />
        <path d="M30,55 Q30,50 25,45 Q20,40 30,35" fill="none" stroke="#32CD32" strokeWidth="2" />
      </g>

      <g>
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0.5; 1"
          dur="3s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="35,30; 0,0"
          dur="3s"
          repeatCount="indefinite"
          additive="sum"
        />
        <path d="M70,70 Q70,60 75,55 Q80,50 70,45" fill="none" stroke="#32CD32" strokeWidth="2" />
        <path d="M70,70 Q70,60 65,55 Q60,50 70,45" fill="none" stroke="#32CD32" strokeWidth="2" />
        <path d="M70,55 Q70,50 75,45 Q80,40 70,35" fill="none" stroke="#32CD32" strokeWidth="2" />
        <path d="M70,55 Q70,50 65,45 Q60,40 70,35" fill="none" stroke="#32CD32" strokeWidth="2" />
      </g>

      {/* Flowers */}
      <g>
        <animate attributeName="opacity" values="0; 1" dur="3s" repeatCount="indefinite" />
        <circle cx="30" cy="35" r="5" fill="#FF69B4" />
        <circle cx="33" cy="32" r="5" fill="#FF69B4" />
        <circle cx="27" cy="32" r="5" fill="#FF69B4" />
        <circle cx="30" cy="29" r="5" fill="#FF69B4" />
        <circle cx="30" cy="32" r="3" fill="#FFFF00" />
      </g>

      <g>
        <animate attributeName="opacity" values="0; 1" dur="3s" repeatCount="indefinite" begin="0.5s" />
        <circle cx="70" cy="35" r="5" fill="#FF69B4" />
        <circle cx="73" cy="32" r="5" fill="#FF69B4" />
        <circle cx="67" cy="32" r="5" fill="#FF69B4" />
        <circle cx="70" cy="29" r="5" fill="#FF69B4" />
        <circle cx="70" cy="32" r="3" fill="#FFFF00" />
      </g>

      {/* Cards/hand */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-5; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <rect x="40" y="70" width="20" height="30" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="45" y="65" width="20" height="30" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="50" y="60" width="20" height="30" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="55" y="55" width="20" height="30" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="60" y="50" width="20" height="30" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="65" y="45" width="20" height="30" rx="2" fill="#ffffff" opacity="0.8" />
      </g>

      {/* Sparkles */}
      <g>
        <animate attributeName="opacity" values="0; 1; 0" dur="1.5s" repeatCount="indefinite" />
        <path d="M20,20 L25,25 M20,25 L25,20" stroke="#FFD700" strokeWidth="1" />
        <path d="M80,20 L85,25 M80,25 L85,20" stroke="#FFD700" strokeWidth="1" />
        <path d="M50,15 L55,20 M50,20 L55,15" stroke="#FFD700" strokeWidth="1" />
      </g>
    </svg>
  )
}
