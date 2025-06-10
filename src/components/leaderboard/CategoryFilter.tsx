'use client';

import { categoryColors } from '@/styles';

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
  // 3개 고정 슬롯을 위한 카테고리 배열 생성
  const getVisibleCategories = () => {
    const selectedIndex = categories.indexOf(selectedCategory);
    const visibleCategories = [];

    // 3개 슬롯: [선택-1, 선택, 선택+1]
    for (let i = -1; i <= 1; i++) {
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
        position: i, // -1, 0, 1
      });
    }

    return visibleCategories;
  };

  return (
    <div className='mx-auto max-w-[800px] rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-6 shadow-sm transition-shadow duration-200 hover:shadow-md'>
      <div className='flex items-center justify-center'>
        {/* 카테고리 선택 버튼들 (3개 고정) */}
        <div className='flex justify-center'>
          <div className='flex items-center gap-3'>
            {getVisibleCategories().map((item, slotIndex) => {
              const categoryColor =
                categoryColors[item.category as keyof typeof categoryColors] ||
                categoryColors.Uncategorized;

              return (
                <button
                  key={`${item.category}-${slotIndex}`}
                  onClick={() => setSelectedCategory(item.category)}
                  className={
                    item.isSelected
                      ? `w-[140px] rounded-lg bg-gradient-to-r ${categoryColor.buttonGradient} scale-105 transform px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200`
                      : item.position === -1 || item.position === 1
                        ? 'w-[120px] scale-95 transform rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50'
                        : 'w-[120px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500 opacity-70 transition-all duration-200 hover:bg-gray-100'
                  }
                >
                  <span className='truncate whitespace-nowrap'>
                    {item.category === 'all' ? '전체' : item.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단: 인디케이터 */}
      <div className='mt-4 flex justify-center'>
        <div className='flex items-center gap-1'>
          {categories.map((_, index) => {
            const selectedIndex = categories.indexOf(selectedCategory);

            return (
              <div
                key={index}
                className={
                  index === selectedIndex
                    ? 'h-2 w-6 rounded-full bg-purple-500 transition-all duration-200'
                    : 'h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-200'
                }
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
    </div>
  );
}
