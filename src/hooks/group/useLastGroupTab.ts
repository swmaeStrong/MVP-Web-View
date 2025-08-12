'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LAST_GROUP_TAB_KEY = 'last-visited-group-tab';

export function useLastGroupTab() {
  const pathname = usePathname();

  useEffect(() => {
    // Save current group tab to localStorage if it's a group page
    if (pathname && pathname.startsWith('/group/')) {
      localStorage.setItem(LAST_GROUP_TAB_KEY, pathname);
    }
  }, [pathname]);
}

export function getLastGroupTab(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_GROUP_TAB_KEY);
}