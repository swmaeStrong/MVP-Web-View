'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useGroupTabStore } from '@/stores/groupTabStore';

export function useLastGroupTab() {
  const pathname = usePathname();
  const setLastVisitedTab = useGroupTabStore((state) => state.setLastVisitedTab);

  useEffect(() => {
    // Save current group tab to Zustand store with persist if it's a group page
    if (pathname && pathname.startsWith('/group/')) {
      setLastVisitedTab(pathname);
    }
  }, [pathname, setLastVisitedTab]);
}