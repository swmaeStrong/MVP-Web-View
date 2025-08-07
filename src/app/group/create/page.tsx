'use client';

import { GroundRulesInput } from '@/components/forms/GroundRulesInput';
import { GroupNameInput } from '@/components/forms/GroupNameInput';
import { GROUP_VALIDATION_MESSAGES } from '@/config/constants';
import { useGroupNameValidation, useCreateGroupWithToast } from '@/hooks/group/useCreateGroup';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useTheme } from '@/hooks/ui/useTheme';
import { CreateGroupFormData, createGroupSchema } from '@/schemas/groupSchema';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Hash, Lock, Plus, Target, TrendingUp, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Textarea } from '../../../shadcn/ui/textarea';

export default function CreateGroupPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  
  // Save current tab as last visited
  useLastGroupTab();
  
  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
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
  
  // 그룹 이름 중복 검사
  const { data: isNameAvailable, isLoading: isCheckingName } = useGroupNameValidation(watchedValues.groupName);
  
  // 그룹 생성
  const { createGroupWithToast, isLoading: isCreatingGroup } = useCreateGroupWithToast();

  // Add tag handler
  const handleAddTag = (newTag: string) => {
    const currentTags = getValues('tags');
    const trimmedTag = newTag.trim();
    // 12글자 제한, 중복 체크, 5개 제한
    if (trimmedTag && trimmedTag.length <= 12 && !currentTags.includes(trimmedTag) && currentTags.length < 5) {
      setValue('tags', [...currentTags, trimmedTag]);
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
    if (errors.groupName) {
      toast.error(`Group Name: ${errors.groupName.message}`);
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
  const onValidSubmit = async (values: CreateGroupFormData) => {
    // Check if name is available (only after basic validation passes)
    if (!isNameAvailable) {
      toast.error(GROUP_VALIDATION_MESSAGES.GROUP_NAME.TAKEN);
      return;
    }
    
    await onSubmit(values);
  };

  // Form submit handler
  const onSubmit = async (values: CreateGroupFormData) => {
    const request: Group.CreateGroupApiRequest = {
      name: values.groupName,
      isPublic: values.isPublic === 'public',
      groundRule: values.groundRules.filter(rule => rule.trim().length > 0).join('\n'),
      tags: values.tags,
      description: values.description,
    };
    
    await createGroupWithToast(request);
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onValidSubmit, onError)} className="space-y-6">
                {/* Basic Information */}
                <Card className={getCommonCardClass()}>
                  <CardContent className="p-6">
                    <div className={`text-lg font-semibold ${getThemeTextColor('primary')} mb-4`}>
                      Basic Information
                    </div>
                    
                    <div className="space-y-4">
                      {/* Group Name */}
                      <GroupNameInput
                        form={form}
                        name="groupName"
                        label="Group Name"
                        placeholder="Enter group name..."
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
                      <GroundRulesInput
                        form={form}
                        name="groundRules"
                        label="Ground Rules"
                        maxRules={10}
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
                              onValueChange={(value) => {
                                // 값이 없으면 현재 값을 유지 (선택 해제 방지)
                                if (value) {
                                  field.onChange(value);
                                }
                              }}
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
                                    className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')} pr-1 ${
                                      tag.length > 12 ? 'border-red-300 bg-red-50 text-red-700' : ''
                                    }`}
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
                    disabled={form.formState.isSubmitting || isCreatingGroup || isNameAvailable === false || isCheckingName}
                  >
                    {form.formState.isSubmitting || isCreatingGroup ? 'Creating...' : 'Create Group'}
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
                  <p className={`text-xs ${getThemeTextColor('secondary')} leading-relaxed whitespace-pre-wrap`}>
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
  const { getThemeTextColor } = useTheme();
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && trimmedTag.length <= 12) {
      onAddTag(trimmedTag);
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
    <div className="space-y-1">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a tag (e.g., React, Python)..."
          value={newTag}
          onChange={(e) => {
            // 12글자 제한
            if (e.target.value.length <= 12) {
              setNewTag(e.target.value);
            }
          }}
          onKeyPress={handleKeyPress}
          className={`flex-1 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] ${
            newTag.length > 12 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={!newTag.trim() || disabled || newTag.length > 12}
          className="bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-end">
        <span className={`text-xs ${
          newTag.length > 12 ? 'text-red-500' : 
          newTag.length > 10 ? 'text-yellow-600' : 
          getThemeTextColor('secondary')
        }`}>
          {newTag.length}/12
        </span>
      </div>
    </div>
  );
}