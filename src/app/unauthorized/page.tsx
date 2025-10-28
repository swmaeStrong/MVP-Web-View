'use client';

import { Lock } from 'lucide-react';

import StateDisplay from '@/components/common/StateDisplay';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StateDisplay
          type="error"
          title="접근 권한이 없습니다"
          message="로그인이 필요하거나 권한이 부족합니다."
          icon={Lock}
          showBorder={true}
          size="large"
        />
      </div>
    </div>
  );
}