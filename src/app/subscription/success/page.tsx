'use client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent } from '@/shadcn/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Subscription {
  plan: string
  price: number
  startDate: string
  paymentMethod: string
  status: string
}

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // 구독 정보 확인
    const savedSubscription = localStorage.getItem('subscription')
    if (!savedSubscription) {
      // 구독 정보가 없으면 구독 페이지로 리다이렉트
      router.push('/subscription')
      return
    }

    setSubscription(JSON.parse(savedSubscription))

    // 3초 후 confetti 효과 제거
    setTimeout(() => setShowConfetti(false), 3000)
  }, [router])

  if (!subscription) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent'></div>
          <p className='text-gray-600'>구독 정보를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      {/* Confetti 효과 */}
      {showConfetti && (
        <div className='pointer-events-none absolute inset-0'>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className='absolute animate-bounce'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '🎊', '✨', '🎈', '🎆'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className='relative z-10 mx-auto max-w-2xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='space-y-4 text-center'>
          <div className='animate-bounce text-6xl sm:text-8xl'>🎉</div>

          <Badge className='bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
            ✅ 구독 완료!
          </Badge>

          <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            환영합니다! 🚀
          </h1>
          <p className='text-lg text-gray-600 sm:text-xl'>
            Premium 구독이 성공적으로 완료되었습니다
          </p>
        </div>

        {/* 구독 상세 정보 */}
        <Card className='relative rounded-2xl border-0 bg-white p-6 shadow-xl sm:rounded-3xl sm:p-8'>
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-green-600/5 to-blue-600/5 sm:rounded-3xl'></div>

          <CardContent className='relative space-y-6 p-0'>
            <div className='text-center'>
              <h2 className='mb-4 text-2xl font-bold text-gray-800'>
                구독 내역
              </h2>

              <div className='grid gap-4 text-left sm:grid-cols-2'>
                <div className='rounded-xl bg-gray-50 p-4'>
                  <div className='mb-1 text-sm text-gray-600'>플랜</div>
                  <div className='font-bold text-gray-800'>Premium 구독</div>
                </div>

                <div className='rounded-xl bg-gray-50 p-4'>
                  <div className='mb-1 text-sm text-gray-600'>월 요금</div>
                  <div className='font-bold text-gray-800'>$1/월</div>
                </div>

                <div className='rounded-xl bg-gray-50 p-4'>
                  <div className='mb-1 text-sm text-gray-600'>구독 시작일</div>
                  <div className='font-bold text-gray-800'>
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </div>
                </div>

                <div className='rounded-xl bg-gray-50 p-4'>
                  <div className='mb-1 text-sm text-gray-600'>결제 수단</div>
                  <div className='font-bold text-gray-800'>
                    {subscription.paymentMethod === 'card'
                      ? '신용/체크카드'
                      : 'PayPal'}
                  </div>
                </div>
              </div>
            </div>

            {/* 30일 무료 체험 강조 */}
            <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-100 to-blue-100 p-4'>
              <div className='text-center'>
                <div className='mb-2 text-lg font-bold text-green-700'>
                  🎁 30일 무료 체험 시작!
                </div>
                <p className='text-sm text-green-600'>
                  {new Date(
                    new Date(subscription.startDate).getTime() +
                      30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                  까지 무료로 이용하실 수 있습니다
                </p>
              </div>
            </div>

            {/* 프리미엄 혜택 */}
            <div className='space-y-3'>
              <h3 className='text-center font-bold text-gray-800'>
                🎯 이제 이용할 수 있는 혜택
              </h3>
              <div className='grid gap-3 sm:grid-cols-2'>
                {[
                  { icon: '🔥', text: '무제한 프리미엄 기능' },
                  { icon: '🚫', text: '광고 없는 깔끔한 경험' },
                  { icon: '⭐', text: '우선 고객 지원' },
                  { icon: '🆕', text: '새로운 기능 우선 접근' },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 rounded-lg bg-purple-50 p-3'
                  >
                    <span className='text-xl'>{benefit.icon}</span>
                    <span className='font-medium text-gray-700'>
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className='space-y-4'>
          <Button
            size='lg'
            className='w-full transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl'
            onClick={() => router.push('/dashboard')}
          >
            <div className='flex items-center justify-center gap-2'>
              <span>프리미엄 기능 체험하기</span>
              <span className='text-2xl'>✨</span>
            </div>
          </Button>

          <div className='grid gap-4 sm:grid-cols-2'>
            <Button
              size='default'
              variant='outline'
              className='w-full rounded-xl border-purple-300 text-purple-600 hover:bg-purple-50'
              onClick={() => router.push('/subscription/manage')}
            >
              구독 관리
            </Button>

            <Button
              size='default'
              variant='outline'
              className='w-full rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50'
              onClick={() => router.push('/support')}
            >
              고객 지원
            </Button>
          </div>
        </div>

        {/* 추가 안내 */}
        <div className='rounded-2xl bg-white p-6 shadow-lg'>
          <div className='space-y-3 text-center'>
            <div className='text-2xl'>📧</div>
            <h3 className='text-lg font-bold text-gray-800'>
              구독 확인 이메일
            </h3>
            <p className='text-sm text-gray-600'>
              구독 완료 확인 이메일이 발송되었습니다.
              <br />
              영수증과 자세한 구독 정보를 확인해보세요.
            </p>

            <div className='mt-4 grid grid-cols-3 gap-4 text-xs text-gray-500'>
              <div className='flex flex-col items-center'>
                <span className='mb-1 text-lg text-green-500'>✓</span>
                <span>언제든 취소 가능</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='mb-1 text-lg text-green-500'>✓</span>
                <span>즉시 환불 보장</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='mb-1 text-lg text-green-500'>✓</span>
                <span>안전한 자동 결제</span>
              </div>
            </div>
          </div>
        </div>

        {/* 감사 메시지 */}
        <div className='rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center text-white'>
          <h3 className='mb-2 text-xl font-bold'>🙏 감사합니다!</h3>
          <p className='text-purple-100'>
            Premium 구독을 선택해주셔서 감사합니다.
            <br />더 나은 서비스를 제공하기 위해 최선을 다하겠습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
