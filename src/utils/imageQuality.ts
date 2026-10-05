export interface ImageQualityReport {
  width: number;
  height: number;
  format: string;
  resolutionLabel: 'Good' | 'Low' | 'Very Low';
  brightnessLabel: 'Good' | 'Dark' | 'Overexposed';
  sharpnessLabel: 'Good' | 'Moderate' | 'Blurry';
  tip: string | null;
}

function formatFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WEBP',
  };
  return map[mime] ?? mime.split('/')[1]?.toUpperCase() ?? 'Unknown';
}

function resolutionLabel(w: number, h: number): ImageQualityReport['resolutionLabel'] {
  const mp = (w * h) / 1_000_000;
  if (mp >= 0.3) return 'Good';
  if (mp >= 0.1) return 'Low';
  return 'Very Low';
}

function analyzeCanvas(img: HTMLImageElement): { brightness: number; sharpness: number } {
  const MAX = 200;
  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { brightness: 128, sharpness: 50 };

  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  let totalBrightness = 0;
  let edgeSum = 0;
  const pixels = w * h;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += lum;

    // Simple Laplacian-like edge detection on luma
    if (i + 4 < data.length) {
      const nextLum = 0.299 * data[i + 4]! + 0.587 * data[i + 5]! + 0.114 * data[i + 6]!;
      edgeSum += Math.abs(lum - nextLum);
    }
  }

  return {
    brightness: totalBrightness / pixels,
    sharpness: edgeSum / pixels,
  };
}

export async function analyzeImageQuality(file: File, src: string): Promise<ImageQualityReport> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const { brightness, sharpness } = analyzeCanvas(img);

      const resLabel = resolutionLabel(w, h);
      const brightnessLabel: ImageQualityReport['brightnessLabel'] =
        brightness < 55 ? 'Dark' : brightness > 210 ? 'Overexposed' : 'Good';
      const sharpnessLabel: ImageQualityReport['sharpnessLabel'] =
        sharpness > 12 ? 'Good' : sharpness > 5 ? 'Moderate' : 'Blurry';

      const tips: string[] = [];
      if (resLabel !== 'Good') tips.push('Use a higher-resolution image.');
      if (brightnessLabel === 'Dark') tips.push('Try a better-lit image.');
      if (brightnessLabel === 'Overexposed') tips.push('Reduce glare or direct light.');
      if (sharpnessLabel !== 'Good') tips.push('Try a closer crop of the fabric pattern.');

      resolve({
        width: w,
        height: h,
        format: formatFromMime(file.type),
        resolutionLabel: resLabel,
        brightnessLabel,
        sharpnessLabel,
        tip: tips[0] ?? null,
      });
    };
    img.onerror = () =>
      resolve({
        width: 0,
        height: 0,
        format: formatFromMime(file.type),
        resolutionLabel: 'Very Low',
        brightnessLabel: 'Good',
        sharpnessLabel: 'Good',
        tip: null,
      });
    img.src = src;
  });
}
