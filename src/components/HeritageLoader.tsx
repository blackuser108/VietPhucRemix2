import React, { useState, useEffect } from 'react';

const CULTURAL_DID_YOU_KNOW = [
  '5 chiếc cúc của Áo Ngũ Thân tượng trưng cho Ngũ thường của người quân tử: Nhân - Lễ - Nghĩa - Trí - Tín.',
  'Cổ áo đứng (Lập lĩnh) ôm khít 2-3cm mang ý nghĩa gìn giữ phong thái đĩnh đạc, khiêm cung của cổ nhân.',
  'Chiếc áo lót trắng bên trong áo ngũ thân gọi là "áo đơn", giúp giữ sạch áo gấm bên ngoài và làm sáng bừng khuôn mặt người mặc.',
  'Quy tắc bất biến của Áo Giao Lĩnh: Vạt TRÁI bắt buộc phải đè lên vạt PHẢI (tượng trưng cho quy luật sinh sôi).',
  'Tên gọi "Áo Tấc" bắt nguồn từ ống tay áo may thụng dài buông quá đầu ngón tay khoảng 1 tấc (khoảng 10-12cm).',
  'Áo Nhật bình có dải ngũ sắc ở tay áo tượng trưng cho Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ) điều hòa trời đất.',
  'Màu vàng nghệ hoàng kim ngày xưa chỉ dùng cho dòng dõi hoàng tộc; dân gian thường chuộng màu nâu non, chàm thẫm và đen tuyền.',
  'Áo Bà ba xẻ tà hai bên hông được thiết kế để người Nam Bộ chèo xuồng, lội nước cực kỳ nhẹ nhàng, thanh thoát.',
  'Áo Tứ thân có 4 vạt tượng trưng cho tứ thân phụ mẫu (cha mẹ mình và cha mẹ chồng), vạt buộc phía trước tượng trưng cho sự gắn kết thủy chung.',
];

interface HeritageLoaderProps {
  message?: string;
  showFact?: boolean;
}

export const HeritageLoader: React.FC<HeritageLoaderProps> = ({
  message = 'Đang xử lý chuẩn mực di sản...',
  showFact = true,
}) => {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Pick a random fact on mount
    const randomIdx = Math.floor(Math.random() * CULTURAL_DID_YOU_KNOW.length);
    setFactIndex(randomIdx);

    // Rotate every 4.5 seconds if loading is long
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % CULTURAL_DID_YOU_KNOW.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-5 text-center space-y-3.5 select-none animate-in fade-in">
      {/* Spinning Stylized Bronze Drum / Lotus Traditional Motif */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer glowing halo */}
        <div className="absolute inset-0 rounded-full bg-amber-500/15 animate-ping" />

        {/* Traditional 8-ray Sun of Dong Son Bronze Drum (Trống Đồng Đông Sơn) */}
        <svg
          viewBox="0 0 100 100"
          className="w-12 h-12 text-amber-700 animate-spin transition-transform duration-1000"
          style={{ animationDuration: '6s' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle with concentric dots */}
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1.5" />

          {/* Central 8-ray Sun Star (Mặt trời 8 cánh trống đồng) */}
          <polygon
            points="50,15 54,42 78,22 58,46 85,50 58,54 78,78 54,58 50,85 46,58 22,78 42,54 15,50 42,46 22,22 46,42"
            fill="currentColor"
            opacity="0.9"
          />

          {/* Inner Sacred Center */}
          <circle cx="50" cy="50" r="7" fill="#C0392B" />
        </svg>
      </div>

      {/* Loading Status Message */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-amber-950 block tracking-wide">
          {message}
        </span>
        <span className="text-[10px] text-stone-400">
          Chờ xíu nhé, đang đối chiếu nguồn cổ thư...
        </span>
      </div>

      {/* "Bạn Có Biết?" Micro-fact Card */}
      {showFact && (
        <div className="w-full max-w-sm p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-left space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-800 tracking-wider">
            <span>💡 Bạn có biết?</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed italic">
            "{CULTURAL_DID_YOU_KNOW[factIndex]}"
          </p>
        </div>
      )}
    </div>
  );
};
