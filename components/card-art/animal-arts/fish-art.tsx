"use client"

export function FishArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="fishWater" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#104e8b" />
          <stop offset="100%" stopColor="#1874CD" />
        </linearGradient>

        <linearGradient id="fishBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>

      {/* Background - ocean */}
      <rect x="0" y="0" width="100" height="100" fill="url(#fishWater)" />

      {/* Water waves */}
      <path d="M0,20 Q25,15 50,20 Q75,25 100,20 L100,100 L0,100 Z" fill="#2c8cdd" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,20 Q25,15 50,20 Q75,25 100,20 L100,100 L0,100 Z;
                 M0,20 Q25,25 50,20 Q75,15 100,20 L100,100 L0,100 Z;
                 M0,20 Q25,15 50,20 Q75,25 100,20 L100,100 L0,100 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Fish */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 3,0; 0,0; -3,0; 0,0"
          dur="5s"
          repeatCount="indefinite"
        />

        {/* Fish body */}
        <path d="M60,50 Q75,40 80,50 Q75,60 60,50 Z" fill="url(#fishBody)" stroke="#FF4500" strokeWidth="0.5">
          <animate
            attributeName="d"
            values="M60,50 Q75,40 80,50 Q75,60 60,50 Z;
                   M60,50 Q75,42 80,50 Q75,58 60,50 Z;
                   M60,50 Q75,40 80,50 Q75,60 60,50 Z"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>

        {/* Fish tail */}
        <path d="M60,50 L45,40 L45,60 Z" fill="url(#fishBody)" stroke="#FF4500" strokeWidth="0.5">
          <animate
            attributeName="d"
            values="M60,50 L45,40 L45,60 Z;
                   M60,50 L45,42 L45,58 Z;
                   M60,50 L45,40 L45,60 Z"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>

        {/* Fish fins */}
        <path d="M70,45 L75,35" fill="none" stroke="#FF4500" strokeWidth="1">
          <animate
            attributeName="d"
            values="M70,45 L75,35;
                   M70,45 L73,35;
                   M70,45 L75,35"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M70,55 L75,65" fill="none" stroke="#FF4500" strokeWidth="1">
          <animate
            attributeName="d"
            values="M70,55 L75,65;
                   M70,55 L73,65;
                   M70,55 L75,65"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Fish eye */}
        <circle cx="75" cy="50" r="1.5" fill="#000000" />

        {/* Fish scales */}
        <path d="M65,45 Q67,47 65,49" fill="none" stroke="#FF8C00" strokeWidth="0.5" opacity="0.7" />
        <path d="M65,51 Q67,53 65,55" fill="none" stroke="#FF8C00" strokeWidth="0.5" opacity="0.7" />
        <path d="M60,45 Q62,47 60,49" fill="none" stroke="#FF8C00" strokeWidth="0.5" opacity="0.7" />
        <path d="M60,51 Q62,53 60,55" fill="none" stroke="#FF8C00" strokeWidth="0.5" opacity="0.7" />
      </g>

      {/* Bubbles */}
      <circle cx="40" cy="40" r="1" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="40;20;0" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="5s" repeatCount="indefinite" />
      </circle>

      <circle cx="85" cy="45" r="1.5" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="45;25;5" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="6s" repeatCount="indefinite" />
      </circle>

      <circle cx="90" cy="55" r="1" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="55;35;15" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
