import React from 'react';

const tools = [
  { name: 'VS Code', color: 'text-blue-600', icon: '💻' },
  { name: 'GitHub', color: 'text-gray-800', icon: '🐙' },
  { name: 'Notion', color: 'text-gray-900', icon: '📝' },
  { name: 'IntelliJ', color: 'text-orange-600', icon: '🛠️' },
  { name: 'Figma', color: 'text-purple-600', icon: '🎨' },
  { name: 'Chrome', color: 'text-green-600', icon: '🌐' },
];

export default function BrandLogos() {
  return (
    <div className='mb-20'>
      <div className='mb-8 text-center'>
        <p className='font-korean mb-4 text-sm text-gray-500'>
          이미 연동 중인 개발 도구들
        </p>
      </div>

      <div className='grid grid-cols-3 items-center gap-6 opacity-70 transition-opacity duration-500 hover:opacity-100 md:grid-cols-6'>
        {tools.map((tool, index) => (
          <div
            key={index}
            className='group flex cursor-pointer flex-col items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-gray-50'
          >
            <div className='mb-2 text-2xl transition-transform duration-300 group-hover:scale-125'>
              {tool.icon}
            </div>
            <div
              className={`${tool.color} font-english text-sm font-semibold transition-all duration-300 hover:scale-105`}
            >
              {tool.name}
            </div>

            {/* 호버 시 나타나는 연결 상태 */}
            <div className='mt-1 h-2 w-2 rounded-full bg-green-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
          </div>
        ))}
      </div>

      {/* 추가 설명 텍스트 */}
      <div className='mt-8 text-center'>
        <p className='font-korean text-sm text-gray-500'>
          더 많은 도구 연동이 곧 추가될 예정입니다 ⚡
        </p>
      </div>
    </div>
  );
}
