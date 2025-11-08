"use client";

import { useEffect } from "react";

export default function ComingSoon() {
  useEffect(() => {
    // 外部URLにリダイレクト
    window.location.href = "https://oide-oide.kizuku-hackathon.work/";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-zinc-400">リダイレクト中...</p>
    </div>
  );
}
