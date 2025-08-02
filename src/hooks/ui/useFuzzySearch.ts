import { useMemo } from 'react';
import Fuse from 'fuse.js';

interface UseFuzzySearchOptions<T> {
  data: T[];
  searchQuery: string;
  keys: Array<{ name: string; weight: number }>;
  threshold?: number;
}

export function useFuzzySearch<T>({
  data,
  searchQuery,
  keys,
  threshold = 0.4,
}: UseFuzzySearchOptions<T>) {
  // Configure Fuse.js instance
  const fuse = useMemo(() => {
    const fuseOptions = {
      keys,
      threshold,
      includeScore: true,
      ignoreLocation: true,
      findAllMatches: true,
    };
    
    return new Fuse(data, fuseOptions);
  }, [data, keys, threshold]);

  // Perform fuzzy search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [fuse, searchQuery, data]);

  return searchResults;
}