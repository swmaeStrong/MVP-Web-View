'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGroupTabStore } from '@/stores/groupTabStore';

export default function GroupPage() {
  const router = useRouter();
  const getLastVisitedTab = useGroupTabStore((state) => state.getLastVisitedTab);

  useEffect(() => {
    // Get last visited group tab from Zustand store
    const lastTab = getLastVisitedTab();
    
    if (lastTab && lastTab.startsWith('/group/')) {
      // Redirect to last visited tab
      router.replace(lastTab);
    } else {
      // Default to find team page
      router.replace('/group/find');
    }
  }, [router, getLastVisitedTab]);

  return null;
}