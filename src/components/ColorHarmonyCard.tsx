import React, { useState } from 'react';
import { ColorOption, ClothingPiece, CostumeItem, evaluateColorHarmony } from '../data/costumesData';
import { Sparkles, Palette, History, Compass } from 'lucide-react';
import { HeritageLoader } from './HeritageLoader';

interface ColorHarmonyCardProps {
  color: ColorOption;
  bottom: ClothingPiece;
  costume: CostumeItem;
}

export const ColorHarmonyCard: React.FC<ColorHarmonyCardProps> = ({
  color,
  bottom,
  costume,
}) => {
  const result = evaluateColorHarmony(color, bottom, costume);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const fetchAiColorExplanation = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/color-harmony', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeName: costume.name,
          colorName: color.name,
          colorElement: color.element,
          bottomName: bottom.name,
        }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation(result.explanation);
      }
    } catch {
      setAiExplanation(result.explanation);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3.5">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-800" />
          <h4 className="font-semibold text-sm text-stone-800">Kiểm Tra Hài Hòa Màu Sắc</h4>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <span>{result.score}/100</span>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-600 transition-all duration-500 rounded-full"
          style={{ width: `${result.score}%` }}
        />
      </div>

      {/* Main Principle & Verdict Badge */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <span className="font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 flex items-center gap-1">
          <Compass className="w-3 h-3 text-stone-500" />
          {result.principleLabel}
        </span>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {result.verdict}
        </span>
      </div>

      {/* Explanation Box */}
      <div className="p-3 rounded-xl bg-[#FDFBF7] border border-amber-900/10 text-xs space-y-2">
        <p className="text-stone-700 leading-relaxed font-medium">
          {aiExplanation || result.explanation}
        </p>

        {/* Traditional Historical Precedent */}
        {result.traditionalPrecedent && (
          <div className="pt-2 border-t border-stone-200/60 flex items-start gap-1.5 text-amber-950">
            <History className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span className="text-[11px] text-stone-600 leading-snug">
              {result.traditionalPrecedent}
            </span>
          </div>
        )}

        <div className="pt-1 text-[11px] text-stone-500 italic">
          💡 Stylist Tip: {result.recommendation}
        </div>
      </div>

      {/* Button or Heritage Loading State */}
      {isLoadingAi ? (
        <HeritageLoader
          message="Cố Vấn AI đang phân tích thẩm mỹ & phong thủy..."
          showFact={true}
        />
      ) : !aiExplanation ? (
        <button
          onClick={fetchAiColorExplanation}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Hỏi Cố Vấn AI về ý nghĩa phong thủy & chiều sâu màu sắc</span>
        </button>
      ) : null}
    </div>
  );
};

