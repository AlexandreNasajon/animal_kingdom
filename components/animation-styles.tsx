"use client"

export function AnimationStyles() {
  return (
    <style jsx global>{`
      /* Card draw animation */
      @keyframes drawCard {
        0% {
          transform: translate(-50px, -80px) scale(0.5) rotate(-10deg);
          opacity: 0;
        }
        60% {
          transform: translate(0, 10px) scale(1.05) rotate(5deg);
          opacity: 1;
        }
        100% {
          transform: translate(0, 0) scale(1) rotate(0);
          opacity: 1;
        }
      }

      .animate-draw {
        animation: drawCard 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      /* Card play animation */
      @keyframes playCard {
        0% {
          transform: scale(1) translateY(0) rotate(0);
          opacity: 1;
          z-index: 10;
        }
        20% {
          transform: scale(1.2) translateY(-20px) rotate(5deg);
          opacity: 1;
          z-index: 10;
        }
        100% {
          transform: scale(0.8) translateY(-120px) rotate(-5deg);
          opacity: 0;
          z-index: 10;
        }
      }

      .animate-play {
        animation: playCard 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        position: relative;
        z-index: 10;
      }

      /* Card appear on field animation */
      @keyframes appearOnField {
        0% {
          transform: scale(0.8) translateY(30px) rotate(10deg);
          opacity: 0;
        }
        60% {
          transform: scale(1.1) translateY(-5px) rotate(-5deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) translateY(0) rotate(0);
          opacity: 1;
        }
      }

      .animate-appear {
        animation: appearOnField 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      /* AI card play animation - enhanced landing effect with more visible trajectory */
      @keyframes aiPlayCard {
        0% {
          transform: translateY(-100px) translateX(120px) scale(0.7) rotate(15deg);
          opacity: 0.7;
          box-shadow: 0 0 30px rgba(255, 0, 0, 0.8);
          z-index: 40;
        }
        20% {
          transform: translateY(-60px) translateX(80px) scale(1.1) rotate(10deg);
          opacity: 0.8;
          box-shadow: 0 0 40px rgba(255, 0, 0, 1);
          z-index: 40;
        }
        40% {
          transform: translateY(-20px) translateX(40px) scale(1.3) rotate(-5deg);
          opacity: 0.9;
          box-shadow: 0 0 35px rgba(255, 0, 0, 0.9);
          z-index: 40;
        }
        60% {
          transform: translateY(-10px) translateX(20px) scale(1.2) rotate(3deg);
          opacity: 1;
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.7);
          z-index: 40;
        }
        80% {
          transform: translateY(5px) translateX(5px) scale(1.1) rotate(-2deg);
          opacity: 1;
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
          z-index: 40;
        }
        100% {
          transform: translateY(0) translateX(0) scale(1) rotate(0);
          opacity: 1;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
          z-index: 40;
        }
      }

      .animate-ai-play {
        animation: aiPlayCard 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        z-index: 40;
      }

      /* AI card play from hand animation - enhanced to show card leaving hand */
      @keyframes aiPlayFromHand {
        0% {
          transform: translateY(0) translateX(0) scale(1) rotate(0);
          opacity: 1;
          z-index: 50;
        }
        20% {
          transform: translateY(-20px) translateX(20px) scale(1.1) rotate(-5deg);
          opacity: 1;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
          z-index: 50;
        }
        50% {
          transform: translateY(-60px) translateX(60px) scale(1) rotate(5deg);
          opacity: 0.9;
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
          z-index: 50;
        }
        100% {
          transform: translateY(-100px) translateX(120px) scale(0.8) rotate(15deg);
          opacity: 0.7;
          z-index: 50;
        }
      }

      .animate-ai-play-from-hand {
        animation: aiPlayFromHand 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        z-index: 50;
      }

      /* AI thinking animation */
      @keyframes aiThinking {
        0%, 100% {
          transform: scale(1);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
      }

      .animate-ai-thinking {
        animation: aiThinking 1.5s ease-in-out infinite;
      }

      /* AI thinking card animation */
      @keyframes aiThinkingCard {
        0%, 100% {
          transform: translateY(0);
          box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
        }
        50% {
          transform: translateY(-5px);
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.6);
        }
      }

      .animate-ai-thinking-card {
        animation: aiThinkingCard 1.2s ease-in-out infinite;
      }

      /* Card discard animation */
      @keyframes discardCard {
        0% {
          transform: scale(1) translateX(0) rotate(0);
          opacity: 1;
        }
        100% {
          transform: scale(0.7) translateX(100px) rotate(45deg);
          opacity: 0;
        }
      }

      .animate-discard {
        animation: discardCard 0.5s ease-out forwards;
      }

      /* Card return to deck animation */
      @keyframes returnToDeck {
        0% {
          transform: scale(1) translate(0, 0) rotate(0);
          opacity: 1;
        }
        100% {
          transform: scale(0.5) translate(-80px, -50px) rotate(-15deg);
          opacity: 0;
        }
      }

      .animate-return-to-deck {
        animation: returnToDeck 0.6s ease-out forwards;
      }

      /* Card flip animation */
      @keyframes flipCard {
        0% {
          transform: rotateY(0deg);
        }
        100% {
          transform: rotateY(360deg);
        }
      }

      .animate-flip {
        animation: flipCard 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        transform-style: preserve-3d;
      }

      /* Card hover effect */
      .card-hover {
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
      }
      
      .card-hover:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
        z-index: 20;
      }

      /* Card zoom effect on hover */
      .card-zoom-container {
        position: relative;
      }
      
      .card-zoom {
        transition: all 0.3s ease;
      }
      
      .card-zoom:hover {
        transform: scale(1.2);
        z-index: 30;
      }

      /* Card transfer animation */
      @keyframes transferCard {
        0% {
          transform: scale(1) translate(0, 0) rotate(0);
          opacity: 1;
        }
        50% {
          transform: scale(1.1) translate(0, -30px) rotate(10deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) translate(100px, 0) rotate(0);
          opacity: 0;
        }
      }

      .animate-transfer {
        animation: transferCard 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      /* AI draw card animation */
      @keyframes aiDrawCard {
        0% {
          transform: translate(-50px, -50px) scale(0.5) rotate(-5deg);
          opacity: 0;
        }
        50% {
          transform: translate(0, -10px) scale(0.8) rotate(5deg);
          opacity: 0.7;
        }
        100% {
          transform: translate(50px, 30px) scale(0) rotate(10deg);
          opacity: 0;
        }
      }

      .animate-ai-draw {
        animation: aiDrawCard 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      /* Card back pattern */
      .card-back-pattern {
        position: absolute;
        inset: 4px;
        background-color: #4a1c1c;
        background-image: 
          linear-gradient(45deg, #3a1515 25%, transparent 25%),
          linear-gradient(-45deg, #3a1515 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #3a1515 75%),
          linear-gradient(-45deg, transparent 75%, #3a1515 75%);
        background-size: 8px 8px;
        background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
        border-radius: 3px;
      }
    `}</style>
  )
}
