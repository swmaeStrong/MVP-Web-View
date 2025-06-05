'use client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent } from '@/shadcn/ui/card'
import { useRouter } from 'next/navigation'

export const subscriptionPage = () => {
  const router = useRouter()

  const coreFeatures = [
    '무제한 프리미엄 기능',
    '광고 없는 깔끔한 경험',
    '30일 무료 체험',
  ]

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4'>
      <div className='w-full max-w-md'>
        {/* 메인 구독 카드 */}
        <Card className='hover:shadow-3xl relative rounded-3xl border-0 bg-white p-8 shadow-2xl transition-all duration-300'>
          {/* 배경 그래디언트 */}
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/5 to-blue-600/5'></div>

          <CardContent className='relative space-y-6 p-0'>
            {/* 특가 배지 */}
            <div className='text-center'>
              <Badge className='rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
                🎉 특별 할인가
              </Badge>
            </div>

            {/* 가격 섹션 */}
            <div className='space-y-2 text-center'>
              <div className='flex items-end justify-center gap-2'>
                <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-6xl font-bold text-transparent'>
                  $1
                </span>
                <span className='mb-2 text-xl text-gray-600'>/월</span>
              </div>
              <p className='text-lg text-gray-500 line-through'>원래 $9/월</p>
              <div className='inline-block rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white'>
                89% 절약
              </div>
            </div>

            {/* 핵심 혜택 */}
            <div className='space-y-3'>
              {coreFeatures.map((feature, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <div className='h-2 w-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600'></div>
                  <span className='text-gray-700'>{feature}</span>
                </div>
              ))}
            </div>

            {/* 결제 버튼 */}
            <Button
              size='lg'
              className='w-full transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl'
              onClick={() => {
                router.push('/payment')
              }}
            >
              지금 시작하기 🚀
            </Button>

            {/* 간단한 보증 */}
            <p className='text-center text-sm text-gray-500'>
              언제든 취소 가능 • 30일 무료 체험
            </p>
          </CardContent>
        </Card>

        {/* 간단한 신뢰 지표 */}
        <div className='mt-6 space-y-2 text-center'>
          <div className='flex items-center justify-center gap-4 text-sm text-gray-600'>
            <span className='flex items-center gap-1'>
              <span className='text-green-500'>✓</span>
              즉시 이용 가능
            </span>
            <span className='flex items-center gap-1'>
              <span className='text-green-500'>✓</span>
              안전한 결제
            </span>
            <span className='flex items-center gap-1'>
              <span className='text-green-500'>✓</span>
              무료 취소
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default subscriptionPage
