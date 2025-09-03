'use client';

import { useSessionTimeline } from '@/hooks/ui/useSessionTimeline';
import { useTheme } from '@/hooks/ui/useTheme';
import type { SessionData } from '@/types/domains/usage/session';
import { sessionTimelineColors } from '@/styles/colors';
import { Target } from 'lucide-react';
import React, { useState } from 'react';

interface SessionDetailProps {
  selectedSession: SessionData | null;
  sessionData: Session.SessionApiResponse[] | undefined;
  sessionDetailData: Session.SessionDetailApiResponse | undefined;
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
          <div className="w-2 h-2 rounded" style={{ backgroundColor: sessionTimelineColors.work.hex }}></div>
          <span className={`text-xs ${getThemeTextColor('secondary')}`}>Work</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded" style={{ backgroundColor: sessionTimelineColors.distraction.hex }}></div>
          <span className={`text-xs ${getThemeTextColor('secondary')}`}>Distraction</span>
        </div>
        {segments.some(segment => segment.afkTime > 0) && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded" style={{ backgroundColor: sessionTimelineColors.afk.hex }}></div>
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
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'work'
            ? `${isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`
            : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          ✅ Work
        </span>
      </button>
      <button
        onClick={() => onTabChange('distractions')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'distractions'
            ? `${isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'}`
            : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          🚫 Distractions
        </span>
      </button>
    </div>
  );
};

const AppUsageList: React.FC<{
  apps: Session.AppUsageDetail[];
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
    ? (isWork ? 'border-green-400 bg-green-900/20' : 'border-red-400 bg-red-900/20')
    : (isWork ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50');

  if (!apps || apps.length === 0) {
    return (
      <div className="space-y-3 mb-4">
        <div className={`text-sm font-medium ${getThemeTextColor('primary')} flex items-center gap-2`}>
          <span>{isWork ? '✅' : '🚫'}</span>
          {isWork ? 'Work Apps' : 'Distractions'}
        </div>
        <div className={`py-4 px-3 rounded-lg border ${borderColor} text-center`}>
          <p className={`text-sm ${getThemeTextColor('secondary')}`}>
            No {isWork ? 'work' : 'distraction'} apps used during this session
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      <div className={`text-sm font-medium ${getThemeTextColor('primary')} flex items-center gap-2`}>
        <span>{isWork ? '✅' : '🚫'}</span>
        {isWork ? 'Work Apps' : 'Distractions'}
      </div>
      <div className="space-y-2">
        {apps
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 3)
          .map((detail, index) => (
            <div key={index} className={`py-2 px-3 rounded-lg border ${borderColor}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                  {detail.app}
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

      {/* App Usage Toggle and List */}
      {sessionDetailData && (sessionDetailData.workAppUsage?.length > 0 || sessionDetailData.distractedAppUsage?.length > 0) && (
        <>
          <AppUsageToggle
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isDarkMode={isDarkMode}
            getThemeClass={getThemeClass as (type: string) => string}
            getThemeTextColor={getThemeTextColor as (type: string) => string}
          />
          
          <AppUsageList
            apps={activeTab === 'work' ? sessionDetailData.workAppUsage || [] : sessionDetailData.distractedAppUsage || []}
            type={activeTab}
            isDarkMode={isDarkMode}
            getThemeTextColor={getThemeTextColor as (type: string) => string}
          />
        </>
      )}
    </div>
  );
}