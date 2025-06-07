'use client';

<<<<<<< Updated upstream
import {
  animations,
  categoryColors,
  commonCombinations,
  extendedRankColors,
  layout,
  rankColors,
  typography,
  utils,
} from '@/styles';
=======
import { useLeaderboardInfiniteScroll } from '@/hooks/useLeaderboardInfiniteScroll';
import { layout } from '@/styles';
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
const generateUsers = (): User[] => {
  const koreanNames = [
    '김민수',
    '이영희',
    '박정현',
    '최수빈',
    '정다은',
    '한지원',
    '임서준',
    '오하늘',
    '장민주',
    '윤서연',
  ];
  const englishNames = [
    'John Smith',
    'Emma Johnson',
    'Michael Brown',
    'Sarah Davis',
    'David Wilson',
    'Lisa Anderson',
    'Chris Taylor',
    'Amy Martinez',
    'James Lee',
    'Jessica Kim',
  ];
  const allNames = [...koreanNames, ...englishNames];

  const categories = ['개발', '디자인', '회의', '기타'];
  const trends: ('up' | 'down' | 'same')[] = ['up', 'down', 'same'];

  const users: User[] = [];

  // 50명의 사용자 생성
  for (let i = 0; i < 50; i++) {
    const isMe = i === 7; // 8번째 사용자를 '나'로 설정
    const name = isMe
      ? '나'
      : allNames[Math.floor(Math.random() * allNames.length)];

    users.push({
      id: i + 1,
      name,
      hours: Math.floor(Math.random() * 120) + 20, // 20~140시간
      avatar: String.fromCharCode(65 + (i % 26)), // A~Z 순환
      isMe,
      category: categories[Math.floor(Math.random() * categories.length)],
      trend: trends[Math.floor(Math.random() * trends.length)],
      streak: Math.floor(Math.random() * 30) + 1, // 1~30일
      todayGain: Math.floor(Math.random() * 8) + 1, // 1~8시간
      level: Math.floor(Math.random() * 50) + 1, // 1~50레벨
    });
  }

  // 시간순으로 정렬
  return users.sort((a, b) => b.hours - a.hours);
};

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const categories = ['all', '개발', '디자인', '회의', '기타'];
=======
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
>>>>>>> Stashed changes

  const motivationalMessages = {
    all: [
      '🔥 모든 분야에서 열정적으로 달려가고 있어요!',
      '⚡ 다양한 영역에서 성장하는 당신이 멋져요!',
      '💪 끝없는 도전정신으로 앞서나가세요!',
      '🎯 모든 카테고리를 정복해보세요!',
      '🌟 당신의 다재다능함이 빛나고 있어요!',
    ],
<<<<<<< Updated upstream
    개발: [
=======
    DEVELOPMENT: [
>>>>>>> Stashed changes
      '💻 코드 한 줄 한 줄이 당신의 성장입니다!',
      '🚀 개발자의 길, 끝없는 학습의 여정이에요!',
      '⚡ 버그를 잡을 때마다 레벨업하고 있어요!',
      '🎯 완벽한 코드를 위한 집중력이 대단해요!',
      '🔥 개발 실력이 급상승하고 있습니다!',
    ],
<<<<<<< Updated upstream
    디자인: [
=======
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
>>>>>>> Stashed changes
      '🎨 창의력이 폭발하는 시간들이에요!',
      '✨ 아름다운 디자인으로 세상을 바꿔요!',
      '🌈 색감과 레이아웃에 대한 감각이 뛰어나요!',
      '💫 디자인 센스가 날로 향상되고 있어요!',
      '🎭 예술적 감성이 작품에 스며들고 있어요!',
    ],
<<<<<<< Updated upstream
    회의: [
=======
    Communication: [
>>>>>>> Stashed changes
      '🤝 소통의 달인이 되어가고 있어요!',
      '💡 아이디어 교환의 시간이 소중해요!',
      '🗣️ 효과적인 커뮤니케이션 능력이 빛나요!',
      '🎯 목표 달성을 위한 협업이 완벽해요!',
<<<<<<< Updated upstream
      '⚡ 회의 효율성이 점점 높아지고 있어요!',
    ],
    기타: [
=======
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
>>>>>>> Stashed changes
      '🌱 새로운 영역에서의 도전이 값져요!',
      '🔍 탐구하는 자세가 정말 훌륭해요!',
      '💭 창의적 사고로 문제를 해결하고 있어요!',
      '🎲 다양한 시도들이 경험을 쌓아가요!',
      '🌟 예상치 못한 곳에서 성장하고 있어요!',
    ],
  };
<<<<<<< Updated upstream

  // 사용자 초기 로드
  useEffect(() => {
    const initialUsers = generateUsers();
    setUsers(initialUsers);
  }, []);

  // 카테고리 필터링
  useEffect(() => {
    let filtered = users;
    if (selectedCategory !== 'all') {
      filtered = users.filter(user => user.category === selectedCategory);
    }
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, 20)); // 처음 20명 표시
    setHasMore(filtered.length > 20);
  }, [users, selectedCategory]);
