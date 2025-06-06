import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';

export default function WorkspaceSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerLeft = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const observerRight = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (leftRef.current) {
      leftRef.current.classList.add('scroll-animate', 'animate-left');
      observerLeft.observe(leftRef.current);
    }

    if (rightRef.current) {
      rightRef.current.classList.add('scroll-animate', 'animate-right');
      observerRight.observe(rightRef.current);
    }

    return () => {
      observerLeft.disconnect();
      observerRight.disconnect();
    };
  }, []);

  return (
    <div className='mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
      <div ref={leftRef} className='space-y-8'>
        <Card className='group cursor-pointer border-2 border-purple-200 bg-white/95 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl'>
          <CardContent className='p-8'>
            <div className='mb-6 flex items-center justify-between'>
              <Badge className='bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200'>
                🔍 개인 분석
              </Badge>
              <span className='rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-gray-600 transition-colors duration-300 group-hover:text-blue-700'>
                LV.7 🔥
              </span>
            </div>
            <h3 className='mb-4 text-xl leading-tight font-bold transition-colors duration-300 group-hover:text-purple-700'>
              개발자를 위한 스마트 시간 추적
            </h3>
            <p className='mb-6 text-base leading-relaxed font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-800'>
              IDE별 코딩 시간부터 유튜브 콘텐츠 분석까지. 당신의 디지털 라이프를
              완벽하게 추적하고 인사이트를 제공합니다.
            </p>

            <div className='space-y-4'>
              <div className='group/item flex cursor-pointer items-center rounded-xl border border-transparent p-3 text-base transition-all duration-200 hover:border-blue-200 hover:bg-blue-50'>
                <div className='mr-4 h-3 w-3 rounded-full bg-blue-500 shadow-sm transition-transform duration-200 group-hover/item:scale-150'></div>
                <span className='text-gray-800 transition-all duration-200 group-hover/item:font-semibold group-hover/item:text-blue-700'>
                  IDE별 상세 통계 (VS Code, IntelliJ 등)
                </span>
              </div>
              <div className='group/item flex cursor-pointer items-center rounded-xl border border-transparent p-3 text-base transition-all duration-200 hover:border-green-200 hover:bg-green-50'>
                <div className='mr-4 h-3 w-3 rounded-full bg-green-500 shadow-sm transition-transform duration-200 group-hover/item:scale-150'></div>
                <span className='text-gray-800 transition-all duration-200 group-hover/item:font-semibold group-hover/item:text-green-700'>
                  유튜브 콘텐츠 카테고리 자동 분류
                </span>
              </div>
              <div className='group/item flex cursor-pointer items-center rounded-xl border border-transparent p-3 text-base transition-all duration-200 hover:border-purple-200 hover:bg-purple-50'>
                <div className='mr-4 h-3 w-3 rounded-full bg-purple-500 shadow-sm transition-transform duration-200 group-hover/item:scale-150'></div>
                <span className='text-gray-800 transition-all duration-200 group-hover/item:font-semibold group-hover/item:text-purple-700'>
                  시간대별 생산성 패턴 분석
                </span>
              </div>
              <div className='group/item flex cursor-pointer items-center rounded-xl border border-transparent p-3 text-base transition-all duration-200 hover:border-orange-200 hover:bg-orange-50'>
                <div className='mr-4 h-3 w-3 rounded-full bg-orange-500 shadow-sm transition-transform duration-200 group-hover/item:scale-150'></div>
                <span className='text-gray-800 transition-all duration-200 group-hover/item:font-semibold group-hover/item:text-orange-700'>
                  GitHub 배지 & 노션/캘린더 연동
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='group cursor-pointer border-2 border-green-200 bg-white/95 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl'>
          <CardContent className='p-8'>
            <h3 className='mb-6 text-xl leading-tight font-bold transition-colors duration-300 group-hover:text-green-700'>
              레벨링 & 게임화 시스템
            </h3>
            <div className='grid grid-cols-2 gap-5'>
              <div className='group/feature cursor-pointer rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm'>
                <div className='mb-2 text-base font-semibold text-purple-700 transition-colors duration-200 group-hover/feature:text-purple-800'>
                  ⚡ 경험치 시스템
                </div>
                <div className='text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover/feature:text-gray-700'>
                  코딩할수록 레벨업!
                </div>
              </div>
              <div className='group/feature cursor-pointer rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm'>
                <div className='mb-2 text-base font-semibold text-blue-700 transition-colors duration-200 group-hover/feature:text-blue-800'>
                  🎭 캐릭터 시스템
                </div>
                <div className='text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover/feature:text-gray-700'>
                  활동별 맞춤 캐릭터
                </div>
              </div>
              <div className='group/feature cursor-pointer rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:shadow-sm'>
                <div className='mb-2 text-base font-semibold text-red-700 transition-colors duration-200 group-hover/feature:text-red-800'>
                  🚫 스마트 차단
                </div>
                <div className='text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover/feature:text-gray-700'>
                  집중 모드 시 방해 요소 차단
                </div>
              </div>
              <div className='group/feature cursor-pointer rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-green-200 hover:bg-green-50 hover:shadow-sm'>
                <div className='mb-2 text-base font-semibold text-green-700 transition-colors duration-200 group-hover/feature:text-green-800'>
                  📊 실시간 통계
                </div>
                <div className='text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover/feature:text-gray-700'>
                  월/주/일별 상세 리포트
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref={rightRef} className='space-y-6'>
        <div className='flex space-x-6'>
          {/* GitHub 배지 카드 */}
          <div className='flip-card h-40 flex-1'>
            <div className='flip-card-inner'>
              {/* 앞면 */}
              <Card className='flip-card-front relative cursor-pointer overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200'>
                <CardContent className='flex h-full flex-col items-center justify-center p-4 text-center'>
                  <div className='mb-2 text-xl font-bold text-gray-800'>
                    GitHub 배지
                  </div>
                  <div className='text-sm font-medium text-gray-700'>
                    프로필에 표시
                  </div>
                </CardContent>
              </Card>

              {/* 뒷면 */}
              <Card className='flip-card-back relative cursor-pointer overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-200 to-blue-200'>
                <CardContent className='flex h-full flex-col items-center justify-center p-4 text-center'>
                  <div className='mb-2 text-2xl'>⚡</div>
                  <div className='mb-1 text-sm font-semibold text-gray-800'>
                    일 평균 5.2시간
                  </div>
                  <div className='mb-1 text-sm font-semibold text-gray-800'>
                    주로 오후 2-6시
                  </div>
                  <div className='text-xs text-gray-700'>개발 패턴 표시</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 노션 연동 카드 */}
          <div className='flip-card h-40 flex-1'>
            <div className='flip-card-inner'>
              {/* 앞면 */}
              <Card className='flip-card-front relative cursor-pointer overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-200'>
                <CardContent className='flex h-full flex-col items-center justify-center p-4 text-center'>
                  <div className='mb-2 text-xl font-bold text-purple-800'>
                    노션 연동
                  </div>
                  <div className='text-sm font-medium text-purple-700'>
                    자동 리포트
                  </div>
                </CardContent>
              </Card>

              {/* 뒷면 */}
              <Card className='flip-card-back relative cursor-pointer overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-200 to-pink-200'>
                <CardContent className='flex h-full flex-col items-center justify-center p-4 text-center'>
                  <div className='mb-2 text-2xl'>📝</div>
                  <div className='mb-1 text-sm font-semibold text-purple-800'>
                    일일 작업 기록
                  </div>
                  <div className='mb-1 text-sm font-semibold text-purple-800'>
                    자동 페이지 생성
                  </div>
                  <div className='text-xs text-purple-700'>통계까지 완벽!</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card className='group cursor-pointer border-2 border-blue-200 bg-white/95 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl'>
          <CardContent className='p-8'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='text-3xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600'>
                LV.7
              </div>
              <Badge className='bg-blue-100 px-4 py-2 font-bold text-blue-800 transition-colors duration-200 hover:bg-blue-200'>
                💻 코드 마스터
              </Badge>
            </div>
            <div className='mb-6 text-base font-medium text-gray-600 transition-colors duration-300 group-hover:text-gray-700'>
              이번 주 개발 활동
            </div>

            {/* 레벨 진행바 */}
            <div className='relative mb-4 h-6 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-blue-100 to-purple-100 transition-all duration-300 hover:from-blue-200 hover:to-purple-200'>
              <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-300/20 to-purple-300/20 transition-opacity duration-300'></div>
              <div className='absolute bottom-0 left-0 h-full w-3/4 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000 ease-out'></div>

              {/* 레벨업 알림 */}
              <div className='absolute top-0 right-3 transition-opacity duration-300'>
                <div className='rounded-lg border border-gray-200 bg-white/90 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm'>
                  🆙 다음 레벨까지 1,247 XP
                </div>
              </div>
            </div>

            {/* 상세 활동 통계 */}
            <div className='transition-all duration-300'>
              <div className='grid grid-cols-3 gap-4 text-center'>
                <div className='rounded-xl border border-blue-200 bg-blue-50 p-4 transition-colors duration-200 hover:bg-blue-100'>
                  <div className='text-lg font-bold text-blue-700'>23h</div>
                  <div className='text-sm font-medium text-gray-600'>
                    VS Code
                  </div>
                </div>
                <div className='rounded-xl border border-green-200 bg-green-50 p-4 transition-colors duration-200 hover:bg-green-100'>
                  <div className='text-lg font-bold text-green-700'>5.2h</div>
                  <div className='text-sm font-medium text-gray-600'>
                    일 평균
                  </div>
                </div>
                <div className='rounded-xl border border-purple-200 bg-purple-50 p-4 transition-colors duration-200 hover:bg-purple-100'>
                  <div className='text-lg font-bold text-purple-700'>14-18</div>
                  <div className='text-sm font-medium text-gray-600'>
                    피크 시간
                  </div>
                </div>
              </div>

              {/* 카테고리별 활동 */}
              <div className='mt-4 space-y-2'>
                <div className='flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-lg'>💻</span>
                    <span className='font-medium text-gray-800'>
                      코딩 (React, TypeScript)
                    </span>
                  </div>
                  <span className='font-bold text-blue-600'>23h 14m</span>
                </div>
                <div className='flex items-center justify-between rounded-lg bg-gradient-to-r from-red-50 to-orange-50 p-3'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-lg'>📺</span>
                    <span className='font-medium text-gray-800'>
                      유튜브 (개발 강의)
                    </span>
                  </div>
                  <span className='font-bold text-red-600'>2h 7m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
