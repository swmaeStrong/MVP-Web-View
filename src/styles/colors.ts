// 테마 컬러 시스템 (다크모드 & 화이트모드)
export const themeColors = {
  dark: {
    // 배경색
    background: '#383838',           // bg-[#383838]
    component: '#1C1C1C',           // 컴포넌트 bg-[#1C1C1C]
    componentSecondary: '#2D2D2D',  // 보조 컴포넌트 bg-[#2D2D2D]
    // 테두리 색상
    border: 'rgb(80, 80, 80)',      // 테두리 색상 (더 밝게)
    borderLight: 'rgb(120, 120, 120)', // 밝은 테두리 색상 (더 밝게)
    // 텍스트 색상
    text: {
      primary: 'rgb(220, 220, 220)', // 밝은 텍스트 220,220,220
      secondary: 'rgb(153, 153, 153)', // 약간 어두운 153,153,153
      accent: '#3F72AF',   // 블루 액센트 텍스트
    },
    // Tailwind 클래스명
    classes: {
      background: 'bg-[#383838]',
      component: 'bg-[#1C1C1C]',
      componentSecondary: 'bg-[#2D2D2D]',
      border: 'border-[rgb(80,80,80)]',
      borderLight: 'border-[rgb(120,120,120)]',
      textPrimary: 'text-[rgb(220,220,220)]',
      textSecondary: 'text-[rgb(153,153,153)]',
      textAccent: 'text-[#3F72AF]',
    }
  },
  light: {
    // 배경색
    background: '#f5fafc',           // 연한 파란빛 회색 배경
    component: 'rgb(255, 255, 255)', // 순백색 컴포넌트
    componentSecondary: 'rgb(251, 252, 253)', // 매우 연한 파란빛 회색
    // 테두리 색상
    border: 'rgb(226, 232, 240)',    // 파란빛 회색 테두리 (slate-200)
    borderLight: 'rgb(203, 213, 225)', // 연한 파란빛 회색 테두리 (slate-300)
    // 텍스트 색상
    text: {
      primary: 'rgb(30, 41, 59)',    // 진한 슬레이트 색상 (slate-800)
      secondary: 'rgb(100, 116, 139)', // 중간 슬레이트 색상 (slate-500)
      accent: '#3F72AF',    // 네이비 액센트 텍스트
    },
    // Tailwind 클래스명
    classes: {
      background: 'bg-[#f5fafc]',
      component: 'bg-white',
      componentSecondary: 'bg-[#fbfcfd]',
      border: 'border-slate-200',
      borderLight: 'border-slate-300',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      textAccent: 'text-[#3F72AF]',
    }
  },
  // 공통 색상
  common: {
    warning: 'rgb(217, 72, 48)',     // 경고 text 217,72,48
    classes: {
      warning: 'text-[rgb(217,72,48)]',
    }
  }
};

// 메인 브랜드 컬러
export const brandColors = {
  primary: {
    gradient: 'from-purple-600 to-blue-600',
    gradientHover: 'from-purple-700 to-blue-700',
    solid: 'purple-600',
    light: 'purple-50',
    text: 'purple-700',
  },
  secondary: {
    gradient: 'from-pink-500 to-rose-500',
    gradientHover: 'from-pink-600 to-rose-600',
    solid: 'pink-500',
    light: 'pink-50',
    text: 'pink-700',
  },
  accent: {
    solid: '#3F72AF',
    bg: 'bg-[#3F72AF]',
    text: 'text-[#3F72AF]',
    border: 'border-[#3F72AF]',
    ring: 'ring-[#3F72AF]',
    hover: 'hover:bg-[#3F72AF]',
    light: 'bg-[#3F72AF]/10',
    lightBorder: 'border-[#3F72AF]/30',
  },
};

