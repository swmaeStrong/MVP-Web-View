'use client';

import StateDisplay from '@/components/common/StateDisplay';
import { useTheme } from '@/hooks/ui/useTheme';
import { themeColors } from '@/styles/colors';

interface EmptyStateProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  selectedCategory: string;
  selectedDateIndex: number;
  refetch?: () => void;
}

export default function EmptyState({
  selectedPeriod,
  selectedCategory,
  selectedDateIndex,
  refetch,
}: EmptyStateProps) {
  const { isDarkMode } = useTheme();
  // Check if current period (today, this week, this month)
  const isCurrentPeriod = selectedDateIndex === 0;
  
  const getTitle = () => {
    if (isCurrentPeriod) {
      return `No ${selectedPeriod} records yet`;
    }
    return `No records found`;
  };

  const getMessage = () => {
    const category = selectedCategory === 'total' ? 'Total' 
      : selectedCategory === 'Development' ? 'Development'
      : selectedCategory === 'Documentation' ? 'Documentation'
      : selectedCategory === 'LLM' ? 'LLM'
      : selectedCategory === 'Design' ? 'Design'
      : selectedCategory;
      
    if (isCurrentPeriod) {
      return `Be the first to create a record in ${category} category!`;
    }
    return `No activity found in ${category} category for this period.`;
  };

  return (
    <div className={`w-full border rounded-lg p-32 lg:p-64 ${
      isDarkMode 
        ? `${themeColors.dark.classes.borderLight} ${themeColors.dark.classes.component}` 
        : `${themeColors.light.classes.borderLight} ${themeColors.light.classes.component}`
    }`}>
      <StateDisplay
        type="empty"
        title={getTitle()}
        message={getMessage()}
        size="large"
        showBorder={false}
      />
    </div>
  );
}
