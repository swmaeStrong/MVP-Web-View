'use client';

import { useSessions } from '@/hooks/data/useSession';
import { useTheme } from '@/hooks/ui/useTheme';

interface StatisticsSummaryCardsProps {
  totalWorkHours?: number;
  topCategories?: { name: string; hours: number }[];
  selectedDate: string; // 선택된 날짜 추가
}

export default function StatisticsSummaryCards({
  totalWorkHours = 0,
  topCategories = [],
  selectedDate,
}: StatisticsSummaryCardsProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  
  // React Query로 세션 데이터 가져오기
  const { data: sessionData } = useSessions(selectedDate);

  const formatHours = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  // 메인 컬러 사용
  const getMainColor = () => {
    return 'bg-[#3F72AF]'; // 메인 브랜드 컬러 사용
  };

  // 세션 스코어 평균 계산
  const calculateAverageFocusScore = (): number => {
    if (!sessionData || sessionData.length === 0) return 0;
    
    const validSessions = sessionData.filter((session: any) => 
      session.score !== null && session.score !== undefined && !isNaN(session.score)
    );
    
    if (validSessions.length === 0) return 0;
    
    const totalScore = validSessions.reduce((sum: number, session: any) => sum + session.score, 0);
    return Math.round(totalScore / validSessions.length);
  };

  // 전체 방해요소 시간 계산 (각 세션의 details에서 distraction 카테고리 시간 합계)
  const calculateTotalDistractionHours = (): number => {
    if (!sessionData || sessionData.length === 0) return 0;
    
    let totalDistractionMinutes = 0;
    
    // 각 세션의 details 배열을 순회
    sessionData.forEach((session: Session.SessionApiResponse) => {
      if (session.details && Array.isArray(session.details)) {
        session.details.forEach((detail: Session.SessionDetail) => {
          // category가 'distraction'인 경우 duration 합산
          if (detail.category === 'distraction' || detail.category === 'Distraction') {
            totalDistractionMinutes += detail.duration || 0;
          }
        });
      }
    });
    
    return totalDistractionMinutes / 3600; // 시간 단위로 변환
  };

  const cards = [
    {
      title: 'Work Hours',
      value: (
        <div className="text-2xl font-bold">
          {formatHours(totalWorkHours)}
        </div>
      ),
    },
    {
      title: 'Distraction Hours',
      value: (
        <div className="text-2xl font-bold">
          {formatHours(calculateTotalDistractionHours())}
        </div>
      ),
    },
    {
      title: 'Average Focus Score',
      value: (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{calculateAverageFocusScore()}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Points</span>
        </div>
      ),
    },
    {
      title: 'Top Categories',
      value: topCategories.length > 0 ? (
        <div className="space-y-1.5">
          {topCategories.slice(0, 3).map((cat, idx) => {
            const percentage = totalWorkHours > 0 ? (cat.hours / totalWorkHours) * 100 : 0;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span 
                  className={`${getThemeTextColor('secondary')} text-xs font-medium w-20 lg:w-24 flex-shrink-0 text-left overflow-hidden text-ellipsis whitespace-nowrap`}
                  title={cat.name}
                >
                  {cat.name}
                </span>
                <div className="flex-1 mx-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden min-w-[30px]">
                  <div
                    className={`h-full ${getMainColor()} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className={`${getThemeTextColor('primary')} text-xs font-semibold flex-shrink-0 w-14 lg:w-16 text-right whitespace-nowrap`}>
                  {formatHours(cat.hours)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-sm text-gray-400">No data</span>
      ),
    },

  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        return (
          <div
            key={index}
            className={`
              ${getThemeClass('component')} 
              border ${getThemeClass('border')}
              rounded-lg p-3
              transition-all duration-200
              hover:shadow-md
              group
              min-h-0
            `}
          >
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              {card.title}
            </p>
            
            <div className={`min-h-[60px] flex flex-col justify-center ${getThemeTextColor('primary')}`}>
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}