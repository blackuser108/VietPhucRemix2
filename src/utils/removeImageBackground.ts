/**
 * Xử lý tách nền trắng thuần (Studio background removal) cho ảnh nhân vật 2D.
 * Sử dụng thuật toán Flood Fill (BFS) bắt đầu từ 4 cạnh ngoài cùng của ảnh,
 * kết hợp feathering chống răng cưa (anti-aliasing).
 * 
 * Đảm bảo:
 * - Nền trắng ngoài cùng được tách thành trong suốt hoàn toàn.
 * - Các chi tiết màu trắng bên trong cơ thể (áo thun trắng, lòng trắng mắt, catchlight highlight)
 *   KHÔNG bị xóa vì không nối thông với viền ngoài.
 */

export async function removeWhiteBackground(
  imageSource: string,
  options?: {
    colorThreshold?: number; // Ngưỡng độ sáng gần trắng (mặc định 20 -> RGB >= 235)
    maxDelta?: number;        // Độ lệch tối đa giữa các kênh R, G, B để đảm bảo màu trắng/xám trung tính
  }
): Promise<string> {
  const threshold = options?.colorThreshold ?? 20;
  const maxDelta = options?.maxDelta ?? 18;

  return new Promise((resolve) => {
    // Nếu môi trường không có window/document (SSR)
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(imageSource);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          resolve(imageSource);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(imageSource);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const totalPixels = width * height;

        // Buffer đánh dấu: 0 = chưa duyệt, 1 = nền trắng (làm trong suốt), 2 = viền/vật thể
        const visited = new Uint8Array(totalPixels);

        // Kiểm tra điểm ảnh có thuộc dải trắng/gần trắng của phông nền không
        const isNearWhite = (idx: number): boolean => {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          const a = data[idx * 4 + 3];
          if (a === 0) return true;

          const minChannel = Math.min(r, g, b);
          const maxChannel = Math.max(r, g, b);

          // Phải đạt độ sáng cao (RGB >= 255 - threshold) và kênh R,G,B không bị lệch màu
          return minChannel >= 255 - threshold && (maxChannel - minChannel) <= maxDelta;
        };

        // Hàng đợi BFS dùng mảng Int32Array tối ưu bộ nhớ
        const queue = new Int32Array(totalPixels);
        let head = 0;
        let tail = 0;

        // Đưa các điểm ảnh ở 4 cạnh viền ngoài vào hàng đợi nếu là màu nền trắng
        // Cạnh trên và cạnh dưới
        for (let x = 0; x < width; x++) {
          const topIdx = x;
          if (isNearWhite(topIdx)) {
            visited[topIdx] = 1;
            queue[tail++] = topIdx;
          }

          const botIdx = (height - 1) * width + x;
          if (isNearWhite(botIdx)) {
            visited[botIdx] = 1;
            queue[tail++] = botIdx;
          }
        }

        // Cạnh trái và cạnh phải
        for (let y = 1; y < height - 1; y++) {
          const leftIdx = y * width;
          if (isNearWhite(leftIdx) && visited[leftIdx] === 0) {
            visited[leftIdx] = 1;
            queue[tail++] = leftIdx;
          }

          const rightIdx = y * width + (width - 1);
          if (isNearWhite(rightIdx) && visited[rightIdx] === 0) {
            visited[rightIdx] = 1;
            queue[tail++] = rightIdx;
          }
        }

        // Lan truyền BFS
        while (head < tail) {
          const curr = queue[head++];
          const x = curr % width;
          const y = (curr / width) | 0;

          // Đặt pixel nền thành hoàn toàn trong suốt
          data[curr * 4 + 3] = 0;

          // Kiểm tra 4 hướng lân cận (Trên, Dưới, Trái, Phải)
          // Lên trên
          if (y > 0) {
            const up = curr - width;
            if (visited[up] === 0) {
              if (isNearWhite(up)) {
                visited[up] = 1;
                queue[tail++] = up;
              } else {
                visited[up] = 2;
              }
            }
          }

          // Xuống dưới
          if (y < height - 1) {
            const down = curr + width;
            if (visited[down] === 0) {
              if (isNearWhite(down)) {
                visited[down] = 1;
                queue[tail++] = down;
              } else {
                visited[down] = 2;
              }
            }
          }

          // Sang trái
          if (x > 0) {
            const left = curr - 1;
            if (visited[left] === 0) {
              if (isNearWhite(left)) {
                visited[left] = 1;
                queue[tail++] = left;
              } else {
                visited[left] = 2;
              }
            }
          }

          // Sang phải
          if (x < width - 1) {
            const right = curr + 1;
            if (visited[right] === 0) {
              if (isNearWhite(right)) {
                visited[right] = 1;
                queue[tail++] = right;
              } else {
                visited[right] = 2;
              }
            }
          }
        }

        // Bước làm mịn đường viền (Anti-aliasing / Feathering) để loại bỏ viền trắng gắt
        for (let i = 0; i < totalPixels; i++) {
          if (visited[i] === 2) {
            const x = i % width;
            const y = (i / width) | 0;

            let hasTransparentNeighbor = false;
            if (x > 0 && visited[i - 1] === 1) hasTransparentNeighbor = true;
            else if (x < width - 1 && visited[i + 1] === 1) hasTransparentNeighbor = true;
            else if (y > 0 && visited[i - width] === 1) hasTransparentNeighbor = true;
            else if (y < height - 1 && visited[i + width] === 1) hasTransparentNeighbor = true;

            if (hasTransparentNeighbor) {
              const r = data[i * 4];
              const g = data[i * 4 + 1];
              const b = data[i * 4 + 2];
              const avg = (r + g + b) / 3;

              // Nếu màu quá sáng, hòa trộn độ mờ alpha để đường nét êm ái
              if (avg > 218) {
                const alphaFraction = Math.max(0.08, Math.min(1, (255 - avg) / 37));
                data[i * 4 + 3] = Math.round(data[i * 4 + 3] * alphaFraction);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL('image/png');
        resolve(transparentDataUrl);
      } catch (error) {
        console.warn('Lỗi khi tách nền ảnh trong canvas, sử dụng ảnh gốc:', error);
        resolve(imageSource);
      }
    };

    img.onerror = (error) => {
      console.warn('Không thể tải ảnh để tách nền:', error);
      resolve(imageSource);
    };

    img.src = imageSource;
  });
}
