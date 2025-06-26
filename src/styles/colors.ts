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

// 카테고리별 컬러 시스템 - leaderboard와 statistics 통합
export const categoryColors = {
  all: {
    gradient: 'from-slate-600 via-purple-600 to-indigo-600',
    buttonGradient: 'from-slate-600 to-purple-600',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    borderGradient: 'from-slate-400 to-purple-400',
    bgOpacity: 'from-slate-600/5 to-purple-600/5',
    solid: '#6366f1', // indigo-500, 브랜드성+중립적
  },
  DEVELOPMENT: {
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    buttonGradient: 'from-blue-500 to-indigo-500',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    borderGradient: 'from-blue-400 to-indigo-400',
    bgOpacity: 'from-blue-600/5 to-indigo-600/5',
    solid: '#1d4ed8', // blue-700, 더 진한 블루로 변경
  },
  LLM: {
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    buttonGradient: 'from-purple-500 to-violet-500',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    borderGradient: 'from-purple-400 to-violet-400',
    bgOpacity: 'from-purple-600/5 to-violet-600/5',
    solid: '#7c3aed', // violet-600, 좀 더 진한 보라
  },
  Documentation: {
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    buttonGradient: 'from-green-500 to-emerald-500',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    borderGradient: 'from-green-400 to-emerald-400',
    bgOpacity: 'from-green-600/5 to-emerald-600/5',
    solid: '#059669', // emerald-600, 한 톤 다운된 녹색
  },
  Design: {
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    buttonGradient: 'from-pink-500 to-rose-500',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
    borderGradient: 'from-pink-400 to-rose-400',
    bgOpacity: 'from-pink-600/5 to-rose-600/5',
    solid: '#db2777', // pink-600, 고급진 핑크
  },
  Communication: {
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    buttonGradient: 'from-orange-500 to-amber-500',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    borderGradient: 'from-orange-400 to-amber-400',
    bgOpacity: 'from-orange-600/5 to-amber-600/5',
    solid: '#f59e42', // orange-400, 좀 더 밝은 오렌지 (amber는 너무 노랗고 촌스러울 수 있음)
  },
  YouTube: {
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    buttonGradient: 'from-red-500 to-rose-500',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    borderGradient: 'from-red-400 to-rose-400',
    bgOpacity: 'from-red-600/5 to-rose-600/5',
    solid: '#dc2626', // red-600, 더 진한 레드(유튜브 브랜드색과 유사)
  },
  SNS: {
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    buttonGradient: 'from-cyan-500 to-blue-500',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    borderGradient: 'from-cyan-400 to-blue-400',
    bgOpacity: 'from-cyan-600/5 to-blue-600/5',
    solid: '#0ea5e9', // sky-500, cyan보다 조금 더 밝고 세련된 파랑
  },
  Uncategorized: {
    gradient: 'from-gray-500 via-slate-500 to-zinc-500',
    buttonGradient: 'from-gray-500 to-slate-500',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    borderGradient: 'from-gray-400 to-slate-400',
    bgOpacity: 'from-gray-600/5 to-slate-600/5',
    solid: '#71717a', // zinc-500, 더 차분한 회색으로 변경
  },
};

// 순위별 컬러 시스템
export const rankColors = {
  1: {
    title: '1위',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    ringColor: 'ring-yellow-400',
    shadowColor: 'shadow-yellow-200',
    avatarClass: 'bg-yellow-100 text-yellow-800',
  },
  2: {
    title: '2위',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    ringColor: 'ring-gray-400',
    shadowColor: 'shadow-gray-200',
    avatarClass: 'bg-gray-100 text-gray-800',
  },
  3: {
    title: '3위',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    ringColor: 'ring-amber-400',
    shadowColor: 'shadow-amber-200',
    avatarClass: 'bg-amber-100 text-amber-800',
  },
  4: {
    title: '4위',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    ringColor: 'ring-red-400',
    shadowColor: 'shadow-red-200',
    avatarClass: 'bg-red-100 text-red-800',
  },
  5: {
    title: '5위',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    ringColor: 'ring-blue-400',
    shadowColor: 'shadow-blue-200',
    avatarClass: 'bg-blue-100 text-blue-800',
  },
  6: {
    title: '6위',
    textColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    ringColor: 'ring-cyan-400',
    shadowColor: 'shadow-cyan-200',
    avatarClass: 'bg-cyan-100 text-cyan-800',
  },
  7: {
    title: '7위',
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    ringColor: 'ring-indigo-400',
    shadowColor: 'shadow-indigo-200',
    avatarClass: 'bg-indigo-100 text-indigo-800',
  },
  8: {
    title: '8위',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    ringColor: 'ring-purple-400',
    shadowColor: 'shadow-purple-200',
    avatarClass: 'bg-purple-100 text-purple-800',
  },
  9: {
    title: '9위',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    ringColor: 'ring-pink-400',
    shadowColor: 'shadow-pink-200',
    avatarClass: 'bg-pink-100 text-pink-800',
  },
  10: {
    title: '10위',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    ringColor: 'ring-green-400',
    shadowColor: 'shadow-green-200',
    avatarClass: 'bg-green-100 text-green-800',
  },
};

// 확장 순위 컬러 (11위~)
export const extendedRankColors = {
  expert: {
    title: '상위권',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    ringColor: 'ring-orange-400',
    shadowColor: 'shadow-orange-200',
    avatarClass: 'bg-orange-100 text-orange-800',
  },
  challenger: {
    title: '중위권',
    textColor: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    ringColor: 'ring-teal-400',
    shadowColor: 'shadow-teal-200',
    avatarClass: 'bg-teal-100 text-teal-800',
  },
  rookie: {
    title: '참가자',
    textColor: 'text-lime-600',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-200',
    ringColor: 'ring-lime-400',
    shadowColor: 'shadow-lime-200',
    avatarClass: 'bg-lime-100 text-lime-800',
  },
};
