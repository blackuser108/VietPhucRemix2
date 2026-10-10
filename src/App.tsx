import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  TRADITIONAL_COSTUMES,
  EVENTS,
  COLOR_OPTIONS,
  BOTTOMS,
  FOOTWEAR,
  ACCESSORIES,
  CostumeItem,
  EventOption,
  ColorOption,
  ClothingPiece,
  checkCulturalRules,
  evaluateColorHarmony,
} from './data/costumesData';
import { OutfitVisualizer } from './components/OutfitVisualizer';
import { WardrobeItemCard } from './components/WardrobeItemCard';
import { CulturalBottomSheet } from './components/CulturalBottomSheet';
import { LookbookModal } from './components/LookbookModal';
import { IntroHeroModal } from './components/IntroHeroModal';
import { BatchCollectionModal } from './components/BatchCollectionModal';
import { ImportOutfitModal } from './components/ImportOutfitModal';
import { OutfitConfig } from './components/CompareModal';
import { AvatarGender } from './components/LayeredAvatarEngine';
import { OutfitFormula, getOutfitKey, checkGenderCompatibility } from './utils/outfitFormula';
import { generateOutfitImage } from './utils/outfitImageService';
import { getOutfitCache, getThumbnailsForCostumes } from './utils/outfitStorage';
import anNhienBaseImg from './assets/images/an_nhien_base.jpg';
import minhTrietBaseImg from './assets/images/minh_triet_base.jpg';
import {
  Shirt,
  Sparkles,
  Footprints,
  Palette,
  Search,
  Filter,
  Info,
  Heart,
  ArrowRightLeft,
  RefreshCw,
  HelpCircle,
  MoreVertical,
  Upload,
  PlayCircle,
  AlertCircle,
} from 'lucide-react';

// Custom SVG Avatars for Character Gender Selection
const FemaleAvatarIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 drop-shadow-2xs" fill="none">
    <circle cx="12" cy="12" r="11" fill={active ? '#BE123C' : '#F5EBE1'} stroke={active ? '#FFFFFF' : '#E2D3C1'} strokeWidth="1" />
    <rect x="11" y="15.5" width="2" height="3" fill="#F8D7BE" />
    <path d="M9 18 Q 12 19.5 15 18 L16 23 L8 23 Z" fill="#DC2626" />
    <path d="M8.5 11 C8.5 7.5, 15.5 7.5, 15.5 11 C15.5 14.5, 13.8 16.8, 12 16.8 C10.2 16.8, 8.5 14.5, 8.5 11 Z" fill="#FDEFE4" />
    <circle cx="9.8" cy="12.5" r="1.1" fill="#F43F5E" opacity="0.3" />
    <circle cx="14.2" cy="12.5" r="1.1" fill="#F43F5E" opacity="0.3" />
    <ellipse cx="10.5" cy="11.5" rx="0.9" ry="1.1" fill="#2E1C14" />
    <circle cx="10.2" cy="11.1" r="0.35" fill="#FFFFFF" />
    <ellipse cx="13.5" cy="11.5" rx="0.9" ry="1.1" fill="#2E1C14" />
    <circle cx="13.2" cy="11.1" r="0.35" fill="#FFFFFF" />
    <path d="M11.3 13.8 Q 12 14.4 12.7 13.8" stroke="#BE123C" strokeWidth="0.6" fill="none" strokeLinecap="round" />
    <path d="M8 10.5 C8 6, 16 6, 16 10.5 C15 8, 9 8, 8 10.5 Z" fill="#241411" />
    <path d="M8 10.5 Q 9.5 13 9.5 15.5" stroke="#241411" strokeWidth="1.2" fill="none" />
    <path d="M16 10.5 Q 14.5 13 14.5 15.5" stroke="#241411" strokeWidth="1.2" fill="none" />
  </svg>
);

const MaleAvatarIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 drop-shadow-2xs" fill="none">
    <circle cx="12" cy="12" r="11" fill={active ? '#78350F' : '#EAE3D5'} stroke={active ? '#FFFFFF' : '#D0C3B0'} strokeWidth="1" />
    <rect x="10.8" y="15.5" width="2.4" height="3" fill="#F8D7BE" />
    <path d="M8.5 18 Q 12 19.5 15.5 18 L16.5 23 L7.5 23 Z" fill="#1E293B" />
    <path d="M8.5 11 C8.5 7, 15.5 7, 15.5 11 C15.5 15, 13.8 17, 12 17 C10.2 17, 8.5 15, 8.5 11 Z" fill="#FDEFE4" />
    <ellipse cx="10.5" cy="11.5" rx="0.9" ry="1.1" fill="#1C1917" />
    <circle cx="10.2" cy="11.1" r="0.35" fill="#FFFFFF" />
    <ellipse cx="13.5" cy="11.5" rx="0.9" ry="1.1" fill="#1C1917" />
    <circle cx="13.2" cy="11.1" r="0.35" fill="#FFFFFF" />
    <path d="M11.4 14 Q 12 14.6 12.6 14" stroke="#9A3412" strokeWidth="0.6" fill="none" strokeLinecap="round" />
    <path d="M8 10.5 C8 6, 16 6, 16 10.5 C14.5 7.5, 9.5 7.5, 8 10.5 Z" fill="#1C1917" />
    <path d="M8.5 9.5 L10 11 L11 9.5 L12.5 11.5 L14 9.5 L15.5 10.5" stroke="#292524" strokeWidth="1" fill="#1C1917" />
  </svg>
);

