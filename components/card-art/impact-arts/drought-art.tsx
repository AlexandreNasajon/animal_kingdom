export function DroughtArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="droughtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#droughtGradient)" />

      {/* Cracked earth */}
      <path d="M20,70 L30,60 L40,70 L50,60 L60,70 L70,60 L80,70" fill="none" stroke="#8B4513" strokeWidth="2" />
      <path d="M30,60 L20,50" fill="none" stroke="#8B4513" strokeWidth="2" />
      <path d="M50,60 L50,50" fill="none" stroke="#8B4513" strokeWidth="2" />
      <path d="M70,60 L80,50" fill="none" stroke="#8B4513" strokeWidth="2" />

      {/* Sun */}
      <circle cx="70" cy="30" r="10" fill="#FFD700" opacity="0.8" />
      <path d="M70,15 L70,10" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <path d="M70,50 L70,45" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <path d="M55,30 L50,30" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <path d="M90,30 L85,30" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <path d="M60,20 L55,15" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <path d="M80,40 L85,45" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <path d="M60,40 L55,45" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      <path d="M80,20 L85,15" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />

      {/* Dried plants */}
      <path d="M30,70 L25,60 L30,55 L35,60 L30,70" fill="#8B4513" opacity="0.6" />
      <path d="M50,70 L45,60 L50,55 L55,60 L50,70" fill="#8B4513" opacity="0.6" />
      <path d="M70,70 L65,60 L70,55 L75,60 L70,70" fill="#8B4513" opacity="0.6" />

      {/* Heat waves */}
      <path d="M20,40 Q25,35 30,40 Q35,45 40,40" fill="none" stroke="#FF4500" strokeWidth="1" opacity="0.5" />
      <path d="M30,30 Q35,25 40,30 Q45,35 50,30" fill="none" stroke="#FF4500" strokeWidth="1" opacity="0.5" />
      <path d="M40,20 Q45,15 50,20 Q55,25 60,20" fill="none" stroke="#FF4500" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}
