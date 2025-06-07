'use client';

import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Star, Target, Trophy, Zap } from 'lucide-react';

interface EmptyStateProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  selectedCategory: string;
  selectedDateIndex: number;
  refetch?: () => void;
}

export default function EmptyState({
  selectedPeriod,
  selectedCategory,
  selectedDateIndex,
  refetch,
}: EmptyStateProps) {
  const timeLabels = {
    daily: '일간',
    weekly: '주간',
    monthly: '월간',
  };

  // 현재 기간인지 확인 (오늘, 이번주, 이번달)
  const isCurrentPeriod = selectedDateIndex === 0;

  const getMotivationalMessage = () => {
    const period = timeLabels[selectedPeriod];
    const category = selectedCategory === 'all' ? '전체' : selectedCategory;

    if (isCurrentPeriod) {
      // 현재 기간(오늘, 이번주, 이번달)인 경우 동기부여 메시지
      const motivationalMessages = {
        daily: {
          title: '🎯 오늘이 기회입니다!',
          description: `${category} 카테고리에서 첫 번째 활동을 시작해보세요.`,
          cta: '지금 시작하면 오늘의 1등이 될 수 있어요!',
          icon: <Target className='h-12 w-12 text-blue-500' />,
          gradient: 'from-blue-100 to-purple-100',
        },
        weekly: {
          title: '🚀 이번 주를 정복하세요!',
          description: `${category} 분야에서 이번 주 첫 번째 도전자가 되어보세요.`,
          cta: '지금 시작하면 이번 주 챔피언이 될 수 있어요!',
          icon: <Star className='h-12 w-12 text-yellow-500' />,
          gradient: 'from-yellow-100 to-orange-100',
        },
        monthly: {
          title: '👑 이번 달의 왕좌를 차지하세요!',
          description: `${category} 영역에서 이번 달 전설이 시작됩니다.`,
          cta: '지금이 이번 달 리더가 될 완벽한 타이밍입니다!',
          icon: <Trophy className='h-12 w-12 text-purple-500' />,
          gradient: 'from-purple-100 to-pink-100',
        },
      };

      return motivationalMessages[selectedPeriod];
    } else {
      // 과거 기록인 경우
      return {
        title: `${period} ${category} 기록이 없습니다`,
        description: `이 기간에는 ${category} 카테고리 활동이 없었어요.`,
        cta: '다른 기간이나 카테고리를 확인해보세요.',
        icon: <Zap className='h-12 w-12 text-gray-400' />,
        gradient: 'from-gray-100 to-slate-100',
      };
    }
  };

  const message = getMotivationalMessage();

  return (
    <div className='mb-8 flex justify-center'>
      <Card
        className={`w-full max-w-md bg-gradient-to-br ${message.gradient} border-2 border-dashed`}
      >
        <CardHeader className='pb-4 text-center'>
          <div className='mb-4 flex justify-center'>{message.icon}</div>
          <CardTitle className='text-xl font-bold text-gray-800'>
            {message.title}
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-4 text-center'>
          <p className='leading-relaxed text-gray-600'>{message.description}</p>

          <div className='rounded-lg border bg-white/70 p-4'>
            <p className='text-sm font-semibold text-gray-700'>{message.cta}</p>
          </div>

          <div className='flex flex-wrap justify-center gap-2'>
            <Badge variant='secondary' className='text-xs'>
              {timeLabels[selectedPeriod]}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {selectedCategory === 'all' ? '전체' : selectedCategory}
            </Badge>
          </div>

          {/* 액션 버튼들 */}
          <div className='space-y-3 pt-2'>
            {refetch && (
              <Button
                onClick={() => refetch()}
                variant='outline'
                className='w-full'
                size='sm'
              >
                🔄 다시 불러오기
              </Button>
            )}

            {isCurrentPeriod && (
              <div className='rounded-md bg-blue-50 p-2 text-xs text-blue-600'>
                💡 지금 활동을 시작하면 바로 순위에 반영됩니다!
              </div>
            )}
          </div>

          {/* 추가 정보 */}
          <div className='rounded-md bg-white/50 p-3 text-xs text-gray-500'>
            <strong>참고:</strong> 리더보드는 실시간으로 업데이트되며, 카테고리
            변경을 통해 다른 분야의 순위도 확인할 수 있습니다.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
