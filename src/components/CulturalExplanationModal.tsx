import React from 'react';
import { StylingRuleViolation } from '../data/costumesData';
import { X, BookOpen, AlertCircle, AlertTriangle, Lightbulb, Wrench, Check } from 'lucide-react';

interface CulturalExplanationModalProps {
  violation: StylingRuleViolation | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation?: () => void;
}

export const CulturalExplanationModal: React.FC<CulturalExplanationModalProps> = ({
  violation,
  isOpen,
  onClose,
  onApplyRecommendation,
}) => {
  if (!isOpen || !violation) return null;

  const isWarning = violation.level === 'warning';
  const isCaution = violation.level === 'caution';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-3xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`p-4 px-5 flex items-center justify-between text-white ${
            isWarning
              ? 'bg-gradient-to-r from-red-800 to-rose-900'
              : isCaution
              ? 'bg-gradient-to-r from-amber-700 to-yellow-800'
              : 'bg-gradient-to-r from-emerald-700 to-teal-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {isWarning ? (
              <AlertCircle className="w-5 h-5 text-white" />
            ) : isCaution ? (
              <AlertTriangle className="w-5 h-5 text-white" />
            ) : (
              <Lightbulb className="w-5 h-5 text-white" />
            )}
            <h3 className="font-serif-title text-base font-bold">
              Giải Mã Quy Chuẩn Văn Hóa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-stone-700 leading-relaxed overflow-y-auto max-h-[75vh]">
          {/* Title & Badge */}
          <div className="space-y-1">
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                isWarning
                  ? 'bg-red-100 text-red-800'
                  : isCaution
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isWarning
                ? 'Mức 3: Dễ gây hiểu lầm nghiêm trọng'
                : isCaution
                ? 'Mức 2: Nên cân nhắc bối cảnh'
                : 'Mức 1: Gợi ý nâng tầm phong cách'}
            </span>
            <h4 className="font-bold text-base text-stone-900 pt-1">
              {violation.title}
            </h4>
          </div>

          {/* Full Explanation */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h5 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              Nguồn Cội & Lý Do Lịch Sử
            </h5>
            <p className="text-stone-700 leading-relaxed">
              {violation.message}
            </p>
          </div>

          {/* Positive Stylist Recommendation */}
          {violation.recommendation && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
              <h5 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-700" />
                Giải Pháp Khuyên Dùng Cho Gen Z
              </h5>
              <p className="text-stone-800 leading-relaxed font-medium">
                {violation.recommendation}
              </p>
            </div>
          )}

          {/* Philosophical takeaway */}
          <div className="p-3 rounded-xl bg-stone-100 border border-stone-200/80 text-[11px] text-stone-600 italic">
            "Sáng tạo hiện đại chỉ thực sự thăng hoa khi chúng ta thấu hiểu và trân trọng ranh giới cốt lõi của tiền nhân."
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-100 transition cursor-pointer"
          >
            Đã Hiểu & Đóng
          </button>

          {onApplyRecommendation && violation.recommendation && (
            <button
              onClick={() => {
                onApplyRecommendation();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tự Động Áp Dụng Gợi Ý Chuẩn</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
