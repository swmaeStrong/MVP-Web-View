'use client';

import { useEffect, useRef, useState } from 'react';

import { getLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useNavigation } from '@/hooks/navigation/useNavigation';
import { useTranslation } from '@/providers/LanguageProvider';

import PageLoader from '../../components/common/PageLoader';

export default function GroupPage() {
  const { getQuery } = useNavigation();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [isRouterReady, setIsRouterReady] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Router 초기화 완료를 기다리는 추가 지연
    const timer = setTimeout(() => {
      setIsRouterReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || !isRouterReady || hasRedirected.current) return;

    const performRedirect = async () => {
      try {
        // 추가 지연으로 Router 완전 초기화 대기
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const lastTab = getLastGroupTab();
        const currentQuery = getQuery();
        const queryString = new URLSearchParams(currentQuery).toString();

        if (lastTab && lastTab.startsWith('/group/')) {
          const validGroupPaths = ['/group/search', '/group/create'];
          const isGroupIdPath = /^\/group\/\d+(?:\/(?:detail|settings))?$/.test(lastTab);

          if (validGroupPaths.includes(lastTab) || isGroupIdPath) {
            const urlWithQuery = queryString ? `${lastTab}?${queryString}` : lastTab;
            window.location.replace(urlWithQuery);
          } else {
            const urlWithQuery = queryString ? `/group/search?${queryString}` : '/group/search';
            window.location.replace(urlWithQuery);
          }
        } else {
          const urlWithQuery = queryString ? `/group/search?${queryString}` : '/group/search';
          window.location.replace(urlWithQuery);
        }
        
        hasRedirected.current = true;
      } catch (error) {
        console.error('Redirect error:', error);
        const currentQuery = getQuery();
        const queryString = new URLSearchParams(currentQuery).toString();
        const urlWithQuery = queryString ? `/group/search?${queryString}` : '/group/search';

        if (typeof window !== 'undefined') {
          window.location.href = urlWithQuery;
        }
        hasRedirected.current = true;
      }
    };

    performRedirect();
  }, [isMounted, isRouterReady, getQuery]);

  // 로딩 화면
  if (!isMounted || !isRouterReady) {
    return (
      <PageLoader message={t('common.loading')} />
    );
  }
}