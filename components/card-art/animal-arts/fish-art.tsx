export function FishArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#104e8b" />
          <stop offset="100%" stopColor="#1874CD" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#fishGradient)" />

      {/* Water */}
      <path d="M0,60 C20,40 35,70 55,60 C75,50 80,70 100,60 L100,100 L0,100 Z" fill="#2c8cdd" opacity="0.6" />
      <path d="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z" fill="#1e5799" opacity="0.4" />

      {/* Fish body */}
      <path
        d="M65,50 C80,40 85,60 75,65 L80,70 L70,65 C60,70 40,65 35,50 C40,35 60,30 65,50 Z"
        fill="#f0f0f0"
        stroke="#333"
        strokeWidth="1"
      />

      {/* Fish eye */}
      <circle cx="70" cy="45" r="3" fill="#000000" />

      {/* Fish fins */}
      <path d="M50,40 L40,30 L50,45" fill="#f0f0f0" stroke="#333" strokeWidth="1" />
      <path d="M50,60 L40,70 L50,55" fill="#f0f0f0" stroke="#333" strokeWidth="1" />

      {/* Bubbles */}
      <circle cx="25" cy="30" r="2" fill="#ffffff" opacity="0.7" />
      <circle cx="30" cy="40" r="3" fill="#ffffff" opacity="0.7" />
      <circle cx="20" cy="50" r="1.5" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}
