export function ConfuseArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="confuseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#confuseGradient)" />

      {/* Swirling background */}
      <path
        d="M20,50 C30,30 70,70 80,50 C70,30 30,70 20,50 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Animal 1 */}
      <path d="M30,50 C25,45 25,40 30,35 L40,35 C45,40 45,45 40,50 Z" fill="#A0522D" opacity="0.6" />
      <circle cx="32" cy="40" r="2" fill="#000000" opacity="0.6" />

      {/* Animal 2 */}
      <path d="M70,50 C65,45 65,40 70,35 L80,35 C85,40 85,45 80,50 Z" fill="#4682B4" opacity="0.6" />
      <circle cx="72" cy="40" r="2" fill="#000000" opacity="0.6" />

      {/* Exchange arrows */}
      <path d="M45,40 L55,40" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M55,40 L50,35" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M55,40 L50,45" fill="none" stroke="#ffffff" strokeWidth="2" />

      <path d="M55,50 L45,50" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M45,50 L50,45" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M45,50 L50,55" fill="none" stroke="#ffffff" strokeWidth="2" />

      {/* Question marks */}
      <text x="35" y="70" fontSize="15" fill="#ffffff" opacity="0.8">
        ?
      </text>
      <text x="65" y="70" fontSize="15" fill="#ffffff" opacity="0.8">
        ?
      </text>
    </svg>
  )
}
