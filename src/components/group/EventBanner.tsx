'use client';

import { ArrowRight } from 'lucide-react';

interface EventBannerProps {
  className?: string;
}

export default function EventBanner({ className = '' }: EventBannerProps) {
  return (
    <div className={`${className} bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-purple-800/30`}>
      <a 
        href="https://nebula-pickle-084.notion.site/24936fef248e80ac94afefb9fca3c3e8"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="px-6 py-2.5 flex items-center justify-center">
          <div className="flex items-center gap-3">
            {/* Left sparkle */}
            
            {/* Main content */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                그룹 참여해서 개발시간 인증하고 메가커피 기프티콘 받자!!
              </span>
            </div>

            {/* Arrow with hover effect */}
            <ArrowRight className="h-4 w-4 text-blue-400 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </a>
    </div>
  );
}