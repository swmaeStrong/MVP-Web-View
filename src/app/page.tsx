'use client';

import Navigation from '@/components/Navigation';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50'>
      <Navigation />

      <div className='mx-auto max-w-7xl px-4 py-12 lg:px-8'></div>
    </div>
  );
}
