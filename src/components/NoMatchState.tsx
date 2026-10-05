interface NoMatchStateProps {
  similarity: number;
}

export function NoMatchState({ similarity }: NoMatchStateProps) {
  return (
    <div className="rounded border border-amber-300 bg-amber-50 p-6 shadow-soft">
      <p className="text-xl font-bold text-amber-800">No strong visual match found.</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
        Demo similarity: {similarity.toFixed(2)} — below confidence threshold
      </p>
      <ul className="mt-4 space-y-1.5 text-sm text-amber-900">
        {[
          'Upload a clearer, sharper image',
          'Crop closer to the textile pattern',
          'Avoid large background areas',
          'Use a well-lit, evenly exposed image',
        ].map((tip) => (
          <li key={tip} className="flex gap-2">
            <span aria-hidden="true">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
