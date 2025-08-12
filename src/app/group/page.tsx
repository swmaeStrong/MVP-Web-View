'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getLastGroupTab } from '@/hooks/group/useLastGroupTab';

export default function GroupPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || hasRedirected.current) return;

    const performRedirect = () => {
      try {
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
        router.replace('/group/search');
        hasRedirected.current = true;
      }
    };

    // 즉시 실행
    performRedirect();
  }, [isMounted, router]);

  // 로딩 화면
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Redirecting to your last group...
          </p>
        </div>
      </div>
    );
  }

  return null;
}