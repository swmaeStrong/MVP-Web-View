'use client';

import { useCallback } from 'react';

interface TimelineSegment {
  timeRange: string;
  startTime: number;
  endTime: number;
  workTime: number;
  distractionTime: number;
  afkTime: number;
  unusedTime: number;
  segmentDuration: number;
}

interface UseSessionTimelineProps {
  sessionData: Session.SessionApiResponse[] | undefined;
}

export const useSessionTimeline = ({ sessionData }: UseSessionTimelineProps) => {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  // Get timeline breakdown for a specific session
  const getTimelineBreakdown = useCallback((sessionId: number): TimelineSegment[] => {
    const session = sessionData?.find(s => s.session === sessionId);
    if (!session) return [];

    const sessionStartTime = session.timestamp;
    const sessionDuration = session.duration;

    if (!sessionDuration || sessionDuration <= 0) return [];

    // Create timeline array (1 = work, 2 = distraction, 3 = afk)
    const timeline = new Array(Math.floor(sessionDuration)).fill(1);

    // Mark distraction/AFK periods from session details
    if (session.details && session.details.length > 0) {
      session.details.forEach((detail: Session.SessionDetail) => {
        if (!detail || typeof detail.timestamp !== 'number' || typeof detail.duration !== 'number') return;
        
        const detailStartTime = Math.floor(detail.timestamp - sessionStartTime);
        const detailDuration = Math.floor(detail.duration);
        
        if (detailDuration <= 0 || detailDuration > sessionDuration) return;
        
        for (let i = 0; i < detailDuration; i++) {
          const timelineIndex = detailStartTime + i;
          if (timelineIndex >= 0 && timelineIndex < timeline.length) {
            if (detail.category === 'afk' || detail.category === 'idle') {
              timeline[timelineIndex] = 3; // AFK
            } else if (detail.category !== 'work' && detail.category !== 'coding') {
              timeline[timelineIndex] = 2; // Distraction
            }
          }
        }
      });
    }

    // Group consecutive seconds into segments
    const segments: TimelineSegment[] = [];
    let currentSegmentStart = 0;
    let currentSegmentType = timeline[0];
    
    for (let i = 1; i <= timeline.length; i++) {
      const isEndOfSession = i === timeline.length;
      const typeChanged = !isEndOfSession && timeline[i] !== currentSegmentType;
      
      if (typeChanged || isEndOfSession) {
        const segmentDuration = i - currentSegmentStart;
        segments.push({
          timeRange: `${formatTimestamp(sessionStartTime + currentSegmentStart)}-${formatTimestamp(sessionStartTime + i)}`,
          startTime: sessionStartTime + currentSegmentStart,
          endTime: sessionStartTime + i,
          workTime: currentSegmentType === 1 ? segmentDuration : 0,
          distractionTime: currentSegmentType === 2 ? segmentDuration : 0,
          afkTime: currentSegmentType === 3 ? segmentDuration : 0,
          unusedTime: 0,
          segmentDuration: segmentDuration
        });
        
        if (!isEndOfSession) {
          currentSegmentStart = i;
          currentSegmentType = timeline[i];
        }
      }
    }
    
    return segments;
  }, [sessionData]);

  return {
    getTimelineBreakdown,
  };
};