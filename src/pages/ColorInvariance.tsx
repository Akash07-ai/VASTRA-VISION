import { useMemo, useState } from 'react';
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

      <section className="mx-auto mt-10 max-w-5xl">
        <ImageUploader label="Upload an image for color-invariance demo" image={upload} onChange={setUpload} />
      </section>

      <section className="mx-auto mt-10 max-w-7xl">
        {src ? (
          <>
            <div className="grid gap-5 md:grid-cols-4">
              <VariantCard title="Original" src={src} caption={caption} />
              <VariantCard title="Color Changed" src={src} className="variant-hue" caption="Palette shifted" />
              <VariantCard title="Grayscale" src={src} className="variant-gray" caption="Color removed" />
              <VariantCard title="Brightness Adjusted" src={src} className="variant-bright" caption="Lightness changed" />
            </div>
            <div className="mt-8 rounded border border-gold/25 bg-white p-6 shadow-soft">
              <p className="section-eyebrow">Visual Similarity</p>
              <SimilarityMeter value={0.89} label="Demo similarity" />
              <p className="mt-3 text-sm text-ink/65">
                High similarity. This page demonstrates the concept only and does not report measured ML performance.
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
}

function VariantCard({ title, src, caption, className = '' }: VariantCardProps) {
  return (
    <article className="card overflow-hidden">
      <img src={src} alt={`${title} textile variant`} className={`h-72 w-full object-cover ${className}`} />
      <div className="p-4">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink/60">{caption}</p>
      </div>
    </article>
  );
}
