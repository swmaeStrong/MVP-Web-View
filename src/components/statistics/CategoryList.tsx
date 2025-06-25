'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { StatisticsCategory } from '@/types/statistics';
import { formatTime } from '@/utils/statisticsUtils';
import { useTheme } from '@/hooks/useTheme';

interface CategoryListProps {
  categories: StatisticsCategory[];
  selectedCategory: StatisticsCategory | null;
  onCategorySelect: (category: StatisticsCategory | null) => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryListProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  // 6개의 고정 색상 정의
  const categoryColors = [
    '#8b5cf6', // 보라
    '#06b6d4', // 청록
    '#10b981', // 초록
    '#f59e0b', // 노랑
    '#ef4444', // 빨강
    '#ec4899', // 핑크
  ];

  // 상위 6개만 표시하고 색상 할당
  const top6Categories = categories.slice(0, 6).map((category, index) => ({
    ...category,
    color: categoryColors[index] || categoryColors[0], // 색상 오버라이드
  }));

  if (top6Categories.length === 0) {
    return null;
  }

  return (
    <Card className={`rounded-lg border-2 shadow-md transition-all duration-300 hover:shadow-lg ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h4 className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
            상위 6개 카테고리
          </h4>
          <button
            onClick={() => onCategorySelect(null)}
            className={`rounded px-2 py-1 text-xs transition-all ${
              selectedCategory === null
                ? `${getThemeClass('componentSecondary')} font-semibold ${getThemeTextColor('accent')}`
                : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('accent')}`
            }`}
          >
            전체
          </button>
        </div>

        <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
          {top6Categories.map((category, index) => {
            const isSelected = selectedCategory?.name === category.name;

            return (
              <div
                key={index}
                onClick={() => onCategorySelect(category)}
                className={`group flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 shadow-sm transition-all duration-200 ${
                  isSelected
                    ? `${getThemeClass('borderLight')} ${getThemeClass('componentSecondary')} shadow-md`
                    : `${getThemeClass('border')} ${getThemeClass('component')} hover:${getThemeClass('borderLight')} hover:shadow-md`
                }`}
              >
                {/* 색상 인디케이터 및 카테고리 정보 */}
                <div className='flex items-center gap-3'>
                  <div
                    className={`h-4 w-4 rounded-full transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-purple-300 ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: category.color }}
                  />

                  <div className='min-w-0 flex-1'>
                    <div
                      className={`truncate text-sm font-semibold transition-colors ${
                        isSelected
                          ? getThemeTextColor('accent')
                          : `${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`
                      }`}
                    >
                      {category.name}
                    </div>
                    <div className={`mt-0.5 text-xs ${getThemeTextColor('secondary')}`}>
                      {category.percentage}%
                    </div>
                  </div>
                </div>

                {/* 사용 시간 */}
                <div className='text-right'>
                  <div
                    className={`text-sm font-semibold transition-colors ${
                      isSelected
                        ? getThemeTextColor('accent')
                        : `${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`
                    }`}
                  >
                    {formatTime(category.time)}
                  </div>

                  {/* 프로그레스 바 */}
                  <div className={`mt-1 h-1 w-16 rounded-full ${getThemeClass('componentSecondary')}`}>
                    <div
                      className='h-1 rounded-full transition-all duration-300'
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
