'use client';

interface LeaderboardHeaderProps {
  currentMessage: string;
}

export default function LeaderboardHeader({
  currentMessage,
}: LeaderboardHeaderProps) {
  return (
    <>
      {/* 헤더 */}
      <div className='mb-8 text-center'>
        <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
          🏆 리더보드
        </h1>
        <p className='mt-2 text-gray-600'>실시간으로 경쟁하며 함께 성장해요!</p>
      </div>

      {/* 동기부여 메시지 */}
      <div className='mb-8 rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
        <p className='text-center font-medium text-gray-700'>
          {currentMessage}
        </p>
      </div>
    </>
  );
}
