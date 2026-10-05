import type { MatchResult } from '../types';
import { SimilarityMeter } from './SimilarityMeter';

export function MatchCard({ match }: { match: MatchResult }) {
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
        <div className="flex h-48 items-center justify-center bg-woven text-center text-sm text-ink/60">
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
      </div>
    </article>
  );
}
