'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  onRetry?: () => void;
}

export default function ErrorState({
  title = '오류가 발생했습니다',
  message = '문제가 발생했습니다. 다시 시도해주세요.',
  size = 'medium',
  onRetry,
}: ErrorStateProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          icon: 'h-8 w-8',
          title: 'text-lg',
          message: 'text-sm',
          button: 'px-3 py-1.5 text-xs',
        };
      case 'large':
        return {
          container: 'p-8',
          icon: 'h-16 w-16',
          title: 'text-2xl',
          message: 'text-base',
          button: 'px-6 py-3 text-sm',
        };
      default: // medium
        return {
          container: 'p-6',
          icon: 'h-12 w-12',
          title: 'text-xl',
          message: 'text-sm',
          button: 'px-4 py-2 text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className='w-full'>
      <div
        className={`rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-200 hover:shadow-md ${sizeClasses.container}`}
      >
        <div className='text-center'>
          {/* 아이콘 */}
          <div className='mb-4 flex justify-center'>
            <div className='flex items-center justify-center rounded-full border-2 border-red-200 bg-red-100 p-3'>
              <AlertTriangle className={`${sizeClasses.icon} text-red-600`} />
            </div>
          </div>

          {/* 텍스트 */}
          <div className='space-y-2'>
            <h3 className={`${sizeClasses.title} font-semibold text-gray-800`}>
              {title}
            </h3>
            <p className={`${sizeClasses.message} text-gray-600`}>{message}</p>
          </div>

          {/* 재시도 버튼 */}
          {onRetry && (
            <div className='mt-6'>
              <button
                onClick={onRetry}
                className={`${sizeClasses.button} inline-flex items-center space-x-2 rounded-lg bg-red-500 font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-600 hover:shadow-md focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:outline-none`}
              >
                <RefreshCw className='h-4 w-4' />
                <span>다시 시도</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
