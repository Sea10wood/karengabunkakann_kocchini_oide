"use client";

import { useState } from "react";
import VideoWebGL from "./(components)/VideoWebGL";
import ScrollGridBackground from "./(components)/ScrollGridBackground";
import Loading from "./(components)/Loading";
import OpeningImage from "./(components)/OpeningImage";

export default function Home() {
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
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400/70 flicker">旧日本生命九州支店</p>
          <h1 className="glitch font-[var(--font-creepster)] text-[36px] sm:text-[36px] leading-none text-[var(--color-accent)] drop-shadow-[0_0_30px_rgba(158,0,0,0.35)] tracking-wide">
            赤煉瓦文化館
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-zinc-200/90 font-serif max-w-3xl mx-auto tracking-wide noisy-text" data-text="こっちにおいで。">
            こっちにおいで。
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a href="https://oide-oide.kizuku-hackathon.work/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-md bg-[var(--color-accent)] text-white hover:bg-[#7e0000] transition-colors ring-accent pulse">
              今すぐ視る
            </a>
            <a href="https://protopedia.net/prototype/7444" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-md border border-zinc-700/80 hover:bg-zinc-900/50 transition-colors">
              開発背景
            </a>
          </div>
        </div>
      </section>

      {/* Features / Timeline */}
      <section id="story" className="relative py-16 sm:py-24 border-t border-zinc-800/60 bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(110,0,0,0.15),transparent_70%)] z-10">
        <div className="container mx-auto px-6 max-w-5xl flex justify-center">
          <div className="story-card">
            <div className="story-content">
              <h2 className="story-title">赤煉瓦文化館の歴史</h2>
              
              <ul className="timeline">

              <li>
                  <div className="timeline-date">1877</div>
                  <div className="timeline-content">
                    <p>明治10年に第十七国立銀行（福岡銀行の前身）の本店が建設されていたが、<br/>
                    1904（明治37年）の火災で焼失。その跡地に建設された。</p>
                  </div>
                </li>

                <li>
                  <div className="timeline-date">1909</div>
                  <div className="timeline-content">
                    <p>明治42年に日本生命保険株式会社九州支店として建てられた。<br/>
                    （設計:辰野片岡建築事務所（辰野金吾・片岡安）。東京駅舎などの設計）</p>
                  </div>
                </li>
                
                
                <li>
                  <div className="timeline-date">1951頃</div>
                  <div className="timeline-content">
                    <p>2階の会議室・階上応接室境の煉瓦壁を撤去、階段室吹き抜けの2階部分に床を設置するなどの改造があった。<br/>
                    屋根をスレート葺から現状の銅板葺に改めたのもこの頃とみられる。<br/>
                    戦後、名称を変更した日本生命保険相互会社福岡支社の社屋として1966まで利用された</p>
                  </div>
                </li>
                
                <li>
                  <div className="timeline-date">1969</div>
                  <div className="timeline-content">
                    <p>3月重要文化財に指定された。同年12月福岡市が買収し、<br/>
                    1972に福岡市歴史資料館として活用するため改修工事が行われた。<br/>
                    このとき1階事務室前のカウンターグリル、階段室吹き抜け、階段の鉄製手摺、照明器具などを復旧したが、<br/>
                    それとともに空調機器の設置及び収蔵品の展示・保管のため、一部の部屋境の扉を撤去し、<br/>
                    外廻りの窓に鉄製パネルをはめ込むなどの改修が行われた</p>
                  </div>
                </li>
                
                <li>
                  <div className="timeline-date">建築様式</div>
                  <div className="timeline-content">
                    <p>外観は赤レンガの外壁と張り巡らされた白い花崗岩の帯、ドーム屋根など、<br/>
                    辰野が留学した19世紀末の英国で流行したクイーンアン様式の影響が随所に見られる。<br/>
                    内部は照明器具、階段の装飾、鉄柵などにアールヌーボーの影響が見られるが、<br/>
                    生命保険会社の社屋だけに、華美さは抑えられている</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Slides */}
      <section id="trial" className="relative py-16 sm:py-24 z-10">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <p className="text-zinc-300/80 mb-6">プロジェクト詳細</p>
          <div className="flex justify-center">
            <iframe 
              src="https://docs.google.com/presentation/d/e/2PACX-1vSQ2Sd2VAz2Jr1_HuTnW6wNQ7tVZ0y51Pcd8QpVYa5_ymdGkMeYyAgK5CNupSNUiSKTatreDroI_v-a/pubembed?start=false&loop=false&delayms=3000" 
              frameBorder="0" 
              width="960" 
              height="569" 
              allowFullScreen={true}
              className="max-w-full h-auto rounded-lg shadow-2xl"
              style={{ aspectRatio: '960/569' }}
            />
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
