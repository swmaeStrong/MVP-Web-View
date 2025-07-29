'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GroupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to find team page as the main group page
    router.replace('/group/find');
  }, [router]);

  return null;
}