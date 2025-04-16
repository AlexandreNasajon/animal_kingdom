"use client"

export function SnakeArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>

        <linearGradient id="snakeBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006400" />
          <stop offset="100%" stopColor="#228B22" />
        </linearGradient>
      </defs>

      {/* Background - forest floor */}
      <rect x="0" y="0" width="100" height="100" fill="url(#snakeGradient)" />

      {/* Ground texture */}
      <path d="M0,70 Q25,68 50,72 Q75,70 100,73 L100,100 L0,100 Z" fill="#654321" opacity="0.5">
        <animate
          attributeName="d"
          values="M0,70 Q25,68 50,72 Q75,70 100,73 L100,100 L0,100 Z;
                 M0,70 Q25,72 50,68 Q75,73 100,70 L100,100 L0,100 Z;
                 M0,70 Q25,68 50,72 Q75,70 100,73 L100,100 L0,100 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>

      {/* Leaves and twigs */}
      <path d="M20,80 L25,75 L30,80" fill="none" stroke="#228B22" strokeWidth="0.5" opacity="0.7" />
      <path d="M70,85 L75,80 L80,85" fill="none" stroke="#228B22" strokeWidth="0.5" opacity="0.7" />
      <path d="M40,90 L45,85 L50,90" fill="none" stroke="#228B22" strokeWidth="0.5" opacity="0.7" />

      {/* Snake */}
      <g>
        {/* Snake body */}
        <path
          d="M20,50 Q30,40 40,50 Q50,60 60,50 Q70,40 80,50"
          fill="none"
          stroke="url(#snakeBody)"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M20,50 Q30,40 40,50 Q50,60 60,50 Q70,40 80,50;
                   M20,50 Q30,60 40,50 Q50,40 60,50 Q70,60 80,50;
                   M20,50 Q30,40 40,50 Q50,60 60,50 Q70,40 80,50"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Snake head */}
        <ellipse cx="80" cy="50" rx="5" ry="3" fill="#006400" stroke="#004d00" strokeWidth="0.5">
          <animate attributeName="cx" values="80;82;80;78;80" dur="5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="50;48;50;52;50" dur="5s" repeatCount="indefinite" />
        </ellipse>

        {/* Snake eyes */}
        <circle cx="82" cy="49" r="0.8" fill="#000000">
          <animate attributeName="cx" values="82;84;82;80;82" dur="5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="49;47;49;51;49" dur="5s" repeatCount="indefinite" />
        </circle>

        <circle cx="82" cy="51" r="0.8" fill="#000000">
          <animate attributeName="cx" values="82;84;82;80;82" dur="5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="51;49;51;53;51" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Snake tongue */}
        <path
          d="M85,50 L90,48 M90,48 L92,46 M90,48 L92,50"
          fill="none"
          stroke="#FF0000"
          strokeWidth="0.5"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M85,50 L90,48 M90,48 L92,46 M90,48 L92,50;
                   M87,48 L92,46 M92,46 L94,44 M92,46 L94,48;
                   M85,50 L90,48 M90,48 L92,46 M90,48 L92,50"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </path>

        {/* Snake pattern */}
        <path
          d="M25,50 L25,45 M35,50 L35,45 M45,50 L45,55 M55,50 L55,45 M65,50 L65,55 M75,50 L75,45"
          fill="none"
          stroke="#FFFF00"
          strokeWidth="0.5"
          opacity="0.7"
        >
          <animate
            attributeName="d"
            values="M25,50 L25,45 M35,50 L35,45 M45,50 L45,55 M55,50 L55,45 M65,50 L65,55 M75,50 L75,45;
                   M25,50 L25,55 M35,50 L35,55 M45,50 L45,45 M55,50 L55,55 M65,50 L65,45 M75,50 L75,55;
                   M25,50 L25,45 M35,50 L35,45 M45,50 L45,55 M55,50 L55,45 M65,50 L65,55 M75,50 L75,45"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Ambient elements */}
      <path d="M15,40 L20,20 L25,40" fill="none" stroke="#228B22" strokeWidth="1" opacity="0.5">
        <animate
          attributeName="d"
          values="M15,40 L20,20 L25,40;
                 M15,40 L20,18 L25,40;
                 M15,40 L20,20 L25,40"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      <path d="M80,45 L85,25 L90,45" fill="none" stroke="#228B22" strokeWidth="1" opacity="0.5">
        <animate
          attributeName="d"
          values="M80,45 L85,25 L90,45;
                 M80,45 L85,23 L90,45;
                 M80,45 L85,25 L90,45"
          dur="7s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}
