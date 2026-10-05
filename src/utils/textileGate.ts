/**
 * Textile Gate — client-side heuristic validation
 *
 * This is a PROTOTYPE validator using Canvas pixel analysis.
 * It is NOT a trained ML model and cannot guarantee accuracy.
 * It is clearly labeled as prototype validation throughout the UI.
 *
 * Architecture is ready for replacement with:
 *   POST /validate-image → { is_textile: boolean, confidence: number }
 *
 * How it works:
 * Textiles have distinctive visual properties measurable from pixels:
 *   1. High local texture variance — fine woven/printed detail
 *   2. Repeating spatial frequency — motif repetition
 *   3. Color distribution — fabrics tend toward mid-range saturation
 *   4. Edge density — woven patterns have many fine edges
 *
 * Non-textile images (cars, faces, buildings, food) typically have:
 *   - Large uniform regions (sky, metal, skin)
 *   - Low local texture variance
 *   - Low edge density relative to image area
 *   - Dominant single-hue regions
 */

export type TextileValidationStatus =
  | 'textile'        // passes gate → proceed to gallery matching
  | 'not_textile'    // clearly not a textile → block matching
  | 'uncertain'      // borderline → allow but warn
  | 'poor_quality';  // image too low quality to validate

export interface TextileValidationResult {
  status: TextileValidationStatus;
  confidence: number;       // 0–1, how confident the heuristic is
  textureScore: number;     // 0–1, local texture variance
  edgeScore: number;        // 0–1, edge density
  patternScore: number;     // 0–1, repeating pattern signal
  reason: string;           // human-readable explanation
  isPrototype: true;        // always true — never claim real ML
}

// Prototype thresholds — not scientifically trained
// Tuned to pass clear textiles and reject clear non-textiles
const TEXTILE_THRESHOLD = 0.42;   // combined score above this → textile
const UNCERTAIN_THRESHOLD = 0.28; // between this and TEXTILE → uncertain
const MIN_PIXELS = 80 * 80;       // minimum usable resolution

/** Compute local texture variance using a sliding window */
function computeTextureVariance(data: Uint8ClampedArray, w: number, h: number): number {
  const BLOCK = 8;
  let totalVariance = 0;
  let blockCount = 0;

  for (let by = 0; by < h - BLOCK; by += BLOCK) {
    for (let bx = 0; bx < w - BLOCK; bx += BLOCK) {
      let sum = 0;
      let sumSq = 0;
      let n = 0;

      for (let dy = 0; dy < BLOCK; dy++) {
        for (let dx = 0; dx < BLOCK; dx++) {
          const idx = ((by + dy) * w + (bx + dx)) * 4;
          const r = data[idx]!;
          const g = data[idx + 1]!;
          const b = data[idx + 2]!;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          sum += lum;
          sumSq += lum * lum;
          n++;
        }
      }

      const mean = sum / n;
      const variance = sumSq / n - mean * mean;
      totalVariance += variance;
      blockCount++;
    }
  }

  if (blockCount === 0) return 0;
  const avgVariance = totalVariance / blockCount;
  // Normalize: textiles typically 200–800 variance, non-textiles 20–150
  return Math.min(1, avgVariance / 600);
}

/** Compute edge density using simple horizontal+vertical gradient */
function computeEdgeDensity(data: Uint8ClampedArray, w: number, h: number): number {
  let edgePixels = 0;
  const total = (w - 1) * (h - 1);
  const EDGE_THRESHOLD = 18; // gradient magnitude to count as edge

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      const iR = (y * w + x + 1) * 4;
      const iD = ((y + 1) * w + x) * 4;

      const lumC = 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
      const lumR = 0.299 * data[iR]! + 0.587 * data[iR + 1]! + 0.114 * data[iR + 2]!;
      const lumD = 0.299 * data[iD]! + 0.587 * data[iD + 1]! + 0.114 * data[iD + 2]!;

      const gx = Math.abs(lumR - lumC);
      const gy = Math.abs(lumD - lumC);
      const mag = gx + gy; // Manhattan approximation

      if (mag > EDGE_THRESHOLD) edgePixels++;
    }
  }

  return total > 0 ? edgePixels / total : 0;
}

/**
 * Detect repeating pattern signal using horizontal and vertical
 * autocorrelation on luminance rows/columns.
 * Textiles have strong periodicity; random photos do not.
 */
