// 🎯 Categories used across leaderboard and statistics
export const CATEGORIES = {
  DEVELOPMENT: 'Development',
  LLM: 'LLM', 
  DOCUMENTATION: 'Documentation',
  DESIGN: 'Design',
  TOTAL: 'total',
} as const;

// 📊 Leaderboard categories list
export const LEADERBOARD_CATEGORIES = [
  CATEGORIES.TOTAL,
  CATEGORIES.DEVELOPMENT,
  CATEGORIES.DOCUMENTATION,
  CATEGORIES.LLM,
  CATEGORIES.DESIGN,
];

// 🏷️ Get category display name
export const getCategoryDisplayName = (category: string): string => {
  const displayNames: { [key: string]: string } = {
    [CATEGORIES.TOTAL]: 'Total',
    [CATEGORIES.DEVELOPMENT]: 'Development',
    [CATEGORIES.DOCUMENTATION]: 'Documentation', 
    [CATEGORIES.LLM]: 'LLM',
    [CATEGORIES.DESIGN]: 'Design',
  };
  return displayNames[category] || category;
};
