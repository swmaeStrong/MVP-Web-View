'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Textarea } from '@/shadcn/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shadcn/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Globe, Lock, Hash, Plus, X, Users, Target, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  groupName: z.string().min(3, 'Group name must be at least 3 characters').max(50, 'Group name must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  isPublic: z.enum(['public', 'private']),
  maxMembers: z.string(),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

export default function CreateGroupPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
      description: '',
      isPublic: 'public',
      maxMembers: '50',
      tags: [],
    },
  });

  const { watch, setValue, getValues } = form;
  const watchedValues = watch();

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
    try {
      // 실제로는 API 호출로 그룹 생성
      // const newGroup = await createGroup({
      //   name: values.groupName,
      //   description: values.description,
      //   isPublic: values.isPublic === 'public',
      //   tags: values.tags,
      //   maxMembers: parseInt(values.maxMembers)
      // });
      
      // Mock: 2초 대기 후 성공
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 시 새로 생성된 그룹 페이지로 이동
      router.push('/group/team/1');
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className={`text-3xl font-bold ${getThemeTextColor('primary')}`}>
          Create Group
        </div>
        <p className={`text-lg ${getThemeTextColor('secondary')}`}>
          Start your own group and collaborate with like-minded people
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card className={getCommonCardClass()}>
                  <CardContent className="p-6">
                    <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
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
                              <Input
                                placeholder="Enter group name..."
                                className="!bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
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
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your group's purpose and goals..."
                                className="min-h-[100px] !bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Max Members */}
                      <FormField
                        control={form.control}
                        name="maxMembers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                              Max Members
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="!bg-white !border-gray-200 !text-gray-900 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!border-gray-200 dark:!text-gray-900">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="10">10 members</SelectItem>
                                <SelectItem value="25">25 members</SelectItem>
                                <SelectItem value="50">50 members</SelectItem>
                                <SelectItem value="100">100 members</SelectItem>
                              </SelectContent>
                            </Select>
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
                    <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
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
                              className="w-full !bg-white border border-gray-200 rounded-md"
                            >
                              <ToggleGroupItem 
                                value="public" 
                                className="flex-1 gap-3 px-6 py-4 !bg-white !text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:!bg-gray-50"
                              >
                                <Globe className="h-4 w-4" />
                                <div className="text-left">
                                  <div className="font-medium">Public</div>
                                  <div className="text-xs opacity-75">Anyone can join</div>
                                </div>
                              </ToggleGroupItem>
                              <ToggleGroupItem 
                                value="private" 
                                className="flex-1 gap-3 px-6 py-4 !bg-white !text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:!bg-gray-50"
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
                    <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
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
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 !bg-white !border-gray-200 !text-gray-900 hover:!bg-gray-50 disabled:!opacity-50"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Group'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card className={getCommonCardClass()}>
              <CardContent className="p-6">
                <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
                  Preview
                </div>
                
                <div className="space-y-4">
                  {/* Group Header */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`text-lg font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {watchedValues.groupName?.charAt(0) || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
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
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                          Max {watchedValues.maxMembers} members
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-xs ${getThemeTextColor('secondary')} leading-relaxed`}>
                    {watchedValues.description || 'Group description will appear here...'}
                  </p>
                  
                  {/* Tags */}
                  {watchedValues.tags && watchedValues.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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
                <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
                  Group Benefits
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
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
                  
                  <div className="flex items-start gap-3">
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
                  
                  <div className="flex items-start gap-3">
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
        className="flex-1 !bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
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