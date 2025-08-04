'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/ui/useTheme';
import { useGroupGoals } from '@/hooks/group/useGroupGoals';
import { useSetGroupGoal } from '@/hooks/group/useSetGroupGoal';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Progress } from '@/shadcn/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Separator } from '@/shadcn/ui/separator';
import { spacing } from '@/styles/design-system';
import { getKSTDateString } from '@/utils/timezone';
import { Edit3, Plus } from 'lucide-react';
import MemberListDialog from './MemberListDialog';

interface TodayGoalsProps {
  groupId: number;
  isGroupOwner: boolean;
  date?: string;
}

export default function TodayGoals({ groupId, isGroupOwner, date = getKSTDateString() }: TodayGoalsProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Group.GroupGoalsApiResponse | null>(null);
  const [selectedType, setSelectedType] = useState<'achieved' | 'notAchieved' | null>(null);
  
  // Form states for new goal
  const [newGoalCategory, setNewGoalCategory] = useState<'Development' | 'Design' | 'Documentation' | 'Education'>('Development');
  const [newGoalHours, setNewGoalHours] = useState('');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'DAILY' | 'WEEKLY'>('DAILY');
  
  // API hooks
  const { data: groupGoals = [], isLoading, refetch } = useGroupGoals({ groupId, date });
  const setGoalMutation = useSetGroupGoal(groupId);

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const renderAvatarGroup = (userIds: string[], isAchieved: boolean, goal: Group.GroupGoalsApiResponse) => {
    const maxVisible = 3;
    const totalAvatars = userIds.length;
    const displayedUserIds = userIds.slice(0, maxVisible);
    const remainingCount = Math.max(totalAvatars - maxVisible, 0);

    return (
      <div className="flex items-center pointer-events-none">
        {displayedUserIds.map((userId, index) => (
          <div 
            key={index} 
            className={`-ml-2 relative first:ml-0`} 
            style={{ zIndex: displayedUserIds.length - index }}
          >
            <Avatar className="w-6 h-6 ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-400 dark:group-hover:ring-gray-500">
              <AvatarImage src="" />
              <AvatarFallback className={`text-[8px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100`}>
                {userId.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="-ml-2 relative">
            <Avatar className="w-6 h-6 ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-400 dark:group-hover:ring-gray-500">
              <AvatarFallback className={`text-[8px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100`}>
                +{remainingCount}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    );
  };

  const handleGoalSave = async () => {
    if (!newGoalHours.trim()) return;
    
    const goalSeconds = parseInt(newGoalHours) * 3600; // Convert hours to seconds
    
    try {
      await setGoalMutation.mutateAsync({
        category: newGoalCategory,
        goalSeconds,
        period: newGoalPeriod
      });
      
      // Reset form and close dialog
      setNewGoalCategory('Development');
      setNewGoalHours('');
      setNewGoalPeriod('DAILY');
      setShowAddGoalDialog(false);
      
      // Refetch goals
      refetch();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleShowMemberList = (goal: Group.GroupGoalsApiResponse, type: 'achieved' | 'notAchieved') => {
    setSelectedGoal(goal);
    setSelectedType(type);
    setShowMemberDialog(true);
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };
  
  const getProgressPercentage = (currentSeconds: number, goalSeconds: number) => {
    return Math.min((currentSeconds / goalSeconds) * 100, 100);
  };
  
  if (isLoading) {
    return (
      <Card className={`${getCommonCardClass()} col-span-2 row-span-1`}>
        <CardHeader>
          <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
            Today's Goal
          </div>
        </CardHeader>
        <CardContent className={spacing.inner.normal}>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${getCommonCardClass()} col-span-2 row-span-1`}>
      <CardHeader className="flex flex-row items-center justify-center relative">
        <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
          Today's Goal
        </div>
        {isGroupOwner && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAddGoalDialog(true)}
            className={`absolute right-0 h-8 w-8 p-0 ${getThemeTextColor('secondary')} hover:${getThemeClass('componentSecondary')}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className={spacing.inner.normal}>
        <Separator className="mb-4" />
        <div className="space-y-4">
          {groupGoals.length === 0 ? (
            <div className={`text-center py-8 ${getThemeTextColor('secondary')}`}>
              {isGroupOwner ? 'No goals set yet. Click + to add a goal.' : 'No goals have been set by the group owner.'}
            </div>
          ) : (
            <div className="space-y-4">
              {groupGoals.map((goal, index) => {
                const totalMembers = goal.members.length;
                const achievedMembers = goal.members.filter(m => m.currentSeconds >= goal.goalSeconds);
                const notAchievedMembers = goal.members.filter(m => m.currentSeconds < goal.goalSeconds);
                const progressPercentage = totalMembers > 0 ? (achievedMembers.length / totalMembers) * 100 : 0;
                
                return (
                  <div key={`${goal.category}-${goal.periodType}`} className={`p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getThemeClass('component')} ${getThemeTextColor('secondary')}`}>
                          {index + 1}
                        </div>
                        <div className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                          {goal.category} - {formatTime(goal.goalSeconds)} ({goal.periodType.toLowerCase()})
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-24">
                            <Progress 
                              value={progressPercentage} 
                              className="h-2 bg-gray-200 [&>div]:bg-green-500"
                            />
                          </div>
                          <span className={`text-xs font-bold ${getThemeTextColor('primary')}`}>
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${getThemeTextColor('secondary')}`}>
                          {achievedMembers.length}/{totalMembers}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-3">
                      {/* 달성한 사람들 */}
                      <div 
                        className="flex-1 cursor-pointer group p-2 -m-2"
                        onClick={() => handleShowMemberList(goal, 'achieved')}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100`}>
                            Achieved ({achievedMembers.length})
                          </span>
                        </div>
                        <div>
                          {renderAvatarGroup(achievedMembers.map(m => m.userId), true, goal)}
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-16" />

                      {/* 달성하지 못한 사람들 */}
                      <div 
                        className="flex-1 cursor-pointer group p-2 -m-2"
                        onClick={() => handleShowMemberList(goal, 'notAchieved')}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100`}>
                            Not Achieved ({notAchievedMembers.length})
                          </span>
                        </div>
                        <div>
                          {renderAvatarGroup(notAchievedMembers.map(m => m.userId), false, goal)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      {/* 목표 추가 다이얼로그 */}
      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className={`sm:max-w-md ${getCommonCardClass()}`}>
          <DialogHeader>
            <DialogTitle className={`text-lg font-bold ${getThemeTextColor('primary')}`}>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category" className={getThemeTextColor('primary')}>Category</Label>
              <Select value={newGoalCategory} onValueChange={(value: 'Development' | 'Design' | 'Documentation' | 'Education') => setNewGoalCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours" className={getThemeTextColor('primary')}>Goal Hours</Label>
              <Input
                id="hours"
                type="number"
                placeholder="Enter hours (e.g., 8)"
                value={newGoalHours}
                onChange={(e) => setNewGoalHours(e.target.value)}
                min="1"
                max="24"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period" className={getThemeTextColor('primary')}>Period</Label>
              <Select value={newGoalPeriod} onValueChange={(value: 'DAILY' | 'WEEKLY') => setNewGoalPeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddGoalDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGoalSave}
              disabled={!newGoalHours.trim() || setGoalMutation.isPending}
            >
              {setGoalMutation.isPending ? 'Adding...' : 'Add Goal'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 멤버 리스트 다이얼로그 */}
      <MemberListDialog
        open={showMemberDialog}
        onOpenChange={setShowMemberDialog}
        goal={selectedGoal}
        type={selectedType}
      />
    </Card>
  );
}