"use client"

export function FrogArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="frogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006400" />
          <stop offset="100%" stopColor="#228B22" />
        </linearGradient>

        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#104e8b" />
          <stop offset="100%" stopColor="#1874CD" />
        </linearGradient>
      </defs>

      {/* Background - mixed environment for amphibian */}
      <rect x="0" y="0" width="100" height="100" fill="url(#frogGradient)" />

      {/* Water area */}
      <path d="M0,60 L100,60 L100,100 L0,100 Z" fill="url(#waterGradient)" opacity="0.5">
        <animate
          attributeName="d"
          values="M0,60 L100,60 L100,100 L0,100 Z;
                 M0,58 L100,62 L100,100 L0,100 Z;
                 M0,60 L100,60 L100,100 L0,100 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Lily pad */}
      <circle cx="50" cy="60" r="15" fill="#3CB371" opacity="0.8" stroke="#2E8B57" strokeWidth="0.5">
        <animate attributeName="cy" values="60;59;60;61;60" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Lily pad details */}
      <path d="M50,60 L65,60" stroke="#2E8B57" strokeWidth="0.5" opacity="0.8">
        <animate
          attributeName="d"
          values="M50,60 L65,60;
                 M50,59 L65,59;
                 M50,60 L65,60;
                 M50,61 L65,61;
                 M50,60 L65,60"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Frog */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-2; 0,0"
          dur="3s"
          repeatCount="indefinite"
        />

        {/* Frog body */}
        <ellipse cx="50" cy="55" rx="10" ry="6" fill="#32CD32" stroke="#228B22" strokeWidth="0.5">
          <animate attributeName="ry" values="6;5.5;6;6.5;6" dur="1.5s" repeatCount="indefinite" />
        </ellipse>

        {/* Frog head */}
        <ellipse cx="50" cy="45" rx="8" ry="5" fill="#32CD32" stroke="#228B22" strokeWidth="0.5">
          <animate attributeName="ry" values="5;4.8;5;5.2;5" dur="1.5s" repeatCount="indefinite" />
        </ellipse>

        {/* Frog eyes */}
        <circle cx="46" cy="42" r="2" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
        <circle cx="54" cy="42" r="2" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
        <circle cx="46" cy="42" r="1" fill="#000000" />
        <circle cx="54" cy="42" r="1" fill="#000000" />

        {/* Frog mouth */}
        <path d="M48,47 Q50,49 52,47" fill="none" stroke="#006400" strokeWidth="0.5">
          <animate
            attributeName="d"
            values="M48,47 Q50,49 52,47;
                   M48,47 Q50,48 52,47;
                   M48,47 Q50,49 52,47"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Frog legs */}
        <path d="M42,55 Q35,60 30,55" fill="none" stroke="#32CD32" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M42,55 Q35,60 30,55;
                   M42,55 Q35,58 30,53;
                   M42,55 Q35,60 30,55"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M58,55 Q65,60 70,55" fill="none" stroke="#32CD32" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M58,55 Q65,60 70,55;
                   M58,55 Q65,58 70,53;
                   M58,55 Q65,60 70,55"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Water ripples */}
      <circle cx="30" cy="70" r="2" fill="none" stroke="#a5d4de" strokeWidth="0.5" opacity="0">
        <animate attributeName="r" values="1;5" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="4s" repeatCount="indefinite" />
      </circle>

      <circle cx="70" cy="75" r="2" fill="none" stroke="#a5d4de" strokeWidth="0.5" opacity="0">
        <animate attributeName="r" values="1;5" dur="4s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="4s" begin="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
