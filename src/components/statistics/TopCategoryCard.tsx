'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { StatisticsCategory } from '@/types/statistics';
import { formatTime } from '@/utils/statisticsUtils';

interface TopCategoryCardProps {
  topCategory: StatisticsCategory | null;
}

export default function TopCategoryCard({ topCategory }: TopCategoryCardProps) {
  if (!topCategory) {
    return (
      <Card className='relative overflow-hidden border-2 bg-gradient-to-br from-gray-50 to-slate-50 shadow-lg transition-all duration-300 hover:scale-105'>
        <div className='absolute -top-10 -right-10 h-20 w-20 rounded-full bg-gradient-to-br from-gray-400/10 to-slate-400/10'></div>
        <CardContent className='relative p-6 text-center'>
          <div className='space-y-4 text-gray-400'>
            <div className='animate-pulse text-4xl'>📊</div>
            <div>
              <h3 className='mb-2 text-lg font-semibold text-gray-600'>
                작업 데이터가 없습니다
              </h3>
              <p className='text-sm text-gray-500'>
                작업을 시작하면 통계가 표시됩니다
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 성취 레벨에 따른 스타일
  const getAchievementStyle = () => {
    if (topCategory.percentage >= 70) {
      return {
        borderColor: 'border-purple-300',
        bgGradient: 'from-purple-50 to-pink-50',
        overlayGradient: 'from-purple-600/10 to-pink-600/10',
        iconBg: 'from-purple-500 to-pink-500',
        badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
        decorColor: 'from-purple-400/20 to-pink-400/20',
        trophy: '👑',
        title: '절대 강자',
      };
    } else if (topCategory.percentage >= 50) {
      return {
        borderColor: 'border-yellow-300',
        bgGradient: 'from-yellow-50 to-orange-50',
        overlayGradient: 'from-yellow-600/10 to-orange-600/10',
        iconBg: 'from-yellow-500 to-orange-500',
        badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        decorColor: 'from-yellow-400/20 to-orange-400/20',
        trophy: '🏆',
        title: '핵심 분야',
      };
    } else if (topCategory.percentage >= 30) {
      return {
        borderColor: 'border-blue-300',
        bgGradient: 'from-blue-50 to-cyan-50',
        overlayGradient: 'from-blue-600/10 to-cyan-600/10',
        iconBg: 'from-blue-500 to-cyan-500',
        badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        decorColor: 'from-blue-400/20 to-cyan-400/20',
        trophy: '🥈',
        title: '주요 활동',
      };
    } else {
      return {
        borderColor: 'border-green-300',
        bgGradient: 'from-green-50 to-emerald-50',
        overlayGradient: 'from-green-600/10 to-emerald-600/10',
        iconBg: 'from-green-500 to-emerald-500',
        badgeColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
        decorColor: 'from-green-400/20 to-emerald-400/20',
        trophy: '🥉',
        title: '균형 활동',
      };
    }
  };

  const style = getAchievementStyle();

  return (
    <Card
      className={`relative overflow-hidden border-2 ${style.borderColor} bg-gradient-to-br ${style.bgGradient} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      {/* 배경 장식 */}
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${style.overlayGradient}`}
      ></div>
      <div
        className={`absolute -top-10 -right-10 h-20 w-20 rounded-full bg-gradient-to-br ${style.decorColor}`}
      ></div>
      <div
        className={`absolute -bottom-5 -left-5 h-15 w-15 rounded-full bg-gradient-to-br ${style.decorColor}`}
      ></div>

      <CardContent className='relative p-6'>
        <div className='space-y-5 text-center'>
          {/* 헤더 */}
          <div className='flex items-center justify-center gap-3'>
            <div className='text-2xl'>{style.trophy}</div>
            <div>
              <h3 className='text-lg font-bold text-gray-800'>{style.title}</h3>
              <p className='text-xs text-gray-600'>가장 집중한 영역</p>
            </div>
          </div>

          {/* 메인 카테고리 정보 */}
          <div
            className={`rounded-2xl border-2 ${style.borderColor} bg-white/70 p-5 backdrop-blur-sm`}
          >
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-4xl text-white shadow-lg ${style.iconBg}`}
                  style={{ backgroundColor: topCategory.color }}
                >
                  {topCategory.icon}
                </div>
                {/* 트로피 배지 */}
                <div className='absolute -top-2 -right-2'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${style.badgeColor} text-xs font-bold text-white shadow-lg`}
                  >
                    1
                  </div>
                </div>
              </div>

              <div className='flex-1 text-left'>
                <h4 className='mb-2 text-xl font-bold text-gray-800'>
                  {topCategory.name}
                </h4>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl font-bold text-gray-900'>
                      {formatTime(topCategory.time)}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-sm font-medium text-gray-600'>
                      전체의
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-sm font-bold text-white ${style.badgeColor}`}
                    >
                      {topCategory.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 진행률 바 */}
            <div className='mt-4'>
              <div className='h-3 w-full rounded-full bg-gray-200'>
                <div
                  className={`h-3 rounded-full ${style.badgeColor} transition-all duration-1000 ease-out`}
                  style={{ width: `${topCategory.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 성취 메시지 */}
          <div
            className={`rounded-xl border-2 ${style.borderColor} bg-gradient-to-r ${style.bgGradient} px-4 py-3`}
          >
            <div className='text-sm font-medium text-gray-700'>
              {topCategory.percentage >= 70
                ? '🎯 완전히 몰입하고 있어요! 대단해요!'
                : topCategory.percentage >= 50
                  ? '🔥 한 분야에 집중하고 있어요!'
                  : topCategory.percentage >= 30
                    ? '⚖️ 균형잡힌 작업 분배네요!'
                    : '🌈 다양한 분야에서 활동 중이에요!'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
