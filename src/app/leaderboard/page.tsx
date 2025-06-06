'use client';

import { getLeaderBoard } from '@/shared/api/get';
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
import { useEffect, useState } from 'react';

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

// API 응답 타입 (실제 API 응답 구조에 맞춤)
type APILeaderBoardResponse = LeaderBoard.LeaderBoardResponse;

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const timeLabels = {
    daily: '일간',
    weekly: '주간',
    monthly: '월간',
  };

  // API 데이터를 User 형태로 변환하는 함수
  const transformAPIUser = (
    apiUser: APILeaderBoardResponse,
    index: number
  ): User => ({
    id: parseInt(apiUser.userId),
    name: apiUser.nickname,
    hours: apiUser.score,
    avatar: String.fromCharCode(65 + (index % 26)), // A~Z 순환
    isMe: false, // API에서 현재 사용자 정보를 제공하면 수정
    category:
      selectedCategory === 'all'
        ? categories[Math.floor(Math.random() * (categories.length - 1)) + 1]
        : selectedCategory, // 카테고리는 요청 파라미터에서 결정
    trend: 'same' as const, // API에서 트렌드 정보를 제공하면 수정
    streak: Math.floor(Math.random() * 30) + 1, // API에서 연속 일수를 제공하면 수정
    todayGain: Math.floor(Math.random() * 8) + 1, // API에서 오늘 증가량을 제공하면 수정
    level: Math.floor(apiUser.score / 10) + 1, // 점수 기반으로 레벨 계산
  });

  // 리더보드 데이터 로드
  const loadLeaderboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const categoryParam =
        selectedCategory === 'all' ? 'all' : selectedCategory;
      const apiType =
        selectedPeriod === 'daily'
          ? 'daily'
          : selectedPeriod === 'weekly'
            ? 'weekly'
            : selectedPeriod === 'monthly'
              ? 'monthly'
              : 'all';

      const response = await getLeaderBoard(categoryParam, apiType);

      if (response && Array.isArray(response)) {
        const transformedUsers = response.map((apiUser, index) =>
          transformAPIUser(apiUser, index)
        );
        setFilteredUsers(transformedUsers);
        setDisplayedUsers(transformedUsers.slice(0, 10)); // 처음 10개만 표시
        setHasMore(transformedUsers.length > 10);
      } else {
        setFilteredUsers([]);
        setDisplayedUsers([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('리더보드 데이터 로드 실패:', err);
      setError('리더보드 데이터를 불러오는데 실패했습니다.');
      // 에러 발생 시 빈 데이터로 설정
      setFilteredUsers([]);
      setDisplayedUsers([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리, 기간, 날짜 변경 시 데이터 로드
  useEffect(() => {
    loadLeaderboardData();
  }, [selectedCategory, selectedPeriod, selectedDateIndex]);

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
    개발: [
      '💻 코드 한 줄 한 줄이 당신의 성장입니다!',
      '🚀 개발자의 길, 끝없는 학습의 여정이에요!',
      '⚡ 버그를 잡을 때마다 레벨업하고 있어요!',
      '🎯 완벽한 코드를 위한 집중력이 대단해요!',
      '🔥 개발 실력이 급상승하고 있습니다!',
    ],
    디자인: [
      '🎨 창의력이 폭발하는 시간들이에요!',
      '✨ 아름다운 디자인으로 세상을 바꿔요!',
      '🌈 색감과 레이아웃에 대한 감각이 뛰어나요!',
      '💫 디자인 센스가 날로 향상되고 있어요!',
      '🎭 예술적 감성이 작품에 스며들고 있어요!',
    ],
    회의: [
      '🤝 소통의 달인이 되어가고 있어요!',
      '💡 아이디어 교환의 시간이 소중해요!',
      '🗣️ 효과적인 커뮤니케이션 능력이 빛나요!',
      '🎯 목표 달성을 위한 협업이 완벽해요!',
      '⚡ 회의 효율성이 점점 높아지고 있어요!',
    ],
    기타: [
      '🌱 새로운 영역에서의 도전이 값져요!',
      '🔍 탐구하는 자세가 정말 훌륭해요!',
      '💭 창의적 사고로 문제를 해결하고 있어요!',
      '🎲 다양한 시도들이 경험을 쌓아가요!',
      '🌟 예상치 못한 곳에서 성장하고 있어요!',
    ],
    학습: [
      '📚 지식을 쌓아가는 시간이 소중해요!',
      '🧠 두뇌가 활발하게 활동하고 있어요!',
      '💡 새로운 것을 배우는 즐거움이 넘쳐요!',
      '🎓 꾸준한 학습으로 성장하고 있어요!',
      '⚡ 학습 능력이 점점 향상되고 있어요!',
    ],
    운동: [
      '💪 건강한 몸과 마음을 만들어가고 있어요!',
      '🏃‍♂️ 꾸준한 운동으로 체력이 늘고 있어요!',
      '🔥 운동의 열정이 대단해요!',
      '🏋️‍♀️ 자기관리의 달인이 되어가고 있어요!',
      '⚡ 활력이 넘치는 하루를 보내고 있어요!',
    ],
    독서: [
      '📖 책 속에서 새로운 세상을 탐험하고 있어요!',
      '🤔 깊이 있는 사고력을 기르고 있어요!',
      '✨ 독서로 지혜를 쌓아가고 있어요!',
      '📚 지식의 보물창고를 열어가고 있어요!',
      '🌟 독서 습관이 인생을 바꿔가고 있어요!',
    ],
    음악: [
      '🎵 음악으로 감정을 표현하고 있어요!',
      '🎹 멜로디가 마음을 치유하고 있어요!',
      '🎤 음악적 재능이 빛나고 있어요!',
      '🎶 리듬감이 점점 좋아지고 있어요!',
      '🎼 음악과 함께하는 시간이 행복해요!',
    ],
    요리: [
      '👨‍🍳 요리 실력이 날로 늘고 있어요!',
      '🍳 맛있는 음식으로 사람들을 행복하게 해요!',
      '🥘 창의적인 요리로 새로운 맛을 만들어요!',
      '👩‍🍳 요리하는 시간이 힐링이 되고 있어요!',
      '🍽️ 건강한 식단으로 몸을 관리하고 있어요!',
    ],
    여행: [
      '✈️ 새로운 곳에서 소중한 경험을 쌓고 있어요!',
      '🗺️ 여행으로 시야를 넓혀가고 있어요!',
      '📸 아름다운 순간들을 기록하고 있어요!',
      '🌍 세상을 탐험하는 모험가가 되고 있어요!',
      '🎒 여행의 추억이 인생을 풍요롭게 해요!',
    ],
    게임: [
      '🎮 게임으로 스트레스를 해소하고 있어요!',
      '🕹️ 전략적 사고력이 향상되고 있어요!',
      '🏆 게임 실력이 점점 늘고 있어요!',
      '⚡ 빠른 반응속도로 실력을 발휘해요!',
      '🎯 집중력과 순발력이 좋아지고 있어요!',
    ],
  };

  // 카테고리 필터링
  useEffect(() => {
    let filtered = filteredUsers;
    if (selectedCategory !== 'all') {
      filtered = filteredUsers.filter(
        user => user.category === selectedCategory
      );
    }
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, 20)); // 처음 20명 표시
    setHasMore(filtered.length > 20);
  }, [filteredUsers, selectedCategory]);

  // 5개 고정 슬롯을 위한 카테고리 배열 생성
  const getVisibleCategories = () => {
    const selectedIndex = categories.indexOf(selectedCategory);
    const visibleCategories = [];

    // 5개 슬롯: [선택-2, 선택-1, 선택, 선택+1, 선택+2]
    for (let i = -2; i <= 2; i++) {
      let targetIndex = selectedIndex + i;

      // 순환 처리: 배열 범위를 벗어나면 반대편으로
      if (targetIndex < 0) {
        targetIndex = categories.length + targetIndex;
      } else if (targetIndex >= categories.length) {
        targetIndex = targetIndex - categories.length;
      }

      visibleCategories.push({
        category: categories[targetIndex],
        isSelected: i === 0, // 가운데 슬롯만 선택됨
        position: i, // -2, -1, 0, 1, 2
      });
    }

    return visibleCategories;
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

  // 현재 기간 라벨 표시
  const getPeriodLabel = () => {
    const today = new Date();

    if (selectedPeriod === 'daily') {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - selectedDateIndex);

      if (selectedDateIndex === 0) return '오늘';
      if (selectedDateIndex === 1) return '어제';
      return date.toLocaleDateString('ko-KR');
    } else if (selectedPeriod === 'weekly') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(
        weekStart.getDate() - selectedDateIndex * 7 - weekStart.getDay()
      );
      return `${weekStart.getMonth() + 1}월 ${Math.ceil(weekStart.getDate() / 7)}주차`;
    } else {
      const month = new Date(currentDate);
      month.setMonth(month.getMonth() - selectedDateIndex);
      return `${month.getFullYear()}년 ${month.getMonth() + 1}월`;
    }
  };

  // 날짜 네비게이션
  const handlePreviousDate = () => {
    setSelectedDateIndex(prev => prev + 1);
  };

  const handleNextDate = () => {
    if (selectedDateIndex > 0) {
      setSelectedDateIndex(prev => prev - 1);
    }
  };

  const canGoPrevious = () => {
    // 최대 30일/주/월 이전까지만 허용
    return selectedDateIndex < 30;
  };

  const canGoNext = () => {
    return selectedDateIndex > 0;
  };

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
  const currentMessage =
    motivationalMessages[selectedCategory as keyof typeof motivationalMessages][
      currentMessageIndex
    ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 ${layout.container.default} py-8`}
    >
      {/* 헤더 */}
      <div className={`text-center ${layout.spacing.section}`}>
        <h1
          className={`${typography.heading.hero} ${animations.pulse.slow} bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent`}
        >
          🏆 리더보드
        </h1>
        <p className={`${typography.body.large} text-gray-600`}>
          실시간으로 경쟁하며 함께 성장해요!
        </p>
      </div>

      {/* 기간 선택 탭 */}
      <div className={commonCombinations.cardCombos.glass + ' mb-8'}>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
              {Object.keys(timeLabels).map(period => (
                <button
                  key={period}
                  className={utils.cn(
                    'flex-1 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300',
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                  onClick={() => setSelectedPeriod(period as any)}
                >
                  {timeLabels[period as keyof typeof timeLabels]}
                </button>
              ))}
            </div>

            {/* 이전/다음 버튼 */}
            <div className='flex gap-2'>
              <button
                className={utils.cn(
                  'h-10 w-10 rounded-lg bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gray-200',
                  !canGoPrevious() && 'cursor-not-allowed opacity-50'
                )}
                onClick={handlePreviousDate}
                disabled={!canGoPrevious()}
              >
                ←
              </button>
              <button
                className={utils.cn(
                  'h-10 w-10 rounded-lg bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gray-200',
                  !canGoNext() && 'cursor-not-allowed opacity-50'
                )}
                onClick={handleNextDate}
                disabled={!canGoNext()}
              >
                →
              </button>
            </div>
          </div>

          {/* 현재 선택된 기간 표시 */}
          <div className='text-center'>
            <div className='inline-block rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-2'>
              <span className='text-lg font-semibold text-gray-800'>
                📅 {getPeriodLabel()}
              </span>
            </div>
          </div>

          {/* 일별 선택 시 날짜 선택 */}
          {selectedPeriod === 'daily' && (
            <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
              {Array.from({ length: 7 }, (_, index) => {
                const date = new Date(currentDate);
                date.setDate(date.getDate() - index);
                const dateStr = date.toLocaleDateString('ko-KR');
                const label =
                  index === 0 ? '오늘' : index === 1 ? '어제' : dateStr;

                return (
                  <button
                    key={index}
                    className={utils.cn(
                      'rounded-lg px-3 py-2 text-sm transition-all duration-300',
                      selectedDateIndex === index
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                    onClick={() => setSelectedDateIndex(index)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

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

      {/* 카테고리 필터 - 5개 고정 슬롯 */}
      <div className='mb-8'>
        <div className='flex justify-center'>
          <div className='flex items-center gap-3'>
            {getVisibleCategories().map((item, slotIndex) => {
              const categoryColor =
                categoryColors[item.category as keyof typeof categoryColors] ||
                categoryColors.기타; // fallback to 기타 if category not found

              return (
                <button
                  key={`${item.category}-${slotIndex}`}
                  onClick={() => setSelectedCategory(item.category)}
                  className={utils.cn(
                    'relative overflow-hidden rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300',
                    'flex h-[48px] w-[100px] items-center justify-center', // 고정 크기
                    // 가운데 슬롯 (선택된 카테고리)
                    item.isSelected
                      ? `bg-gradient-to-r ${categoryColor.buttonGradient} z-10 scale-110 transform text-white shadow-xl`
                      : // 양옆 슬롯들
                        Math.abs(item.position) === 1
                        ? 'scale-95 border border-gray-200 bg-white text-gray-700 hover:scale-105 hover:bg-gray-50'
                        : // 가장 끝 슬롯들 (더 작게)
                          'scale-90 border border-gray-200 bg-white text-gray-500 opacity-70 hover:scale-105 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${categoryColor.gradient} opacity-0 transition-opacity duration-300 hover:opacity-10`}
                  ></div>
                  <span className='relative z-10 text-center whitespace-nowrap'>
                    {item.category === 'all' ? '전체' : item.category}
                  </span>
                  {/* 선택된 카테고리 표시 */}
                  {item.isSelected && (
                    <div className='absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-lg'>
                      <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 전체 카테고리 인디케이터 */}
        <div className='mt-4 flex justify-center'>
          <div className='flex items-center gap-1'>
            {categories.map((_, index) => {
              const selectedIndex = categories.indexOf(selectedCategory);

              return (
                <div
                  key={index}
                  className={utils.cn(
                    'h-1.5 w-1.5 rounded-full transition-all duration-300',
                    index === selectedIndex
                      ? 'h-2 w-6 bg-purple-500' // 선택된 항목은 길게
                      : 'bg-gray-300'
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* 현재 카테고리 정보 */}
        <div className='mt-3 text-center'>
          <div className='text-sm text-gray-600'>
            <span className='font-semibold text-purple-600'>
              {selectedCategory === 'all' ? '전체' : selectedCategory}
            </span>
            <span className='mx-2'>•</span>
            <span>
              {categories.indexOf(selectedCategory) + 1} / {categories.length}
            </span>
          </div>
        </div>

        {/* 좌우 네비게이션 힌트 */}
        <div className='mt-2 flex justify-center'>
          <div className='flex items-center gap-4 text-xs text-gray-400'>
            <span className='flex items-center gap-1'>
              <span>←</span>
              <span>이전</span>
            </span>
            <div className='h-1 w-8 rounded-full bg-gray-200'></div>
            <span className='flex items-center gap-1'>
              <span>다음</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </div>

      {/* 로딩 및 에러 상태 */}
      {isLoading && (
        <div className={`${layout.flex.center} mb-8`}>
          <div
            className={`${commonCombinations.cardCombos.glass} p-8 text-center`}
          >
            <div className={animations.loading.spinner + ' mx-auto mb-4'}></div>
            <p className={typography.body.large}>
              리더보드 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className={`${layout.flex.center} mb-8`}>
          <div
            className={`${commonCombinations.cardCombos.glass} border-red-200 p-8 text-center`}
          >
            <p className={`${typography.body.large} mb-4 text-red-600`}>
              ❌ {error}
            </p>
            <button
              onClick={loadLeaderboardData}
              className={commonCombinations.buttonCombos.primary}
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 상위 3명 - 특별 디스플레이 */}
      {!isLoading && !error && (
        <>
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
                      <h3
                        className={`${typography.heading.h4} mb-1 text-gray-800`}
                      >
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
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${(categoryColors[user.category as keyof typeof categoryColors] || categoryColors.기타).badgeClass}`}
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
                          <div
                            className={`${typography.heading.h5} text-gray-900`}
                          >
                            {user.hours}h
                          </div>
                        </div>

                        <div
                          className={`rounded-full border px-2 py-1 text-xs ${(categoryColors[user.category as keyof typeof categoryColors] || categoryColors.기타).badgeClass}`}
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
        </>
      )}
    </div>
  );
}
