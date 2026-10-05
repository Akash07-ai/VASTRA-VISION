export type TextileCategory = 'Banarasi' | 'Bandhani' | 'Ikat' | 'Pichwai';

export type PageKey = 'home' | 'identify' | 'verify' | 'gallery' | 'color' | 'about';

export interface TextileImage {
  id: string;
  src: string;
  category: TextileCategory;
  description: string;
  fileName: string;
}

export interface UploadedImage {
  id: string;
  file: File;
  src: string;
  inferredCategory: TextileCategory;
}

export interface MatchResult {
  id: string;
  image?: TextileImage;
  category: TextileCategory;
  similarity: number;
  strength: string;
  rank: number;
}

export interface PredictionResult {
  category: TextileCategory;
  similarity: number;
  strength: string;
  matches: MatchResult[];
}

export interface VerificationResult {
  sameDesign: boolean;
  similarity: number;
  threshold: number;
  explanation: string;
}
