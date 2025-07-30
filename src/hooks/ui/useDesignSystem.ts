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
  
  // 완전한 스타일 클래스 생성 (사용되지 않음 - 제거 예정)
  // const createComponentClass = (...) => { ... };
  
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
  
  // 사용되지 않는 함수들 제거됨 (getButtonStyle, getInputStyle, getAnimation, createComponentClass)
  
  // 텍스트 크기 헬퍼
  const getTextSize = (size: ComponentSize) => componentSizes[size].text;
  
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
    getCardStyle,
    getTextSize,
    
    // 유틸리티 함수들
    getRankPriority,
    getPriorityStyle,
    getComponentStyle,
  };
}

export type { ComponentSize, ComponentState, PriorityLevel };