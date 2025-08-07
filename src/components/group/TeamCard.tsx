'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Textarea } from '@/shadcn/ui/textarea';
import { spacing } from '@/styles/design-system';
import { Check, Edit3, X } from 'lucide-react';
import { useState } from 'react';

interface TeamCardProps {
  teamName: string;
  description: string;
  leader: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  isOwner?: boolean;
  onDescriptionUpdate?: (newDescription: string) => Promise<void>;
}

export default function TeamCard({ teamName, description, leader, tags = [], isOwner = false, onDescriptionUpdate }: TeamCardProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDescription = async () => {
    if (!onDescriptionUpdate || editedDescription === description) {
      setIsEditingDescription(false);
      return;
    }

    try {
      setIsSaving(true);
      await onDescriptionUpdate(editedDescription);
      setIsEditingDescription(false);
    } catch (error) {
      console.error('Failed to update description:', error);
      setEditedDescription(description); // 실패 시 원래 값으로 되돌림
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedDescription(description);
    setIsEditingDescription(false);
  };

  return (
    <Card className={`${getCommonCardClass()} col-span-3 row-span-1 max-h-72 relative`}>
      {isOwner && onDescriptionUpdate && !isEditingDescription && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditingDescription(true)}
          className={`absolute top-4 right-4 h-6 w-6 p-0 rounded-md transition-all duration-200 ${getThemeTextColor('secondary')} hover:bg-gray-100 hover:${getThemeTextColor('primary')} dark:hover:bg-gray-700 z-10`}
        >
          <Edit3 className="h-3.5 w-3.5" />
        </Button>
      )}
      <CardContent className={spacing.inner.normal}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
              {teamName}
            </div>
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" />
              <AvatarFallback className={`text-sm font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                {leader.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-medium ${getThemeTextColor('primary')}`}>
                {leader.name}
              </p>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                Team Leader
              </p>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
            {isEditingDescription ? (
              <div className="space-y-2 h-24">
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="h-20 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900"
                  placeholder="Enter group description..."
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="gap-1"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveDescription}
                    disabled={isSaving || editedDescription.trim().length < 10}
                    className="gap-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
                  >
                    <Check className="h-3 w-3" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className={`text-sm h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${getThemeTextColor('secondary')} whitespace-pre-wrap`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}