export function DolphinArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="dolphinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077be" />
          <stop offset="100%" stopColor="#00a0d2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#dolphinGradient)" />

      {/* Ocean waves */}
      <path d="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z" fill="#005a87" opacity="0.4" />
      <path d="M0,80 C25,70 45,90 75,80 C85,75 95,85 100,80 L100,100 L0,100 Z" fill="#004a77" opacity="0.3" />

      {/* Dolphin body */}
      <path
        d="M30,60 C35,40 45,30 60,35 C75,40 85,30 85,45 C85,55 75,65 65,60 C55,65 45,70 35,65 C25,60 25,70 30,60 Z"
        fill="#708090"
        stroke="#2c3e50"
        strokeWidth="1"
      />

      {/* Dolphin fin */}
      <path d="M55,35 L45,20 L60,40" fill="#708090" stroke="#2c3e50" strokeWidth="1" />

      {/* Dolphin tail */}
      <path d="M30,60 L20,50 L25,65 L15,70 L30,65" fill="#708090" stroke="#2c3e50" strokeWidth="1" />

      {/* Dolphin eye */}
      <circle cx="70" cy="45" r="2" fill="#000000" />

      {/* Water splash */}
      <path d="M75,30 C80,25 85,30 80,35" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
      <circle cx="80" cy="25" r="1" fill="#ffffff" opacity="0.7" />
      <circle cx="85" cy="28" r="1.5" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}
