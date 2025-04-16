"use client"

export function HunterArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="hunterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#hunterGradient)" />

      {/* Forest background */}
      <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#006400" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z; M0,72 Q25,67 50,72 T100,72 L100,100 L0,100 Z; M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Trees */}
      <path d="M10,70 L15,40 L20,70 Z" fill="#006400" opacity="0.7">
        <animate attributeName="opacity" values="0.7; 0.8; 0.7" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M80,70 L85,35 L90,70 Z" fill="#006400" opacity="0.7">
        <animate attributeName="opacity" values="0.7; 0.8; 0.7" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* Hunter silhouette */}
      <path d="M40,60 L45,40 L55,40 L60,60 Z" fill="#000000" opacity="0.8" />
      <circle cx="50" cy="35" r="5" fill="#000000" opacity="0.8" />

      {/* Bow and arrow */}
      <path d="M35,50 Q50,40 65,50" fill="none" stroke="#ffffff" strokeWidth="2">
        <animate
          attributeName="d"
          values="M35,50 Q50,40 65,50; M35,51 Q50,41 65,51; M35,50 Q50,40 65,50"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      <line x1="50" y1="40" x2="70" y2="30" stroke="#ffffff" strokeWidth="1">
        <animate attributeName="x2" values="70; 72; 70" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="30; 28; 30" dur="1.5s" repeatCount="indefinite" />
      </line>

      {/* Target animal */}
      <circle cx="75" cy="40" r="5" fill="#ffffff" opacity="0.6">
        <animate attributeName="opacity" values="0.6; 0.8; 0.6" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="40" r="3" fill="#ff0000" opacity="0.6">
        <animate attributeName="opacity" values="0.6; 0.9; 0.6" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="40" r="1" fill="#ffffff" opacity="0.6">
        <animate attributeName="opacity" values="0.6; 1; 0.6" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
