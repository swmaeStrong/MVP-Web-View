'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/shadcn/ui/chart';
import { categoryColors } from '@/styles/colors';
// namespace로 변경됨
import { getCategoryDisplayName } from '@/utils/leaderboard';
import { formatTime } from '@/utils/statisticsUtils';
import { Activity } from 'lucide-react';
import {
  Cell,
  Pie,
  PieChart,
} from 'recharts';
// import { getThemeColor } from '../../utils/theme-detector'; // 제거됨 - useTheme 사용
import StateDisplay from '../common/StateDisplay';

interface StatisticsPieChartProps {
  data: Statistics.DailyStatistics;
}

export default function StatisticsPieChart({
  data,
}: StatisticsPieChartProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  
  // Get category colors from colors.ts
  const getCategoryColor = (categoryName: string) => {
    const colors = categoryColors[categoryName as keyof typeof categoryColors] || categoryColors.default;
    return colors.solid;
  };

  // Filter out null or invalid categories first
  const validCategories = data.categories.filter(category => 
    category && 
    category.name && 
    category.name.trim() !== '' && 
    category.name !== 'null' && 
    category.name !== 'undefined' &&
    category.time > 0
  );

  // Extract only top 3 categories and group the rest as "Others"
  const top3Categories = validCategories.slice(0, 3).map((category, index) => ({
    ...category,
    color: getCategoryColor(category.name), // Use colors from colors.ts
  }));

  // Calculate others category from remaining categories
  const otherCategories = validCategories.slice(3);
  const othersTime = otherCategories.reduce((sum, cat) => sum + cat.time, 0);
  const othersPercentage = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);

  // Final categories including "Others" if there are more than 3
  const finalCategories = [...top3Categories];
  if (otherCategories.length > 0 && othersTime > 0) {
    finalCategories.push({
      name: 'Others',
      time: othersTime,
      percentage: othersPercentage,
      color: getCategoryColor('others'), // Use 'others' color from colors.ts
      icon: '📊', // Add icon for type compatibility
    });
  }

  // Data validation
  const totalTime = data.totalTime || 0;
  const hasValidData = finalCategories.length > 0 && totalTime > 0;

  if (!hasValidData) {
    return (
      <div className={`flex items-center p-4 gap-24`}>
        <div className={`flex-shrink-0 w-[140px] h-[140px] flex items-center justify-center`}>
          <StateDisplay
            type='empty'
            title='No categories to analyze'
            message='Cannot display pie chart due to lack of activity data.'
            icon={Activity}
            showBorder={false}
            size='small'
          />
        </div>
        <div className='flex-1'></div>
      </div>
    );
  }

  // Construct chart data with additional null checks
  const chartData = finalCategories
    .filter(category => category && category.name && category.time > 0) // Additional safety check
    .map(category => ({
      category: category.name === 'Others' ? 'Others' : getCategoryDisplayName(category.name), // Use display name
      originalCategory: category.name, // Keep original for color lookup
      time: category.time,
      percentage: category.percentage || 0,
      fullTime: formatTime(category.time),
      fill: category.color, // Use assigned color
    }));

  // Chart configuration with null checks
  const chartConfig = finalCategories
    .filter(category => category && category.name) // Filter out null categories
    .reduce((config, category, index) => {
      config[category.name] = {
        label: category.name === 'Others' ? 'Others' : getCategoryDisplayName(category.name), // Use display name
        color: category.color, // Use assigned color
      };
      return config;
    }, {} as ChartConfig);

  return (
    <div className={`flex justify-center w-full`}>
      <div className={`flex items-center gap-6`}>
        {/* Pie Chart - Fixed width container */}
        <div className={`flex-shrink-0 w-[200px] flex justify-center`}>
          <ChartContainer
            config={chartConfig}
            className='aspect-square w-[180px] h-[180px]'
          >
            <PieChart>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const categoryDisplayName = data.payload.category;
                    const originalCategory = data.payload.originalCategory;
                    const time = data.value;
                    const percentage = data.payload.percentage;
                    const categoryColor = getCategoryColor(originalCategory);

                    return (
                      <div className={`rounded-xl border-2 p-3 shadow-lg ${getThemeClass('border')} ${getThemeClass('component')}`}>
                        <div className='flex flex-col gap-2'>
                          <div className='flex items-center gap-1'>
                            <div
                              className='h-3 w-3 rounded-full'
                              style={{
                                backgroundColor: categoryColor,
                              }}
                            />
                            <span className={`font-bold ${getThemeTextColor('primary')}`}>
                              {categoryDisplayName}
                            </span>
                          </div>
                          <div className={`ml-2 text-sm ${getThemeTextColor('secondary')}`}>
                            Time:{' '}
                            <span className={`font-semibold ${getThemeTextColor('primary')}`}>
                              {data.payload.fullTime}
                            </span>
                          </div>
                          <div className={`ml-2 text-sm ${getThemeTextColor('secondary')}`}>
                            Rate:{' '}
                            <span className={`font-semibold ${getThemeTextColor('primary')}`}>
                              {percentage ? percentage.toFixed(1) : '0.0'}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={85}
                innerRadius={60} // Make it a donut chart (hollow)
                fill='#8884d8'
                dataKey='time'
                stroke={`${getThemeClass('component')}`}
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              {/* Total time display in the center */}
              <text 
                x="50%" 
                y="45%" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className={`text-sm font-bold ${getThemeTextColor('primary')}`}
                fill={isDarkMode ? '#ffffff' : '#000000'}
              >
                {formatTime(totalTime)}
              </text>
              <text 
                x="50%" 
                y="55%" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className={`text-xs ${getThemeTextColor('secondary')}`}
                fill={isDarkMode ? '#a0a0a0' : '#666666'}
              >
                Total Time
              </text>
            </PieChart>
          </ChartContainer>
        </div>

        {/* Category Details - Fixed width container */}
        <div className='w-[200px] flex flex-col gap-2'>
          {finalCategories.map((category, index) => (
            <div key={index} className={`flex items-center gap-2`}>
              <div
                className='w-3 h-3 rounded-full flex-shrink-0'
                style={{ backgroundColor: category.color }}
              />
              <div className='flex flex-col min-w-0 flex-1'>
                <span className={`text-xs font-medium ${getThemeTextColor('primary')} truncate`} title={category.name === 'Others' ? 'Others' : getCategoryDisplayName(category.name)}>
                  {category.name === 'Others' ? 'Others' : getCategoryDisplayName(category.name)}
                </span>
                <span className={`text-xs ${getThemeTextColor('secondary')} whitespace-nowrap`}>
                  {formatTime(category.time)} ({category.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}