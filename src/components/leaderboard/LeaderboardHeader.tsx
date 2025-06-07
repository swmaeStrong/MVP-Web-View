'use client';

import { animations, layout, typography } from '@/styles';

interface LeaderboardHeaderProps {
  currentMessage: string;
}

export default function LeaderboardHeader({
  currentMessage,
}: LeaderboardHeaderProps) {
  return (
    <>
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

      {/* 동기부여 메시지 */}
      <div
        className={`mb-8 rounded-2xl border border-white/20 bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm`}
      >
        <p
          className={`${typography.body.large} text-gray-700 ${animations.transition.smooth}`}
        >
          {currentMessage}
        </p>
      </div>
    </>
  );
}
