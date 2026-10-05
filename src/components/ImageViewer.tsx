import { useEffect } from 'react';
import type { TextileImage } from '../types';
import { FavoriteButton } from './FavoriteButton';

interface ImageViewerProps {
  image: TextileImage | null;
  onClose: () => void;
  onFindSimilar?: (image: TextileImage) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function ImageViewer({ image, onClose, onFindSimilar, isFavorite = false, onToggleFavorite }: ImageViewerProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${image.category} textile`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded bg-ivory shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 p-4">
          <div>
            <p className="font-semibold text-ink">{image.category}</p>
            <p className="text-sm text-ink/60">{image.fileName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {onFindSimilar ? (
              <button
                className="btn btn-ghost text-sm"
                onClick={() => { onFindSimilar(image); onClose(); }}
              >
                Find Similar
              </button>
            ) : null}
            {onToggleFavorite ? (
              <FavoriteButton id={image.id} isFavorite={isFavorite} onToggle={onToggleFavorite} />
            ) : null}
            <button className="btn btn-ghost" onClick={onClose} aria-label="Close image viewer">
              Close
            </button>
          </div>
        </div>
        <img
          src={image.src}
          alt={`${image.category} textile design enlarged`}
          className="max-h-[75vh] w-full object-contain"
        />
      </div>
    </div>
  );
}
