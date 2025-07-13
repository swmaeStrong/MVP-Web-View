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
      accent: 'rgb(168, 85, 247)',   // 보라색 액센트 텍스트
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
      textAccent: 'text-[rgb(168,85,247)]',
    }
  },
  light: {
    // 배경색
    background: '#ECECEC',           // Bg-[#ECECEC] 233,233,233
    component: 'rgb(255, 255, 255)', // 컴포넌트 bg- 255, 255, 255
    componentSecondary: 'rgb(249, 250, 251)', // 보조 컴포넌트 bg-gray-50
    // 테두리 색상
    border: 'rgb(229, 231, 235)',    // 테두리 색상 gray-200
    borderLight: 'rgb(209, 213, 219)', // 밝은 테두리 색상 gray-300
    // 텍스트 색상
    text: {
      primary: 'rgb(43, 43, 43)',    // 텍스트 43, 43, 43
      secondary: 'rgb(142, 142, 142)', // 회색 텍스트 142,142,142
      accent: 'rgb(147, 51, 234)',   // 보라색 액센트 텍스트 purple-700
    },
    // Tailwind 클래스명
    classes: {
      background: 'bg-[#ECECEC]',
      component: 'bg-white',
      componentSecondary: 'bg-gray-50',
      border: 'border-gray-200',
      borderLight: 'border-gray-300',
      textPrimary: 'text-[rgb(43,43,43)]',
      textSecondary: 'text-[rgb(142,142,142)]',
      textAccent: 'text-purple-700',
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
};

// 카테고리별 통합 컬러 시스템 - 진행바, 배지, 인디케이터 등 모든 UI 요소에 사용
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
  work: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    dot: 'bg-purple-500',
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    buttonGradient: 'from-purple-600 to-violet-600',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    borderGradient: 'from-purple-400 to-violet-400',
    bgOpacity: 'from-purple-600/5 to-violet-600/5',
    solid: '#a855f7', // purple-500
  },
  others: {
    bg: 'bg-gray-400',
    hover: 'hover:bg-gray-500',
    dot: 'bg-gray-400',
    gradient: 'from-gray-500 via-slate-500 to-zinc-500',
    buttonGradient: 'from-gray-500 to-slate-500',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-slate-400',
    bgOpacity: 'from-gray-600/5 to-slate-600/5',
    solid: '#9ca3af', // gray-400
  },
  
  // 주요 작업 카테고리
  Development: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    dot: 'bg-purple-500',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    buttonGradient: 'from-blue-500 to-indigo-500',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400 to-indigo-400',
    bgOpacity: 'from-blue-600/5 to-indigo-600/5',
    solid: '#a855f7', // purple-500
  },
  Documentation: {
    bg: 'bg-indigo-400',
    hover: 'hover:bg-indigo-500',
    dot: 'bg-indigo-400',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    buttonGradient: 'from-green-500 to-emerald-500',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    borderGradient: 'from-green-400 to-emerald-400',
    bgOpacity: 'from-green-600/5 to-emerald-600/5',
    solid: '#818cf8', // indigo-400
  },
  LLM: {
    bg: 'bg-violet-400',
    hover: 'hover:bg-violet-500',
    dot: 'bg-violet-400',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    buttonGradient: 'from-purple-500 to-violet-500',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    borderGradient: 'from-purple-400 to-violet-400',
    bgOpacity: 'from-purple-600/5 to-violet-600/5',
    solid: '#a78bfa', // violet-400
  },
  Design: {
    bg: 'bg-blue-400',
    hover: 'hover:bg-blue-500',
    dot: 'bg-blue-400',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    buttonGradient: 'from-pink-500 to-rose-500',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
    borderGradient: 'from-pink-400 to-rose-400',
    bgOpacity: 'from-pink-600/5 to-rose-600/5',
    solid: '#60a5fa', // blue-400
  },
  
  // 일반 활동 카테고리
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
  Education: {
    bg: 'bg-teal-400',
    hover: 'hover:bg-teal-500',
    dot: 'bg-teal-400',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    buttonGradient: 'from-teal-500 to-cyan-500',
    badgeClass: 'bg-teal-100 text-teal-700 border-teal-200',
    borderGradient: 'from-teal-400 to-cyan-400',
    bgOpacity: 'from-teal-600/5 to-cyan-600/5',
    solid: '#2dd4bf', // teal-400
  },
  Entertainment: {
    bg: 'bg-pink-400',
    hover: 'hover:bg-pink-500',
    dot: 'bg-pink-400',
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    buttonGradient: 'from-red-500 to-rose-500',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    borderGradient: 'from-red-400 to-rose-400',
    bgOpacity: 'from-red-600/5 to-rose-600/5',
    solid: '#f472b6', // pink-400
  },
  'System & Utilities': {
    bg: 'bg-cyan-500',
    hover: 'hover:bg-cyan-600',
    dot: 'bg-cyan-500',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    buttonGradient: 'from-cyan-500 to-blue-500',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400 to-blue-400',
    bgOpacity: 'from-cyan-600/5 to-blue-600/5',
    solid: '#06b6d4', // cyan-500
  },
  SNS: {
    bg: 'bg-amber-400',
    hover: 'hover:bg-amber-500',
    dot: 'bg-amber-400',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    buttonGradient: 'from-cyan-500 to-blue-500',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400 to-blue-400',
    bgOpacity: 'from-cyan-600/5 to-blue-600/5',
    solid: '#fbbf24', // amber-400
  },
  Productivity: {
    bg: 'bg-rose-400',
    hover: 'hover:bg-rose-500',
    dot: 'bg-rose-400',
    gradient: 'from-rose-500 via-pink-500 to-purple-500',
    buttonGradient: 'from-rose-500 to-pink-500',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
    borderGradient: 'from-rose-400 to-pink-400',
    bgOpacity: 'from-rose-600/5 to-pink-600/5',
    solid: '#fb7185', // rose-400
  },
  
  // 레거시 호환성 (소문자)
  development: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    dot: 'bg-purple-500',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    buttonGradient: 'from-blue-500 to-indigo-500',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400 to-indigo-400',
    bgOpacity: 'from-blue-600/5 to-indigo-600/5',
    solid: '#a855f7', // purple-500
  },
  llm: {
    bg: 'bg-violet-400',
    hover: 'hover:bg-violet-500',
    dot: 'bg-violet-400',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    buttonGradient: 'from-purple-500 to-violet-500',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    borderGradient: 'from-purple-400 to-violet-400',
    bgOpacity: 'from-purple-600/5 to-violet-600/5',
    solid: '#a78bfa', // violet-400
  },
  documentation: {
    bg: 'bg-indigo-400',
    hover: 'hover:bg-indigo-500',
    dot: 'bg-indigo-400',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    buttonGradient: 'from-green-500 to-emerald-500',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    borderGradient: 'from-green-400 to-emerald-400',
    bgOpacity: 'from-green-600/5 to-emerald-600/5',
    solid: '#818cf8', // indigo-400
  },
  design: {
    bg: 'bg-blue-400',
    hover: 'hover:bg-blue-500',
    dot: 'bg-blue-400',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    buttonGradient: 'from-pink-500 to-rose-500',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
    borderGradient: 'from-pink-400 to-rose-400',
    bgOpacity: 'from-pink-600/5 to-rose-600/5',
    solid: '#60a5fa', // blue-400
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
    bg: 'bg-pink-400',
    hover: 'hover:bg-pink-500',
    dot: 'bg-pink-400',
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    buttonGradient: 'from-red-500 to-rose-500',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    borderGradient: 'from-red-400 to-rose-400',
    bgOpacity: 'from-red-600/5 to-rose-600/5',
    solid: '#f472b6', // pink-400
  },
  sns: {
    bg: 'bg-amber-400',
    hover: 'hover:bg-amber-500',
    dot: 'bg-amber-400',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    buttonGradient: 'from-cyan-500 to-blue-500',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400 to-blue-400',
    bgOpacity: 'from-cyan-600/5 to-blue-600/5',
    solid: '#fbbf24', // amber-400
  },
  uncategorized: {
    bg: 'bg-gray-400',
    hover: 'hover:bg-gray-500',
    dot: 'bg-gray-400',
    gradient: 'from-gray-500 via-slate-500 to-zinc-500',
    buttonGradient: 'from-gray-500 to-slate-500',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-slate-400',
    bgOpacity: 'from-gray-600/5 to-slate-600/5',
    solid: '#9ca3af', // gray-400
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



