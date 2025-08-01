'use client';

import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          // 기본 옵션만 설정
          duration: 4000,
          // 중복 토스트 방지를 위한 설정
          id: undefined, // 각 토스트마다 고유 ID가 자동 생성됨
        }}
      />
    </>
  );
}