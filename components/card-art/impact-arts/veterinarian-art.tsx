"use client"

export function VeterinarianArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="veterinarianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#veterinarianGradient)" />

      {/* Heart symbol */}
      <path d="M50,20 C65,20 70,35 50,50 C30,35 35,20 50,20 Z" fill="#FF69B4" opacity="0.8">
        <animate
          attributeName="d"
          values="M50,20 C65,20 70,35 50,50 C30,35 35,20 50,20 Z; M50,22 C65,22 70,37 50,52 C30,37 35,22 50,22 Z; M50,20 C65,20 70,35 50,50 C30,35 35,20 50,20 Z"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {/* Stethoscope */}
      <path d="M50,50 L50,60" fill="none" stroke="#ffffff" strokeWidth="2" />
      <circle cx="50" cy="65" r="5" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M45,65 L35,75" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M55,65 L65,75" fill="none" stroke="#ffffff" strokeWidth="2" />

      {/* Animal silhouette */}
      <path
        d="M70,50 C75,45 80,50 75,55 L80,60 L70,55 C65,60 60,55 65,45 C70,40 70,45 70,50 Z"
        fill="#ffffff"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M70,50 C75,45 80,50 75,55 L80,60 L70,55 C65,60 60,55 65,45 C70,40 70,45 70,50 Z; M71,51 C76,46 81,51 76,56 L81,61 L71,56 C66,61 61,56 66,46 C71,41 71,46 71,51 Z; M70,50 C75,45 80,50 75,55 L80,60 L70,55 C65,60 60,55 65,45 C70,40 70,45 70,50 Z"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      <circle cx="75" cy="48" r="1" fill="#000000" opacity="0.6" />

      {/* Plus signs */}
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1s" repeatCount="indefinite" />
        <path d="M20,30 L30,30" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M25,25 L25,35" fill="none" stroke="#ffffff" strokeWidth="1" />
      </g>
      <g>
        <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1s" repeatCount="indefinite" begin="0.5s" />
        <path d="M20,70 L30,70" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M25,65 L25,75" fill="none" stroke="#ffffff" strokeWidth="1" />
      </g>
    </svg>
  )
}
