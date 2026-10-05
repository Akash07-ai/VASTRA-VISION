import { getGallery as getDemoGallery, predictDesign as predictDemoDesign, verifyDesign as verifyDemoDesign } from '../utils/demoLogic';
import type { PredictionResult, TextileImage, UploadedImage, VerificationResult } from '../types';

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
