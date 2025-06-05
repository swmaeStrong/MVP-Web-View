'use client'
import { useRouter } from 'next/navigation'
import { Badge } from '../../../shadcn/ui/badge'
import { Button } from '../../../shadcn/ui/button'
import { Card, CardContent } from '../../../shadcn/ui/card'

const paymentMethods = [
  {
    id: 'card1',
    brand: '신한카드',
    last4: '1234',
    isDefault: true,
    type: '신용카드',
    icon: '💳',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'card2',
    brand: '국민카드',
    last4: '5678',
    isDefault: false,
    type: '체크카드',
    icon: '💰',
    color: 'from-green-500 to-green-600',
  },
]

export const paymentMethodPage = () => {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-4 lg:p-8'>
      <div className='mx-auto max-w-7xl space-y-6 sm:space-y-8'>
        {/* 헤더 영역 */}
        <div className='pt-4 text-center sm:pt-8'>
          <h1 className='mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent sm:mb-4 sm:text-3xl lg:text-4xl'>
            💳 내 결제수단
          </h1>
          <p className='mb-4 px-4 text-base text-gray-600 sm:mb-8 sm:text-lg lg:text-xl'>
            등록된 결제수단을 관리하고 새로운 카드를 추가하세요
          </p>
        </div>

        {/* 결제수단 카드들 */}
        <div className='space-y-4 sm:space-y-6'>
          {paymentMethods.map((method, index) => (
            <Card
              key={method.id}
              className='sm:hover:shadow-3xl relative overflow-hidden rounded-2xl border-0 bg-white p-4 shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl sm:rounded-3xl sm:p-6 sm:shadow-2xl sm:hover:scale-[1.02]'
            >
              {/* 배경 그래디언트 */}
              <div className='absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5'></div>

              <CardContent className='relative p-0'>
                {/* 모바일: 세로 배치, 태블릿+: 가로 배치 */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6'>
                  {/* 카드 아이콘 */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r sm:h-14 sm:w-14 sm:rounded-2xl lg:h-16 lg:w-16 ${method.color} flex-shrink-0 text-xl text-white shadow-lg sm:text-2xl`}
                  >
                    {method.icon}
                  </div>

                  {/* 카드 정보 */}
                  <div className='min-w-0 flex-1'>
                    <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
                      <h3 className='truncate text-lg font-bold text-gray-800 sm:text-xl'>
                        {method.brand}
                      </h3>
                      {method.isDefault && (
                        <Badge
                          variant='default'
                          className='self-start rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-1 text-xs font-semibold text-white shadow-lg sm:self-auto sm:px-3'
                        >
                          ⭐ 기본 카드
                        </Badge>
                      )}
                    </div>

                    <div className='flex flex-col gap-2 text-gray-600 sm:flex-row sm:items-center sm:gap-4'>
                      <span className='font-mono text-base sm:text-lg'>
                        **** **** **** {method.last4}
                      </span>
                      <span className='self-start rounded-full bg-gray-100 px-2 py-1 text-xs sm:self-auto sm:px-3 sm:text-sm'>
                        {method.type}
                      </span>
                    </div>
                  </div>

                  {/* 상세 버튼 */}
                  <div className='flex sm:flex-shrink-0'>
                    <Button
                      size='default'
                      variant='secondary'
                      className='w-full rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-200 hover:shadow-lg sm:w-auto sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base'
                      onClick={() => {
                        router.push(
                          `/subscription/payment-methods/${method.id}`
                        )
                      }}
                    >
                      상세 보기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 새 카드 추가 버튼 */}
        <Card className='relative rounded-2xl border-2 border-dashed border-purple-300 bg-white/50 p-6 transition-all duration-300 hover:border-purple-400 hover:bg-white/80 sm:rounded-3xl sm:p-8'>
          <CardContent className='flex flex-col items-center gap-4 p-0'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-2xl text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl lg:h-16 lg:w-16'>
              ➕
            </div>
            <div className='text-center'>
              <h3 className='mb-2 text-lg font-bold text-gray-800 sm:text-xl'>
                새 결제수단 추가
              </h3>
              <p className='mb-4 px-2 text-sm text-gray-600 sm:text-base'>
                신용카드, 체크카드를 간편하게 등록하세요
              </p>
            </div>
            <Button
              size='lg'
              className='w-full transform rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl sm:w-auto sm:rounded-2xl sm:px-8 sm:text-lg'
              onClick={() => router.push('/subscription/payment-methods/new')}
            >
              💳 카드 추가하기
            </Button>
          </CardContent>
        </Card>

        {/* 안내 메시지 */}
        <div className='rounded-xl border border-purple-200 bg-gradient-to-r from-purple-100 to-blue-100 p-4 sm:rounded-2xl sm:p-6'>
          <h3 className='mb-3 flex items-center gap-2 text-base font-semibold text-gray-800 sm:text-lg'>
            🔒 안전한 결제 환경
          </h3>
          <ul className='space-y-2 text-sm text-gray-700 sm:text-base'>
            <li className='flex items-start gap-2'>
              <span className='mt-0.5 text-green-500'>✓</span>
              <span>모든 카드 정보는 암호화되어 안전하게 보관됩니다</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-0.5 text-green-500'>✓</span>
              <span>PCI DSS 보안 표준을 준수합니다</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-0.5 text-green-500'>✓</span>
              <span>언제든지 결제수단을 변경하거나 삭제할 수 있습니다</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default paymentMethodPage
