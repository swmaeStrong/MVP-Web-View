'use client'
import * as PortOne from '@portone/browser-sdk/v2'
import { useState } from 'react'
import {
  APP_URL,
  KAKAOPAY_CHANNEL_KEY,
  PORTONE_STORE_ID,
  TOSS_CHANNEL_KEY,
} from '../../shared/configs/api/url'

type PaymentProvider = 'TOSS' | 'KAKAOPAY'

interface ProviderInfo {
  name: string
  channelKey: string
  method: string
  description: string
  icon: string
  recommended?: boolean
}

interface BillingKeyRequest {
  storeId: string
  channelKey: string
  billingKeyMethod: string
  issueId: string
  issueName: string
  customer: {
    fullName: string
    phoneNumber: string
    email: string
  }
  redirectUrl: string
  easyPayProvider?: string
}

const PROVIDERS: Record<PaymentProvider, ProviderInfo> = {
  TOSS: {
    name: '토스페이먼츠',
    channelKey: TOSS_CHANNEL_KEY || '',
    method: 'CARD' as const,
    description: '깔끔한 UI, 빠른 처리',
    icon: '💙',
    recommended: true,
  },
  KAKAOPAY: {
    name: '카카오페이',
    channelKey: KAKAOPAY_CHANNEL_KEY || '',
    method: 'EASY_PAY' as const,
    description: '간편결제, 카톡으로 결제',
    icon: '💛',
    recommended: true,
  },
}

export default function Home() {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [paymentResult, setPaymentResult] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>('KAKAOPAY')

  const handlePayment = async () => {
    setIsPaymentLoading(true)
    setPaymentResult(null)

    try {
      const provider = PROVIDERS[selectedProvider]
      console.log(PORTONE_STORE_ID)
      console.log(provider.channelKey)
      console.log(provider.method)

      // 환경 변수 검증
      if (!PORTONE_STORE_ID || !provider.channelKey) {
        setPaymentResult('환경 변수가 올바르게 설정되지 않았습니다.')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          easyPayProvider: selectedProvider,
        }),
      }

      const response = await PortOne.requestIssueBillingKey(billingKeyRequest)

      if (!response) {
        setPaymentResult('빌링키 발급 응답을 받지 못했습니다.')
        return
      }

      console.log('빌링키 발급 응답:', response)

      if (response.code != null) {
        setPaymentResult(`빌링키 발급 실패: ${response.message}`)
      } else {
        setPaymentResult(`빌링키 발급 성공!`)
        console.log('발급된 빌링키:', response.billingKey)
      }
    } catch (error) {
      console.error('빌링키 발급 오류:', error)
      setPaymentResult('빌링키 발급 중 오류가 발생했습니다.')
    } finally {
      setIsPaymentLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#1C1C1E] p-6 text-white'>
      <div className='w-full max-w-md rounded-2xl bg-[#2C2C2E] p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-blue-200'>Fossistant</h1>
          <p className='text-gray-400'>오픈소스 기여 도우미</p>
          {/* 개발 환경에서만 환경 정보 표시 */}
        </div>

        <div className='mb-6 rounded-xl border border-[#2d2d30] bg-[#232326] p-6'>
          <h2 className='mb-4 text-xl font-semibold'>프리미엄 구독</h2>
          <div className='mb-4 space-y-3'>
            <div className='flex items-center justify-between'>
              <span>✨ 무제한 이슈 분석</span>
              <span className='text-green-400'>✓</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>🎯 개인 맞춤 추천</span>
              <span className='text-green-400'>✓</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>📊 상세 통계 및 리포트</span>
              <span className='text-green-400'>✓</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>🚀 우선 기술 지원</span>
              <span className='text-green-400'>✓</span>
            </div>
          </div>
          <hr className='mb-4 border-gray-600' />
          <div className='flex items-center justify-between text-lg font-bold'>
            <span>월 구독료</span>
            <span className='text-blue-300'>₩9,900</span>
          </div>
        </div>

        {/* 결제 수단 선택 */}
        <div className='mb-6'>
          <h3 className='mb-3 text-lg font-semibold'>간편 결제 수단 선택</h3>
          <div className='space-y-3'>
            {(
              Object.entries(PROVIDERS) as [PaymentProvider, ProviderInfo][]
            ).map(([key, provider]) => (
              <button
                key={key}
                onClick={() => setSelectedProvider(key)}
                className={`relative w-full rounded-xl p-4 text-left transition-all ${
                  selectedProvider === key
                    ? 'border-2 border-blue-400 bg-blue-600 shadow-lg'
                    : 'border border-[#2d2d30] bg-[#232326] hover:border-gray-500 hover:bg-[#2a2a2c]'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>{provider.icon}</span>
                    <div>
                      <div className='flex items-center gap-2 font-semibold'>
                        {provider.name}
                        {provider.recommended && (
                          <span className='rounded-full bg-yellow-600 px-2 py-1 text-xs text-yellow-100'>
                            추천
                          </span>
                        )}
                      </div>
                      <div className='text-sm text-gray-400'>
                        {provider.description}
                      </div>
                      {/* 개발 환경에서만 채널키 일부 표시 */}
                    </div>
                  </div>
                  {selectedProvider === key && (
                    <span className='text-blue-200'>✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isPaymentLoading}
          className={`w-full rounded-xl py-4 text-lg font-bold transition-all ${
            isPaymentLoading
              ? 'cursor-not-allowed bg-gray-600'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isPaymentLoading
            ? '빌링키 발급 중...'
            : `${PROVIDERS[selectedProvider].icon} ${PROVIDERS[selectedProvider].name}로 구독 시작`}
        </button>

        {paymentResult && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              paymentResult.includes('성공')
                ? 'border border-green-600 bg-green-900 text-green-200'
                : 'border border-red-600 bg-red-900 text-red-200'
            }`}
          >
            {paymentResult}
          </div>
        )}

        <div className='mt-6 text-center text-xs text-gray-500'>
          <p>안전한 결제를 위해 포트원 결제 시스템을 사용합니다.</p>
          <p>결제 정보는 암호화되어 보호됩니다.</p>
          <p className='mt-2 text-yellow-400'>
            💡 간편결제로 빠르고 쉽게 구독하세요!
          </p>
        </div>
      </div>
    </div>
  )
}
