'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { Button } from '@/shadcn/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { ChartConfig, ChartContainer } from '@/shadcn/ui/chart';
import { Target } from 'lucide-react';
import { useState } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, RadialBar, RadialBarChart } from 'recharts';

interface DailyGoalCardProps {
  totalTime: number; // seconds
  goalTime?: number; // seconds, default 8 hours
  isLoading?: boolean;
}

export default function DailyGoalCard({
  totalTime,
  goalTime = 8 * 3600, // 8 hours default
  isLoading = false,
}: DailyGoalCardProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(goalTime / 3600); // Store in hours
  
  // Time formatting
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Calculate progress percentage
  const goalSeconds = currentGoal * 3600;
  const progressPercentage = Math.min(Math.round((totalTime / goalSeconds) * 100), 100);
  const isGoalMet = totalTime >= goalSeconds;

  // Prepare data for radial charts
  const chartData = [
    {
      category: 'Progress',
      value: progressPercentage,
      fill: isGoalMet ? '#10b981' : '#a855f7',
    }
  ];

  const chartConfig = {
    value: {
      label: 'Progress',
      color: isGoalMet ? '#10b981' : '#a855f7',
    },
  } satisfies ChartConfig;

  // Handle goal adjustment
  const adjustGoal = (delta: number) => {
    const newGoal = Math.max(1, Math.min(24, currentGoal + delta));
    setCurrentGoal(newGoal);
  };

  // Split total time into hours for 3 charts
  const hours = Math.floor(totalTime / 3600);
  const goalHours = currentGoal;
  
  // Calculate values for each radial chart
  const firstChartHours = Math.min(hours, Math.ceil(goalHours / 3));
  const secondChartHours = Math.max(0, Math.min(hours - Math.ceil(goalHours / 3), Math.ceil(goalHours / 3)));
  const thirdChartHours = Math.max(0, Math.min(hours - 2 * Math.ceil(goalHours / 3), Math.ceil(goalHours / 3)));

  // Create data for RadialBarChart
  const createChartData = (value: number, maxValue: number) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return [{
      name: 'Progress',
      value: Math.min(percentage, 100),
    }];
  };

  const chartConfigs = [
    {
      data: createChartData(firstChartHours, Math.ceil(goalHours / 3)),
      value: firstChartHours,
      max: Math.ceil(goalHours / 3),
    },
    {
      data: createChartData(secondChartHours, Math.ceil(goalHours / 3)),
      value: secondChartHours,
      max: Math.ceil(goalHours / 3),
    },
    {
      data: createChartData(thirdChartHours, Math.ceil(goalHours / 3)),
      value: thirdChartHours,
      max: Math.ceil(goalHours / 3),
    },
  ];

  if (isLoading) {
    return (
      <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-20 h-20 animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        {/* Radial Charts */}
        <div className="flex justify-center items-center gap-4">
          {chartConfigs.map((config, index) => {
            const percentage = config.data[0].value;
            const isFilled = percentage >= 100;
            
            return (
              <div key={index} className="relative">
                <ChartContainer
                  config={{
                    Progress: {
                      label: 'Progress',
                      color: isFilled ? '#10b981' : '#a855f7',
                    },
                  }}
                  className="aspect-square w-20 h-20"
                >
                  <RadialBarChart
                    data={config.data}
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={30}
                    outerRadius={40}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[32, 28]}
                    />
                    <RadialBar
                      dataKey="value"
                      background
                      cornerRadius={10}
                      fill={isFilled ? '#10b981' : '#a855f7'}
                    />
                  </RadialBarChart>
                </ChartContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold ${getThemeTextColor('primary')}`}>
                    {config.value}h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}