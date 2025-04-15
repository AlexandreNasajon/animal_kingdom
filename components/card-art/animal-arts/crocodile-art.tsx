export function CrocodileArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="crocodileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006400" />
          <stop offset="100%" stopColor="#228B22" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#crocodileGradient)" />

      {/* Water and land division */}
      <path d="M0,50 L100,50 L100,100 L0,100 Z" fill="#104e8b" opacity="0.3" />

      {/* Lily pads */}
      <circle cx="20" cy="60" r="5" fill="#3CB371" opacity="0.5" />
      <circle cx="80" cy="65" r="7" fill="#3CB371" opacity="0.5" />

      {/* Crocodile body */}
      <path d="M30,50 L70,50 C75,50 75,55 70,55 L30,55 C25,55 25,50 30,50 Z" fill="#2E8B57" />

      {/* Crocodile head */}
      <path d="M70,50 L85,45 L85,55 L70,55 Z" fill="#2E8B57" />

      {/* Crocodile eyes */}
      <circle cx="75" cy="48" r="1.5" fill="#000000" />
      <circle cx="75" cy="52" r="1.5" fill="#000000" />

      {/* Crocodile teeth */}
      <path
        d="M70,50 L72,52 L74,50 L76,52 L78,50 L80,52 L82,50 L84,52"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.5"
      />

      {/* Crocodile tail */}
      <path d="M30,52.5 L15,52.5 L10,57.5" fill="none" stroke="#2E8B57" strokeWidth="5" />

      {/* Crocodile legs */}
      <path d="M40,55 L40,60 L45,60" fill="none" stroke="#2E8B57" strokeWidth="3" />
      <path d="M60,55 L60,60 L65,60" fill="none" stroke="#2E8B57" strokeWidth="3" />

      {/* Water ripples */}
      <path d="M25,65 C30,63 35,67 40,65" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
      <path d="M50,70 C55,68 60,72 65,70" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
    </svg>
  )
}
