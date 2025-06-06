'use client';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 결제 수단 상태를 시뮬레이션하는 더미 데이터
const checkPaymentMethods = () => {
  // 실제로는 API 호출이나 로컬 스토리지 확인
  const savedPaymentMethods = localStorage.getItem('paymentMethods');
  return savedPaymentMethods ? JSON.parse(savedPaymentMethods) : [];
};

export const subscriptionPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    // 페이지 로드 시 결제 수단 확인
    setPaymentMethods(checkPaymentMethods());
  }, []);

  const coreFeatures = [
    '무제한 프리미엄 기능',
    '광고 없는 깔끔한 경험',
    '30일 무료 체험',
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      // 결제 수단 재확인
      const currentPaymentMethods = checkPaymentMethods();

      if (currentPaymentMethods.length > 0) {
        // 결제 수단이 있는 경우: 바로 결제 진행
        router.push('/subscription/checkout');
      } else {
        // 결제 수단이 없는 경우: 결제 수단 등록 페이지로 이동
        router.push('/subscription/payment-method?from=subscription');
      }
    } catch (error) {
      console.error('구독 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPaymentMethod = paymentMethods.length > 0;

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

            {/* 결제 수단 상태 표시 */}
            {hasPaymentMethod && (
              <div className='rounded-xl border border-green-200 bg-green-50 p-3'>
                <div className='flex items-center gap-2 text-green-700'>
                  <span className='text-green-500'>✓</span>
                  <span className='text-sm font-medium'>
                    결제 수단이 등록되어 있습니다
                  </span>
                </div>
                <p className='mt-1 text-xs text-green-600'>
                  클릭 한 번으로 바로 구독이 시작됩니다!
                </p>
              </div>
            )}

            {/* 결제 버튼 */}
            <Button
              size='lg'
              className='w-full transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100'
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  처리 중...
                </div>
              ) : hasPaymentMethod ? (
                '지금 바로 구독하기 🚀'
              ) : (
                '구독 시작하기 🚀'
              )}
            </Button>

            {/* 진행 단계 안내 */}
            {!hasPaymentMethod && (
              <div className='rounded-xl border border-blue-200 bg-blue-50 p-3'>
                <div className='text-sm text-blue-700'>
                  <div className='mb-1 font-medium'>
                    📋 간단한 2단계로 완료!
                  </div>
                  <div className='space-y-1 text-xs'>
                    <div>1️⃣ 결제 수단 등록 (30초)</div>
                    <div>2️⃣ 구독 확인 및 완료</div>
                  </div>
                </div>
              </div>
            )}

            {/* 간단한 보증 */}
            <p className='text-center text-sm text-gray-500'>
              언제든 취소 가능 • 30일 무료 체험 • 안전한 결제
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

          {/* 고객 만족도 */}
          <div className='mt-4 text-center'>
            <div className='mb-1 flex justify-center'>
              {[...Array(5)].map((_, i) => (
                <span key={i} className='text-lg text-yellow-400'>
                  ⭐
                </span>
              ))}
            </div>
            <p className='text-xs text-gray-500'>10,000+ 명의 만족한 고객들</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default subscriptionPage;
