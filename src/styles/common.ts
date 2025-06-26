// 공통 레이아웃 클래스
export const layout = {
  // 컨테이너
  container: {
    default: 'container mx-auto px-4',
    wide: 'container mx-auto px-6',
    narrow: 'max-w-4xl mx-auto px-4',
    full: 'w-full max-w-full px-4',
  },

  // 그리드 시스템
  grid: {
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    leaderboard:
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    categories: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    auto: 'grid grid-cols-auto-fit',
  },

  // 플렉스 레이아웃
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
    wrap: 'flex flex-wrap',
    responsive: 'flex flex-col sm:flex-row',
  },

  // 간격
  spacing: {
    section: 'space-y-8',
    card: 'space-y-4',
    tight: 'space-y-2',
    loose: 'space-y-12',
    horizontal: 'space-x-4',
    responsiveY: 'space-y-4 sm:space-y-6 lg:space-y-8',
    responsiveX: 'space-x-2 sm:space-x-4 lg:space-x-6',
  },
};

// 반응형 텍스트 크기
export const typography = {
  // 제목
  heading: {
    hero: 'text-4xl sm:text-5xl lg:text-6xl font-bold',
    h1: 'text-3xl sm:text-4xl font-bold',
    h2: 'text-2xl sm:text-3xl font-bold',
    h3: 'text-xl sm:text-2xl font-semibold',
    h4: 'text-lg sm:text-xl font-semibold',
    h5: 'text-base sm:text-lg font-medium',
    h6: 'text-sm sm:text-base font-medium',
  },

  // 본문
  body: {
    large: 'text-lg sm:text-xl',
    default: 'text-base',
    small: 'text-sm',
    xs: 'text-xs',
    responsive: 'text-sm sm:text-base lg:text-lg',
  },

  // 특수 용도
  special: {
    caption: 'text-xs text-gray-500',
    label: 'text-sm font-medium text-gray-700',
    error: 'text-sm text-red-600',
    success: 'text-sm text-green-600',
    muted: 'text-gray-500',
    strong: 'font-semibold text-gray-900',
  },
};

// 그림자 효과
export const shadows = {
  // 기본 그림자
  default: 'shadow-lg',
  small: 'shadow-sm',
  medium: 'shadow-md',
  large: 'shadow-xl',
  huge: 'shadow-2xl',

  // 특수 그림자
  inner: 'shadow-inner',
  none: 'shadow-none',
  colored: {
    purple: 'shadow-lg shadow-purple-500/25',
    blue: 'shadow-lg shadow-blue-500/25',
    pink: 'shadow-lg shadow-pink-500/25',
    green: 'shadow-lg shadow-green-500/25',
  },

  // 반응형 그림자
  responsive: 'shadow-sm sm:shadow-md lg:shadow-lg',
  hover: 'shadow-md hover:shadow-xl',
};

// 테두리 및 둥근 모서리
export const borders = {
  // 둥근 모서리
  rounded: {
    none: 'rounded-none',
    small: 'rounded-sm',
    default: 'rounded-md',
    large: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
    responsive: 'rounded-md sm:rounded-lg',
  },

  // 테두리 스타일
  border: {
    default: 'border border-gray-200',
    thick: 'border-2 border-gray-300',
    colored: 'border border-purple-200',
    none: 'border-0',
    dashed: 'border border-dashed border-gray-300',
  },

  // 링 효과
  ring: {
    default: 'ring-1 ring-gray-200',
    focus: 'ring-2 ring-purple-500 ring-offset-2',
    error: 'ring-2 ring-red-500 ring-offset-2',
    success: 'ring-2 ring-green-500 ring-offset-2',
  },
};

// 버튼 스타일 (design-system.ts의 buttonSystem 사용 권장)
// 레거시 지원을 위해 유지하되, 새로운 컴포넌트는 design-system.ts 사용
export const buttons = {
  // 기본 버튼 (design-system.ts로 이동됨)
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',

  // 크기별 (design-system.ts의 buttonSystem.sizes 사용 권장)
  size: {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  },

  // 스타일별 (design-system.ts의 buttonSystem.variants 사용 권장)
  variant: {
    primary:
      'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  },
};

// 카드 스타일 (design-system.ts의 cardSystem 사용 권장)
// 레거시 지원을 위해 유지하되, 새로운 컴포넌트는 design-system.ts 사용
export const cards = {
  // 기본 카드 (design-system.ts로 이동됨)
  base: 'bg-white rounded-lg shadow-md overflow-hidden',

  // 카드 변형 (design-system.ts의 cardSystem.variants 사용 권장)
  variant: {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    elevated: 'bg-white rounded-lg shadow-lg',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg',
    gradient: 'bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md',
    colored: 'bg-gradient-to-br rounded-lg shadow-lg text-white',
  },

  // 카드 패딩
  padding: {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    responsive: 'p-4 sm:p-6 lg:p-8',
  },

  // 호버 효과 (design-system.ts의 cardSystem.hover 사용 권장)
  hover: {
    lift: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-200',
    glow: 'hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200',
    scale: 'hover:scale-105 transition-transform duration-200',
  },
};

// 입력 필드
export const inputs = {
  // 기본 스타일
  base: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500',

  // 크기별
  size: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  },

  // 상태별
  state: {
    default: 'border-gray-300 focus:border-purple-500 focus:ring-purple-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
    disabled: 'bg-gray-100 cursor-not-allowed opacity-50',
  },
};

// 배지/태그 (design-system.ts의 badgeSystem 사용 권장)
// 레거시 지원을 위해 유지하되, 새로운 컴포넌트는 design-system.ts 사용
export const badges = {
  // 기본 스타일 (design-system.ts로 이동됨)
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',

  // 색상별 (design-system.ts의 badgeSystem.colors 사용 권장)
  color: {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
  },

  // 크기별
  size: {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  },
};

// 백드롭 및 오버레이
export const overlays = {
  backdrop: 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm',
  modal: 'fixed inset-0 z-50 overflow-y-auto',
  glass: 'backdrop-blur-md bg-white/10 border border-white/20',
  dim: 'bg-black/20',
  loading:
    'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center',
};
