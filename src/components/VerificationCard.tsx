import type { UploadedImage, VerificationResult } from '../types';
import { SimilarityMeter } from './SimilarityMeter';

interface VerificationCardProps {
  result: VerificationResult;
  imageA?: UploadedImage | null;
  imageB?: UploadedImage | null;
  researchView?: boolean;
}

export function VerificationCard({ result, imageA, imageB, researchView = false }: VerificationCardProps) {
  const borderColor = result.sameDesign ? 'border-green-300' : 'border-red-300';
  const bgColor = result.sameDesign ? 'bg-green-50' : 'bg-red-50';
  const textColor = result.sameDesign ? 'text-green-800' : 'text-red-800';

  const bullets = result.sameDesign
    ? ['Similar visual structure detected', 'Similar repeating pattern signal', 'Similar texture characteristics']
    : ['Different category or pattern signal', 'Low visual overlap between the two images', 'Distinct structural characteristics'];

  return (
    <section className={`rounded border ${borderColor} ${bgColor} p-6 shadow-soft space-y-6`}>
      {/* Side-by-side preview */}
      {imageA && imageB ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Image A</p>
            <img
              src={imageA.src}
              alt={`Image A: ${imageA.file.name}`}
              className="h-40 w-full rounded object-cover border border-ink/10"
            />
            <p className="text-xs text-ink/55 truncate">{imageA.file.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Image B</p>
            <img
              src={imageB.src}
              alt={`Image B: ${imageB.file.name}`}
              className="h-40 w-full rounded object-cover border border-ink/10"
            />
            <p className="text-xs text-ink/55 truncate">{imageB.file.name}</p>
          </div>
        </div>
      ) : null}

      {/* Verdict */}
      <div>
        <p className={`text-2xl font-bold ${textColor}`}>
          {result.sameDesign ? 'SAME DESIGN' : 'DIFFERENT DESIGN'}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
          Demo / Prototype Result
        </p>
      </div>

      {/* Similarity meter */}
      <SimilarityMeter value={result.similarity} label="Demo similarity" />

      {/* Explanation bullets */}
      <div className="rounded bg-white/80 p-4 text-sm text-ink/70 space-y-1">
        <p className="font-semibold text-ink mb-2">Why this result:</p>
        <ul className="space-y-1">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-gold shrink-0">•</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink/50 italic">
          Color differences are treated separately from the visual-pattern comparison.
        </p>
      </div>

      {/* Research view extras */}
      {researchView ? (
        <div className="rounded border border-ink/10 bg-white/70 p-4 text-sm space-y-2">
          <p className="font-semibold text-ink section-eyebrow">Research Details</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-ink/70">
            <span>Similarity score</span><span className="font-mono">{result.similarity.toFixed(4)}</span>
            <span>Threshold</span><span className="font-mono">{result.threshold.toFixed(2)}</span>
            <span>Decision</span><span>{result.sameDesign ? 'Match' : 'No match'}</span>
            <span>Model</span><span className="text-ink/40">Not connected</span>
            <span>Embedding dim</span><span className="text-ink/40">N/A (prototype)</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
