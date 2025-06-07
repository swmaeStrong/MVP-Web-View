'use client';

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

interface LeaderboardListProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isFetchingNextPage: boolean;
  refetch: () => void;
}

// 초 단위를 시간, 분 형식으로 변환하는 함수
const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h === 0 && m === 0) return '0m';
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export default function LeaderboardList({
  users,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  refetch,
}: LeaderboardListProps) {
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

  // 로딩 및 에러 상태
  if (isLoading) {
    return (
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
    );
  }

  if (isError && error) {
    return (
      <div className={`${layout.flex.center} mb-8`}>
        <div
          className={`${commonCombinations.cardCombos.glass} border-red-200 p-8 text-center`}
        >
          <p className={`${typography.body.large} mb-4 text-red-600`}>
            ❌ {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
          </p>
          <p className={`${typography.special.caption} mb-4 text-gray-500`}>
            서버 요청이 중단되었습니다. 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={() => refetch()}
            className={commonCombinations.buttonCombos.primary}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className={`${layout.flex.center} mb-8`}>
        <div
          className={`${commonCombinations.cardCombos.glass} p-8 text-center`}
        >
          <p className={typography.body.large}>표시할 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 상위 3명 - 특별 디스플레이 */}
      <div className='mb-8'>
        <h2
          className={`${typography.heading.h3} mb-6 text-center text-gray-800`}
        >
          🏆 TOP 3
        </h2>
        <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
          {users.slice(0, 3).map((user: User, index: number) => {
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
                    {formatTime(user.hours)}
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
      {users.length > 3 && (
        <div className='mb-8'>
          <h2 className={`${typography.heading.h4} mb-4 text-gray-700`}>
            나머지 순위
          </h2>
          <div className='space-y-2'>
            {users.slice(3).map((user: User, index: number) => {
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
                        {formatTime(user.hours)}
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

      {/* 무한 스크롤 로딩 표시 */}
      {isFetchingNextPage && (
        <div className={layout.flex.center}>
          <div className={`${commonCombinations.cardCombos.glass} p-4`}>
            <div className={animations.loading.spinner + ' mx-auto mb-2'}></div>
            <p className={typography.body.default}>
              더 많은 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
