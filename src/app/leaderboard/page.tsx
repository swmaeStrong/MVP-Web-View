'use client';

import { useLeaderboardInfiniteScroll } from '@/hooks/useLeaderboardInfiniteScroll';
import { layout } from '@/styles';
import { useEffect, useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardHeader from '@/components/leaderboard/LeaderboardHeader';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';
import StatsSection from '@/components/leaderboard/StatsSection';

interface User {
  id: number;
  name: string;
  hours: number;
  avatar: string;
  isMe: boolean;
  category: string;
  trend: 'up' | 'down' | 'same';
  streak: number;
  todayGain: number;
  level: number;
}

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('DEVELOPMENT');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 무한 스크롤 훅 사용
  const {
    users,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useLeaderboardInfiniteScroll({
    category: selectedCategory,
    period: selectedPeriod,
    selectedDateIndex,
  });

  const categories = [
    'DEVELOPMENT',
    'LLM',
    'Documentation',
    'Design',
    'Communication',
    'YouTube',
    'SNS',
    'Uncategorized',
  ];

  const motivationalMessages = {
    all: [
      '🔥 모든 분야에서 열정적으로 달려가고 있어요!',
      '⚡ 다양한 영역에서 성장하는 당신이 멋져요!',
      '💪 끝없는 도전정신으로 앞서나가세요!',
      '🎯 모든 카테고리를 정복해보세요!',
      '🌟 당신의 다재다능함이 빛나고 있어요!',
    ],
    DEVELOPMENT: [
      '💻 코드 한 줄 한 줄이 당신의 성장입니다!',
      '🚀 개발자의 길, 끝없는 학습의 여정이에요!',
      '⚡ 버그를 잡을 때마다 레벨업하고 있어요!',
      '🎯 완벽한 코드를 위한 집중력이 대단해요!',
      '🔥 개발 실력이 급상승하고 있습니다!',
    ],
    LLM: [
      '🤖 AI와 함께 미래를 만들어가고 있어요!',
      '⚡ LLM의 세계에서 혁신을 일으키고 있어요!',
      '🧠 인공지능의 힘으로 새로운 가능성을 열고 있어요!',
      '🎯 머신러닝의 깊은 바다를 항해하고 있어요!',
      '🌟 AI 기술로 세상을 바꿔나가고 있어요!',
    ],
    Documentation: [
      '📚 문서로 지식을 전달하는 멋진 일을 하고 있어요!',
      '✨ 명확한 설명으로 다른 사람들을 돕고 있어요!',
      '🎯 체계적인 문서화로 팀의 효율성을 높이고 있어요!',
      '💡 복잡한 내용을 쉽게 전달하는 재능이 있어요!',
      '🌟 문서 작성 스킬이 날로 향상되고 있어요!',
    ],
    Design: [
      '🎨 창의력이 폭발하는 시간들이에요!',
      '✨ 아름다운 디자인으로 세상을 바꿔요!',
      '🌈 색감과 레이아웃에 대한 감각이 뛰어나요!',
      '💫 디자인 센스가 날로 향상되고 있어요!',
      '🎭 예술적 감성이 작품에 스며들고 있어요!',
    ],
    Communication: [
      '🤝 소통의 달인이 되어가고 있어요!',
      '💡 아이디어 교환의 시간이 소중해요!',
      '🗣️ 효과적인 커뮤니케이션 능력이 빛나요!',
      '🎯 목표 달성을 위한 협업이 완벽해요!',
      '⚡ 소통 효율성이 점점 높아지고 있어요!',
    ],
    YouTube: [
      '📹 창의적인 영상 콘텐츠로 사람들을 즐겁게 해요!',
      '🎬 스토리텔링 능력이 점점 향상되고 있어요!',
      '⚡ 영상 편집 실력이 늘고 있어요!',
      '🌟 독창적인 아이디어로 구독자들을 매료시켜요!',
      '🔥 유튜브 크리에이터로서 성장하고 있어요!',
    ],
    SNS: [
      '📱 소셜 미디어로 세상과 소통하고 있어요!',
      '✨ 매력적인 콘텐츠로 팔로워들을 사로잡아요!',
      '🎯 브랜딩과 마케팅 감각이 뛰어나요!',
      '💫 인플루언서로서의 잠재력이 빛나고 있어요!',
      '🌈 창의적인 포스팅으로 영향력을 확대해요!',
    ],
    Uncategorized: [
      '🌱 새로운 영역에서의 도전이 값져요!',
      '🔍 탐구하는 자세가 정말 훌륭해요!',
      '💭 창의적 사고로 문제를 해결하고 있어요!',
      '🎲 다양한 시도들이 경험을 쌓아가요!',
      '🌟 예상치 못한 곳에서 성장하고 있어요!',
    ],
  };

  // 동기부여 메시지 순환
  useEffect(() => {
    const interval = setInterval(() => {
      const messages =
        motivationalMessages[
          selectedCategory as keyof typeof motivationalMessages
        ];
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedCategory]);

  const currentMessage =
    motivationalMessages[selectedCategory as keyof typeof motivationalMessages][
      currentMessageIndex
    ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 ${layout.container.default} py-8`}
    >
      {/* 헤더 & 동기부여 메시지 */}
      <LeaderboardHeader currentMessage={currentMessage} />

      {/* 기간 선택 탭 */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedDateIndex={selectedDateIndex}
        setSelectedDateIndex={setSelectedDateIndex}
        currentDate={currentDate}
      />

      {/* 실시간 표시기 & 경쟁 통계 */}
      <StatsSection users={users} />

      {/* 카테고리 필터 */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 리더보드 리스트 */}
      <LeaderboardList
        users={users}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
      />
    </div>
  );
}
