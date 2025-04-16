"use client"

export function CrocodileArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="crocWater" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a6e78" />
          <stop offset="100%" stopColor="#3d8c96" />
        </linearGradient>

        <linearGradient id="crocBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2F4F4F" />
          <stop offset="100%" stopColor="#3D5B5B" />
        </linearGradient>
      </defs>

      {/* Background - swamp */}
      <rect x="0" y="0" width="100" height="100" fill="url(#crocWater)" />

      {/* Water surface */}
      <path d="M0,60 Q25,55 50,60 Q75,65 100,60 L100,100 L0,100 Z" fill="#2F4F4F" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,60 Q25,55 50,60 Q75,65 100,60 L100,100 L0,100 Z;
                 M0,60 Q25,65 50,60 Q75,55 100,60 L100,100 L0,100 Z;
                 M0,60 Q25,55 50,60 Q75,65 100,60 L100,100 L0,100 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Lily pads */}
      <circle cx="20" cy="65" r="5" fill="#3CB371" opacity="0.6">
        <animate attributeName="cy" values="65;64;65;66;65" dur="5s" repeatCount="indefinite" />
      </circle>

      <circle cx="80" cy="70" r="7" fill="#3CB371" opacity="0.6">
        <animate attributeName="cy" values="70;69;70;71;70" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Crocodile */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,1; 0,0; 0,-1; 0,0"
          dur="5s"
          repeatCount="indefinite"
        />

        {/* Crocodile body */}
        <path d="M30,60 Q50,55 70,60" fill="none" stroke="url(#crocBody)" strokeWidth="10" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M30,60 Q50,55 70,60;
                   M30,60 Q50,57 70,60;
                   M30,60 Q50,55 70,60"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Crocodile head */}
        <path d="M70,60 L85,60 Q90,58 90,60 L85,62 L70,60 Z" fill="#2F4F4F" stroke="#1C2F2F" strokeWidth="0.5">
          <animate
            attributeName="d"
            values="M70,60 L85,60 Q90,58 90,60 L85,62 L70,60 Z;
                   M70,60 L85,60 Q90,59 90,60 L85,61 L70,60 Z;
                   M70,60 L85,60 Q90,58 90,60 L85,62 L70,60 Z"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Crocodile eyes */}
        <circle cx="75" cy="58" r="1" fill="#FFFF00">
          <animate attributeName="cy" values="58;57;58;59;58" dur="5s" repeatCount="indefinite" />
        </circle>

        <circle cx="75" cy="62" r="1" fill="#FFFF00">
          <animate attributeName="cy" values="62;61;62;63;62" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Crocodile tail */}
        <path d="M30,60 Q20,65 10,60" fill="none" stroke="#2F4F4F" strokeWidth="8" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M30,60 Q20,65 10,60;
                   M30,60 Q20,55 10,60;
                   M30,60 Q20,65 10,60"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Crocodile spikes */}
        <path d="M30,55 L35,50 M40,55 L45,50 M50,55 L55,50 M60,55 L65,50" fill="none" stroke="#1C2F2F" strokeWidth="1">
          <animate
            attributeName="d"
            values="M30,55 L35,50 M40,55 L45,50 M50,55 L55,50 M60,55 L65,50;
                   M30,57 L35,52 M40,57 L45,52 M50,57 L55,52 M60,57 L65,52;
                   M30,55 L35,50 M40,55 L45,50 M50,55 L55,50 M60,55 L65,50"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Crocodile legs */}
        <path d="M40,60 L40,70" fill="none" stroke="#2F4F4F" strokeWidth="3" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M40,60 L40,70;
                   M40,60 L42,70;
                   M40,60 L40,70"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M60,60 L60,70" fill="none" stroke="#2F4F4F" strokeWidth="3" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M60,60 L60,70;
                   M60,60 L58,70;
                   M60,60 L60,70"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Water ripples */}
      <circle cx="40" cy="60" r="2" fill="none" stroke="#a5d4de" strokeWidth="0.5" opacity="0">
        <animate attributeName="r" values="1;5" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="4s" repeatCount="indefinite" />
      </circle>

      <circle cx="70" cy="60" r="2" fill="none" stroke="#a5d4de" strokeWidth="0.5" opacity="0">
        <animate attributeName="r" values="1;5" dur="4s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="4s" begin="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
