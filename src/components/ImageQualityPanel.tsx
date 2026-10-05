import type { ImageQualityReport } from '../utils/imageQuality';

interface ImageQualityPanelProps {
  report: ImageQualityReport;
}

type Status = 'Good' | 'Low' | 'Very Low' | 'Dark' | 'Overexposed' | 'Moderate' | 'Blurry';

function statusIcon(status: Status | string): string {
  if (status === 'Good') return '✓';
  if (status === 'Very Low' || status === 'Blurry') return '✗';
  return '⚠';
}

function statusColor(status: Status | string): string {
  if (status === 'Good') return 'text-green-700';
  if (status === 'Very Low' || status === 'Blurry') return 'text-red-700';
  return 'text-amber-700';
}

interface RowProps {
  label: string;
  value: string;
  status: string;
}

function Row({ label, value, status }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-ink/60 w-28 shrink-0">{label}</span>
      <span className="flex-1 text-ink font-medium">{value}</span>
      <span className={`font-semibold ${statusColor(status)}`}>
        {statusIcon(status)} {status}
      </span>
    </div>
  );
}

export function ImageQualityPanel({ report }: ImageQualityPanelProps) {
  return (
    <aside
      className="rounded border border-gold/25 bg-white/90 p-4 shadow-soft"
      aria-label="Image quality report"
    >
      <p className="section-eyebrow mb-3">Image Quality</p>
      <div className="divide-y divide-ink/8">
        <Row
          label="Resolution"
          value={report.width > 0 ? `${report.width} × ${report.height}` : '—'}
          status={report.resolutionLabel}
        />
        <Row label="Format" value={report.format} status="Good" />
        <Row label="Brightness" value="" status={report.brightnessLabel} />
        <Row label="Sharpness" value="" status={report.sharpnessLabel} />
      </div>
      {report.tip ? (
        <p className="mt-3 rounded bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 leading-5">
          <span className="font-semibold">Tip: </span>{report.tip}
        </p>
      ) : null}
    </aside>
  );
}
