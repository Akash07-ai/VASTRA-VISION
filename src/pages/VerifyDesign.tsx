import { useState } from 'react';
import { ErrorState } from '../components/ErrorState';
import { ImageUploader } from '../components/ImageUploader';
import { ProcessingAnimation } from '../components/ProcessingAnimation';
import { SectionTitle } from '../components/SectionTitle';
import { VerificationCard } from '../components/VerificationCard';
import { ViewToggle } from '../components/ViewToggle';
import { verifyDesign } from '../services/visionService';
import type { UploadedImage, VerificationResult } from '../types';

export function VerifyDesign() {
  const [imageA, setImageA] = useState<UploadedImage | null>(null);
  const [imageB, setImageB] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [research, setResearch] = useState(false);

  const compare = async () => {
    if (!imageA || !imageB) {
      setError('Upload both Image A and Image B before comparing.');
      return;
    }
    setError('');
    setResult(null);
    setProcessing(true);
    const comparison = await verifyDesign(imageA, imageB);
    setResult(comparison);
    setProcessing(false);
  };

  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="Prototype Demonstration"
        title="Do these two designs match?"
        copy="Compare two uploaded textiles using deterministic category and filename signals until a real model is connected."
      />

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
        <ImageUploader label="IMAGE A" image={imageA} onChange={setImageA} />
        <ImageUploader label="IMAGE B" image={imageB} onChange={setImageB} />
      </section>

      <section className="mx-auto mt-8 max-w-6xl space-y-6">
        {error ? <ErrorState message={error} /> : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <button className="btn btn-primary" onClick={compare} disabled={processing}>
            Compare Designs
          </button>
          {result ? <ViewToggle research={research} onChange={setResearch} /> : null}
        </div>

        {processing ? <ProcessingAnimation /> : null}
        {result ? (
          <VerificationCard
            result={result}
            imageA={imageA}
            imageB={imageB}
            researchView={research}
          />
        ) : null}
      </section>
    </div>
  );
}
