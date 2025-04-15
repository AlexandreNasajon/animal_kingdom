export function AquaticArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="aquaticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#104e8b" />
          <stop offset="100%" stopColor="#1874CD" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#aquaticGradient)" />

      {/* Waves */}
      <path d="M0,60 C20,40 35,70 55,60 C75,50 80,70 100,60 L100,100 L0,100 Z" fill="#2c8cdd" opacity="0.6" />
      <path d="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z" fill="#1e5799" opacity="0.4" />

      {/* Fish silhouette */}
      <path
        d="M60,40 C70,35 75,45 80,40 L75,50 L80,60 C75,55 70,65 60,60 C50,65 40,60 35,50 C40,40 50,35 60,40 Z"
        fill="#ffffff"
        opacity="0.8"
      />
      <circle cx="70" cy="45" r="2" fill="#000000" />
    </svg>
  )
}
