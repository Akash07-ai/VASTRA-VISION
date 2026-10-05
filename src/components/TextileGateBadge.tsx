import type { TextileValidationResult } from '../utils/textileGate';

interface TextileGateBadgeProps {
  validation: TextileValidationResult;
}

export function TextileGateBadge({ validation }: TextileGateBadgeProps) {
  const isUncertain = validation.status === 'uncertain';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-semibold ${
        isUncertain
          ? 'border-amber-300 bg-amber-50 text-amber-800'
          : 'border-green-300 bg-green-50 text-green-800'
      }`}
      title="Prototype validation — not a trained ML model"
    >
      <span aria-hidden="true">{isUncertain ? '⚠' : '✓'}</span>
      {isUncertain ? 'Textile signal weak — result may be unreliable' : 'Textile image detected'}
      <span className="ml-1 font-normal opacity-60">(prototype)</span>
    </div>
  );
}
