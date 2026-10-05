import { useState } from 'react';
import { ErrorState } from '../components/ErrorState';
import { ImageUploader } from '../components/ImageUploader';
import { MatchGrid } from '../components/MatchGrid';
import { ProcessingAnimation } from '../components/ProcessingAnimation';
import { SectionTitle } from '../components/SectionTitle';
import { SimilarityMeter } from '../components/SimilarityMeter';
import { predictDesign } from '../services/visionService';
import type { PredictionResult, UploadedImage } from '../types';

export function IdentifyDesign() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="Prototype Demonstration"
        title="Upload a saree or fabric image"
        copy="Analyze visual design signals and retrieve deterministic demo matches from the local gallery when images are available."
      />

      <section className="mx-auto mt-10 grid max-w-5xl gap-6">
        <ImageUploader label="Upload a saree or fabric image" image={image} onChange={setImage} />
        {error ? <ErrorState message={error} /> : null}
        <button className="btn btn-primary justify-center" onClick={analyze} disabled={processing}>
          Analyze Design
        </button>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        {processing ? <ProcessingAnimation /> : null}
        {result ? (
          <div className="space-y-8">
            <div className="rounded border border-gold/25 bg-white p-6 shadow-soft">
              <p className="section-eyebrow">Design Analysis</p>
              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <div>
                  <p className="text-sm text-ink/55">Category</p>
                  <p className="text-2xl font-semibold text-ink">{result.category}</p>
                </div>
                <div className="md:col-span-2">
                  <SimilarityMeter value={result.similarity} label="Demo similarity" />
                  <p className="mt-3 text-sm text-ink/65">Match Strength: {result.strength}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold text-ink">Top Similar Designs</h2>
              <p className="mt-2 text-sm text-ink/60">Demo ranking is deterministic and not a trained ML prediction.</p>
              <div className="mt-5">
                <MatchGrid matches={result.matches} />
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
