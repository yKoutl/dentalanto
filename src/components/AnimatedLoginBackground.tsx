import React, { ReactNode } from 'react';

interface AnimatedLoginBackgroundProps {
  children: ReactNode;
}

export const AnimatedLoginBackground: React.FC<AnimatedLoginBackgroundProps> = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 font-sans">
      <style>{`
        .dental-circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
          z-index: 0;
          pointer-events: none;
        }

        .dental-circles li {
          position: absolute;
          display: block;
          list-style: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, rgba(244, 114, 182, 0.22), rgba(168, 85, 247, 0.28));
          border: 1px solid rgba(251, 207, 232, 0.2);
          box-shadow: 0 8px 32px 0 rgba(192, 38, 211, 0.25);
          backdrop-filter: blur(4px);
          animation: animateDental 12s linear infinite;
          bottom: -150px;
          will-change: transform;
        }

        .dental-circles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; animation-duration: 11s; }
        .dental-circles li:nth-child(2) { left: 10%; width: 24px; height: 24px; animation-delay: 1s; animation-duration: 8s; }
        .dental-circles li:nth-child(3) { left: 70%; width: 30px; height: 30px; animation-delay: 2s; animation-duration: 10s; }
        .dental-circles li:nth-child(4) { left: 40%; width: 65px; height: 65px; animation-delay: 0s; animation-duration: 12s; }
        .dental-circles li:nth-child(5) { left: 65%; width: 22px; height: 22px; animation-delay: 0.5s; animation-duration: 9s; }
        .dental-circles li:nth-child(6) { left: 78%; width: 110px; height: 110px; animation-delay: 1.5s; animation-duration: 14s; }
        .dental-circles li:nth-child(7) { left: 32%; width: 140px; height: 140px; animation-delay: 3s; animation-duration: 15s; }
        .dental-circles li:nth-child(8) { left: 52%; width: 28px; height: 28px; animation-delay: 4s; animation-duration: 17s; }
        .dental-circles li:nth-child(9) { left: 18%; width: 18px; height: 18px; animation-delay: 1s; animation-duration: 13s; }
        .dental-circles li:nth-child(10) { left: 88%; width: 130px; height: 130px; animation-delay: 0s; animation-duration: 8s; }

        @keyframes animateDental {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.9;
            border-radius: 20%;
          }
          100% {
            transform: translateY(-1100px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
      `}</style>

      {/* Partículas animadas en rosa y morado */}
      <ul className="dental-circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      {/* Contenido centrado con z-index */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AnimatedLoginBackground;
