'use client';

import { layout } from '@/styles';
import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { useEffect, useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardHeader from '@/components/leaderboard/LeaderboardHeader';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';
import { LiveIndicator } from '@/components/leaderboard/StatsSection';
import TierSystemTooltip from '@/components/leaderboard/TierSystemTooltip';

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
