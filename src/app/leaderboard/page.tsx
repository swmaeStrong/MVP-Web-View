'use client';

import { useLeaderboardInfiniteScroll } from '@/hooks/useLeaderboardInfiniteScroll';
import { useScrollToMyRank } from '@/hooks/useScrollToMyRank';
import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import Link from 'next/link';
import { useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardHeader from '@/components/leaderboard/LeaderboardHeader';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import MyRankBanner from '@/components/leaderboard/MyRankBanner';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';
import { LiveIndicator } from '@/components/leaderboard/StatsSection';
import TierSystemTooltip from '@/components/leaderboard/TierSystemTooltip';

// User 타입은 userStore에서 import
import { User } from '@/stores/userStore';

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = User & {
  score: number;
  rank: number;
};

export default function Leaderboard() {
  const { scrollToMyRank } = useScrollToMyRank();
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
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl space-y-6 sm:space-y-8'>
        {/* 테스트 모드 버튼 */}
        <div className='mb-4 text-center'>
          <Link href='/leaderboard-test'>
            <button className='inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-600 transition-colors hover:bg-green-200'>
              🧪 더미 데이터로 테스트해보기
            </button>
          </Link>
        </div>

        {/* 헤더 */}
        <LeaderboardHeader />

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

        {/* 티어 설명과 카테고리 필터 */}
        <div className='relative mb-8'>
          {/* 가장 좌측: 티어 설명 (absolute 고정) */}
          <div className='absolute top-0 left-0 z-10'>
            <TierSystemTooltip />
          </div>

          {/* 카테고리 필터 (중앙 고정) */}
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
          userId='a' // 고정된 userId 전달로 중복 호출 방지
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
