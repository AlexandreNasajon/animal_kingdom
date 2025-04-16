"use client"

export function StormArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="stormGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#stormGradient)" />

      {/* Dark storm clouds */}
      <g>
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="2s" repeatCount="indefinite" />
        <circle cx="30" cy="30" r="15" fill="#4682B4" />
        <circle cx="50" cy="25" r="15" fill="#4682B4" />
        <circle cx="70" cy="30" r="15" fill="#4682B4" />
        <circle cx="20" cy="40" r="10" fill="#4682B4" />
        <circle cx="40" cy="35" r="10" fill="#4682B4" />
        <circle cx="60" cy="35" r="10" fill="#4682B4" />
        <circle cx="80" cy="40" r="10" fill="#4682B4" />
      </g>

      {/* Lightning bolts */}
      <g>
        <animate attributeName="opacity" values="0; 1; 0" dur="1s" repeatCount="indefinite" />
        <path d="M40,40 L35,60 L45,55 L35,80" fill="none" stroke="#FFFF00" strokeWidth="2" />
      </g>
      <g>
        <animate attributeName="opacity" values="0; 1; 0" dur="1s" repeatCount="indefinite" begin="0.3s" />
        <path d="M60,35 L55,55 L65,50 L60,75" fill="none" stroke="#FFFF00" strokeWidth="2" />
      </g>

      {/* Rain */}
      <g>
        <animate attributeName="opacity" values="0.7; 0.3; 0.7" dur="1s" repeatCount="indefinite" />
        <line x1="20" y1="40" x2="15" y2="50" stroke="#1E90FF" strokeWidth="1" />
        <line x1="30" y1="45" x2="25" y2="55" stroke="#1E90FF" strokeWidth="1" />
        <line x1="40" y1="40" x2="35" y2="50" stroke="#1E90FF" strokeWidth="1" />
        <line x1="50" y1="45" x2="45" y2="55" stroke="#1E90FF" strokeWidth="1" />
        <line x1="60" y1="40" x2="55" y2="50" stroke="#1E90FF" strokeWidth="1" />
        <line x1="70" y1="45" x2="65" y2="55" stroke="#1E90FF" strokeWidth="1" />
        <line x1="80" y1="40" x2="75" y2="50" stroke="#1E90FF" strokeWidth="1" />
      </g>
      <g>
        <animate attributeName="opacity" values="0.7; 0.3; 0.7" dur="1s" repeatCount="indefinite" begin="0.5s" />
        <line x1="25" y1="55" x2="20" y2="65" stroke="#1E90FF" strokeWidth="1" />
        <line x1="35" y1="60" x2="30" y2="70" stroke="#1E90FF" strokeWidth="1" />
        <line x1="45" y1="55" x2="40" y2="65" stroke="#1E90FF" strokeWidth="1" />
        <line x1="55" y1="60" x2="50" y2="70" stroke="#1E90FF" strokeWidth="1" />
        <line x1="65" y1="55" x2="60" y2="65" stroke="#1E90FF" strokeWidth="1" />
        <line x1="75" y1="60" x2="70" y2="70" stroke="#1E90FF" strokeWidth="1" />
      </g>

      {/* Wind gusts */}
      <g>
        <animate attributeName="opacity" values="0.5; 0.8; 0.5" dur="2s" repeatCount="indefinite" />
        <path d="M10,50 Q20,45 30,50 Q40,55 50,50" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
        <path d="M20,60 Q30,55 40,60 Q50,65 60,60" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
        <path d="M40,70 Q50,65 60,70 Q70,75 80,70" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Animals in distress */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 5,2; 0,0; -5,2; 0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <path d="M30,80 C25,75 25,70 30,65 L40,65 C45,70 45,75 40,80 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="32" cy="70" r="2" fill="#000000" opacity="0.8" />
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -5,2; 0,0; 5,2; 0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <path d="M70,80 C65,75 65,70 70,65 L80,65 C85,70 85,75 80,80 Z" fill="#A0522D" opacity="0.8" />
        <circle cx="72" cy="70" r="2" fill="#000000" opacity="0.8" />
      </g>
    </svg>
  )
}
