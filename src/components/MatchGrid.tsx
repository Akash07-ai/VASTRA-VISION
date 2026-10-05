import type { MatchResult } from '../types';
import { MatchCard } from './MatchCard';

export function MatchGrid({ matches }: { matches: MatchResult[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
