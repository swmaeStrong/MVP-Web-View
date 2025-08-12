'use client';

import { GroupNameInput } from '@/components/forms/GroupNameInput';
import { useTheme } from '@/hooks/ui/useTheme';
import { UpdateGroupFormData } from '@/schemas/groupSchema';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { Badge } from '@/shadcn/ui/badge';
import { brandColors } from '@/styles/colors';
import { Globe, Lock, Hash, X, Plus, Save } from 'lucide-react';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface GroupBasicSettingsProps {
  form: UseFormReturn<UpdateGroupFormData>;
  onSubmit: (values: UpdateGroupFormData) => Promise<void>;
  onError: (errors: any) => void;
  isSubmitting: boolean;
  excludeFromValidation?: string;
}

export default function GroupBasicSettings({ 
  form, 
  onSubmit, 
  onError, 
  isSubmitting,
  excludeFromValidation 
}: GroupBasicSettingsProps) {
  const { getThemeTextColor, getCommonCardClass } = useTheme();
  const { getValues, setValue } = form;

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
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
              excludeFromValidation={excludeFromValidation}
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
                        className="flex-1 gap-3 px-6 py-4 bg-white text-gray-900 data-[state=on]:bg-[#3F72AF] data-[state=on]:text-white hover:bg-gray-50"
                      >
                        <Globe className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">Public</div>
                          <div className="text-xs opacity-75">Anyone can join</div>
                        </div>
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="private" 
                        className="flex-1 gap-3 px-6 py-4 bg-white text-gray-900 data-[state=on]:bg-[#3F72AF] data-[state=on]:text-white hover:bg-gray-50"
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
                            className={`gap-1 pl-2 pr-1 py-1 ${
                              tag.length > 12 ? 'border-red-300 bg-red-50 text-red-700' : ''
                            }`}
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
            className={`gap-2 ${brandColors.accent.bg} text-white ${brandColors.accent.hover}/90 transition-colors`}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
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
          placeholder="Add tag (e.g., React, Python)..."
          value={newTag}
          onChange={(e) => {
            // 12글자 제한
            if (e.target.value.length <= 12) {
              setNewTag(e.target.value);
            }
          }}
          onKeyPress={handleKeyPress}
          className={`flex-1 ${
            newTag.length > 12 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={!newTag.trim() || disabled || newTag.length > 12}
          size="sm"
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