'use client';

import { Crown, Ghost, History, MapPin, Target, Trophy } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';

interface EmptyStateProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  selectedCategory: string;
  selectedDateIndex: number;
  refetch?: () => void;
}

export default function EmptyState({
  selectedPeriod,
  selectedCategory,
  selectedDateIndex,
  refetch,
}: EmptyStateProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const timeLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };

  // Check if current period (today, this week, this month)
  const isCurrentPeriod = selectedDateIndex === 0;

  const getEmptyStateContent = () => {
    const period = timeLabels[selectedPeriod];
    const category = selectedCategory === 'all' ? 'All' : selectedCategory;

    if (isCurrentPeriod) {
      // Current period - motivational and competitive stimulus
      const currentMessages = {
        daily: {
          title: 'Claim today\'s #1 spot!',
          subtitle: 'No one has challenged yet',
          description: `Create the first record in the ${category} category!`,
          cta: 'Start now and you can claim today\'s #1 spot!',
          icon: <Target className='h-16 w-16 text-orange-500' />,
          bgGradient: 'from-orange-100 via-red-50 to-pink-100',
          borderColor: 'border-orange-200',
          accentColor: 'text-orange-600',
        },
        weekly: {
          title: 'Claim this week\'s #1 spot!',
          subtitle: 'No one has challenged yet',
          description: `Create the first record in the ${category} category!`,
          cta: 'Start now and you can claim this week\'s #1 spot!',
          icon: <Crown className='h-16 w-16 text-blue-500' />,
          bgGradient: 'from-blue-100 via-indigo-50 to-purple-100',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
        },
        monthly: {
          title: 'Claim this month\'s #1 spot!',
          subtitle: 'No one has challenged yet',
          description: `Create the first record in the ${category} category!`,
          cta: 'Start now and you can claim this month\'s #1 spot!',
          icon: <Trophy className='h-16 w-16 text-purple-500' />,
          bgGradient: 'from-purple-100 via-pink-50 to-indigo-100',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
        },
      };

      return currentMessages[selectedPeriod];
    } else {
      // Past period - witty historical perspective
      const pastMessages = {
        daily: {
          title: 'It was a quiet day',
          subtitle: `${selectedDateIndex} days ago`,
          description: `It was a peaceful day when no one was active in the ${category} category.`,
          cta: 'You\'ve discovered a blank page in history!',
          icon: <History className='h-16 w-16 text-gray-400' />,
          bgGradient: 'from-gray-50 via-slate-50 to-blue-50',
          borderColor: 'border-gray-200',
          accentColor: 'text-gray-600',
        },
        weekly: {
          title: 'A quiet week',
          subtitle: `${selectedDateIndex} weeks ago`,
          description: `It was a quiet week with no activity in the ${category} category.`,
          cta: 'You\'ve discovered a week of silence!',
          icon: <Ghost className='h-16 w-16 text-indigo-400' />,
          bgGradient: 'from-indigo-50 via-blue-50 to-cyan-50',
          borderColor: 'border-indigo-200',
          accentColor: 'text-indigo-600',
        },
        monthly: {
          title: 'A quiet month',
          subtitle: `${selectedDateIndex} months ago`,
          description: `It was a quiet month with no activity in the ${category} category.`,
          cta: 'You\'ve encountered a mystery of time!',
          icon: <MapPin className='h-16 w-16 text-purple-400' />,
          bgGradient: 'from-purple-50 via-pink-50 to-indigo-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
        },
      };

      return pastMessages[selectedPeriod];
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className='mb-8 flex w-full justify-center'>
      <div
        className={`relative w-full overflow-hidden ${componentSizes.xlarge.borderRadius} ${componentSizes.medium.border} ${componentSizes.xlarge.padding} ${componentSizes.xlarge.shadow} ${componentStates.hoverable.transition} ${componentStates.hoverable.hover.scale} hover:shadow-2xl ${getThemeClass('borderLight')} ${getThemeClass('component')}`}
      >
        {/* Header */}
        <div className='mb-6 text-center'>
          <div className='mb-4 flex justify-center'>
            <div className={`rounded-full p-4 shadow-lg ${
              isDarkMode ? 'bg-white/10' : 'bg-white/80'
            }`}>
              {content.icon}
            </div>
          </div>
          <h2 className={`mb-2 text-2xl font-bold ${content.accentColor}`}>
            {content.title}
          </h2>
          <p className={`text-base font-medium ${getThemeTextColor('secondary')}`}>
            {content.subtitle}
          </p>
        </div>

        {/* Main content */}
        <div className='space-y-4 text-center'>
          <p className={`text-lg leading-relaxed ${getThemeTextColor('primary')}`}>
            {content.description}
          </p>

          <div className={`rounded-xl border p-4 shadow-inner ${getThemeClass('borderLight')} ${getThemeClass('componentSecondary')}`}>
            <p className={`text-base font-bold ${getThemeTextColor('accent')}`}>
              {content.cta}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
