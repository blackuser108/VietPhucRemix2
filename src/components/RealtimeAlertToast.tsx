import React from 'react';
import { StylingRuleViolation } from '../data/costumesData';
import { AlertCircle, AlertTriangle, Lightbulb, ChevronRight, X } from 'lucide-react';

interface RealtimeAlertToastProps {
  violations: StylingRuleViolation[];
  onOpenDetails: (violation: StylingRuleViolation) => void;
  onDismiss?: () => void;
}

export const RealtimeAlertToast: React.FC<RealtimeAlertToastProps> = ({
  violations,
  onOpenDetails,
  onDismiss,
}) => {
  if (violations.length === 0) return null;

  // Prioritize most severe violation: warning > caution > tip
  const topViolation =
    violations.find((v) => v.level === 'warning') ||
    violations.find((v) => v.level === 'caution') ||
    violations[0];

  const isWarning = topViolation.level === 'warning';
  const isCaution = topViolation.level === 'caution';

  const badgeConfig = isWarning
    ? {
        label: '🛑 Dễ Gây Hiểu Lầm',
        bg: 'bg-rose-50/95 border-rose-300 text-rose-950 shadow-lg shadow-rose-950/10',
        badgeBg: 'bg-rose-600 text-white',
        icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
      }
    : isCaution
    ? {
        label: '⚠️ Nên Cân Nhắc',
        bg: 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-lg shadow-amber-950/10',
        badgeBg: 'bg-amber-500 text-white',
        icon: <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />,
      }
    : {
        label: '💡 Gợi Ý Nhẹ',
        bg: 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-lg shadow-emerald-950/10',
        badgeBg: 'bg-emerald-600 text-white',
        icon: <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />,
      };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-2xl border p-3.5 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in ${badgeConfig.bg}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="pt-0.5">{badgeConfig.icon}</div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider ${badgeConfig.badgeBg}`}>
                {badgeConfig.label}
              </span>
              <span className="font-bold text-xs">{topViolation.title}</span>
            </div>
            <p className="text-xs text-stone-700 leading-snug line-clamp-2">
              {topViolation.message}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition cursor-pointer"
            aria-label="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between">
        <span className="text-[11px] text-stone-500 font-medium">
          {violations.length > 1 ? `Còn ${violations.length - 1} lưu ý khác` : 'Bảo đảm quy chuẩn văn hóa'}
        </span>
        <button
          onClick={() => onOpenDetails(topViolation)}
          className="text-xs font-bold text-amber-900 hover:text-red-700 flex items-center gap-1 transition cursor-pointer bg-white/70 px-2.5 py-1 rounded-lg border border-black/5 hover:bg-white"
        >
          <span>Tìm hiểu thêm & Cách sửa</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
