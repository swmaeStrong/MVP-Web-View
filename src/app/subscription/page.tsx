'use client';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

// 결제 수단 상태를 시뮬레이션하는 더미 데이터
const checkPaymentMethods = () => {
  // 실제로는 API 호출이나 로컬 스토리지 확인
  const savedPaymentMethods = localStorage.getItem('paymentMethods');
  return savedPaymentMethods ? JSON.parse(savedPaymentMethods) : [];
};

const SubscriptionPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { getThemeClass, getThemeTextColor } = useTheme();

  useEffect(() => {
    // 페이지 로드 시 결제 수단 확인
    setPaymentMethods(checkPaymentMethods());
  }, []);

  // 구독 플랜 데이터
  const subscriptionPlans = [
    {
      id: 'basic',
      name: '베이직',
      price: 9900,
      originalPrice: 19900,
      period: '월',
      discount: '50%',
      features: [
        '기본 프리미엄 기능',
        '광고 제거',
        '7일 무료 체험'
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: '프리미엄',
      price: 4900,
      originalPrice: 29900,
      period: '월',
      discount: '84%',
      features: [
        '모든 프리미엄 기능',
        '광고 없는 깔끔한 경험',
        '30일 무료 체험',
        '우선 고객 지원'
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: '엔터프라이즈',
      price: 19900,
      originalPrice: 49900,
      period: '월',
      discount: '60%',
      features: [
        '무제한 모든 기능',
        '팀 협업 도구',
        '고급 분석 기능',
        '24/7 전담 지원'
      ],
      popular: false,
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState('premium');

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);

    try {
      // 선택된 플랜 정보를 세션에 저장
      sessionStorage.setItem('selectedPlan', planId);
      
      // 결제 수단 등록 페이지로 이동 (step 2)
      router.push('/subscription/payment-method?from=subscription');
    } catch (error) {
      console.error('구독 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 ${getThemeClass('background')}`}>
      <div className='mx-auto max-w-6xl'>
        {/* 헤더 */}
        <div className='mb-8 text-center'>
          <h1 className={`mb-4 text-3xl font-bold ${getThemeTextColor('primary')}`}>
            구독 플랜
          </h1>
          <p className={`text-lg ${getThemeTextColor('secondary')}`}>
            프리미엄 기능을 체험하고 생산성을 높이세요
          </p>
        </div>

        {/* 플랜 카드들 */}
        <div className='grid gap-6 md:grid-cols-3'>
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                selectedPlan === plan.id
                  ? `${getThemeClass('componentSecondary')} shadow-md`
                  : `${getThemeClass('component')} ${getThemeClass('border')} hover:shadow-sm`
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* 인기 표시 (미니멀) */}
              {plan.popular && (
                <div className='absolute -top-2 right-3'>
                  <div className={`text-xs px-2 py-1 rounded ${getThemeTextColor('primary')}`}>
                    인기
                  </div>
                </div>
              )}

              <CardContent className='p-0'>
                {/* 플랜 이름 */}
                <div className='mb-3 text-center'>
                  <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
                    {plan.name}
                  </h3>
                </div>

                {/* 가격 정보 */}
                <div className='mb-4 text-center'>
                  <div className='flex items-baseline justify-center gap-1'>
                    <span className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                      ₩{plan.price.toLocaleString()}
                    </span>
                    <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-xs ${getThemeTextColor('secondary')} line-through mt-1`}>
                    ₩{plan.originalPrice.toLocaleString()}
                  </p>
                </div>

                {/* 기능 목록 */}
                <div className='mb-4 space-y-2'>
                  {plan.features.map((feature, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <span className={`text-xs ${getThemeTextColor('primary')}`}>•</span>
                      <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 선택 표시 */}
                <div className='text-center'>
                  <div
                    className={`mx-auto flex h-4 w-4 items-center justify-center rounded-full border ${
                      selectedPlan === plan.id
                        ? `${getThemeTextColor('primary')} border-current`
                        : `${getThemeClass('border')}`
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <div className={`h-2 w-2 rounded-full ${getThemeTextColor('primary')} bg-current`}></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 계속하기 버튼 */}
        <div className='mt-6 text-center'>
          <Button
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={isLoading}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${getThemeClass('component')} ${getThemeClass('border')} ${getThemeTextColor('primary')} hover:${getThemeClass('componentSecondary')} disabled:opacity-50`}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border border-current border-t-transparent'></div>
                처리 중...
              </div>
            ) : (
              '구독하기'
            )}
          </Button>
          
          {/* 이미 구독 중인 경우 정보 표시 */}
          {(() => {
            const subscription = localStorage.getItem('subscription');
            if (subscription) {
              const subData = JSON.parse(subscription);
              return (
                <div className={`mt-4 rounded-lg p-4 ${getThemeClass('componentSecondary')} ${getThemeClass('border')}`}>
                  <p className={`text-sm ${getThemeTextColor('primary')}`}>
                    현재 {subData.plan} 플랜을 구독 중입니다.
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-2 text-red-400 hover:bg-red-400/10'
                    onClick={() => {
                      if (confirm('현재 구독을 취소하시겠습니까?')) {
                        localStorage.removeItem('subscription');
                        window.location.reload();
                      }
                    }}
                  >
                    구독 취소
                  </Button>
                </div>
              );
            }
            return null;
          })()}
          
          <div className={`mt-4 text-center text-xs ${getThemeTextColor('secondary')}`}>
            <p>30일 환불 보장 • 안전한 결제</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
