export function ScareArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="scareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#scareGradient)" />

      {/* Spooky background */}
      <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#2F4F4F" opacity="0.4" />

      {/* Ghost */}
      <path
        d="M50,30 C60,30 70,40 70,50 C70,60 70,70 70,80 C65,75 60,80 55,75 C50,80 45,75 40,80 C40,70 40,60 40,50 C40,40 45,30 50,30 Z"
        fill="#ffffff"
        opacity="0.8"
      />
      <circle cx="45" cy="45" r="3" fill="#000000" opacity="0.8" />
      <circle cx="55" cy="45" r="3" fill="#000000" opacity="0.8" />
      <path d="M45,55 C50,60 55,60 60,55" fill="none" stroke="#000000" strokeWidth="2" />

      {/* Scared animal */}
      <path d="M20,60 C15,55 15,50 20,45 L30,45 C35,50 35,55 30,60 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="22" cy="50" r="2" fill="#000000" opacity="0.6" />
      <path d="M25,55 L20,60" fill="none" stroke="#000000" strokeWidth="1" opacity="0.6" />
      <path d="M25,55 L30,60" fill="none" stroke="#000000" strokeWidth="1" opacity="0.6" />

      {/* Exclamation marks */}
      <text x="15" y="40" fontSize="10" fill="#ffffff" opacity="0.8">
        !
      </text>
      <text x="80" y="40" fontSize="10" fill="#ffffff" opacity="0.8">
        !
      </text>
    </svg>
  )
}
