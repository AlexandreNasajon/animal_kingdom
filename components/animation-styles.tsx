"use client"

export function AnimationStyles() {
  return (
    <style jsx global>{`
      /* Card animations */
      @keyframes draw {
        0% {
          transform: translateY(-100px) scale(0.8) rotate(-5deg);
          opacity: 0;
        }
        70% {
          transform: translateY(5px) scale(1.05) rotate(2deg);
          opacity: 1;
        }
        100% {
          transform: translateY(0) scale(1) rotate(0);
          opacity: 1;
        }
      }

      @keyframes discard {
        0% {
          transform: translateY(0) scale(1) rotate(0);
          opacity: 1;
        }
        30% {
          transform: translateY(-10px) scale(1.05) rotate(-2deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100px) scale(0.8) rotate(10deg);
          opacity: 0;
        }
      }

      @keyframes ai-draw {
        0% {
          transform: translateY(-100px) scale(0.8) rotate(5deg);
          opacity: 0;
        }
        70% {
          transform: translateY(5px) scale(1.05) rotate(-2deg);
          opacity: 1;
        }
        100% {
          transform: translateY(0) scale(1) rotate(0);
          opacity: 1;
        }
      }

      @keyframes ai-play-from-hand {
        0% {
          transform: translateY(0) scale(1) rotate(0);
          opacity: 1;
        }
        30% {
          transform: translateY(-10px) scale(1.05) rotate(-2deg);
          opacity: 0.9;
        }
        100% {
          transform: translateY(-100px) scale(0.8) rotate(-10deg);
          opacity: 0;
        }
      }

      @keyframes ai-thinking {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.5;
        }
      }

      @keyframes ai-thinking-card {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
        100% {
          transform: translateY(0);
        }
      }

      @keyframes flash {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 0;
        }
      }

      /* New AI card play animation */
      @keyframes ai-card-play {
        0% { 
          transform: scale(0.5) translateY(-100px); 
          opacity: 0; 
        }
        20% { 
          transform: scale(1.2) translateY(0); 
          opacity: 1; 
        }
        80% { 
          transform: scale(1.2) translateY(0); 
          opacity: 1; 
        }
        100% { 
          transform: scale(0.5) translateY(100px); 
          opacity: 0; 
        }
      }

      /* Card movement animations */
      @keyframes hand-to-field {
        0% {
          transform: translateY(50px) scale(0.8);
          opacity: 0.5;
          z-index: 10;
        }
        50% {
          transform: translateY(-10px) scale(1.1);
          opacity: 0.8;
          z-index: 10;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
          z-index: 1;
        }
      }

      @keyframes field-to-discard {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(25px) scale(0.9) rotate(5deg);
          opacity: 0.7;
        }
        100% {
          transform: translateY(50px) scale(0.8) rotate(10deg);
          opacity: 0;
        }
      }

      @keyframes field-to-deck {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-25px) scale(0.9) rotate(-5deg);
          opacity: 0.7;
        }
        100% {
          transform: translateY(-50px) scale(0.8) rotate(-10deg);
          opacity: 0;
        }
      }

      @keyframes exchange {
        0% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(20px);
          opacity: 0.7;
        }
        75% {
          transform: translateX(-20px);
          opacity: 0.7;
        }
        100% {
          transform: translateX(0);
        }
      }

      @keyframes exchange-out {
        0% {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateX(50px) scale(0.8);
          opacity: 0;
        }
      }

      @keyframes exchange-in {
        0% {
          transform: translateX(-50px) scale(0.8);
          opacity: 0;
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

      /* Card idle animations */
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

      @keyframes pulse-slow {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          opacity: 1;
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

      /* Environment-specific animations */
      .animate-terrestrial {
        animation: terrestrial 8s infinite ease-in-out;
      }

      @keyframes terrestrial {
        0% {
          background-position: 0% 0%;
        }
        50% {
          background-position: 100% 0%;
        }
        100% {
          background-position: 0% 0%;
        }
      }

      .animate-aquatic {
        animation: aquatic 8s infinite ease-in-out;
      }

      @keyframes aquatic {
        0% {
          background-position: 0% 100%;
        }
        50% {
          background-position: 100% 100%;
        }
        100% {
          background-position: 0% 100%;
        }
      }

      .animate-amphibian {
        animation: amphibian 8s infinite ease-in-out;
      }

      @keyframes amphibian {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      /* Play card animations */
      @keyframes play-terrestrial {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-30px) scale(1.1) rotate(-5deg);
          opacity: 0.9;
          box-shadow: 0 0 15px rgba(255, 100, 100, 0.5);
        }
        100% {
          transform: translateY(-100px) scale(0.8) rotate(-10deg);
          opacity: 0;
        }
      }

      @keyframes play-aquatic {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-30px) scale(1.1) rotate(5deg);
          opacity: 0.9;
          box-shadow: 0 0 15px rgba(100, 100, 255, 0.5);
        }
        100% {
          transform: translateY(-100px) scale(0.8) rotate(10deg);
          opacity: 0;
        }
      }

      @keyframes play-amphibian {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-30px) scale(1.1);
          opacity: 0.9;
          box-shadow: 0 0 15px rgba(100, 255, 100, 0.5);
        }
        100% {
          transform: translateY(-100px) scale(0.8);
          opacity: 0;
        }
      }

      @keyframes play-impact {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-30px) scale(1.1) rotate(5deg);
          opacity: 0.9;
          box-shadow: 0 0 15px rgba(200, 100, 255, 0.5);
        }
        100% {
          transform: translateY(-100px) scale(0.8) rotate(10deg);
          opacity: 0;
        }
      }

      /* Victory animation */
      @keyframes victory {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.7);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
        }
      }

      /* Apply animations */
      .animate-draw {
        animation: draw 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-discard {
        animation: discard 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-ai-draw {
        animation: ai-draw 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-ai-play-from-hand {
        animation: ai-play-from-hand 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-ai-thinking {
        animation: ai-thinking 1.5s infinite ease-in-out;
      }

      .animate-ai-thinking-card {
        animation: ai-thinking-card 1.5s infinite ease-in-out;
      }

      .animate-flash {
        animation: flash 0.5s ease-in-out;
      }

      .animate-hand-to-field {
        animation: hand-to-field 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .animate-field-to-discard {
        animation: field-to-discard 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-field-to-deck {
        animation: field-to-deck 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-exchange {
        animation: exchange 0.8s ease-in-out;
      }

      .animate-exchange-out {
        animation: exchange-out 0.5s ease-in-out forwards;
      }

      .animate-exchange-in {
        animation: exchange-in 0.5s ease-in-out forwards;
      }

      .animate-being-targeted {
        animation: being-targeted 1.2s ease-in-out infinite;
      }

      .animate-breathe {
        animation: breathe 4s infinite ease-in-out;
      }

      .animate-wiggle {
        animation: wiggle 4s infinite ease-in-out;
      }

      .animate-bounce-slow {
        animation: bounce-slow 4s infinite ease-in-out;
      }

      .animate-sway {
        animation: sway 4s infinite ease-in-out;
      }

      .animate-pulse-slow {
        animation: pulse-slow 4s infinite ease-in-out;
      }

      .animate-glow {
        animation: glow 4s infinite ease-in-out;
      }

      .animate-rotate-slow {
        animation: rotate-slow 20s infinite linear;
      }

      .animate-play-terrestrial {
        animation: play-terrestrial 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-play-aquatic {
        animation: play-aquatic 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-play-amphibian {
        animation: play-amphibian 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-play-impact {
        animation: play-impact 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
      }

      .animate-victory {
        animation: victory 1.5s infinite ease-in-out;
      }

      /* New AI card play animation class */
      .animate-ai-card-play {
        animation: ai-card-play 2s ease-in-out forwards;
      }

      /* Card zoom effect */
      .card-zoom-container {
        position: relative;
      }

      .card-zoom {
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
      }

      .card-zoom-container:hover .card-zoom {
        transform: translateY(-10px) scale(1.05);
        z-index: 10;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }

      /* Card back pattern */
      .card-back-pattern {
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
          45deg,
          rgba(255, 0, 0, 0.1),
          rgba(255, 0, 0, 0.1) 5px,
          rgba(0, 0, 0, 0.1) 5px,
          rgba(0, 0, 0, 0.1) 10px
        );
      }
    `}</style>
  )
}
