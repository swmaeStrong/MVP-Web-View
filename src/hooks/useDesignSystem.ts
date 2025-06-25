import { 
  componentSizes, 
  componentStates, 
  spacing, 
  effects, 
  priority,
  getComponentStyle,
  getRankPriority,
  getPriorityStyle,
  createStyleClass,
  type ComponentSize,
  type ComponentState,
  type PriorityLevel
} from '@/styles/design-system';

/**
 * 디자인 시스템을 사용하기 위한 React Hook
 * 일관된 스타일링을 위한 유틸리티 함수들을 제공
 */
export function useDesignSystem() {
  
  // 컴포넌트 크기별 기본 스타일 가져오기
  const getSize = (size: ComponentSize) => componentSizes[size];
  
  // 컴포넌트 상태별 스타일 가져오기
  const getState = (state: ComponentState) => componentStates[state];
  
  // 간격 시스템 가져오기
  const getSpacing = () => spacing;
  
  // 효과 시스템 가져오기
  const getEffects = () => effects;
  
  // 순위별 우선순위 스타일 가져오기
  const getRankStyle = (rank: number) => getPriorityStyle(rank);
  
  // 완전한 스타일 클래스 생성
  const createComponentClass = (
    size: ComponentSize,
    state: ComponentState = 'default',
    customClasses: string = ''
  ) => createStyleClass(size, state, customClasses);
  
  // 카드 컴포넌트를 위한 헬퍼
  const getCardStyle = (
    size: ComponentSize = 'medium',
    state: ComponentState = 'hoverable',
    rank?: number
  ) => {
    const sizeStyle = componentSizes[size];
    const stateStyle = componentStates[state];
    const rankStyle = rank ? getPriorityStyle(rank) : null;
    
    return {
      base: { ...sizeStyle, ...stateStyle },
      rank: rankStyle,
      combined: `${sizeStyle.border} ${sizeStyle.borderRadius} ${sizeStyle.padding} ${sizeStyle.shadow} ${'transition' in stateStyle ? stateStyle.transition : ''} ${'cursor' in stateStyle ? stateStyle.cursor : ''} ${rankStyle?.glow || ''} ${rankStyle?.animation || ''}`
    };
  };
  
  // 버튼을 위한 헬퍼
  const getButtonStyle = (
    size: ComponentSize = 'small',
    variant: 'primary' | 'secondary' | 'ghost' = 'secondary'
  ) => {
    const sizeStyle = componentSizes[size];
    const stateStyle = componentStates.clickable;
    
    const variants = {
      primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
      secondary: 'border bg-gray-100 text-gray-700 hover:bg-gray-200',
      ghost: 'text-gray-600 hover:bg-gray-100'
    };
    
    return `${sizeStyle.borderRadius} ${sizeStyle.padding} ${sizeStyle.text} ${stateStyle.transition} ${stateStyle.cursor} ${variants[variant]}`;
  };
  
  // 입력 필드를 위한 헬퍼
  const getInputStyle = (
    size: ComponentSize = 'medium',
    hasError: boolean = false
  ) => {
    const sizeStyle = componentSizes[size];
    const errorStyle = hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-purple-500';
    
    return `${sizeStyle.border} ${sizeStyle.borderRadius} ${sizeStyle.padding} ${sizeStyle.text} ${errorStyle} focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors`;
  };
  
  // 텍스트 크기 헬퍼
  const getTextSize = (size: ComponentSize) => componentSizes[size].text;
  
  // 애니메이션 헬퍼
  const getAnimation = (type: 'pulse' | 'bounce' | 'spin' | 'ping') => {
    const animations = {
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      spin: 'animate-spin',
      ping: 'animate-ping'
    };
    return animations[type];
  };
  
  return {
    // 기본 스타일 객체들
    sizes: componentSizes,
    states: componentStates,
    spacing,
    effects,
    priority,
    
    // 헬퍼 함수들
    getSize,
    getState,
    getSpacing,
    getEffects,
    getRankStyle,
    createComponentClass,
    getCardStyle,
    getButtonStyle,
    getInputStyle,
    getTextSize,
    getAnimation,
    
    // 유틸리티 함수들
    getRankPriority,
    getPriorityStyle,
    getComponentStyle,
  };
}

export type { ComponentSize, ComponentState, PriorityLevel };