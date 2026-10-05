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

const maxSize = 8 * 1024 * 1024;
const supported = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({ label, image, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const processFile = (file?: File) => {
    setError('');

    if (!file) {
      setError('Please choose an image before continuing.');
      return;
    }

    if (!supported.includes(file.type)) {
      setError('Unsupported image. Please use JPG, JPEG, PNG, or WEBP.');
      return;
    }

    if (file.size > maxSize) {
      setError('Image is too large. Please use an image under 8 MB.');
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
        >
          <span className="block font-serif text-2xl text-ink">{label}</span>
          <span className="mt-3 block text-sm text-ink/60">Drag & Drop or Browse Image</span>
          <span className="mt-2 block text-xs uppercase tracking-wide text-gold">JPG, JPEG, PNG, WEBP up to 8 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => processFile(event.target.files?.[0])}
      />
      {error ? <ErrorState message={error} /> : null}
    </div>
  );
}
