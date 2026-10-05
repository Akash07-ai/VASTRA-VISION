import type { TextileCategory, TextileImage } from '../types';

export const categories: TextileCategory[] = ['Banarasi', 'Bandhani', 'Ikat', 'Pichwai'];

const imageModules = import.meta.glob<{ default: string }>(
  '../assets/dataset/**/*.{jpg,jpeg,png,webp,avif}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
);

const descriptions: Record<TextileCategory, string> = {
  Banarasi: 'Indian textile pattern',
  Bandhani: 'Indian textile pattern',
  Ikat: 'Indian textile pattern',
  Pichwai: 'Indian textile pattern',
};

function categoryFromPath(path: string): TextileCategory | null {
  return categories.find((category) => path.toLowerCase().includes(category.toLowerCase())) ?? null;
}

export const galleryImages: TextileImage[] = Object.entries(imageModules)
  .map(([path, src], index) => {
    const category = categoryFromPath(path);

    if (!category) {
      return null;
    }

    const fileName = path.split('/').pop() ?? `textile-${index + 1}`;

    return {
      id: `${category.toLowerCase()}-${index}`,
      src: src as unknown as string,
      category,
      description: descriptions[category],
      fileName,
    };
  })
  .filter((item): item is TextileImage => item !== null);

export const hasLocalDataset = galleryImages.length > 0;
