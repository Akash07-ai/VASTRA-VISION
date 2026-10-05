import type { MatchResult, TextileImage } from '../types';
import { MatchCard } from './MatchCard';

interface MatchGridProps {
  matches: MatchResult[];
  onFindSimilar?: (image: TextileImage) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;
}

export function MatchGrid({ matches, onFindSimilar, favorites, onToggleFavorite }: MatchGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onFindSimilar={onFindSimilar}
          isFavorite={match.image ? (favorites?.has(match.image.id) ?? false) : false}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
