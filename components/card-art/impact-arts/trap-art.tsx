export function TrapArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="trapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#trapGradient)" />

      {/* Trap */}
      <rect x="30" y="60" width="40" height="5" fill="#8B4513" />
      <path d="M35,60 L35,40" fill="none" stroke="#8B4513" strokeWidth="2" />
      <path d="M65,60 L65,40" fill="none" stroke="#8B4513" strokeWidth="2" />
      <path d="M35,40 C40,30 60,30 65,40" fill="none" stroke="#8B4513" strokeWidth="2" />

      {/* Net */}
      <path d="M35,40 L65,40" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
      <path d="M40,35 L60,35" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
      <path d="M45,30 L55,30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
      <path d="M35,40 L35,60" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
      <path d="M45,40 L45,60" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
      <path d="M55,40 L55,60" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
      <path d="M65,40 L65,60" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />

      {/* Animal */}
      <path d="M50,50 C45,45 45,40 50,35 L60,35 C65,40 65,45 60,50 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="52" cy="40" r="2" fill="#000000" opacity="0.6" />
      <path d="M60,45 L65,50" fill="none" stroke="#A0522D" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}
