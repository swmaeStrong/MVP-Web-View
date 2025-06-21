'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { StatisticsCategory } from '@/types/statistics';
import { formatTime } from '@/utils/statisticsUtils';
import { getCategoryIcon } from '../../utils/categories';

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
  // 상위 6개만 표시
  const top6Categories = categories.slice(0, 6);
  console.log(top6Categories);
  if (top6Categories.length === 0) {
    return null;
  }

  return (
    <Card className='rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md'>
      <CardContent className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h4 className='text-sm font-semibold text-gray-700'>
            상위 6개 카테고리
          </h4>
          <button
            onClick={() => onCategorySelect(null)}
            className={`rounded px-2 py-1 text-xs transition-all ${
              selectedCategory === null
                ? 'bg-purple-100 font-semibold text-purple-700'
                : 'text-gray-500 hover:text-purple-600'
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
                className={`group flex cursor-pointer items-center gap-3 rounded-lg border p-3 shadow-sm transition-all duration-200 ${
                  isSelected
                    ? 'scale-105 border-purple-300 bg-purple-50 shadow-md'
                    : 'border-gray-100 bg-white hover:scale-105 hover:border-purple-200 hover:shadow-md'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white shadow-sm transition-transform ${
                      isSelected ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                    style={{ backgroundColor: category.color }}
                  >
                    {getCategoryIcon(category.name)}
                  </div>
                  <div
                    className='h-2 w-2 rounded-full shadow-sm'
                    style={{ backgroundColor: category.color }}
                  />
                </div>

                <div className='min-w-0 flex-1'>
                  <div
                    className={`truncate text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'text-purple-800'
                        : 'text-gray-800 group-hover:text-purple-700'
                    }`}
                  >
                    {category.name}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <span className='font-medium'>
                      {formatTime(category.time)}
                    </span>
                    <span className='text-xs'>•</span>
                    <span className='font-medium'>{category.percentage}%</span>
                  </div>

                  {/* 프로그레스 바 */}
                  <div className='mt-1.5 h-1 w-full rounded-full bg-gray-100'>
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        isSelected ? 'shadow-sm' : ''
                      }`}
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* 순위 표시 */}
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-700'
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
