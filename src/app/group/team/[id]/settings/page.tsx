'use client';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import PageLoader from '@/components/common/PageLoader';
import StateDisplay from '@/components/common/StateDisplay';
import { GroupNameInput } from '@/components/forms/GroupNameInput';
import { GROUP_VALIDATION_MESSAGES } from '@/config/constants';
import { useBanMember, useDeleteGroup, useLeaveGroup, useTransferOwnership, useUpdateGroup } from '@/hooks/group/useGroupSettings';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import { useTheme } from '@/hooks/ui/useTheme';
import { UpdateGroupFormData, updateGroupSchema } from '@/schemas/groupSchema';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { useCurrentUser } from '@/stores/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Crown, Globe, Hash, Lock, MoreVertical, Plus, Save, Trash2, UserMinus, Users, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


export default function GroupSettingsPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const params = useParams();
  const currentUser = useCurrentUser();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showBanDialog, setShowBanDialog] = React.useState(false);
  const [showTransferDialog, setShowTransferDialog] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Group.GroupUserInfo | null>(null);
  const [banReason, setBanReason] = React.useState('');
  
  // Save current tab as last visited
  useLastGroupTab();
  
  const groupId = Array.isArray(params.id) ? parseInt(params.id[0], 10) : parseInt(params.id as string, 10);

  // 그룹 상세 정보 조회
  const { data: groupDetail, isLoading, error, refetch } = useGroupDetail({
    groupId,
    enabled: !!groupId,
  });

  // 권한 확인 - 그룹장만 접근 가능
  const isGroupOwner = groupDetail && currentUser && groupDetail.owner.userId === currentUser.id;

  // Group mutations
  const updateGroupMutation = useUpdateGroup(groupId);
  const deleteGroupMutation = useDeleteGroup(groupId);
  const banMemberMutation = useBanMember(groupId);
  const leaveGroupMutation = useLeaveGroup(groupId);
  const transferOwnershipMutation = useTransferOwnership(groupId);

  const form = useForm<UpdateGroupFormData>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: '',
      isPublic: true,
      tags: [],
    },
  });

  const { watch, setValue, getValues, reset } = form;
  const watchedValues = watch();

  // 그룹 데이터로 폼 초기화
  React.useEffect(() => {
    if (groupDetail) {
      reset({
        name: groupDetail.name,
        isPublic: groupDetail.isPublic,
        tags: groupDetail.tags,
      });
    }
  }, [groupDetail, reset]);

  // Add tag handler
  const handleAddTag = (newTag: string) => {
    const currentTags = getValues('tags');
    if (newTag.trim() && !currentTags.includes(newTag.trim()) && currentTags.length < 5) {
      setValue('tags', [...currentTags, newTag.trim()]);
    }
  };

  // Remove tag handler
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues('tags');
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  // Validation error handler
  const onError = (errors: any) => {
    // Show validation error toast with specific messages
    if (errors.name) {
      toast.error(`Group Name: ${errors.name.message}`);
      return;
    }
    if (errors.description) {
      toast.error(`Description: ${errors.description.message}`);
      return;
    }
    if (errors.groundRules) {
      toast.error(`Ground Rules: ${errors.groundRules.message || GROUP_VALIDATION_MESSAGES.GROUND_RULES.EMPTY}`);
      return;
    }
    if (errors.tags) {
      toast.error(`Tags: ${errors.tags.message}`);
      return;
    }
  };

  // Form submit handler for valid data
  const onValidSubmit = async (values: UpdateGroupFormData) => {
    await onSubmit(values);
  };

  // Form submit handler
  const onSubmit = async (values: UpdateGroupFormData) => {
    if (!groupDetail) return;

    const request: Group.UpdateGroupApiRequest = {
      name: values.name,
      description: values.description || groupDetail.description,
      groundRule: values.groundRules 
        ? values.groundRules.filter(rule => rule.trim().length > 0).join('\n')
        : groupDetail.groundRule,
      tags: values.tags,
      isPublic: values.isPublic,
    };

    try {
      await updateGroupMutation.mutateAsync(request);
      // 성공 시 토스트는 mutation의 onSuccess에서 처리됨
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 그룹 삭제 핸들러
  const handleDeleteGroup = async () => {
    try {
      await deleteGroupMutation.mutateAsync();
      setShowDeleteDialog(false);
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 멤버 추방 핸들러
  const handleBanMember = async (reason?: string) => {
    if (!selectedMember || !reason?.trim()) return;
    
    try {
      await banMemberMutation.mutateAsync({
        userId: selectedMember.userId,
        reason: reason.trim(),
      });
      setShowBanDialog(false);
      setSelectedMember(null);
      setBanReason('');
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 그룹 탈퇴 핸들러 (멤버용)
  const handleLeaveGroup = async () => {
    try {
      await leaveGroupMutation.mutateAsync();
      setShowDeleteDialog(false);
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 소유권 이전 핸들러
  const handleTransferOwnership = async () => {
    if (!selectedMember) return;
    
    try {
      await transferOwnershipMutation.mutateAsync(selectedMember.userId);
      setShowTransferDialog(false);
      setSelectedMember(null);
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLoader message="Loading group information..." />
    );
  }

  // Error state
  if (error || !groupDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <StateDisplay 
          type="error" 
          title="Failed to load group information"
          message="Please check your network connection or try again later."
          onRetry={() => refetch()}
          retryText="Retry"
        />
      </div>
    );
  }


  // 그룹장이 아닌 경우 멤버 전용 페이지 표시
  if (!isGroupOwner) {
    return (
      <div className="space-y-6 px-6 py-6 max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
              {groupDetail.name}
            </h1>
            <Badge 
              variant={groupDetail.isPublic ? "default" : "secondary"} 
              className={`text-xs flex items-center gap-1 ${
                groupDetail.isPublic 
                  ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                  : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
              }`}
            >
              {groupDetail.isPublic ? (
                <>
                  <Globe className="h-3 w-3" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  Private
                </>
              )}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 그룹 정보 */}
          <div className="lg:col-span-2">
            <Card className={getCommonCardClass()}>
              <CardHeader>
                <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                  Group Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupDetail.description && (
                  <div>
                    <div className={`text-sm font-medium ${getThemeTextColor('secondary')} mb-1`}>
                      Description
                    </div>
                    <p className={`text-sm ${getThemeTextColor('primary')}`}>
                      {groupDetail.description}
                    </p>
                  </div>
                )}
                
                {groupDetail.groundRule && (
                  <div>
                    <div className={`text-sm font-medium ${getThemeTextColor('secondary')} mb-1`}>
                      Ground Rules
                    </div>
                    <p className={`text-sm ${getThemeTextColor('primary')} whitespace-pre-line`}>
                      {groupDetail.groundRule}
                    </p>
                  </div>
                )}

                {groupDetail.tags && groupDetail.tags.length > 0 && (
                  <div>
                    <div className={`text-sm font-medium ${getThemeTextColor('secondary')} mb-2`}>
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {groupDetail.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="gap-1"
                        >
                          <Hash className="h-3 w-3" />
                          <span className="text-xs">{tag}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 멤버 목록 */}
            <Card className={`${getCommonCardClass()} mt-6`}>
              <CardHeader>
                <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                  Group Members ({groupDetail.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* 그룹장 */}
                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    currentUser && groupDetail.owner.userId === currentUser.id
                      ? 'bg-gray-50 dark:bg-gray-800'
                      : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`text-sm font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                          {groupDetail.owner.nickname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                          {groupDetail.owner.nickname}
                        </div>
                        <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                          Group Owner
                        </div>
                      </div>
                    </div>
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>
                  
                  {/* 일반 멤버 */}
                  {groupDetail.members.filter(member => member.userId !== groupDetail.owner.userId).map((member) => {
                    const isCurrentUser = currentUser && member.userId === currentUser.id;
                    
                    return (
                      <div key={member.userId} className={`flex items-center justify-between p-3 rounded-lg ${
                        isCurrentUser
                          ? 'bg-gray-50 dark:bg-gray-800'
                          : ''
                      }`}>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className={`text-sm font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                            {member.nickname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                            {member.nickname}
                          </div>
                          <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                            Member
                          </div>
                        </div>
                      </div>
                      <Users className="h-5 w-5 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 그룹 정보 */}
            <Card className={getCommonCardClass()}>
              <CardHeader>
                <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                  Group Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${getThemeTextColor('secondary')}`}>Total Members</span>
                    <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      {groupDetail.members.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${getThemeTextColor('secondary')}`}>Created</span>
                    <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      {new Date(groupDetail.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${getThemeTextColor('secondary')}`}>Active Days</span>
                    <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      {new Date(groupDetail.createdAt).getFullYear() === new Date().getFullYear() 
                        ? Math.ceil((new Date().getTime() - new Date(groupDetail.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                        : '365+'
                      } days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 그룹 탈퇴 */}
            <Card className={`${getCommonCardClass()} border-red-200`}>
              <CardHeader>
                <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                  Leave Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${getThemeTextColor('secondary')} mb-4`}>
                  Are you sure you want to leave this group? You can rejoin later if the group is public.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full"
                  size="sm"
                >
                  Leave Group
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 탈퇴 확인 다이얼로그 */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Leave Group"
          description={
            <>
              Are you sure you want to leave <span className="font-semibold">"{groupDetail?.name}"</span>?
              <br className="mt-2" />
              You can rejoin later if the group is public or if you receive another invitation.
            </>
          }
          confirmText="Leave Group"
          cancelText="Cancel"
          onConfirm={handleLeaveGroup}
          variant="destructive"
          isLoading={leaveGroupMutation.isPending}
          loadingText="Leaving..."
          icon={UserMinus}
        />
      </div>
    );
  }

  // 초대 코드 복사 함수
  const copyInviteCode = () => {
    const inviteCode = `GROUP-${groupId}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied to clipboard!');
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
            {groupDetail.name}
          </h1>
          <Badge 
            variant={groupDetail.isPublic ? "default" : "secondary"} 
            className={`text-xs flex items-center gap-1 ${
              groupDetail.isPublic 
                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
            }`}
          >
            {groupDetail.isPublic ? (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            )}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={copyInviteCode}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy invite code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onValidSubmit, onError)} className="space-y-4">
              {/* 기본 설정 카드 */}
              <Card className={getCommonCardClass()}>
                <CardHeader>
                  <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                    Basic Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 그룹 이름 */}
                  <GroupNameInput
                    form={form}
                    name="name"
                    label="Group Name"
                    placeholder="Enter group name"
                    excludeFromValidation={groupDetail?.name}
                  />

                  {/* 공개 설정 */}
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                          Privacy Setting
                        </FormLabel>
                        <FormControl>
                          <ToggleGroup 
                            type="single" 
                            value={field.value ? 'public' : 'private'} 
                            onValueChange={(value) => {
                              // 값이 없으면 현재 값을 유지 (선택 해제 방지)
                              if (value) {
                                field.onChange(value === 'public');
                              }
                            }}
                            className="w-full bg-white border border-gray-200 rounded-md mt-2"
                          >
                            <ToggleGroupItem 
                              value="public" 
                              className="flex-1 gap-3 px-6 py-4 bg-white text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:bg-gray-50"
                            >
                              <Globe className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Public</div>
                                <div className="text-xs opacity-75">Anyone can join</div>
                              </div>
                            </ToggleGroupItem>
                            <ToggleGroupItem 
                              value="private" 
                              className="flex-1 gap-3 px-6 py-4 bg-white text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:bg-gray-50"
                            >
                              <Lock className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Private</div>
                                <div className="text-xs opacity-75">Invite code required</div>
                              </div>
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormDescription className={`text-xs ${getThemeTextColor('secondary')} mt-2`}>
                          Public groups can be discovered and joined by other users
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* 태그 */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                          Tags
                        </FormLabel>
                        <div className="mt-2 space-y-3">
                          {field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary" 
                                  className="gap-1 pl-2 pr-1 py-1"
                                >
                                  <Hash className="h-3 w-3" />
                                  <span className="text-xs">{tag}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <TagInput
                            onAddTag={handleAddTag}
                            disabled={field.value.length >= 5}
                          />
                          
                          <FormDescription className={`text-xs ${getThemeTextColor('secondary')}`}>
                            You can add up to 5 tags
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="gap-2 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
                  disabled={form.formState.isSubmitting || updateGroupMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                  {(form.formState.isSubmitting || updateGroupMutation.isPending) ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* 멤버 관리 */}
          <Card className={getCommonCardClass()}>
            <CardHeader>
              <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                Member Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* 그룹장 */}
                <div className={`flex items-center justify-between p-2 rounded-lg ${
                  currentUser && groupDetail.owner.userId === currentUser.id
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : ''
                }`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`text-xs font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {groupDetail.owner.nickname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                        {groupDetail.owner.nickname}
                      </div>
                      <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                        Owner
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex items-center justify-center">
                      <Crown className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                </div>
                
                {/* 일반 멤버 */}
                {groupDetail.members.filter(member => member.userId !== groupDetail.owner.userId).map((member) => {
                  const isCurrentUser = currentUser && member.userId === currentUser.id;
                  
                  return (
                    <div key={member.userId} className={`flex items-center justify-between p-2 rounded-lg ${
                      isCurrentUser
                        ? 'bg-gray-50 dark:bg-gray-800'
                        : ''
                    }`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={`text-xs font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                            {member.nickname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                            {member.nickname}
                          </div>
                          <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                            Member
                          </div>
                        </div>
                      </div>
                    
                    <div className="flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-600 hover:text-gray-700"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedMember(member);
                              setShowTransferDialog(true);
                            }}
                          >
                            Transfer Ownership
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 cursor-pointer"
                            onClick={() => {
                              setSelectedMember(member);
                              setShowBanDialog(true);
                            }}
                          >
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 그룹 정보 */}
          <Card className={getCommonCardClass()}>
            <CardHeader>
              <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                Group Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${getThemeTextColor('secondary')}`}>Total Members</span>
                  <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {groupDetail.members.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${getThemeTextColor('secondary')}`}>Created</span>
                  <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {new Date(groupDetail.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${getThemeTextColor('secondary')}`}>Active Days</span>
                  <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {new Date(groupDetail.createdAt).getFullYear() === new Date().getFullYear() 
                      ? Math.ceil((new Date().getTime() - new Date(groupDetail.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                      : '365+'
                    } days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 그룹 삭제 */}
          <Card className={`${getCommonCardClass()} border-red-200`}>
            <CardHeader>
              <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                Delete Group
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${getThemeTextColor('secondary')} mb-4`}>
                Deleting this group will permanently remove all data and cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full"
                size="sm"
              >
                Delete Group
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Group"
        description={
          <>
            Are you sure you want to delete <span className="font-semibold">"{groupDetail?.name}"</span>?
            <br className="mt-2" />
            This action cannot be undone. All group data, including member information and history, will be permanently removed.
          </>
        }
        confirmText="Delete Group"
        cancelText="Cancel"
        onConfirm={handleDeleteGroup}
        variant="destructive"
        isLoading={deleteGroupMutation.isPending}
        loadingText="Deleting..."
        icon={Trash2}
      />

      {/* 멤버 추방 다이얼로그 */}
      <ConfirmDialog
        open={showBanDialog}
        onOpenChange={(open) => {
          setShowBanDialog(open);
          if (!open) {
            setSelectedMember(null);
            setBanReason('');
          }
        }}
        title="Remove Member"
        description={
          <>
            Remove <span className="font-semibold">{selectedMember?.nickname}</span> from the group?
          </>
        }
        confirmText="Remove Member"
        cancelText="Cancel"
        onConfirm={handleBanMember}
        onCancel={() => {
          setSelectedMember(null);
          setBanReason('');
        }}
        variant="destructive"
        isLoading={banMemberMutation.isPending}
        loadingText="Removing..."
        icon={UserMinus}
        showTextarea={true}
        textareaLabel="Reason for removal"
        textareaPlaceholder="Please provide a reason for removing this member..."
        textareaRequired={true}
        textareaValue={banReason}
        onTextareaChange={setBanReason}
      />

      {/* 소유권 이전 다이얼로그 */}
      <ConfirmDialog
        open={showTransferDialog}
        onOpenChange={(open) => {
          setShowTransferDialog(open);
          if (!open) {
            setSelectedMember(null);
          }
        }}
        title="Transfer Group Ownership"
        description={
          <>
            Are you sure you want to transfer ownership of <span className="font-semibold">"{groupDetail?.name}"</span> to <span className="font-semibold">{selectedMember?.nickname}</span>?
            <br className="mt-2" />
            <span className="text-amber-600 font-medium">Warning:</span> You will lose all administrative privileges and cannot undo this action. The new owner will have full control over the group.
          </>
        }
        confirmText="Transfer Ownership"
        cancelText="Cancel"
        onConfirm={handleTransferOwnership}
        onCancel={() => {
          setSelectedMember(null);
        }}
        variant="default"
        isLoading={transferOwnershipMutation.isPending}
        loadingText="Transferring..."
        icon={Crown}
      />
    </div>
  );
}

// Tag Input Component
function TagInput({ onAddTag, disabled }: { onAddTag: (tag: string) => void, disabled: boolean }) {
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Add tag (e.g., React, Python)..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
        disabled={disabled}
      />
      <Button
        type="button"
        onClick={handleAddTag}
        disabled={!newTag.trim() || disabled}
        size="sm"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}