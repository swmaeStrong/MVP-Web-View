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
  const { data: sessionData, isLoading } = useSessions(selectedDate);

  const formatHours = (hours: number): string => {
    // NaN 또는 유효하지 않은 숫자 체크
    if (isNaN(hours) || !isFinite(hours) || hours < 0) {
      return '0m';
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    // NaN 방지를 위한 추가 체크
    const safeHours = isNaN(wholeHours) ? 0 : wholeHours;
    const safeMinutes = isNaN(minutes) ? 0 : minutes;
    
    if (safeHours === 0 && safeMinutes === 0) {
      return '0m';
    }
    if (safeHours === 0) {
      return `${safeMinutes}m`;
    }
    if (safeMinutes === 0) {
      return `${safeHours}h`;
    }
    return `${safeHours}h ${safeMinutes}m`;
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
      title: 'Daily Total',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--h --m</div>
      ) : (
        <div className="text-2xl font-bold">
          {formatHours(totalWorkHours)}
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : 'Total work time',
    },
    {
      title: 'Daily Distractions',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--h --m</div>
      ) : (
        <div className="text-2xl font-bold">
          {formatHours(calculateTotalDistractionHours())}
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : 'Total distraction time',
    },
    {
      title: 'Daily Sessions',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--</div>
      ) : (
        <div className="text-2xl font-bold">
          {sessionData?.length || 0}
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : 'Completed sessions',
    },
    {
      title: 'Average Focus Score',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--pt</div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{calculateAverageFocusScore()} points</span>
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : 'Daily average score',
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
              {card.subtitle && (
                <p className={`text-xs ${getThemeTextColor('secondary')} mt-1`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}