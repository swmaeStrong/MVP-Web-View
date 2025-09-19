'use client';

import { useNavigation } from '@/hooks/navigation/useNavigation';
import { useTranslation } from '@/providers/LanguageProvider';
import { Button } from '@/shadcn/ui/button';

/**
 * Example component demonstrating navigation with query parameter preservation
 * This shows the usage pattern similar to the Next.js router example you provided
 */
export default function NavigationExample() {
  const { t } = useTranslation();
  const {
    navigateWithParams,
    navigateWithExtraParams,
    navigateWithLocale,
    navigateClean,
    getQuery,
    getCurrentLocale,
    pathname,
  } = useNavigation();

  // Example: Navigate to a new page while preserving all current query parameters
  const navigateToStatistics = () => {
    navigateWithParams('/statistics');
  };

  // Example: Navigate with additional query parameters
  const navigateToLeaderboardWithFilter = () => {
    navigateWithExtraParams('/leaderboard', {
      category: 'development',
      period: 'weekly',
    });
  };

  // Example: Change language while staying on the same page
  const switchToEnglish = () => {
    navigateWithLocale('en');
  };

  // Example: Navigate to a new page without preserving query parameters
  const navigateToHomeClean = () => {
    navigateClean('/');
  };

  // Example: Access current query parameters
  const currentQuery = getQuery();
  const currentLocale = getCurrentLocale();

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{t('common.navigationExample')}</h3>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Current path: {pathname}</p>
        <p>Current locale: {currentLocale || 'none'}</p>
        <p>Current query: {JSON.stringify(currentQuery)}</p>
      </div>

      <div className="space-y-2">
        <div>
          <Button onClick={navigateToStatistics} variant="outline" size="sm">
            {t('navigation.statistics')} (쿼리 파라미터 유지)
          </Button>
        </div>

        <div>
          <Button onClick={navigateToLeaderboardWithFilter} variant="outline" size="sm">
            {t('navigation.leaderboard')} + 필터 추가
          </Button>
        </div>

        <div>
          <Button onClick={switchToEnglish} variant="outline" size="sm">
            Switch to English (same page)
          </Button>
        </div>

        <div>
          <Button onClick={navigateToHomeClean} variant="outline" size="sm">
            {t('navigation.home')} (쿼리 파라미터 제거)
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        <p>이 컴포넌트는 useNavigation 훅의 사용법을 보여줍니다.</p>
        <p>각 버튼을 클릭해보면 URL이 어떻게 변경되는지 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}