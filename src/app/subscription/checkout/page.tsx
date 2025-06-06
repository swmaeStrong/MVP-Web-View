'use client';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PaymentMethod {
  method: string;
  createdAt: string;
}

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [countdown, setCountdown] = useState<CountdownState | null>(null);

  useEffect(() => {
    // 결제 수단 확인
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    if (!savedPaymentMethods) {
      // 결제 수단이 없으면 등록 페이지로 리다이렉트
      router.push('/subscription/payment-method?from=subscription');
      return;
    }

    const methods = JSON.parse(savedPaymentMethods);
    setPaymentMethod(methods[0]);
  }, [router]);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // 결제 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 구독 정보 저장
      const subscriptionData = {
        plan: 'premium',
        price: 1,
        startDate: new Date().toISOString(),
        paymentMethod: paymentMethod?.method,
        status: 'active',
      };
      localStorage.setItem('subscription', JSON.stringify(subscriptionData));

      // 성공 페이지로 이동
      router.push('/subscription/success');
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 특별 할인 카운트다운 효과
  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(23, 59, 59, 999); // 오늘 자정까지

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ hours, minutes, seconds });
      } else {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!paymentMethod) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent'></div>
          <p className='text-gray-600'>결제 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-2xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='space-y-4 text-center'>
          <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
            🚀 구독 진행 중 • 2단계 중 2단계
          </Badge>

          <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            🎉 결제 확인
          </h1>
          <p className='text-lg text-gray-600 sm:text-xl'>
            마지막 단계입니다! 구독을 완료해보세요
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className='rounded-2xl bg-white p-4 shadow-lg'>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 text-green-600'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white'>
                ✓
              </div>
              <span className='font-medium'>결제 수단 등록</span>
            </div>
            <div className='mx-4 h-1 flex-1 rounded-full bg-green-500'></div>
            <div className='flex items-center gap-2 text-purple-600'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white'>
                2
              </div>
              <span className='font-medium'>구독 완료</span>
            </div>
          </div>
        </div>

        {/* 특별 할인 카운트다운 */}
        {countdown && (
          <Card className='relative rounded-2xl border-0 bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white shadow-xl'>
            <div className='space-y-2 text-center'>
              <div className='text-lg font-bold'>⏰ 특별 할인 마감까지</div>
              <div className='flex justify-center gap-4 text-2xl font-bold'>
                <div className='rounded-lg bg-white/20 px-3 py-2'>
                  <div>{countdown.hours.toString().padStart(2, '0')}</div>
                  <div className='text-xs'>시간</div>
                </div>
                <div className='rounded-lg bg-white/20 px-3 py-2'>
                  <div>{countdown.minutes.toString().padStart(2, '0')}</div>
                  <div className='text-xs'>분</div>
                </div>
                <div className='rounded-lg bg-white/20 px-3 py-2'>
                  <div>{countdown.seconds.toString().padStart(2, '0')}</div>
                  <div className='text-xs'>초</div>
                </div>
              </div>
              <p className='text-sm opacity-90'>
                지금 놓치면 정가로 결제하셔야 합니다!
              </p>
            </div>
          </Card>
        )}

        {/* 구독 요약 */}
        <Card className='relative rounded-2xl border-0 bg-white p-6 shadow-xl sm:rounded-3xl sm:p-8'>
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 sm:rounded-3xl'></div>

          <CardContent className='relative space-y-6 p-0'>
            <div className='text-center'>
              <h2 className='mb-2 text-2xl font-bold text-gray-800'>
                Premium 구독
              </h2>
              <div className='mb-4 flex items-end justify-center gap-2'>
                <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent'>
                  $1
                </span>
                <span className='mb-2 text-xl text-gray-600'>/월</span>
              </div>
              <div className='inline-block rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white'>
                89% 절약 (원가 $9/월)
              </div>
            </div>

            {/* 혜택 목록 */}
            <div className='space-y-3'>
              <h3 className='font-bold text-gray-800'>포함된 혜택:</h3>
              {[
                '무제한 프리미엄 기능',
                '광고 없는 깔끔한 경험',
                '30일 무료 체험',
                '우선 고객 지원',
                '새로운 기능 우선 접근',
              ].map((benefit, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <span className='text-lg text-green-500'>✓</span>
                  <span className='text-gray-700'>{benefit}</span>
                </div>
              ))}
            </div>

            {/* 결제 수단 정보 */}
            <div className='rounded-xl bg-gray-50 p-4'>
              <h3 className='mb-2 font-bold text-gray-800'>결제 수단</h3>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white'>
                  💳
                </div>
                <div>
                  <div className='font-medium text-gray-800'>
                    {paymentMethod.method === 'card'
                      ? '신용/체크카드'
                      : 'PayPal'}
                  </div>
                  <div className='text-sm text-gray-600'>
                    등록일:{' '}
                    {new Date(paymentMethod.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결제 버튼 */}
        <div className='space-y-4'>
          <Button
            size='lg'
            className='w-full transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-6 text-xl font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100'
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex items-center gap-3'>
                <div className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                결제 처리 중...
              </div>
            ) : (
              <div className='flex items-center justify-center gap-2'>
                <span>지금 $1로 시작하기</span>
                <span className='text-2xl'>🚀</span>
              </div>
            )}
          </Button>

          <div className='text-center'>
            <button
              onClick={() => router.back()}
              className='text-sm text-gray-500 transition-colors hover:text-gray-700'
              disabled={isLoading}
            >
              ← 이전 단계로 돌아가기
            </button>
          </div>
        </div>

        {/* 보장 정보 */}
        <div className='rounded-2xl bg-white p-6 shadow-lg'>
          <div className='space-y-3 text-center'>
            <div className='text-2xl'>🛡️</div>
            <h3 className='text-lg font-bold text-gray-800'>100% 만족 보장</h3>
            <div className='grid gap-4 text-sm text-gray-600 sm:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <span className='text-green-500'>✓</span>
                <span>30일 무료 체험</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-green-500'>✓</span>
                <span>언제든 취소 가능</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-green-500'>✓</span>
                <span>즉시 환불 보장</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-green-500'>✓</span>
                <span>안전한 결제 처리</span>
              </div>
            </div>
            <p className='mt-4 text-xs text-gray-500'>
              마음에 들지 않으시면 언제든 취소하세요. 위약금이나 수수료는
              없습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
