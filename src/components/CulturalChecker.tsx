import React from 'react';
import { StylingRuleViolation } from '../data/costumesData';
import { AlertCircle, AlertTriangle, Lightbulb, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CulturalCheckerProps {
  violations: StylingRuleViolation[];
  onApplyFix?: (suggestion: string) => void;
}

export const CulturalChecker: React.FC<CulturalCheckerProps> = ({ violations }) => {
  const warnings = violations.filter((v) => v.level === 'warning');
  const cautions = violations.filter((v) => v.level === 'caution');
  const tips = violations.filter((v) => v.level === 'tip');

  // Overall status calculation
  const hasSevereWarning = warnings.length > 0;
  const hasCaution = cautions.length > 0;

  let overallBadge = {
    title: '100% Chuẩn Mực Di Sản',
    desc: 'Phối đồ hài hòa, bảo toàn cấu trúc trang phục cổ truyền.',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
  };

  if (hasSevereWarning) {
    overallBadge = {
      title: 'Có Điểm Dễ Gây Hiểu Lầm',
      desc: 'Nên cân nhắc điều chỉnh để tránh sai lệch giá trị lịch sử.',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
    };
  } else if (hasCaution) {
    overallBadge = {
      title: 'Phối Phá Cách – Nên Cân Nhắc Ngữ Cảnh',
      desc: 'Hợp dạo phố Gen Z, nhưng cần lưu ý nếu diện vào sự kiện trang nghiêm.',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    };
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3">
      {/* Header Status Bar */}
      <div className={`flex items-start gap-3 p-3 rounded-xl border ${overallBadge.color} transition-colors`}>
        <div className="p-1 rounded-lg bg-white/80 shadow-2xs shrink-0">{overallBadge.icon}</div>
        <div>
          <h4 className="font-semibold text-sm leading-tight">{overallBadge.title}</h4>
          <p className="text-xs opacity-90 mt-0.5">{overallBadge.desc}</p>
        </div>
      </div>

      {/* Itemized Notices */}
      <div className="space-y-2">
        {/* Level 3: Dễ gây hiểu lầm (Warning - Rose/Red) */}
        {warnings.map((v, idx) => (
          <div
            key={`w-${idx}`}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/80 border border-red-200/80 text-red-900 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="font-bold text-red-700 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-red-100 mr-1.5 inline-block">
                Dễ gây hiểu lầm
              </span>
              <span className="font-semibold">{v.title}</span>
              <p className="text-stone-700 leading-relaxed">{v.message}</p>
              {v.recommendation && (
                <p className="font-medium text-red-800 pt-0.5">
                  👉 <em>{v.recommendation}</em>
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Level 2: Nên cân nhắc (Caution - Amber/Gold) */}
        {cautions.map((v, idx) => (
          <div
            key={`c-${idx}`}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-amber-100 mr-1.5 inline-block">
                Nên cân nhắc
              </span>
              <span className="font-semibold">{v.title}</span>
              <p className="text-stone-700 leading-relaxed">{v.message}</p>
              {v.recommendation && (
                <p className="font-medium text-amber-800 pt-0.5">
                  💡 <em>{v.recommendation}</em>
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Level 1: Gợi ý nhẹ (Tip - Emerald/Mint) */}
        {tips.map((v, idx) => (
          <div
            key={`t-${idx}`}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-emerald-950 text-xs"
          >
            <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 mr-1.5 inline-block">
                Gợi ý nhẹ
              </span>
              <span className="font-semibold">{v.title}</span>
              <p className="text-stone-700 leading-relaxed">{v.message}</p>
            </div>
          </div>
        ))}

        {violations.length === 0 && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Không phát hiện vi phạm quy cách văn hóa nào trong set đồ này.</span>
          </div>
        )}
      </div>
    </div>
  );
};