function computePatternScore(data: Uint8ClampedArray, w: number, h: number): number {
  // Sample every 4th row for speed
  const STEP = 4;
  const MAX_LAG = Math.min(32, Math.floor(w / 4));
  let totalScore = 0;
  let rowCount = 0;

  for (let y = 0; y < h; y += STEP) {
    // Build luminance row
    const row: number[] = [];
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      row.push(0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!);
    }

    // Mean
    const mean = row.reduce((s, v) => s + v, 0) / row.length;

    // Autocorrelation at lag 0 (variance)
    let ac0 = 0;
    for (const v of row) ac0 += (v - mean) ** 2;
    if (ac0 < 1) continue;

    // Max autocorrelation across lags 4..MAX_LAG
    let maxAc = 0;
    for (let lag = 4; lag <= MAX_LAG; lag++) {
      let ac = 0;
      for (let x = 0; x < row.length - lag; x++) {
        ac += (row[x]! - mean) * (row[x + lag]! - mean);
      }
      const normalized = Math.abs(ac / ac0);
      if (normalized > maxAc) maxAc = normalized;
    }

    totalScore += maxAc;
    rowCount++;
  }

  return rowCount > 0 ? Math.min(1, totalScore / rowCount) : 0;
}

/** Check if image is essentially blank/uniform */
function isBlankImage(data: Uint8ClampedArray): boolean {
  let minL = 255;
  let maxL = 0;
  const SAMPLE = Math.floor(data.length / 4 / 200); // sample 200 pixels

  for (let i = 0; i < data.length; i += 4 * Math.max(1, SAMPLE)) {
    const lum = 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
    if (lum < minL) minL = lum;
    if (lum > maxL) maxL = lum;
  }

  return (maxL - minL) < 12; // less than 12 luma range = essentially blank
}

export async function validateTextileImage(src: string): Promise<TextileValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onerror = () => {
      resolve({
        status: 'poor_quality',
        confidence: 0,
        textureScore: 0,
        edgeScore: 0,
        patternScore: 0,
        reason: 'Image could not be loaded or is corrupted.',
        isPrototype: true,
      });
    };

    img.onload = () => {
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      // Too small to analyze
      if (naturalW * naturalH < MIN_PIXELS) {
        resolve({
          status: 'poor_quality',
          confidence: 0,
          textureScore: 0,
          edgeScore: 0,
          patternScore: 0,
          reason: 'Image resolution is too low for reliable analysis.',
          isPrototype: true,
        });
        return;
      }

      // Resize to analysis canvas (max 256px on longest side for speed)
      const MAX = 256;
      const scale = Math.min(1, MAX / Math.max(naturalW, naturalH));
      const w = Math.max(1, Math.round(naturalW * scale));
      const h = Math.max(1, Math.round(naturalH * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Canvas unavailable — pass through with uncertain
        resolve({
          status: 'uncertain',
          confidence: 0.5,
          textureScore: 0.5,
          edgeScore: 0.5,
          patternScore: 0.5,
          reason: 'Canvas API unavailable — validation skipped.',
          isPrototype: true,
        });
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);

      // Blank image check
      if (isBlankImage(data)) {
        resolve({
          status: 'poor_quality',
          confidence: 0,
          textureScore: 0,
          edgeScore: 0,
          patternScore: 0,
          reason: 'Image appears blank or nearly uniform.',
          isPrototype: true,
        });
        return;
      }

      // Compute the three scores
      const textureScore = computeTextureVariance(data, w, h);
      const edgeScore = computeEdgeDensity(data, w, h);
      const patternScore = computePatternScore(data, w, h);

      // Combined score — weighted toward texture and edge density
      // Textiles: high texture + high edges + some pattern
      // Non-textiles: low texture + low/medium edges + low pattern
      const combined = textureScore * 0.45 + edgeScore * 0.35 + patternScore * 0.20;

      let status: TextileValidationStatus;
      let reason: string;

      if (combined >= TEXTILE_THRESHOLD) {
        status = 'textile';
        reason = 'Textile-like texture and pattern characteristics detected.';
      } else if (combined >= UNCERTAIN_THRESHOLD) {
        status = 'uncertain';
        reason = 'Image has some textile-like properties but the signal is weak.';
      } else {
        status = 'not_textile';
        reason = 'Image does not show textile-like texture or pattern characteristics.';
      }

      resolve({
        status,
        confidence: Math.min(1, combined),
        textureScore,
        edgeScore,
        patternScore,
        reason,
        isPrototype: true,
      });
    };

    img.src = src;
  });
}
