import React from 'react';

const tools = [
  { name: 'VS Code', color: 'text-blue-600', icon: '💻' },
  { name: 'GitHub', color: 'text-gray-800', icon: '🐙' },
  { name: 'Notion', color: 'text-gray-900', icon: '📝' },
  { name: 'IntelliJ', color: 'text-orange-600', icon: '🛠️' },
  { name: 'Figma', color: 'text-purple-600', icon: '🎨' },
  { name: 'Chrome', color: 'text-green-600', icon: '🌐' }
];

export default function BrandLogos() {
  return (
    <div className="mb-20">
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500 font-korean mb-4">
          이미 연동 중인 개발 도구들
        </p>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-70 hover:opacity-100 transition-opacity duration-500">
        {tools.map((tool, index) => (
          <div key={index} className="flex flex-col items-center justify-center group cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
            <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">
              {tool.icon}
            </div>
            <div className={`${tool.color} font-semibold text-sm hover:scale-105 transition-all duration-300 font-english`}>
              {tool.name}
            </div>
            
            {/* 호버 시 나타나는 연결 상태 */}
            <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1"></div>
          </div>
        ))}
      </div>
      
      {/* 추가 설명 텍스트 */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 font-korean">
          더 많은 도구 연동이 곧 추가될 예정입니다 ⚡
        </p>
      </div>
    </div>
  );
} 