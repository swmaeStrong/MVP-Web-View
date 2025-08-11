'use client';

import { FormControl, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { useTheme } from '@/hooks/ui/useTheme';
import { useGroupNameValidation } from '@/hooks/group/useCreateGroup';
import { brandColors } from '@/styles/colors';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

interface GroupNameInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  excludeFromValidation?: string; // 편집 시 현재 그룹명 제외
}

export function GroupNameInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  name,
  label = "Group Name",
  placeholder = "Enter group name...",
  disabled = false,
  excludeFromValidation,
}: GroupNameInputProps<TFieldValues, TName>) {
  const { getThemeTextColor } = useTheme();
  
  const fieldValue = form.watch(name) as string;
  
  // 중복 검사 (편집 시 현재 이름은 제외)
  const shouldCheckName = fieldValue.length >= 1 && 
    (!excludeFromValidation || fieldValue !== excludeFromValidation);
  
  // useGroupNameValidation 훅 사용하되, 조건부로 활성화
  const { data: isNameAvailable, isLoading: isCheckingName } = useGroupNameValidation(
    shouldCheckName && !disabled ? fieldValue : ''
  );

  return (
    <FormItem>
      <FormLabel className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
        {label}
      </FormLabel>
      <FormControl>
        <div className="relative space-y-1">
          <Input
            value={fieldValue}
            onChange={(e) => {
              // 16글자 제한
              if (e.target.value.length <= 16) {
                form.setValue(name, e.target.value as any);
              }
            }}
            placeholder={placeholder}
            className={`bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 ${brandColors.accent.ring} ${brandColors.accent.border} ${
              fieldValue.length > 16 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
            }`}
            disabled={disabled}
          />
          {shouldCheckName && !disabled && fieldValue && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingName ? (
                <div className="text-gray-400 text-xs">Checking...</div>
              ) : isNameAvailable === true ? (
                <div className="text-green-600 text-xs">✓ Available</div>
              ) : isNameAvailable === false ? (
                <div className="text-red-600 text-xs">✗ Taken</div>
              ) : null}
            </div>
          )}
          
          <div className="flex justify-end">
            <span className={`text-xs ${
              fieldValue.length > 16 ? 'text-red-500' : 
              fieldValue.length > 14 ? 'text-yellow-600' : 
              getThemeTextColor('secondary')
            }`}>
              {fieldValue.length}/16
            </span>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}