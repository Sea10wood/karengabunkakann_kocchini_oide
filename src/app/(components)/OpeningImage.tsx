"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type OpeningImageProps = {
  onComplete?: () => void;
};

export default function OpeningImage({ onComplete }: OpeningImageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // フェードイン（1秒）
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
    }, 100);

    // 表示維持（1秒）
    const holdTimer = setTimeout(() => {
      // フェードアウト（1秒）
      setOpacity(0);
    }, 2000);

    // 完全に消えた後にコールバック実行
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(holdTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{
          opacity,
          transition: 'opacity 1s ease-in-out'
        }}
      >
        <Image 
          src="/akarenga.webp"
          alt="赤煉瓦文化館"
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
