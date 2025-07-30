'use client';

import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/ui/useTheme';

export default function HomePage() {
  const router = useRouter();
  const { getThemeClass, getThemeTextColor } = useTheme();

  return (
    <div className={`min-h-screen ${getThemeClass('background')}`}>
      <div className='mx-auto max-w-7xl px-4 py-12 lg:px-8'>
        {/* 히어로 섹션 */}
        <div className='text-center mb-16'>
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${getThemeTextColor('primary')}`}>
            생산성을 추적하고
            <br />
            <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
              성장하세요
            </span>
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${getThemeTextColor('secondary')}`}>
            Pawcus와 함께 개발 시간을 추적하고, 생산성을 분석하며, 
            프리미엄 기능으로 더 나은 성과를 달성하세요.
          </p>
          
          <div className='flex justify-center'>
            <Button
              size='lg'
              onClick={() => router.push('/subscription')}
              className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg rounded-lg'
            >
              프리미엄 구독하기
            </Button>
          </div>
        </div>

        {/* 프리미엄 기능 미리보기 */}
        <div className='grid md:grid-cols-3 gap-6 mb-16'>
          <Card className={`${getThemeClass('component')} ${getThemeClass('border')} hover:shadow-lg transition-shadow`}>
            <CardContent className='p-6 text-center'>
              <div className='text-3xl mb-4'>📊</div>
              <h3 className={`text-lg font-semibold mb-2 ${getThemeTextColor('primary')}`}>
                상세 분석
              </h3>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                시간별, 일별, 월별 상세한 생산성 분석과 리포트
              </p>
            </CardContent>
          </Card>

          <Card className={`${getThemeClass('component')} ${getThemeClass('border')} hover:shadow-lg transition-shadow`}>
            <CardContent className='p-6 text-center'>
              <div className='text-3xl mb-4'>🏆</div>
              <h3 className={`text-lg font-semibold mb-2 ${getThemeTextColor('primary')}`}>
                리더보드
              </h3>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                다른 개발자들과 생산성을 비교하고 동기부여 받기
              </p>
            </CardContent>
          </Card>

          <Card className={`${getThemeClass('component')} ${getThemeClass('border')} hover:shadow-lg transition-shadow`}>
            <CardContent className='p-6 text-center'>
              <div className='text-3xl mb-4'>🎯</div>
              <h3 className={`text-lg font-semibold mb-2 ${getThemeTextColor('primary')}`}>
                목표 설정
              </h3>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                개인 목표 설정과 달성률 추적으로 꾸준한 성장
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA 섹션 */}
        <div className={`text-center p-8 rounded-2xl ${getThemeClass('componentSecondary')} ${getThemeClass('border')}`}>
          <h2 className={`text-2xl font-bold mb-4 ${getThemeTextColor('primary')}`}>
            지금 프리미엄으로 업그레이드하세요
          </h2>
          <p className={`mb-6 ${getThemeTextColor('secondary')}`}>
            월 4,900원으로 모든 프리미엄 기능을 이용하고 생산성을 극대화하세요
          </p>
          <Button
            size='lg'
            onClick={() => router.push('/subscription')}
            className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg rounded-lg'
          >
            구독 플랜 보기 →
          </Button>
        </div>

        {/* Business Information */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-[rgb(153,153,153)] space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-8 space-y-1 md:space-y-0">
              <span className="font-medium">상호명: 집중</span>
              <span className="hidden md:inline text-gray-400 dark:text-[rgb(153,153,153)]">|</span>
              <span>사업자등록번호: 255-18-02409</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-8 space-y-1 md:space-y-0">
              <span>대표자: 김영현</span>
              <span className="hidden md:inline text-gray-400 dark:text-[rgb(153,153,153)]">|</span>
              <span>전화번호: 010-5172-5645</span>
            </div>
            <div className="text-center">
              <span>사업장주소: 전라남도 나주시 우정로 77</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
