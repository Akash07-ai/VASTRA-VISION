import { categories, galleryImages } from '../data/gallery';
import type {
  MatchResult,
  PredictionResult,
  TextileCategory,
  TextileImage,
  UploadedImage,
  VerificationResult,
} from '../types';

const highScores = [0.91, 0.88, 0.84, 0.8, 0.77];
const lowScores = [0.62, 0.56, 0.49, 0.42, 0.36];

export function inferCategoryFromName(fileName: string): TextileCategory {
  const lower = fileName.toLowerCase();
  const direct = categories.find((category) => lower.includes(category.toLowerCase()));

  if (direct) {
    return direct;
  }

  const hash = lower.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return categories[hash % categories.length];
}

export function getMatchStrength(similarity: number): string {
  if (similarity >= 0.86) return 'Strong visual match';
  if (similarity >= 0.72) return 'Clear pattern resemblance';
  if (similarity >= 0.55) return 'Moderate visual overlap';
  return 'Different design signal';
}

function galleryMatches(category: TextileCategory): MatchResult[] {
  const sameCategory = galleryImages.filter((image) => image.category === category);
  const otherCategory = galleryImages.filter((image) => image.category !== category);
  const sorted = [...sameCategory, ...otherCategory].slice(0, 5);

  return sorted.map((image, index) => {
    const similarity = image.category === category ? highScores[index] ?? 0.76 : lowScores[index] ?? 0.42;

    return {
      id: image.id,
      image,
      category: image.category,
      similarity,
      strength: getMatchStrength(similarity),
      rank: index + 1,
    };
  });
}

function fallbackMatches(category: TextileCategory): MatchResult[] {
  const ordered = [category, ...categories.filter((item) => item !== category)];

  return ordered.slice(0, 5).map((item, index) => {
    const similarity = item === category ? highScores[index] ?? 0.82 : lowScores[index] ?? 0.44;

    return {
      id: `fallback-${item}-${index}`,
      category: item,
      similarity,
      strength: getMatchStrength(similarity),
      rank: index + 1,
    };
  });
}

export function predictDesign(upload: UploadedImage): PredictionResult {
  const category = upload.inferredCategory;
  const matches = galleryImages.length > 0 ? galleryMatches(category) : fallbackMatches(category);
  const similarity = matches[0]?.similarity ?? 0.82;

  return {
    category,
    similarity,
    strength: getMatchStrength(similarity),
    matches,
  };
}

export function verifyDesign(imageA: UploadedImage, imageB: UploadedImage): VerificationResult {
  const sameCategory = imageA.inferredCategory === imageB.inferredCategory;
  const nameSignal = imageA.file.name
    .toLowerCase()
    .replace(/\d+/g, '')
    .slice(0, 6) === imageB.file.name.toLowerCase().replace(/\d+/g, '').slice(0, 6);
  const similarity = sameCategory ? (nameSignal ? 0.9 : 0.84) : 0.42;
  const threshold = 0.76;
  const sameDesign = similarity >= threshold;

  return {
    sameDesign,
    similarity,
    threshold,
    explanation: sameDesign
      ? 'The two images show strongly similar visual pattern characteristics in this deterministic prototype.'
      : 'The two images show different category or pattern signals in this deterministic prototype.',
  };
}

export function getGallery(): TextileImage[] {
  return galleryImages;
}
