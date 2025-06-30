'use client';

import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';

// 타입 임포트
import { User, useUserStore } from '@/stores/userStore';

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = User & {
  score: number;
  rank: number;
};

// 데모용 더미 데이터 생성 - 영어 이름으로 구성
const generateDummyUsers = (): LeaderboardUser[] => {
  const englishNames = [
    'Alex', 'Brian', 'Chris', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack',
    'Kate', 'Luke', 'Maya', 'Nick', 'Olivia', 'Paul', 'Quinn', 'Ryan', 'Sara', 'Tom',
    'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zack', 'Anna', 'Ben', 'Chloe', 'Dan',
    'Eva', 'Felix', 'Gina', 'Hugo', 'Ivy', 'Jake', 'Kira', 'Leo', 'Mia', 'Noah',
    'Ava', 'Blake', 'Clara', 'Drew', 'Ella', 'Finn', 'Zoe', 'Ian', 'Jade', 'Kyle',
    'Lily', 'Max', 'Nina', 'Owen', 'Piper', 'Reed', 'Sky', 'Tara', 'Evan', 'Vera',
    'Wade', 'Xara', 'Yale', 'Zara', 'Amy', 'Cole', 'Dex', 'Elle', 'Fox', 'Grey',
    'Hope', 'Ivan', 'Jess', 'Kent', 'Lane', 'Milo', 'Nora', 'Oscar', 'Page', 'Rory',
    'Sage', 'Troy', 'Vale', 'Will', 'Zion', 'Ace', 'Bay', 'Cam', 'Eve', 'Kai',
    'Lee', 'Neo', 'Ray', 'Sam', 'Ty', 'Uma', 'Val', 'Win', 'Zoe', 'Ash', 'Rex', 'Joy'
  ];

  return Array.from({ length: 100 }, (_, index) => {
    // 닉네임을 랜덤하게 선택하되, 중복을 피하기 위해 인덱스 기반으로 조정
    const baseName = englishNames[index % englishNames.length];
    const nickname = index >= englishNames.length ? `${baseName}${Math.floor(index / englishNames.length) + 1}` : baseName;
    
    // 상위권일수록 높은 점수 (시간 단위는 초)
    const baseScore = 36000 - (index * 350) + Math.floor(Math.random() * 300); // 10시간에서 시작
    
    return {
      id: `demo-user-${index + 1}`,
      nickname: nickname,
      score: Math.max(baseScore, 1800), // 최소 30분
      rank: index + 1,
    };
  });
};

// 데모용 QueryClient 생성
const demoQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

// 더 이상 MyRank 데이터 설정이 필요하지 않음

function LeaderboardDemoContent() {
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

  // 데모 데이터
  const [demoUsers] = useState<LeaderboardUser[]>(generateDummyUsers());
  const categories = LEADERBOARD_CATEGORIES;

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl space-y-6 sm:space-y-8'>


        {/* 기간 선택 탭 */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedDateIndex={selectedDateIndex}
          setSelectedDateIndex={setSelectedDateIndex}
          currentDate={currentDate}
        />

        {/* 카테고리 필터 */}
        <div className='flex justify-center mb-8'>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>


        {/* 리더보드 리스트 */}
        <LeaderboardList
          users={demoUsers}
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
    </div>
  );
}

export default function LeaderboardDemoPage() {
  return (
    <QueryClientProvider client={demoQueryClient}>
      <LeaderboardDemoContent />
    </QueryClientProvider>
  );
}