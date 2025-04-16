"use client"

export function FloodArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="floodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#floodGradient)" />

      {/* Rain clouds */}
      <circle cx="30" cy="30" r="10" fill="#708090" opacity="0.8">
        <animate attributeName="cx" values="30; 31; 30" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8; 0.9; 0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="25" r="10" fill="#708090" opacity="0.8">
        <animate attributeName="cx" values="40; 41; 40" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8; 0.9; 0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="30" r="10" fill="#708090" opacity="0.8">
        <animate attributeName="cx" values="50; 51; 50" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8; 0.9; 0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="25" r="10" fill="#708090" opacity="0.8">
        <animate attributeName="cx" values="60; 61; 60" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8; 0.9; 0.8" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="30" r="10" fill="#708090" opacity="0.8">
        <animate attributeName="cx" values="70; 71; 70" dur="3.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8; 0.9; 0.8" dur="2.7s" repeatCount="indefinite" />
      </circle>

      {/* Rain */}
      <line x1="30" y1="40" x2="25" y2="50" stroke="#1E90FF" strokeWidth="2">
        <animate attributeName="y1" values="40; 42; 44; 46; 48; 50; 40" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y2" values="50; 52; 54; 56; 58; 60; 50" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="40" y1="35" x2="35" y2="45" stroke="#1E90FF" strokeWidth="2">
        <animate attributeName="y1" values="35; 37; 39; 41; 43; 45; 35" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="y2" values="45; 47; 49; 51; 53; 55; 45" dur="0.9s" repeatCount="indefinite" />
      </line>
      <line x1="50" y1="40" x2="45" y2="50" stroke="#1E90FF" strokeWidth="2">
        <animate attributeName="y1" values="40; 42; 44; 46; 48; 50; 40" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="y2" values="50; 52; 54; 56; 58; 60; 50" dur="1.1s" repeatCount="indefinite" />
      </line>
      <line x1="60" y1="35" x2="55" y2="45" stroke="#1E90FF" strokeWidth="2">
        <animate attributeName="y1" values="35; 37; 39; 41; 43; 45; 35" dur="0.95s" repeatCount="indefinite" />
        <animate attributeName="y2" values="45; 47; 49; 51; 53; 55; 45" dur="0.95s" repeatCount="indefinite" />
      </line>
      <line x1="70" y1="40" x2="65" y2="50" stroke="#1E90FF" strokeWidth="2">
        <animate attributeName="y1" values="40; 42; 44; 46; 48; 50; 40" dur="1.05s" repeatCount="indefinite" />
        <animate attributeName="y2" values="50; 52; 54; 56; 58; 60; 50" dur="1.05s" repeatCount="indefinite" />
      </line>

      {/* Flood water */}
      <path
        d="M0,60 C10,55 20,65 30,60 C40,55 50,65 60,60 C70,55 80,65 90,60 C100,55 100,70 100,70 L100,100 L0,100 Z"
        fill="#1E90FF"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M0,60 C10,55 20,65 30,60 C40,55 50,65 60,60 C70,55 80,65 90,60 C100,55 100,70 100,70 L100,100 L0,100 Z; M0,61 C10,56 20,66 30,61 C40,56 50,66 60,61 C70,56 80,66 90,61 C100,56 100,71 100,71 L100,100 L0,100 Z; M0,60 C10,55 20,65 30,60 C40,55 50,65 60,60 C70,55 80,65 90,60 C100,55 100,70 100,70 L100,100 L0,100 Z"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.6; 0.7; 0.6" dur="2s" repeatCount="indefinite" />
      </path>
      <path
        d="M0,70 C15,65 30,75 45,70 C60,65 75,75 90,70 C105,65 100,80 100,80 L100,100 L0,100 Z"
        fill="#1E90FF"
        opacity="0.4"
      >
        <animate
          attributeName="d"
          values="M0,70 C15,65 30,75 45,70 C60,65 75,75 90,70 C105,65 100,80 100,80 L100,100 L0,100 Z; M0,71 C15,66 30,76 45,71 C60,66 75,76 90,71 C105,66 100,81 100,81 L100,100 L0,100 Z; M0,70 C15,65 30,75 45,70 C60,65 75,75 90,70 C105,65 100,80 100,80 L100,100 L0,100 Z"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.4; 0.5; 0.4" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Floating animal */}
      <path d="M50,65 C45,60 45,55 50,50 L60,50 C65,55 65,60 60,65 Z" fill="#A0522D" opacity="0.6">
        <animate
          attributeName="d"
          values="M50,65 C45,60 45,55 50,50 L60,50 C65,55 65,60 60,65 Z; M50,66 C45,61 45,56 50,51 L60,51 C65,56 65,61 60,66 Z; M50,65 C45,60 45,55 50,50 L60,50 C65,55 65,60 60,65 Z"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.6; 0.7; 0.6" dur="1.5s" repeatCount="indefinite" />
      </path>
      <circle cx="52" cy="55" r="2" fill="#000000" opacity="0.6">
        <animate attributeName="cy" values="55; 56; 55" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
