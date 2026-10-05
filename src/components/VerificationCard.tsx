import type { VerificationResult } from '../types';
import { SimilarityMeter } from './SimilarityMeter';

export function VerificationCard({ result }: { result: VerificationResult }) {
  return (
    <section className={`rounded border p-6 shadow-soft ${result.sameDesign ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
      <p className={`text-2xl font-bold ${result.sameDesign ? 'text-green-800' : 'text-red-800'}`}>
        {result.sameDesign ? 'SAME DESIGN' : 'DIFFERENT DESIGN'}
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SimilarityMeter value={result.similarity} />
        <div className="rounded bg-white/80 p-4 text-sm text-ink/70">
          <p className="font-semibold text-ink">Threshold: {result.threshold.toFixed(2)}</p>
          <p className="mt-2">{result.explanation}</p>
        </div>
      </div>
    </section>
  );
}
