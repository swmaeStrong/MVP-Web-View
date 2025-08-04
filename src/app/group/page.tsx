'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGroupTabStore } from '@/stores/groupTabStore';
import PageLoader from '@/components/common/PageLoader';

export default function GroupPage() {
  const router = useRouter();
  const getLastVisitedTab = useGroupTabStore((state) => state.getLastVisitedTab);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  // 즉시 실행되는 리다이렉트 함수
  const performRedirect = () => {
    if (hasRedirected.current) return;
    
    try {
      const lastTab = getLastVisitedTab();
      
      if (lastTab && lastTab.startsWith('/group/')) {
        // Validate the path format before redirecting
        const validGroupPaths = ['/group/find', '/group/create'];
        const isTeamPath = /^\/group\/team\/\d+(?:\/(?:settings|activities|calendar|members))?$/.test(lastTab);
        
        if (validGroupPaths.includes(lastTab) || isTeamPath) {
          console.log('Redirecting to last tab:', lastTab);
          router.replace(lastTab);
        } else {
          console.log('Invalid path, redirecting to /group/find');
          router.replace('/group/find');
        }
      } else {
        console.log('No valid last tab, redirecting to /group/find');
        router.replace('/group/find');
      }
      
      hasRedirected.current = true;
      setIsRedirecting(true);
    } catch (error) {
      console.error('Redirect error:', error);
      router.replace('/group/find');
      hasRedirected.current = true;
      setIsRedirecting(true);
    }
  };

  // useEffect로 리다이렉트 시도
  useEffect(() => {
    if (hasRedirected.current) return;
    
    performRedirect();
  }, [router, getLastVisitedTab]);

  // 컴포넌트 마운트 후 즉시 실행 (useEffect 백업)
  useEffect(() => {
    if (hasRedirected.current) return;
    
    // 100ms 후 재시도 (useEffect가 안 걸린 경우 대비)
    const immediateTimer = setTimeout(() => {
      if (!hasRedirected.current) {
        console.log('useEffect fallback - performing redirect');
        performRedirect();
      }
    }, 100);

    // 2초 후 강제 리다이렉트 (무한 로딩 방지)
    redirectTimer.current = setTimeout(() => {
      if (!hasRedirected.current) {
        console.log('Force redirect to /group/find after 2 seconds');
        router.replace('/group/find');
        hasRedirected.current = true;
        setIsRedirecting(true);
      }
    }, 2000);

    return () => {
      clearTimeout(immediateTimer);
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // Show loading while redirecting instead of null
  return <PageLoader message="Redirecting to your last group..." />;
}