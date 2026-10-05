import { useMemo, useState } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { GalleryCard } from '../components/GalleryCard';
import { ImageViewer } from '../components/ImageViewer';
import { SectionTitle } from '../components/SectionTitle';
import { galleryImages, hasLocalDataset } from '../data/gallery';
import type { TextileCategory, TextileImage } from '../types';

export function Gallery() {
  const [category, setCategory] = useState<TextileCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [viewerImage, setViewerImage] = useState<TextileImage | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return galleryImages.filter((image) => {
      const categoryMatch = category === 'All' || image.category === category;
      const searchMatch =
        !normalized ||
        image.category.toLowerCase().includes(normalized) ||
        image.fileName.toLowerCase().includes(normalized);

      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="Local Dataset"
        title="Explore Indian Textile Patterns"
        copy="Filter and inspect actual dataset images loaded from the project folders."
      />

      <section className="mx-auto mt-10 max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CategoryFilter active={category} onChange={setCategory} />
          <label className="min-w-0 md:w-80">
            <span className="sr-only">Search gallery</span>
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Banarasi, Bandhani, Ikat, Pichwai"
            />
          </label>
        </div>

        {!hasLocalDataset ? (
          <div className="mt-8 rounded border border-gold/25 bg-white p-6 text-center shadow-soft">
            <p className="font-serif text-2xl text-ink">No local dataset images found.</p>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              Place images in <span className="font-mono">src/assets/dataset/Banarasi</span>,{' '}
              <span className="font-mono">Bandhani</span>, <span className="font-mono">Ikat</span>, and{' '}
              <span className="font-mono">Pichwai</span> to populate this gallery.
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((image) => (
              <GalleryCard key={image.id} image={image} onView={setViewerImage} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded border border-ink/10 bg-white p-6 text-center text-ink/65 shadow-soft">
            No designs found
          </div>
        )}
      </section>

      <ImageViewer image={viewerImage} onClose={() => setViewerImage(null)} />
    </div>
  );
}
