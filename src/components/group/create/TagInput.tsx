'use client';

import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { brandColors } from '@/styles/colors';
import { useTheme } from '@/hooks/ui/useTheme';
import { Plus } from 'lucide-react';
import * as React from 'react';

interface TagInputProps {
  onAddTag: (tag: string) => void;
  disabled: boolean;
}

export default function TagInput({ onAddTag, disabled }: TagInputProps) {
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
          className={`flex-1 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 ${brandColors.accent.ring} ${brandColors.accent.border} ${
            newTag.length > 12 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={!newTag.trim() || disabled || newTag.length > 12}
          className={`${brandColors.accent.bg} text-white ${brandColors.accent.hover}/90`}
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