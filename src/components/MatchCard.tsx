import type { MatchResult, TextileImage } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { SimilarityMeter } from './SimilarityMeter';

interface MatchCardProps {
  match: MatchResult;
  onFindSimilar?: (image: TextileImage) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function MatchCard({ match, onFindSimilar, isFavorite = false, onToggleFavorite }: MatchCardProps) {
  return (
    <article className="card overflow-hidden">
      {match.image ? (
        <img
          src={match.image.src}
          alt={`${match.category} textile design`}
          className="h-48 w-full object-cover transition duration-300 hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-woven text-center text-sm text-ink/60 px-4">
          Add dataset images to show this match.
        </div>
      )}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded bg-ink px-3 py-1 text-sm font-semibold text-ivory">#{match.rank}</span>
          <span className="text-sm font-semibold text-gold">{match.category}</span>
        </div>
        <SimilarityMeter value={match.similarity} />
        <p className="mt-3 text-sm text-ink/65">{match.strength}</p>
        {(onFindSimilar && match.image) || onToggleFavorite ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {onFindSimilar && match.image ? (
              <button
                className="btn btn-ghost text-xs"
                onClick={() => onFindSimilar(match.image!)}
                aria-label={`Find designs similar to this ${match.category}`}
              >
                Find Similar
              </button>
            ) : null}
            {onToggleFavorite && match.image ? (
              <FavoriteButton id={match.image.id} isFavorite={isFavorite} onToggle={onToggleFavorite} />
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
