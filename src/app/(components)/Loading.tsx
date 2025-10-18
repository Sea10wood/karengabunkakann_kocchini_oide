"use client";

import { useEffect, useState } from "react";

type LoadingProps = {
  onComplete?: () => void;
};

export default function Loading({ onComplete }: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 3000; // 3秒で完了
    const interval = 50; // 50msごとに更新
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 500);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* レンガ積み背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 既存のレンガ（半分積まれている状態） */}
        <div className="absolute bottom-0 left-0 w-full h-1/2">
          <div className="brick-wall-static"></div>
        </div>
        
        {/* アニメーションするレンガ */}
        <div className="absolute bottom-1/2 left-0 w-full h-1/2">
          <div className="brick-wall-animated" style={{ 
            transform: `translateY(${100 - progress}%)`,
            opacity: progress / 100 
          }}></div>
        </div>
      </div>

      {/* 中央のローダー */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="loader mb-8"></div>
        <div className="text-white text-3xl font-bold tracking-wider">
          Loading
        </div>
        <div className="text-red-900 text-lg mt-4 font-mono">
          {Math.round(progress)}%
        </div>
      </div>

      <style jsx>{`
        .loader {
          height: 150px;
          aspect-ratio: 1;
          box-sizing: border-box;
          position: relative;
          mask: 
            radial-gradient(#0000 47%,#000 48% 71%,#0000 72%) exclude,
            conic-gradient(#000 0 0) no-clip;
          animation: l11 1.5s linear infinite;
        }
        .loader:before {
          content: "";
          position: absolute;
          inset: 0 35% 70%;
          border-radius: 50%;
          background: #660000;
          filter: blur(15px);
        }
        @keyframes l11 {
          to {rotate: 1turn}
        }

        .brick-wall-static {
          background-image: 
            linear-gradient(45deg, #4A0000 25%, transparent 25%),
            linear-gradient(-45deg, #4A0000 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #4A0000 75%),
            linear-gradient(-45deg, transparent 75%, #4A0000 75%);
          background-size: 100px 50px;
          background-position: 0 0, 0 25px, 50px -25px, 50px 0px;
          opacity: 0.7;
        }

        .brick-wall-animated {
          background-image: 
            linear-gradient(45deg, #660000 25%, transparent 25%),
            linear-gradient(-45deg, #660000 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #660000 75%),
            linear-gradient(-45deg, transparent 75%, #660000 75%);
          background-size: 100px 50px;
          background-position: 0 0, 0 25px, 50px -25px, 50px 0px;
          transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }
      `}</style>
    </div>
  );
}
