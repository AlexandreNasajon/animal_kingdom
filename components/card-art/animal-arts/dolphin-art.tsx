"use client"

export function DolphinArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="dolphinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077be">
            <animate attributeName="stopColor" values="#0077be; #00a0d2; #0077be" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#00a0d2">
            <animate attributeName="stopColor" values="#00a0d2; #0077be; #00a0d2" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#dolphinGradient)" />

      {/* Animated Ocean waves */}
      <path d="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z" fill="#005a87" opacity="0.4">
        <animate
          attributeName="d"
          values="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z;
                 M0,72 C15,62 30,82 50,72 C70,62 85,82 100,72 L100,100 L0,100 Z;
                 M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M0,80 C25,70 45,90 75,80 C85,75 95,85 100,80 L100,100 L0,100 Z" fill="#004a77" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,80 C25,70 45,90 75,80 C85,75 95,85 100,80 L100,100 L0,100 Z;
                 M0,82 C25,72 45,92 75,82 C85,77 95,87 100,82 L100,100 L0,100 Z;
                 M0,80 C25,70 45,90 75,80 C85,75 95,85 100,80 L100,100 L0,100 Z"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Dolphin body with animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,-2; 0,0; -1,1; 0,0"
          dur="3s"
          repeatCount="indefinite"
        />
        <path
          d="M30,60 C35,40 45,30 60,35 C75,40 85,30 85,45 C85,55 75,65 65,60 C55,65 45,70 35,65 C25,60 25,70 30,60 Z"
          fill="#708090"
          stroke="#2c3e50"
          strokeWidth="1"
        >
          <animate
            attributeName="d"
            values="M30,60 C35,40 45,30 60,35 C75,40 85,30 85,45 C85,55 75,65 65,60 C55,65 45,70 35,65 C25,60 25,70 30,60 Z;
                   M32,58 C37,38 47,28 62,33 C77,38 87,28 87,43 C87,53 77,63 67,58 C57,63 47,68 37,63 C27,58 27,68 32,58 Z;
                   M30,60 C35,40 45,30 60,35 C75,40 85,30 85,45 C85,55 75,65 65,60 C55,65 45,70 35,65 C25,60 25,70 30,60 Z"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dolphin fin with animation */}
        <path d="M55,35 L45,20 L60,40" fill="#708090" stroke="#2c3e50" strokeWidth="1">
          <animate
            attributeName="d"
            values="M55,35 L45,20 L60,40; M55,35 L43,18 L60,40; M55,35 L45,20 L60,40"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dolphin tail with animation */}
        <path d="M30,60 L20,50 L25,65 L15,70 L30,65" fill="#708090" stroke="#2c3e50" strokeWidth="1">
          <animate
            attributeName="d"
            values="M30,60 L20,50 L25,65 L15,70 L30,65; 
                   M30,60 L18,48 L25,65 L13,72 L30,65; 
                   M30,60 L20,50 L25,65 L15,70 L30,65"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dolphin eye */}
        <circle cx="70" cy="45" r="2" fill="#000000" />
      </g>

      {/* Water splash with animation */}
      <path d="M75,30 C80,25 85,30 80,35" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7">
        <animate
          attributeName="d"
          values="M75,30 C80,25 85,30 80,35; M75,28 C80,23 85,28 80,33; M75,30 C80,25 85,30 80,35"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {/* Animated bubbles */}
      <circle cx="80" cy="25" r="1" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="25;20;15;10;5;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.6;0.5;0.3;0.1;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="85" cy="28" r="1.5" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="28;23;18;13;8;3;-2" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.6;0.5;0.4;0.3;0.1;0" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="35" r="1.2" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="35;30;25;20;15;10;5;0" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.6;0.5;0.4;0.3;0.2;0.1;0" dur="6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
