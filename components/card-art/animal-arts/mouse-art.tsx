"use client"

export function MouseArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="mouseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>

        <linearGradient id="mouseBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A9A9A9" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
      </defs>

      {/* Background - forest floor */}
      <rect x="0" y="0" width="100" height="100" fill="url(#mouseGradient)" />

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

      {/* Mouse */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,0; 0,0; -2,0; 0,0"
          dur="3s"
          repeatCount="indefinite"
        />

        {/* Mouse body */}
        <ellipse cx="50" cy="60" rx="10" ry="7" fill="url(#mouseBody)" stroke="#696969" strokeWidth="0.5">
          <animate attributeName="ry" values="7;6.8;7;7.2;7" dur="1s" repeatCount="indefinite" />
        </ellipse>

        {/* Mouse head */}
        <ellipse cx="65" cy="58" rx="7" ry="5" fill="url(#mouseBody)" stroke="#696969" strokeWidth="0.5">
          <animate attributeName="rx" values="7;6.8;7;7.2;7" dur="1s" repeatCount="indefinite" />
        </ellipse>

        {/* Mouse ears */}
        <circle cx="68" cy="54" r="3" fill="#C0C0C0" stroke="#696969" strokeWidth="0.5">
          <animate attributeName="r" values="3;2.9;3;3.1;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="62" cy="54" r="3" fill="#C0C0C0" stroke="#696969" strokeWidth="0.5">
          <animate attributeName="r" values="3;3.1;3;2.9;3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Mouse eyes */}
        <circle cx="67" cy="58" r="1" fill="#000000" />
        <circle cx="63" cy="58" r="1" fill="#000000" />

        {/* Mouse nose */}
        <ellipse cx="70" cy="60" rx="1" ry="0.5" fill="#FF69B4" />

        {/* Mouse whiskers */}
        <path d="M70,60 L75,59" fill="none" stroke="#000000" strokeWidth="0.2" />
        <path d="M70,60 L75,60" fill="none" stroke="#000000" strokeWidth="0.2" />
        <path d="M70,60 L75,61" fill="none" stroke="#000000" strokeWidth="0.2" />

        {/* Mouse tail */}
        <path d="M40,60 Q30,55 25,60" fill="none" stroke="#A9A9A9" strokeWidth="1" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M40,60 Q30,55 25,60;
                   M40,60 Q30,58 25,63;
                   M40,60 Q30,55 25,60"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Mouse feet */}
        <ellipse cx="45" cy="65" rx="2" ry="1" fill="#C0C0C0" stroke="#696969" strokeWidth="0.3">
          <animate attributeName="ry" values="1;0.8;1" dur="0.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="55" cy="65" rx="2" ry="1" fill="#C0C0C0" stroke="#696969" strokeWidth="0.3">
          <animate attributeName="ry" values="1;0.8;1" dur="0.5s" repeatCount="indefinite" begin="0.25s" />
        </ellipse>
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
