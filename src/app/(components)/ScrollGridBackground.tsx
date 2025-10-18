"use client";

export default function ScrollGridBackground() {
  const words = [
    "赤煉瓦", "こっちに", "おいで", "文化館",
    "闇", "静寂", "呼び声", "視線",
    "赤煉瓦", "こっちに", "おいで", "文化館",
    "夜", "影", "足音", "扉",
    "赤煉瓦", "こっちに", "おいで", "文化館",
    "鏡", "廊下", "窓", "階段",
    "赤煉瓦", "こっちに", "おいで", "文化館",
    "記憶", "過去", "時間", "空間",
    "赤煉瓦", "こっちに", "おいで", "文化館",
    "囁き", "息", "冷気", "感触",
    "赤煉瓦", "こっちに", "おいで", "文化館",
    "幻", "実在", "境界", "向こう側"
  ];

  return (
    <div className="stuck-grid">
      {words.map((word, index) => (
        <div 
          key={index} 
          className={`grid-item ${index === 10 ? 'special' : ''}`}
          data-index={index + 1}
        >
          {index === 10 ? <b>赤煉瓦文化館</b> : word}
        </div>
      ))}
    </div>
  );
}
