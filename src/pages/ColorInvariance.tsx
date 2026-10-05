import { useMemo, useRef, useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { SectionTitle } from '../components/SectionTitle';
import { SimilarityMeter } from '../components/SimilarityMeter';
import { galleryImages } from '../data/gallery';
import type { UploadedImage } from '../types';

export function ColorInvariance() {
  const [upload, setUpload] = useState<UploadedImage | null>(null);
  const fallbackImage = galleryImages[0]?.src;
  const src = upload?.src ?? fallbackImage;

  const caption = useMemo(() => {
    if (upload) return upload.file.name;
    if (fallbackImage) return 'Local dataset sample';
    return 'Upload an image to create the comparison';
  }, [fallbackImage, upload]);

  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="Signature Concept"
        title="Same Pattern. Different Palette."
        copy="The goal of color-invariant recognition is to focus on pattern, structure and texture rather than depending mainly on color."
      />

      <section className="mx-auto mt-8 max-w-3xl rounded border border-gold/25 bg-white/90 p-5 shadow-soft">
        <p className="text-sm leading-7 text-ink/70">
          <span className="font-semibold text-ink">Core idea: </span>
          The same Banarasi weave looks different in red, blue, or green — but the underlying motif structure is
          identical. A color-invariant model recognizes the pattern regardless of the palette.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-5xl">
        <ImageUploader label="Upload an image for color-invariance demo" image={upload} onChange={setUpload} />
      </section>

      <section className="mx-auto mt-10 max-w-7xl">
        {src ? (
          <>
            {/* Variant grid */}
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              <VariantCard title="Original" src={src} caption={caption} step="1" />
              <VariantCard title="Color Changed" src={src} className="variant-hue" caption="Palette shifted" step="2" />
              <VariantCard title="Grayscale" src={src} className="variant-gray" caption="Color removed" step="3" />
              <VariantCard title="Brightness Adjusted" src={src} className="variant-bright" caption="Lightness changed" step="4" />
            </div>

            {/* Before/After slider */}
            <div className="mt-10">
              <p className="section-eyebrow mb-4">Before / After Slider</p>
              <BeforeAfterSlider src={src} />
            </div>

            <div className="mt-8 rounded border border-gold/25 bg-white p-6 shadow-soft">
              <p className="section-eyebrow">Visual Similarity (Demo)</p>
              <SimilarityMeter value={0.89} label="Demo similarity" />
              <p className="mt-3 text-sm text-ink/65">
                This page demonstrates the concept only and does not report measured ML performance.
                Values shown are fixed for illustration purposes.
              </p>
            </div>
          </>
        ) : (
          <div className="rounded border border-gold/25 bg-white p-6 text-center shadow-soft">
            <p className="font-serif text-2xl text-ink">Upload a textile image to view palette transformations.</p>
          </div>
        )}
      </section>
    </div>
  );
}

interface VariantCardProps {
  title: string;
  src: string;
  caption: string;
  className?: string;
  step: string;
}

function VariantCard({ title, src, caption, className = '', step }: VariantCardProps) {
  return (
    <article className="card overflow-hidden">
      <div className="relative">
        <img src={src} alt={`${title} textile variant`} className={`h-64 w-full object-cover ${className}`} />
        <span className="absolute top-2 left-2 rounded bg-ink/70 px-2 py-0.5 text-xs font-bold text-ivory">
          {step}
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink/60">{caption}</p>
      </div>
    </article>
  );
}

function BeforeAfterSlider({ src }: { src: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-72 w-full overflow-hidden rounded border border-ink/10 cursor-col-resize select-none"
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0]!.clientX)}
      role="img"
      aria-label="Before and after color comparison slider"
    >
      {/* After (grayscale) — full width underneath */}
      <img src={src} alt="Grayscale variant" className="variant-gray absolute inset-0 h-full w-full object-cover" />

      {/* Before (original) — clipped to slider position */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={src} alt="Original color variant" className="h-full w-full object-cover" style={{ width: containerRef.current?.offsetWidth ?? '100%' }} />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center text-ink text-xs font-bold">
          ↔
        </div>
      </div>

      {/* Labels */}
      <span className="absolute bottom-2 left-2 rounded bg-ink/60 px-2 py-0.5 text-xs text-ivory pointer-events-none">Original</span>
      <span className="absolute bottom-2 right-2 rounded bg-ink/60 px-2 py-0.5 text-xs text-ivory pointer-events-none">Grayscale</span>
    </div>
  );
}
