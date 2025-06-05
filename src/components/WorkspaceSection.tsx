import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';

export default function WorkspaceSection() {
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
      <div ref={leftRef} className="space-y-8">
        <Card className="border-2 border-purple-200 bg-white/95 backdrop-blur hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <Badge className="bg-blue-100 text-blue-800 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 font-semibold px-4 py-2 text-sm">🔍 개인 분석</Badge>
              <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors duration-300 font-medium bg-blue-50 px-3 py-1 rounded-full">LV.7 🔥</span>
            </div>
            <h3 className="text-xl font-bold mb-4 group-hover:text-purple-700 transition-colors duration-300 leading-tight">개발자를 위한 스마트 시간 추적</h3>
            <p className="text-gray-700 text-base mb-6 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed font-medium">
              IDE별 코딩 시간부터 유튜브 콘텐츠 분석까지. 당신의 디지털 라이프를 완벽하게 추적하고 인사이트를 제공합니다.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-base hover:bg-blue-50 p-3 rounded-xl transition-all duration-200 cursor-pointer group/item border border-transparent hover:border-blue-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 group-hover/item:scale-150 transition-transform duration-200 shadow-sm"></div>
                <span className="group-hover/item:text-blue-700 group-hover/item:font-semibold transition-all duration-200 text-gray-800">IDE별 상세 통계 (VS Code, IntelliJ 등)</span>
              </div>
              <div className="flex items-center text-base hover:bg-green-50 p-3 rounded-xl transition-all duration-200 cursor-pointer group/item border border-transparent hover:border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4 group-hover/item:scale-150 transition-transform duration-200 shadow-sm"></div>
                <span className="group-hover/item:text-green-700 group-hover/item:font-semibold transition-all duration-200 text-gray-800">유튜브 콘텐츠 카테고리 자동 분류</span>
              </div>
              <div className="flex items-center text-base hover:bg-purple-50 p-3 rounded-xl transition-all duration-200 cursor-pointer group/item border border-transparent hover:border-purple-200">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 group-hover/item:scale-150 transition-transform duration-200 shadow-sm"></div>
                <span className="group-hover/item:text-purple-700 group-hover/item:font-semibold transition-all duration-200 text-gray-800">시간대별 생산성 패턴 분석</span>
              </div>
              <div className="flex items-center text-base hover:bg-orange-50 p-3 rounded-xl transition-all duration-200 cursor-pointer group/item border border-transparent hover:border-orange-200">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 group-hover/item:scale-150 transition-transform duration-200 shadow-sm"></div>
                <span className="group-hover/item:text-orange-700 group-hover/item:font-semibold transition-all duration-200 text-gray-800">GitHub 배지 & 노션/캘린더 연동</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-white/95 backdrop-blur hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6 group-hover:text-green-700 transition-colors duration-300 leading-tight">레벨링 & 게임화 시스템</h3>
            <div className="grid grid-cols-2 gap-5">
              <div className="hover:bg-purple-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/feature border border-transparent hover:border-purple-200 hover:shadow-sm">
                <div className="text-base font-semibold text-purple-700 group-hover/feature:text-purple-800 transition-colors duration-200 mb-2">⚡ 경험치 시스템</div>
                <div className="text-sm text-gray-600 group-hover/feature:text-gray-700 transition-colors duration-200 leading-relaxed">코딩할수록 레벨업!</div>
              </div>
              <div className="hover:bg-blue-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/feature border border-transparent hover:border-blue-200 hover:shadow-sm">
                <div className="text-base font-semibold text-blue-700 group-hover/feature:text-blue-800 transition-colors duration-200 mb-2">🎭 캐릭터 시스템</div>
                <div className="text-sm text-gray-600 group-hover/feature:text-gray-700 transition-colors duration-200 leading-relaxed">활동별 맞춤 캐릭터</div>
              </div>
              <div className="hover:bg-red-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/feature border border-transparent hover:border-red-200 hover:shadow-sm">
                <div className="text-base font-semibold text-red-700 group-hover/feature:text-red-800 transition-colors duration-200 mb-2">🚫 스마트 차단</div>
                <div className="text-sm text-gray-600 group-hover/feature:text-gray-700 transition-colors duration-200 leading-relaxed">집중 모드 시 방해 요소 차단</div>
              </div>
              <div className="hover:bg-green-50 p-4 rounded-xl transition-all duration-200 cursor-pointer group/feature border border-transparent hover:border-green-200 hover:shadow-sm">
                <div className="text-base font-semibold text-green-700 group-hover/feature:text-green-800 transition-colors duration-200 mb-2">📊 실시간 통계</div>
                <div className="text-sm text-gray-600 group-hover/feature:text-gray-700 transition-colors duration-200 leading-relaxed">월/주/일별 상세 리포트</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref={rightRef} className="space-y-6">
        <div className="flex space-x-6">
          {/* GitHub 배지 카드 */}
          <div className="flex-1 flip-card h-40">
            <div className="flip-card-inner">
              {/* 앞면 */}
              <Card className="flip-card-front border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer relative overflow-hidden">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-gray-800 font-bold text-xl mb-2">GitHub 배지</div>
                  <div className="text-sm text-gray-700 font-medium">프로필에 표시</div>
                </CardContent>
              </Card>
              
              {/* 뒷면 */}
              <Card className="flip-card-back border-2 border-gray-200 bg-gradient-to-br from-gray-200 to-blue-200 cursor-pointer relative overflow-hidden">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm text-gray-800 font-semibold mb-1">일 평균 5.2시간</div>
                  <div className="text-sm text-gray-800 font-semibold mb-1">주로 오후 2-6시</div>
                  <div className="text-xs text-gray-700">개발 패턴 표시</div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* 노션 연동 카드 */}
          <div className="flex-1 flip-card h-40">
            <div className="flip-card-inner">
              {/* 앞면 */}
              <Card className="flip-card-front border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-200 cursor-pointer relative overflow-hidden">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-purple-800 font-bold text-xl mb-2">노션 연동</div>
                  <div className="text-sm text-purple-700 font-medium">자동 리포트</div>
                </CardContent>
              </Card>
              
              {/* 뒷면 */}
              <Card className="flip-card-back border-2 border-purple-200 bg-gradient-to-br from-purple-200 to-pink-200 cursor-pointer relative overflow-hidden">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm text-purple-800 font-semibold mb-1">일일 작업 기록</div>
                  <div className="text-sm text-purple-800 font-semibold mb-1">자동 페이지 생성</div>
                  <div className="text-xs text-purple-700">통계까지 완벽!</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <Card className="border-2 border-blue-200 bg-white/95 backdrop-blur hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">LV.7</div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 font-bold px-4 py-2">💻 코드 마스터</Badge>
            </div>
            <div className="text-base text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300 font-medium">이번 주 개발 활동</div>
            
            {/* 레벨 진행바 */}
            <div className="h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-300 relative overflow-hidden border border-gray-200 mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-xl transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-3/4 h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl transition-all duration-1000 ease-out"></div>
              
              {/* 레벨업 알림 */}
              <div className="absolute top-0 right-3 transition-opacity duration-300">
                <div className="text-sm text-gray-700 bg-white/90 px-3 py-1 rounded-lg shadow-sm font-medium border border-gray-200">
                  🆙 다음 레벨까지 1,247 XP
                </div>
              </div>
            </div>
            
            {/* 상세 활동 통계 */}
            <div className="transition-all duration-300">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 hover:bg-blue-100 transition-colors duration-200">
                  <div className="text-lg font-bold text-blue-700">23h</div>
                  <div className="text-sm text-gray-600 font-medium">VS Code</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200 hover:bg-green-100 transition-colors duration-200">
                  <div className="text-lg font-bold text-green-700">5.2h</div>
                  <div className="text-sm text-gray-600 font-medium">일 평균</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 hover:bg-purple-100 transition-colors duration-200">
                  <div className="text-lg font-bold text-purple-700">14-18</div>
                  <div className="text-sm text-gray-600 font-medium">피크 시간</div>
                </div>
              </div>
              
              {/* 카테고리별 활동 */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💻</span>
                    <span className="font-medium text-gray-800">코딩 (React, TypeScript)</span>
                  </div>
                  <span className="font-bold text-blue-600">23h 14m</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📺</span>
                    <span className="font-medium text-gray-800">유튜브 (개발 강의)</span>
                  </div>
                  <span className="font-bold text-red-600">2h 7m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 