"use client"

export function ScareArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="scareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#scareGradient)" />

      {/* Forest/environment background */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="#006400" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z; 
                 M0,72 Q25,67 50,72 Q75,77 100,72 L100,100 L0,100 Z; 
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Scared animal silhouette */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -2,0; 0,0; 2,0; 0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <path d="M50,60 C45,55 45,50 50,45 L60,45 C65,50 65,55 60,60 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="52" cy="50" r="2" fill="#000000" opacity="0.8" />
        <path d="M60,55 L65,60" fill="none" stroke="#A0522D" strokeWidth="2" opacity="0.8" />
      </g>

      {/* Exclamation marks */}
      <g>
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="0.7s" repeatCount="indefinite" />
        <text x="30" y="40" fontSize="15" fontWeight="bold" fill="#ffffff">
          !
        </text>
        <text x="70" y="40" fontSize="15" fontWeight="bold" fill="#ffffff">
          !
        </text>
      </g>

      {/* Sound waves */}
      <g opacity="0.7">
        <animate attributeName="opacity" values="0.7; 0.3; 0.7" dur="1s" repeatCount="indefinite" />
        <path d="M20,50 Q25,45 30,50" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M15,50 Q25,40 35,50" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M10,50 Q25,35 40,50" fill="none" stroke="#ffffff" strokeWidth="1" />

        <path d="M70,50 Q75,45 80,50" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M65,50 Q75,40 85,50" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M60,50 Q75,35 90,50" fill="none" stroke="#ffffff" strokeWidth="1" />
      </g>

      {/* Arrows pointing up (to deck) */}
      <g>
        <animate attributeName="opacity" values="0.8; 0.4; 0.8" dur="1.5s" repeatCount="indefinite" />
        <path d="M50,30 L50,10 M45,15 L50,10 L55,15" fill="none" stroke="#ffffff" strokeWidth="2" />
      </g>
    </svg>
  )
}
