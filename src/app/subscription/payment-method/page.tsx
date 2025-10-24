'use client';
import * as PortOne from '@portone/browser-sdk/v2';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

import {
  APP_URL,
  KAKAO_PAY_CHANNEL_KEY,
  NICE_PAY_CHANNEL_KEY,
  PORTONE_STORE_ID,
} from '@/config/api/url';
import { useNavigation } from '@/hooks/navigation/useNavigation';
import { useTheme } from '@/hooks/ui/useTheme';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { getKSTDate } from '@/utils/timezone';



// 타입 정의
type PaymentProvider = 'KAKAOPAY' | 'NICEPAY';

interface ProviderInfo {
  name: string;
  channelKey?: string;
  method: string;
  description: string;
  icon: string;
  gradient: string;
  bgGradient: string;
  recommended?: boolean;
}

interface ExistingPaymentMethod {
  id: string;
  type: string;
  last4?: string;
  cardCompany?: string;
  createdAt: string;
}

// useSearchParams를 사용하는 컴포넌트를 분리
function PaymentMethodContent() {
  const { navigateWithParams } = useNavigation();
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingMethods, setExistingMethods] = useState<ExistingPaymentMethod[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const { getThemeClass, getThemeTextColor } = useTheme();

  // 구독 플로우에서 온 건지 확인
  const fromSubscription = searchParams.get('from') === 'subscription';

  // 결제 수단 설정
  const paymentMethods: Record<PaymentProvider, ProviderInfo> = {
    KAKAOPAY: {
      name: '카카오페이',
      channelKey: KAKAO_PAY_CHANNEL_KEY,
      method: 'EASY_PAY',
      description: '간편결제, 카톡으로 결제',
      icon: '💛',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-100',
      recommended: true,
    },
    NICEPAY: {
      name: '나이스페이',
      channelKey: NICE_PAY_CHANNEL_KEY,
      method: 'CARD',
      description: '안전한 카드결제 시스템',
      icon: '💳',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
  };

  // 기존 결제 수단 로드
  useEffect(() => {
    const loadExistingPaymentMethods = () => {
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('paymentMethods');
          if (saved) {
            const methods = JSON.parse(saved);
            setExistingMethods(methods);
            // 기존 결제 수단이 있으면 목록을 표시하고, 없으면 새로 추가하는 화면을 표시
            setShowAddNew(methods.length === 0);
          } else {
            setShowAddNew(true);
          }
        } else {
          setShowAddNew(true);
        }
      } catch (error) {
        console.error('기존 결제 수단을 불러오는 중 오류:', error);
        setShowAddNew(true);
      }
    };

    loadExistingPaymentMethods();
  }, []);

  // 결제 수단 삭제 함수
  const handleDeletePaymentMethod = (methodId: string) => {
    if (confirm('이 결제 수단을 삭제하시겠습니까?')) {
      const updatedMethods = existingMethods.filter(method => method.id !== methodId);
      setExistingMethods(updatedMethods);
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
      }
      
      // 모든 결제 수단이 삭제되면 새로 추가하는 화면으로 전환
      if (updatedMethods.length === 0) {
        setShowAddNew(true);
      }
    }
  };

  // 모든 결제 수단 삭제 함수
  const handleDeleteAllPaymentMethods = () => {
    if (confirm('모든 결제 수단을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      setExistingMethods([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('paymentMethods');
      }
      setShowAddNew(true);
    }
  };

  // 새 결제 수단 추가
  const handleAddNewPaymentMethod = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);

    try {
      const provider = paymentMethods[selectedMethod as PaymentProvider];
      
      // 환경 변수 검증
      if (!PORTONE_STORE_ID || !provider.channelKey) {
        alert('환경 변수가 올바르게 설정되지 않았습니다.');
        return;
      }

      // 빌링키 요청 객체 생성 (홈 페이지와 동일한 방식)
      const billingKeyRequest: any = {
        storeId: PORTONE_STORE_ID,
        channelKey: provider.channelKey,
        billingKeyMethod: provider.method,
        issueId: `billing-${crypto.randomUUID()}`,
        issueName: 'Pawcus 프리미엄 구독',
        customer: {
          fullName: '홍길동',
          phoneNumber: '010-0000-0000',
          email: 'test@example.com',
        },
        redirectUrl: `${APP_URL}/payment/complete`,
        ...(provider.method === 'EASY_PAY' && {
          easyPayProvider: selectedMethod,
        }),
      };

      // 포트원 SDK 호출
      const response = await PortOne.requestIssueBillingKey(billingKeyRequest);

      if (!response) {
        alert('빌링키 발급 응답을 받지 못했습니다.');
        return;
      }

      console.log('빌링키 발급 응답:', response);

      if (response.code != null) {
        alert(`빌링키 발급 실패: ${response.message}`);
      } else {
        // 성공 시 결제 수단 저장
        const newPaymentMethod: ExistingPaymentMethod = {
          id: crypto.randomUUID(),
          type: selectedMethod,
          ...(selectedMethod === 'NICEPAY' && {
            last4: '****',
            cardCompany: '카드사',
          }),
          createdAt: getKSTDate().toISOString(),
        };

        const updatedMethods = [...existingMethods, newPaymentMethod];
        setExistingMethods(updatedMethods);
        if (typeof window !== 'undefined') {
          localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
        }
        
        setShowAddNew(false);
        console.log('발급된 빌링키:', response.billingKey);
        
        // 구독 플로우에서 왔다면 바로 결제로 이동
        if (fromSubscription) {
          navigateWithParams('/subscription/checkout');
        }
      }
    } catch (error) {
      console.error('빌링키 발급 오류:', error);
      alert('결제 수단 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 기존 결제 수단 선택
  const handleExistingMethodSelect = (_methodId: string) => {
    if (fromSubscription) {
      navigateWithParams('/subscription/checkout');
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${getThemeClass('background')}`}>
      <div className='mx-auto max-w-2xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='space-y-4 text-center'>
          {fromSubscription && (
            <div className='mb-4'>
              <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg'>
                🚀 2단계: 결제 수단 선택
              </Badge>
            </div>
          )}

          {/* 선택된 상품 정보 표시 */}
          {fromSubscription && (
            <div className={`mb-6 rounded-lg border p-4 ${getThemeClass('componentSecondary')} ${getThemeClass('border')}`}>
              <h3 className={`mb-2 text-sm font-semibold ${getThemeTextColor('primary')}`}>선택하신 상품</h3>
              <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                <div className='flex justify-between items-center'>
                  <span>Pawcus 프리미엄 구독 (월간)</span>
                  <span className='font-bold'>₩4,900/월</span>
                </div>
                <div className='mt-1 text-xs'>
                  <span>• 매월 자동 결제</span>
                  <span className='ml-2'>• 언제든 취소 가능</span>
                </div>
              </div>
            </div>
          )}

          <h1 className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            💳 결제 수단 선택
          </h1>
          <p className={`text-lg sm:text-xl ${getThemeTextColor('secondary')}`}>
            {fromSubscription
              ? '구독을 위한 결제 수단을 선택해주세요'
              : '안전하고 편리한 결제 방법을 선택하세요'}
          </p>

          {fromSubscription && (
            <div className={`inline-block rounded-xl border p-4 ${getThemeClass('componentSecondary')} ${getThemeClass('border')}`}>
              <div className={`text-sm ${getThemeTextColor('primary')}`}>
                <div className='font-medium'>✨ 거의 다 완료되었어요!</div>
                <div className={`mt-1 text-xs ${getThemeTextColor('secondary')}`}>
                  결제 수단만 선택하면 바로 프리미엄을 이용할 수 있습니다
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 진행 단계 표시 (구독 플로우에서만) */}
        {fromSubscription && (
          <div className={`rounded-2xl p-4 shadow-lg ${getThemeClass('component')} ${getThemeClass('border')}`}>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold text-white'>
                  ✓
                </div>
                <span className={`font-medium ${getThemeTextColor('primary')}`}>플랜 선택</span>
              </div>
              <div className={`mx-2 h-1 flex-1 rounded-full bg-purple-600`}></div>
              <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white'>
                  2
                </div>
                <span className={`font-medium ${getThemeTextColor('primary')}`}>결제 수단</span>
              </div>
              <div className={`mx-2 h-1 flex-1 rounded-full ${getThemeClass('border')}`}></div>
              <div className={`flex items-center gap-2 ${getThemeTextColor('secondary')}`}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`}>
                  3
                </div>
                <span>구독 완료</span>
              </div>
            </div>
          </div>
        )}

        {/* 기존 결제 수단 또는 새 결제 수단 추가 */}
        {!showAddNew ? (
          // 기존 결제 수단 목록
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className={`text-xl font-bold ${getThemeTextColor('primary')}`}>등록된 결제 수단</h2>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={handleDeleteAllPaymentMethods}
                  className={`rounded-xl border-red-400 text-red-400 hover:bg-red-400/10 ${getThemeClass('border')}`}
                >
                  모두 삭제
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setShowAddNew(true)}
                  className={`rounded-xl border-purple-400 text-purple-400 hover:bg-purple-400/10 ${getThemeClass('border')}`}
                >
                  + 새 결제 수단 추가
                </Button>
              </div>
            </div>
            
            <div className='grid gap-4'>
              {existingMethods.map(method => (
                <Card
                  key={method.id}
                  className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:border-purple-400 hover:shadow-lg ${getThemeClass('component')} ${getThemeClass('border')}`}
                  onClick={() => handleExistingMethodSelect(method.id)}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-4'>
                      <div className='h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl text-white'>
                        {method.type === 'KAKAOPAY' ? '💛' : '💳'}
                      </div>
                      
                      <div className='flex-1'>
                        <h3 className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
                          {method.type === 'KAKAOPAY' ? '카카오페이' : 
                           method.type === 'NICEPAY' ? '나이스페이' : '신용/체크카드'}
                        </h3>
                        <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                          {method.last4 ? `****-****-****-${method.last4}` : 
                           method.type === 'KAKAOPAY' ? '간편결제' : '카드결제'}
                        </p>
                        <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                          등록일: {new Date(method.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePaymentMethod(method.id);
                          }}
                          className='text-red-400 hover:text-red-500 hover:bg-red-400/10'
                        >
                          삭제
                        </Button>
                        <div className='text-purple-400'>
                          <span className='text-sm'>선택하기 →</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // 새 결제 수단 선택
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className={`text-xl font-bold ${getThemeTextColor('primary')}`}>새 결제 수단 추가</h2>
              {existingMethods.length > 0 && (
                <Button
                  variant='outline'
                  onClick={() => setShowAddNew(false)}
                  className={`rounded-xl text-gray-400 hover:bg-gray-400/10 ${getThemeClass('border')}`}
                >
                  ← 기존 결제 수단 보기
                </Button>
              )}
            </div>
            
            <div className='grid gap-4 sm:gap-6'>
              {(Object.entries(paymentMethods) as [PaymentProvider, ProviderInfo][]).map(([key, method]) => (
                <Card
                  key={key}
                  className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:shadow-xl sm:rounded-3xl ${
                    selectedMethod === key
                      ? `scale-105 border-purple-400 shadow-lg ${getThemeClass('componentSecondary')}`
                      : `${getThemeClass('component')} ${getThemeClass('border')} hover:border-purple-400`
                  }`}
                  onClick={() => setSelectedMethod(key)}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br sm:rounded-3xl ${
                      selectedMethod === key
                        ? getThemeClass('componentSecondary')
                        : getThemeClass('component')
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
                        <div className='flex items-center gap-2'>
                          <h3 className={`mb-2 text-xl font-bold sm:text-2xl ${getThemeTextColor('primary')}`}>
                            {method.name}
                          </h3>
                          {method.recommended && (
                            <span className='rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-1 text-xs text-white'>
                              추천
                            </span>
                          )}
                        </div>
                        <p className={`text-sm sm:text-base ${getThemeTextColor('secondary')}`}>
                          {method.description}
                        </p>
                      </div>

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          selectedMethod === key
                            ? 'border-purple-400 bg-purple-400'
                            : `${getThemeClass('border')} ${getThemeClass('component')}`
                        }`}
                      >
                        {selectedMethod === key && (
                          <div className='h-3 w-3 rounded-full bg-white'></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 계속하기 버튼 */}
        {showAddNew && (
          <div className='space-y-4'>
            <Button
              size='lg'
              className='w-full transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100'
              onClick={handleAddNewPaymentMethod}
              disabled={!selectedMethod || isLoading}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  빌링키 발급 중...
                </div>
              ) : fromSubscription ? (
                selectedMethod ? (
                  '결제 수단 등록하고 구독하기 🚀'
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
                  onClick={() => window.history.back()}
                  className={`text-sm transition-colors hover:text-purple-400 ${getThemeTextColor('secondary')}`}
                >
                  ← 이전 단계로 돌아가기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 보안 정보 */}
        <div className={`rounded-2xl p-6 shadow-lg ${getThemeClass('component')} ${getThemeClass('border')}`}>
          <div className='space-y-3 text-center'>
            <div className='text-2xl'>🔒</div>
            <h3 className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
              안전한 결제 보장
            </h3>
            <div className={`grid gap-4 text-sm sm:grid-cols-3 ${getThemeTextColor('secondary')}`}>
              <div className='flex items-center gap-2'>
                <span className='text-purple-400'>✓</span>
                <span>256비트 SSL 암호화</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-purple-400'>✓</span>
                <span>개인정보 보호</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-purple-400'>✓</span>
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
    <div className='min-h-screen bg-[#383838] p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-2xl space-y-6 sm:space-y-8'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto h-12 w-64 animate-pulse rounded-lg bg-gray-600'></div>
          <div className='mx-auto h-6 w-96 animate-pulse rounded bg-gray-700'></div>
        </div>
        <div className='grid gap-4 sm:gap-6'>
          {[1, 2].map(i => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-2xl bg-gray-700'
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
