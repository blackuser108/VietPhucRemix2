import React from 'react';
import { CostumeItem, ColorOption, ClothingPiece, checkCulturalRules, evaluateColorHarmony } from '../data/costumesData';
import { OutfitVisualizer } from './OutfitVisualizer';
import { X, ArrowRightLeft, ShieldCheck, Palette, CheckCircle2 } from 'lucide-react';

export interface OutfitConfig {
  costume: CostumeItem;
  color: ColorOption;
  bottom: ClothingPiece;
  footwear: ClothingPiece;
  accessories: ClothingPiece[];
  styleMode: 'traditional' | 'light_modern' | 'genz_streetwear';
  name?: string;
}

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfitA: OutfitConfig;
  outfitB: OutfitConfig;
  savedOutfits?: (OutfitConfig & { id: string; savedAt: string; eventName: string })[];
  onSelectOutfit?: (outfit: OutfitConfig) => void;
  onUpdateOutfitB?: (outfit: OutfitConfig) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  outfitA,
  outfitB,
  savedOutfits = [],
  onSelectOutfit,
  onUpdateOutfitB,
}) => {
  if (!isOpen) return null;

  const violationsA = checkCulturalRules(
    outfitA.costume,
    outfitA.bottom,
    outfitA.footwear,
    outfitA.accessories
  );
  const violationsB = checkCulturalRules(
    outfitB.costume,
    outfitB.bottom,
    outfitB.footwear,
    outfitB.accessories
  );

  const harmonyA = evaluateColorHarmony(outfitA.color, outfitA.bottom, outfitA.costume);
  const harmonyB = evaluateColorHarmony(outfitB.color, outfitB.bottom, outfitB.costume);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FDFBF7] rounded-3xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif-title text-base sm:text-lg font-bold">
                So Sánh Đối Chiếu 2 Phương Án Phối
              </h3>
              <p className="text-[11px] text-stone-300 hidden sm:block">
                Đánh giá sự cân bằng giữa tính chính xác di sản và thẩm mỹ hiện đại
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2 Columns Side by Side */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-5 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {/* Column A */}
          <div className="space-y-4 pt-4 md:pt-0">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 font-bold text-xs">
                Phương Án 1 (Đang Phối)
              </span>
              <span className="text-xs text-stone-500 font-medium capitalize">
                {outfitA.styleMode === 'traditional' ? 'Thuần truyền thống' : outfitA.styleMode === 'light_modern' ? 'Cách tân nhẹ' : 'Gen Z Streetwear'}
              </span>
            </div>

            <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-2">
              <OutfitVisualizer
                costume={outfitA.costume}
                color={outfitA.color}
                bottom={outfitA.bottom}
                footwear={outfitA.footwear}
                accessories={outfitA.accessories}
                styleMode={outfitA.styleMode}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block text-sm">
                  {outfitA.name || outfitA.costume.name}
                </span>
                <p className="text-stone-600">
                  Phối: {outfitA.bottom.name} • {outfitA.footwear.name}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {outfitA.accessories.map((a) => (
                    <span
                      key={a.id}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cultural Score A */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Chuẩn mực văn hóa:</span>
                </div>
                <span className="font-bold">
                  {violationsA.filter((v) => v.level === 'warning').length === 0 ? '100% Đạt chuẩn' : 'Có điểm cần lưu ý'}
                </span>
              </div>

              {/* Color Harmony A */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Palette className="w-4 h-4 text-amber-700" />
                  <span>Hài hòa màu sắc:</span>
                </div>
                <span className="font-bold">{harmonyA.score}/100 ({harmonyA.principleLabel})</span>
              </div>
            </div>

            {onSelectOutfit && (
              <button
                onClick={() => {
                  onSelectOutfit(outfitA);
                  onClose();
                }}
                className="w-full py-2 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Giữ Phương Án 1</span>
              </button>
            )}
          </div>

          {/* Column B */}
          <div className="space-y-4 pt-4 md:pt-0 md:pl-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
                Phương Án 2 (Tham Chiếu)
              </span>
              <span className="text-xs text-stone-500 font-medium capitalize">
                {outfitB.styleMode === 'traditional' ? 'Thuần truyền thống' : outfitB.styleMode === 'light_modern' ? 'Cách tân nhẹ' : 'Gen Z Streetwear'}
              </span>
            </div>

            <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-2">
              <OutfitVisualizer
                costume={outfitB.costume}
                color={outfitB.color}
                bottom={outfitB.bottom}
                footwear={outfitB.footwear}
                accessories={outfitB.accessories}
                styleMode={outfitB.styleMode}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block text-sm">
                  {outfitB.name || outfitB.costume.name}
                </span>
                <p className="text-stone-600">
                  Phối: {outfitB.bottom.name} • {outfitB.footwear.name}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {outfitB.accessories.map((a) => (
                    <span
                      key={a.id}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cultural Score B */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Chuẩn mực văn hóa:</span>
                </div>
                <span className="font-bold">
                  {violationsB.filter((v) => v.level === 'warning').length === 0 ? '100% Đạt chuẩn' : 'Có điểm cần lưu ý'}
                </span>
              </div>

              {/* Color Harmony B */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Palette className="w-4 h-4 text-amber-700" />
                  <span>Hài hòa màu sắc:</span>
                </div>
                <span className="font-bold">{harmonyB.score}/100 ({harmonyB.principleLabel})</span>
              </div>
            </div>

            {onSelectOutfit && (
              <button
                onClick={() => {
                  onSelectOutfit(outfitB);
                  onClose();
                }}
                className="w-full py-2 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Chuyển Sang Phương Án 2</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
