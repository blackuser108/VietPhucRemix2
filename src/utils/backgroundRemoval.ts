// Utility for transparent background processing via client-side flood fill
// Removes pure/near-white background originating from image boundaries

export async function removeWhiteBackground(
  imageSource: string,
  tolerance = 28, // Color difference threshold from pure white (0-255)
  softenRadius = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(imageSource);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const { width, height } = canvas;
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Visited grid for 4-connected boundary flood fill
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        // Check if a pixel at index is near pure white
        const isNearWhite = (idx: number) => {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          // Near white if all channels are above 255 - tolerance
          // and color difference is small (neutral background)
          const minChan = 255 - tolerance;
          const isWhiteEnough = r >= minChan && g >= minChan && b >= minChan;
          const isNeutral = Math.abs(r - g) <= 15 && Math.abs(g - b) <= 15 && Math.abs(r - b) <= 15;
          return isWhiteEnough && isNeutral;
        };

        // Seed queue with border pixels
        // Top and bottom borders
        for (let x = 0; x < width; x++) {
          const topIdx = (0 * width + x) * 4;
          if (isNearWhite(topIdx)) {
            queue.push(0 * width + x);
            visited[0 * width + x] = 1;
          }
          const btmIdx = ((height - 1) * width + x) * 4;
          if (isNearWhite(btmIdx)) {
            queue.push((height - 1) * width + x);
            visited[(height - 1) * width + x] = 1;
          }
        }

        // Left and right borders
        for (let y = 0; y < height; y++) {
          const leftIdx = (y * width + 0) * 4;
          if (isNearWhite(leftIdx) && !visited[y * width + 0]) {
            queue.push(y * width + 0);
            visited[y * width + 0] = 1;
          }
          const rightIdx = (y * width + (width - 1)) * 4;
          if (isNearWhite(rightIdx) && !visited[y * width + (width - 1)]) {
            queue.push(y * width + (width - 1));
            visited[y * width + (width - 1)] = 1;
          }
        }

        // BFS Flood fill only connected boundary white pixels
        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          const cx = curr % width;
          const cy = Math.floor(curr / width);

          // 4-neighborhood
          const neighbors = [
            curr - 1, // left
            curr + 1, // right
            curr - width, // up
            curr + width, // down
          ];

          for (let i = 0; i < 4; i++) {
            const next = neighbors[i];
            const nx = next % width;
            const ny = Math.floor(next / width);

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (!visited[next]) {
                const pIdx = next * 4;
                if (isNearWhite(pIdx)) {
                  visited[next] = 1;
                  queue.push(next);
                }
              }
            }
          }
        }

        // Set alpha to 0 for all flood-filled white background pixels
        for (let i = 0; i < visited.length; i++) {
          if (visited[i]) {
            data[i * 4 + 3] = 0;
          }
        }

        // Edge softening / anti-aliasing feathering along boundary
        if (softenRadius > 0) {
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const idx = (y * width + x) * 4;
              if (data[idx + 3] > 0) {
                // If it's a solid pixel neighboring an erased background pixel
                let transparentNeighbors = 0;
                for (let dy = -softenRadius; dy <= softenRadius; dy++) {
                  for (let dx = -softenRadius; dx <= softenRadius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                      if (data[(ny * width + nx) * 4 + 3] === 0) {
                        transparentNeighbors++;
                      }
                    }
                  }
                }
                if (transparentNeighbors > 0) {
                  // Soften edge opacity to eliminate halo
                  const featherRatio = 1 - transparentNeighbors / ((2 * softenRadius + 1) ** 2);
                  data[idx + 3] = Math.max(0, Math.min(255, Math.floor(data[idx + 3] * featherRatio)));
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Flood fill error, falling back to original:', err);
        resolve(imageSource);
      }
    };
    img.onerror = () => {
      resolve(imageSource);
    };
    img.src = imageSource;
  });
}
