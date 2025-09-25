import { useMemo } from 'react';
import { useFuzzySearch } from './useFuzzySearch';

interface UseGroupSearchOptions {
  groups: Group.GroupApiResponse[];
  searchQuery: string;
  filterType: 'all' | 'public' | 'private';
  sortBy: 'created' | 'name';
  locale?: 'ko' | 'en';
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
  locale,
}: UseGroupSearchOptions) {
  // Helper function to detect language of text
  const detectLanguage = (text: string): 'ko' | 'en' | 'mixed' => {
    if (!text) return 'en';

    // 한글 감지: 자음(ㄱ-ㅎ), 모음(ㅏ-ㅣ), 완성된 한글(가-힣) 모두 포함
    const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);

    // 한글만 있는 경우 (자음/모음만 있어도 한글로 판단)
    if (hasKorean && !hasEnglish) return 'ko';
    // 영어만 있는 경우
    if (hasEnglish && !hasKorean) return 'en';
    // 둘 다 있거나 기타 문자만 있는 경우
    return 'mixed';
  };

  // First filter by public/private and language
  const filteredByType = useMemo(() => {
    return groups.filter(group => {
      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'public' && group.isPublic) ||
        (filterType === 'private' && !group.isPublic);

      // Language filtering
      if (locale && matchesFilter) {
        const groupLang = detectLanguage(group.name);
        const descLang = detectLanguage(group.description || '');

        // For English users, filter out Korean-only content
        if (locale === 'en') {
          // Allow English or mixed content, filter out Korean-only
          return (groupLang !== 'ko' || descLang !== 'ko');
        }
        // For Korean users, show all content
        // Korean users can see both Korean and English content
      }

      return matchesFilter;
    });
  }, [groups, filterType, locale]);

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