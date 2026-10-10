import React from 'react';
import { CostumeItem, StylingRuleViolation } from '../data/costumesData';
import { X, BookOpen, AlertCircle, AlertTriangle, Lightbulb, Wrench, Check, ExternalLink } from 'lucide-react';

interface CulturalBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'info' | 'violation';
  costume?: CostumeItem;
  violation?: StylingRuleViolation | null;
  onApplyFix?: () => void;
}

export const CulturalBottomSheet: React.FC<CulturalBottomSheetProps> = ({
  isOpen,
  onClose,
  type,
  costume,
  violation,
  onApplyFix,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slender Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-t-3xl border-t border-x border-amber-900/20 shadow-2xl overflow-hidden p-5 max-h-[65vh] flex flex-col space-y-3 z-10 animate-in slide-in-from-bottom-5 duration-300">
        {/* Drag handle */}
        <div className="w-12 h-1.5 rounded-full bg-stone-300 mx-auto -mt-1 mb-1 cursor-grab" onClick={onClose} />

        {/* Content Type: Costume Origin & Meaning (Icon 'i') */}
        {type === 'info' && costume && (
          <div className="space-y-3 overflow-y-auto pr-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {costume.period_region}
                </span>
                <h3 className="font-serif-title text-lg font-bold text-stone-900 mt-1">
                  {costume.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-amber-50/80 p-3 rounded-2xl border border-amber-200/60">
              {costume.cultural_meaning}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Cổ Áo</span>
                <span className="text-stone-800 font-medium">{costume.characteristics.collar}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Khuy Cúc</span>
                <span className="text-stone-800 font-medium">{costume.characteristics.buttons}</span>
              </div>
            </div>

            {costume.references && costume.references.length > 0 && (
              <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Nguồn tư liệu:
                </span>
                <p className="italic mt-0.5">
                  {costume.references[0].title} — {costume.references[0].authorOrOrg}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Content Type: Cultural Warning Explanation */}
        {type === 'violation' && violation && (
          <div className="space-y-3 overflow-y-auto pr-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {violation.level === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                ) : violation.level === 'caution' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                <div>
                  <span
                    className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider ${
                      violation.level === 'warning'
                        ? 'bg-red-100 text-red-800'
                        : violation.level === 'caution'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {violation.level === 'warning'
                      ? 'Dễ gây hiểu lầm'
                      : violation.level === 'caution'
                      ? 'Nên cân nhắc'
                      : 'Gợi ý nhẹ'}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mt-1">
                    {violation.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-2xl border border-stone-200">
              {violation.message}
            </p>

            {violation.recommendation && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-700" />
                  Gợi Ý Stylist:
                </span>
                <p className="text-stone-700">{violation.recommendation}</p>
              </div>
            )}

            {onApplyFix && violation.recommendation && (
              <button
                onClick={() => {
                  onApplyFix();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tự Động Sửa Sang Gợi Ý Chuẩn</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
