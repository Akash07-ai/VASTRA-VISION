import { getGallery as getDemoGallery, predictDesign as predictDemoDesign, verifyDesign as verifyDemoDesign } from '../utils/demoLogic';
import { validateTextileImage } from '../utils/textileGate';
import type { PredictionResult, TextileImage, UploadedImage, VerificationResult } from '../types';
import type { TextileValidationResult } from '../utils/textileGate';

export type { TextileValidationResult };

/**
 * Stage 1 — Textile Gate
 * Ready for replacement with: POST /validate-image → { is_textile, confidence }
 */
export async function validateImage(src: string): Promise<TextileValidationResult> {
  await wait(200);
  return validateTextileImage(src);
}

/**
 * Stage 2 — Design Prediction (only called after gate passes)
 * Ready for replacement with: POST /predict
 */
export async function predictDesign(upload: UploadedImage): Promise<PredictionResult> {
  await wait(450);
  return predictDemoDesign(upload);
}

export async function verifyDesign(imageA: UploadedImage, imageB: UploadedImage): Promise<VerificationResult> {
  await wait(450);
  return verifyDemoDesign(imageA, imageB);
}

export async function getGallery(): Promise<TextileImage[]> {
  return getDemoGallery();
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
