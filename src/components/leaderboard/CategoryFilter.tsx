'use client';

import { categoryColors } from '@/styles';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';

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
    <div className={`mx-auto max-w-[600px] lg:max-w-[800px] rounded-lg border p-4 lg:p-6 shadow-sm transition-all duration-200 ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className='flex items-center justify-center'>
        {/* Category selection buttons - responsive */}
        <div className='flex justify-center'>
          <div className='flex items-center gap-2 lg:gap-4'>
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
                      ? `w-[100px] lg:w-[140px] rounded-lg border-2 scale-105 transform px-2 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold transition-all duration-200 overflow-hidden ${isDarkMode ? 'border-purple-400' : 'border-purple-300'} ${getThemeClass('component')} ${getThemeTextColor('primary')}`
                      : item.position === -1 || item.position === 1
                        ? `w-[80px] lg:w-[120px] scale-95 transform rounded-lg border-2 px-2 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium transition-all duration-200 overflow-hidden ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('borderLight')}`
                        : `w-[80px] lg:w-[120px] rounded-lg border-2 px-2 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium opacity-70 transition-all duration-200 overflow-hidden ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`
                  }
                >
                  <span className='block truncate'>
                    {item.category === 'all' ? 'All' : item.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: indicator - responsive */}
      <div className='mt-3 lg:mt-4 flex justify-center'>
        <div className='flex items-center gap-1'>
          {categories.map((_, index) => {
            const selectedIndex = categories.indexOf(selectedCategory);

            return (
              <div
                key={index}
                className={
                  index === selectedIndex
                    ? 'h-1.5 w-4 lg:h-2 lg:w-6 rounded-full bg-purple-500 transition-all duration-200'
                    : `h-1 w-1 lg:h-1.5 lg:w-1.5 rounded-full transition-all duration-200 ${getThemeClass('borderLight')}`
                }
              />
            );
          })}
        </div>
      </div>

      {/* Current category info - responsive */}
      <div className='mt-2 lg:mt-3 text-center'>
        <div className={`text-xs lg:text-sm ${getThemeTextColor('secondary')}`}>
          <span className='font-semibold text-purple-600'>
            {selectedCategory === 'all' ? 'All' : selectedCategory}
          </span>
          <span className='mx-1 lg:mx-2'>•</span>
          <span>
            {categories.indexOf(selectedCategory) + 1} / {categories.length}
          </span>
        </div>
      </div>
    </div>
  );
}
