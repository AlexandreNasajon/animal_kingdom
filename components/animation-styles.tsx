"use client"

export function AnimationStyles() {
  return (
    <style jsx global>{`
      /* Card animations */
      @keyframes draw {
        0% {
          transform: translateY(-100px) rotate(-5deg);
          opacity: 0;
        }
        100% {
          transform: translateY(0) rotate(0);
          opacity: 1;
        }
      }

      @keyframes play {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1) rotate(5deg);
        }
        100% {
          transform: scale(1) rotate(0);
        }
      }

      @keyframes play-terrestrial {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(239, 68, 68, 0);
        }
        50% {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.7);
        }
        100% {
          transform: scale(1) rotate(0);
          box-shadow: 0 0 0 rgba(239, 68, 68, 0);
        }
      }

      @keyframes play-aquatic {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(59, 130, 246, 0);
        }
        50% {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
        }
        100% {
          transform: scale(1) rotate(0);
          box-shadow: 0 0 0 rgba(59, 130, 246, 0);
        }
      }

      @keyframes play-amphibian {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(34, 197, 94, 0);
        }
        50% {
          transform: scale(1.1) rotate(3deg);
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.7);
        }
        100% {
          transform: scale(1) rotate(0);
          box-shadow: 0 0 0 rgba(34, 197, 94, 0);
        }
      }

      @keyframes play-impact {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(168, 85, 247, 0);
        }
        50% {
          transform: scale(1.1) rotate(-3deg);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
        }
        100% {
          transform: scale(1) rotate(0);
          box-shadow: 0 0 0 rgba(168, 85, 247, 0);
        }
      }

      @keyframes hand-to-field {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-50px) scale(1.2);
          opacity: 1;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes field-to-discard {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(50px) scale(0.8);
          opacity: 0;
        }
      }

      @keyframes field-to-deck {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-50px) scale(0.8);
          opacity: 0;
        }
      }

      @keyframes exchange {
        0% {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateX(20px) scale(1.1);
          opacity: 0.7;
        }
        100% {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes being-targeted {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 255, 0, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(255, 255, 0, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 255, 0, 0);
        }
      }

      @keyframes flip {
        0% {
          transform: rotateY(90deg);
          opacity: 0;
        }
        100% {
          transform: rotateY(0);
          opacity: 1;
        }
      }

      @keyframes ai-card-play {
        0% {
          transform: scale(0.8);
          opacity: 0;
        }
        20% {
          transform: scale(1.2);
          opacity: 1;
        }
        80% {
          transform: scale(1.2);
          opacity: 1;
        }
        100% {
          transform: scale(0.8);
          opacity: 0;
        }
      }

      @keyframes ai-draw {
        0% {
          transform: translate(0, -50px) scale(0.8);
          opacity: 0;
        }
        100% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
      }

      @keyframes discard {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(100px, 100px) rotate(45deg);
          opacity: 0;
        }
      }

      @keyframes ai-thinking {
        0% {
          opacity: 0.3;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.3;
        }
      }

      @keyframes flash {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      /* Idle animations for cards on the field */
      @keyframes breathe {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes wiggle {
        0% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(1deg);
        }
        75% {
          transform: rotate(-1deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }

      @keyframes bounce-slow {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-2px);
        }
        100% {
          transform: translateY(0);
        }
      }

      @keyframes sway {
        0% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(2px);
        }
        100% {
          transform: translateX(0);
        }
      }

      /* Environment-specific animations */
      @keyframes terrestrial {
        0% {
          box-shadow: inset 0 0 5px rgba(255, 100, 100, 0.3);
        }
        50% {
          box-shadow: inset 0 0 10px rgba(255, 100, 100, 0.5);
        }
        100% {
          box-shadow: inset 0 0 5px rgba(255, 100, 100, 0.3);
        }
      }

      @keyframes aquatic {
        0% {
          box-shadow: inset 0 0 5px rgba(100, 100, 255, 0.3);
        }
        50% {
          box-shadow: inset 0 0 10px rgba(100, 100, 255, 0.5);
        }
        100% {
          box-shadow: inset 0 0 5px rgba(100, 100, 255, 0.3);
        }
      }

      @keyframes amphibian {
        0% {
          box-shadow: inset 0 0 5px rgba(100, 255, 100, 0.3);
        }
        50% {
          box-shadow: inset 0 0 10px rgba(100, 255, 100, 0.5);
        }
        100% {
          box-shadow: inset 0 0 5px rgba(100, 255, 100, 0.3);
        }
      }

      /* Impact card animations */
      @keyframes pulse-slow {
        0% {
          box-shadow: 0 0 0 0 rgba(128, 0, 128, 0.4);
        }
        70% {
          box-shadow: 0 0 0 5px rgba(128, 0, 128, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(128, 0, 128, 0);
        }
      }

      @keyframes glow {
        0% {
          filter: brightness(1);
        }
        50% {
          filter: brightness(1.2);
        }
        100% {
          filter: brightness(1);
        }
      }

      @keyframes rotate-slow {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      /* Apply animations */
      .animate-draw {
        animation: draw 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-play {
        animation: play 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-play-terrestrial {
        animation: play-terrestrial 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-play-aquatic {
        animation: play-aquatic 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-play-amphibian {
        animation: play-amphibian 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-play-impact {
        animation: play-impact 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-hand-to-field {
        animation: hand-to-field 1.5s ease-in-out; /* Increased from 1s to 1.5s */
      }

      .animate-field-to-discard {
        animation: field-to-discard 1.5s ease-in-out; /* Increased from 1s to 1.5s */
      }

      .animate-field-to-deck {
        animation: field-to-deck 1.5s ease-in-out; /* Increased from 1s to 1.5s */
      }

      .animate-exchange {
        animation: exchange 1.5s ease-in-out; /* Increased from 1s to 1.5s */
      }

      .animate-being-targeted {
        animation: being-targeted 1.5s ease-in-out infinite; /* Increased from 1s to 1.5s */
      }

      .animate-flip {
        animation: flip 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-ai-card-play {
        animation: ai-card-play 2s ease-in-out forwards; /* Increased from 1.5s to 2s */
      }

      .animate-ai-draw {
        animation: ai-draw 1.5s ease-in-out forwards; /* Increased from 1s to 1.5s */
      }

      .animate-discard {
        animation: discard 1.5s ease-in-out forwards; /* Increased from 1s to 1.5s */
      }

      .animate-ai-thinking {
        animation: ai-thinking 1.5s ease-in-out infinite; /* Increased from 1s to 1.5s */
      }

      .animate-flash {
        animation: flash 1.5s ease-in-out infinite; /* Increased from 1s to 1.5s */
      }

      .animate-breathe {
        animation: breathe 4s ease-in-out infinite;
      }

      .animate-wiggle {
        animation: wiggle 5s ease-in-out infinite;
      }

      .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
      }

      .animate-sway {
        animation: sway 4s ease-in-out infinite;
      }

      .animate-pulse-slow {
        animation: pulse-slow 3s infinite;
      }

      .animate-glow {
        animation: glow 4s ease-in-out infinite;
      }

      .animate-rotate-slow {
        animation: rotate-slow 20s linear infinite;
      }

      /* Card zoom effect */
      .card-zoom-container {
        position: relative;
      }

      .card-zoom {
        transition: transform 0.3s ease-in-out;
      }

      .card-zoom:hover {
        transform: translateY(-5px) scale(1.05);
        z-index: 10;
      }

      /* Card back pattern */
      .card-back-pattern {
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
          45deg,
          rgba(0, 100, 0, 0.2) 0px,
          rgba(0, 100, 0, 0.2) 2px,
          transparent 2px,
          transparent 4px
        );
      }
    `}</style>
  )
}
