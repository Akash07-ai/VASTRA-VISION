import { useRef, useState } from 'react';
import type { UploadedImage } from '../types';
import { inferCategoryFromName } from '../utils/demoLogic';
import { ErrorState } from './ErrorState';
import { ImagePreview } from './ImagePreview';

interface ImageUploaderProps {
  label: string;
  image: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
}

const maxSize = 12 * 1024 * 1024; // raised to 12 MB

// All common image MIME types browsers can display
const supported = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/avif',
  'image/heic',
  'image/heif',
];

// Accept string for the file input element
const acceptAttr = 'image/*';

export function ImageUploader({ label, image, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const processFile = (file?: File) => {
    setError('');

    if (!file) {
      setError('Please choose an image file before continuing.');
      return;
    }

    // Accept any image/* type — browsers report MIME correctly for all common formats
    const isImage = file.type.startsWith('image/') || supported.includes(file.type);
    if (!isImage) {
      setError('Please upload an image file (JPG, PNG, WEBP, AVIF, BMP, GIF, TIFF, etc.).');
      return;
    }

    if (file.size > maxSize) {
      setError('Image is too large. Please use an image under 12 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        id: `${file.name}-${file.lastModified}`,
        file,
        src: String(reader.result),
        inferredCategory: inferCategoryFromName(file.name),
      });
    };
    reader.onerror = () => setError('The image could not be loaded. Please try another file.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {image ? (
        <ImagePreview image={image} onRemove={() => onChange(null)} />
      ) : (
        <button
          type="button"
          className={`upload-zone ${dragging ? 'upload-zone-active' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            processFile(event.dataTransfer.files[0]);
          }}
          aria-label={`${label} — click or drag an image to upload`}
        >
          <span className="block font-serif text-2xl text-ink">{label}</span>
          <span className="mt-3 block text-sm text-ink/60">Drag & Drop or Browse Image</span>
          <span className="mt-2 block text-xs uppercase tracking-wide text-gold">
            Any image format · JPG, PNG, WEBP, AVIF, BMP, GIF · up to 12 MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={acceptAttr}
        onChange={(event) => processFile(event.target.files?.[0])}
      />
      {error ? <ErrorState message={error} /> : null}
    </div>
  );
}