// 4 DANH MỤC TINH GỌN THEO YÊU CẦU: Bộ trang phục, Phụ kiện, Giày, Màu
type WardrobeCategory = 'outfits' | 'accessories' | 'shoes' | 'colors';

export default function App() {
  // Wardrobe active category (4 tabs)
  const [activeCategory, setActiveCategory] = useState<WardrobeCategory>('outfits');

  // Avatar Character Gender state ('female': An Nhiên | 'male': Minh Triết)
  const [avatarGender, setAvatarGender] = useState<AvatarGender>('female');

  // Active outfit state
  const [selectedCostume, setSelectedCostume] = useState<CostumeItem>(TRADITIONAL_COSTUMES[0]);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]);
  const [selectedBottom, setSelectedBottom] = useState<ClothingPiece>(BOTTOMS[0]);
  const [selectedFootwear, setSelectedFootwear] = useState<ClothingPiece>(FOOTWEAR[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<ClothingPiece[]>([]);
  const [styleMode, setStyleMode] = useState<'traditional' | 'light_modern' | 'genz_streetwear'>('light_modern');

  // Dynamic Image Generation & Cache state
  const [currentOutfitImage, setCurrentOutfitImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('Đang may đồ...');
  const [isFailed, setIsFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCached, setIsCached] = useState(false);
  const [imageSourceText, setImageSourceText] = useState('an_nhien_base.jpg');
  const [thumbnailsMap, setThumbnailsMap] = useState<Record<string, string>>({});
  const [makingCostumeId, setMakingCostumeId] = useState<string | null>(null);

  // Fallback Notice State (khi môi trường chưa có key hoặc lỗi mô hình)
  const [showAiNotice, setShowAiNotice] = useState(false);
  const [aiNoticeMessage, setAiNoticeMessage] = useState('');

  // Camera zoom state: 'full' | 'upper' | 'lower'
  const [cameraZoom, setCameraZoom] = useState<'full' | 'upper' | 'lower'>('full');

  // Split-screen comparison mode
  const [isSplitScreen, setIsSplitScreen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<EventOption | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vietphuc_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Saved Lookbook state
  const [savedOutfits, setSavedOutfits] = useState<(OutfitConfig & { id: string; savedAt: string; eventName: string; savedImageUrl?: string })[]>(() => {
    try {
      const stored = localStorage.getItem('vietphuc_remix_lookbook');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Ephemeral item name tag near character
  const [ephemeralLabel, setEphemeralLabel] = useState<string>(TRADITIONAL_COSTUMES[0].name);
  const [isLabelVisible, setIsLabelVisible] = useState(true);
  const labelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modals & Bottom Sheets
  const [bottomSheetType, setBottomSheetType] = useState<'info' | 'violation' | null>(null);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [hasSavedCurrent, setHasSavedCurrent] = useState(false);
  const [showHarmonyPopover, setShowHarmonyPopover] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // References for debounce & aborting previous calls
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save lookbook to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vietphuc_remix_lookbook', JSON.stringify(savedOutfits));
    } catch (e) {
      console.error(e);
    }
  }, [savedOutfits]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vietphuc_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteIds]);

  // Công thức hiện tại
  const currentFormula: OutfitFormula = useMemo(
    () => ({
      gender: avatarGender,
      costumeId: selectedCostume.id,
      colorId: selectedColor.id,
      accessoryIds: selectedAccessories.map((a) => a.id),
      footwearId: selectedFootwear.id,
    }),
    [avatarGender, selectedCostume.id, selectedColor.id, selectedAccessories, selectedFootwear.id]
  );

  const currentOutfitKey = useMemo(() => getOutfitKey(currentFormula), [currentFormula]);

  // Tải thumbnails từ IndexedDB cho lưới chọn đồ
  const refreshThumbnails = useCallback(async () => {
    const map = await getThumbnailsForCostumes(avatarGender, selectedColor.id);
    setThumbnailsMap(map);
  }, [avatarGender, selectedColor.id]);

  useEffect(() => {
    refreshThumbnails();
  }, [refreshThumbnails]);

  // Helper hiển thị nhãn nổi gần nhân vật
  const triggerEphemeralLabel = (label: string) => {
    setEphemeralLabel(label);
    setIsLabelVisible(true);
    setHasSavedCurrent(false);
    if (labelTimeoutRef.current) {
      clearTimeout(labelTimeoutRef.current);
    }
    labelTimeoutRef.current = setTimeout(() => {
      setIsLabelVisible(false);
    }, 3800);
  };

  // QUY TRÌNH QUẢN LÝ ẢNH MẶC ĐỒ: KIỂM TRA CACHE + DEBOUNCE 600MS + TẠO ẢNH BẰNG GEMINI
  useEffect(() => {
    // 1. Hủy bất kỳ yêu cầu cũ nào đang chờ hoặc đang chạy
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    let isEffectActive = true;

    // 2. Kiểm tra cache IndexedDB tức thời
    getOutfitCache(currentOutfitKey).then((cachedUrl) => {
      if (!isEffectActive) return;

      if (cachedUrl) {
        // Có sẵn trong cache -> MẶC NGAY LẬP TỨC
        setCurrentOutfitImage(cachedUrl);
        setIsCached(true);
        setIsGenerating(false);
        setMakingCostumeId(null);
        setIsFailed(false);
        setImageSourceText(avatarGender === 'female' ? 'Cache (An Nhiên)' : 'Cache (Minh Triết)');
        return;
      }

      // Chưa có trong cache -> Chuẩn bị tạo ảnh mới
      // Đặt trạng thái chưa có cache
      setIsCached(false);
      setIsFailed(false);

      // 3. Debounce 600ms sau thao tác cuối cùng mới gọi tạo ảnh
      debounceTimerRef.current = setTimeout(async () => {
        if (!isEffectActive) return;

        const baseImageSrc = avatarGender === 'female' ? anNhienBaseImg : minhTrietBaseImg;
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsGenerating(true);
        setMakingCostumeId(currentFormula.costumeId);
        setGenerationStatus('Đang may trang phục...');

        try {
          const res = await generateOutfitImage(currentFormula, baseImageSrc, {
            signal: controller.signal,
            onStatusChange: (status) => {
              if (isEffectActive) setGenerationStatus(status);
            },
          });

          if (!isEffectActive) return;
          setIsGenerating(false);
          setMakingCostumeId(null);

          if (res.success && res.dataUrl) {
            setCurrentOutfitImage(res.dataUrl);
            setIsCached(res.source === 'cache');
            setIsFailed(false);
            setImageSourceText(res.source === 'cache' ? 'Cache' : 'AI Gen (Gemini)');
            refreshThumbnails();
          } else {
            setIsFailed(true);
            setErrorMessage(res.error || 'Chưa may được bộ này');
            setImageSourceText('Thất bại');

            // Nếu không gọi được API mô hình (do thiếu key hoặc quota), hiện thông báo dự phòng
            if (res.error && (res.error.includes('chưa được cấu hình') || res.error.includes('quota') || res.error.includes('yêu cầu'))) {
              setAiNoticeMessage(res.error);
              setShowAiNotice(true);
            }
          }
        } catch (err: unknown) {
          if (!isEffectActive) return;
          setIsGenerating(false);
          setMakingCostumeId(null);
          setIsFailed(true);
          setErrorMessage((err as Error).message);
          setImageSourceText('Lỗi kết nối');
        }
      }, 600);
    });

    return () => {
      isEffectActive = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentOutfitKey, currentFormula, avatarGender, refreshThumbnails]);

  // Thử lại khi thất bại
  const handleRetryGenerate = () => {
    setIsFailed(false);
    setIsGenerating(true);
    setMakingCostumeId(currentFormula.costumeId);
    setGenerationStatus('Đang may lại đồ...');

    const baseImageSrc = avatarGender === 'female' ? anNhienBaseImg : minhTrietBaseImg;
    generateOutfitImage(currentFormula, baseImageSrc, {
      onStatusChange: (status) => setGenerationStatus(status),
    }).then((res) => {
      setIsGenerating(false);
      setMakingCostumeId(null);
      if (res.success && res.dataUrl) {
        setCurrentOutfitImage(res.dataUrl);
        setIsCached(res.source === 'cache');
        setIsFailed(false);
        setImageSourceText(res.source === 'cache' ? 'Cache' : 'AI Gen (Gemini)');
        refreshThumbnails();
      } else {
        setIsFailed(true);
        setErrorMessage(res.error || 'Chưa may được bộ này');
        if (res.error && (res.error.includes('chưa được cấu hình') || res.error.includes('quota'))) {
          setAiNoticeMessage(res.error);
          setShowAiNotice(true);
        }
      }
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteIds.includes(id)) {
      setFavoriteIds(favoriteIds.filter((item) => item !== id));
    } else {
      setFavoriteIds([...favoriteIds, id]);
    }
  };

  // Cultural violations and color harmony
  const violations = checkCulturalRules(
    selectedCostume,
    selectedBottom,
    selectedFootwear,
    selectedAccessories,
    selectedEventFilter?.id
  );
  const harmony = evaluateColorHarmony(selectedColor, selectedBottom, selectedCostume);

  const topViolation =
    violations.find((v) => v.level === 'warning') ||
    violations.find((v) => v.level === 'caution') ||
    violations[0];

  // Auto-apply cultural recommendation
  const handleApplyRecommendation = () => {
    if (selectedCostume.formality_level === 'royal' && selectedBottom.id === 'quan_jeans_denim') {
      setSelectedBottom(BOTTOMS[0]);
    }
    if (selectedCostume.id === 'ao_tac' && selectedFootwear.id === 'sneaker_trang') {
      setSelectedFootwear(FOOTWEAR[3]);
    }
    if (selectedCostume.id === 'ao_ba_ba' && selectedAccessories.some((a) => a.id === 'non_quai_thao')) {
      setSelectedAccessories([
        ...selectedAccessories.filter((a) => a.id !== 'non_quai_thao'),
        ACCESSORIES.find((a) => a.id === 'non_la_chop')!,
      ]);
    }
    if (selectedCostume.id === 'ao_tu_than' && selectedBottom.id === 'quan_au_suong') {
      setSelectedBottom(BOTTOMS.find((b) => b.id === 'vay_dup_den') || BOTTOMS[0]);
    }
    triggerEphemeralLabel('Đã căn chỉnh trang phục chuẩn mực');
  };

  // Reset to authentic original
  const handleResetOutfit = () => {
    setSelectedColor(COLOR_OPTIONS.find((c) => c.hex === selectedCostume.defaultColor) || COLOR_OPTIONS[0]);
    setSelectedBottom(BOTTOMS.find((b) => b.id === selectedCostume.defaultBottomId) || BOTTOMS[0]);
    setSelectedFootwear(FOOTWEAR.find((f) => f.id === selectedCostume.defaultFootwearId) || FOOTWEAR[0]);
    setSelectedAccessories(
      ACCESSORIES.filter((a) => selectedCostume.defaultAccessoryIds.includes(a.id))
    );
    setStyleMode('traditional');
    setCameraZoom('full');
    triggerEphemeralLabel(`Chuẩn gốc: ${selectedCostume.name}`);
  };

  // Save to Lookbook
  const handleSaveToLookbook = () => {
    if (hasSavedCurrent) {
      setIsLookbookOpen(true);
      return;
    }
    const newEntry = {
      id: `outfit-${Date.now()}`,
      costume: selectedCostume,
      color: selectedColor,
      bottom: selectedBottom,
      footwear: selectedFootwear,
      accessories: selectedAccessories,
      styleMode,
      name: `Bộ ${selectedCostume.name}`,
      eventName: selectedEventFilter?.name || 'Dạo phố OOTD',
      savedImageUrl: currentOutfitImage || undefined,
      savedAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };
    setSavedOutfits([newEntry, ...savedOutfits]);
    setHasSavedCurrent(true);
  };

  // Reference outfit for split-screen comparison
  const referenceOutfit: OutfitConfig = {
    costume: selectedCostume,
    color: COLOR_OPTIONS.find((c) => c.hex === selectedCostume.defaultColor) || COLOR_OPTIONS[0],
    bottom: BOTTOMS.find((b) => b.id === selectedCostume.defaultBottomId) || BOTTOMS[0],
    footwear: FOOTWEAR.find((f) => f.id === selectedCostume.defaultFootwearId) || FOOTWEAR[0],
    accessories: ACCESSORIES.filter((a) => selectedCostume.defaultAccessoryIds.includes(a.id)),
    styleMode: 'traditional',
    name: 'Bản Chuẩn Cổ Truyền',
  };

  const currentOutfitConfig: OutfitConfig = {
    costume: selectedCostume,
    color: selectedColor,
    bottom: selectedBottom,
    footwear: selectedFootwear,
    accessories: selectedAccessories,
    styleMode,
    name: `Bộ ${selectedCostume.name}`,
  };

  // Filter items by search query
  const filterList = <T extends { id: string; name: string }>(items: T[]): T[] => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF7F2] text-stone-900 flex flex-col font-sans select-none">
      {/* --- TOP BAR: SEARCH, EVENT FILTER, INTRO & ACTIONS --- */}
      <header className="h-12 border-b border-amber-900/10 bg-[#FAF7F2]/90 backdrop-blur px-3 sm:px-5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Logo Badge */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#C0392B] to-[#78350F] flex items-center justify-center text-white font-serif font-black text-xs shadow-2xs">
              V
            </span>
            <span className="font-serif-title font-bold text-sm tracking-tight hidden sm:inline">
              Việt Phục Remix
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm đồ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-full bg-white/80 border border-stone-200/90 focus:outline-hidden focus:border-amber-700 w-28 sm:w-44 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Center / Right: Filter Button & Extra Tools */}
        <div className="flex items-center gap-2">
          {/* Event Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                selectedEventFilter
                  ? 'bg-amber-900 text-white border-amber-950 shadow-2xs'
                  : 'bg-white/80 text-stone-700 border-stone-200/90 hover:bg-stone-50'
              }`}
            >
              <Filter className="w-3 h-3 text-amber-700" />
              <span>{selectedEventFilter ? selectedEventFilter.name : 'Dịp Lễ'}</span>
            </button>

            {/* Filter Modal Dialog */}
            {isFilterMenuOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
                <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="font-bold text-sm text-stone-900">Lọc Theo Dịp / Sự Kiện</span>
                    <button
                      onClick={() => {
                        setSelectedEventFilter(null);
                        setIsFilterMenuOpen(false);
                      }}
                      className="text-xs text-amber-800 hover:underline cursor-pointer"
                    >
                      Bỏ lọc
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                    {EVENTS.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          setSelectedEventFilter(ev);
                          setIsFilterMenuOpen(false);
                          triggerEphemeralLabel(`Bối cảnh: ${ev.name}`);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                          selectedEventFilter?.id === ev.id
                            ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                            : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{ev.icon}</span>
                          <span>{ev.name}</span>
                        </span>
                        <span className="text-[10px] text-stone-400">{ev.tag}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setIsFilterMenuOpen(false)}
                      className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Intro Idea Trigger */}
          <button
            onClick={() => setIsIntroOpen(true)}
            className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition cursor-pointer"
            title="Ý tưởng & Thể lệ đề bài"
          >
            <HelpCircle className="w-4 h-4 text-amber-800" />
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetOutfit}
            className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition cursor-pointer"
            title="Đặt lại bản thuần gốc"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --- CẢNH BÁO MÔ HÌNH NẾU KHÔNG GỌI ĐƯỢC MÔ HÌNH TẠO ẢNH --- */}
      {showAiNotice && (
        <div className="bg-amber-100/90 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-xs text-amber-950 animate-in slide-in-from-top-1 z-30">
          <div className="flex items-center gap-2 truncate">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="truncate">
              <strong>Lưu ý:</strong> {aiNoticeMessage || 'Môi trường chưa có GEMINI_API_KEY để gọi mô hình tạo ảnh trực tiếp.'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-2.5 py-0.5 rounded-full bg-amber-800 text-white font-semibold text-[11px] hover:bg-amber-900 transition cursor-pointer"
            >
              Nhập ảnh trang phục
            </button>
            <button
              onClick={() => setShowAiNotice(false)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN WARDROBE INTERFACE --- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* === 1. LEFT VERTICAL CATEGORY RAIL (4 DANH MỤC TINH GỌN) === */}
        <aside className="w-full md:w-16 h-12 md:h-full border-b md:border-b-0 md:border-r border-amber-900/10 bg-[#FAF7F2] flex flex-row md:flex-col items-center justify-around md:justify-start md:py-4 gap-1 md:gap-3 shrink-0 z-20">
          {[
            { id: 'outfits', label: 'Bộ trang phục', icon: <Shirt className="w-5 h-5" />, count: TRADITIONAL_COSTUMES.length },
            { id: 'accessories', label: 'Phụ kiện', icon: <Sparkles className="w-5 h-5" />, count: ACCESSORIES.length },
            { id: 'shoes', label: 'Giày', icon: <Footprints className="w-5 h-5" />, count: FOOTWEAR.length },
            { id: 'colors', label: 'Màu', icon: <Palette className="w-5 h-5" />, count: COLOR_OPTIONS.length },
          ].map((cat) => {
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as WardrobeCategory);
                  if (cat.id === 'shoes') {
                    setCameraZoom('lower');
                  } else {
                    setCameraZoom('full');
                  }
                }}
                title={cat.label}
                className={`relative p-2 md:p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-amber-900 text-white shadow-md ring-2 ring-amber-600/40 scale-105'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {cat.icon}
                {/* Count badge */}
                <span
                  className={`text-[9px] font-bold mt-0.5 px-1 rounded-full ${
                    isCatActive ? 'bg-amber-700 text-amber-100' : 'text-stone-400'
                  }`}
                >
                  {cat.count}
                </span>
                {/* Active glow indicator */}
                {isCatActive && (
                  <span className="hidden md:block absolute -right-1 w-1 h-5 rounded-l-full bg-amber-600" />
                )}
              </button>
            );
          })}
        </aside>

        {/* === 2. ITEM GRID (LƯỚI CHỌN ĐỒ ĐỒNG BỘ ẢNH) === */}
        <section className="w-full md:w-72 lg:w-80 h-36 md:h-full border-b md:border-b-0 md:border-r border-amber-900/10 bg-[#F5EFEB]/50 backdrop-blur overflow-y-auto p-2.5 shrink-0 z-10">
          <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
            {/* TAB 1: BỘ TRANG PHỤC (7 BỘ HOÀN CHỈNH) */}
            {activeCategory === 'outfits' &&
              filterList(TRADITIONAL_COSTUMES).map((item) => {
                const isSelected = selectedCostume.id === item.id;
                const isFavorite = favoriteIds.includes(item.id);
                const compat = checkGenderCompatibility(avatarGender, item.id);
                const thumb = thumbnailsMap[item.id] || null;

                // 3 Trạng thái nhìn thấy được: chưa may, đang may, sẵn sàng
                let outfitState: 'not_made' | 'making' | 'ready' = 'not_made';
                if (makingCostumeId === item.id) {
                  outfitState = 'making';
                } else if (thumb) {
                  outfitState = 'ready';
                }

                return (
                  <WardrobeItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    category="outfits"
                    isSelected={isSelected}
                    isFavorite={isFavorite}
                    colorHex={selectedColor.hex}
                    thumbnailUrl={thumb}
                    outfitState={outfitState}
                    isGenderCompatible={compat.isCompatible}
                    genderNote={compat.note}
                    periodOrDetail={item.period_region.split('/')[0].trim()}
                    onClick={() => {
                      setSelectedCostume(item);
                      // Tự động gán hạ y mặc định phù hợp văn hóa của bộ này
                      const defBottom = BOTTOMS.find((b) => b.id === item.defaultBottomId) || BOTTOMS[0];
                      setSelectedBottom(defBottom);
                      triggerEphemeralLabel(item.name);
                    }}
                    onToggleFavorite={(e) => handleToggleFavorite(item.id, e)}
                  />
                );
              })}

            {/* TAB 2: PHỤ KIỆN (MŨ, KHĂN, TRANG SỨC, QUẠT, TÚI) */}
            {activeCategory === 'accessories' &&
              filterList(ACCESSORIES).map((item) => {
                const isSelected = selectedAccessories.some((a) => a.id === item.id);
                const isFavorite = favoriteIds.includes(item.id);
                return (
                  <WardrobeItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    category="accessories"
                    isSelected={isSelected}
                    isFavorite={isFavorite}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAccessories(selectedAccessories.filter((a) => a.id !== item.id));
                        triggerEphemeralLabel(`Bỏ chọn: ${item.name}`);
                      } else {
                        setSelectedAccessories([...selectedAccessories, item]);
                        triggerEphemeralLabel(`Thêm: ${item.name}`);
                      }
                    }}
                    onToggleFavorite={(e) => handleToggleFavorite(item.id, e)}
                  />
                );
              })}

            {/* TAB 3: GIÀY DÉP */}
            {activeCategory === 'shoes' &&
              filterList(FOOTWEAR).map((item) => {
                const isSelected = selectedFootwear.id === item.id;
                const isFavorite = favoriteIds.includes(item.id);
                return (
                  <WardrobeItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    category="shoes"
                    isSelected={isSelected}
                    isFavorite={isFavorite}
                    onClick={() => {
                      setSelectedFootwear(item);
                      triggerEphemeralLabel(item.name);
                      setCameraZoom('lower');
                    }}
                    onToggleFavorite={(e) => handleToggleFavorite(item.id, e)}
                  />
                );
              })}

            {/* TAB 4: MÀU SẮC NGŨ HÀNH */}
            {activeCategory === 'colors' &&
              COLOR_OPTIONS.map((c) => {
                const isSelected = selectedColor.id === c.id;
                const isFavorite = favoriteIds.includes(c.id);
                return (
                  <WardrobeItemCard
                    key={c.id}
                    id={c.id}
                    name={c.name}
                    category="colors"
                    isSelected={isSelected}
                    isFavorite={isFavorite}
                    colorHex={c.hex}
                    elementSymbol={c.element}
                    onClick={() => {
                      setSelectedColor(c);
                      triggerEphemeralLabel(`Màu: ${c.name}`);
                    }}
                    onToggleFavorite={(e) => handleToggleFavorite(c.id, e)}
                  />
                );
              })}
          </div>
        </section>

        {/* === 3. CHARACTER STAGE (SÂN KHẤU NHÂN VẬT) === */}
        <main className="flex-1 h-full relative overflow-hidden flex items-center justify-center p-3">
          {/* Top Stage Controls: Switcher & 3-Dots Menu */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
            {/* Gender Switcher */}
            <div className="flex items-center bg-white/90 backdrop-blur rounded-full border border-stone-200/90 p-0.5 shadow-xs text-xs">
              <button
                onClick={() => {
                  setAvatarGender('female');
                  triggerEphemeralLabel('Nhân vật: An Nhiên (Nữ)');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                  avatarGender === 'female'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FemaleAvatarIcon active={avatarGender === 'female'} />
                <span className="hidden sm:inline">An Nhiên (Nữ)</span>
                <span className="sm:hidden text-[11px]">Nữ</span>
              </button>
              <button
                onClick={() => {
                  setAvatarGender('male');
                  triggerEphemeralLabel('Nhân vật: Minh Triết (Nam)');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                  avatarGender === 'male'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MaleAvatarIcon active={avatarGender === 'male'} />
                <span className="hidden sm:inline">Minh Triết (Nam)</span>
                <span className="sm:hidden text-[11px]">Nam</span>
              </button>
            </div>

            {/* Right: Camera Zoom & 3-Dots Menu */}
            <div className="flex items-center gap-1.5">
              {/* Camera Zoom Pills */}
              <div className="flex items-center bg-white/90 backdrop-blur rounded-full border border-stone-200/90 p-0.5 text-stone-600 text-[11px] shadow-2xs">
                <button
                  onClick={() => setCameraZoom('full')}
                  className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                    cameraZoom === 'full' ? 'bg-amber-900 text-white font-bold' : 'hover:text-stone-900'
                  }`}
                >
                  Toàn thân
                </button>
                <button
                  onClick={() => setCameraZoom('upper')}
                  className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                    cameraZoom === 'upper' ? 'bg-amber-900 text-white font-bold' : 'hover:text-stone-900'
                  }`}
                >
                  Cận cảnh
                </button>
              </div>

              {/* 3-Dots Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  title="Tùy chọn khác"
                  className={`p-1.5 rounded-full border transition cursor-pointer shadow-2xs ${
                    isMoreMenuOpen
                      ? 'bg-amber-900 text-white border-amber-950'
                      : 'bg-white/90 hover:bg-white text-stone-700 border-stone-200/90'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* 3-Dots Dropdown Menu */}
                {isMoreMenuOpen && (
                  <div className="absolute right-0 top-9 w-56 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-40 space-y-1 animate-in fade-in">
                    {/* Nút 1: TẠO SẴN BỘ SƯU TẬP (YÊU CẦU 5) */}
                    <button
                      onClick={() => {
                        setIsBatchModalOpen(true);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 flex items-center gap-2 transition cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4 text-amber-800" />
                      <span>Tạo sẵn bộ sưu tập</span>
                    </button>

                    {/* Nút 2: NHẬP ẢNH TRANG PHỤC (YÊU CẦU 7) */}
                    <button
                      onClick={() => {
                        setIsImportModalOpen(true);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-stone-600" />
                      <span>Nhập ảnh trang phục</span>
                    </button>

                    <div className="h-px bg-stone-100 my-1" />

                    {/* So sánh 2 phương án */}
                    <button
                      onClick={() => {
                        setIsSplitScreen(!isSplitScreen);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                        isSplitScreen ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-800" />
                        <span>So sánh 2 phương án</span>
                      </div>
                      <span className="text-[10px] text-stone-400">{isSplitScreen ? 'Bật' : 'Tắt'}</span>
                    </button>

                    {/* Đặt lại chuẩn gốc */}
                    <button
                      onClick={() => {
                        handleResetOutfit();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-stone-50 text-stone-700 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                      <span>Đặt lại bản thuần gốc</span>
                    </button>

                    {/* Hướng dẫn & Thể lệ */}
                    <button
                      onClick={() => {
                        setIsIntroOpen(true);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-stone-50 text-stone-700 transition cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                      <span>Ý tưởng & Thể lệ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Color Harmony Circular Badge */}
          <div className="absolute top-16 right-3 sm:right-6 z-20 pointer-events-auto">
            <button
              onClick={() => setShowHarmonyPopover(!showHarmonyPopover)}
              className="w-11 h-11 rounded-full bg-white/95 backdrop-blur border-2 border-stone-200/90 shadow-md hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center cursor-pointer group"
              title={`${harmony.score}đ - ${harmony.verdict}`}
            >
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                <span className="text-[11px] font-black leading-none text-stone-900 group-hover:text-amber-900">
                  {harmony.score}đ
                </span>
              </div>
              <span className="text-[7.5px] font-bold text-emerald-700 leading-none mt-0.5 uppercase tracking-tighter">
                Hài hòa
              </span>
            </button>

            {/* Harmony Popover Details */}
            {showHarmonyPopover && (
              <div className="absolute right-0 top-12 w-60 p-3 bg-white rounded-2xl border border-stone-200 shadow-xl z-40 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-stone-800">
                  <span>{harmony.verdict} ({harmony.score}đ)</span>
                  <button
                    onClick={() => setShowHarmonyPopover(false)}
                    className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  {harmony.explanation}
                </p>
                {harmony.traditionalPrecedent && (
                  <p className="text-[10px] text-amber-900 italic pt-1 border-t border-stone-100">
                    {harmony.traditionalPrecedent}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sân Khấu Hiển Thị Nhân Vật (Single or Split Screen) */}
          <div className="w-full h-full flex items-center justify-center">
            {isSplitScreen ? (
              // Split-Screen Mode
              <div className="w-full h-full grid grid-cols-2 gap-3 items-center justify-center animate-in fade-in duration-300">
                <div className="flex flex-col items-center justify-center h-full relative">
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold z-20">
                    Bản Đang Phối
                  </span>
                  <OutfitVisualizer
                    gender={avatarGender}
                    costume={selectedCostume}
                    color={selectedColor}
                    bottom={selectedBottom}
                    footwear={selectedFootwear}
                    accessories={selectedAccessories}
                    styleMode={styleMode}
                    cameraZoom="full"
                    compactStage={true}
                    currentOutfitImage={currentOutfitImage}
                    isGenerating={isGenerating}
                    generationStatus={generationStatus}
                    isFailed={isFailed}
                    errorMessage={errorMessage}
                    isCached={isCached}
                    outfitKey={currentOutfitKey}
                    imageSourceText={imageSourceText}
                    onRetry={handleRetryGenerate}
                  />
                </div>

                <div className="flex flex-col items-center justify-center h-full relative">
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold z-20">
                    Chuẩn Cổ Truyền
                  </span>
                  <OutfitVisualizer
                    gender={avatarGender}
                    costume={referenceOutfit.costume}
                    color={referenceOutfit.color}
                    bottom={referenceOutfit.bottom}
                    footwear={referenceOutfit.footwear}
                    accessories={referenceOutfit.accessories}
                    styleMode="traditional"
                    cameraZoom="full"
                    compactStage={true}
                  />
                </div>
              </div>
            ) : (
              // Normal Single Stage Character
              <div className="relative w-full h-full flex items-center justify-center">
                <OutfitVisualizer
                  gender={avatarGender}
                  costume={selectedCostume}
                  color={selectedColor}
                  bottom={selectedBottom}
                  footwear={selectedFootwear}
                  accessories={selectedAccessories}
                  styleMode={styleMode}
                  cameraZoom={cameraZoom}
                  currentOutfitImage={currentOutfitImage}
                  isGenerating={isGenerating}
                  generationStatus={generationStatus}
                  isFailed={isFailed}
                  errorMessage={errorMessage}
                  isCached={isCached}
                  outfitKey={currentOutfitKey}
                  imageSourceText={imageSourceText}
                  onRetry={handleRetryGenerate}
                />

                {/* Floating Ephemeral Label beside character */}
                {isLabelVisible && (
                  <div className="absolute top-1/4 left-4 sm:left-12 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 text-white backdrop-blur shadow-lg border border-white/20 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-xs font-semibold">{ephemeralLabel}</span>
                    <button
                      onClick={() => setBottomSheetType('info')}
                      title="Nguồn gốc & Ý nghĩa"
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-amber-300 transition cursor-pointer"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Cultural Warning Chip */}
                {violations.length > 0 && topViolation && (
                  <button
                    onClick={() => setBottomSheetType('violation')}
                    className={`absolute bottom-20 left-4 sm:left-12 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border backdrop-blur transition-all active:scale-95 cursor-pointer animate-in fade-in slide-in-from-left-2 duration-300 ${
                      topViolation.level === 'warning'
                        ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                        : topViolation.level === 'caution'
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-emerald-600 text-white border-emerald-700'
                    }`}
                  >
                    <span>
                      {topViolation.level === 'warning'
                        ? '🛑 Dễ gây hiểu lầm'
                        : topViolation.level === 'caution'
                        ? '⚠️ Nên cân nhắc'
                        : '💡 Gợi ý nhẹ'}
                    </span>
                    <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full">
                      Xem
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. PRIMARY ACTION BUTTON: Heart Save to Lookbook */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
            <button
              onClick={handleSaveToLookbook}
              title={hasSavedCurrent ? `Đã lưu • Mở Lookbook (${savedOutfits.length})` : 'Lưu vào Lookbook'}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 active:scale-90 cursor-pointer ${
                hasSavedCurrent
                  ? 'bg-rose-600 text-white hover:bg-rose-700 ring-4 ring-rose-200'
                  : 'bg-[#C0392B] text-white hover:bg-[#A93226] ring-4 ring-red-400/30'
              }`}
            >
              <Heart className={`w-5 h-5 transition-transform ${hasSavedCurrent ? 'fill-white scale-110' : 'fill-white/20'}`} />
              {savedOutfits.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {savedOutfits.length}
                </span>
              )}
            </button>
          </div>
        </main>
      </div>

      {/* --- CULTURAL BOTTOM SHEET --- */}
      <CulturalBottomSheet
        isOpen={!!bottomSheetType}
        onClose={() => setBottomSheetType(null)}
        type={bottomSheetType || 'info'}
        costume={selectedCostume}
        violation={topViolation}
        onApplyFix={handleApplyRecommendation}
      />

      {/* --- LOOKBOOK MODAL --- */}
      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        savedOutfits={savedOutfits}
        onDeleteOutfit={(id) => setSavedOutfits(savedOutfits.filter((o) => o.id !== id))}
        onSelectOutfit={(chosen) => {
          setSelectedCostume(chosen.costume);
          setSelectedColor(chosen.color);
          setSelectedBottom(chosen.bottom);
          setSelectedFootwear(chosen.footwear);
          setSelectedAccessories(chosen.accessories);
          setStyleMode(chosen.styleMode);
          triggerEphemeralLabel(chosen.name || chosen.costume.name);
        }}
        currentOutfit={currentOutfitConfig}
        currentEventName={selectedEventFilter?.name || 'Dạo Phố OOTD'}
      />

      {/* --- INTRO MODAL --- */}
      <IntroHeroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
      />

      {/* --- BATCH COLLECTION MODAL (YÊU CẦU 5) --- */}
      <BatchCollectionModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        avatarGender={avatarGender}
        onCollectionCompleted={refreshThumbnails}
      />

      {/* --- IMPORT OUTFIT MODAL (YÊU CẦU 7) --- */}
      <ImportOutfitModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={refreshThumbnails}
      />
    </div>
  );
}
