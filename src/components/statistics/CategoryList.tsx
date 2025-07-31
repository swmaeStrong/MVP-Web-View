'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/shadcn/ui/card';
// namespace로 변경됨
import { useTheme } from '@/hooks/ui/useTheme';
// import { useDesignSystem } from '@/hooks/ui/useDesignSystem'; // 제거됨
import { cardSystem, componentStates, spacing, layouts, buttonSystem } from '@/styles/design-system';
import StateDisplay from '@/components/common/StateDisplay';
import { getCategoryColor } from '@/utils/categories';

interface CategoryListProps {
  categories: Statistics.StatisticsCategory[];
  selectedCategory: Statistics.StatisticsCategory | null;
  onCategorySelect: (category: Statistics.StatisticsCategory | null) => void;
  isLoading?: boolean;
}

const CategoryList = memo(function CategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
  isLoading = false,
}: CategoryListProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  // 스타일 시스템 단순화됨 - 직접 클래스 사용
  // Show only top 6 and assign colors using centralized config
  const top6Categories = categories.slice(0, 6).map((category, index) => ({
    ...category,
    color: getCategoryColor(index), // 중앙화된 색상 설정 사용
  }));

  if (isLoading) {
    return (
      <Card className={getCommonCardClass()}>
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
      <StateDisplay 
        type="empty"
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
        <div className="h-[502px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
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
}, (prevProps, nextProps) => {
  // 메모이제이션: 데이터와 로딩 상태만 비교
  return (
    prevProps.categories.length === nextProps.categories.length &&
    prevProps.selectedCategory?.name === nextProps.selectedCategory?.name &&
    prevProps.isLoading === nextProps.isLoading &&
    JSON.stringify(prevProps.categories) === JSON.stringify(nextProps.categories)
  );
});

export default CategoryList;
