export function FisherArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="fisherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#fisherGradient)" />

      {/* Water */}
      <path d="M0,60 C20,50 40,70 60,60 C80,50 100,70 100,60 L100,100 L0,100 Z" fill="#1E90FF" opacity="0.4" />

      {/* Fisher silhouette */}
      <path d="M30,60 L35,30 L45,30 L50,60 Z" fill="#000000" opacity="0.8" />
      <circle cx="40" cy="25" r="5" fill="#000000" opacity="0.8" />

      {/* Fishing rod */}
      <path d="M45,35 L70,20" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M70,20 L70,40" fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d="M70,40 C65,45 60,45 55,40" fill="none" stroke="#ffffff" strokeWidth="1" />

      {/* Fish */}
      <path
        d="M55,40 C60,35 65,40 60,45 L65,50 L55,45 C50,50 40,45 45,35 C50,30 55,35 55,40 Z"
        fill="#ffffff"
        opacity="0.6"
      />
      <circle cx="60" cy="38" r="1" fill="#000000" opacity="0.6" />
    </svg>
  )
}
