interface ViewToggleProps {
  research: boolean;
  onChange: (research: boolean) => void;
}

export function ViewToggle({ research, onChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex rounded border border-ink/15 overflow-hidden text-sm font-semibold"
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        className={`px-4 py-2 transition-colors ${!research ? 'bg-ink text-ivory' : 'bg-white text-ink/60 hover:text-ink'}`}
        onClick={() => onChange(false)}
        aria-pressed={!research}
      >
        Simple View
      </button>
      <button
        type="button"
        className={`px-4 py-2 transition-colors ${research ? 'bg-ink text-ivory' : 'bg-white text-ink/60 hover:text-ink'}`}
        onClick={() => onChange(true)}
        aria-pressed={research}
      >
        Research View
      </button>
    </div>
  );
}
