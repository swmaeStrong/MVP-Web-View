'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const LAST_GROUP_TAB_KEY = 'last-visited-group-tab';

export function useLastGroupTab() {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side after router is initialized
    if (!isClient || typeof window === 'undefined') return;
    
    // Save current group tab to localStorage if it's a group page
    if (pathname && pathname.startsWith('/group/')) {
      try {
        localStorage.setItem(LAST_GROUP_TAB_KEY, pathname);
      } catch (error) {
        console.warn('Failed to save last group tab:', error);
      }
    }
  }, [pathname, isClient]);
}

export function getLastGroupTab(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_GROUP_TAB_KEY);
}