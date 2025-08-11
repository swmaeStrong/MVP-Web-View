'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import type { SessionData } from '@/types/domains/usage/session';
import { useCallback, useMemo, useRef, useState } from 'react';

interface ChartData {
  session: string;
  sessionNumber: string;
  score: number;
  duration: number;
  fill: string;
  sessionData: SessionData;
  id: number;
}

interface UseSessionChartProps {
  sessionData: Session.SessionApiResponse[] | undefined;
  selectedSession: SessionData | null;
  onSessionSelect: (session: SessionData) => void;
}

export const useSessionChart = ({ 
  sessionData, 
  selectedSession,
  onSessionSelect 
}: UseSessionChartProps) => {
  const { isDarkMode } = useTheme();
  const [hoveredSessionId, setHoveredSessionId] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolled = useRef(false);

  // Utility functions
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTimeRange = (startTimestamp: number, duration: number): string => {
    const startTime = formatTimestamp(startTimestamp);
    const endTimestamp = startTimestamp + duration;
    const endTime = formatTimestamp(endTimestamp);
    return `${startTime}-${endTime}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return '#44C743';
    if (score >= 51) return isDarkMode ? '#f59e0b' : '#d97706';
    return isDarkMode ? '#ef4444' : '#dc2626';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 85) return 'Excellent';
    if (score >= 51) return 'Good';
    return 'Needs Improvement';
  };

  // Process sessions for visualization
  const { processedSessions, allChartData } = useMemo(() => {
    if (!sessionData || sessionData.length === 0) return { 
      processedSessions: [], 
      allChartData: [] 
    };

    const sessions = sessionData
      .map((session): SessionData => ({
        id: session.session,
        title: session.title || `Session ${session.session}`,
        startTime: formatTimestamp(session.timestamp),
        duration: session.duration,
        score: session.score,
        timestamp: session.timestamp,
        scoreColor: getScoreColor(session.score),
        scoreLabel: getScoreLabel(session.score),
        sessionNumber: `S${session.session}`,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const chartData: ChartData[] = sessions.map((session) => ({
      session: formatTimeRange(session.timestamp, session.duration),
      sessionNumber: session.sessionNumber,
      score: session.score,
      duration: session.duration,
      fill: isDarkMode ? '#374151' : '#9ca3af',
      sessionData: session,
      id: session.id,
    }));

    return { processedSessions: sessions, allChartData: chartData };
  }, [sessionData, isDarkMode]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (processedSessions.length === 0) return null;

    const totalDuration = processedSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageScore = processedSessions.reduce((sum, session) => sum + session.score, 0) / processedSessions.length;
    const bestSession = processedSessions.reduce((best, session) => 
      session.score > best.score ? session : best
    );

    return {
      totalSessions: processedSessions.length,
      totalDuration,
      averageScore: Math.round(averageScore),
      bestSession,
    };
  }, [processedSessions]);

  // Custom bar component props
  const getCustomBarProps = useCallback((props: any) => {
    const { x, y, width, height, payload } = props;
    const isSelected = selectedSession?.id === payload.sessionData.id;
    const isHovered = hoveredSessionId === payload.sessionData.id;
    const isHighlighted = isSelected || isHovered;
    
    const minBarHeight = 8;
    const adjustedHeight = Math.max(height, minBarHeight);
    const adjustedY = height < minBarHeight ? y + height - minBarHeight : y;
    
    return {
      x,
      y: adjustedY,
      width,
      height: adjustedHeight,
      fill: isSelected ? (isDarkMode ? '#1e3a8a' : '#1e40af') : payload.fill,
      stroke: isSelected ? (isDarkMode ? '#60a5fa' : '#3b82f6') : 'transparent',
      strokeWidth: isSelected ? 2 : 0,
      rx: 4,
      ry: 4,
      style: { 
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      },
      onClick: () => {
        onSessionSelect(payload.sessionData);
        scrollToSession(payload.sessionData.id);
      },
      onMouseEnter: () => setHoveredSessionId(payload.sessionData.id),
      onMouseLeave: () => setHoveredSessionId(null),
      textProps: {
        x: x + width / 2,
        y: y - 15,
        textAnchor: 'middle' as const,
        fontSize: '11',
        fontWeight: '600',
        fill: isHighlighted ? (isDarkMode ? '#ffffff' : '#374151') : (isDarkMode ? '#ffffff' : '#374151'),
        style: { cursor: 'pointer' },
        children: payload.score
      }
    };
  }, [selectedSession, isDarkMode, hoveredSessionId, onSessionSelect]);

  // Scroll to specific session
  const scrollToSession = useCallback((sessionId: number) => {
    if (chartContainerRef.current && allChartData.length > 0) {
      const sessionIndex = allChartData.findIndex(item => item.sessionData.id === sessionId);
      
      if (sessionIndex !== -1) {
        const scrollContainer = chartContainerRef.current.closest('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          const barWidth = 110;
          const scrollPosition = sessionIndex * barWidth - (scrollContainer.clientWidth / 2) + (barWidth / 2);
          
          scrollContainer.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [allChartData]);

  // Auto-scroll to most recent session
  const scrollToMostRecent = useCallback(() => {
    if (processedSessions.length > 0 && chartContainerRef.current && allChartData.length > 0 && !hasInitialScrolled.current) {
      const mostRecentIndex = allChartData.findIndex(item => 
        item.sessionData.timestamp === Math.max(...allChartData.map(data => data.sessionData.timestamp))
      );
      
      if (mostRecentIndex !== -1) {
        const scrollContainer = chartContainerRef.current.closest('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          const barWidth = 110;
          const scrollPosition = mostRecentIndex * barWidth - (scrollContainer.clientWidth / 2) + (barWidth / 2);
          
          setTimeout(() => {
            scrollContainer.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
            hasInitialScrolled.current = true;
          }, 100);
        }
      }
    }
  }, [processedSessions, allChartData]);

  // Reset scroll flag
  const resetScroll = useCallback(() => {
    hasInitialScrolled.current = false;
  }, []);

  return {
    processedSessions,
    allChartData,
    summaryStats,
    getCustomBarProps,
    chartContainerRef,
    scrollToMostRecent,
    scrollToSession,
    resetScroll,
    hoveredSessionId,
    setHoveredSessionId,
  };
};