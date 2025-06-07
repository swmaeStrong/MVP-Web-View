import { categoryColors } from '@/styles/colors';

// 🎯 leaderboard와 statistics에서 공통으로 사용하는 카테고리 정의
export const CATEGORIES = {
  // 메인 카테고리 (영문 - leaderboard에서 주로 사용)
  DEVELOPMENT: 'DEVELOPMENT',
  LLM: 'LLM',
  DOCUMENTATION: 'Documentation',
  DESIGN: 'Design',
  COMMUNICATION: 'Communication',
  YOUTUBE: 'YouTube',
  SNS: 'SNS',
  UNCATEGORIZED: 'Uncategorized',

  // 한글 카테고리 (statistics에서 주로 사용)
  개발: '개발',
  디자인: '디자인',
  회의: '회의',
  기타: '기타',

  // 특수 카테고리
  ALL: 'all',
} as const;

// 🎨 카테고리별 색상 맵 (통합)
export const getCategoryColor = (category: string): string => {
  const colorConfig = categoryColors[category as keyof typeof categoryColors];
  return colorConfig?.solid || categoryColors.Uncategorized.solid;
};

// 🎭 카테고리별 아이콘 맵 (통합)
export const CATEGORY_ICONS: { [key: string]: string } = {
  [CATEGORIES.DEVELOPMENT]: '💻',
  [CATEGORIES.개발]: '💻',
  [CATEGORIES.LLM]: '🤖',
  [CATEGORIES.DOCUMENTATION]: '📚',
  [CATEGORIES.DESIGN]: '🎨',
  [CATEGORIES.디자인]: '🎨',
  [CATEGORIES.COMMUNICATION]: '💬',
  [CATEGORIES.회의]: '💬',
  [CATEGORIES.YOUTUBE]: '📹',
  [CATEGORIES.SNS]: '📱',
  [CATEGORIES.UNCATEGORIZED]: '📋',
  [CATEGORIES.기타]: '📋',
  [CATEGORIES.ALL]: '🌟',
};

// 🎯 카테고리 아이콘 가져오기
export const getCategoryIcon = (category: string): string => {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS[CATEGORIES.기타];
};

// 📊 leaderboard 카테고리 목록
export const LEADERBOARD_CATEGORIES = [
  CATEGORIES.DEVELOPMENT,
  CATEGORIES.LLM,
  CATEGORIES.DOCUMENTATION,
  CATEGORIES.DESIGN,
  CATEGORIES.COMMUNICATION,
  CATEGORIES.YOUTUBE,
  CATEGORIES.SNS,
  CATEGORIES.UNCATEGORIZED,
];

// 📈 statistics 카테고리 목록 (한글명 포함)
export const STATISTICS_CATEGORIES = [
  CATEGORIES.DEVELOPMENT,
  CATEGORIES.개발,
  CATEGORIES.LLM,
  CATEGORIES.DOCUMENTATION,
  CATEGORIES.DESIGN,
  CATEGORIES.디자인,
  CATEGORIES.COMMUNICATION,
  CATEGORIES.회의,
  CATEGORIES.YOUTUBE,
  CATEGORIES.SNS,
  CATEGORIES.UNCATEGORIZED,
  CATEGORIES.기타,
];

// 🎨 카테고리 표시명 매핑
export const CATEGORY_DISPLAY_NAMES: { [key: string]: string } = {
  [CATEGORIES.ALL]: '전체',
  [CATEGORIES.DEVELOPMENT]: '개발',
  [CATEGORIES.개발]: '개발',
  [CATEGORIES.LLM]: 'LLM',
  [CATEGORIES.DOCUMENTATION]: '문서작업',
  [CATEGORIES.DESIGN]: '디자인',
  [CATEGORIES.디자인]: '디자인',
  [CATEGORIES.COMMUNICATION]: '소통',
  [CATEGORIES.회의]: '소통',
  [CATEGORIES.YOUTUBE]: '유튜브',
  [CATEGORIES.SNS]: 'SNS',
  [CATEGORIES.UNCATEGORIZED]: '기타',
  [CATEGORIES.기타]: '기타',
};

// 🏷️ 카테고리 표시명 가져오기
export const getCategoryDisplayName = (category: string): string => {
  return CATEGORY_DISPLAY_NAMES[category] || category;
};

// 🔄 영문 카테고리를 한글로 변환
export const mapEnglishToKorean = (englishCategory: string): string => {
  const mapping: { [key: string]: string } = {
    [CATEGORIES.DEVELOPMENT]: CATEGORIES.개발,
    [CATEGORIES.DESIGN]: CATEGORIES.디자인,
    [CATEGORIES.COMMUNICATION]: CATEGORIES.회의,
    [CATEGORIES.UNCATEGORIZED]: CATEGORIES.기타,
  };
  return mapping[englishCategory] || englishCategory;
};

// 🔄 한글 카테고리를 영문으로 변환
export const mapKoreanToEnglish = (koreanCategory: string): string => {
  const mapping: { [key: string]: string } = {
    [CATEGORIES.개발]: CATEGORIES.DEVELOPMENT,
    [CATEGORIES.디자인]: CATEGORIES.DESIGN,
    [CATEGORIES.회의]: CATEGORIES.COMMUNICATION,
    [CATEGORIES.기타]: CATEGORIES.UNCATEGORIZED,
  };
  return mapping[koreanCategory] || koreanCategory;
};
