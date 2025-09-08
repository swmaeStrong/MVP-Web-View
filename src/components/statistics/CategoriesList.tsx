'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import React from 'react';

// Types
interface CategoryItem {
  name: string;
  duration: number;
  percentage: number;
  color: string;
}

interface CategoriesListProps {
  categories?: CategoryItem[];
  selectedDate?: string;
}

// Mock data for development
const mockCategories: CategoryItem[] = [
  { name: 'Development', duration: 14400, percentage: 45, color: 'bg-purple-500' },
  { name: 'Documentation', duration: 7200, percentage: 25, color: 'bg-indigo-500' },
  { name: 'Communication', duration: 3600, percentage: 12, color: 'bg-blue-500' },
  { name: 'Research', duration: 2880, percentage: 10, color: 'bg-green-500' },
  { name: 'Entertainment', duration: 1440, percentage: 5, color: 'bg-red-500' },
  { name: 'Music', duration: 720, percentage: 2, color: 'bg-yellow-500' },
  { name: 'Gaming', duration: 360, percentage: 1, color: 'bg-orange-500' }
];

// Format time helper
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

// Get main color - same as StatisticsSummaryCards
const getMainColor = () => {
  return 'bg-[#3F72AF]'; // 메인 브랜드 컬러 사용
};

// Category item component - using Top Categories format
const CategoryItem: React.FC<{
  category: CategoryItem;
  getThemeClass: (type: string) => string;
  getThemeTextColor: (type: string) => string;
  isDarkMode: boolean;
}> = ({ category, getThemeClass, getThemeTextColor, isDarkMode }) => {
  return (
    <div className="flex items-center gap-1">
      <span 
        className={`${getThemeTextColor('secondary')} text-xs font-medium w-20 lg:w-24 flex-shrink-0 text-left overflow-hidden text-ellipsis whitespace-nowrap`}
        title={category.name}
      >
        {category.name}
      </span>
      <div className="flex-1 mx-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden min-w-[30px]">
        <div
          className={`h-full ${getMainColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${Math.min(category.percentage, 100)}%` }}
        />
      </div>
      <span className={`${getThemeTextColor('primary')} text-xs font-semibold flex-shrink-0 w-14 lg:w-16 text-right whitespace-nowrap`}>
        {formatTime(category.duration)}
      </span>
    </div>
  );
};

// Loading skeleton - Top Categories format
const LoadingSkeleton: React.FC<{ getThemeClass: (type: string) => string }> = ({ getThemeClass }) => (
  <div className="space-y-2.5">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="flex items-center gap-1.5 py-1.5">
        <div className={`h-3 w-20 lg:w-24 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
        <div className={`flex-1 h-2 lg:h-3 rounded-full animate-pulse ${getThemeClass('borderLight')}`}></div>
        <div className={`h-3 w-14 lg:w-16 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
      </div>
    ))}
  </div>
);

export default function CategoriesList({ categories = mockCategories, selectedDate }: CategoriesListProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  const isLoading = false; // Replace with actual loading state

  return (
    <Card className={`h-auto pt-0 lg:h-[280px] rounded-lg border transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-3">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              Categories
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <LoadingSkeleton getThemeClass={getThemeClass as (type: string) => string} />
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-2.5">
                  {categories.slice(0, 10).map((category, index) => (
                    <CategoryItem
                      key={index}
                      category={category}
                      getThemeClass={getThemeClass as (type: string) => string}
                      getThemeTextColor={getThemeTextColor as (type: string) => string}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}