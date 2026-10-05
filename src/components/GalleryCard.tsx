import type { TextileImage } from '../types';
import { FavoriteButton } from './FavoriteButton';

interface GalleryCardProps {
  image: TextileImage;
  onView: (image: TextileImage) => void;
  onFindSimilar?: (image: TextileImage) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function GalleryCard({ image, onView, onFindSimilar, isFavorite = false, onToggleFavorite }: GalleryCardProps) {
  return (
    <article className="card group overflow-hidden">
      <button
        type="button"
        className="block w-full overflow-hidden focus-ring"
        onClick={() => onView(image)}
        aria-label={`View ${image.category} textile pattern`}
      >
        <img
          src={image.src}
          alt={`${image.category} textile pattern`}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </button>
      <div className="p-4">
        <p className="font-semibold text-ink">{image.category}</p>
        <p className="mt-0.5 text-sm text-ink/60 truncate">{image.fileName}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn btn-ghost text-sm" onClick={() => onView(image)}>
            View
          </button>
          {onFindSimilar ? (
            <button
              className="btn btn-ghost text-sm"
              onClick={() => onFindSimilar(image)}
              aria-label={`Find designs similar to this ${image.category}`}
            >
              Find Similar
            </button>
          ) : null}
          {onToggleFavorite ? (
            <FavoriteButton id={image.id} isFavorite={isFavorite} onToggle={onToggleFavorite} />
          ) : null}
        </div>
      </div>
    </article>
  );
}
