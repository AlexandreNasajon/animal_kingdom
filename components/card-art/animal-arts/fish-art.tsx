"use client"

export function FishArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#104e8b">
            <animate attributeName="stopColor" values="#104e8b; #1874CD; #104e8b" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#1874CD">
            <animate attributeName="stopColor" values="#1874CD; #104e8b; #1874CD" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#fishGradient)" />

      {/* Animated Water */}
      <path d="M0,60 C20,40 35,70 55,60 C75,50 80,70 100,60 L100,100 L0,100 Z" fill="#2c8cdd" opacity="0.6">
        <animate
          attributeName="d"
          values="M0,60 C20,40 35,70 55,60 C75,50 80,70 100,60 L100,100 L0,100 Z;
                 M0,65 C20,45 35,75 55,65 C75,55 80,75 100,65 L100,100 L0,100 Z;
                 M0,60 C20,40 35,70 55,60 C75,50 80,70 100,60 L100,100 L0,100 Z"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z" fill="#1e5799" opacity="0.4">
        <animate
          attributeName="d"
          values="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z;
                 M0,75 C15,65 30,85 50,75 C70,65 85,85 100,75 L100,100 L0,100 Z;
                 M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Fish body with animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,-1; 0,0; -2,1; 0,0"
          dur="4s"
          repeatCount="indefinite"
        />
        <path
          d="M65,50 C80,40 85,60 75,65 L80,70 L70,65 C60,70 40,65 35,50 C40,35 60,30 65,50 Z"
          fill="#f0f0f0"
          stroke="#333"
          strokeWidth="1"
        >
          <animate
            attributeName="d"
            values="M65,50 C80,40 85,60 75,65 L80,70 L70,65 C60,70 40,65 35,50 C40,35 60,30 65,50 Z;
                   M65,50 C80,40 85,60 75,65 L80,70 L70,65 C60,70 40,65 35,50 C40,35 60,30 65,50 Z;
                   M63,48 C78,38 83,58 73,63 L78,68 L68,63 C58,68 38,63 33,48 C38,33 58,28 63,48 Z;
                   M65,50 C80,40 85,60 75,65 L80,70 L70,65 C60,70 40,65 35,50 C40,35 60,30 65,50 Z;"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Fish eye */}
        <circle cx="70" cy="45" r="3" fill="#000000" />

        {/* Fish fins with animation */}
        <path d="M50,40 L40,30 L50,45" fill="#f0f0f0" stroke="#333" strokeWidth="1">
          <animate
            attributeName="d"
            values="M50,40 L40,30 L50,45; M50,40 L38,28 L50,45; M50,40 L40,30 L50,45"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M50,60 L40,70 L50,55" fill="#f0f0f0" stroke="#333" strokeWidth="1">
          <animate
            attributeName="d"
            values="M50,60 L40,70 L50,55; M50,60 L38,72 L50,55; M50,60 L40,70 L50,55"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Animated Bubbles */}
      <circle cx="25" cy="30" r="2" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="30;20;10;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.5;0.3;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="40" r="3" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="40;30;20;10;0" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.6;0.4;0.2;0" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="50" r="1.5" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="50;40;30;20;10;0" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.6;0.5;0.4;0.2;0" dur="6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
