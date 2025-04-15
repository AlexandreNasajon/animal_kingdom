export function DomesticateArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="domesticateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#domesticateGradient)" />

      {/* House */}
      <path d="M30,60 L30,40 L50,25 L70,40 L70,60 Z" fill="#ffffff" opacity="0.3" />
      <rect x="45" y="45" width="10" height="15" fill="#ffffff" opacity="0.3" />

      {/* Person */}
      <circle cx="40" cy="45" r="5" fill="#ffffff" opacity="0.7" />
      <path d="M40,50 L40,60" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
      <path d="M35,55 L45,55" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
      <path d="M35,65 L40,60" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
      <path d="M45,65 L40,60" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />

      {/* Animal */}
      <path d="M60,55 C55,50 55,45 60,40 L70,40 C75,45 75,50 70,55 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="62" cy="45" r="2" fill="#000000" opacity="0.6" />
      <path d="M70,50 L75,55" fill="none" stroke="#A0522D" strokeWidth="2" opacity="0.6" />

      {/* Heart */}
      <path
        d="M50,35 C53,30 58,30 60,35 C62,30 67,30 70,35 C72,40 70,45 65,50 C60,55 55,55 50,50 C45,45 43,40 45,35 C47,30 52,30 55,35 Z"
        fill="#FF69B4"
        opacity="0.5"
      />
    </svg>
  )
}
