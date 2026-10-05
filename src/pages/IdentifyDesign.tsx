import { useEffect, useRef, useState } from 'react';
import { ErrorState } from '../components/ErrorState';
import { ImageQualityPanel } from '../components/ImageQualityPanel';
import { ImageUploader } from '../components/ImageUploader';
import { MatchGrid } from '../components/MatchGrid';
import { NoMatchState } from '../components/NoMatchState';
import { NotTextileState } from '../components/NotTextileState';
import { ProcessingAnimation } from '../components/ProcessingAnimation';
import { SectionTitle } from '../components/SectionTitle';
import { SimilarityMeter } from '../components/SimilarityMeter';
import { TextileGateBadge } from '../components/TextileGateBadge';
import { ViewToggle } from '../components/ViewToggle';
import { validateImage, predictDesign } from '../services/visionService';
import type { TextileValidationResult } from '../services/visionService';
import type { PredictionResult, TextileImage, UploadedImage } from '../types';
import { useFavorites } from '../utils/favorites';
import { analyzeImageQuality, type ImageQualityReport } from '../utils/imageQuality';
import { inferCategoryFromName } from '../utils/demoLogic';

// Minimum gallery similarity to show a match (State 2 vs State 1)
const GALLERY_MATCH_THRESHOLD = 0.65;

interface IdentifyDesignProps {
  initialImage?: TextileImage | null;
  onFindSimilarConsumed?: () => void;
}

