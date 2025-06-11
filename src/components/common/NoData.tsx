'use client';

import { Inbox } from 'lucide-react';

interface NoDataProps {
  title?: string;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function NoData({
  title = '데이터가 없습니다',
  message = '표시할 데이터가 없습니다. 나중에 다시 확인해주세요.',
  size = 'medium',
}: NoDataProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          icon: 'h-8 w-8',
          title: 'text-lg',
          message: 'text-sm',
        };
      case 'large':
        return {
          container: 'p-8',
          icon: 'h-16 w-16',
          title: 'text-2xl',
          message: 'text-base',
        };
      default: // medium
        return {
          container: 'p-6',
          icon: 'h-12 w-12',
          title: 'text-xl',
          message: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className='w-full'>
      <div
        className={`rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 shadow-sm transition-all duration-200 hover:shadow-md ${sizeClasses.container}`}
      >
        <div className='text-center'>
          {/* 아이콘 */}
          <div className='mb-4 flex justify-center'>
            <div className='flex items-center justify-center rounded-full border-2 border-slate-200 bg-slate-100 p-3'>
              <Inbox className={`${sizeClasses.icon} text-slate-500`} />
            </div>
          </div>

          {/* 텍스트 */}
          <div className='space-y-2'>
            <h3 className={`${sizeClasses.title} font-semibold text-gray-800`}>
              {title}
            </h3>
            <p className={`${sizeClasses.message} text-gray-600`}>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
