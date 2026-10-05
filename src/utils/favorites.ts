import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'vastra_favorites';

function readStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set<string>(parsed);
  } catch {
    // localStorage unavailable or corrupt — silent fallback
  }
  return new Set();
}

function writeStorage(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // storage full or unavailable — silent fallback
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(readStorage);

  useEffect(() => {
    writeStorage(favorites);
  }, [favorites]);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
