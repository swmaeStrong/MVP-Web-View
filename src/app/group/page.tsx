'use client';

import { getLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PageLoader from '../../components/common/PageLoader';

export default function GroupPage() {
  const router = useRouter();
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

        if (lastTab && lastTab.startsWith('/group/')) {
          const validGroupPaths = ['/group/search', '/group/create'];
          const isGroupIdPath = /^\/group\/\d+(?:\/(?:detail|settings))?$/.test(lastTab);
          
          if (validGroupPaths.includes(lastTab) || isGroupIdPath) {
            router.replace(lastTab);
          } else {
            router.replace('/group/search');
          }
        } else {
          router.replace('/group/search');
        }
        
        hasRedirected.current = true;
      } catch (error) {
        console.error('Redirect error:', error);
        try {
          router.replace('/group/search');
        } catch (routerError) {
          console.error('Router replace failed:', routerError);
          // 폴백: window.location 사용
          if (typeof window !== 'undefined') {
            window.location.href = '/group/search';
          }
        }
        hasRedirected.current = true;
      }
    };

    performRedirect();
  }, [isMounted, isRouterReady, router]);

  // 로딩 화면
  if (!isMounted || !isRouterReady) {
    return (
      <PageLoader message="Redirecting to your last group..." />
    );
  }
}