'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { Textarea } from '@/shadcn/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Hash, Lock, Plus, Target, TrendingUp, Users, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createGroup } from '@/shared/api/post';
import { validateGroupName } from '@/shared/api/get';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { groupNameCheckQueryKey, myGroupsQueryKey } from '@/config/constants/query-keys';
import { useToast } from '@/hooks/ui/useToast';
import toast from 'react-hot-toast';

const formSchema = z.object({
  groupName: z.string().min(3, 'Group name must be at least 3 characters').max(50, 'Group name must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  isPublic: z.enum(['public', 'private']),
  groundRules: z.array(z.string().min(5, 'Each ground rule must be at least 5 characters')).min(1, 'At least one ground rule is required').max(10, 'Maximum 10 ground rules allowed'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

export default function CreateGroupPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
      description: '',
      isPublic: 'public',
      groundRules: [''],
      tags: [],
    },
  });

  const { watch, setValue, getValues } = form;
  const watchedValues = watch();
  
  // 그룹 이름 디바운스
  const debouncedGroupName = useDebounce(watchedValues.groupName, 500);
  
  // 그룹 이름 중복 검사
  const { data: isNameAvailable, isLoading: isCheckingName } = useQuery({
    queryKey: groupNameCheckQueryKey(debouncedGroupName),
    queryFn: () => validateGroupName(debouncedGroupName),
    enabled: debouncedGroupName.length >= 3,
  });

  // 그룹 생성 mutation
  const createGroupMutation = useMutation({
    mutationFn: createGroup,
  });

  // Add tag handler
  const handleAddTag = (newTag: string) => {
    const currentTags = getValues('tags');
    if (newTag.trim() && !currentTags.includes(newTag.trim()) && currentTags.length < 5) {
      setValue('tags', [...currentTags, newTag.trim()]);
    }
  };

  // Ground Rules handlers
  const handleAddGroundRule = () => {
    const currentRules = getValues('groundRules');
    if (currentRules.length < 10) {
      setValue('groundRules', [...currentRules, '']);
    }
  };

  const removeGroundRule = (index: number) => {
    const currentRules = getValues('groundRules');
    if (currentRules.length > 1) {
      const newRules = currentRules.filter((_, i) => i !== index);
      setValue('groundRules', newRules);
    }
  };

  const updateGroundRule = (index: number, value: string) => {
    const currentRules = getValues('groundRules');
    const newRules = [...currentRules];
    newRules[index] = value;
    setValue('groundRules', newRules);
  };

  // Remove tag handler
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues('tags');
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  // Form submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const request: Group.CreateGroupApiRequest = {
      name: values.groupName,
      isPublic: values.isPublic === 'public',
      groundRule: values.groundRules.filter(rule => rule.trim().length > 0).join('\n'),
      tags: values.tags,
      description: values.description,
    };
    
    // react-hot-toast의 promise를 직접 사용
    toast.promise(
      createGroup(request),
      {
        loading: '그룹을 생성하고 있습니다...',
        success: '그룹이 성공적으로 생성되었습니다!',
        error: (err: any) => {
          console.error('Failed to create group:', err);
          
          // 에러 메시지 추출
          if (err?.message) {
            return err.message;
          } else if (err?.response?.data?.message) {
            return err.response.data.message;
          } else if (typeof err === 'string') {
            return err;
          }
          
          return '그룹 생성에 실패했습니다.';
        },
      },
      {
        id: 'create-group', // 중복 토스트 방지
      }
    ).then(() => {
      // 성공 시 내 그룹 목록을 무효화하고 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      
      // 성공 시 그룹 찾기 페이지로 이동
      setTimeout(() => {
        router.push('/group/find');
      }, 1000);
    }).catch(() => {
      // 에러는 이미 토스트로 표시됨
    });
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card className={getCommonCardClass()}>
                  <CardContent className="p-6">
                    <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
                      Basic Information
                    </div>
                    
                    <div className="space-y-4">
                      {/* Group Name */}
                      <FormField
                        control={form.control}
                        name="groupName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                              Group Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Enter group name..."
                                  className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF]"
                                  {...field}
                                />
                                {field.value.length >= 3 && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isCheckingName ? (
                                      <div className="text-gray-400 text-xs">Checking...</div>
                                    ) : isNameAvailable === true ? (
                                      <div className="text-green-600 text-xs">✓ Available</div>
                                    ) : isNameAvailable === false ? (
                                      <div className="text-red-600 text-xs">✗ Taken</div>
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                            {field.value.length >= 3 && !isCheckingName && isNameAvailable === false && (
                              <p className="text-xs text-red-600 mt-1">This group name is already taken</p>
                            )}
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
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your group's purpose and goals..."
                                className="min-h-[100px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Ground Rules */}
                      <FormField
                        control={form.control}
                        name="groundRules"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                              Ground Rules
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {field.value.map((rule, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getThemeClass('component')} ${getThemeTextColor('secondary')}`}>
                                      {index + 1}
                                    </div>
                                    <Textarea
                                      value={rule}
                                      onChange={(e) => updateGroundRule(index, e.target.value)}
                                      placeholder="Enter a ground rule..."
                                      className="flex-1 min-h-[60px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] resize-none"
                                      rows={2}
                                    />
                                    {field.value.length > 1 && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeGroundRule(index)}
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                
                                {field.value.length < 10 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAddGroundRule}
                                    className="gap-1 mt-2"
                                  >
                                    <Plus className="h-3 w-3" />
                                    Add Ground Rule
                                  </Button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card className={getCommonCardClass()}>
                  <CardContent className="p-6">
                    <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
                      Privacy Settings
                    </div>
                    
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
                              className="w-full bg-white border border-gray-200 rounded-md"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className={getCommonCardClass()}>
                  <CardContent className="p-6">
                    <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
                      Tags
                    </div>
                    
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
                              <div className="flex flex-wrap gap-2 mt-3">
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
                              Add up to 5 tags to help others find your group. Press Enter or click + to add.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
                    disabled={form.formState.isSubmitting || isNameAvailable === false || isCheckingName}
                  >
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Group'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className={getCommonCardClass()}>
              <CardContent className="p-6">
                <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
                  Preview
                </div>
                
                <div className="space-y-4">
                  {/* Group Header */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`text-lg font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {watchedValues.groupName?.charAt(0) || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`text-sm font-bold ${getThemeTextColor('primary')} truncate`}>
                          {watchedValues.groupName || 'Group Name'}
                        </div>
                        <Badge variant={watchedValues.isPublic === 'public' ? "default" : "secondary"} className={`gap-1 flex-shrink-0 text-xs ${
                          watchedValues.isPublic === 'public'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                        }`}>
                          {watchedValues.isPublic === 'public' ? (
                            <>
                              <Globe className="h-2 w-2" />
                              Public
                            </>
                          ) : (
                            <>
                              <Lock className="h-2 w-2" />
                              Private
                            </>
                          )}
                        </Badge>
                      </div>
                      
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-xs ${getThemeTextColor('secondary')} leading-relaxed`}>
                    {watchedValues.description || 'Group description will appear here...'}
                  </p>
                  
                  {/* Ground Rule */}
                  {watchedValues.groundRules && watchedValues.groundRules.some(rule => rule.trim().length > 0) && (
                    <div>
                      <div className={`text-xs font-semibold ${getThemeTextColor('primary')} mb-2`}>
                        Ground Rules
                      </div>
                      <div className="space-y-2">
                        {watchedValues.groundRules
                          .filter(rule => rule.trim().length > 0)
                          .map((rule, index) => (
                            <div key={index} className={`text-xs ${getThemeTextColor('secondary')} ${getThemeClass('componentSecondary')} p-2 rounded flex items-start gap-2`}>
                              <span className={`font-semibold ${getThemeTextColor('primary')} flex-shrink-0`}>
                                {index + 1}.
                              </span>
                              <span>{rule}</span>
                            </div>
                          ))}
                      </div>
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
                </div>
              </CardContent>
            </Card>

            {/* Group Benefits */}
            <Card className={getCommonCardClass()}>
              <CardContent className="p-6">
                <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
                  Group Benefits
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Users className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')}`} />
                    <div>
                      <div className={`font-medium ${getThemeTextColor('primary')}`}>
                        Collaborate
                      </div>
                      <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                        Work together on projects and share progress
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Target className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')}`} />
                    <div>
                      <div className={`font-medium ${getThemeTextColor('primary')}`}>
                        Set Common Goals
                      </div>
                      <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                        Create shared objectives and track achievement progress
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <TrendingUp className={`h-5 w-5 mt-0.5 ${getThemeTextColor('primary')}`} />
                    <div>
                      <div className={`font-medium ${getThemeTextColor('primary')}`}>
                        Monitor Progress
                      </div>
                      <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                        View group productivity and goal completion rates
                      </div>
                    </div>
                  </div>
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
        placeholder="Add a tag (e.g., React, Python)..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF]"
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