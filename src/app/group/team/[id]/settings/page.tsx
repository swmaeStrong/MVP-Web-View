'use client';

import StateDisplay from '@/components/common/StateDisplay';
import { groupDetailQueryKey } from '@/config/constants/query-keys';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { updateGroup } from '@/shared/api/patch';
import { useCurrentUser } from '@/stores/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Crown, Globe, Hash, Lock, Plus, Save, Settings, Trash2, UserMinus, Users, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters').max(50, 'Group name must be less than 50 characters'),
  isPublic: z.enum(['public', 'private']),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

export default function GroupSettingsPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const params = useParams();
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  
  const groupId = Array.isArray(params.id) ? parseInt(params.id[0], 10) : parseInt(params.id as string, 10);

  // 그룹 상세 정보 조회
  const { data: groupDetail, isLoading, error, refetch } = useGroupDetail({
    groupId,
    enabled: !!groupId,
  });

  // 권한 확인 - 그룹장만 접근 가능
  const isGroupOwner = groupDetail && currentUser && groupDetail.owner.userId === currentUser.id;

  // 그룹 정보 업데이트 mutation
  const updateGroupMutation = useMutation({
    mutationFn: (request: Group.UpdateGroupApiRequest) => updateGroup(groupId, request),
    onSuccess: () => {
      // 성공 시 그룹 상세 정보 다시 조회
      queryClient.invalidateQueries({
        queryKey: groupDetailQueryKey(groupId),
      });
      toast.success('Group information updated successfully.');
    },
    onError: (error) => {
      console.error('Failed to update group:', error);
      toast.error('Failed to update group information.');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      isPublic: 'public',
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
        isPublic: groupDetail.isPublic ? 'public' : 'private',
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

  // Form submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!groupDetail) return;

    const request: Group.UpdateGroupApiRequest = {
      name: values.name,
      description: groupDetail.description, // 기존 값 유지
      groundRule: groupDetail.groundRule,   // 기존 값 유지
      tags: values.tags,
      isPublic: values.isPublic === 'public',
    };

    try {
      await updateGroupMutation.mutateAsync(request);
      // 성공 시 그룹 메인 페이지로 이동
      router.push(`/group/team/${groupId}`);
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 그룹 삭제 핸들러
  const handleDeleteGroup = async () => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    // TODO: API 연동 - 그룹 삭제
    console.log('Deleting group:', groupId);
    
    // Mock: 2초 대기 후 성공
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 성공 시 그룹 찾기 페이지로 이동
    router.push('/group/find');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Settings className="h-8 w-8 animate-spin text-blue-500" />
          <p className={`text-lg ${getThemeTextColor('primary')}`}>
            Loading group settings...
          </p>
        </div>
      </div>
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

  // 권한 없음 상태
  if (!isGroupOwner) {
    return (
      <div className="h-full flex items-center justify-center">
        <StateDisplay 
          type="error" 
          title="Access denied"
          message="Only group owners can modify group settings."
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
          <Badge variant={groupDetail.isPublic ? "default" : "secondary"} className="text-xs">
            {groupDetail.isPublic ? 'Public' : 'Private'}
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
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 기본 설정 카드 */}
              <Card className={getCommonCardClass()}>
                <CardHeader>
                  <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                    Basic Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 그룹 이름 */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                          Group Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="mt-2"
                            placeholder="Enter group name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
                            value={field.value} 
                            onValueChange={field.onChange}
                            className="grid grid-cols-2 gap-3 mt-2"
                          >
                            <ToggleGroupItem 
                              value="public" 
                              className="flex items-center justify-center gap-2 h-10"
                            >
                              <Globe className="h-4 w-4" />
                              Public
                            </ToggleGroupItem>
                            <ToggleGroupItem 
                              value="private" 
                              className="flex items-center justify-center gap-2 h-10"
                            >
                              <Lock className="h-4 w-4" />
                              Private
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
                                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors"
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
                  className="gap-2"
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
                <div className="flex items-center justify-between p-2 rounded-lg">
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
                  <Crown className="h-4 w-4 text-amber-500" />
                </div>
                
                {/* 일반 멤버 */}
                {groupDetail.members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-2 rounded-lg">
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
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Transfer ownership"
                      >
                        <Crown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        title="Remove member"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
                    {groupDetail.members.length + 1}
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
          <Card className={`${getCommonCardClass()} border-red-200 dark:border-red-800`}>
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
                onClick={handleDeleteGroup}
                className="w-full"
                size="sm"
              >
                Delete Group
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
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