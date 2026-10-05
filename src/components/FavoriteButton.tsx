interface FavoriteButtonProps {
  id: string;
  isFavorite: boolean;
  onToggle: (id: string) => void;
}

export function FavoriteButton({ id, isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-ghost gap-1.5 text-sm ${isFavorite ? 'border-gold text-gold' : ''}`}
      onClick={() => onToggle(id)}
      aria-label={isFavorite ? 'Remove from saved designs' : 'Save design'}
      aria-pressed={isFavorite}
    >
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      {isFavorite ? 'Saved' : 'Save'}
    </button>
  );
}
