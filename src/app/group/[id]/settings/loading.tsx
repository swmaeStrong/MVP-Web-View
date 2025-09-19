'use client';

import PageLoader from '@/components/common/PageLoader';
import { useTranslation } from '@/providers/LanguageProvider';

export default function Loading() {
  const { t } = useTranslation();
  return <PageLoader message={t('common.loading')} />;
}