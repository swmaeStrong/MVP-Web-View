'use client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent } from '@/shadcn/ui/card'
import { useState } from 'react'

// 더미 데이터 (확장된 구조)
const dummyData = {
  daily: {
    '2024-01-15': {
      totalTime: 8.5,
      categories: [
        {
          name: '개발',
          time: 4.5,
          percentage: 53,
          color: 'from-purple-500 to-purple-600',
          icon: '💻',
        },
        {
          name: '디자인',
          time: 2.0,
          percentage: 24,
          color: 'from-blue-500 to-blue-600',
          icon: '🎨',
        },
        {
          name: '회의',
          time: 1.5,
          percentage: 18,
          color: 'from-green-500 to-green-600',
          icon: '🤝',
        },
        {
          name: '기타',
          time: 0.5,
          percentage: 5,
          color: 'from-gray-500 to-gray-600',
          icon: '📋',
        },
      ],
    },
    '2024-01-14': {
      totalTime: 7.2,
      categories: [
        {
          name: '개발',
          time: 3.8,
          percentage: 53,
          color: 'from-purple-500 to-purple-600',
          icon: '💻',
        },
        {
          name: '디자인',
          time: 1.8,
          percentage: 25,
          color: 'from-blue-500 to-blue-600',
          icon: '🎨',
        },
        {
          name: '회의',
          time: 1.2,
          percentage: 17,
          color: 'from-green-500 to-green-600',
          icon: '🤝',
        },
        {
          name: '기타',
          time: 0.4,
          percentage: 5,
          color: 'from-gray-500 to-gray-600',
          icon: '📋',
        },
      ],
    },
    '2024-01-13': {
      totalTime: 6.8,
      categories: [
        {
          name: '개발',
          time: 3.4,
          percentage: 50,
          color: 'from-purple-500 to-purple-600',
          icon: '💻',
        },
        {
          name: '디자인',
          time: 2.0,
          percentage: 29,
          color: 'from-blue-500 to-blue-600',
          icon: '🎨',
        },
        {
          name: '회의',
          time: 1.0,
          percentage: 15,
          color: 'from-green-500 to-green-600',
          icon: '🤝',
        },
        {
          name: '기타',
          time: 0.4,
          percentage: 6,
          color: 'from-gray-500 to-gray-600',
          icon: '📋',
        },
      ],
    },
  },
  weekly: {
    totalTime: 42.3,
    weeklyData: [
      {
        date: '1/9',
        categories: [
          { name: '개발', time: 3.2 },
          { name: '디자인', time: 1.5 },
          { name: '회의', time: 1.0 },
          { name: '기타', time: 0.3 },
        ],
      },
      {
        date: '1/10',
        categories: [
          { name: '개발', time: 3.8 },
          { name: '디자인', time: 1.2 },
          { name: '회의', time: 1.5 },
          { name: '기타', time: 0.5 },
        ],
      },
      {
        date: '1/11',
        categories: [
          { name: '개발', time: 4.5 },
          { name: '디자인', time: 2.0 },
          { name: '회의', time: 1.0 },
          { name: '기타', time: 0.5 },
        ],
      },
      {
        date: '1/12',
        categories: [
          { name: '개발', time: 2.8 },
          { name: '디자인', time: 2.5 },
          { name: '회의', time: 1.2 },
          { name: '기타', time: 0.5 },
        ],
      },
      {
        date: '1/13',
        categories: [
          { name: '개발', time: 3.4 },
          { name: '디자인', time: 2.0 },
          { name: '회의', time: 1.0 },
          { name: '기타', time: 0.4 },
        ],
      },
      {
        date: '1/14',
        categories: [
          { name: '개발', time: 3.8 },
          { name: '디자인', time: 1.8 },
          { name: '회의', time: 1.2 },
          { name: '기타', time: 0.4 },
        ],
      },
      {
        date: '1/15',
        categories: [
          { name: '개발', time: 4.5 },
          { name: '디자인', time: 2.0 },
          { name: '회의', time: 1.5 },
          { name: '기타', time: 0.5 },
        ],
      },
    ],
    categories: [
      {
        name: '개발',
        time: 22.5,
        percentage: 53,
        color: 'from-purple-500 to-purple-600',
        icon: '💻',
      },
      {
        name: '디자인',
        time: 10.2,
        percentage: 24,
        color: 'from-blue-500 to-blue-600',
        icon: '🎨',
      },
      {
        name: '회의',
        time: 7.6,
        percentage: 18,
        color: 'from-green-500 to-green-600',
        icon: '🤝',
      },
      {
        name: '기타',
        time: 2.0,
        percentage: 5,
        color: 'from-gray-500 to-gray-600',
        icon: '📋',
      },
    ],
  },
  monthly: {
    totalTime: 169.2,
    monthlyData: [
      {
        date: '1주차',
        categories: [
          { name: '개발', time: 20.5 },
          { name: '디자인', time: 9.2 },
          { name: '회의', time: 6.8 },
          { name: '기타', time: 1.5 },
        ],
      },
      {
        date: '2주차',
        categories: [
          { name: '개발', time: 22.1 },
          { name: '디자인', time: 10.5 },
          { name: '회의', time: 7.2 },
          { name: '기타', time: 2.2 },
        ],
      },
      {
        date: '3주차',
        categories: [
          { name: '개발', time: 23.6 },
          { name: '디자인', time: 11.0 },
          { name: '회의', time: 8.1 },
          { name: '기타', time: 2.3 },
        ],
      },
      {
        date: '4주차',
        categories: [
          { name: '개발', time: 23.5 },
          { name: '디자인', time: 9.9 },
          { name: '회의', time: 8.4 },
          { name: '기타', time: 2.4 },
        ],
      },
    ],
    categories: [
      {
        name: '개발',
        time: 89.7,
        percentage: 53,
        color: 'from-purple-500 to-purple-600',
        icon: '💻',
      },
      {
        name: '디자인',
        time: 40.6,
        percentage: 24,
        color: 'from-blue-500 to-blue-600',
        icon: '🎨',
      },
      {
        name: '회의',
        time: 30.5,
        percentage: 18,
        color: 'from-green-500 to-green-600',
        icon: '🤝',
      },
      {
        name: '기타',
        time: 8.4,
        percentage: 5,
        color: 'from-gray-500 to-gray-600',
        icon: '📋',
      },
    ],
  },
}

