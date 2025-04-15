export function OctopusArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="octopusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00008B" />
          <stop offset="100%" stopColor="#191970" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#octopusGradient)" />

      {/* Deep sea background */}
      <path d="M0,60 C20,40 35,70 55,60 C75,50 80,70 100,60 L100,100 L0,100 Z" fill="#000080" opacity="0.4" />
      <path d="M0,70 C15,60 30,80 50,70 C70,60 85,80 100,70 L100,100 L0,100 Z" fill="#000080" opacity="0.3" />

      {/* Octopus head */}
      <ellipse cx="50" cy="40" rx="20" ry="25" fill="#800080" />

      {/* Octopus eyes */}
      <circle cx="43" cy="35" r="4" fill="#ffffff" />
      <circle cx="57" cy="35" r="4" fill="#ffffff" />
      <circle cx="43" cy="35" r="2" fill="#000000" />
      <circle cx="57" cy="35" r="2" fill="#000000" />

      {/* Octopus tentacles */}
      <path d="M35,50 C25,60 15,55 10,65" fill="none" stroke="#800080" strokeWidth="3" />
      <path d="M40,60 C35,70 25,75 20,85" fill="none" stroke="#800080" strokeWidth="3" />
      <path d="M50,65 C50,75 45,85 50,95" fill="none" stroke="#800080" strokeWidth="3" />
      <path d="M60,60 C65,70 75,75 80,85" fill="none" stroke="#800080" strokeWidth="3" />
      <path d="M65,50 C75,60 85,55 90,65" fill="none" stroke="#800080" strokeWidth="3" />

      {/* Suction cups */}
      <circle cx="15" cy="55" r="1.5" fill="#9370DB" />
      <circle cx="10" cy="65" r="1.5" fill="#9370DB" />
      <circle cx="25" cy="70" r="1.5" fill="#9370DB" />
      <circle cx="20" cy="85" r="1.5" fill="#9370DB" />
      <circle cx="50" cy="85" r="1.5" fill="#9370DB" />
      <circle cx="50" cy="95" r="1.5" fill="#9370DB" />
      <circle cx="75" cy="70" r="1.5" fill="#9370DB" />
      <circle cx="80" cy="85" r="1.5" fill="#9370DB" />
      <circle cx="85" cy="55" r="1.5" fill="#9370DB" />
      <circle cx="90" cy="65" r="1.5" fill="#9370DB" />

      {/* Bubbles */}
      <circle cx="30" cy="20" r="2" fill="#ffffff" opacity="0.5" />
      <circle cx="35" cy="15" r="1" fill="#ffffff" opacity="0.5" />
      <circle cx="70" cy="15" r="1.5" fill="#ffffff" opacity="0.5" />
      <circle cx="75" cy="20" r="1" fill="#ffffff" opacity="0.5" />
    </svg>
  )
}
