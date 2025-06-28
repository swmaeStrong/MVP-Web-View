// 통합 디자인 시스템 정의
// 모든 컴포넌트에서 일관된 스타일을 위한 중앙화된 설정
// shadcn/ui 컴포넌트와 커스텀 컴포넌트의 스타일을 통합 관리

// 버튼 통합 스타일 시스템 (shadcn/ui와 통합)
export const buttonSystem = {
  // 기본 스타일
  base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
  
  // 크기별 스타일
  sizes: {
    sm: 'h-8 rounded-md gap-1.5 px-3',
    default: 'h-9 px-4 py-2',
    lg: 'h-10 rounded-md px-6',
    icon: 'size-9',
  },
  
  // 변형별 스타일
  variants: {
    default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90',
    outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }
} as const;

// 카드 통합 스타일 시스템 (shadcn/ui와 통합)
export const cardSystem = {
  // 기본 스타일
  base: 'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
  
  // 헤더 스타일
  header: 'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6',
  
  // 콘텐츠 스타일
  content: 'px-6',
  
  // 푸터 스타일
  footer: 'flex items-center px-6',
  
  // 제목 스타일
  title: 'leading-none font-semibold',
  
  // 설명 스타일
  description: 'text-muted-foreground text-sm',
  
  // 변형별 스타일
  variants: {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20',
    gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-md',
  },
  
  // 호버 효과
  hover: {
    lift: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-200',
    glow: 'hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200',
    scale: 'hover:scale-105 transition-transform duration-200',
  }
} as const;

// 배지 통합 스타일 시스템 (shadcn/ui와 통합)
export const badgeSystem = {
  // 기본 스타일
  base: 'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0',
  
  // 변형별 스타일
  variants: {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-white',
    outline: 'text-foreground',
  },
  
  // 색상별 스타일 (기존 유지)
  colors: {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
  }
} as const;

// 컴포넌트 크기 분류 (간소화)
export const componentSizes = {
  // 작은 컴포넌트
  small: {
    border: 'border',
    borderRadius: 'rounded-lg',
    padding: 'p-2',
    gap: 'gap-2',
    text: 'text-sm',
    shadow: 'shadow-sm',
  },
  
  // 중간 컴포넌트
  medium: {
    border: 'border-2',
    borderRadius: 'rounded-xl',
    padding: 'p-4',
    gap: 'gap-4',
    text: 'text-base',
    shadow: 'shadow-md',
  },
  
  // 큰 컴포넌트
  large: {
    border: 'border-2',
    borderRadius: 'rounded-2xl',
    padding: 'p-6',
    gap: 'gap-6',
    text: 'text-lg',
    shadow: 'shadow-lg',
  },
  
  // 특대 컴포넌트
  xlarge: {
    border: 'border-2',
    borderRadius: 'rounded-3xl',
    padding: 'p-8',
    gap: 'gap-8',
    text: 'text-xl',
    shadow: 'shadow-xl',
  }
} as const;

// 컴포넌트 상태별 스타일
export const componentStates = {
  // 기본 상태
  default: {
    transition: 'transition-all duration-200',
    cursor: 'cursor-default',
  },
  
  // 호버 가능한 상태 - 담백한 효과
  hoverable: {
    transition: 'transition-all duration-200',
    cursor: 'cursor-pointer',
    hover: {
      scale: '',
      shadow: '',
      opacity: 'hover:opacity-80',
    }
  },
  
  // 클릭 가능한 상태 (버튼 등) - 담백한 효과
  clickable: {
    transition: 'transition-all duration-200',
    cursor: 'cursor-pointer',
    hover: {
      scale: '',
      shadow: '',
      brightness: 'hover:brightness-95',
    },
    active: {
      scale: '',
      shadow: '',
    }
  },
  
  // 비활성화 상태
  disabled: {
    cursor: 'cursor-not-allowed',
    opacity: 'opacity-50',
    filter: 'grayscale',
  },
  
  // 로딩 상태
  loading: {
    cursor: 'cursor-wait',
    animate: 'animate-pulse',
  }
} as const;

