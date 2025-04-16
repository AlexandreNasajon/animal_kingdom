"use client"

export function DomesticateArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="domesticateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#domesticateGradient)" />

      {/* Background - farm/domestic setting */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="#8B4513" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z; 
                 M0,72 Q25,67 50,72 Q75,77 100,72 L100,100 L0,100 Z; 
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Fence */}
      <path d="M10,70 L10,60 L90,60 L90,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
      <path d="M20,60 L20,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
      <path d="M30,60 L30,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
      <path d="M40,60 L40,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
      <path d="M50,60 L50,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
      <path d="M60,60 L60,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
      <path d="M70,60 L70,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
      <path d="M80,60 L80,70" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />

      {/* Animal silhouette */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,0; 0,0; -2,0; 0,0"
          dur="3s"
          repeatCount="indefinite"
        />
        <path d="M50,55 C45,50 45,45 50,40 L60,40 C65,45 65,50 60,55 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="52" cy="45" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Human figure */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-1; 0,0; 0,1; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <circle cx="30" cy="40" r="5" fill="#ffffff" opacity="0.8" />
        <path d="M30,45 L30,55" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
        <path d="M30,55 L25,65" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
        <path d="M30,55 L35,65" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
        <path d="M30,50 L40,45" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
      </g>

      {/* Heart symbols */}
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1.5s" repeatCount="indefinite" />
        <path d="M40,35 C40,30 45,30 45,35 C45,40 40,40 40,35 Z" fill="#FF69B4" transform="rotate(45, 42.5, 35)" />
      </g>
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1.2s" repeatCount="indefinite" />
        <path d="M45,30 C45,25 50,25 50,30 C50,35 45,35 45,30 Z" fill="#FF69B4" transform="rotate(45, 47.5, 30)" />
      </g>

      {/* Food/treat */}
      <rect x="35" cy="50" width="5" height="2" fill="#FFD700" opacity="0.9">
        <animate attributeName="opacity" values="0.9; 1; 0.9" dur="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}
