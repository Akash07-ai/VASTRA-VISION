import type { TextileImage } from '../types';

interface GalleryCardProps {
  image: TextileImage;
  onView: (image: TextileImage) => void;
}

export function GalleryCard({ image, onView }: GalleryCardProps) {
  return (
    <article className="card group overflow-hidden">
      <img
        src={image.src}
        alt={`${image.category} textile pattern`}
        className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="p-4">
        <p className="font-semibold text-ink">{image.category}</p>
        <p className="mt-1 text-sm text-ink/60">{image.description}</p>
        <button className="btn btn-ghost mt-4" onClick={() => onView(image)}>
          View
        </button>
      </div>
    </article>
  );
}
