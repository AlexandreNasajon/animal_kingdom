"use client"

export function EarthquakeArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="earthquakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#earthquakeGradient)" />

      {/* Shaking ground */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="#8B4513" opacity="0.5">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z; 
                 M0,75 Q25,65 50,75 Q75,65 100,75 L100,100 L0,100 Z; 
                 M0,70 Q25,75 50,70 Q75,75 100,70 L100,100 L0,100 Z;
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Cracks in the ground */}
      <path d="M20,70 L30,75 L40,65 L50,80 L60,70 L70,75 L80,65" fill="none" stroke="#000000" strokeWidth="2">
        <animate
          attributeName="d"
          values="M20,70 L30,75 L40,65 L50,80 L60,70 L70,75 L80,65;
                 M20,75 L30,65 L40,75 L50,65 L60,75 L70,65 L80,75;
                 M20,70 L30,75 L40,65 L50,80 L60,70 L70,75 L80,65"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Buildings/structures shaking */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-2,0; 0,0; 2,0; 0,0; -2,0"
          dur="0.2s"
          repeatCount="indefinite"
        />
        <rect x="30" y="40" width="10" height="30" fill="#A9A9A9" />
        <rect x="60" y="30" width="15" height="40" fill="#A9A9A9" />
        <rect x="45" y="50" width="10" height="20" fill="#A9A9A9" />
      </g>

      {/* Animals falling/affected */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,5; 4,10; 6,15"
          dur="1s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0; 10; 0; -10; 0"
          dur="0.5s"
          repeatCount="indefinite"
          additive="sum"
        />
        <path d="M30,30 C25,25 25,20 30,15 L40,15 C45,20 45,25 40,30 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="32" cy="20" r="2" fill="#000000" opacity="0.8" />
      </g>

      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -2,5; -4,10; -6,15"
          dur="1s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0; -10; 0; 10; 0"
          dur="0.5s"
          repeatCount="indefinite"
          additive="sum"
        />
        <path d="M70,30 C65,25 65,20 70,15 L80,15 C85,20 85,25 80,30 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="72" cy="20" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Dust clouds */}
      <g>
        <animate attributeName="opacity" values="0; 0.5; 0" dur="1s" repeatCount="indefinite" />
        <circle cx="30" cy="70" r="5" fill="#A9A9A9" />
        <circle cx="70" cy="70" r="5" fill="#A9A9A9" />
        <circle cx="50" cy="75" r="5" fill="#A9A9A9" />
      </g>

      {/* Seismic waves */}
      <g>
        <animate attributeName="opacity" values="0.8; 0.2; 0.8" dur="1s" repeatCount="indefinite" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="#FF0000" strokeWidth="1" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#FF0000" strokeWidth="1" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#FF0000" strokeWidth="1" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#FF0000" strokeWidth="1" />
      </g>
    </svg>
  )
}
