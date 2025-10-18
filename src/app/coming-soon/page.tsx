"use client";

import { useState } from "react";
import Link from "next/link";
import VideoWebGL from "../(components)/VideoWebGL";
import ScrollGridBackground from "../(components)/ScrollGridBackground";
import Loading from "../(components)/Loading";
import OpeningImage from "../(components)/OpeningImage";

export default function ComingSoon() {
  const [showOpening, setShowOpening] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpeningComplete = () => {
    setShowOpening(false);
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (showOpening) {
    return <OpeningImage onComplete={handleOpeningComplete} />;
  }

  if (isLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <main className="relative min-h-[100svh] overflow-clip blood-accent vignette">
      <ScrollGridBackground />
      <div className="noise" />
      <div className="scanline" />
      
      {/* フルスクリーン動画背景 */}
      <VideoWebGL />
      
      {/* Hero Content - 動画の上に重ねて表示 */}
      <section className="relative flex items-center justify-center pt-24 pb-20 sm:pt-32 sm:pb-28 z-10">
        <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400/70 flicker">Coming Soon</p>
          <h1 className="glitch font-[var(--font-creepster)] text-[36px] sm:text-[36px] leading-none text-[var(--color-accent)] drop-shadow-[0_0_30px_rgba(158,0,0,0.35)] tracking-wide">
            赤煉瓦文化館
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-zinc-200/90 font-serif max-w-3xl mx-auto tracking-wide noisy-text" data-text="近日公開予定。">
            近日公開予定。
          </p>
          
          {/* 近日公開カード */}
          <div className="mt-12 flex justify-center">
            <div className="coming-soon-card">
              <div className="coming-soon-content">
                <h2 className="coming-soon-title">体験版 近日公開</h2>
                <p className="coming-soon-description">
                  赤煉瓦文化館での恐怖体験が、まもなく始まります。
                </p>
                <p className="coming-soon-description">
                  準備が整い次第、お知らせいたします。
                </p>
                <div className="coming-soon-features">
                  <div className="feature-item">
                    <span className="feature-icon">🎮</span>
                    <span>インタラクティブ体験</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">👻</span>
                    <span>ホラー要素</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📱</span>
                    <span>スマートフォン対応</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/" className="px-6 py-3 rounded-md bg-[var(--color-accent)] text-white hover:bg-[#7e0000] transition-colors ring-accent pulse">
              トップページに戻る
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-8 text-center text-zinc-500 text-sm z-10">
        <p>© 2025. チーム土佐犬</p>
      </footer>
    </main>
  );
}
