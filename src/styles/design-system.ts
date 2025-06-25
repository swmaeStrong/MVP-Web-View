// 통합 디자인 시스템 정의
// 모든 컴포넌트에서 일관된 스타일을 위한 중앙화된 설정

// 컴포넌트 크기 분류
export const componentSizes = {
  // 작은 컴포넌트 (버튼, 칩, 아이콘 등)
  small: {
    border: 'border',           // 1px
    borderRadius: 'rounded-lg', // 8px
    padding: 'p-2',            // 8px
    gap: 'gap-2',              // 8px
    text: 'text-sm',           // 14px
    shadow: 'shadow-sm',       // 작은 그림자
  },
  
  // 중간 컴포넌트 (카드, 입력 필드 등)
  medium: {
    border: 'border-2',         // 2px
    borderRadius: 'rounded-xl', // 12px
    padding: 'p-4',            // 16px
    gap: 'gap-4',              // 16px
    text: 'text-base',         // 16px
    shadow: 'shadow-md',       // 중간 그림자
  },
  
  // 큰 컴포넌트 (섹션, 메인 카드 등)
  large: {
    border: 'border-2',         // 2px
    borderRadius: 'rounded-2xl', // 16px
    padding: 'p-6',            // 24px
    gap: 'gap-6',              // 24px
    text: 'text-lg',           // 18px
    shadow: 'shadow-lg',       // 큰 그림자
  },
  
  // 특대 컴포넌트 (히어로 섹션, 메인 배너 등)
  xlarge: {
    border: 'border-2',         // 2px
    borderRadius: 'rounded-3xl', // 24px
    padding: 'p-8',            // 32px
    gap: 'gap-8',              // 32px
    text: 'text-xl',           // 20px
    shadow: 'shadow-xl',       // 특대 그림자
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