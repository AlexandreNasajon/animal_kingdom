"use client"

export function DroughtArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="droughtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082">
            <animate attributeName="stop-color" values="#4B0082; #6A287E; #4B0082" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8A2BE2">
            <animate attributeName="stop-color" values="#8A2BE2; #9370DB; #8A2BE2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#droughtGradient)" />

      {/* Cracked earth */}
      <path d="M20,70 L30,60 L40,70 L50,60 L60,70 L70,60 L80,70" fill="none" stroke="#8B4513" strokeWidth="2">
        <animate
          attributeName="d"
          values="M20,70 L30,60 L40,70 L50,60 L60,70 L70,60 L80,70; M20,71 L30,61 L40,71 L50,61 L60,71 L70,61 L80,71; M20,70 L30,60 L40,70 L50,60 L60,70 L70,60 L80,70"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M30,60 L20,50" fill="none" stroke="#8B4513" strokeWidth="2">
        <animate
          attributeName="d"
          values="M30,60 L20,50; M30,61 L20,51; M30,60 L20,50"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M50,60 L50,50" fill="none" stroke="#8B4513" strokeWidth="2">
        <animate
          attributeName="d"
          values="M50,60 L50,50; M50,61 L50,51; M50,60 L50,50"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M70,60 L80,50" fill="none" stroke="#8B4513" strokeWidth="2">
        <animate
          attributeName="d"
          values="M70,60 L80,50; M70,61 L80,51; M70,60 L80,50"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Sun */}
      <circle cx="70" cy="30" r="10" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="r" values="10; 10.5; 10" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M70,15 L70,10" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M70,50 L70,45" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M55,30 L50,30" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M90,30 L85,30" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M60,20 L55,15" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M80,40 L85,45" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M60,40 L55,45" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M80,20 L85,15" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.8; 1; 0.8" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* Dried plants */}
      <path d="M30,70 L25,60 L30,55 L35,60 L30,70" fill="#8B4513" opacity="0.6">
        <animate attributeName="opacity" values="0.6; 0.7; 0.6" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M50,70 L45,60 L50,55 L55,60 L50,70" fill="#8B4513" opacity="0.6">
        <animate attributeName="opacity" values="0.6; 0.7; 0.6" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M70,70 L65,60 L70,55 L75,60 L70,70" fill="#8B4513" opacity="0.6">
        <animate attributeName="opacity" values="0.6; 0.7; 0.6" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* Heat waves */}
      <path d="M20,40 Q25,35 30,40 Q35,45 40,40" fill="none" stroke="#FF4500" strokeWidth="1" opacity="0.5">
        <animate
          attributeName="d"
          values="M20,40 Q25,35 30,40 Q35,45 40,40; M20,41 Q25,36 30,41 Q35,46 40,41; M20,40 Q25,35 30,40 Q35,45 40,40"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.5; 0.7; 0.5" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M30,30 Q35,25 40,30 Q45,35 50,30" fill="none" stroke="#FF4500" strokeWidth="1" opacity="0.5">
        <animate
          attributeName="d"
          values="M30,30 Q35,25 40,30 Q45,35 50,30; M30,31 Q35,26 40,31 Q45,36 50,31; M30,30 Q35,25 40,30 Q45,35 50,30"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.5; 0.7; 0.5" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M40,20 Q45,15 50,20 Q55,25 60,20" fill="none" stroke="#FF4500" strokeWidth="1" opacity="0.5">
        <animate
          attributeName="d"
          values="M40,20 Q45,15 50,20 Q55,25 60,20; M40,21 Q45,16 50,21 Q55,26 60,21; M40,20 Q45,15 50,20 Q55,25 60,20"
          dur="3.5s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.5; 0.7; 0.5" dur="3s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}
