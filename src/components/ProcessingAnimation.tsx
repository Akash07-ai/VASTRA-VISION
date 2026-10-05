import { useEffect, useState } from 'react';

const defaultSteps = [
  'Reading textile pattern…',
  'Extracting visual features…',
  'Searching design gallery…',
];

interface ProcessingAnimationProps {
  label?: string;
}

export function ProcessingAnimation({ label }: ProcessingAnimationProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((v) => (v + 1) % defaultSteps.length), 650);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rounded border border-gold/25 bg-white p-5 shadow-soft" aria-live="polite">
      <div className="mb-4 h-1 overflow-hidden rounded bg-gold/15">
        <div className="h-full w-2/3 animate-pulse rounded bg-gold" />
      </div>
      <p className="font-medium text-ink">{label ?? defaultSteps[index]}</p>
      <p className="mt-1 text-sm text-ink/60">Prototype demonstration using deterministic local logic.</p>
    </div>
  );
}
