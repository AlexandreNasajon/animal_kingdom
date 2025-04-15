export function CageArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="cageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#cageGradient)" />

      {/* Cage */}
      <rect x="30" y="30" width="40" height="40" fill="none" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="30" y1="40" x2="70" y2="40" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="30" y1="50" x2="70" y2="50" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="30" y1="60" x2="70" y2="60" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="40" y1="30" x2="40" y2="70" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="50" y1="30" x2="50" y2="70" stroke="#A9A9A9" strokeWidth="2" />
      <line x1="60" y1="30" x2="60" y2="70" stroke="#A9A9A9" strokeWidth="2" />

      {/* Animal inside cage */}
      <path d="M50,55 C45,50 45,45 50,40 L60,40 C65,45 65,50 60,55 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="52" cy="45" r="2" fill="#000000" opacity="0.6" />

      {/* Person with key */}
      <circle cx="20" cy="50" r="5" fill="#ffffff" opacity="0.7" />
      <path d="M20,55 L20,65" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
      <path d="M15,60 L25,60" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
      <path d="M15,70 L20,65" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
      <path d="M25,70 L20,65" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />

      {/* Key */}
      <path d="M25,50 L35,50" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <circle cx="35" cy="50" r="3" fill="#FFD700" opacity="0.8" />
      <path d="M35,47 L35,53" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.8" />
      <path d="M37,47 L37,53" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.8" />
    </svg>
  )
}
