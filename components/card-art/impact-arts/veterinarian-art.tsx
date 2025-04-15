export function VeterinarianArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="vetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#vetGradient)" />

      {/* Background */}
      <rect x="20" y="30" width="60" height="40" rx="5" fill="#ffffff" opacity="0.2" />

      {/* Veterinarian */}
      <circle cx="40" cy="40" r="10" fill="#ffffff" opacity="0.8" />
      <path d="M40,50 L40,70" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
      <path d="M30,55 L50,55" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
      <path d="M30,65 L35,75" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
      <path d="M50,65 L45,75" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.8" />

      {/* Stethoscope */}
      <path d="M35,45 C30,50 30,55 35,60" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
      <circle cx="35" cy="60" r="3" fill="#ffffff" opacity="0.8" />

      {/* Animal */}
      <ellipse cx="65" cy="60" rx="10" ry="7" fill="#A0522D" opacity="0.6" />
      <circle cx="70" cy="57" r="2" fill="#000000" opacity="0.6" />
      <path d="M60,60 C62,63 68,63 70,60" fill="none" stroke="#000000" strokeWidth="1" opacity="0.6" />
      <path d="M75,60 L80,65" fill="none" stroke="#A0522D" strokeWidth="2" opacity="0.6" />

      {/* Medical cross */}
      <path d="M75,35 L85,35 M80,30 L80,40" fill="none" stroke="#FF0000" strokeWidth="2" />
    </svg>
  )
}
