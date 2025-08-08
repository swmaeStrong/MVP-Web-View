'use client';

import { useSessionTimeline } from '@/hooks/ui/useSessionTimeline';
import { useTheme } from '@/hooks/ui/useTheme';
import type { SessionData } from '@/types/domains/usage/session';
import { Target } from 'lucide-react';
import React from 'react';

interface SessionDetailProps {
  selectedSession: SessionData | null;
  sessionData: Session.SessionApiResponse[] | undefined;
  sessionDetailData: Session.SessionDetailApiResponse[] | undefined;
}

// Sub-components
const SessionHeader: React.FC<{
  session: SessionData;
  sessionApiResponse?: Session.SessionApiResponse;
  getThemeTextColor: (type: string) => string;
}> = ({ session, sessionApiResponse, getThemeTextColor }) => {
  const formatTimeRange = (startTimestamp: number, duration: number): string => {
    const formatTimestamp = (timestamp: number): string => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
    };
    
    const startTime = formatTimestamp(startTimestamp);
    const endTimestamp = startTimestamp + duration;
    const endTime = formatTimestamp(endTimestamp);
    return `${startTime}-${endTime}`;
  };

  // Early stop 검출 로직
  const isEarlyStop = sessionApiResponse ? 
    (sessionApiResponse.sessionMinutes * 60) - sessionApiResponse.duration >= 10 : false;

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className={`font-semibold ${getThemeTextColor('primary')} flex items-center gap-2`}>
          {session.title}
          {isEarlyStop && (
            <span className={`text-xs ${getThemeTextColor('secondary')} font-normal`}>
              (early stop)
            </span>
          )}
        </div>
        <p className={`text-sm ${getThemeTextColor('secondary')}`}>
          {formatTimeRange(session.timestamp, session.duration)}
        </p>
      </div>
      <div className={`text-sm ${getThemeTextColor('secondary')}`}>
        <span>Score: </span>
        <span className={`font-bold ${getThemeTextColor('primary')}`}>
          {session.score}
        </span>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{
  segments: Array<{
    timeRange: string;
    startTime: number;
    endTime: number;
    workTime: number;
    distractionTime: number;
    afkTime: number;
    segmentDuration: number;
  }>;
  totalTime: number;
  getThemeTextColor: (type: string) => string;
}> = ({ segments, totalTime, getThemeTextColor }) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="mb-4">
      <div className="space-y-2">
        <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-200">
          {segments.map((segment, index) => {
            const segmentPercent = totalTime > 0 ? (segment.segmentDuration / totalTime) * 100 : 0;
            const workPercent = segment.segmentDuration > 0 ? (segment.workTime / segment.segmentDuration) * 100 : 0;
            const distractionPercent = segment.segmentDuration > 0 ? (segment.distractionTime / segment.segmentDuration) * 100 : 0;
            const afkPercent = segment.segmentDuration > 0 ? (segment.afkTime / segment.segmentDuration) * 100 : 0;
            
            return (
              <div 
                key={index}
                className="flex h-full"
                style={{ width: `${segmentPercent}%` }}
                title={`${segment.timeRange}: Work ${formatTime(segment.workTime)}, Distraction ${formatTime(segment.distractionTime)}, AFK ${formatTime(segment.afkTime)}`}
              >
                {workPercent > 0 && (
                  <div 
                    className="h-full" 
                    style={{ 
                      width: `${workPercent}%`,
                      backgroundColor: '#5ed462'
                    }}
                  />
                )}
                {distractionPercent > 0 && (
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${distractionPercent}%`,
                      backgroundColor: '#ff5871'
                    }}
                  />
                )}
                {afkPercent > 0 && (
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{ width: `${afkPercent}%` }}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Time labels */}
        <div className="flex justify-between text-xs text-gray-500 overflow-hidden">
          {segments.length > 0 && (
            <>
              <span className="text-[9px] truncate px-1">
                {formatTimestamp(segments[0].startTime)}
              </span>
              <span className="text-[9px] truncate px-1">
                {formatTimestamp(segments[segments.length - 1].endTime)}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded" style={{ backgroundColor: '#5ed462' }}></div>
          <span className={`text-xs ${getThemeTextColor('secondary')}`}>Work</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded" style={{ backgroundColor: '#ff5871' }}></div>
          <span className={`text-xs ${getThemeTextColor('secondary')}`}>Distraction</span>
        </div>
        {segments.some(segment => segment.afkTime > 0) && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-yellow-500"></div>
            <span className={`text-xs ${getThemeTextColor('secondary')}`}>AFK</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DistractionsList: React.FC<{
  distractions: Session.SessionDetailApiResponse[];
  isDarkMode: boolean;
  getThemeTextColor: (type: string) => string;
}> = ({ distractions, isDarkMode, getThemeTextColor }) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return (
    <div className="space-y-3 mb-4">
      <div className={`text-sm font-medium ${getThemeTextColor('primary')} flex items-center gap-2`}>
        <span>🚫</span>
        Distractions
      </div>
      <div className="space-y-2">
        {distractions
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 3)
          .map((detail, index) => (
            <div key={index} className={`py-2 px-3 rounded-lg border ${isDarkMode ? 'border-red-400 bg-red-900/20' : 'border-red-300 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                  {detail.distractedApp}
                </span>
              </div>
              <div className={`flex gap-4 text-xs ${getThemeTextColor('secondary')}`}>
                <span>Duration: {formatTime(Math.round(detail.duration))}</span>
                <span>Access Count: {detail.count} times</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const EmptyState: React.FC<{
  getThemeClass: (type: string) => string;
  getThemeTextColor: (type: string) => string;
}> = ({ getThemeClass, getThemeTextColor }) => (
  <div className={`p-4 rounded-lg border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} text-center`}>
    <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
    <p className={`text-sm ${getThemeTextColor('secondary')}`}>
      Click on a bar to view session details
    </p>
  </div>
);

export default function SessionDetail({ 
  selectedSession, 
  sessionData, 
  sessionDetailData 
}: SessionDetailProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  const { getTimelineBreakdown } = useSessionTimeline({ sessionData });

  if (!selectedSession) {
    return (
      <EmptyState 
        getThemeClass={getThemeClass as (type: string) => string}
        getThemeTextColor={getThemeTextColor as (type: string) => string}
      />
    );
  }

  const segments = getTimelineBreakdown(selectedSession.id);
  
  // 해당 세션의 API 응답 데이터 찾기
  const sessionApiResponse = sessionData?.find(session => session.session === selectedSession.id);

  return (
    <div className={`p-4 rounded-lg ${getThemeClass('componentSecondary')}`}>
      {/* Session Header */}
      <SessionHeader 
        session={selectedSession}
        sessionApiResponse={sessionApiResponse}
        getThemeTextColor={getThemeTextColor as (type: string) => string} 
      />

      {/* Progress Bar */}
      {segments.length === 0 ? (
        <div className="mb-4">
          <div className={`p-3 rounded-lg ${getThemeClass('componentSecondary')} text-center`}>
            <p className={`text-sm ${getThemeTextColor('secondary')}`}>
              Unable to load session data.
            </p>
          </div>
        </div>
      ) : (
        <ProgressBar 
          segments={segments} 
          totalTime={selectedSession.duration} 
          getThemeTextColor={getThemeTextColor as (type: string) => string}
        />
      )}

      {/* Distractions */}
      {sessionDetailData && sessionDetailData.length > 0 && (
        <DistractionsList 
          distractions={sessionDetailData}
          isDarkMode={isDarkMode}
          getThemeTextColor={getThemeTextColor as (type: string) => string}
        />
      )}
    </div>
  );
}