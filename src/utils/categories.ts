import { categoryColors } from '@/styles/colors';

// 🎯 Categories used across leaderboard and statistics
export const CATEGORIES = {
  // Main categories (English - default)
  DEVELOPMENT: 'Development',
  LLM: 'LLM',
  DOCUMENTATION: 'Documentation',
  DESIGN: 'Design',
  COMMUNICATION: 'Communication',
  YOUTUBE: 'YouTube',
  SNS: 'SNS',
  UNCATEGORIZED: 'Uncategorized',

  // Special categories
  ALL: 'all',
} as const;

// 🎨 카테고리별 색상 맵 (통합)
export const getCategoryColor = (category: string): string => {
  const colorConfig = categoryColors[category as keyof typeof categoryColors];
  return colorConfig?.gradient || categoryColors.Uncategorized.gradient;
};

// 🎭 Category icon mapping
export const CATEGORY_ICONS: { [key: string]: string } = {
  [CATEGORIES.DEVELOPMENT]: '⚡',
  [CATEGORIES.LLM]: '🤖',
  [CATEGORIES.DOCUMENTATION]: '📚',
  [CATEGORIES.DESIGN]: '🎨',
  [CATEGORIES.COMMUNICATION]: '💬',
  [CATEGORIES.YOUTUBE]: '📹',
  [CATEGORIES.SNS]: '📱',
  [CATEGORIES.UNCATEGORIZED]: '🗂️',
  [CATEGORIES.ALL]: '🌟',
};

// 🎯 Get category icon
export const getCategoryIcon = (category: string): string => {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS[CATEGORIES.UNCATEGORIZED];
};

// 📊 Leaderboard categories list
export const LEADERBOARD_CATEGORIES = [
  CATEGORIES.DEVELOPMENT,
  CATEGORIES.LLM,
  CATEGORIES.DOCUMENTATION,
  CATEGORIES.DESIGN,
];

// 📈 Statistics categories list
export const STATISTICS_CATEGORIES = [
  CATEGORIES.DEVELOPMENT,
  CATEGORIES.LLM,
  CATEGORIES.DOCUMENTATION,
  CATEGORIES.DESIGN,
  CATEGORIES.COMMUNICATION,
  CATEGORIES.YOUTUBE,
  CATEGORIES.SNS,
  CATEGORIES.UNCATEGORIZED,
];

// 🎨 Category display names mapping
export const CATEGORY_DISPLAY_NAMES: { [key: string]: string } = {
  [CATEGORIES.ALL]: 'All',
  [CATEGORIES.DEVELOPMENT]: 'Development',
  [CATEGORIES.LLM]: 'LLM',
  [CATEGORIES.DOCUMENTATION]: 'Documentation',
  [CATEGORIES.DESIGN]: 'Design',
  [CATEGORIES.COMMUNICATION]: 'Communication',
  [CATEGORIES.YOUTUBE]: 'YouTube',
  [CATEGORIES.SNS]: 'SNS',
  [CATEGORIES.UNCATEGORIZED]: 'Other',
};

// 🏷️ Get category display name
export const getCategoryDisplayName = (category: string): string => {
  return CATEGORY_DISPLAY_NAMES[category] || category;
};

// 🔄 Category normalization (for backward compatibility)
export const normalizeCategory = (category: string): string => {
  const mapping: { [key: string]: string } = {
    '개발': CATEGORIES.DEVELOPMENT,
    '디자인': CATEGORIES.DESIGN,
    '회의': CATEGORIES.COMMUNICATION,
    '기타': CATEGORIES.UNCATEGORIZED,
  };
  return mapping[category] || category;
};
