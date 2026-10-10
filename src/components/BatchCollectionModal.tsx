import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Square, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { CollectionBatchGenerator } from '../utils/outfitImageService';
import anNhienBaseImg from '../assets/images/an_nhien_base.jpg';
import minhTrietBaseImg from '../assets/images/minh_triet_base.jpg';

interface BatchCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarGender: 'female' | 'male';
  onCollectionCompleted: () => void;
}

export const BatchCollectionModal: React.FC<BatchCollectionModalProps> = ({
  isOpen,
  onClose,
  avatarGender,
  onCollectionCompleted,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(7);
  const [currentCostumeName, setCurrentCostumeName] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const generatorRef = useRef<CollectionBatchGenerator | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (generatorRef.current) {
        generatorRef.current.cancel();
      }
      setIsRunning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const characterName = avatarGender === 'female' ? 'An Nhiên (Nữ)' : 'Minh Triết (Nam)';
  const baseImg = avatarGender === 'female' ? anNhienBaseImg : minhTrietBaseImg;

  const handleStart = async () => {
    setIsRunning(true);
    setIsDone(false);
    setCompleted(0);
    setErrorCount(0);

    const generator = new CollectionBatchGenerator();
    generatorRef.current = generator;

    await generator.runBatch(avatarGender, baseImg, (status) => {
      setCompleted(status.completed);
      setTotal(status.total);
      setCurrentCostumeName(status.currentCostumeName);
      setErrorCount(status.errorCount);
      if (status.isDone) {
        setIsDone(true);
        setIsRunning(false);
        onCollectionCompleted();
      }
      if (status.cancelled) {
        setIsRunning(false);
      }
    });
  };

  const handleCancel = () => {
    if (generatorRef.current) {
      generatorRef.current.cancel();
    }
    setIsRunning(false);
  };

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in select-none">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Tạo Sẵn Bộ Sưu Tập</h3>
              <p className="text-[11px] text-stone-500">May trước 7 bộ trang phục cho {characterName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className={`p-1.5 rounded-full transition cursor-pointer ${
              isRunning ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-400 hover:text-stone-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-amber-950 text-[11px] leading-relaxed">
            Hệ thống sẽ tạo tuần tự (tối đa <strong>2 yêu cầu đồng thời</strong>) ảnh của mọi bộ trang phục ở màu mặc định từ ảnh gốc của <strong>{characterName}</strong>, tự động tách nền và lưu bộ nhớ đệm. Sau khi tạo xong, bạn bấm bộ nào cũng sẽ mặc ngay lập tức!
          </div>

          {/* Progress bar */}
          {(isRunning || isDone) && (
            <div className="space-y-2 p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>Tiến độ may đồ:</span>
                <span className="text-amber-900 font-mono text-sm">{completed}/{total} ({percent}%)</span>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-800 transition-all duration-300 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span className="truncate max-w-[220px]">
                  {isRunning ? `Đang may: ${currentCostumeName}...` : isDone ? 'Đã hoàn tất may đồ!' : ''}
                </span>
                {errorCount > 0 && (
                  <span className="text-rose-600 font-medium">{errorCount} lỗi</span>
                )}
              </div>
            </div>
          )}

          {isDone && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-[11px] font-medium">
                Tuyệt vời! Toàn bộ 7 bộ trang phục cho {characterName} đã sẵn sàng.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          {isRunning ? (
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Hủy Bỏ</span>
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleStart}
                className="px-4.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isDone ? 'May Lại Toàn Bộ' : 'Bắt Đầu May Sẵn'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

