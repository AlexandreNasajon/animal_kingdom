"use client"

export function CrabArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="crabGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#104e8b" />
          <stop offset="100%" stopColor="#1874CD" />
        </linearGradient>

        <linearGradient id="sandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5DEB3" />
          <stop offset="100%" stopColor="#DEB887" />
        </linearGradient>
      </defs>

      {/* Background - ocean */}
      <rect x="0" y="0" width="100" height="100" fill="url(#crabGradient)" />

      {/* Sandy bottom */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="url(#sandGradient)" opacity="0.8">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z;
                 M0,70 Q25,68 50,73 Q75,72 100,70 L100,100 L0,100 Z;
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>

      {/* Seaweed */}
      <path d="M20,70 Q22,60 20,50 Q18,40 20,30" fill="none" stroke="#2E8B57" strokeWidth="1" opacity="0.7">
        <animate
          attributeName="d"
          values="M20,70 Q22,60 20,50 Q18,40 20,30;
                 M20,70 Q18,60 20,50 Q22,40 20,30;
                 M20,70 Q22,60 20,50 Q18,40 20,30"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      <path d="M80,70 Q82,65 80,60 Q78,55 80,50" fill="none" stroke="#2E8B57" strokeWidth="1" opacity="0.7">
        <animate
          attributeName="d"
          values="M80,70 Q82,65 80,60 Q78,55 80,50;
                 M80,70 Q78,65 80,60 Q82,55 80,50;
                 M80,70 Q82,65 80,60 Q78,55 80,50"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Crab */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -2,0; 0,0; 2,0; 0,0"
          dur="4s"
          repeatCount="indefinite"
        />

        {/* Crab body */}
        <ellipse cx="50" cy="60" rx="12" ry="8" fill="#FF4500" stroke="#B22222" strokeWidth="0.5">
          <animate attributeName="ry" values="8;7.8;8;8.2;8" dur="2s" repeatCount="indefinite" />
        </ellipse>

        {/* Crab eyes */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 50 55; 5 50 55; 0 50 55; -5 50 55; 0 50 55"
            dur="3s"
            repeatCount="indefinite"
          />
          <circle cx="45" cy="52" r="1.5" fill="#000000" />
          <circle cx="55" cy="52" r="1.5" fill="#000000" />
          <line x1="45" y1="50" x2="45" y2="48" stroke="#000000" strokeWidth="0.5" />
          <line x1="55" y1="50" x2="55" y2="48" stroke="#000000" strokeWidth="0.5" />
        </g>

        {/* Crab mouth */}
        <path d="M48,58 Q50,60 52,58" fill="none" stroke="#B22222" strokeWidth="0.5">
          <animate
            attributeName="d"
            values="M48,58 Q50,60 52,58;
                   M48,58 Q50,59 52,58;
                   M48,58 Q50,60 52,58"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Crab claws */}
        <path d="M38,60 L30,55 L32,60 L30,65" fill="none" stroke="#FF4500" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M38,60 L30,55 L32,60 L30,65;
                   M38,60 L30,57 L32,62 L30,67;
                   M38,60 L30,55 L32,60 L30,65"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M62,60 L70,55 L68,60 L70,65" fill="none" stroke="#FF4500" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M62,60 L70,55 L68,60 L70,65;
                   M62,60 L70,57 L68,62 L70,67;
                   M62,60 L70,55 L68,60 L70,65"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Crab legs */}
        <path d="M45,65 L40,75" fill="none" stroke="#FF4500" strokeWidth="1">
          <animate
            attributeName="d"
            values="M45,65 L40,75;
                   M45,65 L42,75;
                   M45,65 L40,75"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M48,65 L45,75" fill="none" stroke="#FF4500" strokeWidth="1">
          <animate
            attributeName="d"
            values="M48,65 L45,75;
                   M48,65 L47,75;
                   M48,65 L45,75"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M52,65 L55,75" fill="none" stroke="#FF4500" strokeWidth="1">
          <animate
            attributeName="d"
            values="M52,65 L55,75;
                   M52,65 L53,75;
                   M52,65 L55,75"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M55,65 L60,75" fill="none" stroke="#FF4500" strokeWidth="1">
          <animate
            attributeName="d"
            values="M55,65 L60,75;
                   M55,65 L58,75;
                   M55,65 L60,75"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Bubbles */}
      <circle cx="35" cy="40" r="1" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="40;20;0" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="6s" repeatCount="indefinite" />
      </circle>

      <circle cx="65" cy="45" r="1.5" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="45;25;5" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="7s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
