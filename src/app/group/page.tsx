'use client';

import PageLoader from '@/components/common/PageLoader';
import { useGroupTabStore } from '@/stores/groupTabStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function GroupPage() {
  const router = useRouter();
  const { lastVisitedTab, getLastVisitedTab, _hasHydrated } = useGroupTabStore((state) => ({
    lastVisitedTab: state.lastVisitedTab,
    getLastVisitedTab: state.getLastVisitedTab,
    _hasHydrated: state._hasHydrated
  }));
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  // 즉시 실행되는 리다이렉트 함수
  const performRedirect = () => {
    if (hasRedirected.current || !_hasHydrated) return;
    
    try {
      const lastTab = lastVisitedTab || getLastVisitedTab();
      
      if (lastTab && lastTab.startsWith('/group/')) {
        // Validate the path format before redirecting
        const validGroupPaths = ['/group/search', '/group/create'];
        const isGroupIdPath = /^\/group\/\d+(?:\/(?:detail|settings))?$/.test(lastTab);
        
        if (validGroupPaths.includes(lastTab) || isGroupIdPath) {
          console.log('Redirecting to last tab:', lastTab);
          router.replace(lastTab);
        } else {
          console.log('Invalid path, redirecting to /group/search');
          router.replace('/group/search');
        }
      } else {
        console.log('No valid last tab, redirecting to /group/search');
        router.replace('/group/search');
      }
      
      hasRedirected.current = true;
      setIsRedirecting(true);
    } catch (error) {
      console.error('Redirect error:', error);
      router.replace('/group/search');
      hasRedirected.current = true;
      setIsRedirecting(true);
    }
  };

  // useEffect로 리다이렉트 시도 - hydration과 lastVisitedTab 변경 감지
  useEffect(() => {
    if (hasRedirected.current || !_hasHydrated) return;
    
    // 약간의 지연을 두고 리다이렉트 (zustand persist 로딩 완료 대기)
    const timer = setTimeout(() => {
      performRedirect();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [_hasHydrated, lastVisitedTab]);

  // 백업 리다이렉트 (무한 로딩 방지)
  useEffect(() => {
    if (hasRedirected.current) return;
    
    // 3초 후 강제 리다이렉트 (무한 로딩 방지)
    redirectTimer.current = setTimeout(() => {
      if (!hasRedirected.current) {
        console.log('Force redirect to /group/search after 3 seconds');
        router.replace('/group/search');
        hasRedirected.current = true;
        setIsRedirecting(true);
      }
    }, 3000);

    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, [router]);

  // Show loading while redirecting instead of null
  return <PageLoader message="Redirecting to your last group..." />;
}