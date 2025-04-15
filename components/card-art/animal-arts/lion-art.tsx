export function LionArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a76a" />
          <stop offset="100%" stopColor="#c68642" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#lionGradient)" />

      {/* Savanna */}
      <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#d2b48c" opacity="0.6" />
      <path
        d="M10,80 L15,75 L20,80 L25,75 L30,80 L35,75 L40,80 L45,75 L50,80 L55,75 L60,80 L65,75 L70,80 L75,75 L80,80 L85,75 L90,80"
        stroke="#8b4513"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />

      {/* Lion mane */}
      <circle cx="50" cy="40" r="20" fill="#b8860b" />

      {/* Lion face */}
      <circle cx="50" cy="40" r="12" fill="#e6be8a" />

      {/* Lion eyes */}
      <circle cx="45" cy="36" r="2" fill="#000000" />
      <circle cx="55" cy="36" r="2" fill="#000000" />

      {/* Lion nose */}
      <path d="M48,42 L52,42 L50,45 Z" fill="#000000" />

      {/* Lion mouth */}
      <path d="M46,48 C48,50 52,50 54,48" fill="none" stroke="#000000" strokeWidth="1" />

      {/* Lion body */}
      <path d="M40,60 C35,55 35,50 40,45 L60,45 C65,50 65,55 60,60 Z" fill="#e6be8a" />

      {/* Lion legs */}
      <rect x="42" y="60" width="5" height="15" fill="#e6be8a" />
      <rect x="53" y="60" width="5" height="15" fill="#e6be8a" />

      {/* Lion tail */}
      <path d="M60,55 C70,50 75,60 70,65 L75,70" fill="none" stroke="#e6be8a" strokeWidth="3" />
      <circle cx="75" cy="70" r="2" fill="#b8860b" />
    </svg>
  )
}
