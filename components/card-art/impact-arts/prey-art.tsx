export function PreyArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="preyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#preyGradient)" />

      {/* Predator */}
      <path
        d="M60,40 C70,35 75,45 70,50 L75,55 L65,50 C55,55 45,50 50,40 C55,30 65,35 60,40 Z"
        fill="#8B0000"
        opacity="0.7"
      />
      <circle cx="65" cy="40" r="2" fill="#000000" opacity="0.7" />
      <path d="M55,45 L50,50" fill="none" stroke="#8B0000" strokeWidth="2" opacity="0.7" />

      {/* Prey */}
      <path d="M30,60 C25,55 25,50 30,45 L40,45 C45,50 45,55 40,60 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="32" cy="50" r="2" fill="#000000" opacity="0.6" />
      <path d="M35,60 L30,65" fill="none" stroke="#A0522D" strokeWidth="2" opacity="0.6" />

      {/* Hunting scene */}
      <path d="M50,45 L40,50" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
      <path d="M40,50 L35,45" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
      <path d="M40,50 L35,55" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

      {/* Grass */}
      <path d="M10,70 L12,65 L14,70" stroke="#228B22" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M20,70 L22,63 L24,70" stroke="#228B22" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M80,70 L82,65 L84,70" stroke="#228B22" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M90,70 L92,63 L94,70" stroke="#228B22" strokeWidth="0.5" fill="none" opacity="0.6" />
    </svg>
  )
}
