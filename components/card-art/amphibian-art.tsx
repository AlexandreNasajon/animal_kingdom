"use client"

export function AmphibianArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="amphibianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006400">
            <animate attributeName="stopColor" values="#006400; #104e8b; #006400" dur="5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#228B22">
            <animate attributeName="stopColor" values="#228B22; #1874CD; #228B22" dur="5s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#amphibianGradient)" />

      {/* Water and land division - animated to show dual nature */}
      <path d="M0,50 L100,50 L100,100 L0,100 Z" fill="#104e8b" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,50 L100,50 L100,100 L0,100 Z;
                 M0,45 L100,55 L100,100 L0,100 Z;
                 M0,50 L100,50 L100,100 L0,100 Z"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Lily pads with animation */}
      <circle cx="30" cy="60" r="10" fill="#3CB371" opacity="0.8">
        <animate attributeName="cy" values="60;58;60" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="70" r="15" fill="#3CB371" opacity="0.8">
        <animate attributeName="cy" values="70;72;70" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Frog silhouette with animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-2; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        <ellipse cx="50" cy="40" rx="15" ry="10" fill="#ffffff" opacity="0.8" />
        <circle cx="40" cy="35" r="3" fill="#000000" />
        <circle cx="60" cy="35" r="3" fill="#000000" />
        <path d="M35,50 Q50,60 65,50" stroke="#000000" strokeWidth="2" fill="none" />
      </g>

      {/* Water ripples */}
      <path d="M20,65 C25,63 30,67 35,65" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.5">
        <animate
          attributeName="d"
          values="M20,65 C25,63 30,67 35,65;
                 M20,67 C25,65 30,69 35,67;
                 M20,65 C25,63 30,67 35,65"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M60,75 C65,73 70,77 75,75" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.5">
        <animate
          attributeName="d"
          values="M60,75 C65,73 70,77 75,75;
                 M60,77 C65,75 70,79 75,77;
                 M60,75 C65,73 70,77 75,75"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}
