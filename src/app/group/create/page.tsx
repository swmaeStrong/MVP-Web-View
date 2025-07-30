'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Textarea } from '@/shadcn/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Globe, Lock, Hash, Plus, X, Users, AlertCircle, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGroupPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  
  // Form states
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState<'public' | 'private'>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [maxMembers, setMaxMembers] = useState('50');
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    } else if (groupName.trim().length < 3) {
      newErrors.groupName = 'Group name must be at least 3 characters';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }
    
    const memberCount = parseInt(maxMembers);
    if (isNaN(memberCount) || memberCount < 2 || memberCount > 100) {
      newErrors.maxMembers = 'Max members must be between 2 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add tag handler
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: '' }));
      }
    }
  };

  // Remove tag handler
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Create group handler
  const handleCreateGroup = async () => {
    if (!validateForm()) return;
    
    setIsCreating(true);
    
    try {
      // 실제로는 API 호출로 그룹 생성
      // const newGroup = await createGroup({
      //   name: groupName,
      //   description,
      //   isPublic: isPublic === 'public',
      //   tags,
      //   maxMembers: parseInt(maxMembers)
      // });
      
      // Mock: 2초 대기 후 성공
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 시 새로 생성된 그룹 페이지로 이동
      // router.push(`/group/team/${newGroup.id}`);
      
      // Mock: 임시 ID로 이동
      router.push('/group/team/1');
    } catch (error) {
      console.error('Failed to create group:', error);
      setErrors({ general: 'Failed to create group. Please try again.' });
    } finally {
      setIsCreating(false);
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
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className={getCommonCardClass()}>
              <CardContent className="p-6">
                <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
                  Basic Information
                </div>
                
                <div className="space-y-4">
                  {/* Group Name */}
                  <div>
                    <label className={`block text-sm font-medium ${getThemeTextColor('primary')} mb-2`}>
                      Group Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter group name..."
                      value={groupName}
                      onChange={(e) => {
                        setGroupName(e.target.value);
                        if (errors.groupName) {
                          setErrors(prev => ({ ...prev, groupName: '' }));
                        }
                      }}
                      className="!bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
                      disabled={isCreating}
                    />
                    {errors.groupName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.groupName}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-medium ${getThemeTextColor('primary')} mb-2`}>
                      Description *
                    </label>
                    <Textarea
                      placeholder="Describe your group's purpose and goals..."
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          setErrors(prev => ({ ...prev, description: '' }));
                        }
                      }}
                      className="min-h-[100px] !bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
                      disabled={isCreating}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Max Members */}
                  <div>
                    <label className={`block text-sm font-medium ${getThemeTextColor('primary')} mb-2`}>
                      Max Members
                    </label>
                    <Select value={maxMembers} onValueChange={setMaxMembers} disabled={isCreating}>
                      <SelectTrigger className="!bg-white !border-gray-200 !text-gray-900 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!border-gray-200 dark:!text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="25">25 members</SelectItem>
                        <SelectItem value="50">50 members</SelectItem>
                        <SelectItem value="100">100 members</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.maxMembers && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.maxMembers}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className={getCommonCardClass()}>
              <CardContent className="p-6">
                <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
                  Privacy Settings
                </div>
                
                <div className="space-y-4">
                  <ToggleGroup 
                    type="single" 
                    value={isPublic} 
                    onValueChange={(value) => value && setIsPublic(value as 'public' | 'private')}
                    className="w-full !bg-white border border-gray-200 rounded-md"
                    disabled={isCreating}
                  >
                    <ToggleGroupItem 
                      value="public" 
                      className="flex-1 gap-2 px-4 py-3 !bg-white !text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:!bg-gray-50"
                    >
                      <Globe className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Public</div>
                        <div className="text-xs opacity-75">Anyone can join</div>
                      </div>
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="private" 
                      className="flex-1 gap-2 px-4 py-3 !bg-white !text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:!bg-gray-50"
                    >
                      <Lock className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Private</div>
                        <div className="text-xs opacity-75">Invite code required</div>
                      </div>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className={getCommonCardClass()}>
              <CardContent className="p-6">
                <div className={`text-lg font-bold ${getThemeTextColor('primary')} mb-4`}>
                  Tags *
                </div>
                
                <div className="space-y-4">
                  {/* Add Tag Input */}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add a tag (e.g., React, Python)..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 !bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
                      disabled={isCreating || tags.length >= 5}
                    />
                    <Button
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || tags.includes(newTag.trim()) || tags.length >= 5 || isCreating}
                      className="bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Current Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')} pr-1`}
                        >
                          <Hash className="h-3 w-3" />
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            disabled={isCreating}
                            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                    Add up to 5 tags to help others find your group. Press Enter or click + to add.
                  </p>

                  {errors.tags && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.tags}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* General Error */}
            {errors.general && (
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-4">
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.general}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 !bg-white !border-gray-200 !text-gray-900 hover:!bg-gray-50 disabled:!opacity-50"
                onClick={() => router.back()}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
                onClick={handleCreateGroup}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
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
                        {groupName.charAt(0) || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`text-sm font-bold ${getThemeTextColor('primary')} truncate`}>
                          {groupName || 'Group Name'}
                        </div>
                        <Badge variant={isPublic === 'public' ? "default" : "secondary"} className={`gap-1 flex-shrink-0 text-xs ${
                          isPublic === 'public'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                        }`}>
                          {isPublic === 'public' ? (
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
                          Max {maxMembers} members
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-xs ${getThemeTextColor('secondary')} leading-relaxed`}>
                    {description || 'Group description will appear here...'}
                  </p>
                  
                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
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