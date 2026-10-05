interface SimilarityMeterProps {
  value: number;
  label?: string;
}

export function SimilarityMeter({ value, label = 'Demo similarity' }: SimilarityMeterProps) {
  const percentage = Math.round(value * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-ink/70">{value.toFixed(2)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded bg-ink/10" aria-label={`${label}: ${percentage}%`}>
        <div className="h-full rounded bg-gold transition-all duration-700" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
