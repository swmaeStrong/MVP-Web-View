'use client';

import { DailyStatistics } from '@/types/statistics';
import { formatTime } from '@/utils/statisticsUtils';

interface StatisticsPieChartProps {
  data: DailyStatistics;
}

export default function StatisticsPieChart({ data }: StatisticsPieChartProps) {
  const total = data.categories.reduce((sum, cat) => sum + cat.time, 0);
  let currentAngle = 0;

  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const largeArcFlag = angle > 180 ? 1 : 0;
    const x1 = 150 + 120 * Math.cos(startAngleRad);
    const y1 = 150 + 120 * Math.sin(startAngleRad);
    const x2 = 150 + 120 * Math.cos(endAngleRad);
    const y2 = 150 + 120 * Math.sin(endAngleRad);

    return `M 150 150 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  if (data.categories.length === 0 || total === 0) {
    return (
      <div className='flex flex-col items-center gap-8 lg:flex-row'>
        <div className='mx-auto flex h-[300px] w-[300px] items-center justify-center rounded-full bg-gray-100'>
          <div className='text-center text-gray-500'>
            <div className='mb-2 text-4xl'>📊</div>
            <div className='text-sm'>데이터 없음</div>
          </div>
        </div>
        <div className='text-center text-gray-500'>
          <p>표시할 작업 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-8 lg:flex-row'>
      {/* 파이차트 SVG */}
      <div className='relative'>
        <svg width='300' height='300' viewBox='0 0 300 300' className='mx-auto'>
          {data.categories.map((category, index) => {
            const path = createPath(category.percentage, currentAngle);
            const previousAngle = currentAngle;
            currentAngle += (category.percentage / 100) * 360;

            return (
              <g key={index}>
                <path
                  d={path}
                  fill={category.color}
                  stroke='white'
                  strokeWidth='3'
                  className='cursor-pointer transition-all duration-300 hover:stroke-4 hover:opacity-80'
                >
                  <title>{`${category.name}: ${formatTime(category.time)} (${category.percentage}%)`}</title>
                </path>
              </g>
            );
          })}

          {/* 중앙 텍스트 */}
          <text
            x='150'
            y='140'
            textAnchor='middle'
            className='fill-gray-700 text-lg font-bold'
          >
            총 시간
          </text>
          <text
            x='150'
            y='165'
            textAnchor='middle'
            className='fill-purple-600 text-2xl font-bold'
          >
            {formatTime(total)}
          </text>
        </svg>
      </div>

      {/* 범례 */}
      <div className='max-w-sm space-y-4'>
        <h4 className='mb-4 text-lg font-semibold text-gray-800'>
          카테고리별 상세
        </h4>
        {data.categories.map((category, index) => (
          <div
            key={index}
            className='flex items-center gap-4 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100'
          >
            <div
              className='h-6 w-6 rounded-full border-2 border-white shadow-sm'
              style={{ backgroundColor: category.color }}
            ></div>

            <div className='flex-1'>
              <div className='mb-1 flex items-center gap-2'>
                <span className='text-lg'>{category.icon}</span>
                <span className='font-semibold text-gray-800'>
                  {category.name}
                </span>
              </div>
              <div className='space-y-1 text-sm'>
                <div className='text-gray-600'>
                  시간:{' '}
                  <span className='font-medium'>
                    {formatTime(category.time)}
                  </span>
                </div>
                <div className='text-gray-500'>
                  비율:{' '}
                  <span className='font-medium'>{category.percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
