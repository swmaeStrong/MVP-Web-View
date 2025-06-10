'use client';

import UnderConstruction from '@/components/common/UnderConstruction';

export default function UnderConstructionDemo() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-4xl space-y-8'>
        {/* 헤더 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-3xl font-bold text-gray-800'>
            🚧 공사중 컴포넌트 데모
          </h1>
          <p className='text-gray-600'>
            다양한 크기와 옵션으로 공사중 상태를 표시할 수 있습니다.
          </p>
        </div>

        {/* Small 사이즈 */}
        <section className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Small 사이즈</h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <UnderConstruction
              size='small'
              title='기본'
              message='간단한 공사중 메시지'
            />
            <UnderConstruction
              size='small'
              title='알림'
              message='이 기능은 곧 추가됩니다'
              showAnimation={false}
            />
          </div>
        </section>

        {/* Medium 사이즈 (기본) */}
        <section className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Medium 사이즈 (기본)
          </h2>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <UnderConstruction />
            <UnderConstruction
              title='새로운 기능 준비중'
              message='사용자 경험을 향상시키는 새로운 기능을 개발하고 있습니다. 조금만 기다려주세요!'
            />
          </div>
        </section>

        {/* Large 사이즈 */}
        <section className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Large 사이즈</h2>
          <UnderConstruction
            size='large'
            title='대시보드 업그레이드'
            message='더욱 강력하고 직관적인 대시보드로 업그레이드하고 있습니다. 새로운 기능과 개선된 사용자 인터페이스를 곧 만나보실 수 있습니다.'
          />
        </section>

        {/* 애니메이션 없는 버전 */}
        <section className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            애니메이션 비활성화
          </h2>
          <UnderConstruction
            size='medium'
            title='정적 표시'
            message='성능을 우선시하거나 접근성을 고려할 때 애니메이션을 비활성화할 수 있습니다.'
            showAnimation={false}
          />
        </section>

        {/* 커스텀 메시지 예시들 */}
        <section className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            다양한 사용 사례
          </h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <UnderConstruction
              size='small'
              title='채팅 기능'
              message='실시간 채팅 기능을 개발중입니다'
            />
            <UnderConstruction
              size='small'
              title='모바일 앱'
              message='iOS/Android 앱 출시 예정'
            />
            <UnderConstruction
              size='small'
              title='API 업데이트'
              message='성능 개선을 위한 API 리팩토링 중'
            />
          </div>
        </section>

        {/* 사용법 안내 */}
        <section className='mt-12 rounded-xl border border-gray-200 bg-white/50 p-6'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>사용법</h2>
          <div className='space-y-3 text-sm text-gray-600'>
            <div>
              <strong>기본 사용:</strong>{' '}
              <code className='rounded bg-gray-100 px-2 py-1'>
                {'<UnderConstruction />'}
              </code>
            </div>
            <div>
              <strong>커스텀 메시지:</strong>{' '}
              <code className='rounded bg-gray-100 px-2 py-1'>
                {'<UnderConstruction title="제목" message="메시지" />'}
              </code>
            </div>
            <div>
              <strong>크기 조절:</strong>{' '}
              <code className='rounded bg-gray-100 px-2 py-1'>
                {'size="small|medium|large"'}
              </code>
            </div>
            <div>
              <strong>애니메이션 제어:</strong>{' '}
              <code className='rounded bg-gray-100 px-2 py-1'>
                {'showAnimation={false}'}
              </code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
