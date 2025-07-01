'use client';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { getKSTDate } from '@/utils/timezone';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface PaymentMethod {
  method: string;
  createdAt: string;
}

interface PlanData {
  name: string;
  price: number;
  features: string[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { getThemeClass } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);

  useEffect(() => {
    // 선택된 플랜 정보 가져오기 (sessionStorage에서)
    const planData = sessionStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    } else {
      // 기본 플랜 설정
      setSelectedPlan({
        name: 'Premium',
        price: 1,
        features: ['무제한 프리미엄 기능', '광고 없는 경험', '우선 고객 지원']
      });
    }

    // 결제 수단 확인
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    if (!savedPaymentMethods) {
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
        plan: selectedPlan?.name.toLowerCase() || 'premium',
        price: selectedPlan?.price || 1,
        startDate: getKSTDate().toISOString(),
        paymentMethod: paymentMethod?.method,
        status: 'active',
      };
      localStorage.setItem('subscription', JSON.stringify(subscriptionData));

      // 성공 상태로 변경 (별도 페이지로 이동하지 않음)
      setIsSuccess(true);
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentMethod || !selectedPlan) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${getThemeClass('background')}`}>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent'></div>
          <p className={getThemeClass('textSecondary')}>결제 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 성공 메시지 표시
  if (isSuccess) {
    return (
      <div className={`min-h-screen ${getThemeClass('background')} p-4 sm:p-6 lg:p-8`}>
        <div className='mx-auto max-w-2xl space-y-6 text-center'>
          <div className='space-y-4'>
            <div className='text-6xl'>🎉</div>
            <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
              구독 완료!
            </h1>
            <p className={`text-lg ${getThemeClass('textSecondary')} sm:text-xl`}>
              {selectedPlan.name} 플랜이 성공적으로 활성화되었습니다.
            </p>
          </div>
          
          <Card className={`rounded-2xl border-0 ${getThemeClass('component')} p-6 shadow-xl`}>
            <CardContent className='space-y-4 p-0'>
              <div className='text-center'>
                <h3 className={`text-xl font-bold ${getThemeClass('textPrimary')}`}>
                  {selectedPlan.name} 플랜 활성화
                </h3>
                <p className={`text-2xl font-bold text-green-600`}>
                  ${selectedPlan.price}/월
                </p>
              </div>
              <div className='space-y-2'>
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <span className='text-lg text-green-500'>✓</span>
                    <span className={getThemeClass('textSecondary')}>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='space-y-4'>
            <Button
              size='lg'
              className='w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-6 text-xl font-bold text-white shadow-xl hover:from-purple-700 hover:to-blue-700'
              onClick={() => router.push('/home')}
            >
              메인으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeClass('background')} p-4 sm:p-6 lg:p-8`}>
      <div className='mx-auto max-w-2xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='space-y-4 text-center'>
          <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
            🚀 구독 진행 중 • 3단계 중 3단계
          </Badge>

          <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            🎉 최종 결제
          </h1>
          <p className={`text-lg ${getThemeClass('textSecondary')} sm:text-xl`}>
            마지막 단계입니다! 구독을 완료해보세요
          </p>
        </div>

        {/* 3단계 진행 표시 */}
        <div className={`rounded-2xl ${getThemeClass('component')} p-4 shadow-lg`}>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 text-green-600'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white'>
                ✓
              </div>
              <span className='font-medium'>플랜 선택</span>
            </div>
            <div className='mx-2 h-1 flex-1 rounded-full bg-green-500'></div>
            <div className='flex items-center gap-2 text-green-600'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white'>
                ✓
              </div>
              <span className='font-medium'>결제 수단</span>
            </div>
            <div className='mx-2 h-1 flex-1 rounded-full bg-purple-500'></div>
            <div className='flex items-center gap-2 text-purple-600'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white'>
                3
              </div>
              <span className='font-medium'>구독 완료</span>
            </div>
          </div>
        </div>

        {/* 선택된 플랜 정보 */}
        <Card className={`rounded-2xl border-0 ${getThemeClass('component')} p-6 shadow-xl`}>
          <CardContent className='space-y-4 p-0'>
            <div className='text-center'>
              <h2 className={`mb-2 text-2xl font-bold ${getThemeClass('textPrimary')}`}>
                {selectedPlan.name} 플랜
              </h2>
              <div className='mb-4 flex items-end justify-center gap-2'>
                <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent'>
                  ${selectedPlan.price}
                </span>
                <span className='mb-2 text-lg text-gray-600'>/월</span>
              </div>
            </div>

            {/* 혜택 목록 */}
            <div className='space-y-2'>
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <span className='text-lg text-green-500'>✓</span>
                  <span className={getThemeClass('textSecondary')}>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 결제 수단 정보 */}
        <Card className={`rounded-2xl border-0 ${getThemeClass('component')} p-6 shadow-xl`}>
          <CardContent className='space-y-4 p-0'>
            <h3 className={`text-lg font-bold ${getThemeClass('textPrimary')}`}>결제 수단</h3>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white'>
                💳
              </div>
              <div>
                <div className={`font-medium ${getThemeClass('textPrimary')}`}>
                  {paymentMethod.method === 'card' ? '신용/체크카드' : 'PayPal'}
                </div>
                <div className={`text-sm ${getThemeClass('textSecondary')}`}>
                  등록일: {new Date(paymentMethod.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최종 결제 버튼 */}
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
                <span>지금 ${selectedPlan.price}로 시작하기</span>
                <span className='text-2xl'>🚀</span>
              </div>
            )}
          </Button>

          <div className='text-center'>
            <button
              onClick={() => router.back()}
              className={`text-sm ${getThemeClass('textSecondary')} transition-colors hover:opacity-80`}
              disabled={isLoading}
            >
              ← 이전 단계로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
