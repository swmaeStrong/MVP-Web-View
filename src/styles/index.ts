// 모든 스타일 시스템을 통합하여 export
// export * from './animations'; // 제거됨 - 사용되지 않음
export * from './colors';
export * from './common';
export * from './design-system';
export * from './font-sizes';

// 편의를 위한 통합 객체들
import {
  brandColors,
  categoryColors,
  themeColors,
} from './colors';

// import {
//   animations,
//   customAnimations,
//   enterExit,
//   interactions,
// } from './animations'; // 제거됨 - 사용되지 않음

import {
  badges,
  borders,
  buttons,
  cards,
  inputs,
  layout,
  overlays,
  shadows,
  typography,
} from './common';

import {
  badgeSystem,
  buttonSystem,
  cardSystem,
  componentSizes,
  componentStates,
} from './design-system';

// 통합 스타일 객체 (새로운 구조)
export const styles = {
  // 색상 시스템
  colors: {
    brand: brandColors,
    category: categoryColors,
    theme: themeColors,
  },

  // 통합된 컴포넌트 시스템 (우선 사용 권장)
  components: {
    button: buttonSystem,
    card: cardSystem,
    badge: badgeSystem,
    // 레거시 지원
    buttons,
    cards,
    badges,
    inputs,
    overlays,
  },

  // 디자인 시스템
  design: {
    sizes: componentSizes,
    states: componentStates,
  },

  // 애니메이션 시스템 (제거됨 - 사용되지 않음)
  // animations: {
  //   ...animations,
  //   custom: customAnimations,
  //   interactions,
  //   enterExit,
  // },

  // 레이아웃 시스템
  layout,

  // 타이포그래피
  typography,

  // 시각적 효과
  effects: {
    shadows,
    borders,
  },
};

// 자주 사용하는 조합들을 미리 정의
export const commonCombinations = {
  // 카드 스타일 조합
  cardCombos: {
    default: `${cards.variant.default} ${cards.padding.md} ${cards.hover.lift}`,
    elevated: `${cards.variant.elevated} ${cards.padding.lg} ${cards.hover.glow}`,
    glass: `${cards.variant.glass} ${cards.padding.md} transition-all duration-200`,
    interactive: `${cards.variant.default} ${cards.padding.md} ${cards.hover.scale} transition-all duration-200`,
  },

  // 버튼 스타일 조합
  buttonCombos: {
    primary: `${buttons.base} ${buttons.variant.primary} ${buttons.size.md} hover:scale-105 transition-transform`,
    primaryLg: `${buttons.base} ${buttons.variant.primary} ${buttons.size.lg} hover:scale-105 transition-transform`,
    secondary: `${buttons.base} ${buttons.variant.secondary} ${buttons.size.md} hover:scale-105 transition-transform`,
    outline: `${buttons.base} ${buttons.variant.outline} ${buttons.size.md} hover:scale-105 transition-transform`,
    ghost: `${buttons.base} ${buttons.variant.ghost} ${buttons.size.md} hover:scale-105 transition-transform`,
  },

  // 입력 필드 조합
  inputCombos: {
    default: `${inputs.base} ${inputs.size.md} ${inputs.state.default}`,
    large: `${inputs.base} ${inputs.size.lg} ${inputs.state.default}`,
    error: `${inputs.base} ${inputs.size.md} ${inputs.state.error}`,
    success: `${inputs.base} ${inputs.size.md} ${inputs.state.success}`,
  },

  // 제목 스타일 조합
  headingCombos: {
    hero: `${typography.heading.hero} ${brandColors.primary.text}`,
    pageTitle: `${typography.heading.h1} ${brandColors.primary.text}`,
    sectionTitle: `${typography.heading.h2} text-gray-900`,
    cardTitle: `${typography.heading.h3} text-gray-800`,
  },

  // 그리드 레이아웃 조합
  gridCombos: {
    responsive: `${layout.grid.responsive} ${layout.spacing.card}`,
    leaderboard: `${layout.grid.leaderboard} ${layout.spacing.card}`,
    categories: `${layout.grid.categories} ${layout.spacing.tight}`,
    cards: `${layout.grid.cards} ${layout.spacing.section}`,
  },

  // 실시간 표시기 조합 (제거됨 - 사용되지 않음)
  // liveCombos: {
  //   dot: 'animate-pulse',
  //   ping: 'animate-ping',
  //   container: 'relative',
  //   full: 'relative',
  // },
};

// 테마별 색상 조합 (다크모드 대비)
export const themes = {
  light: {
    background: 'bg-gray-50',
    surface: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
  },
  dark: {
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
  },
};

// 반응형 breakpoint 도우미
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// z-index 레이어 시스템
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
  overlay: 80,
  max: 9999,
};

// 스페이싱 시스템 (Tailwind 호환)
export const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// 편의 함수들
export const utils = {
  // 클래스 이름 결합 함수
  cn: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  },

  // 조건부 클래스
  conditional: (
    condition: boolean,
    trueClass: string,
    falseClass?: string
  ): string => {
    return condition ? trueClass : falseClass || '';
  },

  // 반응형 클래스 생성
  responsive: (
    base: string,
    sm?: string,
    md?: string,
    lg?: string,
    xl?: string
  ): string => {
    const classes = [base];
    if (sm) classes.push(`sm:${sm}`);
    if (md) classes.push(`md:${md}`);
    if (lg) classes.push(`lg:${lg}`);
    if (xl) classes.push(`xl:${xl}`);
    return classes.join(' ');
  },
};
