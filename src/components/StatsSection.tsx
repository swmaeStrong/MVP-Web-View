import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';  

const stats = [
  { number: '1,247', label: '활성 개발자', icon: '👨‍💻' },
  { number: '+43%', label: '평균 생산성 향상', icon: '📈' },
  { number: '4.9', label: '사용자 만족도', icon: '⭐' },
  { number: '24/7', label: '실시간 추적', icon: '🔄' }
];

const testimonials = [
  {
    name: '김영현',
    role: '풀스택 개발자',
    content: 'VS Code 사용 패턴을 보니 제가 생각보다 집중력이 부족했네요. 리더보드 덕분에 매일 더 열심히 코딩하게 됐어요!',
    avatar: '김',
    rating: 5
  },
  {
    name: '박동현',
    role: '백엔드 개발자',
    content: '유튜브 시청 시간이 자동으로 분류되는 게 놀라워요. 개발 강의와 그냥 영상이 따로 표시되니까 죄책감이 확 줄었습니다 ㅎㅎ',
    avatar: '박',
    rating: 5
  },
  {
    name: '김정원',
    role: 'iOS 개발자',
    content: '친구들과 경쟁하는게 너무 재미있어요!',
    avatar: '김',
    rating: 5
  }
];

export default function StatsSection() {
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
    <div ref={sectionRef} className="mb-20">
      {/* 통계 섹션 */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 hover:text-purple-700 transition-colors duration-300">
          이미 많은 개발자들이 생산성을 향상시키고 있어요
        </h2>
        <p className="text-lg text-gray-600 mb-8 hover:text-gray-700 transition-colors duration-300">
          실제 사용자 데이터로 검증된 효과
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 border-purple-200 bg-white/90 backdrop-blur hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
                <div className="text-3xl font-bold text-purple-700 mb-2 group-hover:text-purple-800 transition-colors duration-200">{stat.number}</div>
                <div className="text-base text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 사용자 후기 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-2 border-blue-200 bg-white/90 backdrop-blur hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:scale-110 transition-transform duration-200 shadow-md">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-2xl">⭐</span>
                ))}
              </div>
              
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-200 text-base leading-relaxed">
                {testimonial.content}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200">
                  ✅ 인증된 사용자
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA 섹션 */}
      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-purple-700 transition-colors duration-300">
            개발자를 위한 스마트 생산성 추적에 동참하세요
          </h3>
          <p className="text-lg text-gray-700 hover:text-gray-800 transition-colors duration-300">
            IDE부터 리더보드까지, 모든 것이 게임처럼 재미있게! 🎮
          </p>
        </div>
      </div>
    </div>
  );
} 