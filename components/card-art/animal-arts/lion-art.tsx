"use client"

export function LionArt() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a76a">
            <animate attributeName="stopColor" values="#d4a76a; #e6be8a; #d4a76a" dur="5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#c68642">
            <animate attributeName="stopColor" values="#c68642; #d4a76a; #c68642" dur="5s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#lionGradient)" />

      {/* Animated Savanna */}
      <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#d2b48c" opacity="0.6">
        <animate
          attributeName="d"
          values="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z;
                 M0,71 Q25,66 50,71 T100,71 L100,100 L0,100 Z;
                 M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M10,80 L15,75 L20,80 L25,75 L30,80 L35,75 L40,80 L45,75 L50,80 L55,75 L60,80 L65,75 L70,80 L75,75 L80,80 L85,75 L90,80"
        stroke="#8b4513"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      >
        <animate
          attributeName="d"
          values="M10,80 L15,75 L20,80 L25,75 L30,80 L35,75 L40,80 L45,75 L50,80 L55,75 L60,80 L65,75 L70,80 L75,75 L80,80 L85,75 L90,80;
                 M10,81 L15,76 L20,81 L25,76 L30,81 L35,76 L40,81 L45,76 L50,81 L55,76 L60,81 L65,76 L70,81 L75,76 L80,81 L85,76 L90,81;
                 M10,80 L15,75 L20,80 L25,75 L30,80 L35,75 L40,80 L45,75 L50,80 L55,75 L60,80 L65,75 L70,80 L75,75 L80,80 L85,75 L90,80"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Lion Body */}
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#e6be8a">
        <animate attributeName="ry" values="18;17.5;18" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Lion Mane */}
      <circle cx="35" cy="45" r="18" fill="#d4a76a">
        <animate attributeName="r" values="18;18.5;18" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Lion Head */}
      <circle cx="30" cy="45" r="12" fill="#e6be8a">
        <animate attributeName="cy" values="45;44.5;45" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Lion Ears */}
      <circle cx="25" cy="35" r="4" fill="#c68642" />
      <circle cx="35" cy="35" r="4" fill="#c68642" />

      {/* Lion Face */}
      <circle cx="25" cy="42" r="2" fill="#000000">
        <animate attributeName="r" values="2;1.8;2" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="35" cy="42" r="2" fill="#000000">
        <animate attributeName="r" values="2;1.8;2" dur="5s" repeatCount="indefinite" />
      </circle>
      <path d="M27,48 Q30,50 33,48" stroke="#000000" strokeWidth="1" fill="none" />

      {/* Lion Tail */}
      <path d="M70,50 Q80,45 85,55 Q87,60 83,65" stroke="#d4a76a" strokeWidth="4" fill="none" strokeLinecap="round">
        <animate
          attributeName="d"
          values="M70,50 Q80,45 85,55 Q87,60 83,65;
                 M70,50 Q80,47 85,57 Q87,62 83,67;
                 M70,50 Q80,45 85,55 Q87,60 83,65"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <circle cx="83" cy="65" r="3" fill="#8b4513">
        <animate attributeName="cy" values="65;67;65" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Lion Legs */}
      <rect x="35" y="60" width="5" height="15" rx="2" fill="#e6be8a">
        <animate attributeName="height" values="15;14;15" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="60" y="60" width="5" height="15" rx="2" fill="#e6be8a">
        <animate attributeName="height" values="15;14;15" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </rect>
      <rect x="40" y="60" width="5" height="15" rx="2" fill="#e6be8a">
        <animate attributeName="height" values="15;14;15" dur="3s" repeatCount="indefinite" begin="0.5s" />
      </rect>
      <rect x="55" y="60" width="5" height="15" rx="2" fill="#e6be8a">
        <animate attributeName="height" values="15;14;15" dur="3s" repeatCount="indefinite" begin="2s" />
      </rect>
    </svg>
  )
}
