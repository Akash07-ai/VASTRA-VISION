import { useEffect, useState } from 'react';
import { ErrorState } from '../components/ErrorState';
import { ImageQualityPanel } from '../components/ImageQualityPanel';
import { ImageUploader } from '../components/ImageUploader';
import { MatchGrid } from '../components/MatchGrid';
import { NoMatchState } from '../components/NoMatchState';
import { ProcessingAnimation } from '../components/ProcessingAnimation';
import { SectionTitle } from '../components/SectionTitle';
import { SimilarityMeter } from '../components/SimilarityMeter';
import { ViewToggle } from '../components/ViewToggle';
import { predictDesign } from '../services/visionService';
import type { PredictionResult, TextileImage, UploadedImage } from '../types';
import { useFavorites } from '../utils/favorites';
import { analyzeImageQuality, type ImageQualityReport } from '../utils/imageQuality';
import { inferCategoryFromName } from '../utils/demoLogic';

const NO_MATCH_THRESHOLD = 0.5;

interface IdentifyDesignProps {
  initialImage?: TextileImage | null;
}

export function IdentifyDesign({ initialImage }: IdentifyDesignProps) {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [quality, setQuality] = useState<ImageQualityReport | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [research, setResearch] = useState(false);
  const { favorites, toggle, isFavorite } = useFavorites();

  // Handle "Find Similar" from gallery — pre-populate with a TextileImage
  useEffect(() => {
    if (!initialImage) return;
    // Convert TextileImage → UploadedImage-like object using its src as a data URL proxy
    // We create a synthetic UploadedImage from the gallery image
    fetch(initialImage.src)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], initialImage.fileName, { type: blob.type || 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => {
          const uploaded: UploadedImage = {
            id: `${file.name}-${Date.now()}`,
            file,
            src: String(reader.result),
            inferredCategory: initialImage.category,
          };
          setImage(uploaded);
          setResult(null);
          setQuality(null);
        };
        reader.readAsDataURL(file);
      })
      .catch(() => {
        // Fallback: use src directly (works for data URLs and same-origin assets)
        const syntheticFile = new File([], initialImage.fileName, { type: 'image/jpeg' });
        const uploaded: UploadedImage = {
          id: `${initialImage.id}-${Date.now()}`,
          file: syntheticFile,
          src: initialImage.src,
          inferredCategory: initialImage.category,
        };
        setImage(uploaded);
        setResult(null);
        setQuality(null);
      });
  }, [initialImage]);

  const handleImageChange = async (img: UploadedImage | null) => {
    setImage(img);
    setResult(null);
    setQuality(null);
    if (img) {
      const report = await analyzeImageQuality(img.file, img.src);
      setQuality(report);
    }
  };

  const handleFindSimilar = (galleryImage: TextileImage) => {
    const syntheticFile = new File([], galleryImage.fileName, { type: 'image/jpeg' });
    const uploaded: UploadedImage = {
      id: `${galleryImage.id}-${Date.now()}`,
      file: syntheticFile,
      src: galleryImage.src,
      inferredCategory: inferCategoryFromName(galleryImage.fileName),
    };
    setImage(uploaded);
    setResult(null);
    setQuality(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const analyze = async () => {
    if (!image) {
      setError('Upload a saree or fabric image before analyzing.');
      return;
    }
    setError('');
    setResult(null);
    setProcessing(true);
    const prediction = await predictDesign(image);
    setResult(prediction);
    setProcessing(false);
  };

  const hasWeakMatch = result !== null && result.similarity < NO_MATCH_THRESHOLD;

  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="Prototype Demonstration"
        title="Upload a saree or fabric image"
        copy="Analyze visual design signals and retrieve deterministic demo matches from the local gallery when images are available."
      />

      <section className="mx-auto mt-10 grid max-w-5xl gap-6">
        <ImageUploader label="Upload a saree or fabric image" image={image} onChange={handleImageChange} />
        {quality ? <ImageQualityPanel report={quality} /> : null}
        {error ? <ErrorState message={error} /> : null}
        <button className="btn btn-primary justify-center" onClick={analyze} disabled={processing}>
          Analyze Design
        </button>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        {processing ? <ProcessingAnimation /> : null}

        {result ? (
          hasWeakMatch ? (
            <NoMatchState similarity={result.similarity} />
          ) : (
            <div className="space-y-8">
              <div className="rounded border border-gold/25 bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <p className="section-eyebrow">Design Analysis</p>
                  <ViewToggle research={research} onChange={setResearch} />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-ink/55">Category</p>
                    <p className="text-2xl font-semibold text-ink">{result.category}</p>
                    <p className="mt-1 text-xs text-ink/40 uppercase tracking-wide">Demo / Prototype Result</p>
                  </div>
                  <div className="md:col-span-2">
                    <SimilarityMeter value={result.similarity} label="Demo similarity" />
                    <p className="mt-3 text-sm text-ink/65">Match Strength: {result.strength}</p>
                    {research ? (
                      <div className="mt-4 rounded border border-ink/10 bg-ivory p-3 text-sm space-y-1 text-ink/70">
                        <p className="font-semibold text-ink">Research Details</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-2">
                          <span>Similarity score</span><span className="font-mono">{result.similarity.toFixed(4)}</span>
                          <span>Category signal</span><span>{result.category}</span>
                          <span>Model</span><span className="text-ink/40">Not connected</span>
                          <span>Embedding dim</span><span className="text-ink/40">N/A (prototype)</span>
                          <span>Retrieval</span><span className="text-ink/40">Deterministic demo</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl font-semibold text-ink">Top Similar Designs</h2>
                <p className="mt-2 text-sm text-ink/60">
                  Demo ranking is deterministic and not a trained ML prediction.
                </p>
                <div className="mt-5">
                  <MatchGrid
                    matches={result.matches}
                    onFindSimilar={handleFindSimilar}
                    favorites={favorites}
                    onToggleFavorite={toggle}
                  />
                </div>
              </div>
            </div>
          )
        ) : null}
      </section>
    </div>
  );
}
