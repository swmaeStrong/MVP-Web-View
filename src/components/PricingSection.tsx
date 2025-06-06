import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardTitle } from '@/shadcn/ui/card';

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionRef.current.classList.add('scroll-animate', 'animate-left');
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className='rounded-2xl border border-purple-100 bg-white p-8 transition-shadow duration-300 hover:shadow-xl'
    >
      <h2 className='mb-6 text-center text-3xl font-bold text-gray-900 transition-colors duration-300 hover:text-purple-700'>
        베타 테스터 특별 혜택
      </h2>
      <p className='mb-8 text-center text-lg text-gray-600 transition-colors duration-300 hover:text-gray-700'>
        개발자를 위한 스마트 생산성 추적기. 지금 가입하면 베이직 플랜을 월 $1에
        평생 이용 가능!
      </p>

      {/* 추가 정보 */}
      <div className='mt-10 text-center transition-opacity duration-300'>
        <div className='rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 p-6'>
          <p className='mb-2 text-base text-gray-700 transition-colors duration-200 hover:text-gray-800'>
            🏆 전체 리더보드에서 친구들과 경쟁하며 생산성을 게임처럼 즐겨보세요!
          </p>
          <p className='text-sm text-gray-600'>
            💡 <strong>특별 혜택:</strong> 지금 가입하면 향후 모든 신기능 (AI
            분석,{' '}
            <span className='font-semibold text-green-600'>고급 게임화</span>)
            무료 제공!
          </p>
        </div>
      </div>

      {/* 플랜 비교 설명 */}
      <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* FREE 플랜 설명 */}
        <div className='rounded-2xl border border-gray-200 bg-gray-50 p-6'>
          <div className='mb-4 text-center'>
            <h3 className='mb-2 text-2xl font-bold text-gray-700'>FREE 플랜</h3>
            <div className='mx-auto h-1 w-16 rounded-full bg-gray-400'></div>
          </div>
          <p className='mb-4 text-center text-gray-600'>
            개발 입문자와 개인 사용자를 위한 기본 기능
          </p>
          <ul className='space-y-2 text-sm text-gray-600'>
            <li className='flex items-center'>
              <span className='mr-3 h-4 w-4 flex-shrink-0 rounded-full bg-gray-400'></span>
              기본적인 시간 추적
            </li>
            <li className='flex items-center'>
              <span className='mr-3 h-4 w-4 flex-shrink-0 rounded-full bg-gray-400'></span>
              소규모 친구 그룹 비교
            </li>
            <li className='flex items-center'>
              <span className='mr-3 h-4 w-4 flex-shrink-0 rounded-full bg-gray-400'></span>
              개인용 GitHub 배지
            </li>
          </ul>
        </div>

        {/* BASIC 플랜 설명 - 더 화려하게 */}
        <div className='relative overflow-hidden rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-blue-100 to-purple-200 p-6 shadow-lg'>
          {/* 배경 효과 */}
          <div className='absolute top-0 right-0 -mt-10 -mr-10 h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-20'></div>
          <div className='absolute bottom-0 left-0 -mb-8 -ml-8 h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20'></div>

          {/* 추천 배지 */}
          <div className='absolute -top-3 -right-3 rotate-12 transform rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg'>
            ⭐ 추천!
          </div>

          <div className='relative z-10'>
            <div className='mb-4 text-center'>
              <h3 className='mb-2 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-2xl font-bold text-transparent'>
                BASIC 플랜
              </h3>
              <div className='mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></div>
            </div>
            <p className='mb-4 text-center font-medium text-purple-800'>
              진지한 개발자를 위한 프리미엄 기능
            </p>
            <ul className='space-y-2 text-sm text-purple-800'>
              <li className='flex items-center'>
                <span className='mr-3 h-4 w-4 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></span>
                고급 IDE별 상세 분석
              </li>
              <li className='flex items-center'>
                <span className='mr-3 h-4 w-4 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></span>
                전체 리더보드 + 커스텀 그룹
              </li>
              <li className='flex items-center'>
                <span className='mr-3 h-4 w-4 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></span>
                노션/구글 캘린더 연동
              </li>
              <li className='flex items-center'>
                <span className='mr-3 h-4 w-4 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></span>
                AI 기반 생산성 분석
              </li>
            </ul>

            {/* 강조 텍스트 */}
            <div className='mt-4 rounded-lg border border-purple-200 bg-white/50 p-3'>
              <p className='text-center text-sm font-bold text-purple-700'>
                🔥 6개월 결제 시 월 $1 (89% 할인!)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
