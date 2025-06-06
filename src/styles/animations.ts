// 기본 애니메이션 효과
export const animations = {
  // 트랜지션
  transition: {
    default: 'transition-all duration-300 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
    smooth: 'transition-all duration-300 ease-out',
    bounce: 'transition-transform duration-300 ease-bounce',
    scale: 'transition-transform duration-200 hover:scale-105',
    scaleHover: 'transform hover:scale-105 transition-transform duration-200',
  },

  // 호버 효과
  hover: {
    lift: 'hover:shadow-xl hover:-translate-y-1',
    glow: 'hover:shadow-lg hover:shadow-purple-500/25',
    scale: 'hover:scale-105',
    scaleSmall: 'hover:scale-102',
    brightness: 'hover:brightness-110',
    opacity: 'hover:opacity-80',
    rotate: 'hover:rotate-1',
    slideUp: 'hover:-translate-y-2',
  },

  // 펄스 효과
  pulse: {
    default: 'animate-pulse',
    fast: 'animate-pulse duration-1000',
    slow: 'animate-pulse duration-3000',
    ping: 'animate-ping',
    bounce: 'animate-bounce',
  },

  // 커스텀 애니메이션
  custom: {
    float: 'animate-float',
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in',
    shimmer: 'animate-shimmer',
    countUp: 'animate-count-up',
    confetti: 'animate-confetti',
  },

  // 실시간 표시기
  live: {
    dot: 'relative inline-flex rounded-full h-3 w-3 bg-red-500',
    ping: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75',
    container: 'flex items-center space-x-2',
    text: 'text-gray-600',
  },

  // 로딩 효과
  loading: {
    spinner: 'animate-spin rounded-full h-6 w-6 border-b-2 border-white',
    dots: 'animate-pulse flex space-x-1',
    skeleton: 'animate-pulse bg-gray-200 rounded',
    shimmer:
      'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200',
  },
}

// 커스텀 CSS 애니메이션 (Tailwind config에 추가할 내용)
export const customAnimations = {
  keyframes: {
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    'fade-in': {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0px)' },
    },
    'slide-in': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0%)' },
    },
    shimmer: {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
    'count-up': {
      '0%': { transform: 'scale(0.8)', opacity: '0' },
      '50%': { transform: 'scale(1.1)' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    confetti: {
      '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
      '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
      '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' },
    },
  },
  animation: {
    float: 'float 3s ease-in-out infinite',
    'fade-in': 'fade-in 0.5s ease-out',
    'slide-in': 'slide-in 0.3s ease-out',
    shimmer: 'shimmer 2s linear infinite',
    'count-up': 'count-up 0.6s ease-out',
    confetti: 'confetti 3s ease-in-out',
  },
}

// 인터랙션 효과
export const interactions = {
  // 클릭 효과
  click: {
    scale: 'active:scale-95',
    pulse: 'active:animate-pulse',
    bounce: 'active:animate-bounce',
  },

  // 포커스 효과
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
    glow: 'focus:shadow-lg focus:shadow-purple-500/50',
    border: 'focus:border-purple-500',
  },

  // 상태 변화
  state: {
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    loading: 'cursor-wait opacity-75',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  },
}

// 진입/퇴장 애니메이션
export const enterExit = {
  fade: {
    enter: 'transition-opacity duration-300 ease-in-out',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'transition-opacity duration-200 ease-in-out',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },

  scale: {
    enter: 'transition-transform duration-300 ease-in-out',
    enterFrom: 'scale-95 opacity-0',
    enterTo: 'scale-100 opacity-100',
    leave: 'transition-transform duration-200 ease-in-out',
    leaveFrom: 'scale-100 opacity-100',
    leaveTo: 'scale-95 opacity-0',
  },

  slide: {
    enter: 'transition-transform duration-300 ease-in-out',
    enterFrom: 'translate-y-4 opacity-0',
    enterTo: 'translate-y-0 opacity-100',
    leave: 'transition-transform duration-200 ease-in-out',
    leaveFrom: 'translate-y-0 opacity-100',
    leaveTo: '-translate-y-4 opacity-0',
  },
}
