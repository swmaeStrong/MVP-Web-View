'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { StatisticsCategory } from '@/types/statistics';
import { useTheme } from '@/hooks/useTheme';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { cardSystem, componentStates, spacing, layouts, buttonSystem } from '@/styles/design-system';
import NoData from '@/components/common/NoData';

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
  const { getThemeClass, getThemeTextColor } = useTheme();
  const { getCardStyle, getButtonStyle } = useDesignSystem();
  
  // 디자인 시스템 스타일 적용
  const cardStyles = getCardStyle('medium', 'hoverable');
  const buttonStyles = getButtonStyle('small', 'ghost');
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
    return (
      <NoData 
        title="카테고리 데이터 없음"
        message="분석할 카테고리 데이터가 없습니다."
        size="medium"
        showBorder={false}
      />
    );
  }

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        {/* ActivityList + TotalTimeCard와 동일한 높이를 위한 고정 높이 */}
        <div className="h-[542px] flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
              카테고리 분석
            </h4>
            <button
              onClick={() => onCategorySelect(null)}
              className={`${buttonSystem.base} ${buttonSystem.sizes.sm} ${
                selectedCategory === null
                  ? `${buttonSystem.variants.secondary} ${getThemeTextColor('accent')}`
                  : `${buttonSystem.variants.ghost} ${getThemeTextColor('secondary')} hover:${getThemeTextColor('accent')}`
              } ${componentStates.clickable.transition}`}
            >
              전체
            </button>
          </div>

          {/* 카테고리 리스트 - 스크롤 가능 */}
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
                    {/* 왼쪽: 색상 + 이름 */}
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

                    {/* 오른쪽: 퍼센티지만 표시 */}
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
