"use client"

export function PreyArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="preyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#preyGradient)" />

      {/* Background - hunting ground */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="#556B2F" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z; 
                 M0,72 Q25,67 50,72 Q75,77 100,72 L100,100 L0,100 Z; 
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Predator animal */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,-1; 0,0; -2,1; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <path d="M60,50 C55,45 55,40 60,35 L70,35 C75,40 75,45 70,50 Z" fill="#8B4513" opacity="0.8" />
        <circle cx="62" cy="40" r="2" fill="#FF0000" opacity="0.8">
          <animate attributeName="opacity" values="0.8; 1; 0.8" dur="0.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Prey animals */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -5,0; -10,0; -15,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <path d="M30,50 C25,45 25,40 30,35 L40,35 C45,40 45,45 40,50 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="32" cy="40" r="2" fill="#000000" opacity="0.8" />
      </g>

      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -3,3; -6,6; -9,9"
          dur="2s"
          repeatCount="indefinite"
        />
        <path d="M30,60 C25,55 25,50 30,45 L40,45 C45,50 45,55 40,60 Z" fill="#A0522D" opacity="0.6" />
        <circle cx="32" cy="50" r="2" fill="#000000" opacity="0.6" />
      </g>

      {/* Hunting elements */}
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1s" repeatCount="indefinite" />
        <path d="M50,40 L55,40" stroke="#FF0000" strokeWidth="1" />
        <path d="M45,45 L50,45" stroke="#FF0000" strokeWidth="1" />
        <path d="M40,50 L45,50" stroke="#FF0000" strokeWidth="1" />
      </g>

      {/* Paw prints */}
      <g>
        <animate attributeName="opacity" values="0; 0.8; 0" dur="3s" repeatCount="indefinite" />
        <circle cx="75" cy="60" r="1.5" fill="#8B4513" />
        <circle cx="78" cy="62" r="1.5" fill="#8B4513" />
        <circle cx="72" cy="62" r="1.5" fill="#8B4513" />
      </g>
      <g>
        <animate attributeName="opacity" values="0; 0.8; 0" dur="3s" repeatCount="indefinite" begin="1s" />
        <circle cx="65" cy="65" r="1.5" fill="#8B4513" />
        <circle cx="68" cy="67" r="1.5" fill="#8B4513" />
        <circle cx="62" cy="67" r="1.5" fill="#8B4513" />
      </g>

      {/* Action lines */}
      <g>
        <animate attributeName="opacity" values="0.6; 0.9; 0.6" dur="0.3s" repeatCount="indefinite" />
        <path d="M55,35 L50,30" stroke="#ffffff" strokeWidth="1" />
        <path d="M65,35 L70,30" stroke="#ffffff" strokeWidth="1" />
      </g>
    </svg>
  )
}
