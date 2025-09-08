'use client';

import { useSessionTimeline } from '@/hooks/ui/useSessionTimeline';
import { useTheme } from '@/hooks/ui/useTheme';
import { sessionTimelineColors } from '@/styles/colors';
import type { SessionData } from '@/types/domains/usage/session';
import { Target } from 'lucide-react';
import React, { useState } from 'react';


interface SessionDetailProps {
  selectedSession: SessionData | null;
  sessionData: Session.SessionApiResponse[] | undefined;
  sessionDetailData: any; // 임시로 any 사용
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
    <div className="flex items-center justify-between mb-2">
      <div>
        <div className={`font-medium text-sm ${getThemeTextColor('primary')} flex items-center gap-2`}>
          {session.title}
          {isEarlyStop && (
            <span className={`text-xs ${getThemeTextColor('secondary')} font-normal`}>
              (early stop)
            </span>
          )}
        </div>
        <p className={`text-xs ${getThemeTextColor('secondary')}`}>
          {formatTimeRange(session.timestamp, session.duration)}
        </p>
      </div>
      <div className={`text-xs ${getThemeTextColor('secondary')}`}>
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
    <div className="mb-3">
      <div className="space-y-1">
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-200">
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
                      backgroundColor: sessionTimelineColors.work.hex
                    }}
                  />
                )}
                {distractionPercent > 0 && (
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${distractionPercent}%`,
                      backgroundColor: sessionTimelineColors.distraction.hex
                    }}
                  />
                )}
                {afkPercent > 0 && (
                  <div 
                    className="h-full" 
                    style={{ 
                      width: `${afkPercent}%`,
                      backgroundColor: sessionTimelineColors.afk.hex
                    }}
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
              <span className="text-[8px] truncate px-1">
                {formatTimestamp(segments[0].startTime)}
              </span>
              <span className="text-[8px] truncate px-1">
                {formatTimestamp(segments[segments.length - 1].endTime)}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded" style={{ backgroundColor: sessionTimelineColors.work.hex }}></div>
          <span className={`text-xs ${getThemeTextColor('secondary')}`}>Work</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded" style={{ backgroundColor: sessionTimelineColors.distraction.hex }}></div>
          <span className={`text-xs ${getThemeTextColor('secondary')}`}>Distraction</span>
        </div>
        {segments.some(segment => segment.afkTime > 0) && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded" style={{ backgroundColor: sessionTimelineColors.afk.hex }}></div>
            <span className={`text-xs ${getThemeTextColor('secondary')}`}>AFK</span>
          </div>
        )}
      </div>
    </div>
  );
};

const AppUsageToggle: React.FC<{
  activeTab: 'work' | 'distractions';
  onTabChange: (tab: 'work' | 'distractions') => void;
  isDarkMode: boolean;
  getThemeClass: (type: string) => string;
  getThemeTextColor: (type: string) => string;
}> = ({ activeTab, onTabChange, isDarkMode, getThemeClass, getThemeTextColor }) => {
  return (
    <div className={`flex rounded-lg p-1 mb-4 ${getThemeClass('componentSecondary')}`}>
      <button
        onClick={() => onTabChange('work')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
          activeTab === 'work'
            ? `${isDarkMode ? 'bg-green-800 text-green-100 shadow-lg' : 'bg-green-100 text-green-800 shadow-lg'}`
            : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:bg-opacity-50 hover:shadow-md`
        }`}
      >
        Work
      </button>
      <button
        onClick={() => onTabChange('distractions')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
          activeTab === 'distractions'
            ? `${isDarkMode ? 'bg-red-800 text-red-100 shadow-lg' : 'bg-red-100 text-red-800 shadow-lg'}`
            : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')} hover:bg-opacity-50 hover:shadow-md`
        }`}
      >
        Distractions
      </button>
    </div>
  );
};

interface AppUsageDetail {
  app: string;
  duration: number;
  count: number;
}

interface SessionDetailApiResponse {
  distractedAppUsage: AppUsageDetail[];
  workAppUsage: AppUsageDetail[];
}

const AppUsageList: React.FC<{
  apps: AppUsageDetail[];
  type: 'work' | 'distractions';
  isDarkMode: boolean;
  getThemeTextColor: (type: string) => string;
}> = ({ apps, type, isDarkMode, getThemeTextColor }) => {
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

  const isWork = type === 'work';
  const borderColor = isDarkMode 
    ? (isWork ? 'border-green-400/50 bg-green-900/10' : 'border-red-400/50 bg-red-900/10')
    : (isWork ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50');

  if (!apps || apps.length === 0) {
    return (
      <div className="space-y-2">
        <div className={`text-xs font-medium ${getThemeTextColor('primary')} flex items-center gap-2`}>
          {isWork ? 'Work Apps' : 'Distractions'}
        </div>
        <div className={`py-2 px-2 rounded-md border ${borderColor} text-center`}>
          <p className={`text-xs ${getThemeTextColor('secondary')}`}>
            No {isWork ? 'work' : 'distraction'} apps used
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`text-xs font-medium ${getThemeTextColor('primary')} flex items-center gap-2`}>
        {isWork ? 'Work Apps' : 'Distractions'}
      </div>
      <div className="space-y-1">
        {apps
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 4)
          .map((detail, index) => (
            <div key={index} className={`py-1 px-2 rounded-md border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium truncate ${getThemeTextColor('primary')}`}>
                  {detail.app}
                </span>
                <span className={`text-[10px] ${getThemeTextColor('secondary')}`}>
                  {formatTime(Math.round(detail.duration))} / {detail.count} times
                </span>
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
  <div className={`p-4 rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')} text-center`}>
    <Target className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
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
  const [activeTab, setActiveTab] = useState<'work' | 'distractions'>('distractions');

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
    <div className={`h-full flex flex-col p-3 rounded-lg ${getThemeClass('component')} border ${getThemeClass('border')}`}>
      {/* Session Header */}
      <SessionHeader 
        session={selectedSession}
        sessionApiResponse={sessionApiResponse}
        getThemeTextColor={getThemeTextColor as (type: string) => string} 
      />

      {/* Progress Bar */}
      {segments.length === 0 ? (
        <div className="mb-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'} text-center`}>
            <p className={`text-xs ${getThemeTextColor('secondary')}`}>
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

      {/* App Usage - Compact display */}
      {sessionDetailData && (sessionDetailData.workAppUsage.length > 0 || sessionDetailData.distractedAppUsage.length > 0) && (
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <AppUsageList
              apps={sessionDetailData.workAppUsage}
              type="work"
              isDarkMode={isDarkMode}
              getThemeTextColor={getThemeTextColor as (type: string) => string}
            />
            <AppUsageList
              apps={sessionDetailData.distractedAppUsage}
              type="distractions"
              isDarkMode={isDarkMode}
              getThemeTextColor={getThemeTextColor as (type: string) => string}
            />
          </div>
        </div>
      )}
    </div>
  );
}