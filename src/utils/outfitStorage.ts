import { removeWhiteBackground } from './backgroundRemoval';
import { TRADITIONAL_COSTUMES, COLOR_OPTIONS } from '../data/costumesData';
import { COMPLETE_OUTFITS_MAP, getOutfitKey } from './outfitFormula';

const DB_NAME = 'VietPhucRemixDB';
const DB_VERSION = 2; // Upgraded version for outfit_cache
const OUTFIT_STORE = 'outfit_cache';
const CHAR_STORE = 'characters';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CHAR_STORE)) {
        db.createObjectStore(CHAR_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(OUTFIT_STORE)) {
        db.createObjectStore(OUTFIT_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface CachedOutfitRecord {
  key: string;
  dataUrl: string;
  gender: 'female' | 'male';
  costumeId: string;
  colorId: string;
  updatedAt: number;
}

/**
 * Lưu ảnh trang phục đã tách nền vào IndexedDB bền vững
 */
export async function saveOutfitCache(
  key: string,
  dataUrl: string,
  metadata?: {
    gender?: 'female' | 'male';
    costumeId?: string;
    colorId?: string;
  }
): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(OUTFIT_STORE, 'readwrite');
      const store = tx.objectStore(OUTFIT_STORE);
      const record: CachedOutfitRecord = {
        key,
        dataUrl,
        gender: metadata?.gender || 'female',
        costumeId: metadata?.costumeId || '',
        colorId: metadata?.colorId || '',
        updatedAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Lỗi lưu outfit vào IndexedDB, fallback localStorage:', err);
    try {
      localStorage.setItem(`outfit_${key}`, dataUrl);
    } catch {
      // ignore
    }
  }
}

/**
 * Lấy ảnh trang phục từ IndexedDB cache
 */
export async function getOutfitCache(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(OUTFIT_STORE, 'readonly');
      const store = tx.objectStore(OUTFIT_STORE);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result && req.result.dataUrl) {
          resolve(req.result.dataUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return localStorage.getItem(`outfit_${key}`);
  }
}

/**
 * Lấy tất cả cache ảnh của một nhân vật và danh sách bộ theo màu hiện tại,
 * dùng để hiển thị thumbnail ở lưới chọn đồ (Lấy cả khớp chính xác hoặc khớp theo costumeId + colorId)
 */
export async function getThumbnailsForCostumes(
  gender: 'female' | 'male',
  colorId: string
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(OUTFIT_STORE, 'readonly');
      const store = tx.objectStore(OUTFIT_STORE);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const val = cursor.value as CachedOutfitRecord;
          if (val.gender === gender) {
            // Khớp costumeId
            if (val.costumeId) {
              if (val.colorId === colorId || !result[val.costumeId]) {
                result[val.costumeId] = val.dataUrl;
              }
            } else {
              // Parse từ key nếu chưa có trường riêng
              const parts = val.key.split('_');
              if (parts.length >= 3) {
                const cId = parts.slice(1, -3).join('_');
                if (cId && !result[cId]) {
                  result[cId] = val.dataUrl;
                }
              }
            }
          }
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      req.onerror = () => resolve(result);
    });
  } catch {
    return result;
  }
}

export interface ExpectedFileInfo {
  fileName: string;
  characterName: string;
  gender: 'female' | 'male';
  costumeId: string;
  costumeName: string;
  colorId: string;
  colorName: string;
}

/**
 * Trả về danh sách đầy đủ tên file mong đợi cho cả 2 nhân vật (7 bộ x 8 màu = 56 file mỗi nhân vật)
 */
export function getExpectedFileList(): ExpectedFileInfo[] {
  const characters: { gender: 'female' | 'male'; prefix: string; name: string }[] = [
    { gender: 'female', prefix: 'nhanhien', name: 'An Nhiên (Nữ)' },
    { gender: 'male', prefix: 'minhtriet', name: 'Minh Triết (Nam)' },
  ];

  const list: ExpectedFileInfo[] = [];

  characters.forEach((char) => {
    TRADITIONAL_COSTUMES.forEach((costume) => {
      COLOR_OPTIONS.forEach((color) => {
        const fileName = `${char.prefix}_${costume.id}_${color.id}.png`;
        list.push({
          fileName,
          characterName: char.name,
          gender: char.gender,
          costumeId: costume.id,
          costumeName: costume.name,
          colorId: color.id,
          colorName: color.name,
        });
      });
    });
  });

  return list;
}

/**
 * Xử lý nhập ảnh trang phục hàng loạt từ người dùng (tự động phân tích theo quy ước tên file)
 * Hỗ trợ các định dạng:
 * nhanhien_<mã bộ>_<mã màu>.png
 * minhtriet_<mã bộ>_<mã màu>.png
 */
export async function importOutfitImages(files: FileList | File[]): Promise<{
  importedCount: number;
  errors: string[];
  importedKeys: string[];
}> {
  let importedCount = 0;
  const errors: string[] = [];
  const importedKeys: string[] = [];

  const costumeIds = TRADITIONAL_COSTUMES.map((c) => c.id);
  const colorIds = COLOR_OPTIONS.map((c) => c.id);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rawName = file.name.toLowerCase().replace(/\.[^/.]+$/, ''); // Bỏ đuôi file

    // Regex phân tích tên file: (nhanhien|minhtriet)_(.*)_(.*)
    const match = rawName.match(/^(nhanhien|minhtriet)_(.+)_(.+)$/);
    if (!match) {
      errors.push(`Tên file "${file.name}" không đúng định dạng "nhanhien_<mã bộ>_<mã màu>.png" hoặc "minhtriet_...".`);
      continue;
    }

    const prefix = match[1];
    const costumeId = match[2];
    const colorId = match[3];

    const gender: 'female' | 'male' = prefix === 'nhanhien' ? 'female' : 'male';

    if (!costumeIds.includes(costumeId)) {
      errors.push(`Mã bộ trang phục "${costumeId}" trong file "${file.name}" không tồn tại trong hệ thống.`);
      continue;
    }

    if (!colorIds.includes(colorId)) {
      errors.push(`Mã màu sắc "${colorId}" trong file "${file.name}" không tồn tại trong hệ thống.`);
      continue;
    }

    try {
      // Đọc file thành dataUrl
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Tách nền trắng nếu file chưa phải nền trong suốt
      let processedDataUrl = dataUrl;
      try {
        processedDataUrl = await removeWhiteBackground(dataUrl, 25, 2);
      } catch (bgErr) {
        console.warn('Không thể tách nền cho file import, giữ nguyên:', bgErr);
      }

      // Tạo formula mặc định cho bộ này với màu này
      const costumeDef = TRADITIONAL_COSTUMES.find((c) => c.id === costumeId)!;
      const key = getOutfitKey({
        gender,
        costumeId,
        colorId,
        accessoryIds: costumeDef.defaultAccessoryIds || [],
        footwearId: costumeDef.defaultFootwearId || 'sneaker_trang',
      });

      // Đồng thời lưu cả key rút gọn `${gender}_${costumeId}_${colorId}` để fallback
      const shortKey = `${gender}_${costumeId}_${colorId}`;

      await saveOutfitCache(key, processedDataUrl, { gender, costumeId, colorId });
      await saveOutfitCache(shortKey, processedDataUrl, { gender, costumeId, colorId });

      importedCount++;
      importedKeys.push(key);
    } catch (err: unknown) {
      errors.push(`Lỗi đọc tệp "${file.name}": ${(err as Error).message}`);
    }
  }

  return { importedCount, errors, importedKeys };
}

