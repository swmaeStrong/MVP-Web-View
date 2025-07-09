'use client';

import { useLeaderboardInfiniteScroll } from '@/hooks/useLeaderboardInfiniteScroll';
import { useScrollToMyRank } from '@/hooks/useScrollToMyRank';
import { useTheme } from '@/hooks/useTheme';
import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { useEffect, useRef, useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import MyRankBanner from '@/components/leaderboard/MyRankBanner';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';

// User 타입은 userStore에서 import
import {
  CategoryFilterSkeleton,
  LeaderboardListSkeleton,
  MyRankBannerSkeleton,
  PeriodSelectorSkeleton
} from '@/components/common/LeaderboardSkeleton';
import { useCurrentUser, User } from '@/stores/userStore';
import { useInitUser } from '../../hooks/useInitUser';

// LeaderBoard.LeaderBoardResponse 타입을 직접 사용

// 필요한 유틸리티 함수들 import
import { useMyRank } from '@/hooks/useMyRank';
import { getKSTDate, getKSTDateStringFromDate, getKSTWeeklyDateString, getKSTMonthlyDateString } from '@/utils/timezone';

export default function Leaderboard() {
  // Hook 순서를 항상 동일하게 유지
  const currentUser = useCurrentUser();
  const { initializeUser } = useInitUser();
  const { scrollToMyRank } = useScrollToMyRank();
  const { getThemeClass, getThemeTextColor } = useTheme();

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
    CATEGORIES.TOTAL
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

  // 리더보드 컨테이너 ref
  const leaderboardContainerRef = useRef<HTMLDivElement>(null);
  
  // MyRank 정보를 먼저 가져오기 위한 import
  const { myRank, rank } = useMyRank({
    category: selectedCategory,
    type: selectedPeriod,
    date: (() => {
      const today = getKSTDate();
      if (selectedPeriod === 'daily') {
        const targetDate = new Date(
          today.getTime() - selectedDateIndex * 24 * 60 * 60 * 1000
        );
        return getKSTDateStringFromDate(targetDate);
      } else if (selectedPeriod === 'weekly') {
        return getKSTWeeklyDateString(selectedDateIndex);
      } else if (selectedPeriod === 'monthly') {
        return getKSTMonthlyDateString(selectedDateIndex);
      }
      return getKSTDateStringFromDate(today);
    })(),
    userId: currentUser?.id,
  });
  
  // 랭크를 기준으로 초기 페이지 계산 (한 페이지에 10개씩)
  const calculateInitialPage = (rank: number | null) => {
    if (!rank || rank <= 0) return 1;
    return Math.max(1, Math.floor((rank - 1) / 10) + 1);
  };
  
  const initialPage = calculateInitialPage(rank);

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
    containerRef: leaderboardContainerRef,
    initialPage, // 계산된 초기 페이지 전달
  });

  const categories = LEADERBOARD_CATEGORIES;

  // 전체 로딩 상태
  if (isLoading && users.length === 0) {
    return (
      <div className={`min-h-screen p-4 lg:p-8 ${getThemeClass('background')}`}>
        <div className='mx-auto max-w-6xl space-y-6 lg:space-y-8'>
          <PeriodSelectorSkeleton />
          <CategoryFilterSkeleton />
          <MyRankBannerSkeleton />
          <LeaderboardListSkeleton itemCount={15} />
        </div>
      </div>
    );
  }

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
        <div className='mb-6 space-y-3'>
          <div className='flex justify-center'>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
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
          users={users}
          isLoading={isLoading}
          isError={isError}
          error={error}
          isFetchingNextPage={isFetchingNextPage}
          refetch={refetch}
          selectedPeriod={selectedPeriod}
          selectedCategory={selectedCategory}
          selectedDateIndex={selectedDateIndex}
          containerRef={leaderboardContainerRef}
        />
      </div>
    </div>
  );
}
