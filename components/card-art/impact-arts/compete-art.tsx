"use client"

export function CompeteArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="competeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#competeGradient)" />

      {/* Background - competitive arena */}
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

      {/* First animal */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,0; 0,0; -2,0; 0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <path d="M30,60 C25,55 25,50 30,45 L40,45 C45,50 45,55 40,60 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="32" cy="50" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Second animal */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -2,0; 0,0; 2,0; 0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <path d="M70,60 C65,55 65,50 70,45 L80,45 C85,50 85,55 80,60 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="72" cy="50" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Versus symbol */}
      <text x="45" y="55" fontSize="15" fontWeight="bold" fill="#ffffff">
        VS
      </text>

      {/* Competition elements */}
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1s" repeatCount="indefinite" />
        <path d="M35,35 L40,30 L45,35 L40,40 Z" fill="#FF0000" opacity="0.8" />
        <path d="M65,35 L70,30 L75,35 L70,40 Z" fill="#FF0000" opacity="0.8" />
      </g>

      {/* Trophy */}
      <g>
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="2s" repeatCount="indefinite" />
        <path d="M45,20 L55,20 L55,25 L52,30 L48,30 L45,25 Z" fill="#FFD700" />
        <rect x="48" y="30" width="4" height="5" fill="#FFD700" />
        <rect x="45" y="35" width="10" height="2" fill="#FFD700" />
      </g>

      {/* Action lines */}
      <g>
        <animate attributeName="opacity" values="0.6; 0.9; 0.6" dur="0.3s" repeatCount="indefinite" />
        <path d="M25,50 L15,50" stroke="#ffffff" strokeWidth="1" />
        <path d="M85,50 L95,50" stroke="#ffffff" strokeWidth="1" />
        <path d="M25,45 L20,40" stroke="#ffffff" strokeWidth="1" />
        <path d="M25,55 L20,60" stroke="#ffffff" strokeWidth="1" />
        <path d="M75,45 L80,40" stroke="#ffffff" strokeWidth="1" />
        <path d="M75,55 L80,60" stroke="#ffffff" strokeWidth="1" />
      </g>
    </svg>
  )
}
