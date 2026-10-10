import React from 'react';
import { X, Sparkles, ShieldCheck, Palette, Compass, ArrowRight } from 'lucide-react';

interface IntroHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroHeroModal: React.FC<IntroHeroModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-3xl border-2 border-amber-900/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Decorative Top Banner */}
        <div className="relative p-6 pb-5 bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#78350F] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[10px] font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3 h-3" />
            Ý Tưởng Đề Bài • Cuộc Thi Thiết Kế 2026
          </div>

          <h3 className="font-serif-title text-2xl font-black leading-tight text-white">
            Việt Phục Remix
          </h3>
          <p className="text-xs text-stone-200 mt-1 leading-relaxed">
            Phối trang phục truyền thống theo phong cách Gen Z – Cân bằng giữa sáng tạo đương đại và sự tôn trọng cội nguồn di sản.
          </p>
        </div>

        {/* 3 Pillars Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-stone-700">
          <p className="text-stone-800 font-medium leading-relaxed">
            Người trẻ yêu thích Việt phục nhưng thường sợ bị chê là "sai quy cách" hay "lai căng". <strong>Việt Phục Remix</strong> ra đời như một cẩm nang tương tác giúp bạn:
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Pillar 1 */}
            <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-xl bg-red-100 text-red-800 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">1. Biết Gốc Để Không Sai</h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Nắm chắc cấu trúc bất biến: cổ Lập lĩnh, vạt cài bên phải, tay chẽn, dải ngũ sắc Nhật bình trong 10 giây.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">2. Tự Do Phối Theo Chất Riêng</h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Tận dụng đồ sẵn có (quần âu, sneaker, túi tote, kính râm) để diện Việt phục đi học, đi chơi, chụp kỷ yếu thường nhật.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">3. Cảnh Báo Văn Hóa Thời Gian Thực</h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Hệ thống 3 mức cảnh báo thân thiện & đo độ hài hòa màu sắc giúp bạn luôn an tâm và tự tin khi xuống phố.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 bg-stone-100/90 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 italic">
            Tôn vinh bản sắc • Định hình phong cách
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Bắt Đầu Trải Nghiệm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
