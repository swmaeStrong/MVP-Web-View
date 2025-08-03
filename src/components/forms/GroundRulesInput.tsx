'use client';

import { Button } from '@/shadcn/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Textarea } from '@/shadcn/ui/textarea';
import { useTheme } from '@/hooks/ui/useTheme';
import { Plus, Trash2 } from 'lucide-react';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

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
  
  const fieldValue = form.watch(name) as string[];
  
  const handleAddRule = () => {
    if (fieldValue.length < maxRules) {
      form.setValue(name, [...fieldValue, ''] as any);
    }
  };

  const removeRule = (index: number) => {
    if (fieldValue.length > 1) {
      const newRules = fieldValue.filter((_, i) => i !== index);
      form.setValue(name, newRules as any);
    }
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...fieldValue];
    newRules[index] = value;
    form.setValue(name, newRules as any);
  };

  return (
    <FormItem>
      <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
        {label}
      </FormLabel>
      <FormControl>
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {fieldValue.map((rule, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getThemeClass('component')} ${getThemeTextColor('secondary')}`}>
                {index + 1}
              </div>
              <Textarea
                value={rule}
                onChange={(e) => updateRule(index, e.target.value)}
                placeholder="Enter a ground rule..."
                className="flex-1 min-h-[60px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] resize-none"
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
          ))}
          
          {fieldValue.length < maxRules && !disabled && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddRule}
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
  );
}