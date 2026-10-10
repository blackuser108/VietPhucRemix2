import React from 'react';
import { Star, Sparkles, Check, Clock, AlertCircle } from 'lucide-react';

export type WardrobeCategoryType = 'outfits' | 'accessories' | 'shoes' | 'colors';

export interface WardrobeItemCardProps {
  id: string;
  name: string;
  category: WardrobeCategoryType;
  isSelected: boolean;
  isFavorite: boolean;
  colorHex?: string;
  elementSymbol?: string;
  // Specific for outfits (3 states: not_made | making | ready)
  outfitState?: 'not_made' | 'making' | 'ready';
  thumbnailUrl?: string | null;
  isGenderCompatible?: boolean;
  genderNote?: string;
  periodOrDetail?: string;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const WardrobeItemCard: React.FC<WardrobeItemCardProps> = ({
  id,
  name,
  category,
  isSelected,
  isFavorite,
  colorHex,
  elementSymbol,
  outfitState = 'not_made',
  thumbnailUrl,
  isGenderCompatible = true,
  genderNote,
  periodOrDetail,
  onClick,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={onClick}
      title={name + (genderNote && !isGenderCompatible ? ` (${genderNote})` : '')}
      className={`group relative aspect-[4/5] sm:aspect-square rounded-2xl flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-200 select-none overflow-hidden ${
        isSelected
          ? 'bg-amber-900/10 border-2 border-amber-600 shadow-md ring-2 ring-amber-500/30 scale-[1.02]'
          : 'bg-white/85 hover:bg-stone-50 border border-stone-200/90 hover:border-amber-900/30 shadow-2xs hover:shadow-xs'
      } ${!isGenderCompatible ? 'opacity-60 grayscale-[35%]' : ''}`}
    >
      {/* 1. ANIMATED GLOWING BORDER KHI "ĐANG MAY" */}
      {outfitState === 'making' && (
        <span className="absolute inset-0 rounded-2xl border-2 border-amber-500 animate-pulse pointer-events-none z-20 shadow-[0_0_12px_rgba(217,119,6,0.6)]" />
      )}

      {/* 2. FAVORITE STAR BUTTON (Top Right) */}
      <button
        onClick={onToggleFavorite}
        title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-transform active:scale-125 z-20 ${
          isFavorite
            ? 'text-amber-500 fill-amber-500 hover:text-amber-600'
            : 'text-stone-300 hover:text-amber-400 opacity-60 hover:opacity-100'
        }`}
      >
        <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* 3. NỘI DUNG HIỂN THỊ CHÍNH THEO DANH MỤC */}
      <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
        {/* --- A. BỘ TRANG PHỤC (3 TRẠNG THÁI: CHƯA MAY, ĐANG MAY, SẴN SÀNG) --- */}
        {category === 'outfits' && (
          <div className="w-full h-full flex flex-col items-center justify-between">
            {outfitState === 'ready' && thumbnailUrl ? (
              // Trạng thái 1: SẴN SÀNG - HIỂN THỊ CHÍNH ẢNH NHÂN VẬT CẮT THÂN TRÊN CANH THEO ĐẦU
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-[#FAF7F2]">
                <img
                  src={thumbnailUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Tên bộ mờ ở chân ảnh */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-1 pt-3 text-left">
                  <div className="text-[10px] font-bold text-white line-clamp-1 leading-tight">{name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[8px] text-emerald-200 font-medium">Sẵn sàng</span>
                  </div>
                </div>
              </div>
            ) : outfitState === 'making' ? (
              // Trạng thái 2: ĐANG MAY - VIỀN SÁNG CHẠY QUANH + HIỆU ỨNG MAY
              <div className="w-full h-full rounded-xl flex flex-col items-center justify-center p-1 text-center bg-amber-50/60">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-1 animate-spin">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                </div>
                <span className="text-[10px] font-bold text-amber-900 leading-tight line-clamp-1">{name}</span>
                <span className="text-[9px] text-amber-700 font-semibold mt-0.5 animate-pulse">Đang may...</span>
              </div>
            ) : (
              // Trạng thái 3: CHƯA MAY - PLACEHOLDER GỌN (BÓNG DÁNG ÁO, TÊN BỘ, CHẤM MÀU)
              <div className="w-full h-full rounded-xl flex flex-col items-center justify-between p-1.5 text-center bg-stone-50/70 border border-dashed border-stone-200">
                {/* Bóng dáng áo silhouette thanh lịch tối giản */}
                <div className="w-9 h-9 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-400 mt-1">
                  <svg className="w-5 h-5 opacity-40 text-stone-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2 L9 5 L4 7 L6 11 L8 10 L8 22 L16 22 L16 10 L18 11 L20 7 L15 5 Z" />
                  </svg>
                </div>

                <div className="w-full my-auto">
                  <div className="text-[10.5px] font-bold text-stone-800 line-clamp-2 leading-tight px-0.5">{name}</div>
                  {periodOrDetail && (
                    <div className="text-[8px] text-stone-400 line-clamp-1 mt-0.5">{periodOrDetail}</div>
                  )}
                </div>

                {/* Footer với chấm màu chủ đạo và nhãn "Chưa may" */}
                <div className="w-full flex items-center justify-between pt-1 border-t border-stone-200/50 text-[8.5px]">
                  <span className="flex items-center gap-1 text-stone-500 font-medium">
                    <Clock className="w-2.5 h-2.5 text-stone-400" />
                    Chưa may
                  </span>
                  {colorHex && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs"
                      style={{ backgroundColor: colorHex }}
                      title="Màu sắc áp dụng"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- B. PHỤ KIỆN (MŨ, KHĂN, TRANG SỨC, QUẠT, TÚI) --- */}
        {category === 'accessories' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/60 border border-amber-900/10 flex items-center justify-center mb-1 text-amber-900 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-800" />
            </div>
            <span className="text-[11px] font-bold text-stone-800 line-clamp-2 leading-tight">{name}</span>
            <span className="text-[9px] text-stone-400 mt-1">Phụ kiện</span>
          </div>
        )}

        {/* --- C. GIÀY DÉP --- */}
        {category === 'shoes' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mb-1 text-stone-700 shadow-2xs">
              <svg className="w-5 h-5 text-stone-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 16 L12 16 C16 16 19 14 20 12 L20 18 L4 18 Z" />
                <path d="M4 14 L8 9 L12 11 L14 16" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-stone-800 line-clamp-2 leading-tight">{name}</span>
            <span className="text-[9px] text-stone-400 mt-1">Hài / Giày</span>
          </div>
        )}

        {/* --- D. MÀU SẮC NGŨ HÀNH --- */}
        {category === 'colors' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
            <div
              className="w-10 h-10 rounded-full border-2 border-stone-200/80 shadow-md flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110"
              style={{ backgroundColor: colorHex || '#C0392B' }}
            >
              <span className="text-[11px] font-black text-white drop-shadow-md">
                {elementSymbol}
              </span>
            </div>
            <span className="text-[11px] font-bold text-stone-800 line-clamp-1 leading-tight">{name}</span>
            <span className="text-[9px] text-amber-900 font-medium mt-0.5">Hành {elementSymbol}</span>
          </div>
        )}
      </div>

      {/* 4. GHI CHÚ GIỚI TÍNH NẾU KHÔNG PHÙ HỢP (LÀM MỜ VÀ GHI CHÚ NGẮN THEO DỮ LIỆU) */}
      {!isGenderCompatible && genderNote && (
        <div className="absolute top-1 left-1 max-w-[85%] z-20">
          <span
            className="px-1.5 py-0.5 rounded-md bg-stone-900/85 text-amber-200 text-[7.5px] font-medium tracking-tight flex items-center gap-0.5 shadow-xs truncate"
            title={genderNote}
          >
            <AlertCircle className="w-2.5 h-2.5 shrink-0 text-amber-400" />
            <span className="truncate">{genderNote}</span>
          </span>
        </div>
      )}

      {/* 5. SELECTED BADGE INDICATOR */}
      {isSelected && (
        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-xs z-20">
          <Check className="w-2.5 h-2.5" />
        </div>
      )}
    </div>
  );
};
