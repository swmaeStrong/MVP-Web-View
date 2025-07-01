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
          <Badge className='mb-4 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
            🚀 1단계: 구독 플랜 선택
          </Badge>
          <h1 className='mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent'>
            프리미엄 구독 플랜
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
              className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl ${
                selectedPlan === plan.id
                  ? `scale-105 border-purple-400 shadow-lg ${getThemeClass('componentSecondary')}`
                  : `${getThemeClass('component')} ${getThemeClass('border')} hover:border-purple-400`
              } ${plan.popular ? 'ring-2 ring-purple-400' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* 인기 배지 */}
              {plan.popular && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                  <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs font-bold text-white'>
                    ⭐ 가장 인기
                  </Badge>
                </div>
              )}

              <CardContent className='p-0'>
                {/* 플랜 이름 */}
                <div className='mb-4 text-center'>
                  <h3 className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                    {plan.name}
                  </h3>
                </div>

                {/* 가격 정보 */}
                <div className='mb-6 text-center'>
                  <div className='flex items-baseline justify-center gap-1'>
                    <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent'>
                      ₩{plan.price.toLocaleString()}
                    </span>
                    <span className={`text-lg ${getThemeTextColor('secondary')}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${getThemeTextColor('secondary')} line-through`}>
                    원래 ₩{plan.originalPrice.toLocaleString()}/{plan.period}
                  </p>
                  <div className='mt-2 inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white'>
                    {plan.discount} 절약
                  </div>
                </div>

                {/* 기능 목록 */}
                <div className='mb-6 space-y-3'>
                  {plan.features.map((feature, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-500'>
                        <span className='text-xs text-white'>✓</span>
                      </div>
                      <span className={`text-sm ${getThemeTextColor('primary')}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 선택 표시 */}
                <div className='text-center'>
                  <div
                    className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selectedPlan === plan.id
                        ? 'border-purple-400 bg-purple-400'
                        : `${getThemeClass('border')} ${getThemeClass('component')}`
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <div className='h-3 w-3 rounded-full bg-white'></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 계속하기 버튼 */}
        <div className='mt-8 text-center'>
          <Button
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={isLoading}
            className='transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                처리 중...
              </div>
            ) : (
              '다음 단계: 결제 수단 등록 →'
            )}
          </Button>
          
          <div className={`mt-4 text-center text-sm ${getThemeTextColor('secondary')}`}>
            <div className='flex items-center justify-center gap-4'>
              <span className='flex items-center gap-1'>
                <span>🔒</span>
                <span>30일 환불 보장</span>
              </span>
              <span className='flex items-center gap-1'>
                <span>💳</span>
                <span>안전한 결제</span>
              </span>
              <span className='flex items-center gap-1'>
                <span>⭐</span>
                <span>4.9/5.0 만족도</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
