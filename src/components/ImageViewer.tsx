import { useEffect } from 'react';
import type { TextileImage } from '../types';

interface ImageViewerProps {
  image: TextileImage | null;
  onClose: () => void;
}

export function ImageViewer({ image, onClose }: ImageViewerProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded bg-ivory shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 p-4">
          <div>
            <p className="font-semibold text-ink">{image.category}</p>
            <p className="text-sm text-ink/60">{image.fileName}</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <img src={image.src} alt={`${image.category} textile design enlarged`} className="max-h-[75vh] w-full object-contain" />
      </div>
    </div>
  );
}
