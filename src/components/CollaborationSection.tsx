import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';

const friendsStats = [
  { name: '김개발', message: 'VS Code에서 React 개발 중 🔥', avatar: '김', color: 'bg-green-100 text-green-700', rank: 1, score: '847점', change: '+2↗️' },
  { name: '박코더', message: 'IntelliJ로 Spring Boot 작업', avatar: '박', color: 'bg-blue-100 text-blue-700', rank: 2, score: '792점', change: '→' },
  { name: '이프론트', message: '유튜브 React 강의 시청 중', avatar: '이', color: 'bg-purple-100 text-purple-700', rank: 3, score: '756점', change: '-1↘️' }
];

export default function CollaborationSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerLeft = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const observerRight = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
      <div ref={leftRef} className="relative">
        <Card className="bg-white/90 backdrop-blur border-2 border-purple-200 hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse hover:bg-green-500 hover:scale-125 transition-all duration-200 cursor-pointer shadow-md"></div>
                <span className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">전체 리더보드</span>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200 font-medium px-3 py-1">🔴 실시간</Badge>
            </div>
            
            <div className="space-y-5">
              {friendsStats.map((friend, index) => (
                <div key={index} className="flex items-center space-x-4 hover:bg-gray-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/member border border-transparent hover:border-gray-200 hover:shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                      friend.rank === 1 ? 'bg-yellow-400 text-yellow-900' : 
                      friend.rank === 2 ? 'bg-gray-300 text-gray-800' :
                      'bg-orange-300 text-orange-900'
                    } group-hover/member:scale-110 transition-transform duration-200`}>
                      {friend.rank}
                    </div>
                    <Avatar className="w-10 h-10 group-hover/member:scale-110 transition-transform duration-200 shadow-md">
                      <AvatarImage src="" />
                      <AvatarFallback className={`${friend.color} group-hover/member:shadow-lg transition-shadow duration-200 font-semibold`}>{friend.avatar}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-semibold text-gray-900 group-hover/member:text-purple-700 transition-colors duration-200">{friend.name}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          friend.change.includes('↗️') ? 'bg-green-100 text-green-700' :
                          friend.change.includes('↘️') ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {friend.change}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full group-hover/member:bg-purple-200 group-hover/member:text-purple-800 transition-all duration-200">{friend.score}</div>
                    </div>
                    <div className="text-sm text-gray-600 group-hover/member:text-gray-800 transition-colors duration-200 mt-1 font-medium">{friend.message}</div>
                  </div>
                  <div className="transition-opacity duration-200">
                    <div className={`w-3 h-3 ${friend.rank === 1 ? 'bg-green-400' : 'bg-blue-400'} rounded-full animate-pulse shadow-sm`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* 나의 순위와 추월 정보 */}
            <div className="mt-6 pt-6 border-t-2 border-gray-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">4</div>
                  <span className="text-base font-semibold text-purple-700">나 (당신)</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    +1↗️
                  </span>
                </div>
                <span className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">734점</span>
              </div>
              
              {/* 추월 정보 */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 mb-4">
                <div className="text-sm font-semibold text-orange-800 mb-2">🎉 최근 변동사항</div>
                <div className="space-y-1 text-xs">
                  <div className="text-green-700">✅ 최개발을 추월했습니다! (+15점)</div>
                  <div className="text-blue-700">🏃‍♂️ 이프론트를 22점 차이로 추격 중</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-700 mb-4 font-medium bg-blue-50 p-3 rounded-lg border border-blue-200">
                🎯 김개발을 추월하려면 <strong>113점</strong> 더 필요해요!
                <div className="text-xs text-gray-600 mt-1">💡 VS Code 1시간 = +120점</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-200 cursor-text font-medium border border-gray-200">
                  커스텀 그룹 초대 메시지...
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center hover:bg-purple-600 hover:scale-110 transition-all duration-200 cursor-pointer shadow-md">
                  <span className="text-white text-sm">📤</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 커스텀 그룹 카드 */}
        <Card className="absolute -bottom-6 -left-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 w-52 hover:from-green-600 hover:to-emerald-600 hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer group/custom">
          <CardContent className="p-5">
            <div className="text-base font-bold group-hover/custom:scale-105 transition-transform duration-200">팀 개발자들</div>
            <Badge className="bg-white/25 text-white mt-2 hover:bg-white/35 transition-colors duration-200 font-medium">5명 참가</Badge>
            <div className="mt-3 transition-opacity duration-300">
              <div className="text-sm font-medium mb-2">게임화 규칙</div>
              <div className="text-xs space-y-1 opacity-90">
                <div>💻 VS Code: +2pt/분</div>
                <div>📺 유튜브: -1pt/분</div>
                <div>🎯 목표: 1,000pt</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref={rightRef}>
        <h2 className="text-4xl font-display text-gray-900 mb-8 hover:text-purple-700 transition-colors duration-300 cursor-default leading-tight">
          친구들과 함께<br />
          생산성 경쟁하기 🏆
        </h2>
        <p className="text-xl text-gray-700 mb-8 hover:text-gray-800 transition-colors duration-300 leading-relaxed font-medium">
          전체 리더보드에서 실시간 순위를 확인하고, 커스텀 그룹으로 팀만의 특별한 경쟁 규칙을 만들어보세요.
          게임화된 점수 시스템으로 더욱 재미있게!
        </p>
        <p className="text-lg text-gray-700 mb-10 hover:text-gray-800 transition-colors duration-300 leading-relaxed">
          이미 <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded hover:bg-purple-200 transition-colors duration-200">1,247명</span>의 개발자가 
          리더보드에서 경쟁하고 있어요. 
          <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded ml-1">평균 생산성 +43% 향상!</span>
        </p>
        
        <div className="space-y-5 mb-10">
          <div className="flex items-center space-x-4 hover:bg-blue-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/feature border border-transparent hover:border-blue-200 hover:shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover/feature:bg-blue-200 transition-colors duration-200 shadow-sm">
              <span className="text-blue-600 text-xl group-hover/feature:scale-110 transition-transform duration-200">🏆</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 group-hover/feature:text-blue-700 transition-colors duration-200">전체 리더보드</div>
              <div className="text-sm text-gray-600 group-hover/feature:text-gray-700 transition-colors duration-200">모든 사용자와 실시간 순위 경쟁</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 hover:bg-green-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/feature border border-transparent hover:border-green-200 hover:shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover/feature:bg-green-200 transition-colors duration-200 shadow-sm">
              <span className="text-green-600 text-xl group-hover/feature:scale-110 transition-transform duration-200">👥</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 group-hover/feature:text-green-700 transition-colors duration-200">커스텀 그룹</div>
              <div className="text-sm text-gray-600 group-hover/feature:text-gray-700 transition-colors duration-200">팀만의 특별한 게임화 규칙 설정</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 hover:bg-green-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/feature border border-transparent hover:border-green-200 hover:shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover/feature:bg-green-200 transition-colors duration-200 shadow-sm">
              <span className="text-green-600 text-xl group-hover/feature:scale-110 transition-transform duration-200">🚀</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 group-hover/feature:text-green-700 transition-colors duration-200">추월 알림</div>
              <div className="text-sm text-gray-600 group-hover/feature:text-gray-700 transition-colors duration-200">누구를 추월했는지 실시간 알림</div>
            </div>
          </div>
        </div>
        
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:scale-105 active:scale-95 hover:shadow-xl transition-all duration-200 group/btn text-lg font-semibold px-8 py-4 rounded-xl">
          <span className="group-hover/btn:mr-2 transition-all duration-200">리더보드 경쟁 시작하기</span>
          <span className="transition-opacity duration-200">🏁</span>
        </Button>
      </div>
    </div>
  );
} 