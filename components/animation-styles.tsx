"use client"

export function AnimationStyles() {
  return (
    <style jsx global>{`
      /* Card animations */
      @keyframes draw {
        0% {
          transform: translateY(-20px) scale(0.9);
          opacity: 0;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes hand-to-field {
        0% {
          transform: translateY(-20px) scale(0.9);
          opacity: 0.8;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes field-to-discard {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(25px) rotate(10deg) scale(0.9);
          opacity: 0.7;
        }
        100% {
          transform: translateY(50px) rotate(25deg) scale(0.7);
          opacity: 0;
        }
      }

      @keyframes field-to-deck {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-25px) scale(0.9);
          opacity: 0.7;
        }
        100% {
          transform: translateY(-50px) scale(0.7);
          opacity: 0;
        }
      }

      @keyframes exchange {
        0% {
          transform: translateX(0);
          opacity: 1;
        }
        25% {
          transform: translateX(15px) scale(0.95);
          opacity: 0.8;
        }
        75% {
          transform: translateX(-15px) scale(0.95);
          opacity: 0.8;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes being-targeted {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 10px 5px rgba(255, 215, 0, 0.5);
          transform: scale(1.05);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
          transform: scale(1);
        }
      }

      @keyframes flip {
        0% {
          transform: rotateY(0deg);
        }
        50% {
          transform: rotateY(180deg);
        }
        100% {
          transform: rotateY(360deg);
        }
      }

      /* AI animations */
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

      @keyframes ai-draw {
        0% {
          transform: translateX(50px) translateY(-30px) scale(0.7);
          opacity: 0;
        }
        100% {
          transform: translateX(0) translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes discard {
        0% {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateX(-25px) translateY(15px) rotate(10deg) scale(0.85);
          opacity: 0.7;
        }
        100% {
          transform: translateX(-50px) translateY(30px) rotate(25deg) scale(0.7);
          opacity: 0;
        }
      }

      @keyframes ai-card-play {
        0% {
          transform: translateY(-20px) scale(0.8);
          opacity: 0;
        }
        10% {
          transform: translateY(0) scale(1.05);
          opacity: 1;
        }
        20% {
          transform: scale(1);
        }
        80% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(0.8);
          opacity: 0;
        }
      }

      /* Environment animations */
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
          transform: skewX(0deg);
        }
        25% {
          transform: skewX(1deg);
        }
        75% {
          transform: skewX(-1deg);
        }
        100% {
          transform: skewX(0deg);
        }
      }

      @keyframes pulse-slow {
        0% {
          opacity: 0.8;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.03);
        }
        100% {
          opacity: 0.8;
          transform: scale(1);
        }
      }

      @keyframes glow {
        0% {
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        }
        50% {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        100% {
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
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

      @keyframes flash {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 0.5;
        }
      }

      @keyframes victory {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.5);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
        }
      }

      /* Environment-specific animations */
      @keyframes terrestrial-idle {
        0% {
          box-shadow: inset 0 0 5px rgba(255, 100, 100, 0.2);
        }
        50% {
          box-shadow: inset 0 0 10px rgba(255, 100, 100, 0.4);
        }
        100% {
          box-shadow: inset 0 0 5px rgba(255, 100, 100, 0.2);
        }
      }

      @keyframes aquatic-idle {
        0% {
          box-shadow: inset 0 0 5px rgba(100, 100, 255, 0.2);
        }
        50% {
          box-shadow: inset 0 0 10px rgba(100, 100, 255, 0.4);
        }
        100% {
          box-shadow: inset 0 0 5px rgba(100, 100, 255, 0.2);
        }
      }

      @keyframes amphibian-idle {
        0% {
          box-shadow: inset 0 0 5px rgba(100, 255, 100, 0.2);
        }
        50% {
          box-shadow: inset 0 0 10px rgba(100, 255, 100, 0.4);
        }
        100% {
          box-shadow: inset 0 0 5px rgba(100, 255, 100, 0.2);
        }
      }

      /* Animation classes */
      .animate-draw {
        animation: draw 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-hand-to-field {
        animation: hand-to-field 0.6s ease-in forwards;
        z-index: 10;
      }

      .animate-field-to-discard {
        animation: field-to-discard 0.8s ease-in forwards;
        z-index: 10;
      }

      .animate-field-to-deck {
        animation: field-to-deck 0.8s ease-in forwards;
        z-index: 10;
      }

      .animate-exchange {
        animation: exchange 0.8s ease-in-out forwards;
        z-index: 10;
      }

      .animate-being-targeted {
        animation: being-targeted 1.2s ease-in-out infinite;
      }

      .animate-flip {
        animation: flip 0.8s ease-in-out forwards;
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }

      .animate-ai-thinking {
        animation: ai-thinking 1.5s ease-in-out infinite;
      }

      .animate-ai-draw {
        animation: ai-draw 0.5s ease-out forwards;
      }

      .animate-discard {
        animation: discard 0.7s ease-in forwards;
      }

      .animate-ai-card-play {
        animation: ai-card-play 1.5s ease-in-out forwards;
      }

      /* Environment animation classes */
      .animate-breathe {
        animation: breathe 4s ease-in-out infinite;
      }

      .animate-wiggle {
        animation: wiggle 3s ease-in-out infinite;
      }

      .animate-bounce-slow {
        animation: bounce-slow 2s ease-in-out infinite;
      }

      .animate-sway {
        animation: sway 3s ease-in-out infinite;
      }

      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }

      .animate-glow {
        animation: glow 3s ease-in-out infinite;
      }

      .animate-rotate-slow {
        animation: rotate-slow 20s linear infinite;
      }

      .animate-flash {
        animation: flash 0.5s ease-in-out infinite;
      }

      .animate-victory {
        animation: victory 2s ease-in-out infinite;
      }

      /* Environment-specific animations */
      .animate-terrestrial {
        animation: terrestrial-idle 4s ease-in-out infinite;
      }

      .animate-aquatic {
        animation: aquatic-idle 4s ease-in-out infinite;
      }

      .animate-amphibian {
        animation: amphibian-idle 4s ease-in-out infinite;
      }

      /* Card zoom effect */
      .card-zoom-container {
        position: relative;
      }

      .card-zoom {
        transition: transform 0.2s ease-in-out;
      }

      .card-zoom:hover {
        transform: scale(1.05);
        z-index: 20;
      }

      /* Play animations for different card types */
      .animate-play-terrestrial {
        animation: hand-to-field 0.6s ease-in forwards, terrestrial-idle 4s ease-in-out infinite 0.6s;
        z-index: 10;
      }

      .animate-play-aquatic {
        animation: hand-to-field 0.6s ease-in forwards, aquatic-idle 4s ease-in-out infinite 0.6s;
        z-index: 10;
      }

      .animate-play-amphibian {
        animation: hand-to-field 0.6s ease-in forwards, amphibian-idle 4s ease-in-out infinite 0.6s;
        z-index: 10;
      }

      .animate-play-impact {
        animation: hand-to-field 0.6s ease-in forwards, pulse-slow 3s ease-in-out infinite 0.6s;
        z-index: 10;
      }

      /* Particle animations for card effects */
      @keyframes particle-float {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-20px) translateX(var(--x-offset, 0));
          opacity: 0;
        }
      }

      .particle {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        animation: particle-float 1s ease-out forwards;
      }

      /* Confetti animation for victory */
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }

      .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        animation: confetti-fall 3s ease-in-out infinite;
      }

      /* Impact card animations */
      @keyframes impact-play {
        0% {
          transform: scale(0.1) rotate(0deg);
          opacity: 0;
        }
        50% {
          transform: scale(1.5) rotate(180deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(360deg);
          opacity: 1;
        }
      }

      @keyframes impact-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(147, 51, 234, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
        }
      }

      @keyframes impact-wave {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      .animate-impact-play {
        animation: impact-play 0.8s ease-out forwards;
        transform-origin: center;
        perspective: 1000px;
        backface-visibility: hidden;
      }

      .animate-impact-pulse {
        animation: impact-pulse 1.5s infinite;
      }

      .animate-impact-wave {
        position: relative;
      }

      .animate-impact-wave::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0.5rem;
        background: rgba(147, 51, 234, 0.3);
        animation: impact-wave 1.5s ease-out infinite;
        z-index: -1;
      }
    `}</style>
  )
}
