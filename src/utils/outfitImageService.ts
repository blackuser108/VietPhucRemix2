import { OutfitFormula, getOutfitKey, buildOutfitPrompt } from './outfitFormula';
import { getOutfitCache, saveOutfitCache } from './outfitStorage';
import { removeWhiteBackground } from './backgroundRemoval';
import { TRADITIONAL_COSTUMES, COLOR_OPTIONS } from '../data/costumesData';

export interface GenerateOutfitResult {
  success: boolean;
  dataUrl?: string;
  source: 'cache' | 'generated' | 'fallback';
  outfitKey: string;
  error?: string;
  requiresPaid?: boolean;
}

/**
 * Chuyển đổi một image source (URL tương đối hoặc blob) thành Base64 DataURL
 */
async function imageSrcToBase64(imageSrc: string): Promise<string> {
  if (imageSrc.startsWith('data:')) {
    return imageSrc;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 800;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`Không thể nạp ảnh gốc từ ${imageSrc}`));
    img.src = imageSrc;
  });
}

/**
 * Gọi API backend tạo ảnh với thời hạn timeout (mặc định 40s)
 */
async function callGenerateApi(
  payload: {
    gender: 'female' | 'male';
    baseImageBase64: string;
    prompt: string;
    costumeId: string;
    colorId: string;
  },
  timeoutMs = 40000,
  signal?: AbortSignal
): Promise<{ success: boolean; imageBase64?: string; error?: string; requiresPaid?: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onAbort = () => controller.abort();
  if (signal) {
    signal.addEventListener('abort', onAbort);
  }

  try {
    const res = await fetch('/api/generate-outfit-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onAbort);
    }

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Lỗi máy chủ (${res.status}): ${errText}` };
    }

    return await res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onAbort);
    }
    const error = err as Error;
    if (error.name === 'AbortError') {
      return { success: false, error: 'Quá thời gian tạo ảnh (hơn 40 giây) hoặc thao tác đã bị hủy.' };
    }
    return { success: false, error: error.message };
  }
}

/**
 * HÀM DÙNG CHUNG: generateOutfitImage
 * - Luôn kiểm tra cache IndexedDB trước.
 * - Luôn lấy ảnh nhân vật gốc (An Nhiên / Minh Triết) làm ảnh tham chiếu (không chồng lên ảnh đã mặc).
 * - Sử dụng mô hình Gemini qua API server-side với prompt chuẩn hóa văn hóa.
 * - Timeout 40 giây, thử lại 1 lần nếu thất bại.
 * - Ảnh trả về được tách nền trong suốt bằng canvas BFS flood-fill và lưu vào IndexedDB.
 */
export async function generateOutfitImage(
  formula: OutfitFormula,
  baseImageSrc: string,
  options?: {
    signal?: AbortSignal;
    onStatusChange?: (status: string) => void;
  }
): Promise<GenerateOutfitResult> {
  const outfitKey = getOutfitKey(formula);

  // 1. Kiểm tra cache chính xác theo công thức
  options?.onStatusChange?.('Đang kiểm tra kho trang phục...');
  const cached = await getOutfitCache(outfitKey);
  if (cached) {
    return {
      success: true,
      dataUrl: cached,
      source: 'cache',
      outfitKey,
    };
  }

  // Fallback kiểm tra cache theo mã rút gọn (nhân vật + bộ + màu)
  const fallbackKey = `${formula.gender}_${formula.costumeId}_${formula.colorId}`;
  const fallbackCached = await getOutfitCache(fallbackKey);
  if (fallbackCached) {
    return {
      success: true,
      dataUrl: fallbackCached,
      source: 'cache',
      outfitKey,
    };
  }

  // 2. Chuẩn bị prompt và ảnh gốc
  options?.onStatusChange?.('Đang thiết kế theo chuẩn văn hóa...');
  const prompt = buildOutfitPrompt(formula);

  let baseImageBase64 = '';
  try {
    baseImageBase64 = await imageSrcToBase64(baseImageSrc);
  } catch (e) {
    console.warn('Không thể chuyển ảnh gốc sang base64:', e);
  }

  const payload = {
    gender: formula.gender,
    baseImageBase64,
    prompt,
    costumeId: formula.costumeId,
    colorId: formula.colorId,
  };

  // 3. Gọi tạo ảnh lần 1 (Timeout 40s)
  options?.onStatusChange?.('Đang may trang phục bằng AI...');
  let apiRes = await callGenerateApi(payload, 40000, options?.signal);

  // 4. Nếu thất bại lần 1, tự động thử lại 1 lần (Retry 1 time)
  if (!apiRes.success && !options?.signal?.aborted) {
    console.warn('Tạo ảnh lần 1 không thành công, tự động thử lại lần 2...', apiRes.error);
    options?.onStatusChange?.('Đang tỉ mỉ may lại lần 2...');
    apiRes = await callGenerateApi(payload, 40000, options?.signal);
  }

  // 5. Nếu thành công nhận được ảnh
  if (apiRes.success && apiRes.imageBase64) {
    try {
      options?.onStatusChange?.('Đang tách nền trong suốt...');
      const transparentDataUrl = await removeWhiteBackground(apiRes.imageBase64, 28, 2);

      options?.onStatusChange?.('Đang lưu vào bộ sưu tập...');
      await saveOutfitCache(outfitKey, transparentDataUrl, {
        gender: formula.gender,
        costumeId: formula.costumeId,
        colorId: formula.colorId,
      });

      // Lưu thêm fallback key
      await saveOutfitCache(fallbackKey, transparentDataUrl, {
        gender: formula.gender,
        costumeId: formula.costumeId,
        colorId: formula.colorId,
      });

      return {
        success: true,
        dataUrl: transparentDataUrl,
        source: 'generated',
        outfitKey,
      };
    } catch (bgErr) {
      console.warn('Lỗi tách nền canvas, dùng ảnh trực tiếp:', bgErr);
      await saveOutfitCache(outfitKey, apiRes.imageBase64, {
        gender: formula.gender,
        costumeId: formula.costumeId,
        colorId: formula.colorId,
      });

      return {
        success: true,
        dataUrl: apiRes.imageBase64,
        source: 'generated',
        outfitKey,
      };
    }
  }

  // 6. Nếu vẫn thất bại sau thử lại
  return {
    success: false,
    outfitKey,
    error: apiRes.error || 'Chưa may được bộ này',
    requiresPaid: apiRes.requiresPaid,
    source: 'fallback',
  };
}

/**
 * Trình quản lý tiến trình "Tạo sẵn bộ sưu tập":
 * - Chạy tuần tự với tối đa 2 tác vụ đồng thời
 * - Cho phép hủy bất cứ lúc nào
 * - Lưu kết quả bền vững vào IndexedDB
 */
export class CollectionBatchGenerator {
  private isCancelled = false;
  private abortController: AbortController | null = null;

  public cancel(): void {
    this.isCancelled = true;
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  public async runBatch(
    gender: 'female' | 'male',
    baseImageSrc: string,
    onProgress: (status: {
      completed: number;
      total: number;
      currentCostumeName: string;
      isDone: boolean;
      cancelled: boolean;
      errorCount: number;
    }) => void
  ): Promise<void> {
    this.isCancelled = false;
    this.abortController = new AbortController();

    const costumes = TRADITIONAL_COSTUMES;
    const total = costumes.length;
    let completed = 0;
    let errorCount = 0;

    // Hàng đợi tuần tự tối đa 2 yêu cầu đồng thời (Concurrency limit = 2)
    const queue = [...costumes];
    const worker = async () => {
      while (queue.length > 0 && !this.isCancelled) {
        const item = queue.shift();
        if (!item) break;

        const formula: OutfitFormula = {
          gender,
          costumeId: item.id,
          colorId: item.defaultColor ? COLOR_OPTIONS.find((c) => c.hex === item.defaultColor)?.id || 'do_son' : 'do_son',
          accessoryIds: item.defaultAccessoryIds || [],
          footwearId: item.defaultFootwearId || 'sneaker_trang',
        };

        onProgress({
          completed,
          total,
          currentCostumeName: item.name,
          isDone: false,
          cancelled: false,
          errorCount,
        });

        try {
          const res = await generateOutfitImage(formula, baseImageSrc, {
            signal: this.abortController?.signal,
          });
          if (!res.success) {
            errorCount++;
          }
        } catch {
          errorCount++;
        }

        completed++;
        onProgress({
          completed,
          total,
          currentCostumeName: item.name,
          isDone: completed === total,
          cancelled: this.isCancelled,
          errorCount,
        });
      }
    };

    // Chạy 2 workers đồng thời
    await Promise.all([worker(), worker()]);

    onProgress({
      completed,
      total,
      currentCostumeName: 'Hoàn tất',
      isDone: true,
      cancelled: this.isCancelled,
      errorCount,
    });
  }
}

