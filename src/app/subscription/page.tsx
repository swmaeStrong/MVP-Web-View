'use client';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 결제 수단 상태를 시뮬레이션하는 더미 데이터
const checkPaymentMethods = () => {
  // 실제로는 API 호출이나 로컬 스토리지 확인
  if (typeof window !== 'undefined') {
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    return savedPaymentMethods ? JSON.parse(savedPaymentMethods) : [];
  }
  return [];
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
        '무제한 세션 생성',
        '다크모드 지원',
        '기본 통계 분석',
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
        '무제한 세션 생성 & 저장',
        '다크모드 지원',
        'AI 기반 생산성 분석',
        'LLM 프롬프팅을 통한 맞춤형 인사이트',
        '고급 시간 추적 및 리포트',
        '우선 고객 지원',
        '30일 무료 체험'
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
        '팀 구성 및 협업 가능',
        '무제한 모든 기능',
        'AI 기반 팀 생산성 분석',
        'LLM 프롬프팅 고급 분석',
        '실시간 팀 대시보드',
        '관리자 권한 설정',
        'API 연동 지원',
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
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedPlan', planId);
      }
      
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
            AI 기반 스마트 생산성 추적으로 개발 효율성을 극대화하세요
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
                  <div className={`mb-2 rounded p-2 ${getThemeClass('componentSecondary')}`}>
                    <div className='flex items-baseline justify-center gap-1'>
                      <span className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                        ₩{plan.price.toLocaleString()}
                      </span>
                      <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                        /{plan.period}
                      </span>
                    </div>
                    <p className={`text-xs ${getThemeTextColor('secondary')} line-through mt-1`}>
                      정가: ₩{plan.originalPrice.toLocaleString()}
                    </p>
                    <p className='text-xs text-red-500 font-medium mt-1'>
                      {plan.discount} 할인
                    </p>
                  </div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                    <p>• 부가세 포함 가격</p>
                    <p>• 매월 자동 결제</p>
                  </div>
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
            if (typeof window !== 'undefined') {
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
                          if (typeof window !== 'undefined') {
                            localStorage.removeItem('subscription');
                            window.location.reload();
                          }
                        }
                      }}
                    >
                      구독 취소
                    </Button>
                  </div>
                );
              }
            }
            return null;
          })()}
          
          {/* 교환/환불 규정 */}
          <div className={`mt-6 rounded-lg border p-4 ${getThemeClass('component')} ${getThemeClass('border')}`}>
            <h3 className={`mb-3 text-sm font-semibold ${getThemeTextColor('primary')}`}>교환/환불 규정</h3>
            <div className={`space-y-2 text-xs ${getThemeTextColor('secondary')}`}>
              <div>
                <span className='font-medium'>서비스 제공 기간:</span> 온라인 상품 구매 후 바로 사용 가능
              </div>
              <div>
                <span className='font-medium'>환불 가능 기간:</span> 서비스 이용 시작일로부터 7일 이내
              </div>
              <div>
                <span className='font-medium'>환불 조건:</span> 서비스를 이용하지 않은 경우에 한해 전액 환불
              </div>
              <div>
                <span className='font-medium'>환불 처리 기간:</span> 환불 신청 후 3~5영업일 이내
              </div>
              <div>
                <span className='font-medium'>환불 방법:</span> 결제한 수단으로 자동 환불
              </div>
              <div>
                <span className='font-medium'>교환:</span> 디지털 서비스 특성상 교환 불가
              </div>
              <div>
                <span className='font-medium'>문의:</span> 고객센터 support@pawcus.com
              </div>
            </div>
          </div>

          <div className={`mt-4 text-center text-xs ${getThemeTextColor('secondary')}`}>
            <p>7일 환불 보장 • 안전한 결제 • 개인정보보호</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