// SwiftUI 스타일 카테고리별 색상 시스템 - 모든 UI 요소에 사용
export const categoryColors = {
  // 특별 카테고리
  all: {
    bg: 'bg-slate-400',
    hover: 'hover:bg-slate-500',
    dot: 'bg-slate-400',
    gradient: 'from-slate-600 via-purple-600 to-indigo-600',
    buttonGradient: 'from-slate-600 to-purple-600',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    borderGradient: 'from-slate-400 to-purple-400',
    bgOpacity: 'from-slate-600/5 to-purple-600/5',
    solid: '#94a3b8', // slate-400
  },
  
  // Work / Productivity 계열 (블루 톤)
  work: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    dot: 'bg-blue-500',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    buttonGradient: 'from-blue-500 to-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400 to-blue-500',
    bgOpacity: 'from-blue-600/5 to-blue-600/5',
    solid: '#007AFF', // SwiftUI blue
  },
  Development: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    dot: 'bg-blue-500',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    buttonGradient: 'from-blue-500 to-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400 to-blue-500',
    bgOpacity: 'from-blue-600/5 to-blue-600/5',
    solid: '#007AFF', // SwiftUI blue
  },
  Productivity: {
    bg: 'bg-indigo-500/60',
    hover: 'hover:bg-indigo-600/60',
    dot: 'bg-indigo-500/60',
    gradient: 'from-indigo-500/60 via-indigo-600/60 to-purple-600/60',
    buttonGradient: 'from-indigo-500/60 to-indigo-600/60',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    borderGradient: 'from-indigo-400/60 to-indigo-500/60',
    bgOpacity: 'from-indigo-600/5 to-indigo-600/5',
    solid: '#4B008299', // SwiftUI indigo with opacity
  },
  Documentation: {
    bg: 'bg-blue-500/70',
    hover: 'hover:bg-blue-600/70',
    dot: 'bg-blue-500/70',
    gradient: 'from-blue-500/70 via-blue-600/70 to-indigo-600/70',
    buttonGradient: 'from-blue-500/70 to-blue-600/70',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400/70 to-blue-500/70',
    bgOpacity: 'from-blue-600/5 to-blue-600/5',
    solid: '#007AF2', // SwiftUI blue with slight variation
  },
  Meetings: {
    bg: 'bg-indigo-500',
    hover: 'hover:bg-indigo-600',
    dot: 'bg-indigo-500',
    gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
    buttonGradient: 'from-indigo-500 to-indigo-600',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    borderGradient: 'from-indigo-400 to-indigo-500',
    bgOpacity: 'from-indigo-600/5 to-indigo-600/5',
    solid: '#4B0082', // SwiftUI indigo
  },
  Marketing: {
    bg: 'bg-cyan-500',
    hover: 'hover:bg-cyan-600',
    dot: 'bg-cyan-500',
    gradient: 'from-cyan-500 via-cyan-600 to-blue-600',
    buttonGradient: 'from-cyan-500 to-cyan-600',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400 to-cyan-500',
    bgOpacity: 'from-cyan-600/5 to-cyan-600/5',
    solid: '#00A8C7', // SwiftUI cyan
  },
  LLM: {
    bg: 'bg-cyan-500/80',
    hover: 'hover:bg-cyan-600/80',
    dot: 'bg-cyan-500/80',
    gradient: 'from-cyan-500/80 via-cyan-600/80 to-blue-600/80',
    buttonGradient: 'from-cyan-500/80 to-cyan-600/80',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400/80 to-cyan-500/80',
    bgOpacity: 'from-cyan-600/5 to-cyan-600/5',
    solid: '#00A8C7CC', // SwiftUI cyan with opacity
  },
  Education: {
    bg: 'bg-blue-500/50',
    hover: 'hover:bg-blue-600/50',
    dot: 'bg-blue-500/50',
    gradient: 'from-blue-500/50 via-blue-600/50 to-indigo-600/50',
    buttonGradient: 'from-blue-500/50 to-blue-600/50',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400/50 to-blue-500/50',
    bgOpacity: 'from-blue-600/5 to-blue-600/5',
    solid: '#007AFA80', // SwiftUI blue with opacity
  },
  
  // AFK / Uncategorized (그레이 톤)
  AFK: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    dot: 'bg-gray-500',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    buttonGradient: 'from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-gray-500',
    bgOpacity: 'from-gray-600/5 to-gray-600/5',
    solid: '#8E8E93', // SwiftUI gray
  },
  Uncategorized: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    dot: 'bg-gray-500',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    buttonGradient: 'from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-gray-500',
    bgOpacity: 'from-gray-600/5 to-gray-600/5',
    solid: '#8E8E93', // SwiftUI gray
  },
  Unknown: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    dot: 'bg-gray-500',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    buttonGradient: 'from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-gray-500',
    bgOpacity: 'from-gray-600/5 to-gray-600/5',
    solid: '#8E8E93', // SwiftUI gray
  },
  others: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    dot: 'bg-gray-500',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    buttonGradient: 'from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-gray-500',
    bgOpacity: 'from-gray-600/5 to-gray-600/5',
    solid: '#8E8E93', // SwiftUI gray
  },
  
  // Entertainment 계열 (레드/오렌지/옐로우 톤)
  Entertainment: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    dot: 'bg-red-500',
    gradient: 'from-red-500 via-red-600 to-rose-600',
    buttonGradient: 'from-red-500 to-red-600',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    borderGradient: 'from-red-400 to-red-500',
    bgOpacity: 'from-red-600/5 to-red-600/5',
    solid: '#FF3B30', // SwiftUI red
  },
  SNS: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    dot: 'bg-orange-500',
    gradient: 'from-orange-500 via-orange-600 to-amber-600',
    buttonGradient: 'from-orange-500 to-orange-600',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    borderGradient: 'from-orange-400 to-orange-500',
    bgOpacity: 'from-orange-600/5 to-orange-600/5',
    solid: '#FF9500', // SwiftUI orange
  },
  Game: {
    bg: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    dot: 'bg-yellow-500',
    gradient: 'from-yellow-500 via-yellow-600 to-amber-600',
    buttonGradient: 'from-yellow-500 to-yellow-600',
    badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    borderGradient: 'from-yellow-400 to-yellow-500',
    bgOpacity: 'from-yellow-600/5 to-yellow-600/5',
    solid: '#FFCC00', // SwiftUI yellow
  },
  'Video Editing': {
    bg: 'bg-pink-500',
    hover: 'hover:bg-pink-600',
    dot: 'bg-pink-500',
    gradient: 'from-pink-500 via-pink-600 to-rose-600',
    buttonGradient: 'from-pink-500 to-pink-600',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
    borderGradient: 'from-pink-400 to-pink-500',
    bgOpacity: 'from-pink-600/5 to-pink-600/5',
    solid: '#FF2D55', // SwiftUI pink
  },
  Design: {
    bg: 'bg-teal-500',
    hover: 'hover:bg-teal-600',
    dot: 'bg-teal-500',
    gradient: 'from-teal-500 via-teal-600 to-cyan-600',
    buttonGradient: 'from-teal-500 to-teal-600',
    badgeClass: 'bg-teal-100 text-teal-700 border-teal-200',
    borderGradient: 'from-teal-400 to-teal-500',
    bgOpacity: 'from-teal-600/5 to-teal-600/5',
    solid: '#00C7AF', // SwiftUI mint
  },
  
  // 유틸 / 시스템 계열
  'System & Utilities': {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    dot: 'bg-purple-500',
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    buttonGradient: 'from-purple-500 to-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    borderGradient: 'from-purple-400 to-purple-500',
    bgOpacity: 'from-purple-600/5 to-purple-600/5',
    solid: '#AF52DE', // SwiftUI purple
  },
  'File Management': {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    dot: 'bg-green-500',
    gradient: 'from-green-500 via-green-600 to-emerald-600',
    buttonGradient: 'from-green-500 to-green-600',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    borderGradient: 'from-green-400 to-green-500',
    bgOpacity: 'from-green-600/5 to-green-600/5',
    solid: '#34C759', // SwiftUI green
  },
  'E-commerce & Shopping': {
    bg: 'bg-teal-500/80',
    hover: 'hover:bg-teal-600/80',
    dot: 'bg-teal-500/80',
    gradient: 'from-teal-500/80 via-teal-600/80 to-cyan-600/80',
    buttonGradient: 'from-teal-500/80 to-teal-600/80',
    badgeClass: 'bg-teal-100 text-teal-700 border-teal-200',
    borderGradient: 'from-teal-400/80 to-teal-500/80',
    bgOpacity: 'from-teal-600/5 to-teal-600/5',
    solid: '#00C7AFCC', // SwiftUI mint with opacity
  },
  Finance: {
    bg: 'bg-amber-700',
    hover: 'hover:bg-amber-800',
    dot: 'bg-amber-700',
    gradient: 'from-amber-700 via-amber-800 to-yellow-800',
    buttonGradient: 'from-amber-700 to-amber-800',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    borderGradient: 'from-amber-600 to-amber-700',
    bgOpacity: 'from-amber-700/5 to-amber-700/5',
    solid: '#A2845E', // SwiftUI brown
  },
  
  // 추가 카테고리 (기존 호환성 유지)
  Communication: {
    bg: 'bg-emerald-400',
    hover: 'hover:bg-emerald-500',
    dot: 'bg-emerald-400',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    buttonGradient: 'from-orange-500 to-amber-500',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    borderGradient: 'from-orange-400 to-amber-400',
    bgOpacity: 'from-orange-600/5 to-amber-600/5',
    solid: '#34d399', // emerald-400
  },
  
  // 레거시 호환성 (소문자)
  development: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    dot: 'bg-blue-500',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    buttonGradient: 'from-blue-500 to-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400 to-blue-500',
    bgOpacity: 'from-blue-600/5 to-blue-600/5',
    solid: '#007AFF', // SwiftUI blue
  },
  productivity: {
    bg: 'bg-indigo-500/60',
    hover: 'hover:bg-indigo-600/60',
    dot: 'bg-indigo-500/60',
    gradient: 'from-indigo-500/60 via-indigo-600/60 to-purple-600/60',
    buttonGradient: 'from-indigo-500/60 to-indigo-600/60',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    borderGradient: 'from-indigo-400/60 to-indigo-500/60',
    bgOpacity: 'from-indigo-600/5 to-indigo-600/5',
    solid: '#4B008299', // SwiftUI indigo with opacity
  },
  documentation: {
    bg: 'bg-blue-500/70',
    hover: 'hover:bg-blue-600/70',
    dot: 'bg-blue-500/70',
    gradient: 'from-blue-500/70 via-blue-600/70 to-indigo-600/70',
    buttonGradient: 'from-blue-500/70 to-blue-600/70',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400/70 to-blue-500/70',
    bgOpacity: 'from-blue-600/5 to-blue-600/5',
    solid: '#007AF2', // SwiftUI blue with slight variation
  },
  meetings: {
    bg: 'bg-indigo-500',
    hover: 'hover:bg-indigo-600',
    dot: 'bg-indigo-500',
    gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
    buttonGradient: 'from-indigo-500 to-indigo-600',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    borderGradient: 'from-indigo-400 to-indigo-500',
    bgOpacity: 'from-indigo-600/5 to-indigo-600/5',
    solid: '#4B0082', // SwiftUI indigo
  },
  marketing: {
    bg: 'bg-cyan-500',
    hover: 'hover:bg-cyan-600',
    dot: 'bg-cyan-500',
    gradient: 'from-cyan-500 via-cyan-600 to-blue-600',
    buttonGradient: 'from-cyan-500 to-cyan-600',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400 to-cyan-500',
    bgOpacity: 'from-cyan-600/5 to-cyan-600/5',
    solid: '#00A8C7', // SwiftUI cyan
  },
  llm: {
    bg: 'bg-cyan-500/80',
    hover: 'hover:bg-cyan-600/80',
    dot: 'bg-cyan-500/80',
    gradient: 'from-cyan-500/80 via-cyan-600/80 to-blue-600/80',
    buttonGradient: 'from-cyan-500/80 to-cyan-600/80',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400/80 to-cyan-500/80',
    bgOpacity: 'from-cyan-600/5 to-cyan-600/5',
    solid: '#00A8C7CC', // SwiftUI cyan with opacity
  },
  education: {
    bg: 'bg-blue-500/50',
    hover: 'hover:bg-blue-600/50',
    dot: 'bg-blue-500/50',
    gradient: 'from-blue-500/50 via-blue-600/50 to-indigo-600/50',
    buttonGradient: 'from-blue-500/50 to-blue-600/50',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400/50 to-blue-500/50',
    bgOpacity: 'from-blue-600/5 to-blue-600/5',
    solid: '#007AFA80', // SwiftUI blue with opacity
  },
  afk: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    dot: 'bg-gray-500',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    buttonGradient: 'from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-gray-500',
    bgOpacity: 'from-gray-600/5 to-gray-600/5',
    solid: '#8E8E93', // SwiftUI gray
  },
  uncategorized: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    dot: 'bg-gray-500',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    buttonGradient: 'from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-gray-500',
    bgOpacity: 'from-gray-600/5 to-gray-600/5',
    solid: '#8E8E93', // SwiftUI gray
  },
  unknown: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    dot: 'bg-gray-500',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    buttonGradient: 'from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-gray-500',
    bgOpacity: 'from-gray-600/5 to-gray-600/5',
    solid: '#8E8E93', // SwiftUI gray
  },
  entertainment: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    dot: 'bg-red-500',
    gradient: 'from-red-500 via-red-600 to-rose-600',
    buttonGradient: 'from-red-500 to-red-600',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    borderGradient: 'from-red-400 to-red-500',
    bgOpacity: 'from-red-600/5 to-red-600/5',
    solid: '#FF3B30', // SwiftUI red
  },
  sns: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    dot: 'bg-orange-500',
    gradient: 'from-orange-500 via-orange-600 to-amber-600',
    buttonGradient: 'from-orange-500 to-orange-600',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    borderGradient: 'from-orange-400 to-orange-500',
    bgOpacity: 'from-orange-600/5 to-orange-600/5',
    solid: '#FF9500', // SwiftUI orange
  },
  game: {
    bg: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    dot: 'bg-yellow-500',
    gradient: 'from-yellow-500 via-yellow-600 to-amber-600',
    buttonGradient: 'from-yellow-500 to-yellow-600',
    badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    borderGradient: 'from-yellow-400 to-yellow-500',
    bgOpacity: 'from-yellow-600/5 to-yellow-600/5',
    solid: '#FFCC00', // SwiftUI yellow
  },
  'video editing': {
    bg: 'bg-pink-500',
    hover: 'hover:bg-pink-600',
    dot: 'bg-pink-500',
    gradient: 'from-pink-500 via-pink-600 to-rose-600',
    buttonGradient: 'from-pink-500 to-pink-600',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
    borderGradient: 'from-pink-400 to-pink-500',
    bgOpacity: 'from-pink-600/5 to-pink-600/5',
    solid: '#FF2D55', // SwiftUI pink
  },
  design: {
    bg: 'bg-teal-500',
    hover: 'hover:bg-teal-600',
    dot: 'bg-teal-500',
    gradient: 'from-teal-500 via-teal-600 to-cyan-600',
    buttonGradient: 'from-teal-500 to-teal-600',
    badgeClass: 'bg-teal-100 text-teal-700 border-teal-200',
    borderGradient: 'from-teal-400 to-teal-500',
    bgOpacity: 'from-teal-600/5 to-teal-600/5',
    solid: '#00C7AF', // SwiftUI mint
  },
  'system & utilities': {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    dot: 'bg-purple-500',
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    buttonGradient: 'from-purple-500 to-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    borderGradient: 'from-purple-400 to-purple-500',
    bgOpacity: 'from-purple-600/5 to-purple-600/5',
    solid: '#AF52DE', // SwiftUI purple
  },
  'file management': {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    dot: 'bg-green-500',
    gradient: 'from-green-500 via-green-600 to-emerald-600',
    buttonGradient: 'from-green-500 to-green-600',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    borderGradient: 'from-green-400 to-green-500',
    bgOpacity: 'from-green-600/5 to-green-600/5',
    solid: '#34C759', // SwiftUI green
  },
  'e-commerce & shopping': {
    bg: 'bg-teal-500/80',
    hover: 'hover:bg-teal-600/80',
    dot: 'bg-teal-500/80',
    gradient: 'from-teal-500/80 via-teal-600/80 to-cyan-600/80',
    buttonGradient: 'from-teal-500/80 to-teal-600/80',
    badgeClass: 'bg-teal-100 text-teal-700 border-teal-200',
    borderGradient: 'from-teal-400/80 to-teal-500/80',
    bgOpacity: 'from-teal-600/5 to-teal-600/5',
    solid: '#00C7AFCC', // SwiftUI mint with opacity
  },
  finance: {
    bg: 'bg-amber-700',
    hover: 'hover:bg-amber-800',
    dot: 'bg-amber-700',
    gradient: 'from-amber-700 via-amber-800 to-yellow-800',
    buttonGradient: 'from-amber-700 to-amber-800',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    borderGradient: 'from-amber-600 to-amber-700',
    bgOpacity: 'from-amber-700/5 to-amber-700/5',
    solid: '#A2845E', // SwiftUI brown
  },
  communication: {
    bg: 'bg-emerald-400',
    hover: 'hover:bg-emerald-500',
    dot: 'bg-emerald-400',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    buttonGradient: 'from-orange-500 to-amber-500',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    borderGradient: 'from-orange-400 to-amber-400',
    bgOpacity: 'from-orange-600/5 to-amber-600/5',
    solid: '#34d399', // emerald-400
  },
  youtube: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    dot: 'bg-red-500',
    gradient: 'from-red-500 via-red-600 to-rose-600',
    buttonGradient: 'from-red-500 to-red-600',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    borderGradient: 'from-red-400 to-red-500',
    bgOpacity: 'from-red-600/5 to-red-600/5',
    solid: '#FF3B30', // SwiftUI red (same as Entertainment)
  },
  
  // 기본값
  default: {
    bg: 'bg-slate-400',
    hover: 'hover:bg-slate-500',
    dot: 'bg-slate-400',
    gradient: 'from-gray-500 via-slate-500 to-zinc-500',
    buttonGradient: 'from-gray-500 to-slate-500',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-slate-400',
    bgOpacity: 'from-gray-600/5 to-slate-600/5',
    solid: '#94a3b8', // slate-400
  },
};

// 세션 타임라인 색상 시스템
export const sessionTimelineColors = {
  work: {
    hex: '#3F72AF',
    bg: 'bg-[#3F72AF]',
    text: 'text-[#3F72AF]',
  },
  distraction: {
    hex: '#C2D1E5',
    bg: 'bg-[#C2D1E5]',
    text: 'text-[#C2D1E5]',
  },
  afk: {
    hex: '#939397',
    bg: 'bg-[#939397]',
    text: 'text-[#939397]',
  },
};

// 스트릭/활동 색상 시스템
export const streakColors = {
  active: {
    hex: '#3F72AF',
    bg: 'bg-[#3F72AF]',
    text: 'text-[#3F72AF]',
  },
  today: {
    hex: '#3F72AF',
    bg: 'bg-[#3F72AF]',
    text: 'text-[#3F72AF]',
  },
  past: {
    hex: '#A8C5E8', // 연한 파란색
    bg: 'bg-[#A8C5E8]',
    text: 'text-[#A8C5E8]',
  },
};



