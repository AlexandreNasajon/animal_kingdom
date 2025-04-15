export function FloodArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="floodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#floodGradient)" />

      {/* Rain clouds */}
      <circle cx="30" cy="30" r="10" fill="#708090" opacity="0.8" />
      <circle cx="40" cy="25" r="10" fill="#708090" opacity="0.8" />
      <circle cx="50" cy="30" r="10" fill="#708090" opacity="0.8" />
      <circle cx="60" cy="25" r="10" fill="#708090" opacity="0.8" />
      <circle cx="70" cy="30" r="10" fill="#708090" opacity="0.8" />

      {/* Rain */}
      <line x1="30" y1="40" x2="25" y2="50" stroke="#1E90FF" strokeWidth="2" />
      <line x1="40" y1="35" x2="35" y2="45" stroke="#1E90FF" strokeWidth="2" />
      <line x1="50" y1="40" x2="45" y2="50" stroke="#1E90FF" strokeWidth="2" />
      <line x1="60" y1="35" x2="55" y2="45" stroke="#1E90FF" strokeWidth="2" />
      <line x1="70" y1="40" x2="65" y2="50" stroke="#1E90FF" strokeWidth="2" />

      {/* Flood water */}
      <path
        d="M0,60 C10,55 20,65 30,60 C40,55 50,65 60,60 C70,55 80,65 90,60 C100,55 100,70 100,70 L100,100 L0,100 Z"
        fill="#1E90FF"
        opacity="0.6"
      />
      <path
        d="M0,70 C15,65 30,75 45,70 C60,65 75,75 90,70 C105,65 100,80 100,80 L100,100 L0,100 Z"
        fill="#1E90FF"
        opacity="0.4"
      />

      {/* Floating animal */}
      <path d="M50,65 C45,60 45,55 50,50 L60,50 C65,55 65,60 60,65 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="52" cy="55" r="2" fill="#000000" opacity="0.6" />
    </svg>
  )
}
