// 🎯 Categories used across leaderboard and statistics
export const CATEGORIES = {
  DEVELOPMENT: 'Development',
  LLM: 'LLM', 
  DOCUMENTATION: 'Documentation',
  DESIGN: 'Design',
  TOTAL: 'work',
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
    'work': 'Work',
    'Development': 'Development',
    'Documentation': 'Documentation', 
    'LLM': 'LLM',
    'Design': 'Design',
  };
  return displayNames[category] || category;
};

// 🎨 Category colors - centralized color configuration
export const CATEGORY_COLORS = [
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#ec4899', // Pink
] as const;

// 🎨 Get category color by index
export const getCategoryColor = (index: number): string => {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
};

// 🎨 Category configuration with colors and icons (단순화를 위한 설정 기반 접근)
export const CATEGORY_CONFIG = {
  [CATEGORIES.TOTAL]: { 
    color: CATEGORY_COLORS[0], 
    displayName: 'Work',
    icon: '💼'
  },
  [CATEGORIES.DEVELOPMENT]: { 
    color: CATEGORY_COLORS[1], 
    displayName: 'Development',
    icon: '💻'
  },
  [CATEGORIES.DOCUMENTATION]: { 
    color: CATEGORY_COLORS[2], 
    displayName: 'Documentation',
    icon: '📚'
  },
  [CATEGORIES.LLM]: { 
    color: CATEGORY_COLORS[3], 
    displayName: 'LLM',
    icon: '🤖'
  },
  [CATEGORIES.DESIGN]: { 
    color: CATEGORY_COLORS[4], 
    displayName: 'Design',
    icon: '🎨'
  },
} as const;

// 🎨 Get category configuration
export const getCategoryConfig = (category: string) => {
  return CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || {
    color: CATEGORY_COLORS[0],
    displayName: category,
    icon: '📋'
  };
};
