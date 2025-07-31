'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { Textarea } from '@/shadcn/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Hash, Lock, Plus, Save, Settings, Trash2, Users, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import StateDisplay from '@/components/common/StateDisplay';
import { useCurrentUser } from '@/stores/userStore';
import { updateGroup } from '@/shared/api/patch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupDetailQueryKey } from '@/config/constants/query-keys';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters').max(50, 'Group name must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  isPublic: z.enum(['public', 'private']),
  groundRule: z.string().min(10, 'Ground rule must be at least 10 characters').max(500, 'Ground rule must be less than 500 characters'),
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
      toast.success('그룹 정보가 성공적으로 업데이트되었습니다.');
    },
    onError: (error) => {
      console.error('Failed to update group:', error);
      toast.error('그룹 정보 업데이트에 실패했습니다.');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: 'public',
      groundRule: '',
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
        description: groupDetail.description,
        isPublic: groupDetail.isPublic ? 'public' : 'private',
        groundRule: groupDetail.groundRule,
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
      description: values.description,
      groundRule: values.groundRule,
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
    if (!confirm('정말로 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
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
            그룹 설정을 불러오는 중...
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
          title="그룹 정보를 불러오지 못했습니다"
          message="네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요."
          onRetry={() => refetch()}
          retryText="다시 시도"
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
          title="접근 권한이 없습니다"
          message="그룹 설정은 그룹장만 수정할 수 있습니다."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
            그룹 설정
          </h1>
          <p className={`text-sm ${getThemeTextColor('secondary')} mt-1`}>
            그룹의 상세 정보를 수정할 수 있습니다.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          취소
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card className={getCommonCardClass()}>
                <CardHeader>
                  <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                    기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Group Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                          그룹 이름
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="그룹 이름을 입력하세요..."
                            className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                          그룹 설명
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="그룹의 목적과 목표를 설명해주세요..."
                            className="min-h-[100px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ground Rule */}
                  <FormField
                    control={form.control}
                    name="groundRule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                          그라운드 룰
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="그룹의 기본 규칙을 설정해주세요..."
                            className="min-h-[100px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className={getCommonCardClass()}>
                <CardHeader>
                  <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                    공개 설정
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ToggleGroup 
                            type="single" 
                            value={field.value} 
                            onValueChange={field.onChange}
                            className="w-full bg-white border border-gray-200 rounded-md dark:bg-gray-50 dark:border-gray-300"
                          >
                            <ToggleGroupItem 
                              value="public" 
                              className="flex-1 gap-3 px-6 py-4 bg-white text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:bg-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                              <Globe className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">공개</div>
                                <div className="text-xs opacity-75">누구나 가입 가능</div>
                              </div>
                            </ToggleGroupItem>
                            <ToggleGroupItem 
                              value="private" 
                              className="flex-1 gap-3 px-6 py-4 bg-white text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:bg-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                              <Lock className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">비공개</div>
                                <div className="text-xs opacity-75">초대 코드 필요</div>
                              </div>
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className={getCommonCardClass()}>
                <CardHeader>
                  <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                    태그
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-4">
                          {/* Add Tag Input */}
                          <TagInput
                            onAddTag={handleAddTag}
                            disabled={field.value.length >= 5}
                          />

                          {/* Current Tags */}
                          {field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="outline" 
                                  className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')} pr-1`}
                                >
                                  <Hash className="h-3 w-3" />
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                  >
                                    <X className="h-2 w-2" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}

                          <FormDescription className={`text-xs ${getThemeTextColor('secondary')}`}>
                            최대 5개의 태그를 추가할 수 있습니다. Enter 키나 + 버튼을 클릭해서 추가하세요.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors gap-2"
                  disabled={form.formState.isSubmitting || updateGroupMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                  {(form.formState.isSubmitting || updateGroupMutation.isPending) ? '저장 중...' : '변경사항 저장'}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Preview */}
          <Card className={getCommonCardClass()}>
            <CardHeader>
              <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                미리보기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Group Header */}
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className={`text-lg font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                    {watchedValues.name?.charAt(0) || 'G'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`text-sm font-bold ${getThemeTextColor('primary')} truncate`}>
                      {watchedValues.name || '그룹 이름'}
                    </div>
                    <Badge variant={watchedValues.isPublic === 'public' ? "default" : "secondary"} className={`gap-1 flex-shrink-0 text-xs ${
                      watchedValues.isPublic === 'public'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                    }`}>
                      {watchedValues.isPublic === 'public' ? (
                        <>
                          <Globe className="h-2 w-2" />
                          공개
                        </>
                      ) : (
                        <>
                          <Lock className="h-2 w-2" />
                          비공개
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className={`text-xs ${getThemeTextColor('secondary')} leading-relaxed`}>
                {watchedValues.description || '그룹 설명이 여기에 표시됩니다...'}
              </p>
              
              {/* Ground Rule */}
              {watchedValues.groundRule && (
                <div>
                  <div className={`text-xs font-semibold ${getThemeTextColor('primary')} mb-1`}>
                    그라운드 룰
                  </div>
                  <p className={`text-xs ${getThemeTextColor('secondary')} leading-relaxed`}>
                    {watchedValues.groundRule}
                  </p>
                </div>
              )}
              
              {/* Tags */}
              {watchedValues.tags && watchedValues.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedValues.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                    >
                      <Hash className="h-2 w-2" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Members */}
          <Card className={getCommonCardClass()}>
            <CardHeader>
              <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
                그룹 멤버
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`text-xs font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                      {groupDetail.owner.nickname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      {groupDetail.owner.nickname}
                    </div>
                    <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                      그룹장
                    </div>
                  </div>
                </div>
                
                {groupDetail.members.map((member) => (
                  <div key={member.userId} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`text-xs font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {member.nickname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                        {member.nickname}
                      </div>
                      <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                        멤버
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className={`${getCommonCardClass()} border-red-200 dark:border-red-900/50`}>
            <CardHeader>
              <CardTitle className="text-lg text-red-600 dark:text-red-400">
                위험 구역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  그룹을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteGroup}
                  className="w-full gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  그룹 삭제
                </Button>
              </div>
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
        placeholder="태그 추가 (예: React, Python)..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900"
        disabled={disabled}
      />
      <Button
        type="button"
        onClick={handleAddTag}
        disabled={!newTag.trim() || disabled}
        className="bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}