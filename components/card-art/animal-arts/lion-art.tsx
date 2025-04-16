"use client"

export function LionArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D2B48C" />
          <stop offset="100%" stopColor="#CD853F" />
        </linearGradient>

        <radialGradient id="maneShadow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#CD853F" />
        </radialGradient>
      </defs>

      {/* Background - Savanna */}
      <rect x="0" y="0" width="100" height="100" fill="url(#lionGradient)" />

      {/* Grass */}
      <path d="M0,70 Q25,68 50,72 Q75,70 100,73 L100,100 L0,100 Z" fill="#556B2F" opacity="0.5">
        <animate
          attributeName="d"
          values="M0,70 Q25,68 50,72 Q75,70 100,73 L100,100 L0,100 Z;
                 M0,70 Q25,72 50,68 Q75,73 100,70 L100,100 L0,100 Z;
                 M0,70 Q25,68 50,72 Q75,70 100,73 L100,100 L0,100 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>

      {/* Distant trees */}
      <path d="M10,60 L15,40 L20,60" fill="#556B2F" opacity="0.7">
        <animate
          attributeName="d"
          values="M10,60 L15,40 L20,60;
                 M10,60 L15,38 L20,60;
                 M10,60 L15,40 L20,60"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      <path d="M80,65 L85,35 L90,65" fill="#556B2F" opacity="0.7">
        <animate
          attributeName="d"
          values="M80,65 L85,35 L90,65;
                 M80,65 L85,33 L90,65;
                 M80,65 L85,35 L90,65"
          dur="7s"
          repeatCount="indefinite"
        />
      </path>

      {/* Lion */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,1; 0,0; 0,-1; 0,0"
          dur="4s"
          repeatCount="indefinite"
        />
        {/* Lion body */}
        <ellipse cx="50" cy="60" rx="18" ry="10" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5">
          <animate attributeName="ry" values="10;9.5;10;10.5;10" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Lion head */}
        <circle cx="70" cy="55" r="10" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5" />
        {/* Lion mane */}
        <circle cx="70" cy="55" r="14" fill="url(#maneShadow)" opacity="0.8" stroke="#B8860B" strokeWidth="0.5">
          <animate attributeName="r" values="14;14.5;14;13.5;14" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Lion face */}
        <circle cx="73" cy="52" r="1.5" fill="#5D4037" /> {/* Eye */}
        <circle cx="73" cy="58" r="1.5" fill="#5D4037" /> {/* Nose */}
        <path d="M73,58 Q76,60 79,58" fill="none" stroke="#5D4037" strokeWidth="0.5" /> {/* Mouth */}
        {/* Lion tail */}
        <path d="M32,60 Q25,50 20,55 L18,50" fill="none" stroke="#DAA520" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M32,60 Q25,50 20,55 L18,50;
                   M32,60 Q25,55 20,50 L18,45;
                   M32,60 Q25,50 20,55 L18,50"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        {/* Lion legs */}
        <rect x="40" y="65" width="4" height="10" rx="2" fill="#DAA520" />
        <rect x="60" y="65" width="4" height="10" rx="2" fill="#DAA520" />
        <rect x="65" y="65" width="4" height="10" rx="2" fill="#DAA520" />
        <rect x="35" y="65" width="4" height="10" rx="2" fill="#DAA520" />
      </g>

      {/* Heat waves */}
      <path d="M30,30 Q35,28 40,30 Q45,32 50,30" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.2">
        <animate
          attributeName="d"
          values="M30,30 Q35,28 40,30 Q45,32 50,30;
                 M30,30 Q35,32 40,30 Q45,28 50,30;
                 M30,30 Q35,28 40,30 Q45,32 50,30"
          dur="5s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="5s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}
