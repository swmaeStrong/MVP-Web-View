'use client';

import { layout } from '@/styles';
import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { useEffect, useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardHeader from '@/components/leaderboard/LeaderboardHeader';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';
import {
  CompetitorStats,
  LiveIndicator,
} from '@/components/leaderboard/StatsSection';

// 더미 데이터 임포트
import dummyData from '@/data/dummyLeaderboard.json';

// User Store 임포트
import { User, useUserStore } from '@/stores/userStore';

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = User & {
  score: number;
  rank: number;
};

export default function LeaderboardTest() {
  const { currentUser, setCurrentUser } = useUserStore();

  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  // 각 기간별로 독립적인 날짜 인덱스 관리
  const [dateIndices, setDateIndices] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORIES.DEVELOPMENT
  );
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 현재 선택된 기간의 날짜 인덱스
  const selectedDateIndex = dateIndices[selectedPeriod];

  // 날짜 인덱스 설정 함수
  const setSelectedDateIndex = (index: number) => {
    setDateIndices(prev => ({
      ...prev,
      [selectedPeriod]: index,
    }));
  };

  // 더미 데이터를 LeaderboardUser 형식으로 변환
  const users: LeaderboardUser[] = dummyData.map((user, index) => ({
    id: user.id,
    nickname: user.nickname,
    score: user.score,
    rank: index + 1,
  }));

  // 50번째 사용자를 현재 사용자로 설정
  useEffect(() => {
    if (!currentUser && users.length > 49) {
      setCurrentUser({
        id: users[49].id,
        nickname: users[49].nickname,
      });
    }
  }, [currentUser, setCurrentUser, users]);

  const categories = LEADERBOARD_CATEGORIES;

  const motivationalMessages = {
    all: [
      '🔥 모든 분야에서 열정적으로 달려가고 있어요!',
      '⚡ 다양한 영역에서 성장하는 당신이 멋져요!',
      '💪 끝없는 도전정신으로 앞서나가세요!',
      '🎯 모든 카테고리를 정복해보세요!',
      '🌟 당신의 다재다능함이 빛나고 있어요!',
    ],
    Development: [
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

  // 더미 스크롤 함수
  const scrollToMyRank = () => {
    // 현재 사용자 순위로 스크롤
    if (currentUser) {
      const targetElement = document.querySelector(
        `[data-user-id="${currentUser.id}"]`
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 ${layout.container.default} py-8`}
    >
      {/* 테스트 라벨 */}
      <div className='mb-4 text-center'>
        <span className='inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600'>
          🧪 TEST MODE - 더미 데이터 사용중 (100명의 리더보드)
        </span>
      </div>

      {/* 헤더 & 동기부여 메시지 */}
      <LeaderboardHeader currentMessage={currentMessage} />

      {/* 실시간 경쟁 표시기 - LeaderboardHeader 바로 아래로 이동 */}
      <LiveIndicator />

      {/* 기간 선택 탭 */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedDateIndex={selectedDateIndex}
        setSelectedDateIndex={setSelectedDateIndex}
        currentDate={currentDate}
      />

      {/* 카테고리 필터와 총 경쟁자 정보를 같은 줄에 배치 */}
      <div className='mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        {/* 카테고리 필터 */}
        <div className='flex-1'>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* 총 경쟁자 정보 */}
        <div className='lg:ml-6'>
          <CompetitorStats users={users} />
        </div>
      </div>

      {/* 내 순위 배너 - 더미 데이터로 50번째 사용자 표시 */}
      {currentUser && (
        <div className='mb-6 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 shadow-lg shadow-gray-100/50 transition-all duration-300 hover:scale-[1.02]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <img
                  src='/icons/rank/gold.png'
                  alt='Gold'
                  width={48}
                  height={48}
                  className='drop-shadow-sm'
                />
              </div>
              <div>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-lg font-bold text-gray-800'>
                    {currentUser.nickname}
                  </h3>
                  <span className='animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 text-xs font-bold text-white'>
                    YOU
                  </span>
                </div>
                <div className='flex items-center space-x-2 text-sm'>
                  <span className='font-bold text-gray-600'>50th place</span>
                  <span className='text-gray-400'>•</span>
                  <span className='text-gray-600'>
                    점수: {users[49]?.score}
                  </span>
                  <span className='text-gray-400'>•</span>
                  <span className='text-xs text-gray-600'>Gold</span>
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='flex items-center space-x-2'>
                <div>
                  <div className='text-2xl font-bold text-gray-600'>#50</div>
                  <div className='text-xs text-gray-500'>순위</div>
                </div>
              </div>
              <button
                onClick={scrollToMyRank}
                className='mt-2 text-xs text-blue-600 underline hover:text-blue-800'
              >
                리더보드에서 찾기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 리더보드 리스트 */}
      <LeaderboardList
        users={users}
        isLoading={false}
        isError={false}
        error={null}
        isFetchingNextPage={false}
        refetch={() => {}}
        selectedPeriod={selectedPeriod}
        selectedCategory={selectedCategory}
        selectedDateIndex={selectedDateIndex}
      />
    </div>
  );
}
