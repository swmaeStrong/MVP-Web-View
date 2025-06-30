'use client';

import { useLeaderboardInfiniteScroll } from '@/hooks/useLeaderboardInfiniteScroll';
import { useScrollToMyRank } from '@/hooks/useScrollToMyRank';
import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import MyRankBanner from '@/components/leaderboard/MyRankBanner';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';

// User 타입은 userStore에서 import
import { useCurrentUser, User } from '@/stores/userStore';
import { useInitUser } from '../../hooks/useInitUser';

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = User & {
  score: number;
  rank: number;
};

export default function Leaderboard() {
  // Hook 순서를 항상 동일하게 유지
  const currentUser = useCurrentUser();
  const { initializeUser } = useInitUser();
  const { scrollToMyRank } = useScrollToMyRank();
  const { getThemeClass } = useTheme();

  // Handle user initialization with useEffect
  useEffect(() => {
    if (!currentUser) {
      console.log('🔄 사용자 정보가 없어 초기화 시도...');
      initializeUser().catch(error => {
        console.error('❌ 사용자 초기화 실패:', error);
      });
    }
  }, [currentUser, initializeUser]);

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

  // 현재 선택된 기간의 날짜 인덱스
  const selectedDateIndex = dateIndices[selectedPeriod];

  // 날짜 인덱스 설정 함수
  const setSelectedDateIndex = (index: number) => {
    setDateIndices(prev => ({
      ...prev,
      [selectedPeriod]: index,
    }));
  };

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

  const categories = LEADERBOARD_CATEGORIES;

  return (
    <div className={`min-h-screen p-4 lg:p-8 ${getThemeClass('background')}`}>
      <div className='mx-auto max-w-6xl space-y-6 lg:space-y-8'>

        {/* 기간 선택 탭 */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedDateIndex={selectedDateIndex}
          setSelectedDateIndex={setSelectedDateIndex}
          currentDate={currentDate}
        />

        {/* 카테고리 필터 */}
        <div className='mb-6 flex justify-center'>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* 내 순위 배너 */}
        <MyRankBanner
          category={selectedCategory}
          period={selectedPeriod}
          selectedDateIndex={selectedDateIndex}
          onScrollToMyRank={scrollToMyRank}
          totalUsers={users.length} // 전체 사용자 수 전달
          userId={currentUser?.id} // 고정된 userId 전달로 중복 호출 방지
        />

        {/* 리더보드 리스트 */}
        <LeaderboardList
          users={users as LeaderboardUser[]}
          isLoading={isLoading}
          isError={isError}
          error={error}
          isFetchingNextPage={isFetchingNextPage}
          refetch={refetch}
          selectedPeriod={selectedPeriod}
          selectedCategory={selectedCategory}
          selectedDateIndex={selectedDateIndex}
        />
      </div>
    </div>
  );
}
