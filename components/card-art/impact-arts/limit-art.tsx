export function LimitArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="limitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#limitGradient)" />

      {/* Boundary line */}
      <path d="M50,20 L50,80" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="5,3" />

      {/* Stop sign */}
      <polygon points="30,40 40,30 60,30 70,40 70,60 60,70 40,70 30,60" fill="#FF0000" opacity="0.8" />
      <text x="40" y="55" fontSize="15" fill="#ffffff" fontWeight="bold">
        STOP
      </text>

      {/* Animal silhouette */}
      <path
        d="M75,50 C80,45 85,50 80,55 L85,60 L75,55 C70,60 65,55 70,45 C75,40 75,45 75,50 Z"
        fill="#ffffff"
        opacity="0.6"
      />
      <circle cx="80" cy="48" r="1" fill="#000000" opacity="0.6" />

      {/* Boundary effect */}
      <path d="M45,30 L55,30" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M45,40 L55,40" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M45,50 L55,50" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M45,60 L55,60" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M45,70 L55,70" fill="none" stroke="#ffffff" strokeWidth="1" />
    </svg>
  )
}
