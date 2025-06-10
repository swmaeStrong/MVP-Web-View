'use client';

import { Crown, Ghost, History, MapPin, Target, Trophy } from 'lucide-react';

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

  const getEmptyStateContent = () => {
    const period = timeLabels[selectedPeriod];
    const category = selectedCategory === 'all' ? '전체' : selectedCategory;

    if (isCurrentPeriod) {
      // 현재 기간 - 동기부여 및 경쟁심 자극
      const currentMessages = {
        daily: {
          title: '🎯 오늘의 1위를 차지하세요!',
          subtitle: '아직 아무도 도전하지 않았어요',
          description: `${category} 분야에서 첫 번째 기록을 만들어보세요!`,
          cta: '지금 시작하면 오늘의 1위를 차지할 수 있어요!',
          icon: <Target className='h-16 w-16 text-orange-500' />,
          bgGradient: 'from-orange-100 via-red-50 to-pink-100',
          borderColor: 'border-orange-200',
          accentColor: 'text-orange-600',
          emoji: '🚀',
        },
        weekly: {
          title: '🏁 이번 주 1위를 차지하세요!',
          subtitle: '아직 아무도 도전하지 않았어요',
          description: `${category} 분야에서 첫 번째 기록을 만들어보세요!`,
          cta: '지금 시작하면 이번 주 1위를 차지할 수 있어요!',
          icon: <Crown className='h-16 w-16 text-blue-500' />,
          bgGradient: 'from-blue-100 via-indigo-50 to-purple-100',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
          emoji: '⚡',
        },
        monthly: {
          title: '🌟 이번 달 1위를 차지하세요!',
          subtitle: '아직 아무도 도전하지 않았어요',
          description: `${category} 분야에서 첫 번째 기록을 만들어보세요!`,
          cta: '지금 시작하면 이번 달 1위를 차지할 수 있어요!',
          icon: <Trophy className='h-16 w-16 text-purple-500' />,
          bgGradient: 'from-purple-100 via-pink-50 to-indigo-100',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          emoji: '👑',
        },
      };

      return currentMessages[selectedPeriod];
    } else {
      // 과거 기간 - 재치있는 역사적 관점
      const pastMessages = {
        daily: {
          title: '📅 조용했던 하루였네요',
          subtitle: `${selectedDateIndex}일 전`,
          description: `${category} 분야에서는 아무도 활동하지 않았던 평온한 하루였어요.`,
          cta: '역사의 빈 페이지를 발견했습니다!',
          icon: <History className='h-16 w-16 text-gray-400' />,
          bgGradient: 'from-gray-50 via-slate-50 to-blue-50',
          borderColor: 'border-gray-200',
          accentColor: 'text-gray-600',
          emoji: '🔍',
        },
        weekly: {
          title: '🌙 고요했던 한 주',
          subtitle: `${selectedDateIndex}주 전`,
          description: `${category} 분야에서는 아무런 활동이 없었던 조용한 주간이었어요.`,
          cta: '침묵의 일주일을 발견했습니다!',
          icon: <Ghost className='h-16 w-16 text-indigo-400' />,
          bgGradient: 'from-indigo-50 via-blue-50 to-cyan-50',
          borderColor: 'border-indigo-200',
          accentColor: 'text-indigo-600',
          emoji: '👻',
        },
        monthly: {
          title: '🌌 조용했던 한 달',
          subtitle: `${selectedDateIndex}개월 전`,
          description: `${category} 분야에서는 아무런 활동이 없었던 조용한 달이었어요.`,
          cta: '시간의 미스터리를 마주했습니다!',
          icon: <MapPin className='h-16 w-16 text-purple-400' />,
          bgGradient: 'from-purple-50 via-pink-50 to-indigo-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          emoji: '🌌',
        },
      };

      return pastMessages[selectedPeriod];
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className='mb-8 flex justify-center'>
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 ${content.borderColor} bg-gradient-to-br ${content.bgGradient} p-8 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
      >
        {/* 배경 장식 요소 */}
        <div className='absolute top-0 right-0 translate-x-2 -translate-y-2 text-6xl opacity-10'>
          {content.emoji}
        </div>
        <div className='absolute bottom-0 left-0 -translate-x-2 translate-y-2 text-4xl opacity-10'>
          {content.emoji}
        </div>

        {/* 헤더 */}
        <div className='mb-6 text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='rounded-full bg-white/80 p-4 shadow-lg'>
              {content.icon}
            </div>
          </div>
          <h2 className={`mb-2 text-2xl font-bold ${content.accentColor}`}>
            {content.title}
          </h2>
          <p className='text-base font-medium text-gray-600'>
            {content.subtitle}
          </p>
        </div>

        {/* 메인 내용 */}
        <div className='space-y-4 text-center'>
          <p className='text-lg leading-relaxed text-gray-700'>
            {content.description}
          </p>

          <div className='rounded-xl border border-white/50 bg-white/70 p-4 shadow-inner'>
            <p className={`text-base font-bold ${content.accentColor}`}>
              {content.cta}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
