'use client';

import { categoryColors, utils } from '@/styles';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  // 5개 고정 슬롯을 위한 카테고리 배열 생성
  const getVisibleCategories = () => {
    const selectedIndex = categories.indexOf(selectedCategory);
    const visibleCategories = [];

    // 5개 슬롯: [선택-2, 선택-1, 선택, 선택+1, 선택+2]
    for (let i = -2; i <= 2; i++) {
      let targetIndex = selectedIndex + i;

      // 순환 처리: 배열 범위를 벗어나면 반대편으로
      if (targetIndex < 0) {
        targetIndex = categories.length + targetIndex;
      } else if (targetIndex >= categories.length) {
        targetIndex = targetIndex - categories.length;
      }

      visibleCategories.push({
        category: categories[targetIndex],
        isSelected: i === 0, // 가운데 슬롯만 선택됨
        position: i, // -2, -1, 0, 1, 2
      });
    }

    return visibleCategories;
  };

  return (
    <div className='mb-8'>
      <div className='flex justify-center'>
        <div className='flex items-center gap-3'>
          {getVisibleCategories().map((item, slotIndex) => {
            const categoryColor =
              categoryColors[item.category as keyof typeof categoryColors] ||
              categoryColors.기타; // fallback to 기타 if category not found

            return (
              <button
                key={`${item.category}-${slotIndex}`}
                onClick={() => setSelectedCategory(item.category)}
                className={utils.cn(
                  'relative overflow-hidden rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300',
                  'flex h-[48px] w-[100px] items-center justify-center', // 고정 크기
                  // 가운데 슬롯 (선택된 카테고리)
                  item.isSelected
                    ? `bg-gradient-to-r ${categoryColor.buttonGradient} z-10 scale-110 transform text-white shadow-xl`
                    : // 양옆 슬롯들
                      Math.abs(item.position) === 1
                      ? 'scale-95 border border-gray-200 bg-white text-gray-700 hover:scale-105 hover:bg-gray-50'
                      : // 가장 끝 슬롯들 (더 작게)
                        'scale-90 border border-gray-200 bg-white text-gray-500 opacity-70 hover:scale-105 hover:bg-gray-50'
                )}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${categoryColor.gradient} opacity-0 transition-opacity duration-300 hover:opacity-10`}
                ></div>
                <span className='relative z-10 text-center whitespace-nowrap'>
                  {item.category === 'all' ? '전체' : item.category}
                </span>
                {/* 선택된 카테고리 표시 */}
                {item.isSelected && (
                  <div className='absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-lg'>
                    <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 전체 카테고리 인디케이터 */}
      <div className='mt-4 flex justify-center'>
        <div className='flex items-center gap-1'>
          {categories.map((_, index) => {
            const selectedIndex = categories.indexOf(selectedCategory);

            return (
              <div
                key={index}
                className={utils.cn(
                  'h-1.5 w-1.5 rounded-full transition-all duration-300',
                  index === selectedIndex
                    ? 'h-2 w-6 bg-purple-500' // 선택된 항목은 길게
                    : 'bg-gray-300'
                )}
              />
            );
          })}
        </div>
      </div>

      {/* 현재 카테고리 정보 */}
      <div className='mt-3 text-center'>
        <div className='text-sm text-gray-600'>
          <span className='font-semibold text-purple-600'>
            {selectedCategory === 'all' ? '전체' : selectedCategory}
          </span>
          <span className='mx-2'>•</span>
          <span>
            {categories.indexOf(selectedCategory) + 1} / {categories.length}
          </span>
        </div>
      </div>

      {/* 좌우 네비게이션 힌트 */}
      <div className='mt-2 flex justify-center'>
        <div className='flex items-center gap-4 text-xs text-gray-400'>
          <span className='flex items-center gap-1'>
            <span>←</span>
            <span>이전</span>
          </span>
          <div className='h-1 w-8 rounded-full bg-gray-200'></div>
          <span className='flex items-center gap-1'>
            <span>다음</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
