"use client"

export function OctopusArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="octopusWater" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00008B" />
          <stop offset="100%" stopColor="#0000CD" />
        </linearGradient>

        <linearGradient id="octopusBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#800080" />
          <stop offset="100%" stopColor="#9370DB" />
        </linearGradient>
      </defs>

      {/* Background - deep ocean */}
      <rect x="0" y="0" width="100" height="100" fill="url(#octopusWater)" />

      {/* Deep water texture */}
      <path d="M0,0 Q25,5 50,0 Q75,5 100,0 L100,20 L0,20 Z" fill="#000080" opacity="0.3">
        <animate
          attributeName="d"
          values="M0,0 Q25,5 50,0 Q75,5 100,0 L100,20 L0,20 Z;
                 M0,0 Q25,3 50,6 Q75,3 100,0 L100,20 L0,20 Z;
                 M0,0 Q25,5 50,0 Q75,5 100,0 L100,20 L0,20 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>

      {/* Octopus */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,2; 0,0; 0,-2; 0,0"
          dur="5s"
          repeatCount="indefinite"
        />

        {/* Octopus head/body */}
        <ellipse cx="50" cy="40" rx="15" ry="12" fill="url(#octopusBody)" stroke="#4B0082" strokeWidth="0.5">
          <animate attributeName="ry" values="12;11;12;13;12" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Octopus eyes */}
        <circle cx="45" cy="35" r="2" fill="#ffffff" />
        <circle cx="55" cy="35" r="2" fill="#ffffff" />
        <circle cx="45" cy="35" r="1" fill="#000000" />
        <circle cx="55" cy="35" r="1" fill="#000000" />

        {/* Octopus tentacles */}
        <path d="M40,50 Q35,60 30,70 Q25,80 20,90" fill="none" stroke="#800080" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M40,50 Q35,60 30,70 Q25,80 20,90;
                   M40,50 Q38,60 33,70 Q28,80 23,90;
                   M40,50 Q35,60 30,70 Q25,80 20,90"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M45,50 Q45,65 45,80 Q45,85 45,90" fill="none" stroke="#800080" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M45,50 Q45,65 45,80 Q45,85 45,90;
                   M45,50 Q48,65 48,80 Q48,85 48,90;
                   M45,50 Q45,65 45,80 Q45,85 45,90"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M50,50 Q55,65 60,80 Q65,85 70,90" fill="none" stroke="#800080" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M50,50 Q55,65 60,80 Q65,85 70,90;
                   M50,50 Q52,65 57,80 Q62,85 67,90;
                   M50,50 Q55,65 60,80 Q65,85 70,90"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M55,50 Q65,60 75,70 Q80,75 85,80" fill="none" stroke="#800080" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M55,50 Q65,60 75,70 Q80,75 85,80;
                   M55,50 Q62,60 72,70 Q77,75 82,80;
                   M55,50 Q65,60 75,70 Q80,75 85,80"
            dur="4.2s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M60,50 Q70,55 80,60 Q85,65 90,70" fill="none" stroke="#800080" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M60,50 Q70,55 80,60 Q85,65 90,70;
                   M60,50 Q67,55 77,60 Q82,65 87,70;
                   M60,50 Q70,55 80,60 Q85,65 90,70"
            dur="3.8s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M40,50 Q30,55 20,60 Q15,65 10,70" fill="none" stroke="#800080" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M40,50 Q30,55 20,60 Q15,65 10,70;
                   M40,50 Q33,55 23,60 Q18,65 13,70;
                   M40,50 Q30,55 20,60 Q15,65 10,70"
            dur="4.3s"
            repeatCount="indefinite"
          />
        </path>

        <path d="M35,50 Q25,60 15,70 Q10,75 5,80" fill="none" stroke="#800080" strokeWidth="2" strokeLinecap="round">
          <animate
            attributeName="d"
            values="M35,50 Q25,60 15,70 Q10,75 5,80;
                   M35,50 Q28,60 18,70 Q13,75 8,80;
                   M35,50 Q25,60 15,70 Q10,75 5,80"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Bubbles */}
      <circle cx="30" cy="30" r="1" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="30;10;-10" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="7s" repeatCount="indefinite" />
      </circle>

      <circle cx="70" cy="25" r="1.5" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="25;5;-15" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="8s" repeatCount="indefinite" />
      </circle>

      <circle cx="60" cy="20" r="1" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="20;0;-20" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
