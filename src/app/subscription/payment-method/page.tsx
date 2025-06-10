'use client';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { getKSTDate } from '@/utils/timezone';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

// useSearchParams를 사용하는 컴포넌트를 분리
function PaymentMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 구독 플로우에서 온 건지 확인
  const fromSubscription = searchParams.get('from') === 'subscription';

  const paymentMethods = [
    {
      id: 'card',
      name: '신용/체크카드',
      icon: '💳',
      description: '가장 안전하고 빠른 결제',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '💰',
      description: 'PayPal 계정으로 간편 결제',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-100',
    },
  ];

  const handleMethodSelect = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);

    try {
      // 결제 수단 저장 시뮬레이션 (한국 시간대 기준)
      const paymentData = {
        method: selectedMethod,
        createdAt: getKSTDate().toISOString(),
      };
      localStorage.setItem('paymentMethods', JSON.stringify([paymentData]));

      // 구독 플로우에서 왔다면 바로 결제로, 아니면 성공 페이지로
      if (fromSubscription) {
        router.push('/subscription/checkout');
      } else {
        router.push('/subscription/payment-method/success');
      }
    } catch (error) {
      console.error('결제 수단 등록 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-2xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='space-y-4 text-center'>
          {fromSubscription && (
            <div className='mb-4'>
              <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
                🚀 구독 진행 중 • 2단계 중 1단계
              </Badge>
            </div>
          )}

          <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            💳 결제 수단 선택
          </h1>
          <p className='text-lg text-gray-600 sm:text-xl'>
            {fromSubscription
              ? '구독을 위한 결제 수단을 선택해주세요'
              : '안전하고 편리한 결제 방법을 선택하세요'}
          </p>

          {fromSubscription && (
            <div className='inline-block rounded-xl border border-green-200 bg-green-50 p-4'>
              <div className='text-sm text-green-700'>
                <div className='font-medium'>✨ 거의 다 완료되었어요!</div>
                <div className='mt-1 text-xs'>
                  결제 수단만 선택하면 바로 프리미엄을 이용할 수 있습니다
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 진행 단계 표시 (구독 플로우에서만) */}
        {fromSubscription && (
          <div className='rounded-2xl bg-white p-4 shadow-lg'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2 text-purple-600'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white'>
                  1
                </div>
                <span className='font-medium'>결제 수단 등록</span>
              </div>
              <div className='mx-4 h-1 flex-1 rounded-full bg-gray-200'>
                <div className='h-full w-1/2 rounded-full bg-purple-600'></div>
              </div>
              <div className='flex items-center gap-2 text-gray-400'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500'>
                  2
                </div>
                <span>구독 완료</span>
              </div>
            </div>
          </div>
        )}

        {/* 결제 수단 선택 */}
        <div className='grid gap-4 sm:gap-6'>
          {paymentMethods.map(method => (
            <Card
              key={method.id}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:shadow-xl sm:rounded-3xl ${
                selectedMethod === method.id
                  ? 'scale-105 border-purple-400 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br sm:rounded-3xl ${
                  selectedMethod === method.id
                    ? method.bgGradient
                    : 'from-white to-gray-50'
                }`}
              ></div>

              <CardContent className='relative p-6 sm:p-8'>
                <div className='flex items-center gap-4'>
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-r sm:h-20 sm:w-20 ${method.gradient} flex items-center justify-center text-3xl text-white shadow-lg sm:text-4xl`}
                  >
                    {method.icon}
                  </div>

                  <div className='flex-1'>
                    <h3 className='mb-2 text-xl font-bold text-gray-800 sm:text-2xl'>
                      {method.name}
                    </h3>
                    <p className='text-sm text-gray-600 sm:text-base'>
                      {method.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selectedMethod === method.id
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className='h-3 w-3 rounded-full bg-white'></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 계속하기 버튼 */}
        <div className='space-y-4'>
          <Button
            size='lg'
            className='w-full transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100'
            onClick={handleMethodSelect}
            disabled={!selectedMethod || isLoading}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                등록 중...
              </div>
            ) : fromSubscription ? (
              selectedMethod ? (
                '계속해서 구독하기 🚀'
              ) : (
                '결제 수단을 선택해주세요'
              )
            ) : selectedMethod ? (
              '결제 수단 등록하기'
            ) : (
              '결제 수단을 선택해주세요'
            )}
          </Button>

          {fromSubscription && (
            <div className='text-center'>
              <button
                onClick={() => router.back()}
                className='text-sm text-gray-500 transition-colors hover:text-gray-700'
              >
                ← 이전 단계로 돌아가기
              </button>
            </div>
          )}
        </div>

        {/* 보안 정보 */}
        <div className='rounded-2xl bg-white p-6 shadow-lg'>
          <div className='space-y-3 text-center'>
            <div className='text-2xl'>🔒</div>
            <h3 className='text-lg font-bold text-gray-800'>
              안전한 결제 보장
            </h3>
            <div className='grid gap-4 text-sm text-gray-600 sm:grid-cols-3'>
              <div className='flex items-center gap-2'>
                <span className='text-green-500'>✓</span>
                <span>256비트 SSL 암호화</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-green-500'>✓</span>
                <span>개인정보 보호</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-green-500'>✓</span>
                <span>안전한 결제 처리</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 로딩 fallback 컴포넌트
function PaymentMethodLoading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-2xl space-y-6 sm:space-y-8'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto h-12 w-64 animate-pulse rounded-lg bg-gray-300'></div>
          <div className='mx-auto h-6 w-96 animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='grid gap-4 sm:gap-6'>
          {[1, 2].map(i => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-2xl bg-gray-200'
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 - Suspense로 감싼 구조
export default function PaymentMethodPage() {
  return (
    <Suspense fallback={<PaymentMethodLoading />}>
      <PaymentMethodContent />
    </Suspense>
  );
}
