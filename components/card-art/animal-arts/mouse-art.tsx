export function MouseArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="mouseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#mouseGradient)" />

      {/* Ground */}
      <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#CD853F" opacity="0.6" />

      {/* Grass tufts */}
      <path d="M10,70 L12,65 L14,70" stroke="#228B22" strokeWidth="0.5" fill="none" />
      <path d="M20,70 L22,63 L24,70" stroke="#228B22" strokeWidth="0.5" fill="none" />
      <path d="M80,70 L82,65 L84,70" stroke="#228B22" strokeWidth="0.5" fill="none" />
      <path d="M90,70 L92,63 L94,70" stroke="#228B22" strokeWidth="0.5" fill="none" />

      {/* Mouse body */}
      <ellipse cx="50" cy="55" rx="15" ry="10" fill="#A9A9A9" />

      {/* Mouse head */}
      <circle cx="65" cy="50" r="8" fill="#A9A9A9" />

      {/* Mouse ears */}
      <circle cx="62" cy="43" r="4" fill="#C0C0C0" />
      <circle cx="68" cy="43" r="4" fill="#C0C0C0" />

      {/* Mouse eyes */}
      <circle cx="67" cy="48" r="1" fill="#000000" />
      <circle cx="69" cy="48" r="1" fill="#000000" />

      {/* Mouse nose */}
      <circle cx="71" cy="51" r="1" fill="#FF69B4" />

      {/* Mouse whiskers */}
      <line x1="71" y1="51" x2="78" y2="49" stroke="#000000" strokeWidth="0.5" />
      <line x1="71" y1="51" x2="78" y2="51" stroke="#000000" strokeWidth="0.5" />
      <line x1="71" y1="51" x2="78" y2="53" stroke="#000000" strokeWidth="0.5" />

      {/* Mouse tail */}
      <path d="M35,55 C25,55 20,50 15,45" fill="none" stroke="#A9A9A9" strokeWidth="2" />

      {/* Mouse feet */}
      <ellipse cx="45" cy="65" rx="3" ry="1.5" fill="#C0C0C0" />
      <ellipse cx="55" cy="65" rx="3" ry="1.5" fill="#C0C0C0" />
    </svg>
  )
}
