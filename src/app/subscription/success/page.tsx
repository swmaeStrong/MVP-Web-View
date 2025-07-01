'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// 이 페이지는 더 이상 사용되지 않습니다.
// 모든 성공 메시지는 checkout 페이지에서 직접 처리됩니다.
export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // 즉시 메인 페이지로 리다이렉트
    router.replace('/');
  }, [router]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#383838]'>
      <div className='text-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-purple-400 border-t-transparent'></div>
        <p className='mt-4 text-gray-400'>리다이렉트 중...</p>
      </div>
    </div>
  );
}