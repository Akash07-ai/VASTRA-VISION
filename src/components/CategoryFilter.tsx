import { categories } from '../data/gallery';
import type { TextileCategory } from '../types';

interface CategoryFilterProps {
  active: TextileCategory | 'All';
  onChange: (category: TextileCategory | 'All') => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const options: Array<TextileCategory | 'All'> = ['All', ...categories];

  return (
    <div className="flex flex-wrap gap-2" aria-label="Filter categories">
      {options.map((option) => (
        <button
          key={option}
          className={`chip ${active === option ? 'chip-active' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
