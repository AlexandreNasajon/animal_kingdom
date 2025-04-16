"use client"

export function ConfuseArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="confuseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#confuseGradient)" />

      {/* Background elements */}
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

      {/* First animal silhouette */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,-2; 0,0; -2,2; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <path d="M30,60 C25,55 25,50 30,45 L40,45 C45,50 45,55 40,60 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="32" cy="50" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Second animal silhouette */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -2,2; 0,0; 2,-2; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <path d="M70,60 C65,55 65,50 70,45 L80,45 C85,50 85,55 80,60 Z" fill="#4682B4" opacity="0.8" />
        <circle cx="72" cy="50" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Exchange arrows */}
      <g>
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
        <path d="M45,50 L55,50" stroke="#ffffff" strokeWidth="2" />
        <path d="M45,50 L50,45" stroke="#ffffff" strokeWidth="2" />
        <path d="M45,50 L50,55" stroke="#ffffff" strokeWidth="2" />
        <path d="M55,50 L50,45" stroke="#ffffff" strokeWidth="2" />
        <path d="M55,50 L50,55" stroke="#ffffff" strokeWidth="2" />
      </g>

      {/* Question marks and confusion symbols */}
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1s" repeatCount="indefinite" />
        <text x="25" y="35" fontSize="10" fontWeight="bold" fill="#ffffff">
          ?
        </text>
        <text x="35" y="30" fontSize="10" fontWeight="bold" fill="#ffffff">
          ?
        </text>
        <text x="65" y="35" fontSize="10" fontWeight="bold" fill="#ffffff">
          ?
        </text>
        <text x="75" y="30" fontSize="10" fontWeight="bold" fill="#ffffff">
          ?
        </text>
      </g>

      {/* Spinning stars */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 30 30"
          to="360 30 30"
          dur="3s"
          repeatCount="indefinite"
        />
        <path
          d="M30,25 L32,30 L37,30 L33,33 L35,38 L30,35 L25,38 L27,33 L23,30 L28,30 Z"
          fill="#FFD700"
          opacity="0.7"
        />
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 70 30"
          to="360 70 30"
          dur="3s"
          repeatCount="indefinite"
        />
        <path
          d="M70,25 L72,30 L77,30 L73,33 L75,38 L70,35 L65,38 L67,33 L63,30 L68,30 Z"
          fill="#FFD700"
          opacity="0.7"
        />
      </g>
    </svg>
  )
}
