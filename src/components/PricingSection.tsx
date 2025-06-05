import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardTitle } from '@/shadcn/ui/card';


export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
    <div ref={sectionRef} className="bg-white rounded-2xl p-8 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center hover:text-purple-700 transition-colors duration-300">베타 테스터 특별 혜택</h2>
      <p className="text-lg text-gray-600 mb-8 text-center hover:text-gray-700 transition-colors duration-300">
        개발자를 위한 스마트 생산성 추적기. 지금 가입하면 베이직 플랜을 월 $1에 평생 이용 가능!
      </p>
      
      
      {/* 추가 정보 */}
      <div className="mt-10 text-center transition-opacity duration-300">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100">
          <p className="text-base text-gray-700 hover:text-gray-800 transition-colors duration-200 mb-2">
            🏆 전체 리더보드에서 친구들과 경쟁하며 생산성을 게임처럼 즐겨보세요!
          </p>
          <p className="text-sm text-gray-600">
            💡 <strong>특별 혜택:</strong> 지금 가입하면 향후 모든 신기능 (AI 분석, <span className="text-green-600 font-semibold">고급 게임화</span>) 무료 제공!
          </p>
        </div>
      </div>
      
      {/* 플랜 비교 설명 */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FREE 플랜 설명 */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">FREE 플랜</h3>
            <div className="w-16 h-1 bg-gray-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-600 text-center mb-4">
            개발 입문자와 개인 사용자를 위한 기본 기능
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-gray-400 rounded-full mr-3 flex-shrink-0"></span>
              기본적인 시간 추적
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-gray-400 rounded-full mr-3 flex-shrink-0"></span>
              소규모 친구 그룹 비교
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-gray-400 rounded-full mr-3 flex-shrink-0"></span>
              개인용 GitHub 배지
            </li>
          </ul>
        </div>
        
        {/* BASIC 플랜 설명 - 더 화려하게 */}
        <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-purple-200 rounded-2xl p-6 border-2 border-purple-300 relative overflow-hidden shadow-lg">
          {/* 배경 효과 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full -mr-10 -mt-10 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full -ml-8 -mb-8 opacity-20"></div>
          
          {/* 추천 배지 */}
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
            ⭐ 추천!
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent mb-2">
                BASIC 플랜
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-purple-800 text-center mb-4 font-medium">
              진지한 개발자를 위한 프리미엄 기능
            </p>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                고급 IDE별 상세 분석
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                전체 리더보드 + 커스텀 그룹
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                노션/구글 캘린더 연동
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                AI 기반 생산성 분석
              </li>
            </ul>
            
            {/* 강조 텍스트 */}
            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-purple-200">
              <p className="text-center text-purple-700 font-bold text-sm">
                🔥 6개월 결제 시 월 $1 (89% 할인!)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 