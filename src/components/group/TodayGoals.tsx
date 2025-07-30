'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Progress } from '@/shadcn/ui/progress';
import { Separator } from '@/shadcn/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { spacing } from '@/styles/design-system';
import { Plus } from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  achieved: string[];
  notAchieved: string[];
}

interface TodayGoalsProps {
  goals: Goal[];
}

export default function TodayGoals({ goals }: TodayGoalsProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const renderAvatarGroup = (names: string[], isAchieved: boolean) => {
    const maxVisible = 3;
    const totalAvatars = names.length;
    const displayedNames = names.slice(0, maxVisible);
    const remainingCount = Math.max(totalAvatars - maxVisible, 0);

    return (
      <div className="flex items-center">
        {displayedNames.map((name, index) => (
          <div key={index} className={`-ml-2 hover:z-10 relative first:ml-0`} style={{ zIndex: displayedNames.length - index }}>
            <Avatar className="w-6 h-6 ring-1 ring-gray-200 dark:ring-gray-700">
              <AvatarImage src="" />
              <AvatarFallback className={`text-[8px] font-semibold ${getThemeClass('component')} ${getThemeTextColor('primary')}`}>
                {getAvatarInitials(name)}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
        {remainingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="w-6 h-6 -ml-2 hover:z-10 relative ring-1 ring-gray-200 dark:ring-gray-700 cursor-pointer">
                  <AvatarFallback className={`text-[8px] font-bold ${getThemeClass('component')} ${getThemeTextColor('primary')}`}>
                    +{remainingCount}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium mb-2">
                    {isAchieved ? 'Also Achieved:' : 'Also Not Achieved:'}
                  </div>
                  {names.slice(maxVisible).map((name, i) => (
                    <div key={i} className="text-xs">
                      {name}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  const handleGoalSave = () => {
    setNewGoal('');
    setIsEditingGoal(false);
    // TODO: API로 새 목표 추가 로직 구현
  };

  return (
    <Card className={`${getCommonCardClass()} col-span-2 row-span-1`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
          Today's Goal
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditingGoal(true)}
          className={`h-8 w-8 p-0 ${getThemeTextColor('secondary')} hover:${getThemeClass('componentSecondary')}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className={spacing.inner.normal}>
        <Separator className="mb-4" />
        <div className="space-y-4">
          {isEditingGoal ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF]`}
                placeholder="Enter a new goal..."
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleGoalSave}
                  disabled={!newGoal.trim()}
                  className={`${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')} hover:${getThemeClass('component')}`}
                >
                  Add Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingGoal(false);
                    setNewGoal('');
                  }}
                  className={`${getThemeClass('component')} ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={goal.id} className={`p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getThemeClass('component')} ${getThemeTextColor('secondary')}`}>
                        {index + 1}
                      </div>
                      <div className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                        {goal.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="relative w-24">
                          <Progress 
                            value={(goal.achieved.length / (goal.achieved.length + goal.notAchieved.length)) * 100} 
                            className="h-2 bg-gray-200"
                          />
                          <div className="absolute inset-0 h-2 rounded-full bg-green-500" 
                            style={{ width: `${(goal.achieved.length / (goal.achieved.length + goal.notAchieved.length)) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${getThemeTextColor('primary')}`}>
                          {Math.round((goal.achieved.length / (goal.achieved.length + goal.notAchieved.length)) * 100)}%
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${getThemeTextColor('secondary')}`}>
                        {goal.achieved.length}/{goal.achieved.length + goal.notAchieved.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-3">
                    {/* 달성한 사람들 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium ${getThemeTextColor('secondary')}`}>
                          Achieved ({goal.achieved.length})
                        </span>
                      </div>
                      {renderAvatarGroup(goal.achieved, true)}
                    </div>

                    <Separator orientation="vertical" className="h-16" />

                    {/* 달성하지 못한 사람들 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium ${getThemeTextColor('secondary')}`}>
                          Not Achieved ({goal.notAchieved.length})
                        </span>
                      </div>
                      {renderAvatarGroup(goal.notAchieved, false)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}