const timeLabels = {
  daily: '일별',
  weekly: '주별',
  monthly: '월별',
}

const colorMap: { [key: string]: string } = {
  개발: '#8b5cf6',
  디자인: '#3b82f6',
  회의: '#10b981',
  기타: '#6b7280',
}

// 파이차트 컴포넌트
const PieChart = ({ data }: { data: any }) => {
  const total = data.categories.reduce(
    (sum: number, cat: any) => sum + cat.time,
    0
  )
  let currentAngle = 0

  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360
    const endAngle = startAngle + angle
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const largeArcFlag = angle > 180 ? 1 : 0
    const x1 = 100 + 80 * Math.cos(startAngleRad)
    const y1 = 100 + 80 * Math.sin(startAngleRad)
    const x2 = 100 + 80 * Math.cos(endAngleRad)
    const y2 = 100 + 80 * Math.sin(endAngleRad)

    return `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  return (
    <div className='flex flex-col items-center gap-6 lg:flex-row'>
      <svg width='200' height='200' viewBox='0 0 200 200' className='mx-auto'>
        {data.categories.map((category: any, index: number) => {
          const path = createPath(category.percentage, currentAngle)
          const previousAngle = currentAngle
          currentAngle += (category.percentage / 100) * 360

          return (
            <path
              key={index}
              d={path}
              fill={colorMap[category.name]}
              stroke='white'
              strokeWidth='2'
              className='cursor-pointer transition-opacity hover:opacity-80'
            />
          )
        })}
        {/* 중앙 텍스트 */}
        <text
          x='100'
          y='95'
          textAnchor='middle'
          className='fill-gray-800 text-lg font-bold'
        >
          총 {data.totalTime}시간
        </text>
        <text
          x='100'
          y='115'
          textAnchor='middle'
          className='fill-gray-600 text-sm'
        >
          작업 시간
        </text>
      </svg>

      {/* 범례 */}
      <div className='space-y-3'>
        {data.categories.map((category: any, index: number) => (
          <div key={index} className='flex items-center gap-3'>
            <div
              className='h-4 w-4 rounded-full'
              style={{ backgroundColor: colorMap[category.name] }}
            ></div>
            <div className='flex-1'>
              <div className='font-semibold text-gray-800'>{category.name}</div>
              <div className='text-sm text-gray-600'>
                {category.time}h ({category.percentage}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 막대차트 컴포넌트
const BarChart = ({
  data,
  type,
}: {
  data: any
  type: 'weekly' | 'monthly'
}) => {
  const chartData = type === 'weekly' ? data.weeklyData : data.monthlyData
  const maxTotal = Math.max(
    ...chartData.map((day: any) =>
      day.categories.reduce((sum: number, cat: any) => sum + cat.time, 0)
    )
  )

  return (
    <div className='space-y-4'>
      <div className='flex h-64 items-end gap-2 rounded-xl bg-gray-50 p-4 sm:gap-3'>
        {chartData.map((day: any, dayIndex: number) => {
          const dayTotal = day.categories.reduce(
            (sum: number, cat: any) => sum + cat.time,
            0
          )
          let currentHeight = 0

          return (
            <div
              key={dayIndex}
              className='flex flex-1 flex-col items-center gap-2'
            >
              <div
                className='w-full overflow-hidden rounded-lg bg-gray-200'
                style={{ height: '200px' }}
              >
                <div className='flex h-full flex-col-reverse'>
                  {day.categories.map((category: any, catIndex: number) => {
                    const height = (category.time / maxTotal) * 100
                    currentHeight += height

                    return (
                      <div
                        key={catIndex}
                        className='transition-all duration-500 hover:opacity-80'
                        style={{
                          height: `${height}%`,
                          backgroundColor: colorMap[category.name],
                        }}
                        title={`${category.name}: ${category.time}시간`}
                      />
                    )
                  })}
                </div>
              </div>
              <div className='text-center text-xs font-medium text-gray-600 sm:text-sm'>
                {day.date}
              </div>
              <div className='text-xs text-gray-500'>
                {dayTotal.toFixed(1)}h
              </div>
            </div>
          )
        })}
      </div>

      {/* 범례 */}
      <div className='flex flex-wrap justify-center gap-4'>
        {data.categories.map((category: any, index: number) => (
          <div key={index} className='flex items-center gap-2'>
            <div
              className='h-3 w-3 rounded-full'
              style={{ backgroundColor: colorMap[category.name] }}
            ></div>
            <span className='text-sm text-gray-700'>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const statisticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily')
  const [selectedDate, setSelectedDate] = useState('2024-01-15')

  const availableDates = Object.keys(dummyData.daily).sort().reverse()
  const currentData =
    selectedPeriod === 'daily'
      ? dummyData.daily[selectedDate as keyof typeof dummyData.daily]
      : dummyData[selectedPeriod]

  const topCategory = currentData.categories[0]

  const getDateLabel = (dateStr: string) => {
    const today = '2024-01-15'
    const yesterday = '2024-01-14'
    const dayBeforeYesterday = '2024-01-13'

    if (dateStr === today) return '오늘'
    if (dateStr === yesterday) return '어제'
    if (dateStr === dayBeforeYesterday) return '엊그제'
    return dateStr
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='space-y-4 text-center'>
          <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            📊 작업 시간 통계
          </h1>
          <p className='text-lg text-gray-600 sm:text-xl'>
            나의 생산성을 한눈에 확인하세요
          </p>
        </div>

        {/* 기간 선택 탭 */}
        <Card className='relative rounded-2xl border-0 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl'>
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
          <CardContent className='relative space-y-4 p-0'>
            <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
              {Object.keys(dummyData).map(period => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'secondary'}
                  className={`flex-1 rounded-xl py-3 text-base font-semibold transition-all duration-300 ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedPeriod(period as any)}
                >
                  {timeLabels[period as keyof typeof timeLabels]}
                </Button>
              ))}
            </div>

            {/* 일별 선택 시 날짜 선택 */}
            {selectedPeriod === 'daily' && (
              <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
                {availableDates.map(date => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? 'default' : 'secondary'}
                    size='sm'
                    className={`rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
                      selectedDate === date
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {getDateLabel(date)}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className='grid gap-6 sm:gap-8 lg:grid-cols-2'>
          {/* 총 작업 시간 및 요약 */}
          <div className='space-y-6'>
            {/* 총 작업 시간 */}
            <Card className='relative rounded-2xl border-0 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl sm:p-8'>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
              <CardContent className='relative space-y-4 p-0'>
                <div className='space-y-2 text-center'>
                  <Badge className='rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
                    {selectedPeriod === 'daily'
                      ? getDateLabel(selectedDate)
                      : timeLabels[selectedPeriod]}{' '}
                    총 작업 시간
                  </Badge>
                  <div className='flex items-end justify-center gap-2'>
                    <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl'>
                      {currentData.totalTime}
                    </span>
                    <span className='mb-2 text-2xl text-gray-600 sm:text-3xl'>
                      시간
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 가장 많이 작업한 카테고리 */}
            <Card className='relative rounded-2xl border-0 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl sm:p-8'>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
              <CardContent className='relative space-y-4 p-0'>
                <h3 className='text-center text-lg font-bold text-gray-800 sm:text-xl'>
                  🏆 가장 집중한 작업
                </h3>
                <div className='flex items-center gap-4 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 p-4'>
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-r sm:h-16 sm:w-16 ${topCategory.color} flex items-center justify-center text-2xl text-white shadow-lg sm:text-3xl`}
                  >
                    {topCategory.icon}
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-xl font-bold text-gray-800 sm:text-2xl'>
                      {topCategory.name}
                    </h4>
                    <p className='text-lg text-gray-600 sm:text-xl'>
                      {topCategory.time}시간 ({topCategory.percentage}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 차트 영역 */}
          <Card className='relative rounded-2xl border-0 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl sm:p-8'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>
            <CardContent className='relative space-y-6 p-0'>
              <h3 className='text-center text-lg font-bold text-gray-800 sm:text-xl'>
                {selectedPeriod === 'daily'
                  ? '🥧 카테고리별 시간 비율'
                  : '📊 기간별 작업 시간'}
              </h3>

              {selectedPeriod === 'daily' ? (
                <PieChart data={currentData} />
              ) : (
                <BarChart data={currentData} type={selectedPeriod} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* 간단한 인사이트 */}
        <div className='grid gap-4 sm:grid-cols-3 sm:gap-6'>
          <Card className='relative rounded-2xl border-0 bg-white/80 p-4 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-6'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-green-600/10 to-emerald-600/10'></div>
            <CardContent className='relative space-y-2 p-0 text-center'>
              <div className='text-2xl sm:text-3xl'>⏰</div>
              <div className='text-sm font-bold text-gray-800 sm:text-base'>
                평균 집중 시간
              </div>
              <div className='text-lg font-semibold text-green-600 sm:text-xl'>
                {selectedPeriod === 'daily'
                  ? '2.1h'
                  : selectedPeriod === 'weekly'
                    ? '6.0h'
                    : '8.5h'}
              </div>
            </CardContent>
          </Card>

          <Card className='relative rounded-2xl border-0 bg-white/80 p-4 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-6'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10'></div>
            <CardContent className='relative space-y-2 p-0 text-center'>
              <div className='text-2xl sm:text-3xl'>🎯</div>
              <div className='text-sm font-bold text-gray-800 sm:text-base'>
                목표 달성률
              </div>
              <div className='text-lg font-semibold text-blue-600 sm:text-xl'>
                85%
              </div>
            </CardContent>
          </Card>

          <Card className='relative rounded-2xl border-0 bg-white/80 p-4 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-6'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-pink-600/10'></div>
            <CardContent className='relative space-y-2 p-0 text-center'>
              <div className='text-2xl sm:text-3xl'>📊</div>
              <div className='text-sm font-bold text-gray-800 sm:text-base'>
                생산성 지수
              </div>
              <div className='text-lg font-semibold text-purple-600 sm:text-xl'>
                92점
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default statisticsPage
