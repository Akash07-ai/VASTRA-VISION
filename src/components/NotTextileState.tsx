interface NotTextileStateProps {
  onReset: () => void;
  reason?: string;
}

export function NotTextileState({ onReset, reason }: NotTextileStateProps) {
  return (
    <div className="rounded border border-red-300 bg-red-50 p-6 shadow-soft space-y-4" role="alert">
      <div>
        <p className="text-xl font-bold text-red-800">✕ Image Not Supported</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-500">
          Prototype Validation — Gallery matching was skipped
        </p>
      </div>

      <p className="text-sm text-red-900 leading-6">
        This image does not appear to contain a saree or textile pattern.
        {reason ? ` ${reason}` : ''}
      </p>

      <div className="rounded bg-white/70 p-4 text-sm text-red-900">
        <p className="font-semibold mb-2">Please upload a clear image of:</p>
        <ul className="space-y-1">
          {['Saree', 'Fabric', 'Textile pattern', 'Cloth design', 'Woven or printed textile'].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-green-600 font-bold shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button className="btn btn-ghost w-full justify-center" onClick={onReset}>
        Upload Another Image
      </button>
    </div>
  );
}
