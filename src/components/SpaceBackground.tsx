// components/SpaceBackground.jsx
import { useEffect, useState, ReactNode } from 'react';

type Star = {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
  size: number;
};

interface SpaceBackgroundProps {
  children: ReactNode;
}

const SpaceBackground = ({ children }: SpaceBackgroundProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random static stars
    const starArray: Star[] = [];
    for (let i = 0; i < 150; i++) {
      starArray.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 3,
        size: Math.random() * 3,
      });
    }
    setStars(starArray);
  }, []);

  return (
    <>
      <style jsx>{`
        .space-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
          overflow: hidden;
          z-index: -1;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 4s infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2); 
          }
        }

        .shooting-star {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          box-shadow: 
            0 0 10px 2px rgba(255, 255, 255, 0.8),
            0 0 20px 4px rgba(255, 255, 255, 0.5),
            0 0 30px 6px rgba(255, 255, 255, 0.3);
          animation: shoot 3s linear infinite;
        }

        .shooting-star::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          height: 1px;
          background: linear-gradient(90deg, white, transparent);
          right: 4px;
        }

        .shooting-star:nth-child(1) {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shooting-star:nth-child(2) {
          top: 20%;
          left: 80%;
          animation-delay: 1.5s;
          animation-duration: 4s;
        }

        .shooting-star:nth-child(3) {
          top: 50%;
          left: 30%;
          animation-delay: 3s;
          animation-duration: 3.5s;
        }

        .shooting-star:nth-child(4) {
          top: 70%;
          left: 60%;
          animation-delay: 4.5s;
          animation-duration: 2.5s;
        }

        .shooting-star:nth-child(5) {
          top: 30%;
          left: 50%;
          animation-delay: 6s;
          animation-duration: 3s;
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }

        .nebula {
          position: absolute;
          top: 20%;
          left: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, 
            rgba(138, 43, 226, 0.1) 0%, 
            rgba(138, 43, 226, 0.05) 40%, 
            transparent 70%);
          filter: blur(40px);
          animation: float 20s infinite ease-in-out;
        }

        .nebula2 {
          position: absolute;
          bottom: 20%;
          right: 10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, 
            rgba(30, 144, 255, 0.1) 0%, 
            rgba(30, 144, 255, 0.05) 40%, 
            transparent 70%);
          filter: blur(60px);
          animation: float 25s infinite ease-in-out reverse;
        }

        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          33% { 
            transform: translate(30px, -30px) scale(1.1); 
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9); 
          }
        }

        .content {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>

      <div className="space-container">
        {/* Static stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.animationDelay}s`,
            }}
          />
        ))}

        {/* Shooting stars */}
        {/* <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div> */}

        {/* Nebula clouds */}
        <div className="nebula"></div>
        <div className="nebula2"></div>
      </div>

      {/* Your content */}
      <div className="content">
        {children}
      </div>
    </>
  );
};

export default SpaceBackground;