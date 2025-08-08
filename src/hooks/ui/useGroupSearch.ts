import { useMemo } from 'react';
import { useFuzzySearch } from './useFuzzySearch';

interface UseGroupSearchOptions {
  groups: Group.GroupApiResponse[];
  searchQuery: string;
  filterType: 'all' | 'public' | 'private';
  sortBy: 'created' | 'name';
}

const SEARCH_KEYS = [
  { name: 'name', weight: 0.4 },
  { name: 'description', weight: 0.25 },
  { name: 'tags', weight: 0.15 },
  { name: 'groupOwner.nickname', weight: 0.2 }
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
      // 이벤트 관련 그룹을 가장 앞에 배치
      const aHasEvent = /이벤트|event/i.test(a.name) || /이벤트|event/i.test(a.description || '');
      const bHasEvent = /이벤트|event/i.test(b.name) || /이벤트|event/i.test(b.description || '');
      
      if (aHasEvent && !bHasEvent) return -1;
      if (!aHasEvent && bHasEvent) return 1;
      
      // 이벤트 우선순위가 같다면 기존 정렬 기준 적용
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          // Note: 'created' sorting would require a createdAt field
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