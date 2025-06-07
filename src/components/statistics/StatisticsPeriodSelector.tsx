'use client';

import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { PeriodType } from '@/types/statistics';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface StatisticsPeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: string[];
}

export default function StatisticsPeriodSelector({
  selectedPeriod,
  onPeriodChange,
  selectedDate,
  onDateChange,
  availableDates,
}: StatisticsPeriodSelectorProps) {
  const periods = [
    {
      key: 'daily' as const,
      label: '일별',
      icon: <Calendar className='h-4 w-4' />,
      description: '매일의 세부 작업 패턴',
    },
    {
      key: 'weekly' as const,
      label: '주별',
      icon: <Clock className='h-4 w-4' />,
      description: '주간 트렌드 분석',
    },
    {
      key: 'monthly' as const,
      label: '월별',
      icon: <TrendingUp className='h-4 w-4' />,
      description: '장기 성장 추이',
    },
  ];

  return (
    <Card className='mb-8 border-2 bg-gradient-to-br from-purple-50/50 to-blue-50/50'>
      <CardContent className='p-6'>
        {/* 기간 선택 버튼들 */}
        <div className='mb-6 flex flex-col gap-3 sm:flex-row'>
          {periods.map(period => {
            const isSelected = selectedPeriod === period.key;
            return (
              <Button
                key={period.key}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onPeriodChange(period.key)}
                className={`flex h-auto flex-1 flex-col items-center gap-2 px-6 py-4 transition-all duration-200 ${
                  isSelected
                    ? 'scale-105 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-700 hover:to-blue-700'
                    : 'hover:scale-102 hover:shadow-md'
                } `}
              >
                {period.icon}
                <span className='font-semibold'>{period.label}</span>
                <span className='text-xs opacity-80'>{period.description}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
