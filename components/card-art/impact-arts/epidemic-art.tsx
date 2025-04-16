"use client"

export function EpidemicArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="epidemicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#epidemicGradient)" />

      {/* Background */}
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

      {/* Sick animal */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,1; 0,0; 0,-1; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <path d="M50,60 C45,55 45,50 50,45 L60,45 C65,50 65,55 60,60 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="52" cy="50" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Virus particles */}
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1.5s" repeatCount="indefinite" />
        <circle cx="40" cy="40" r="3" fill="#00FF00" opacity="0.7" />
        <path d="M40,35 L40,45 M35,40 L45,40" stroke="#00FF00" strokeWidth="1" />
        <path d="M36,36 L44,44 M36,44 L44,36" stroke="#00FF00" strokeWidth="1" />
      </g>
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
        <circle cx="60" cy="40" r="3" fill="#00FF00" opacity="0.7" />
        <path d="M60,35 L60,45 M55,40 L65,40" stroke="#00FF00" strokeWidth="1" />
        <path d="M56,36 L64,44 M56,44 L64,36" stroke="#00FF00" strokeWidth="1" />
      </g>
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1.5s" repeatCount="indefinite" begin="1s" />
        <circle cx="50" cy="30" r="3" fill="#00FF00" opacity="0.7" />
        <path d="M50,25 L50,35 M45,30 L55,30" stroke="#00FF00" strokeWidth="1" />
        <path d="M46,26 L54,34 M46,34 L54,26" stroke="#00FF00" strokeWidth="1" />
      </g>

      {/* Spreading effect */}
      <g>
        <animate attributeName="opacity" values="0.5; 0; 0.5" dur="2s" repeatCount="indefinite" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="#00FF00" strokeWidth="1" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#00FF00" strokeWidth="1" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#00FF00" strokeWidth="1" />
      </g>

      {/* Other affected animals */}
      <g>
        <animate attributeName="opacity" values="1; 0.5; 1" dur="2s" repeatCount="indefinite" />
        <path d="M30,70 C25,65 25,60 30,55 L40,55 C45,60 45,65 40,70 Z" fill="#A0522D" opacity="0.6" />
        <circle cx="32" cy="60" r="2" fill="#000000" opacity="0.6" />
      </g>
      <g>
        <animate attributeName="opacity" values="1; 0.5; 1" dur="2s" repeatCount="indefinite" begin="0.7s" />
        <path d="M70,70 C65,65 65,60 70,55 L80,55 C85,60 85,65 80,70 Z" fill="#A0522D" opacity="0.6" />
        <circle cx="72" cy="60" r="2" fill="#000000" opacity="0.6" />
      </g>

      {/* Warning symbols */}
      <g>
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1s" repeatCount="indefinite" />
        <path d="M20,30 L25,20 L30,30 Z" fill="none" stroke="#FF0000" strokeWidth="1" />
        <line x1="25" y1="25" x2="25" y2="28" stroke="#FF0000" strokeWidth="1" />
        <circle cx="25" cy="29" r="0.5" fill="#FF0000" />
      </g>
      <g>
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1s" repeatCount="indefinite" />
      </g>
      <g>
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1s" repeatCount="indefinite" begin="0.5s" />
        <path d="M80,30 L85,20 L90,30 Z" fill="none" stroke="#FF0000" strokeWidth="1" />
        <line x1="85" y1="25" x2="85" y2="28" stroke="#FF0000" strokeWidth="1" />
        <circle cx="85" cy="29" r="0.5" fill="#FF0000" />
      </g>
    </svg>
  )
}
