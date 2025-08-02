import { useMemo } from 'react';
import { useFuzzySearch } from './useFuzzySearch';

interface UseGroupSearchOptions {
  groups: Group.GroupApiResponse[];
  searchQuery: string;
  filterType: 'all' | 'public' | 'private';
  sortBy: 'members' | 'created' | 'name';
}

const SEARCH_KEYS = [
  { name: 'name', weight: 0.5 },
  { name: 'description', weight: 0.3 },
  { name: 'tags', weight: 0.2 }
];

export function useGroupSearch({
  groups,
  searchQuery,
  filterType,
  sortBy,
}: UseGroupSearchOptions) {
  // First filter by public/private
  const filteredByType = useMemo(() => {
    return groups.filter(group => {
      const matchesFilter = 
        filterType === 'all' || 
        (filterType === 'public' && group.isPublic) || 
        (filterType === 'private' && !group.isPublic);
      
      return matchesFilter;
    });
  }, [groups, filterType]);

  // Apply fuzzy search
  const searchedGroups = useFuzzySearch({
    data: filteredByType,
    searchQuery,
    keys: SEARCH_KEYS,
    threshold: 0.4,
  });

  // Apply sorting
  const sortedGroups = useMemo(() => {
    const sorted = [...searchedGroups];
    
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          // Note: 'created' sorting would require a createdAt field
          // For now, we'll keep the original order
          return 0;
        case 'members':
          // Note: 'members' sorting would require a member count field
          // For now, we'll keep the original order
          return 0;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchedGroups, sortBy]);

  return sortedGroups;
}