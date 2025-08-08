'use client';

import { UserAvatar } from '@/components/common';
import { useDeleteGroupGoal } from '@/hooks/group/useDeleteGroupGoal';
import { useGroupGoals } from '@/hooks/group/useGroupGoals';
import { useSetGroupGoal } from '@/hooks/group/useSetGroupGoal';
import { useTheme } from '@/hooks/ui/useTheme';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Label } from '@/shadcn/ui/label';
import { Progress } from '@/shadcn/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Separator } from '@/shadcn/ui/separator';
import { spacing } from '@/styles/design-system';
import { getKSTDateString } from '@/utils/timezone';
import { Check, Clock, Edit3, Plus, Target, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import MemberListDialog from './MemberListDialog';

// Zod 스키마 정의
const GoalFormSchema = z.object({
  category: z.enum(['Development', 'Design', 'Documentation', 'Education', 'work']),
  hours: z.number().min(0, 'Hours must be 0 or greater'),
  minutes: z.number().min(0, 'Minutes must be 0 or greater').max(59, 'Minutes must be less than 60'),
  period: z.enum(['DAILY', 'WEEKLY'])
}).refine((data) => {
  // 최소 시간 체크 (최소 30분)
  const totalMinutes = data.hours * 60 + data.minutes;
  return totalMinutes >= 30;
}, {
  message: "Goal must be at least 30 minutes",
  path: ["minutes"]
}).refine((data) => {
  // 최대 시간 체크
  const totalMinutes = data.hours * 60 + data.minutes;
  const maxMinutes = data.period === 'DAILY' ? 24 * 60 : 168 * 60; // 24시간 (일간), 168시간 (주간)
  return totalMinutes <= maxMinutes;
}, {
  message: "Goal time exceeds maximum limit",
  path: ["hours"]
});

type GoalFormData = z.infer<typeof GoalFormSchema>;

interface TodayGoalsProps {
  groupId: number;
  isGroupOwner: boolean;
  groupMembers?: Group.GroupUserInfo[];
  selectedPeriod?: 'daily' | 'weekly';
  date?: string;
}

export default function TodayGoals({ groupId, isGroupOwner, groupMembers = [], selectedPeriod = 'daily', date = getKSTDateString() }: TodayGoalsProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const currentUser = useCurrentUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showGoalTypeDialog, setShowGoalTypeDialog] = useState(false);
  const [goalType, setGoalType] = useState<'time' | 'sessionScore' | 'sessionCount' | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Group.GroupGoalsApiResponse | null>(null);
  const [selectedType, setSelectedType] = useState<'achieved' | 'notAchieved' | null>(null);
  
  // Form states for new goal
  const [newGoalCategory, setNewGoalCategory] = useState<'Development' | 'Design' | 'Documentation' | 'Education' | 'work'>('Development');
  const [newGoalHours, setNewGoalHours] = useState(1);
  const [newGoalMinutes, setNewGoalMinutes] = useState(0);
  const [newGoalSessions, setNewGoalSessions] = useState(3);
  const [newGoalSessionScore, setNewGoalSessionScore] = useState(300);
  const [newGoalPeriod, setNewGoalPeriod] = useState<'DAILY' | 'WEEKLY'>(
    selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY'
  );
  
  // Validation states
  const [validationError, setValidationError] = useState<string>('');
  
  // API hooks
  const { data: allGroupGoals = [], isLoading, refetch } = useGroupGoals({ groupId, date });
  const setGoalMutation = useSetGroupGoal(groupId);
  const deleteGoalMutation = useDeleteGroupGoal(groupId);

  // Filter goals by selected period and sort with priority
  const groupGoals = allGroupGoals
    .filter(goal => goal.periodType === (selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY'))
    .sort((a, b) => {
      // Priority order: sessionScore -> sessionCount -> work -> Work -> Development -> others alphabetically
      const getPriority = (category: string) => {
        if (category === 'sessionScore') return 0;
        if (category === 'sessionCount') return 1;
        if (category === 'work' || category === 'Work') return 2;
        if (category === 'Development') return 3;
        return 4;
      };
      
      const priorityA = getPriority(a.category);
      const priorityB = getPriority(b.category);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort alphabetically
      return a.category.localeCompare(b.category);
    });

  // Update new goal period when selected period changes
  useEffect(() => {
    setNewGoalPeriod(selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY');
    setValidationError(''); // Clear validation error when period changes
  }, [selectedPeriod]);

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getUserNickname = (userId: string) => {
    const member = groupMembers.find(m => m.userId === userId);
    return member?.nickname || userId;
  };

  const renderAvatarGroup = (userIds: string[], isAchieved: boolean, goal: Group.GroupGoalsApiResponse) => {
    const maxVisible = 3;
    const totalAvatars = userIds.length;
    
    // 현재 사용자가 리스트에 있으면 맨 앞으로 이동
    let sortedUserIds = [...userIds];
    const currentUserIndex = sortedUserIds.findIndex(id => id === currentUser?.id);
    if (currentUserIndex > -1) {
      const [currentUserId] = sortedUserIds.splice(currentUserIndex, 1);
      sortedUserIds.unshift(currentUserId);
    }
    
    const displayedUserIds = sortedUserIds.slice(0, maxVisible);
    const remainingCount = Math.max(totalAvatars - maxVisible, 0);

    return (
      <div className="flex items-center pointer-events-none">
        {displayedUserIds.map((userId, index) => {
          const isCurrentUser = userId === currentUser?.id;
          return (
            <div 
              key={index} 
              className={`-ml-2 relative first:ml-0 group`} 
              style={{ zIndex: displayedUserIds.length - index }}
            >
              <UserAvatar
                nickname={getUserNickname(userId)}
                size="xs"
                isCurrentUser={isCurrentUser}
                isAchieved={isAchieved}
                showBorder={isCurrentUser}
              />
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div className="-ml-2 relative">
            <div className="w-6 h-6 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-400 dark:group-hover:ring-gray-500 bg-white dark:bg-gray-800 flex items-center justify-center">
              <span className="text-[8px] font-semibold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                +{remainingCount > 99 ? '99+' : remainingCount}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const validateForm = (): boolean => {
    setValidationError('');
    
    try {
      // Zod 검증
      const formData: GoalFormData = {
        category: newGoalCategory,
        hours: newGoalHours,
        minutes: newGoalMinutes,
        period: newGoalPeriod
      };
      
      GoalFormSchema.parse(formData);
      
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        if (firstError.message === "Goal time exceeds maximum limit") {
          const maxHours = newGoalPeriod === 'DAILY' ? 24 : 168;
          setValidationError(`Goal time cannot exceed ${maxHours} hours for ${newGoalPeriod.toLowerCase()} goals`);
        } else {
          setValidationError(firstError.message);
        }
      }
      return false;
    }
  };

  const handleGoalSave = async () => {
    if (goalType === 'time' && !validateForm()) return;
    
    let goalValue: number;
    let category: 'Development' | 'Design' | 'Documentation' | 'Education' | 'work' | 'sessionScore' | 'sessionCount';
    
    if (goalType === 'sessionScore') {
      // For session score goals: category='sessionScore', goalValue=total score
      category = 'sessionScore';
      goalValue = newGoalSessionScore;
    } else if (goalType === 'sessionCount') {
      // For session count goals: category='sessionCount', goalValue=number of sessions
      category = 'sessionCount';
      goalValue = newGoalSessions;
    } else {
      // For time-based goals, convert hours and minutes to seconds
      category = newGoalCategory;
      goalValue = (newGoalHours * 3600) + (newGoalMinutes * 60);
    }
    
    try {
      await setGoalMutation.mutateAsync({
        category,
        goalValue,
        period: newGoalPeriod
      });
      
      // Reset form and close dialog
      setNewGoalCategory('Development');
      setNewGoalHours(1);
      setNewGoalMinutes(0);
      setNewGoalSessions(3);
      setNewGoalSessionScore(300);
      setNewGoalPeriod(selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY');
      setValidationError('');
      setShowAddGoalDialog(false);
      setGoalType(null);
      
      // Exit edit mode after adding
      if (isEditing) {
        setIsEditing(false);
      }
      
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

  const handleDeleteGoal = async (goal: Group.GroupGoalsApiResponse) => {
    try {
      await deleteGoalMutation.mutateAsync({
        category: goal.category,
        period: goal.periodType
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddGoalInEdit = () => {
    setValidationError('');
    setShowGoalTypeDialog(true);
  };
  
  const handleGoalTypeSelect = (type: 'time' | 'sessionScore' | 'sessionCount') => {
    setGoalType(type);
    setShowGoalTypeDialog(false);
    setShowAddGoalDialog(true);
  };

  const handleHoursChange = (value: string) => {
    setNewGoalHours(parseInt(value));
    setValidationError(''); // Clear validation error on input change
  };

  const handleMinutesChange = (value: string) => {
    setNewGoalMinutes(parseInt(value));
    setValidationError(''); // Clear validation error on input change
  };

  const handleCategoryChange = (value: 'Development' | 'Design' | 'Documentation' | 'Education' | 'work') => {
    setNewGoalCategory(value);
    setValidationError(''); // Clear validation error on input change
  };

  const handlePeriodChange = (value: 'DAILY' | 'WEEKLY') => {
    setNewGoalPeriod(value);
    setValidationError(''); // Clear validation error on input change
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };
  
  const getProgressPercentage = (currentSeconds: number, goalValue: number) => {
    return Math.min((currentSeconds / goalValue) * 100, 100);
  };
  
  if (isLoading) {
    return (
      <Card className={`${getCommonCardClass()} col-span-2 row-span-1 h-[400px] lg:h-[500px] flex flex-col`}>
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
    <Card className={`${getCommonCardClass()} col-span-2 row-span-1 h-[400px] lg:h-[500px] flex flex-col`}>
      <CardHeader className="text-center relative flex-shrink-0">
        <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
          {selectedPeriod === 'daily' ? "Daily Goal" : "Weekly Goal"}
        </div>
        {isGroupOwner && !isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleStartEdit}
            className={`absolute top-3 right-4 h-6 w-6 p-0 rounded-md transition-all duration-200 ${getThemeTextColor('secondary')} hover:bg-gray-100 hover:${getThemeTextColor('primary')} dark:hover:bg-gray-700`}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
        )}
        {isGroupOwner && isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancelEdit}
            className={`absolute top-3 right-4 h-6 w-6 p-0 rounded-md transition-all duration-200 ${getThemeTextColor('secondary')} hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700`}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className={`${spacing.inner.normal} flex-1 flex flex-col overflow-hidden`}>
        <Separator className="mb-4 flex-shrink-0" />
        <div className="flex-1 flex flex-col min-h-0">
          {groupGoals.length === 0 ? (
            <div className="space-y-4">
              <div className={`text-center py-8 ${getThemeTextColor('secondary')}`}>
                {isGroupOwner ? (isEditing ? `No ${selectedPeriod} goals set yet. Click + to add a goal.` : `No ${selectedPeriod} goals set yet. Click Edit to manage goals.`) : `No ${selectedPeriod} goals have been set by the group owner.`}
              </div>
              
              {/* 편집 모드에서 목표 추가 버튼 (목표가 없을 때) */}
              {isGroupOwner && isEditing && (
                <div 
                  onClick={handleAddGoalInEdit}
                  className={`p-3 rounded-lg border-2 border-dashed ${getThemeClass('border')} ${getThemeClass('componentSecondary')} cursor-pointer hover:${getThemeClass('component')} transition-colors`}
                >
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Plus className={`h-5 w-5 ${getThemeTextColor('secondary')}`} />
                    <span className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                      Add New {selectedPeriod === 'daily' ? 'Daily' : 'Weekly'} Goal
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {groupGoals.map((goal, index) => {
                const totalMembers = goal.members.length;
                const achievedMembers = goal.members.filter(m => m.currentSeconds >= goal.goalValue);
                const notAchievedMembers = goal.members.filter(m => m.currentSeconds < goal.goalValue);
                const progressPercentage = totalMembers > 0 ? (achievedMembers.length / totalMembers) * 100 : 0;
                
                // 현재 사용자가 이 목표를 달성했는지 확인
                const currentUserMember = goal.members.find(m => m.userId === currentUser?.id);
                const isCurrentUserAchieved = currentUserMember ? currentUserMember.currentSeconds >= goal.goalValue : false;
                
                return (
                  <div key={`${goal.category}-${goal.periodType}`} className={`p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCurrentUserAchieved ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          {isCurrentUserAchieved ? (
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          ) : (
                            <X className="h-3 w-3 text-red-500 dark:text-red-400" />
                          )}
                        </div>
                        <div className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                          {goal.category === 'sessionScore' 
                            ? `Session Score - ${goal.goalValue} points`
                            : goal.category === 'sessionCount'
                            ? `Session Count - ${goal.goalValue} session${goal.goalValue > 1 ? 's' : ''}`
                            : `${goal.category === 'work' ? 'Work' : goal.category} - ${formatTime(goal.goalValue)}`
                          }
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
                        {isGroupOwner && isEditing && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGoal(goal)}
                            disabled={deleteGoalMutation.isPending}
                            className={`h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-3">
                      {/* 달성한 사람들 */}
                      <div 
                        className={`flex-1 ${!isEditing ? 'cursor-pointer' : 'cursor-default'} group p-2 -m-2`}
                        onClick={!isEditing ? () => handleShowMemberList(goal, 'achieved') : undefined}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-medium ${isCurrentUserAchieved ? 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
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
                        className={`flex-1 ${!isEditing ? 'cursor-pointer' : 'cursor-default'} group p-2 -m-2`}
                        onClick={!isEditing ? () => handleShowMemberList(goal, 'notAchieved') : undefined}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-medium ${!isCurrentUserAchieved ? 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
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
              
              {/* 편집 모드에서 목표 추가 버튼 */}
              {isGroupOwner && isEditing && (
                <div 
                  onClick={handleAddGoalInEdit}
                  className={`p-3 rounded-lg border-2 border-dashed ${getThemeClass('border')} ${getThemeClass('componentSecondary')} cursor-pointer hover:${getThemeClass('component')} transition-colors`}
                >
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Plus className={`h-5 w-5 ${getThemeTextColor('secondary')}`} />
                    <span className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                      Add New {selectedPeriod === 'daily' ? 'Daily' : 'Weekly'} Goal
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* 목표 타입 선택 다이얼로그 */}
      <Dialog open={showGoalTypeDialog} onOpenChange={setShowGoalTypeDialog}>
        <DialogContent className={`sm:max-w-md ${getCommonCardClass()}`}>
          <DialogHeader>
            <DialogTitle className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
              Select Goal Type
            </DialogTitle>
            <DialogDescription className={`${getThemeTextColor('secondary')}`}>
              Choose how you want to set your {selectedPeriod} goal
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <button
              onClick={() => handleGoalTypeSelect('time')}
              className={`p-4 rounded-lg border-2 ${getThemeClass('border')} ${getThemeClass('component')} hover:${getThemeClass('componentSecondary')} transition-all duration-200 group`}
            >
              <div className="flex items-start gap-3">
                <Clock className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')} group-hover:text-blue-500`} />
                <div className="text-left flex-1">
                  <div className={`font-semibold ${getThemeTextColor('primary')}`}>
                    Time-based Goal
                  </div>
                  <div className={`text-sm mt-1 ${getThemeTextColor('secondary')}`}>
                    Set goals based on specific time duration for each category (e.g., 2 hours of Development)
                  </div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleGoalTypeSelect('sessionScore')}
              className={`p-4 rounded-lg border-2 ${getThemeClass('border')} ${getThemeClass('component')} hover:${getThemeClass('componentSecondary')} transition-all duration-200 group`}
            >
              <div className="flex items-start gap-3">
                <Target className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')} group-hover:text-green-500`} />
                <div className="text-left flex-1">
                  <div className={`font-semibold ${getThemeTextColor('primary')}`}>
                    Session Score Goal
                  </div>
                  <div className={`text-sm mt-1 ${getThemeTextColor('secondary')}`}>
                    Set goals based on total session quality score
                  </div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleGoalTypeSelect('sessionCount')}
              className={`p-4 rounded-lg border-2 ${getThemeClass('border')} ${getThemeClass('component')} hover:${getThemeClass('componentSecondary')} transition-all duration-200 group`}
            >
              <div className="flex items-start gap-3">
                <Target className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')} group-hover:text-purple-500`} />
                <div className="text-left flex-1">
                  <div className={`font-semibold ${getThemeTextColor('primary')}`}>
                    Session Count Goal
                  </div>
                  <div className={`text-sm mt-1 ${getThemeTextColor('secondary')}`}>
                    Set goals based on number of focused work sessions
                  </div>
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 목표 추가 다이얼로그 */}
      <Dialog open={showAddGoalDialog} onOpenChange={(open) => {
        setShowAddGoalDialog(open);
        if (!open) {
          // When closing the dialog, go back to goal type selection
          setShowGoalTypeDialog(true);
          setGoalType(null);
          setValidationError('');
        }
      }}>
        <DialogContent className={`sm:max-w-md ${getCommonCardClass()}`}>
          <DialogHeader>
            <DialogTitle className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
              Add New {goalType === 'sessionScore' ? 'Session Score' : goalType === 'sessionCount' ? 'Session Count' : 'Time'}-based {selectedPeriod === 'daily' ? 'Daily' : 'Weekly'} Goal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {goalType === 'time' && (
              <div className="space-y-2">
                <Label htmlFor="category" className={getThemeTextColor('primary')}>Category</Label>
                <Select value={newGoalCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {goalType === 'time' ? (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={getThemeTextColor('primary')}>Hours</Label>
                    <Select value={newGoalHours.toString()} onValueChange={handleHoursChange}>
                      <SelectTrigger className={`w-full min-w-[120px] ${validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {Array.from({ length: newGoalPeriod === 'DAILY' ? 25 : 169 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className={getThemeTextColor('primary')}>Minutes</Label>
                    <Select value={newGoalMinutes.toString()} onValueChange={handleMinutesChange}>
                      <SelectTrigger className={`w-full min-w-[120px] ${validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {[0, 15, 30, 45].map((minute) => (
                          <SelectItem key={minute} value={minute.toString()}>{minute}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {newGoalPeriod === 'DAILY' ? 'Daily goal range: 30 minutes to 24 hours' : 'Weekly goal range: 30 minutes to 168 hours'}
                </div>
              </>
            ) : goalType === 'sessionScore' ? (
              <>
                <div className="space-y-2">
                  <Label className={getThemeTextColor('primary')}>Target Session Score</Label>
                  <Select value={newGoalSessionScore.toString()} onValueChange={(value) => setNewGoalSessionScore(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000].map((score) => (
                        <SelectItem key={score} value={score.toString()}>{score} points</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Track your total session quality score across all work sessions
                </div>
              </>
            ) : goalType === 'sessionCount' ? (
              <>
                <div className="space-y-2">
                  <Label className={getThemeTextColor('primary')}>Target Number of Sessions</Label>
                  <Select value={newGoalSessions.toString()} onValueChange={(value) => setNewGoalSessions(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {Array.from({ length: newGoalPeriod === 'DAILY' ? 20 : 100 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} session{i > 0 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Track the number of focused work sessions you complete
                </div>
              </>
            ) : null}
            
            <div className="space-y-2">
              <Label htmlFor="period" className={getThemeTextColor('primary')}>Period</Label>
              <Select value={newGoalPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddGoalDialog(false);
                setShowGoalTypeDialog(true);
                setGoalType(null);
                setValidationError('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGoalSave}
              disabled={setGoalMutation.isPending || (goalType === 'time' && (!!validationError || (newGoalHours === 0 && newGoalMinutes === 0)))}
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
        groupMembers={groupMembers}
      />
    </Card>
  );
}