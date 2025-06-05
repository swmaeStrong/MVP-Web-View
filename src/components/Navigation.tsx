import React from 'react';
import { Button } from '@/shadcn/ui/button';

export default function Navigation() {
  return (  
    <nav className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
          <span className="text-white font-bold text-sm">📊</span>
        </div>
        <span className="text-lg font-display font-semibold text-gray-900 hover:text-purple-700 transition-colors duration-200 font-korean">
          생산성 추적기
        </span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium font-korean">기능</a>
        <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium font-korean">요금제</a>
        <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium font-korean">후기</a>
        <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium font-korean">문의</a>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="font-medium font-korean">
          로그인
        </Button>
        <Button className="btn-primary bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-display font-semibold">
          무료로 시작하기
        </Button>
      </div>
    </nav>
  );
} 