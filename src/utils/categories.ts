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
    'total': 'Total',
    'Development': 'Development',
    'Documentation': 'Documentation', 
    'LLM': 'LLM',
    'Design': 'Design',
  };
  return displayNames[category] || category;
};
