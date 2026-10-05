import { useMemo, useState } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { GalleryCard } from '../components/GalleryCard';
import { ImageViewer } from '../components/ImageViewer';
import { SectionTitle } from '../components/SectionTitle';
import { galleryImages, hasLocalDataset } from '../data/gallery';
import type { PageKey, TextileCategory, TextileImage } from '../types';
import { useFavorites } from '../utils/favorites';

interface GalleryProps {
  navigate?: (page: PageKey) => void;
  onFindSimilar?: (image: TextileImage) => void;
}

export function Gallery({ onFindSimilar }: GalleryProps) {
  const [category, setCategory] = useState<TextileCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [viewerImage, setViewerImage] = useState<TextileImage | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const { favorites, toggle, isFavorite } = useFavorites();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return galleryImages.filter((image) => {
      const categoryMatch = category === 'All' || image.category === category;
      const searchMatch =
        !normalized ||
        image.category.toLowerCase().includes(normalized) ||
        image.fileName.toLowerCase().includes(normalized);
      const savedMatch = !showSaved || isFavorite(image.id);
      return categoryMatch && searchMatch && savedMatch;
    });
  }, [category, query, showSaved, isFavorite]);

  const savedCount = favorites.size;

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

        {/* Saved filter toggle */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className={`chip text-sm ${showSaved ? 'chip-active' : ''}`}
            onClick={() => setShowSaved((v) => !v)}
            aria-pressed={showSaved}
          >
            ♥ Saved Designs {savedCount > 0 ? `(${savedCount})` : ''}
          </button>
          {showSaved && savedCount === 0 ? (
            <p className="text-sm text-ink/55">No saved designs yet. Click ♡ Save on any image.</p>
          ) : null}
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
              <GalleryCard
                key={image.id}
                image={image}
                onView={setViewerImage}
                onFindSimilar={onFindSimilar}
                isFavorite={isFavorite(image.id)}
                onToggleFavorite={toggle}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded border border-ink/10 bg-white p-6 text-center text-ink/65 shadow-soft">
            {showSaved ? 'No saved designs match this filter.' : 'No designs found matching your search.'}
          </div>
        )}
      </section>

      <ImageViewer
        image={viewerImage}
        onClose={() => setViewerImage(null)}
        onFindSimilar={onFindSimilar}
        isFavorite={viewerImage ? isFavorite(viewerImage.id) : false}
        onToggleFavorite={toggle}
      />
    </div>
  );
}
