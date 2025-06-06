import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';

const friendsStats = [
  {
    name: '김개발',
    message: 'VS Code에서 React 개발 중 🔥',
    avatar: '김',
    color: 'bg-green-100 text-green-700',
    rank: 1,
    score: '847점',
    change: '+2↗️',
  },
  {
    name: '박코더',
    message: 'IntelliJ로 Spring Boot 작업',
    avatar: '박',
    color: 'bg-blue-100 text-blue-700',
    rank: 2,
    score: '792점',
    change: '→',
  },
  {
    name: '이프론트',
    message: '유튜브 React 강의 시청 중',
    avatar: '이',
    color: 'bg-purple-100 text-purple-700',
    rank: 3,
    score: '756점',
    change: '-1↘️',
  },
];

export default function CollaborationSection() {
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
      <div ref={leftRef} className='relative'>
        <Card className='group cursor-pointer border-2 border-purple-200 bg-white/90 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl'>
          <CardContent className='p-8'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='h-4 w-4 animate-pulse cursor-pointer rounded-full bg-green-400 shadow-md transition-all duration-200 hover:scale-125 hover:bg-green-500'></div>
                <span className='text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-purple-700'>
                  전체 리더보드
                </span>
              </div>
              <Badge className='bg-green-100 px-3 py-1 font-medium text-green-800 transition-colors duration-200 hover:bg-green-200'>
                🔴 실시간
              </Badge>
            </div>

            <div className='space-y-5'>
              {friendsStats.map((friend, index) => (
                <div
                  key={index}
                  className='group/member flex cursor-pointer items-center space-x-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-md ${
                        friend.rank === 1
                          ? 'bg-yellow-400 text-yellow-900'
                          : friend.rank === 2
                            ? 'bg-gray-300 text-gray-800'
                            : 'bg-orange-300 text-orange-900'
                      } transition-transform duration-200 group-hover/member:scale-110`}
                    >
                      {friend.rank}
                    </div>
                    <Avatar className='h-10 w-10 shadow-md transition-transform duration-200 group-hover/member:scale-110'>
                      <AvatarImage src='' />
                      <AvatarFallback
                        className={`${friend.color} font-semibold transition-shadow duration-200 group-hover/member:shadow-lg`}
                      >
                        {friend.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-base font-semibold text-gray-900 transition-colors duration-200 group-hover/member:text-purple-700'>
                          {friend.name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            friend.change.includes('↗️')
                              ? 'bg-green-100 text-green-700'
                              : friend.change.includes('↘️')
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {friend.change}
                        </span>
                      </div>
                      <div className='rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700 transition-all duration-200 group-hover/member:bg-purple-200 group-hover/member:text-purple-800'>
                        {friend.score}
                      </div>
                    </div>
                    <div className='mt-1 text-sm font-medium text-gray-600 transition-colors duration-200 group-hover/member:text-gray-800'>
                      {friend.message}
                    </div>
                  </div>
                  <div className='transition-opacity duration-200'>
                    <div
                      className={`h-3 w-3 ${friend.rank === 1 ? 'bg-green-400' : 'bg-blue-400'} animate-pulse rounded-full shadow-sm`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* 나의 순위와 추월 정보 */}
            <div className='mt-6 border-t-2 border-gray-100 pt-6 transition-all duration-300'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white shadow-md'>
                    4
                  </div>
                  <span className='text-base font-semibold text-purple-700'>
                    나 (당신)
                  </span>
                  <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700'>
                    +1↗️
                  </span>
                </div>
                <span className='rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700'>
                  734점
                </span>
              </div>

              {/* 추월 정보 */}
              <div className='mb-4 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4'>
                <div className='mb-2 text-sm font-semibold text-orange-800'>
                  🎉 최근 변동사항
                </div>
                <div className='space-y-1 text-xs'>
                  <div className='text-green-700'>
                    ✅ 최개발을 추월했습니다! (+15점)
                  </div>
                  <div className='text-blue-700'>
                    🏃‍♂️ 이프론트를 22점 차이로 추격 중
                  </div>
                </div>
              </div>

              <div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-medium text-gray-700'>
                🎯 김개발을 추월하려면 <strong>113점</strong> 더 필요해요!
                <div className='mt-1 text-xs text-gray-600'>
                  💡 VS Code 1시간 = +120점
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='flex-1 cursor-text rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-200'>
                  커스텀 그룹 초대 메시지...
                </div>
                <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-purple-500 shadow-md transition-all duration-200 hover:scale-110 hover:bg-purple-600'>
                  <span className='text-sm text-white'>📤</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 커스텀 그룹 카드 */}
        <Card className='group/custom absolute -bottom-6 -left-6 w-52 cursor-pointer border-0 bg-gradient-to-br from-green-500 to-emerald-500 text-white transition-all duration-300 hover:scale-110 hover:from-green-600 hover:to-emerald-600 hover:shadow-2xl'>
          <CardContent className='p-5'>
            <div className='text-base font-bold transition-transform duration-200 group-hover/custom:scale-105'>
              팀 개발자들
            </div>
            <Badge className='mt-2 bg-white/25 font-medium text-white transition-colors duration-200 hover:bg-white/35'>
              5명 참가
            </Badge>
            <div className='mt-3 transition-opacity duration-300'>
              <div className='mb-2 text-sm font-medium'>게임화 규칙</div>
              <div className='space-y-1 text-xs opacity-90'>
                <div>💻 VS Code: +2pt/분</div>
                <div>📺 유튜브: -1pt/분</div>
                <div>🎯 목표: 1,000pt</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref={rightRef}>
        <h2 className='font-display mb-8 cursor-default text-4xl leading-tight text-gray-900 transition-colors duration-300 hover:text-purple-700'>
          친구들과 함께
          <br />
          생산성 경쟁하기 🏆
        </h2>
        <p className='mb-8 text-xl leading-relaxed font-medium text-gray-700 transition-colors duration-300 hover:text-gray-800'>
          전체 리더보드에서 실시간 순위를 확인하고, 커스텀 그룹으로 팀만의
          특별한 경쟁 규칙을 만들어보세요. 게임화된 점수 시스템으로 더욱
          재미있게!
        </p>
        <p className='mb-10 text-lg leading-relaxed text-gray-700 transition-colors duration-300 hover:text-gray-800'>
          이미{' '}
          <span className='rounded bg-purple-100 px-2 py-1 font-bold text-purple-700 transition-colors duration-200 hover:bg-purple-200'>
            1,247명
          </span>
          의 개발자가 리더보드에서 경쟁하고 있어요.
          <span className='ml-1 rounded bg-green-100 px-2 py-1 font-bold text-green-700'>
            평균 생산성 +43% 향상!
          </span>
        </p>

        <div className='mb-10 space-y-5'>
          <div className='group/feature flex cursor-pointer items-center space-x-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 shadow-sm transition-colors duration-200 group-hover/feature:bg-blue-200'>
              <span className='text-xl text-blue-600 transition-transform duration-200 group-hover/feature:scale-110'>
                🏆
              </span>
            </div>
            <div>
              <div className='text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover/feature:text-blue-700'>
                전체 리더보드
              </div>
              <div className='text-sm text-gray-600 transition-colors duration-200 group-hover/feature:text-gray-700'>
                모든 사용자와 실시간 순위 경쟁
              </div>
            </div>
          </div>

          <div className='group/feature flex cursor-pointer items-center space-x-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-green-200 hover:bg-green-50 hover:shadow-sm'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 shadow-sm transition-colors duration-200 group-hover/feature:bg-green-200'>
              <span className='text-xl text-green-600 transition-transform duration-200 group-hover/feature:scale-110'>
                👥
              </span>
            </div>
            <div>
              <div className='text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover/feature:text-green-700'>
                커스텀 그룹
              </div>
              <div className='text-sm text-gray-600 transition-colors duration-200 group-hover/feature:text-gray-700'>
                팀만의 특별한 게임화 규칙 설정
              </div>
            </div>
          </div>

          <div className='group/feature flex cursor-pointer items-center space-x-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-green-200 hover:bg-green-50 hover:shadow-sm'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 shadow-sm transition-colors duration-200 group-hover/feature:bg-green-200'>
              <span className='text-xl text-green-600 transition-transform duration-200 group-hover/feature:scale-110'>
                🚀
              </span>
            </div>
            <div>
              <div className='text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover/feature:text-green-700'>
                추월 알림
              </div>
              <div className='text-sm text-gray-600 transition-colors duration-200 group-hover/feature:text-gray-700'>
                누구를 추월했는지 실시간 알림
              </div>
            </div>
          </div>
        </div>

        <Button className='group/btn rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl active:scale-95'>
          <span className='transition-all duration-200 group-hover/btn:mr-2'>
            리더보드 경쟁 시작하기
          </span>
          <span className='transition-opacity duration-200'>🏁</span>
        </Button>
      </div>
    </div>
  );
}
