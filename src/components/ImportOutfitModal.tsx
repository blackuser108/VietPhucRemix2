import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, Copy, FileText, CheckCircle2 } from 'lucide-react';
import { getExpectedFileList, importOutfitImages, ExpectedFileInfo } from '../utils/outfitStorage';

interface ImportOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export const ImportOutfitModal: React.FC<ImportOutfitModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'expected_files'>('upload');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const expectedFiles = getExpectedFileList();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setResultMessage(null);
    setErrorList([]);

    try {
      const res = await importOutfitImages(files);
      if (res.importedCount > 0) {
        setResultMessage(`Đã nhập thành công ${res.importedCount} ảnh trang phục vào bộ nhớ đệm!`);
        onImportSuccess();
      } else {
        setResultMessage('Chưa nhập được ảnh nào.');
      }
      if (res.errors.length > 0) {
        setErrorList(res.errors);
      }
    } catch (err: unknown) {
      setErrorList([(err as Error).message]);
    } finally {
      setIsProcessing(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleCopyExpectedList = () => {
    const text = expectedFiles.map((f) => `${f.fileName}\t(${f.characterName} - ${f.costumeName} - ${f.colorName})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Nhập Ảnh Trang Phục Thiết Kế Sẵn</h3>
              <p className="text-[11px] text-stone-500">Tải lên hàng loạt ảnh PNG nền trong suốt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 p-1 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'upload' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải Ảnh Lên</span>
          </button>
          <button
            onClick={() => setActiveTab('expected_files')}
            className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'expected_files' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Danh Sách Tên File ({expectedFiles.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5 text-xs">
          {activeTab === 'upload' ? (
            <>
              {/* Box upload */}
              <label className="border-2 border-dashed border-amber-800/30 hover:border-amber-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/70 hover:bg-amber-50/40 transition cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-amber-800 mb-2 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-bold text-stone-800 text-sm">
                  {isProcessing ? 'Đang đọc và tách nền...' : 'Bấm để chọn nhiều tệp ảnh PNG'}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 max-w-xs">
                  Đặt tên dạng <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900 font-mono">nhanhien_&lt;mã bộ&gt;_&lt;mã màu&gt;.png</code> hoặc <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900 font-mono">minhtriet_...</code>
                </span>
              </label>

              {/* Thông báo kết quả */}
              {resultMessage && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{resultMessage}</div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">
                      Ảnh đã được lưu vào IndexedDB. Khi bấm vào bộ tương ứng, nhân vật sẽ mặc ngay tức thì!
                    </div>
                  </div>
                </div>
              )}

              {/* Lỗi cảnh báo nếu có */}
              {errorList.length > 0 && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Lưu ý ({errorList.length} tệp chưa khớp quy ước):</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5 text-[10.5px] text-rose-800 max-h-32 overflow-y-auto">
                    {errorList.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hướng dẫn quy tắc đặt tên */}
              <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 text-stone-600 space-y-1 text-[11px]">
                <div className="font-bold text-stone-800">Quy tắc đặt tên file:</div>
                <div>• Nữ (An Nhiên): <code className="font-mono text-amber-900">nhanhien_ao_tac_vang_nghe.png</code></div>
                <div>• Nam (Minh Triết): <code className="font-mono text-amber-900">minhtriet_ngu_than_tay_chen_cham_dam.png</code></div>
                <div className="text-[10px] text-stone-500 italic mt-1">
                  Mẹo: Hệ thống tự động tách nền nếu ảnh của bạn chưa phải PNG trong suốt.
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] text-stone-600">
                  Tổng cộng: <strong className="text-stone-900">{expectedFiles.length} file</strong> (7 bộ × 8 màu × 2 nhân vật)
                </span>
                <button
                  onClick={handleCopyExpectedList}
                  className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Đã chép!' : 'Chép danh sách'}</span>
                </button>
              </div>

              {/* Table of expected files */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto bg-white">
                <table className="w-full text-[10.5px] text-left border-collapse">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2">Tên File</th>
                      <th className="p-2">Nhân Vật</th>
                      <th className="p-2">Bộ</th>
                      <th className="p-2">Màu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-stone-800">
                    {expectedFiles.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/40">
                        <td className="p-2 font-bold text-amber-900">{item.fileName}</td>
                        <td className="p-2 font-sans">{item.characterName.split(' ')[0]}</td>
                        <td className="p-2 font-sans">{item.costumeName.replace('Áo ', '').replace('Bộ ', '')}</td>
                        <td className="p-2 font-sans">{item.colorName.split(' ')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs cursor-pointer transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

