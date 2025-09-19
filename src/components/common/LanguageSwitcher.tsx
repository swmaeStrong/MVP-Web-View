'use client';

import { useTranslation } from '@/providers/LanguageProvider';
import { SUPPORTED_LOCALES, LOCALE_NAMES, SupportedLocale } from '@/config/i18n';
import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'button' | 'compact';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'button',
  className = ''
}: LanguageSwitcherProps) {
  const { locale, setLocale, isClient } = useTranslation();
  const { getThemeClass, getThemeTextColor } = useTheme();

  // Don't render on server to avoid hydration issues
  if (!isClient) {
    return (
      <div className={`w-20 h-9 ${getThemeClass('componentSecondary')} rounded animate-pulse ${className}`} />
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`
              ${getThemeClass('component')}
              ${getThemeTextColor('primary')}
              hover:${getThemeClass('componentSecondary')}
              border ${getThemeClass('border')}
              transition-colors
              ${className}
            `}
          >
            <Languages className="h-4 w-4 mr-1" />
            {LOCALE_NAMES[locale]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`
            ${getThemeClass('component')}
            ${getThemeClass('border')}
            border
          `}
        >
          {SUPPORTED_LOCALES.map((supportedLocale) => (
            <DropdownMenuItem
              key={supportedLocale}
              onClick={() => setLocale(supportedLocale)}
              className={`
                ${getThemeTextColor('primary')}
                hover:${getThemeClass('componentSecondary')}
                cursor-pointer
                ${locale === supportedLocale ? getThemeClass('componentSecondary') : ''}
              `}
            >
              {LOCALE_NAMES[supportedLocale]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {SUPPORTED_LOCALES.map((supportedLocale) => (
        <Button
          key={supportedLocale}
          variant={locale === supportedLocale ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLocale(supportedLocale)}
          className={`
            ${locale === supportedLocale
              ? `${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`
              : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
            }
            transition-colors
          `}
        >
          {LOCALE_NAMES[supportedLocale]}
        </Button>
      ))}
    </div>
  );
}