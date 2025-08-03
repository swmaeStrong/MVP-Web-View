'use client';

import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Textarea } from '@/shadcn/ui/textarea';
import { useTheme } from '@/hooks/ui/useTheme';
import { LucideIcon } from 'lucide-react';
import * as React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (textareaValue?: string) => void | Promise<void>;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  showIcon?: boolean;
  showTextarea?: boolean;
  textareaLabel?: string;
  textareaPlaceholder?: string;
  textareaRequired?: boolean;
  textareaValue?: string;
  onTextareaChange?: (value: string) => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  loadingText = 'Processing...',
  icon: Icon,
  showIcon = true,
  showTextarea = false,
  textareaLabel,
  textareaPlaceholder,
  textareaRequired = false,
  textareaValue: externalTextareaValue,
  onTextareaChange,
}: ConfirmDialogProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const [internalTextareaValue, setInternalTextareaValue] = React.useState('');
  
  // Use external value if provided, otherwise use internal state
  const textareaValue = externalTextareaValue !== undefined ? externalTextareaValue : internalTextareaValue;
  const handleTextareaChange = (value: string) => {
    if (onTextareaChange) {
      onTextareaChange(value);
    } else {
      setInternalTextareaValue(value);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    await onConfirm(showTextarea ? textareaValue : undefined);
  };

  const isConfirmDisabled = () => {
    if (isLoading) return true;
    if (showTextarea && textareaRequired && !textareaValue.trim()) return true;
    return false;
  };

  const getButtonVariant = () => {
    if (variant === 'destructive') {
      return 'destructive';
    }
    return 'default';
  };

  const getButtonClassName = () => {
    if (variant === 'destructive') {
      return 'bg-red-600 hover:bg-red-700 text-white';
    }
    return 'bg-[#3F72AF] hover:bg-[#3F72AF]/90 text-white';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${getThemeClass('component')} ${getThemeClass('border')} max-w-md`}>
        <DialogHeader className="space-y-3">
          <DialogTitle className={`text-xl font-semibold ${getThemeTextColor('primary')}`}>
            {title}
          </DialogTitle>
          <DialogDescription className={`${getThemeTextColor('secondary')} leading-relaxed`}>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {showTextarea && (
          <div className="my-4">
            {textareaLabel && (
              <label className={`text-sm font-medium ${getThemeTextColor('primary')} mb-2 block`}>
                {textareaLabel} {textareaRequired && <span className="text-red-500">*</span>}
              </label>
            )}
            <Textarea
              placeholder={textareaPlaceholder}
              value={textareaValue}
              onChange={(e) => handleTextareaChange(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        )}
        
        <DialogFooter className="mt-6 gap-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className={`${getThemeClass('border')} ${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`}
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={handleConfirm}
            disabled={isConfirmDisabled()}
            className={getButtonClassName()}
          >
            {isLoading ? (
              <>
                {Icon && showIcon && <Icon className="h-4 w-4 mr-2 animate-pulse" />}
                {loadingText}
              </>
            ) : (
              <>
                {Icon && showIcon && <Icon className="h-4 w-4 mr-2" />}
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}