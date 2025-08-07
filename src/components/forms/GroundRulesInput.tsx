'use client';

import { Button } from '@/shadcn/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Textarea } from '@/shadcn/ui/textarea';
import { useTheme } from '@/hooks/ui/useTheme';
import { Plus, Trash2 } from 'lucide-react';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { useRef, useCallback } from 'react';

interface GroundRulesInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  maxRules?: number;
  disabled?: boolean;
}

export function GroundRulesInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  name,
  label = "Ground Rules",
  maxRules = 10,
  disabled = false,
}: GroundRulesInputProps<TFieldValues, TName>) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const isAddingRule = useRef(false);
  
  const fieldValue = form.watch(name) as string[];
  
  const handleAddRule = useCallback(() => {
    if (isAddingRule.current || fieldValue.length >= 10) {
      return;
    }
    
    isAddingRule.current = true;
    const newRules = [...fieldValue, ''];
    form.setValue(name, newRules as any);
    
    // 다음 프레임에서 새로 생성된 textarea에 포커스
    setTimeout(() => {
      const newIndex = newRules.length - 1;
      textareaRefs.current[newIndex]?.focus();
      isAddingRule.current = false;
    }, 100);
  }, [fieldValue, form, name]);

  const removeRule = (index: number) => {
    if (fieldValue.length > 1) {
      const newRules = fieldValue.filter((_, i) => i !== index);
      form.setValue(name, newRules as any);
      // 삭제 후 이전 textarea에 포커스
      setTimeout(() => {
        const focusIndex = Math.max(0, index - 1);
        textareaRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  const updateRule = (index: number, value: string) => {
    // 30글자 제한
    if (value.length > 30) {
      return;
    }
    
    const newRules = [...fieldValue];
    newRules[index] = value;
    form.setValue(name, newRules as any);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      // 현재 값이 비어있지 않고 10개 미만일 때만 새 룰 추가
      const currentValue = fieldValue[index]?.trim();
      if (currentValue && fieldValue.length < 10) {
        handleAddRule();
      }
    }
  };

  return (
    <FormItem>
      <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
        {label}
      </FormLabel>
      <FormControl>
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {fieldValue.map((rule, index) => (
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
                  onChange={(e) => updateRule(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder="Enter a ground rule... (Press Enter to add next rule)"
                  className={`flex-1 min-h-[60px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] resize-none ${
                    rule.length > 30 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  rows={2}
                  disabled={disabled}
                />
                {fieldValue.length > 1 && !disabled && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeRule(index)}
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
          
          <div className="flex items-center justify-between mt-4">
            {fieldValue.length < 10 && !disabled && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddRule}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Ground Rule
              </Button>
            )}
            
            <div className="flex flex-col items-end text-xs space-y-1">
              <span className={`${
                fieldValue.length >= 10 ? 'text-red-500' : 
                fieldValue.length >= 8 ? 'text-yellow-600' : 
                getThemeTextColor('secondary')
              }`}>
                {fieldValue.length}/10 rules
              </span>
              {fieldValue.length >= 10 && (
                <span className="text-red-500">Maximum rules reached</span>
              )}
            </div>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}