import type { UploadedImage } from '../types';

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: () => void;
}

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  return (
    <div className="overflow-hidden rounded border border-ink/10 bg-white shadow-soft">
      <img src={image.src} alt={`Preview of ${image.file.name}`} className="h-64 w-full object-cover" />
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{image.file.name}</p>
          <p className="text-xs text-ink/55">Demo category signal: {image.inferredCategory}</p>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}
