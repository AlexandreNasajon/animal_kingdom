export function EpidemicArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="epidemicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#epidemicGradient)" />

      {/* Virus particles */}
      <circle cx="50" cy="50" r="15" fill="#32CD32" opacity="0.6" />
      <path d="M50,35 L50,25" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />
      <path d="M50,65 L50,75" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />
      <path d="M35,50 L25,50" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />
      <path d="M65,50 L75,50" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />
      <path d="M40,40 L33,33" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />
      <path d="M60,60 L67,67" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />
      <path d="M40,60 L33,67" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />
      <path d="M60,40 L67,33" fill="none" stroke="#32CD32" strokeWidth="2" opacity="0.6" />

      {/* Smaller virus particles */}
      <circle cx="25" cy="30" r="5" fill="#32CD32" opacity="0.4" />
      <circle cx="75" cy="30" r="5" fill="#32CD32" opacity="0.4" />
      <circle cx="25" cy="70" r="5" fill="#32CD32" opacity="0.4" />
      <circle cx="75" cy="70" r="5" fill="#32CD32" opacity="0.4" />

      {/* Sick animals */}
      <path d="M30,60 C25,55 25,50 30,45 L40,45 C45,50 45,55 40,60 Z" fill="#A0522D" opacity="0.5" />
      <circle cx="32" cy="50" r="2" fill="#000000" opacity="0.5" />
      <path d="M35,55 L30,60" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.8" />
      <path d="M35,55 L40,60" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.8" />

      <path d="M70,60 C65,55 65,50 70,45 L80,45 C85,50 85,55 80,60 Z" fill="#4682B4" opacity="0.5" />
      <circle cx="72" cy="50" r="2" fill="#000000" opacity="0.5" />
      <path d="M75,55 L70,60" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.8" />
      <path d="M75,55 L80,60" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.8" />
    </svg>
  )
}
