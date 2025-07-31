'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Button } from '@/shadcn/ui/button';
import { Textarea } from '@/shadcn/ui/textarea';
import { Separator } from '@/shadcn/ui/separator';
import { spacing } from '@/styles/design-system';
import { Edit3, Check, X } from 'lucide-react';
import { useState } from 'react';

interface GroundRulesProps {
  rules: string[];
  isOwner?: boolean;
  onGroundRuleUpdate?: (newGroundRule: string) => Promise<void>;
}

export default function GroundRules({ rules, isOwner = false, onGroundRuleUpdate }: GroundRulesProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(rules.join('\n'));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onGroundRuleUpdate || editedRule === rules.join('\n')) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onGroundRuleUpdate(editedRule);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update ground rule:', error);
      setEditedRule(rules.join('\n')); // 실패 시 원래 값으로 되돌림
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedRule(rules.join('\n'));
    setIsEditing(false);
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
            onClick={() => setIsEditing(true)}
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
            <Textarea
              value={editedRule}
              onChange={(e) => setEditedRule(e.target.value)}
              className="min-h-[200px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900"
              placeholder="그라운드 룰을 입력하세요..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="gap-1"
              >
                <X className="h-3 w-3" />
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || editedRule.trim().length < 10}
                className="gap-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
              >
                <Check className="h-3 w-3" />
                {isSaving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule, index) => (
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
        )}
      </CardContent>
    </Card>
  );
}