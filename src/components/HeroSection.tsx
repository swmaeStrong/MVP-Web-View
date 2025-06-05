import React from 'react';
import { Button } from '@/shadcn/ui/button';
import { Badge } from '@/shadcn/ui/badge';

export default function HeroSection() {
  const handleCopyCommand = () => {
    const command = 'brew install productivity-tracker';
    navigator.clipboard.writeText(command);
  };

  // 시간대별 집중도 데이터 (0-23시간)
  const focusData = [
    { hour: 9, focus: 45 },
    { hour: 10, focus: 62 },
    { hour: 11, focus: 78 },
    { hour: 12, focus: 55 },
    { hour: 13, focus: 40 },
    { hour: 14, focus: 85 },
    { hour: 15, focus: 92 },
    { hour: 16, focus: 88 },
    { hour: 17, focus: 75 },
    { hour: 18, focus: 50 },
    { hour: 19, focus: 35 },
    { hour: 20, focus: 68 },
    { hour: 21, focus: 73 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
      {/* 왼쪽 콘텐츠 */}
      <div>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 mb-6 hover:scale-105 transition-all duration-300 cursor-pointer font-semibold px-6 py-3 text-sm shadow-lg">
          🚀 베타 테스터 모집 중 - 평생 특가!
        </Badge>
        
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          개발자를 위한<br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">스마트 생산성</span> 추적기<br />
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">+</span> <span className="text-3xl lg:text-4xl text-gray-700">경쟁 플랫폼</span> 🏆
        </h1>
        
        <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
          <strong className="text-blue-600">IDE별 코딩 시간</strong>부터 <strong className="text-purple-600">시간대별 집중도 패턴</strong>까지 완벽 분석!<br />
          친구들과 리더보드 경쟁하며 생산성을 게임처럼 즐겨보세요.<br />
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-base font-semibold mt-2 mr-2">다양한 활동 추적</span>
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-base font-semibold mt-2 mr-2">자동 분류</span>
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-lg text-base font-semibold mt-2 mr-2">실시간 통계</span>
        </p>

        {/* 다운로드 버튼들 - 깔끔하게 개선 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">지금 바로 시작하세요</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg font-semibold text-lg px-6 py-4 h-auto"
              onClick={() => window.open('https://github.com/productivity-tracker/releases/latest', '_blank')}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🍎</span>
                <span>Mac App</span>
                <span className="text-xs opacity-80">GUI 버전</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-purple-300 text-purple-700 bg-white hover:bg-purple-50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg font-semibold text-lg px-6 py-4 h-auto"
              onClick={handleCopyCommand}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">⚡</span>
                <span>Homebrew</span>
                <span className="text-xs opacity-80">CLI 복사</span>
              </div>
            </Button>
          </div>

          {/* CLI 명령어 */}
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">터미널에서 실행</span>
              <button
                onClick={handleCopyCommand}
                className="text-green-400 hover:text-green-300 text-sm font-medium hover:bg-gray-800 px-3 py-1 rounded transition-all duration-200"
              >
                복사
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <code className="text-green-400 font-mono text-sm">
                $ brew install productivity-tracker
              </code>
            </div>
          </div>
        </div>

        <div className="text-base text-gray-600 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          💡 <span className="font-semibold text-gray-800">베타 기능:</span> AI 기반 생산성 분석 & 맞춤형 <span className="text-green-600 font-semibold">게임화 시스템</span>
        </div>
      </div>

      {/* 오른쪽 실시간 대시보드 */}
      <div className="relative">
        <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer group border border-gray-200">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-4 group-hover:from-purple-100 group-hover:to-blue-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-gray-800">실시간 활동 분석</span>
              <Badge className="bg-green-100 text-green-800 text-xs font-medium">🔴 LIVE</Badge>
            </div>
            
            {/* 현재 활동 상태 */}
            <div className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">현재 활동</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-mono">VS Code</span>
                </div>
              </div>
              
              <div className="text-lg font-bold text-purple-700 mb-2">React 컴포넌트 개발</div>
              <div className="text-sm text-gray-600 mb-3">집중 시간: <span className="font-mono">47분 32초</span></div>
              
              {/* 카테고리별 시간 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-bold text-blue-700">💻 코딩</div>
                  <div className="text-xs text-blue-600 font-mono">3h 24m</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-bold text-purple-700">📝 문서화</div>
                  <div className="text-xs text-purple-600 font-mono">18m</div>
                </div>
              </div>
            </div>

            {/* 시간대별 집중도 꺾은선 그래프 */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">오늘의 집중도 패턴</span>
                <span className="text-xs text-gray-500">9시-21시</span>
              </div>
              
              {/* 그래프 */}
              <div className="relative h-24 mb-3">
                <svg className="w-full h-full" viewBox="0 0 280 80">
                  {/* 그리드 라인 */}
                  <defs>
                    <pattern id="grid" width="20" height="16" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 16" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="280" height="80" fill="url(#grid)" />
                  
                  {/* 꺾은선 그래프 */}
                  <polyline
                    fill="none"
                    stroke="url(#focusGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={focusData.map((point, index) => 
                      `${index * 22 + 10},${70 - (point.focus * 0.6)}`
                    ).join(' ')}
                  />
                  
                  {/* 그라데이션 정의 */}
                  <defs>
                    <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  
                  {/* 데이터 포인트 */}
                  {focusData.map((point, index) => (
                    <circle
                      key={index}
                      cx={index * 22 + 10}
                      cy={70 - (point.focus * 0.6)}
                      r="3"
                      fill="#8b5cf6"
                      className="hover:r-4 transition-all duration-200"
                    />
                  ))}
                </svg>
                
                {/* 최고점 표시 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                  92% (15시)
                </div>
              </div>
              
              {/* 시간대 라벨 */}
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <span>9시</span>
                <span>12시</span>
                <span>15시</span>
                <span>18시</span>
                <span>21시</span>
              </div>
              
              <div className="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
                🎯 오후 2-4시가 가장 집중력이 높아요!
              </div>
            </div>

            {/* 오늘의 리더보드 순위 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">오늘의 순위</span>
                <Badge className="bg-purple-100 text-purple-800 text-xs">🏆 3위</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">🥇 김개발 <span className="text-green-600">(+2↗️)</span></span>
                  <span className="font-bold text-green-600 font-mono">847점</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">🥈 박코더</span>
                  <span className="font-bold text-blue-600 font-mono">792점</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-purple-50 px-2 py-1 rounded">
                  <span className="text-purple-700 font-medium">🥉 나 (당신)</span>
                  <span className="font-bold text-purple-700 font-mono">734점</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
                🔥 김개발을 추월하려면 <span className="font-mono">113점</span> 더 필요!
              </div>
            </div>
          </div>
        </div>
        
        {/* 부유하는 요소들 */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-80 animate-pulse hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center text-white font-bold text-xl shadow-lg">🏆</div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-60 animate-bounce hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center text-white text-lg shadow-lg">⚡</div>
      </div>
    </div>
  );
} 