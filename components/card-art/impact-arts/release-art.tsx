export function ReleaseArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="releaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#releaseGradient)" />

      {/* Cage */}
      <rect x="30" y="30" width="40" height="40" fill="none" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="30" y1="40" x2="70" y2="40" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="30" y1="50" x2="70" y2="50" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="30" y1="60" x2="70" y2="60" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="40" y1="30" x2="40" y y1="60" x2="70" y2="60" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="40" y1="30" x2="40" y2="70" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="50" y1="30" x2="50" y2="70" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="60" y1="30" x2="60" y2="70" stroke="#A9A9A9" strokeWidth="2" />

      {/* Open door */}
      <path d="M50,30 L70,30 L70,70 L50,70" fill="none" stroke="#ffffff" strokeWidth="2" />
      <circle cx="55" cy="50" r="2" fill="#ffffff" />

      {/* Animals escaping */}
      <path d="M45,50 C40,45 40,40 45,35 L55,35 C60,40 60,45 55,50 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="47" cy="40" r="2" fill="#000000" opacity="0.6" />

      <path
        d="M60,40 C65,35 70,40 65,45 L70,50 L60,45 C55,50 50,45 55,35 C60,30 60,35 60,40 Z"
        fill="#4682B4"
        opacity="0.6"
        transform="translate(5, -5) scale(0.7)"
      />
      <circle cx="65" cy="38" r="1" fill="#000000" opacity="0.6" transform="translate(5, -5) scale(0.7)" />

      {/* Freedom symbols */}
      <path d="M75,30 L85,20" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M85,20 L80,20" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M85,20 L85,25" fill="none" stroke="#ffffff" strokeWidth="1" />
    </svg>
  )
}