// 간격 시스템
export const spacing = {
  // 컴포넌트 내부 간격
  inner: {
    tight: 'space-y-2',      // 8px
    normal: 'space-y-4',     // 16px
    relaxed: 'space-y-6',    // 24px
    loose: 'space-y-8',      // 32px
  },
  
  // 컴포넌트 간 간격
  between: {
    tight: 'gap-2',          // 8px
    normal: 'gap-4',         // 16px
    relaxed: 'gap-6',        // 24px
    loose: 'gap-8',          // 32px
  },
  
  // 섹션 간 간격
  section: {
    tight: 'mb-4',           // 16px
    normal: 'mb-6',          // 24px
    relaxed: 'mb-8',         // 32px
    loose: 'mb-12',          // 48px
  }
} as const;

// 레이아웃 패턴
export const layouts = {
  // 카드 레이아웃
  card: {
    container: 'flex flex-col',
    header: 'flex items-center justify-between',
    content: 'flex-1',
    footer: 'flex items-center justify-end',
  },
  
  // 리스트 아이템 레이아웃
  listItem: {
    container: 'flex items-center justify-between',
    left: 'flex items-center',
    center: 'flex-1 text-center',
    right: 'flex items-center justify-end',
  },
  
  // 폼 레이아웃
  form: {
    container: 'space-y-4',
    field: 'flex flex-col',
    fieldGroup: 'flex gap-4',
    actions: 'flex justify-end gap-2',
  },
  
  // 그리드 레이아웃
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
} as const;

// 특수 효과
export const effects = {
  // 글로우 효과
  glow: {
    subtle: 'shadow-lg shadow-purple-500/10',
    normal: 'shadow-xl shadow-purple-500/20',
    strong: 'shadow-2xl shadow-purple-500/30',
  },
  
  // 애니메이션 지속시간
  duration: {
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-300',
    slower: 'duration-500',
  },
  
  // 애니메이션 타이밍
  timing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'ease-bounce',
  }
} as const;

// 우선순위별 스타일 (리더보드 전용) - 담백한 스타일
export const priority = {
  // 최상위 랭크 (1-3위)
  top: {
    border: 'border-2',
    shadow: 'shadow-md',
    glow: '',
    animation: '',
  },
  
  // 상위 랭크 (4-10위)
  high: {
    border: 'border-2',
    shadow: 'shadow-md',
    glow: '',
    animation: '',
  },
  
  // 중위 랭크 (11-30위)
  medium: {
    border: 'border',
    shadow: 'shadow-sm',
    glow: '',
    animation: '',
  },
  
  // 하위 랭크 (31위 이상)
  low: {
    border: 'border',
    shadow: 'shadow-sm',
    glow: '',
    animation: '',
  }
} as const;

// 유틸리티 함수들
export const getComponentStyle = (
  size: keyof typeof componentSizes,
  state: keyof typeof componentStates = 'default'
) => {
  const sizeStyles = componentSizes[size];
  const stateStyles = componentStates[state];
  
  return {
    ...sizeStyles,
    ...stateStyles,
  };
};

export const getRankPriority = (rank: number): keyof typeof priority => {
  if (rank <= 3) return 'top';
  if (rank <= 10) return 'high';
  if (rank <= 30) return 'medium';
  return 'low';
};

export const getPriorityStyle = (rank: number) => {
  const priorityLevel = getRankPriority(rank);
  return priority[priorityLevel];
};

// 조합된 스타일 클래스 생성 헬퍼
export const createStyleClass = (
  size: keyof typeof componentSizes,
  state: keyof typeof componentStates = 'default',
  customClasses: string = ''
) => {
  const sizeStyles = componentSizes[size];
  const stateStyles = componentStates[state];
  
  const baseClasses = [
    sizeStyles.border,
    sizeStyles.borderRadius,
    sizeStyles.padding,
    sizeStyles.shadow,
    'transition' in stateStyles ? stateStyles.transition : '',
    'cursor' in stateStyles ? stateStyles.cursor : '',
  ].filter(Boolean).join(' ');
  
  return `${baseClasses} ${customClasses}`.trim();
};

export type ComponentSize = keyof typeof componentSizes;
export type ComponentState = keyof typeof componentStates;
export type PriorityLevel = keyof typeof priority;