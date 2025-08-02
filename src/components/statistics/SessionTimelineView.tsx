'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useTheme } from '@/hooks/ui/useTheme';
import { useSessionDetail, useSessions } from '@/hooks/data/useSession';
import { useSessionChart } from '@/hooks/ui/useSessionChart';
import { getKSTDateString } from '@/utils/timezone';
import type { SessionData } from '@/types/domains/usage/session';
import StateDisplay from '../common/StateDisplay';
import SessionChart from './SessionChart';
import SessionDetail from './SessionDetail';

// Types
interface SessionTimelineViewProps {
  selectedDate?: string;
}

// Loading skeleton component
const LoadingSkeleton: React.FC<{ getThemeClass: (type: string) => string }> = ({ getThemeClass }) => (
  <Card className={`rounded-lg border-2 transition-all duration-300 ${getThemeClass('border')} ${getThemeClass('component')}`}>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-64 w-full">
            <div className="h-full flex items-end gap-2 px-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={`w-full animate-pulse rounded ${getThemeClass('componentSecondary')}`} 
                    style={{ height: `${Math.random() * 150 + 50}px` }}
                  ></div>
                  <div className={`h-3 w-8 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`h-4 w-4 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                <div className={`h-4 flex-1 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function SessionTimelineView({ selectedDate = getKSTDateString() }: SessionTimelineViewProps) {
  const { getThemeClass } = useTheme();
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

  // Fetch data
  const { data: sessionData, isLoading, isError, refetch } = useSessions(selectedDate);
  const { data: sessionDetailData } = useSessionDetail(selectedSession?.id, selectedDate);

  // Get processed sessions from chart hook
  const { processedSessions, resetScroll } = useSessionChart({
    sessionData,
    selectedSession,
    onSessionSelect: setSelectedSession,
  });

  // Reset when date changes
  useEffect(() => {
    resetScroll();
    setSelectedSession(null);
  }, [selectedDate, resetScroll]);

  // Set default selected session (most recent)
  useEffect(() => {
    if (processedSessions.length > 0 && !selectedSession) {
      const mostRecentSession = processedSessions.reduce((latest, current) => 
        current.timestamp > latest.timestamp ? current : latest
      );
      setSelectedSession(mostRecentSession);
    }
  }, [processedSessions, selectedSession]);

  // Handle session selection
  const handleSessionSelect = (session: SessionData) => {
    setSelectedSession(session);
  };

  // Handle scroll to most recent
  const handleScrollToMostRecent = () => {
    // This is called from SessionChart when scrolling is complete
  };

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton getThemeClass={getThemeClass as (type: string) => string} />;
  }

  // Error state
  if (isError || !sessionData) {
    return (
      <Card className={`rounded-lg border-2 ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className="p-6">
          <StateDisplay
            type="error"
            title="Unable to load session data"
            message="A network error occurred. Please try again."
            onRetry={refetch}
            retryText="Refresh"
            showBorder={false}
            size="medium"
          />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (processedSessions.length === 0) {
    return (
      <Card className={`rounded-lg border-2 ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className="p-6">
          <StateDisplay
            type="empty"
            title="No sessions recorded"
            message="No work sessions were recorded for this date."
            icon={Activity}
            showBorder={false}
            size="medium"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`rounded-lg border-2 transition-all duration-300 py-2 pb-0 ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Chart */}
          <SessionChart
            sessionData={sessionData}
            selectedSession={selectedSession}
            onSessionSelect={handleSessionSelect}
            onScrollToMostRecent={handleScrollToMostRecent}
          />

          {/* Right: Session Details */}
          <div className={`space-y-4 ${selectedSession ? 'min-h-96' : ''}`}>
            <SessionDetail
              selectedSession={selectedSession}
              sessionData={sessionData}
              sessionDetailData={sessionDetailData}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}