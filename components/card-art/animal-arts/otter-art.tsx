"use client"

export function OtterArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="otterWater" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a6e78" />
          <stop offset="100%" stopColor="#3d8c96" />
        </linearGradient>

        <linearGradient id="otterFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="100" height="100" fill="url(#otterWater)" />

      {/* River bank */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="#8B4513" opacity="0.6">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z;
                 M0,70 Q25,68 50,73 Q75,72 100,70 L100,100 L0,100 Z;
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Water surface */}
      <path d="M0,60 Q25,55 50,60 Q75,65 100,60" fill="none" stroke="#a5d4de" strokeWidth="1" opacity="0.5">
        <animate
          attributeName="d"
          values="M0,60 Q25,55 50,60 Q75,65 100,60;
                 M0,60 Q25,65 50,60 Q75,55 100,60;
                 M0,60 Q25,55 50,60 Q75,65 100,60"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Otter */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,1; 0,0; -2,1; 0,0"
          dur="4s"
          repeatCount="indefinite"
        />
        {/* Otter body */}
        <ellipse cx="50" cy="60" rx="20" ry="8" fill="url(#otterFur)" stroke="#6D4C41" strokeWidth="0.5">
          <animate attributeName="ry" values="8;7.5;8;8.5;8" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Otter head */}
        <circle cx="65" cy="58" r="7" fill="url(#otterFur)" stroke="#6D4C41" strokeWidth="0.5">
          <animate attributeName="cy" values="58;57;58;59;58" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Otter face */}
        <circle cx="67" cy="56" r="1.5" fill="#5D4037" />
        <ellipse cx="69" cy="58" rx="1" ry="0.5" fill="#000" /> {/* Eye */}
        <ellipse cx="67" cy="60" rx="1.5" ry="1" fill="#5D4037" /> {/* Nose */}
        {/* Otter tail */}
        <path d="M30,60 Q25,65 20,60 Q15,55 10,60" fill="url(#otterFur)" stroke="#6D4C41" strokeWidth="0.5">
          <animate
            attributeName="d"
            values="M30,60 Q25,65 20,60 Q15,55 10,60;
                   M30,60 Q25,63 20,58 Q15,53 10,58;
                   M30,60 Q25,65 20,60 Q15,55 10,60"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        {/* Otter paws */}
        <ellipse cx="45" cy="65" rx="3" ry="2" fill="#8B4513" opacity="0.8">
          <animate attributeName="cy" values="65;64;65;66;65" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="55" cy="65" rx="3" ry="2" fill="#8B4513" opacity="0.8">
          <animate attributeName="cy" values="65;66;65;64;65" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Water ripples */}
      <circle cx="40" cy="60" r="3" fill="none" stroke="#a5d4de" strokeWidth="0.5" opacity="0">
        <animate attributeName="r" values="1;5" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="3s" repeatCount="indefinite" />
      </circle>

      <circle cx="70" cy="60" r="3" fill="none" stroke="#a5d4de" strokeWidth="0.5" opacity="0">
        <animate attributeName="r" values="1;5" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
