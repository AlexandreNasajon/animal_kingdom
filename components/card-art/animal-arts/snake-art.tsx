export function SnakeArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#556B2F" />
          <stop offset="100%" stopColor="#6B8E23" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#snakeGradient)" />
      {/* Ground */}
      <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#8B4513" opacity="0.4" />
      {/* Grass tufts */}
      <path d="M10,70 L12,65 L14,70" stroke="#228B22" strokeWidth="0.5" fill="none" />
      <path d="M30,70 L32,63 L34,70" stroke="#228B22" strokeWidth="0.5" fill="none" />
      <path d="M70,70 L72,65 L74,70" stroke="#228B22" strokeWidth="0.5" fill="none" />
      <path d="M90,70 L92,63 L94,70" stroke="#228B22" strokeWidth="0.5" fill="none" />
      {/* Snake body */}
      <path
        d="M20,50 C30,30 40,60 50,40 C60,20 70,50 80,30"
        fill="none"
        stroke="#2F4F4F"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M20,50 C30,30 40,60 50,40 C60,20 70,50 80,30"
        fill="none"
        stroke="#3CB371"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Snake pattern */}
      <path
        d="M25,45 L27,42 M35,50 L37,47 M45,42 L47,39 M55,35 L57,32 M65,40 L67,37 M75,35 L77,32"
        stroke="#2F4F4F"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Snake head */}
      <circle cx="80" cy="30" r="5" fill="#3CB371" />
      <circle cx="82" cy="28" r="1" fill="#000000" /> {/* Eye */}
      <path d="M85,30 L87,30" stroke="#000000" strokeWidth="1" /> {/* Mouth */}
      <path d="M80,25 L78,23 M80,25 L82,23" stroke="#2F4F4F" strokeWidth="1" /> {/* Tongue */}
    </svg>
  )
}
