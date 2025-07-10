'use client';

import { useTheme } from '@/hooks/useTheme';
import { categoryColors } from '@/styles';
import { FONT_SIZES } from '@/styles/font-sizes';

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
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  // Generate category array for 3 fixed slots
  const getVisibleCategories = () => {
    const selectedIndex = categories.indexOf(selectedCategory);
    const visibleCategories = [];

    // 3 slots: [selected-1, selected, selected+1]
    for (let i = -1; i <= 1; i++) {
      let targetIndex = selectedIndex + i;

      // Circular handling: wrap to opposite end if out of bounds
      if (targetIndex < 0) {
        targetIndex = categories.length + targetIndex;
      } else if (targetIndex >= categories.length) {
        targetIndex = targetIndex - categories.length;
      }

      visibleCategories.push({
        category: categories[targetIndex],
        isSelected: i === 0, // Only center slot is selected
        position: i, // -1, 0, 1
      });
    }

    return visibleCategories;
  };

  return (
    <div className={`mx-auto max-w-[800px] rounded-lg border p-6 shadow-sm transition-all duration-200 ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className='flex items-center justify-center'>
        {/* Category selection buttons - responsive */}
        <div className='flex justify-center'>
          <div className='flex items-center gap-4'>
            {getVisibleCategories().map((item, slotIndex) => {
              const categoryColor =
                categoryColors[item.category as keyof typeof categoryColors] ||
                categoryColors.uncategorized;

              return (
                <button
                  key={`${item.category}-${slotIndex}`}
                  onClick={() => setSelectedCategory(item.category)}
                  className={
                    item.isSelected
                      ? `w-[160px] rounded-lg border-2 scale-105 transform px-3 py-2 ${FONT_SIZES.LEADERBOARD.PRIMARY} font-semibold transition-all duration-200 overflow-hidden ${isDarkMode ? 'border-purple-400' : 'border-purple-300'} ${getThemeClass('component')} ${getThemeTextColor('primary')}`
                      : item.position === -1 || item.position === 1
                        ? `w-[140px] scale-95 transform rounded-lg border-2 px-3 py-1.5 ${FONT_SIZES.LEADERBOARD.PRIMARY} font-medium transition-all duration-200 overflow-hidden ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('borderLight')}`
                        : `w-[140px] rounded-lg border-2 px-3 py-1.5 ${FONT_SIZES.LEADERBOARD.PRIMARY} font-medium opacity-70 transition-all duration-200 overflow-hidden ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`
                  }
                >
                  <span className='block truncate'>
                    {item.category === 'total' ? 'Total'
                    : item.category === 'Development' ? 'Development'
                    : item.category === 'Documentation' ? 'Documentation'
                    : item.category === 'LLM' ? 'LLM'
                    : item.category === 'Design' ? 'Design'
                    : item.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: indicator - responsive */}
      <div className='mt-4 flex justify-center'>
        <div className='flex items-center gap-1'>
          {categories.map((_, index) => {
            const selectedIndex = categories.indexOf(selectedCategory);

            return (
              <div
                key={index}
                className={
                  index === selectedIndex
                    ? 'h-2 w-6 rounded-full bg-purple-500 border border-purple-600 transition-all duration-200'
                    : `h-1.5 w-1.5 rounded-full border transition-all duration-200 ${getThemeClass('borderLight')} border-purple-300`
                }
              />
            );
          })}
        </div>
      </div>

      {/* Current category info - responsive */}
      <div className='mt-3 text-center'>
        <div className={`${FONT_SIZES.LEADERBOARD.PRIMARY} ${getThemeTextColor('secondary')}`}>
          <span className='font-semibold text-purple-600'>
            {selectedCategory === 'total' ? 'Total'
            : selectedCategory === 'Development' ? 'Development'
            : selectedCategory === 'Documentation' ? 'Documentation'
            : selectedCategory === 'LLM' ? 'LLM'
            : selectedCategory === 'Design' ? 'Design'
            : selectedCategory}
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
