'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Separator } from '@/shadcn/ui/separator';
import { Textarea } from '@/shadcn/ui/textarea';
import { spacing } from '@/styles/design-system';
import { Check, Edit3, Plus, Trash2, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface GroundRulesProps {
  rules: string;
  isOwner?: boolean;
  onGroundRuleUpdate?: (newGroundRule: string) => Promise<void>;
}

export default function GroundRules({ rules, isOwner = false, onGroundRuleUpdate }: GroundRulesProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const isAddingRule = useRef(false);
  
  // Parse rules string into array, filtering out empty lines
  const parsedRules = rules
    .split('\n')
    .map(rule => rule.trim())
    .filter(rule => rule.length > 0);
  
  // State for editing individual rules
  const [editedRules, setEditedRules] = useState<string[]>([]);

  const handleStartEdit = () => {
    setEditedRules([...parsedRules]);
    if (parsedRules.length === 0) {
      setEditedRules(['']);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    const filteredRules = editedRules
      .map(rule => rule.trim())
      .filter(rule => rule.length > 0);
    
    const newRulesString = filteredRules.join('\n');
    
    if (!onGroundRuleUpdate || newRulesString === rules) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onGroundRuleUpdate(newRulesString);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update ground rule:', error);
      setEditedRules([...parsedRules]); // 실패 시 원래 값으로 되돌림
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedRules([...parsedRules]);
    setIsEditing(false);
  };

  const handleRuleChange = (index: number, value: string) => {
    // 30글자 제한
    if (value.length > 30) {
      return;
    }
    
    const newRules = [...editedRules];
    newRules[index] = value;
    setEditedRules(newRules);
  };

  const handleAddRule = useCallback(() => {
    if (isAddingRule.current || editedRules.length >= 10) {
      return;
    }
    
    isAddingRule.current = true;
    const newRules = [...editedRules, ''];
    setEditedRules(newRules);
    
    // 다음 프레임에서 새로 생성된 textarea에 포커스
    setTimeout(() => {
      const newIndex = newRules.length - 1;
      textareaRefs.current[newIndex]?.focus();
      isAddingRule.current = false;
    }, 100);
  }, [editedRules]);

  const handleRemoveRule = (index: number) => {
    if (editedRules.length > 1) {
      const newRules = editedRules.filter((_, i) => i !== index);
      setEditedRules(newRules);
      // 삭제 후 이전 textarea에 포커스
      setTimeout(() => {
        const focusIndex = Math.max(0, index - 1);
        textareaRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      // 현재 값이 비어있지 않고 10개 미만일 때만 새 룰 추가
      const currentValue = editedRules[index]?.trim();
      if (currentValue && editedRules.length < 10) {
        handleAddRule();
      }
    }
  };

  return (
    <Card className={`${getCommonCardClass()} col-span-2 row-span-2`}>
      <CardHeader className="text-center relative">
        <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
          Ground Rules
        </div>
        {isOwner && onGroundRuleUpdate && !isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleStartEdit}
            className={`absolute top-3 right-4 h-6 w-6 p-0 rounded-md transition-all duration-200 ${getThemeTextColor('secondary')} hover:bg-gray-100 hover:${getThemeTextColor('primary')} dark:hover:bg-gray-700`}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className={spacing.inner.normal}>
        <Separator className="mb-4" />
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-3 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {editedRules.map((rule, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getThemeClass('component')} ${getThemeTextColor('secondary')}`}>
                      {index + 1}
                    </div>
                    <Textarea
                      ref={(el) => {
                        textareaRefs.current[index] = el;
                      }}
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`flex-1 min-h-[60px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900 resize-none ${
                        rule.length > 30 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                      }`}
                      placeholder="Enter a ground rule... (Press Enter to add next rule)"
                      rows={2}
                    />
                    {editedRules.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveRule(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <span className={`text-xs ${
                      rule.length > 30 ? 'text-red-500' : 
                      rule.length > 25 ? 'text-yellow-600' : 
                      getThemeTextColor('secondary')
                    }`}>
                      {rule.length}/30
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {editedRules.length < 10 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddRule}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Rule
                  </Button>
                )}
                
                <div className="flex flex-col text-xs space-y-1">
                  <span className={`${
                    editedRules.length >= 10 ? 'text-red-500' : 
                    editedRules.length >= 8 ? 'text-yellow-600' : 
                    getThemeTextColor('secondary')
                  }`}>
                    {editedRules.length}/10 rules
                  </span>
                  {editedRules.length >= 10 && (
                    <span className="text-red-500">Maximum rules reached</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="gap-1"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || editedRules.every(rule => rule.trim().length === 0)}
                  className="gap-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
                >
                  <Check className="h-3 w-3" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        ) : parsedRules.length > 0 ? (
          <div className="space-y-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {parsedRules.map((rule, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-md ${getThemeClass('componentSecondary')} hover:${getThemeClass('componentSecondary')} hover:opacity-80 transition-all duration-200`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getThemeClass('component')} ${getThemeTextColor('secondary')}`}>
                  {index + 1}
                </div>
                <span className={`text-sm ${getThemeTextColor('primary')} leading-relaxed`}>
                  {rule}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={`text-sm ${getThemeTextColor('secondary')} italic`}>
              No ground rules have been set yet.
            </p>
            {isOwner && onGroundRuleUpdate && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleStartEdit}
                className="mt-3"
              >
                Add Ground Rules
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}