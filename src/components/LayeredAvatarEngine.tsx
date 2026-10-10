import React, { useState, useEffect, useRef } from 'react';
import { CostumeItem, ClothingPiece, ColorOption } from '../data/costumesData';
import anNhienBaseImg from '../assets/images/an_nhien_base.jpg';
import minhTrietBaseImg from '../assets/images/minh_triet_base.jpg';
import { removeWhiteBackground } from '../utils/backgroundRemoval';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export type AvatarGender = 'female' | 'male';

export interface LayeredAvatarEngineProps {
  gender?: AvatarGender;
  costume: CostumeItem;
  color: ColorOption;
  bottom: ClothingPiece;
  footwear: ClothingPiece;
  accessories: ClothingPiece[];
  styleMode: 'traditional' | 'light_modern' | 'genz_streetwear';
  cameraZoom?: 'full' | 'upper' | 'lower';
  compactStage?: boolean;
  // Outfit image states passed from parent controller
  currentOutfitImage?: string | null;
  isGenerating?: boolean;
  generationStatus?: string;
  isFailed?: boolean;
  errorMessage?: string;
  isCached?: boolean;
  outfitKey?: string;
  imageSourceText?: string;
  onRetry?: () => void;
}

export const LayeredAvatarEngine: React.FC<LayeredAvatarEngineProps> = ({
  gender = 'female',
  costume,
  color,
  bottom,
  footwear,
  accessories,
  cameraZoom = 'full',
  compactStage = false,
  currentOutfitImage = null,
  isGenerating = false,
  generationStatus = 'Đang may đồ...',
  isFailed = false,
  errorMessage = 'Chưa may được bộ này',
  isCached = false,
  outfitKey = '',
  imageSourceText = '',
  onRetry,
}) => {
  const isFemale = gender === 'female';

  // State lưu ảnh gốc đã tách nền trong suốt
  const [baseTransparentAnNhien, setBaseTransparentAnNhien] = useState<string>(anNhienBaseImg);
  const [baseTransparentMinhTriet, setBaseTransparentMinhTriet] = useState<string>(minhTrietBaseImg);

  // Hiệu ứng hoàn tất thay đồ (vệt sáng quét và cánh hoa bay)
  const [showShineEffect, setShowShineEffect] = useState(false);
  const previousOutfitImageRef = useRef<string | null>(null);

  // Tách nền ảnh gốc khi mount hoặc gender thay đổi
  useEffect(() => {
    let active = true;
    const processBase = async () => {
      try {
        if (isFemale && baseTransparentAnNhien === anNhienBaseImg) {
          const trans = await removeWhiteBackground(anNhienBaseImg, 26, 2);
          if (active) setBaseTransparentAnNhien(trans);
        } else if (!isFemale && baseTransparentMinhTriet === minhTrietBaseImg) {
          const trans = await removeWhiteBackground(minhTrietBaseImg, 26, 2);
          if (active) setBaseTransparentMinhTriet(trans);
        }
      } catch (err) {
        console.warn('Không thể tách nền ảnh gốc:', err);
      }
    };
    processBase();
    return () => {
      active = false;
    };
  }, [gender, isFemale]);

  // Kích hoạt hiệu ứng thay đồ (shimmer sweep & sparkles) khi có ảnh trang phục mới
  useEffect(() => {
    if (currentOutfitImage && currentOutfitImage !== previousOutfitImageRef.current) {
      previousOutfitImageRef.current = currentOutfitImage;
      setShowShineEffect(true);
      const timer = setTimeout(() => {
        setShowShineEffect(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [currentOutfitImage]);

  // Camera zoom CSS transforms
  const getCameraTransform = () => {
    switch (cameraZoom) {
      case 'upper':
        return 'scale(1.5) translateY(18%)';
      case 'lower':
        return 'scale(1.28) translateY(-14%)';
      case 'full':
      default:
        return 'scale(1) translateY(0)';
    }
  };

  // Xác định ảnh hiển thị trên sân khấu
  const baseImg = isFemale ? baseTransparentAnNhien : baseTransparentMinhTriet;
  const activeDisplayImg = currentOutfitImage || baseImg;

  // Dòng chữ debug chuẩn theo yêu cầu:
  // "IMG: nguồn ảnh | OUTFIT: khóa công thức | cache: có/chưa"
  const debugSource = imageSourceText || (currentOutfitImage ? 'AI Image' : (isFemale ? 'an_nhien_base.jpg' : 'minh_triet_base.jpg'));
  const debugCache = isCached ? 'có' : 'chưa';
  const debugKey = outfitKey || `${gender}_${costume.id}_${color.id}`;

  return (
    <div
      className={`relative w-full ${
        compactStage ? 'max-w-[280px]' : 'max-w-[460px] md:max-w-[500px] h-[92%] max-h-[720px]'
      } mx-auto aspect-[3/4] flex items-center justify-center p-1.5 select-none overflow-hidden`}
    >
      {/* --- THEATRICAL STAGE BACKDROP --- */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE0D3] border border-amber-900/15 shadow-inner overflow-hidden pointer-events-none">
        {/* Traditional Heritage Water Wave Motif (Thủy Ba Cung Đình) */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-24 opacity-[0.06] text-amber-950 pointer-events-none"
          viewBox="0 0 100 25"
          preserveAspectRatio="none"
        >
          <path d="M0 25 Q 12.5 10, 25 25 T 50 25 T 75 25 T 100 25 V 25 H 0 Z" fill="currentColor" />
          <path d="M0 20 Q 12.5 5, 25 20 T 50 20 T 75 20 T 100 20 V 25 H 0 Z" fill="currentColor" />
        </svg>

        {/* Center soft theatrical glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />
      </div>

      {/* --- SÂN KHẤU CHÍNH VỚI BỤC TRÒN VÀ ẢNH NHÂN VẬT --- */}
      <div
        style={{
          transform: getCameraTransform(),
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
        }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {/* SVG BỤC TRÒN SƠN MÀI VÀ BÓNG TIẾP XÚC CHÂN */}
        <svg
          viewBox="0 0 400 600"
          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Stage Dais Radial Lighting & Shading */}
            <radialGradient id="daisLightGrad" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#EFE6D8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#D9CCA8" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="daisRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C4A876" />
              <stop offset="50%" stopColor="#A88B58" />
              <stop offset="100%" stopColor="#6B4F25" />
            </linearGradient>
          </defs>

          {/* BỤC TRÒN SÂN KHẤU (STAGE DAIS) */}
          <g id="stageDais">
            {/* Ambient floor shadow */}
            <ellipse cx="200" cy="542" rx="158" ry="34" fill="#78350F" opacity="0.08" />
            <ellipse cx="200" cy="536" rx="146" ry="28" fill="#78350F" opacity="0.14" />

            {/* Dais 3D Base Skirt */}
            <path
              d="M54 518 C54 544, 346 544, 346 518 L346 534 C346 560, 54 560, 54 534 Z"
              fill="url(#daisRimGrad)"
              stroke="#593E15"
              strokeWidth="1.2"
            />
            <ellipse cx="200" cy="534" rx="146" ry="26" fill="none" stroke="#4A3210" strokeWidth="1" opacity="0.45" />

            {/* Dais Top Circular Surface */}
            <ellipse cx="200" cy="518" rx="146" ry="27" fill="url(#daisLightGrad)" stroke="#8C6D37" strokeWidth="1.4" />

            {/* Concentric Border */}
            <ellipse cx="200" cy="518" rx="139" ry="24.5" fill="none" stroke="#B45309" strokeWidth="0.9" strokeDasharray="5 3" opacity="0.65" />
            <ellipse cx="200" cy="518" rx="132" ry="22" fill="none" stroke="#D97706" strokeWidth="0.6" opacity="0.4" />

            {/* Center Spotlight */}
            <ellipse cx="200" cy="516" rx="88" ry="16" fill="#FFFFFF" opacity="0.38" />

            {/* Feet Contact Shadow (Bóng tiếp xúc trực tiếp dưới chân) */}
            <ellipse cx="170" cy="520" rx="20" ry="5.5" fill="#3B1E08" opacity="0.45" />
            <ellipse cx="230" cy="520" rx="20" ry="5.5" fill="#3B1E08" opacity="0.45" />
            <ellipse cx="200" cy="522" rx="58" ry="8" fill="#241103" opacity="0.22" />
          </g>
        </svg>

        {/* CONTAINER ẢNH NHÂN VẬT ĐÃ TÁCH NỀN ĐỨNG TRÊN BỤC */}
        <div
          className={`relative z-10 w-[85%] h-[82%] mb-12 flex items-center justify-center transition-all duration-300 ${
            isGenerating ? 'opacity-70 scale-[0.99]' : 'opacity-100 scale-100'
          }`}
        >
          {/* Ảnh nhân vật hiển thị (Idle Breathing Animation nhẹ nhàng) */}
          <img
            src={activeDisplayImg}
            alt={isFemale ? 'An Nhiên' : 'Minh Triết'}
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] animate-[breathe_4s_ease-in-out_infinite]"
          />

          {/* HIỆU ỨNG THAY ĐỒ: SHIMMER WIPE (VỆT SÁNG QUÉT QUA THÂN ÁO) */}
          {showShineEffect && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div className="w-[180%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -rotate-45 translate-x-[-120%] animate-[shimmerWipe_1.2s_ease-out_forwards]" />
              {/* Cánh hoa & sparkles rơi nhẹ */}
              <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
                <span className="text-xl animate-bounce duration-700 opacity-80">🌸</span>
                <span className="text-sm animate-pulse text-amber-300">✨</span>
                <span className="text-lg animate-bounce duration-1000 opacity-80">🌸</span>
                <span className="text-base animate-pulse text-amber-200">✨</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- LỚP TRẠNG THÁI "ĐANG MAY ĐỒ..." (NẰM PHÍA DƯỚI, KHÔNG CHE MẶT NHÂN VẬT) --- */}
      {isGenerating && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 text-white backdrop-blur-md shadow-xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-xs font-semibold text-amber-200 tracking-tight">
            {generationStatus || 'Đang may đồ...'}
          </span>
        </div>
      )}

      {/* --- THẺ GỌN KHI THẤT BẠI: "CHƯA MAY ĐƯỢC BỘ NÀY" KÈM NÚT THỬ LẠI --- */}
      {isFailed && !isGenerating && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-rose-950/90 text-white backdrop-blur-md shadow-xl border border-rose-500/40 animate-in fade-in duration-200 max-w-[90%]">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="text-left">
            <div className="text-[11px] font-bold text-rose-200 leading-tight">
              {errorMessage || 'Chưa may được bộ này'}
            </div>
            <div className="text-[9px] text-rose-300/80 leading-tight">Thử lại hoặc chọn bộ khác</div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-1 px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      {/* --- DÒNG CHỮ DEBUG Ở GÓC DƯỚI THEO ĐÚNG YÊU CẦU: --- */}
      {/* "IMG: nguồn ảnh | OUTFIT: khóa công thức | cache: có/chưa" */}
      <div className="absolute bottom-2 left-3 z-20 pointer-events-none text-[9.5px] font-mono text-stone-700/80 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-300/60 shadow-2xs max-w-[85%] truncate">
        IMG: <span className="font-semibold text-amber-900">{debugSource}</span> | OUTFIT: <span className="text-stone-800">{debugKey}</span> | cache: <span className={isCached ? 'text-emerald-700 font-bold' : 'text-amber-800 font-bold'}>{debugCache}</span>
      </div>
    </div>
  );
};