export function IdentifyDesign({ initialImage, onFindSimilarConsumed }: IdentifyDesignProps) {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [quality, setQuality] = useState<ImageQualityReport | null>(null);
  const [validation, setValidation] = useState<TextileValidationResult | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<'validating' | 'matching' | null>(null);
  const [error, setError] = useState('');
  const [research, setResearch] = useState(false);
  const { favorites, toggle, isFavorite } = useFavorites();
  const lastInitialRef = useRef<TextileImage | null>(null);

  useEffect(() => {
    if (!initialImage) return;
    if (lastInitialRef.current === initialImage) return;
    lastInitialRef.current = initialImage;

    setResult(null);
    setValidation(null);
    setQuality(null);
    setError('');

    fetch(initialImage.src)
      .then((r) => r.blob())
      .then((blob) => {
        const mimeType = blob.type || 'image/jpeg';
        const file = new File([blob], initialImage.fileName, { type: mimeType });
        const reader = new FileReader();
        reader.onload = () => {
          const src = String(reader.result);
          const uploaded: UploadedImage = {
            id: `${initialImage.id}-${Date.now()}`,
            file,
            src,
            inferredCategory: initialImage.category,
          };
          setImage(uploaded);
          analyzeImageQuality(file, src).then(setQuality);
        };
        reader.readAsDataURL(file);
      })
      .catch(() => {
        const syntheticFile = new File([], initialImage.fileName, { type: 'image/jpeg' });
        const uploaded: UploadedImage = {
          id: `${initialImage.id}-${Date.now()}`,
          file: syntheticFile,
          src: initialImage.src,
          inferredCategory: initialImage.category,
        };
        setImage(uploaded);
        analyzeImageQuality(syntheticFile, initialImage.src).then(setQuality);
      });

    onFindSimilarConsumed?.();
  }, [initialImage, onFindSimilarConsumed]);

  const handleImageChange = async (img: UploadedImage | null) => {
    setImage(img);
    setResult(null);
    setValidation(null);
    setQuality(null);
    setError('');
    if (img) {
      const report = await analyzeImageQuality(img.file, img.src);
      setQuality(report);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setValidation(null);
    setQuality(null);
    setError('');
    lastInitialRef.current = null;
  };

  const handleFindSimilar = async (galleryImage: TextileImage) => {
    setResult(null);
    setValidation(null);
    setQuality(null);
    setError('');
    lastInitialRef.current = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const blob = await fetch(galleryImage.src).then((r) => r.blob());
      const mimeType = blob.type || 'image/jpeg';
      const file = new File([blob], galleryImage.fileName, { type: mimeType });
      const reader = new FileReader();
      reader.onload = () => {
        const src = String(reader.result);
        const uploaded: UploadedImage = {
          id: `${galleryImage.id}-${Date.now()}`,
          file,
          src,
          inferredCategory: inferCategoryFromName(galleryImage.fileName),
        };
        setImage(uploaded);
        analyzeImageQuality(file, src).then(setQuality);
      };
      reader.readAsDataURL(file);
    } catch {
      const syntheticFile = new File([], galleryImage.fileName, { type: 'image/jpeg' });
      const uploaded: UploadedImage = {
        id: `${galleryImage.id}-${Date.now()}`,
        file: syntheticFile,
        src: galleryImage.src,
        inferredCategory: inferCategoryFromName(galleryImage.fileName),
      };
      setImage(uploaded);
      analyzeImageQuality(syntheticFile, galleryImage.src).then(setQuality);
    }
  };

  const analyze = async () => {
    if (!image) {
      setError('Upload an image before analyzing.');
      return;
    }

    setError('');
    setResult(null);
    setValidation(null);
    setProcessing(true);

    // ── STAGE 1: Textile Gate ──────────────────────────────────────────────
    setProcessingStep('validating');
    const gate = await validateImage(image.src);
    setValidation(gate);

    // Poor quality — stop here
    if (gate.status === 'poor_quality') {
      setProcessing(false);
      setProcessingStep(null);
      return;
    }

    // Not textile — stop here, do NOT run gallery matching
    if (gate.status === 'not_textile') {
      setProcessing(false);
      setProcessingStep(null);
      return;
    }

    // ── STAGE 2: Gallery Matching (textile or uncertain) ───────────────────
    setProcessingStep('matching');
    const prediction = await predictDesign(image);
    setResult(prediction);

    setProcessing(false);
    setProcessingStep(null);
  };

  // Determine which result state to show
  const showNotTextile = validation?.status === 'not_textile';
  const showPoorQuality = validation?.status === 'poor_quality';
  const showTextileNoMatch =
    result !== null &&
    (validation?.status === 'textile' || validation?.status === 'uncertain') &&
    result.similarity < GALLERY_MATCH_THRESHOLD;
  const showTextileMatch =
    result !== null &&
    (validation?.status === 'textile' || validation?.status === 'uncertain') &&
    result.similarity >= GALLERY_MATCH_THRESHOLD;

  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="Prototype Demonstration"
        title="Upload a textile or saree image"
        copy="The system first checks whether the image is a textile, then searches the design gallery for similar patterns."
      />

      <section className="mx-auto mt-10 grid max-w-5xl gap-6">
        <ImageUploader label="Upload a textile or saree image" image={image} onChange={handleImageChange} />
        {quality ? <ImageQualityPanel report={quality} /> : null}
        {error ? <ErrorState message={error} /> : null}
        <button className="btn btn-primary w-full justify-center" onClick={analyze} disabled={processing}>
          Analyze Design
        </button>
      </section>

      <section className="mx-auto mt-10 max-w-6xl space-y-6">

        {/* Processing states */}
        {processing && processingStep === 'validating' ? (
          <ProcessingAnimation label="Stage 1 — Checking if this is a textile image…" />
        ) : null}
        {processing && processingStep === 'matching' ? (
          <ProcessingAnimation label="Stage 2 — Searching design gallery…" />
        ) : null}

        {/* STATE 3 — Not a textile */}
        {showNotTextile ? (
          <NotTextileState onReset={handleReset} reason={validation?.reason} />
        ) : null}

        {/* Poor quality */}
        {showPoorQuality ? (
          <div className="rounded border border-amber-300 bg-amber-50 p-6 shadow-soft" role="alert">
            <p className="text-xl font-bold text-amber-800">⚠ Image Quality Too Low</p>
            <p className="mt-2 text-sm text-amber-900">{validation?.reason}</p>
            <p className="mt-3 text-sm text-amber-800">
              Please upload a clearer, higher-resolution image of the textile.
            </p>
            <button className="btn btn-ghost mt-4" onClick={handleReset}>
              Upload Another Image
            </button>
          </div>
        ) : null}

        {/* STATE 2 — Textile detected, no strong gallery match */}
        {showTextileNoMatch && result && validation ? (
          <div className="space-y-4">
            <TextileGateBadge validation={validation} />
            <NoMatchState similarity={result.similarity} />
          </div>
        ) : null}

        {/* STATE 1 — Textile detected + strong gallery match */}
        {showTextileMatch && result && validation ? (
          <div className="space-y-8">
            <div className="rounded border border-gold/25 bg-white p-6 shadow-soft">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="section-eyebrow">Design Analysis</p>
                  <TextileGateBadge validation={validation} />
                </div>
                <ViewToggle research={research} onChange={setResearch} />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <p className="text-sm text-ink/55">Category</p>
                  <p className="text-2xl font-semibold text-ink">{result.category}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">Demo / Prototype Result</p>
                </div>
                <div className="md:col-span-2">
                  <SimilarityMeter value={result.similarity} label="Demo similarity" />
                  <p className="mt-3 text-sm text-ink/65">Match Strength: {result.strength}</p>

                  {research ? (
                    <div className="mt-4 rounded border border-ink/10 bg-ivory p-3 text-sm text-ink/70">
                      <p className="mb-2 font-semibold text-ink">Research Details</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <span>Similarity score</span>
                        <span className="font-mono">{result.similarity.toFixed(4)}</span>
                        <span>Gallery threshold</span>
                        <span className="font-mono">{GALLERY_MATCH_THRESHOLD.toFixed(2)} (prototype)</span>
                        <span>Textile score</span>
                        <span className="font-mono">{validation.confidence.toFixed(3)} (prototype)</span>
                        <span>Texture score</span>
                        <span className="font-mono">{validation.textureScore.toFixed(3)}</span>
                        <span>Edge score</span>
                        <span className="font-mono">{validation.edgeScore.toFixed(3)}</span>
                        <span>Pattern score</span>
                        <span className="font-mono">{validation.patternScore.toFixed(3)}</span>
                        <span>Category signal</span>
                        <span>{result.category}</span>
                        <span>Model</span>
                        <span className="text-ink/40">Not connected</span>
                        <span>Retrieval</span>
                        <span className="text-ink/40">Deterministic demo</span>
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
        ) : null}
      </section>
    </div>
  );
}
