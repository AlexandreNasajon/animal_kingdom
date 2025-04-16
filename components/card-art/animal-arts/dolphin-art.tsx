"use client"

export function DolphinArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="dolphinWater" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#104e8b" />
          <stop offset="100%" stopColor="#1874CD" />
        </linearGradient>

        {/* Water animation */}
        <path id="waterWave" d="M0,20 Q25,15 50,20 Q75,25 100,20 L100,100 L0,100 Z">
          <animate
            attributeName="d"
            values="M0,20 Q25,15 50,20 Q75,25 100,20 L100,100 L0,100 Z;
                   M0,20 Q25,25 50,20 Q75,15 100,20 L100,100 L0,100 Z;
                   M0,20 Q25,15 50,20 Q75,25 100,20 L100,100 L0,100 Z"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="100" height="100" fill="url(#dolphinWater)" />

      {/* Water waves */}
      <use href="#waterWave" fill="#2c8cdd" opacity="0.4" />

      {/* Dolphin body */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-5; 0,0"
          dur="3s"
          repeatCount="indefinite"
        />

        {/* Dolphin body */}
        <path
          d="M30,50 Q45,35 60,45 Q75,55 85,45 L80,60 Q75,65 60,60 Q45,65 30,50 Z"
          fill="#a0c8e0"
          stroke="#6a9cc8"
          strokeWidth="1"
        >
          <animate
            attributeName="d"
            values="M30,50 Q45,35 60,45 Q75,55 85,45 L80,60 Q75,65 60,60 Q45,65 30,50 Z;
                   M30,50 Q45,40 60,50 Q75,60 85,50 L80,65 Q75,70 60,65 Q45,70 30,50 Z;
                   M30,50 Q45,35 60,45 Q75,55 85,45 L80,60 Q75,65 60,60 Q45,65 30,50 Z"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dolphin fin */}
        <path d="M60,45 L65,30 L70,45" fill="#a0c8e0" stroke="#6a9cc8" strokeWidth="1">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 60 45; 5 60 45; 0 60 45; -5 60 45; 0 60 45"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dolphin tail */}
        <path d="M30,50 L20,40 L25,55" fill="#a0c8e0" stroke="#6a9cc8" strokeWidth="1">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 30 50; 10 30 50; 0 30 50; -10 30 50; 0 30 50"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dolphin eye */}
        <circle cx="75" cy="50" r="2" fill="#000" />

        {/* Water splash */}
        <path d="M85,45 Q90,40 95,45" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Bubbles */}
      <circle cx="25" cy="60" r="1" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="60;30;10" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="4s" repeatCount="indefinite" />
      </circle>

      <circle cx="28" cy="65" r="1.5" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="65;40;15" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
