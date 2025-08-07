'use client';

import { useDeleteGroupGoal } from '@/hooks/group/useDeleteGroupGoal';
import { useGroupGoals } from '@/hooks/group/useGroupGoals';
import { useSetGroupGoal } from '@/hooks/group/useSetGroupGoal';
import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Progress } from '@/shadcn/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Separator } from '@/shadcn/ui/separator';
import { useCurrentUser } from '@/stores/userStore';
import { spacing } from '@/styles/design-system';
import { getKSTDateString } from '@/utils/timezone';
import { Check, Edit3, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import MemberListDialog from './MemberListDialog';

interface TodayGoalsProps {
  groupId: number;
  isGroupOwner: boolean;
  groupMembers?: Group.GroupUserInfo[];
  selectedPeriod?: 'daily' | 'weekly';
  date?: string;
}

export default function TodayGoals({ groupId, isGroupOwner, groupMembers = [], selectedPeriod = 'daily', date = getKSTDateString() }: TodayGoalsProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const currentUser = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Group.GroupGoalsApiResponse | null>(null);
  const [selectedType, setSelectedType] = useState<'achieved' | 'notAchieved' | null>(null);
  
  // Form states for new goal
  const [newGoalCategory, setNewGoalCategory] = useState<'Development' | 'Design' | 'Documentation' | 'Education'>('Development');
  const [newGoalHours, setNewGoalHours] = useState('');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'DAILY' | 'WEEKLY'>(
    selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY'
  );
  
  // API hooks
  const { data: allGroupGoals = [], isLoading, refetch } = useGroupGoals({ groupId, date });
  const setGoalMutation = useSetGroupGoal(groupId);
  const deleteGoalMutation = useDeleteGroupGoal(groupId);

  // Filter goals by selected period
  const groupGoals = allGroupGoals.filter(goal => 
    goal.periodType === (selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY')
  );

  // Update new goal period when selected period changes
  useEffect(() => {
    setNewGoalPeriod(selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY');
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
              className={`-ml-2 relative first:ml-0`} 
              style={{ zIndex: displayedUserIds.length - index }}
            >
              <Avatar className={`w-6 h-6 ${isCurrentUser ? `ring-2 ${isAchieved ? 'ring-green-400 dark:ring-green-500' : 'ring-red-400 dark:ring-red-500'}` : 'ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-400 dark:group-hover:ring-gray-500'}`}>
                <AvatarImage src="" />
                <AvatarFallback className={`text-[8px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100`}>
                  {getUserNickname(userId).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })}
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
      setNewGoalPeriod(selectedPeriod === 'daily' ? 'DAILY' : 'WEEKLY');
      setShowAddGoalDialog(false);
      
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
    setShowAddGoalDialog(true);
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
      <Card className={`${getCommonCardClass()} col-span-2 row-span-1 h-[500px] flex flex-col`}>
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
    <Card className={`${getCommonCardClass()} col-span-2 row-span-1 h-[500px] flex flex-col`}>
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
      <CardContent className={`${spacing.inner.normal} flex-1 overflow-hidden`}>
        <Separator className="mb-4" />
        <div className="space-y-4 h-full flex flex-col">
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
            <div className="space-y-4 flex-1 overflow-y-auto">
              {groupGoals.map((goal, index) => {
                const totalMembers = goal.members.length;
                const achievedMembers = goal.members.filter(m => m.currentSeconds >= goal.goalSeconds);
                const notAchievedMembers = goal.members.filter(m => m.currentSeconds < goal.goalSeconds);
                const progressPercentage = totalMembers > 0 ? (achievedMembers.length / totalMembers) * 100 : 0;
                
                // 현재 사용자가 이 목표를 달성했는지 확인
                const currentUserMember = goal.members.find(m => m.userId === currentUser?.id);
                const isCurrentUserAchieved = currentUserMember ? currentUserMember.currentSeconds >= goal.goalSeconds : false;
                
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
                          {goal.category} - {formatTime(goal.goalSeconds)}
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
                        className={`flex-1 ${!isEditing ? 'cursor-pointer' : 'cursor-default'} group p-2 -m-2`}
                        onClick={!isEditing ? () => handleShowMemberList(goal, 'notAchieved') : undefined}
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

      {/* 목표 추가 다이얼로그 */}
      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className={`sm:max-w-md ${getCommonCardClass()}`}>
          <DialogHeader>
            <DialogTitle className={`text-lg font-bold ${getThemeTextColor('primary')}`}>Add New {selectedPeriod === 'daily' ? 'Daily' : 'Weekly'} Goal</DialogTitle>
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
        groupMembers={groupMembers}
      />
    </Card>
  );
}