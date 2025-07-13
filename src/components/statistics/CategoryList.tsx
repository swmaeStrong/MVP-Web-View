'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { StatisticsCategory } from '@/types/domains/usage/statistics';
import { useTheme } from '@/hooks/useTheme';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { cardSystem, componentStates, spacing, layouts, buttonSystem } from '@/styles/design-system';
import NoData from '@/components/common/NoData';

interface CategoryListProps {
  categories: StatisticsCategory[];
  selectedCategory: StatisticsCategory | null;
  onCategorySelect: (category: StatisticsCategory | null) => void;
  isLoading?: boolean;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
  isLoading = false,
}: CategoryListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const { getCardStyle, getButtonStyle } = useDesignSystem();
  
  // Apply design system styles
  const cardStyles = getCardStyle('medium', 'hoverable');
  const buttonStyles = getButtonStyle('small', 'ghost');
  // Define 6 fixed colors
  const categoryColors = [
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#ec4899', // Pink
  ];

  // Show only top 6 and assign colors
  const top6Categories = categories.slice(0, 6).map((category, index) => ({
    ...category,
    color: categoryColors[index] || categoryColors[0], // Color override
  }));

  if (isLoading) {
    return (
      <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
          {/* Fixed height to match ActivityList + TotalTimeCard height */}
          <div className="h-[542px] flex flex-col">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className={`h-7 w-40 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              <div className={`h-8 w-12 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>

            {/* Category list skeleton */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className={`group flex items-center justify-between p-2 rounded ${getThemeClass('componentSecondary')}`}>
                    {/* Left: color + name skeleton */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`h-2 w-2 rounded-full animate-pulse ${getThemeClass('borderLight')}`}></div>
                      <div className={`h-4 w-20 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                    </div>
                    {/* Right: percentage skeleton */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`h-4 w-8 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (top6Categories.length === 0) {
    return (
      <NoData 
        title="No Category Data"
        message="No category data available for analysis."
        size="medium"
        showBorder={false}
      />
    );
  }

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        {/* Fixed height to match ActivityList + TotalTimeCard height */}
        <div className="h-[542px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
              Category Analysis
            </h4>
            <button
              onClick={() => onCategorySelect(null)}
              className={`${buttonSystem.base} ${buttonSystem.sizes.sm} ${
                selectedCategory === null
                  ? `${buttonSystem.variants.secondary} ${getThemeTextColor('accent')}`
                  : `${buttonSystem.variants.ghost} ${getThemeTextColor('secondary')} hover:${getThemeTextColor('accent')}`
              } ${componentStates.clickable.transition}`}
            >
              All
            </button>
          </div>

          {/* Category list - scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {top6Categories.slice(0, 4).map((category, index) => {
                const isSelected = selectedCategory?.name === category.name;

                return (
                  <div
                    key={index}
                    onClick={() => onCategorySelect(category)}
                    className={`group flex items-center justify-between p-2 rounded transition-colors cursor-pointer ${
                      isSelected
                        ? `${getThemeClass('componentSecondary')} ${getThemeClass('borderLight')}`
                        : `hover:${getThemeClass('componentSecondary')}`
                    }`}
                  >
                    {/* Left: color + name */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className={`h-2 w-2 rounded-full flex-shrink-0 ${
                          isSelected ? 'ring-1 ring-purple-300' : ''
                        }`}
                        style={{ backgroundColor: category.color }}
                      />
                      <div
                        className={`truncate text-sm font-medium ${
                          isSelected
                            ? getThemeTextColor('accent')
                            : getThemeTextColor('primary')
                        }`}
                      >
                        {category.name}
                      </div>
                    </div>

                    {/* Right: percentage only */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`text-sm font-semibold ${getThemeTextColor('secondary')}`}>
                        {category.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
