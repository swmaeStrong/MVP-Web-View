'use client';

import {
  animations,
  commonCombinations,
  layout,
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

interface StatsSectionProps {
  users: User[];
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

export default function StatsSection({ users }: StatsSectionProps) {
  const getTotalStats = () => ({
    totalCompetitors: users.length,
    topRecord: users[0]?.hours || 0,
    myRank: users.findIndex((user: User) => user.isMe) + 1,
  });

  const stats = getTotalStats();

  return (
    <>
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
      <div
        className={utils.cn(
          layout.grid.cards,
          'align-center mb-8 grid grid-cols-3 justify-center gap-16'
        )}
      >
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
              {formatTime(stats.topRecord)}
            </div>
            <div className={typography.special.muted}>1위 기록</div>
          </div>
        </div>

        <div className={commonCombinations.cardCombos.glass}>
          <div className={layout.flex.colCenter}>
            <div className={`${typography.heading.h2} text-blue-600`}>
              #{stats.myRank || '-'}
            </div>
            <div className={typography.special.muted}>내 순위</div>
          </div>
        </div>
      </div>
    </>
  );
}
