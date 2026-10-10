import React, { useState } from 'react';
import { CostumeItem } from '../data/costumesData';
import { X, BookOpen, ExternalLink, Flag, Check, AlertCircle, Sparkles } from 'lucide-react';

interface KnowledgeModalProps {
  costume: CostumeItem;
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  costume,
  isOpen,
  onClose,
}) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportIssue, setReportIssue] = useState('structure');
  const [reportDetail, setReportDetail] = useState('');
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportSubmitted(true);
    setTimeout(() => {
      setIsReportSubmitted(false);
      setShowReportForm(false);
      setReportDetail('');
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#FDFBF7] rounded-3xl border border-amber-900/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Header with Heritage Banner */}
        <div className="relative p-5 pb-4 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Hồ Sơ Di Sản & Tri Thức Văn Hóa
              </span>
              <h3 className="font-serif-title text-xl font-bold mt-1 text-white">
                {costume.name}
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                {costume.period_region}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 leading-relaxed">
          {/* Section 1: Meaning & Origin */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Ý Nghĩa & Nguồn Gốc (Dành cho Gen Z)
            </h4>
            <p className="text-stone-800 leading-relaxed">
              {costume.cultural_meaning}
            </p>
          </div>

          {/* Section 2: Core Anatomical Features (Cấu trúc bất biến) */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Đặc Điểm Nhận Diện Cốt Lõi
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                <span className="font-semibold text-stone-500 text-[10px] uppercase block">
                  Kiểu Cổ Áo
                </span>
                <span className="font-medium text-stone-800">
                  {costume.characteristics.collar}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                <span className="font-semibold text-stone-500 text-[10px] uppercase block">
                  Tay Áo
                </span>
                <span className="font-medium text-stone-800">
                  {costume.characteristics.sleeves}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                <span className="font-semibold text-stone-500 text-[10px] uppercase block">
                  Cấu Trúc Thân
                </span>
                <span className="font-medium text-stone-800">
                  {costume.characteristics.panels}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                <span className="font-semibold text-stone-500 text-[10px] uppercase block">
                  Khuy / Cúc
                </span>
                <span className="font-medium text-stone-800">
                  {costume.characteristics.buttons}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Verification Note (Minh bạch học thuật) */}
          {costume.verification_note && (
            <div className="p-3 rounded-xl bg-stone-100/90 border border-stone-300 text-stone-800 space-y-1">
              <span className="font-bold text-[11px] text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Ghi Chú Kiểm Chứng Lịch Sử
              </span>
              <p className="text-[11px] text-stone-700 italic leading-normal">
                {costume.verification_note}
              </p>
            </div>
          )}

          {/* Section 4: Common Styling Mistakes */}
          <div className="p-3 rounded-2xl bg-red-50/70 border border-red-200/80 space-y-1.5">
            <h4 className="font-bold text-red-900 text-xs">
              Các Lỗi Phối Đồ Dễ Gặp (Cần Tránh)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-stone-700">
              {costume.common_mistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: References & Sources */}
          <div className="pt-2 border-t border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-stone-500" />
              Tư Liệu & Nguồn Tham Khảo
            </h4>
            <div className="space-y-1.5">
              {costume.references.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-white border border-stone-200 text-[11px]"
                >
                  <span className="font-semibold text-stone-800">
                    "{ref.title}"
                  </span>
                  <span className="text-stone-500"> — {ref.authorOrOrg}</span>
                  {ref.note && (
                    <span className="text-stone-400 block text-[10px]">
                      {ref.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Report Feedback Mechanism */}
          <div className="pt-2">
            {!showReportForm ? (
              <button
                onClick={() => setShowReportForm(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-stone-500" />
                <span>Bạn phát hiện thông tin chưa đúng? Góp ý cùng cộng đồng</span>
              </button>
            ) : (
              <form
                onSubmit={handleReportSubmit}
                className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2.5 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-xs flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 text-amber-700" />
                    Đóng Góp Ý Kiến Học Thuật
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Vấn đề bạn nhận thấy:
                  </label>
                  <select
                    value={reportIssue}
                    onChange={(e) => setReportIssue(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="structure">Sai cấu trúc vạt / cổ / cúc áo</option>
                    <option value="period">Nhầm lẫn niên đại hoặc bối cảnh lịch sử</option>
                    <option value="origin">Nguồn gốc / Tên gọi chưa chuẩn xác</option>
                    <option value="other">Bổ sung tư liệu nghiên cứu mới</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Chi tiết & nguồn tham khảo đề xuất:
                  </label>
                  <textarea
                    rows={2}
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                    required
                    placeholder="Ví dụ: Theo sách X trang Y, vạt áo thời kỳ này thường..."
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isReportSubmitted}
                  className="w-full py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isReportSubmitted ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Cảm ơn đóng góp quý giá của bạn!</span>
                    </>
                  ) : (
                    <span>Gửi phản hồi cho ban biên tập</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            Đã Hiểu & Tiếp Tục Phối Đồ
          </button>
        </div>
      </div>
    </div>
  );
};