=======
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  // 더 많은 사용자 로드
  const loadMoreUsers = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    // 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentCount = displayedUsers.length;
    const nextBatch = filteredUsers.slice(currentCount, currentCount + 20);

    setDisplayedUsers(prev => [...prev, ...nextBatch]);
    setHasMore(currentCount + nextBatch.length < filteredUsers.length);
    setLoadingMore(false);
  };

  // 스크롤 감지로 자동 로드
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1000
      ) {
        loadMoreUsers();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedUsers, filteredUsers, loadingMore, hasMore]);

  const getRankInfo = (index: number) => {
    const rank = index + 1;
    if (rank <= 10) {
      return rankColors[rank as keyof typeof rankColors];
    } else if (rank <= 20) {
      return extendedRankColors.expert;
    } else if (rank <= 35) {
      return extendedRankColors.challenger;
    } else {
      return extendedRankColors.rookie;
    }
  };

  const getTotalStats = () => ({
    totalCompetitors: filteredUsers.length,
    topRecord: filteredUsers[0]?.hours || 0,
    averageGrowth:
      Math.round(
        (filteredUsers.reduce((acc, user) => acc + user.todayGain, 0) /
          filteredUsers.length) *
          10
      ) / 10,
    myRank: filteredUsers.findIndex(user => user.isMe) + 1,
  });

  const stats = getTotalStats();
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      {/* 실시간 표시기 */}
      <div className={utils.cn(layout.flex.center, 'mb-6')}>
        <div className={animations.live.container}>
          <div className={animations.live.dot}>
            <div className={animations.live.ping}></div>
          </div>
          <span className={animations.live.text}>실시간</span>
        </div>
      </div>

      {/* 경쟁 통계 */}
      <div className={utils.cn(layout.grid.cards, 'mb-8')}>
        <div className={commonCombinations.cardCombos.glass}>
          <div className={layout.flex.colCenter}>
            <div className={`${typography.heading.h2} text-purple-600`}>
              {stats.totalCompetitors}
            </div>
            <div className={typography.special.muted}>총 경쟁자</div>
          </div>
        </div>

        <div className={commonCombinations.cardCombos.glass}>
          <div className={layout.flex.colCenter}>
            <div className={`${typography.heading.h2} text-yellow-600`}>
              {stats.topRecord}h
            </div>
            <div className={typography.special.muted}>1위 기록</div>
          </div>
        </div>

        <div className={commonCombinations.cardCombos.glass}>
          <div className={layout.flex.colCenter}>
            <div className={`${typography.heading.h2} text-green-600`}>
              {stats.averageGrowth}h
            </div>
            <div className={typography.special.muted}>평균 증가</div>
          </div>
        </div>

        <div className={commonCombinations.cardCombos.glass}>
          <div className={layout.flex.colCenter}>
            <div className={`${typography.heading.h2} text-blue-600`}>
              #{stats.myRank}
            </div>
            <div className={typography.special.muted}>내 순위</div>
          </div>
        </div>
      </div>

      {/* 동기부여 메시지 */}
      <div
        className={`${commonCombinations.cardCombos.glass} mb-8 text-center`}
      >
        <p
          className={`${typography.body.large} text-gray-700 ${animations.transition.smooth}`}
        >
          {currentMessage}
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className={utils.cn(layout.grid.categories, 'mb-8')}>
        {categories.map(category => {
          const isSelected = selectedCategory === category;
          const categoryColor =
            categoryColors[category as keyof typeof categoryColors];

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={utils.cn(
                'relative overflow-hidden rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 sm:text-sm',
                isSelected
                  ? `bg-gradient-to-r ${categoryColor.buttonGradient} scale-105 transform text-white shadow-lg`
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${categoryColor.gradient} opacity-0 transition-opacity duration-300 hover:opacity-10`}
              ></div>
              <span className='relative z-10'>
                {category === 'all' ? '전체' : category}
              </span>
            </button>
          );
        })}
      </div>

      {/* 상위 3명 - 특별 디스플레이 */}
      <div className='mb-8'>
        <h2
          className={`${typography.heading.h3} mb-6 text-center text-gray-800`}
        >
          🏆 TOP 3
        </h2>
        <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
          {displayedUsers.slice(0, 3).map((user, index) => {
            const rank = index + 1;
            const medals = ['🥇', '🥈', '🥉'];
            const gradients = [
              'from-yellow-400 via-yellow-500 to-amber-600',
              'from-gray-300 via-gray-400 to-gray-500',
              'from-amber-600 via-amber-700 to-orange-700',
            ];
            const bgGradients = [
              'from-yellow-50 to-amber-100',
              'from-gray-50 to-gray-100',
              'from-orange-50 to-amber-100',
            ];

            return (
              <div
                key={user.id}
                className={utils.cn(
                  'relative transform rounded-xl p-6 shadow-2xl transition-all duration-300 hover:scale-105',
                  `bg-gradient-to-br ${bgGradients[index]}`,
                  user.isMe ? 'ring-4 ring-purple-400' : '',
                  animations.hover.glow
                )}
              >
                {/* 메달 배지 */}
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 transform'>
                  <div className={`text-4xl ${animations.pulse.bounce}`}>
                    {medals[index]}
                  </div>
                </div>

                {/* 순위 숫자 */}
                <div className='mb-4 pt-6 text-center'>
                  <div
                    className={`bg-gradient-to-r text-6xl font-bold ${gradients[index]} bg-clip-text text-transparent`}
                  >
                    #{rank}
                  </div>
                </div>

                {/* 사용자 정보 */}
                <div className='mb-4 text-center'>
                  <div
                    className={`mx-auto mb-3 h-20 w-20 rounded-full bg-gradient-to-r ${gradients[index]} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
                  >
                    {user.avatar}
                  </div>
                  <h3 className={`${typography.heading.h4} mb-1 text-gray-800`}>
                    {user.name}
                  </h3>
                  {user.isMe && (
                    <div className='inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-1 text-sm font-bold text-white'>
                      ME
                    </div>
                  )}
                </div>

                {/* 시간 정보 */}
                <div className='text-center'>
                  <div
                    className={`${typography.heading.h2} mb-1 text-gray-900`}
                  >
                    {user.hours}h
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${categoryColors[user.category as keyof typeof categoryColors].badgeClass}`}
                  >
                    {user.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4위 이하 - 간단한 리스트 */}
      {displayedUsers.length > 3 && (
        <div className='mb-8'>
          <h2 className={`${typography.heading.h4} mb-4 text-gray-700`}>
            나머지 순위
          </h2>
          <div className='space-y-2'>
            {displayedUsers.slice(3).map((user, index) => {
              const rank = index + 4;
              const rankInfo = getRankInfo(index + 3);

              return (
                <div
                  key={user.id}
                  className={utils.cn(
                    'flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm',
                    animations.hover.lift,
                    animations.transition.default,
                    user.isMe
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 ring-2 ring-purple-300'
                      : ''
                  )}
                >
                  {/* 좌측 - 순위 & 사용자 정보 */}
                  <div className='flex items-center space-x-4'>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rankInfo.bgColor} ${rankInfo.textColor}`}
                    >
                      {rank}
                    </div>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${rankInfo.avatarClass}`}
                    >
                      {user.avatar}
                    </div>

                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h3
                          className={`${typography.body.default} font-semibold text-gray-800`}
                        >
                          {user.name}
                        </h3>
                        {user.isMe && (
                          <span className='rounded-full bg-purple-100 px-2 py-1 text-xs font-bold text-purple-700'>
                            ME
                          </span>
                        )}
                      </div>
                      <p
                        className={`${typography.special.caption} ${rankInfo.textColor}`}
                      >
                        {rankInfo.title}
                      </p>
                    </div>
                  </div>

                  {/* 우측 - 시간 & 카테고리 */}
                  <div className='flex items-center space-x-4 text-right'>
                    <div>
                      <div className={`${typography.heading.h5} text-gray-900`}>
                        {user.hours}h
                      </div>
                    </div>

                    <div
                      className={`rounded-full border px-2 py-1 text-xs ${categoryColors[user.category as keyof typeof categoryColors].badgeClass}`}
                    >
                      {user.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 더 보기 버튼 */}
      {hasMore && (
        <div className={layout.flex.center}>
          <button
            onClick={loadMoreUsers}
            disabled={loadingMore}
            className={utils.cn(
              commonCombinations.buttonCombos.primary,
              loadingMore ? 'cursor-not-allowed opacity-50' : ''
            )}
          >
            {loadingMore ? (
              <>
                <div className={animations.loading.spinner}></div>
                <span className='ml-2'>로딩 중...</span>
              </>
            ) : (
              `더 보기 (${filteredUsers.length - displayedUsers.length}명 남음)`
            )}
          </button>
        </div>
      )}
=======
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
>>>>>>> Stashed changes
    </div>
  );
}
