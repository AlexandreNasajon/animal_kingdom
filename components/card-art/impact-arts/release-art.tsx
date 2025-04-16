"use client"

export function ReleaseArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="releaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#releaseGradient)" />

      {/* Background - nature setting */}
      <path d="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z" fill="#228B22" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z; 
                 M0,72 Q25,67 50,72 Q75,77 100,72 L100,100 L0,100 Z; 
                 M0,70 Q25,65 50,70 Q75,75 100,70 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Cage/box opening */}
      <rect x="30" y="50" width="40" height="30" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />
      <path d="M30,50 L50,30 L70,50" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />
      <path d="M70,50 L70,80" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />
      <path d="M30,50 L30,80" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />
      <path d="M30,80 L70,80" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />
      <path d="M50,30 L50,50" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />

      {/* Open door */}
      <path d="M50,50 L50,80" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />
      <path d="M50,50 L70,50" fill="none" stroke="#A9A9A9" strokeWidth="2" opacity="0.8" />

      {/* Animal escaping */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 15,-15; 30,-20; 45,-15"
          dur="3s"
          fill="freeze"
          repeatCount="indefinite"
        />
        <path d="M50,65 C45,60 45,55 50,50 L60,50 C65,55 65,60 60,65 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="52" cy="55" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Second animal escaping */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -10,-10; -20,-15; -30,-10"
          dur="3s"
          fill="freeze"
          repeatCount="indefinite"
          begin="0.5s"
        />
        <path d="M40,65 C35,60 35,55 40,50 L50,50 C55,55 55,60 50,65 Z" fill="#4682B4" opacity="0.8" />
        <circle cx="42" cy="55" r="2" fill="#000000" opacity="0.8" />
      </g>

      {/* Freedom symbols */}
      <g>
        <animate attributeName="opacity" values="0; 0.8; 0" dur="3s" repeatCount="indefinite" />
        <path d="M80,30 L85,25 L90,30 L85,35 Z" fill="#ffffff" />
      </g>
      <g>
        <animate attributeName="opacity" values="0; 0.8; 0" dur="3s" repeatCount="indefinite" begin="1s" />
        <path d="M20,35 L25,30 L30,35 L25,40 Z" fill="#ffffff" />
      </g>
      <g>
        <animate attributeName="opacity" values="0; 0.8; 0" dur="3s" repeatCount="indefinite" begin="2s" />
        <path d="M50,15 L55,10 L60,15 L55,20 Z" fill="#ffffff" />
      </g>
    </svg>
  )
}
