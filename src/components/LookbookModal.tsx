import React, { useRef, useState } from 'react';
import { OutfitConfig } from './CompareModal';
import { OutfitVisualizer } from './OutfitVisualizer';
import { X, Download, Share2, Trash2, Heart, Check, Sparkles } from 'lucide-react';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: (OutfitConfig & { id: string; savedAt: string; eventName: string })[];
  onDeleteOutfit: (id: string) => void;
  onSelectOutfit: (outfit: OutfitConfig) => void;
  currentOutfit: OutfitConfig;
  currentEventName: string;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  savedOutfits,
  onDeleteOutfit,
  onSelectOutfit,
  currentOutfit,
  currentEventName,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'gallery'>('card');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadCard = async () => {
    setIsExporting(true);
    try {
      // Create high-resolution Canvas (1080 x 1920 Story format)
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsExporting(false);
        return;
      }

      // 1. Draw Paper Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
      bgGrad.addColorStop(0, '#FDFBF7');
      bgGrad.addColorStop(0.5, '#F5EDE0');
      bgGrad.addColorStop(1, '#E9DEC9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Outer Border Frame (Fine artisan line)
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 980, 1820);

      ctx.strokeStyle = '#C0392B';
      ctx.lineWidth = 2;
      ctx.strokeRect(65, 65, 950, 1790);

      // 3. Four Traditional Corner Seals (Chữ Vạn / Kỷ Hà góc)
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = '#991B1B';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();
        ctx.restore();
      };
      drawCorner(75, 75, 0);
      drawCorner(1005, 75, Math.PI / 2);
      drawCorner(1005, 1845, Math.PI);
      drawCorner(75, 1845, -Math.PI / 2);

      // 4. Header Badges & Typography
      ctx.textAlign = 'center';

      // Event Pill
      ctx.fillStyle = '#991B1B';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(`• ${currentEventName.toUpperCase()} •`, 540, 150);

      // Outfit Title
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
      ctx.fillText(currentOutfit.name || currentOutfit.costume.name, 540, 230);

      // Style Subtitle
      const styleLabel =
        currentOutfit.styleMode === 'traditional'
          ? 'Thuần Truyền Thống'
          : currentOutfit.styleMode === 'light_modern'
          ? 'Cách Tân Thanh Lịch'
          : 'Gen Z Urban Streetwear Remix';
      ctx.fillStyle = '#64748B';
      ctx.font = 'italic 34px sans-serif';
      ctx.fillText(`Phong cách: ${styleLabel}`, 540, 280);

      // 5. Draw Outfit Illustration onto Canvas
      // Extract the SVG element from DOM
      const svgEl = cardRef.current?.querySelector('svg.drop-shadow-md');
      if (svgEl) {
        const svgString = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URLObj = window.URL || window.webkitURL || window;
        const blobURL = URLObj.createObjectURL(svgBlob);

        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Draw illustration centered
            ctx.drawImage(img, 190, 320, 700, 930);
            URLObj.revokeObjectURL(blobURL);
            resolve();
          };
          img.src = blobURL;
        });
      }

      // 6. Item Breakdown Card in Canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.roundRect(120, 1300, 840, 360, 30);
      ctx.fill();
      ctx.strokeStyle = '#E2D4B7';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
      ctx.fillText('Chi Tiết Bản Phối Di Sản:', 170, 1370);

      ctx.font = '30px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(`• Áo gốc: ${currentOutfit.costume.name}`, 170, 1430);
      ctx.fillText(`• Sắc nhuộm: ${currentOutfit.color.name} (${currentOutfit.color.meaning})`, 170, 1480);
      ctx.fillText(`• Hạ y: ${currentOutfit.bottom.name}`, 170, 1530);
      ctx.fillText(`• Giày dép: ${currentOutfit.footwear.name}`, 170, 1580);
      if (currentOutfit.accessories.length > 0) {
        ctx.fillText(
          `• Phụ kiện: ${currentOutfit.accessories.map((a) => a.name).join(', ')}`,
          170,
          1630
        );
      }

      // 7. Footer Seal & Guarantee
      ctx.textAlign = 'center';
      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('✨ BẢO CHỨNG TÔN TRỌNG VĂN HÓA • VIỆT PHỤC REMIX ✨', 540, 1740);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '24px sans-serif';
      ctx.fillText('Ứng dụng phối trang phục truyền thống Việt Nam theo phong cách Gen Z', 540, 1785);

      // 8. Trigger PNG Download
      const pngDataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `viet-phuc-remix-${Date.now()}.png`;
      downloadLink.href = pngDataUrl;
      downloadLink.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#FDFBF7] rounded-3xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col">
        {/* Header with Navigation Tabs */}
        <div className="p-4 px-6 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <h3 className="font-serif-title text-lg font-bold">
              Lookbook Việt Phục Cá Nhân
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1 rounded-xl flex gap-1 text-xs">
              <button
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Thẻ OOTD Story
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Bộ Sưu Tập Đã Lưu ({savedOutfits.length})
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Shareable OOTD Lookbook Card */}
        {activeTab === 'card' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex flex-col items-center space-y-4">
            <div
              ref={cardRef}
              className="relative w-full max-w-[340px] rounded-3xl bg-gradient-to-b from-[#F5EFEB] to-[#E9DEC9] p-5 border-2 border-amber-900/20 shadow-xl overflow-hidden flex flex-col items-center text-center space-y-3"
            >
              {/* Corner Traditional Accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-800/40" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-800/40" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-800/40" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-800/40" />

              {/* Card Header Branding */}
              <div className="pt-1">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-red-900 bg-red-100/80 px-2.5 py-0.5 rounded-full border border-red-200">
                  {currentEventName}
                </span>
                <h4 className="font-serif-title text-xl font-black text-stone-900 mt-1">
                  {currentOutfit.name || currentOutfit.costume.name}
                </h4>
                <p className="text-[11px] text-stone-600 italic">
                  Phong cách: {currentOutfit.styleMode === 'traditional' ? 'Thuần truyền thống' : currentOutfit.styleMode === 'light_modern' ? 'Cách tân thanh lịch' : 'Gen Z Urban Remix'}
                </p>
              </div>

              {/* Mannequin / Outfit Visualizer */}
              <div className="w-full">
                <OutfitVisualizer
                  costume={currentOutfit.costume}
                  color={currentOutfit.color}
                  bottom={currentOutfit.bottom}
                  footwear={currentOutfit.footwear}
                  accessories={currentOutfit.accessories}
                  styleMode={currentOutfit.styleMode}
                />
              </div>

              {/* Items Deconstruction */}
              <div className="w-full p-2.5 rounded-xl bg-white/70 backdrop-blur border border-amber-900/10 text-[11px] text-stone-700 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-stone-500">Màu chủ đạo:</span>
                  <span className="font-semibold text-stone-900">{currentOutfit.color.name}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-stone-500">Hạ y:</span>
                  <span className="text-stone-900">{currentOutfit.bottom.name}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-stone-500">Giày:</span>
                  <span className="text-stone-900">{currentOutfit.footwear.name}</span>
                </div>
                {currentOutfit.accessories.length > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-500">Phụ kiện:</span>
                    <span className="text-stone-900 truncate max-w-[150px]">
                      {currentOutfit.accessories.map(a => a.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Verification Stamp */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                <span>Bảo chứng tôn trọng văn hóa • Việt Phục Remix</span>
              </div>
            </div>

            {/* Actions for Lookbook Card */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Đã sao chép link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-stone-600" />
                    <span>Chia sẻ OOTD</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadCard}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-semibold shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-white" />
                <span>{isExporting ? 'Đang chuẩn bị...' : 'Lưu Thẻ Lookbook'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Outfits Gallery */}
        {activeTab === 'gallery' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
            {savedOutfits.length === 0 ? (
              <div className="text-center py-12 text-stone-500 space-y-2">
                <Heart className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-sm font-medium">Chưa có bộ phối nào được lưu.</p>
                <p className="text-xs text-stone-400">
                  Hãy nhấn nút "Lưu vào Lookbook" ở màn hình chính để lưu lại các set đồ yêu thích của bạn!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedOutfits.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-amber-700/40 transition flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded-md">
                          {item.eventName}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm mt-1">
                          {item.name || item.costume.name}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          {item.color.name} • {item.bottom.name}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteOutfit(item.id)}
                        className="p-1 rounded-md text-stone-400 hover:text-red-600 transition cursor-pointer"
                        title="Xóa bộ này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400">
                        {item.savedAt}
                      </span>
                      <button
                        onClick={() => {
                          onSelectOutfit(item);
                          onClose();
                        }}
                        className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-medium transition cursor-pointer"
                      >
                        Mặc Thử Lại
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
