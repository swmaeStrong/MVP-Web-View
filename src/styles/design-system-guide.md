# 디자인 시스템 가이드

## 개요
통일된 디자인 언어를 위한 중앙화된 스타일 시스템입니다. 모든 컴포넌트에서 일관된 크기, 간격, 효과를 제공합니다.

## 컴포넌트 크기 분류

### Small (작은 컴포넌트)
- **용도**: 버튼, 칩, 아이콘, 태그
- **Border**: `border` (1px)
- **Radius**: `rounded-lg` (8px)
- **Padding**: `p-2` (8px)
- **Shadow**: `shadow-sm`
- **Text**: `text-sm` (14px)

### Medium (중간 컴포넌트)
- **용도**: 카드, 입력 필드, 작은 섹션
- **Border**: `border-2` (2px)
- **Radius**: `rounded-xl` (12px)
- **Padding**: `p-4` (16px)
- **Shadow**: `shadow-md`
- **Text**: `text-base` (16px)

### Large (큰 컴포넌트)
- **용도**: 메인 카드, 섹션, 패널
- **Border**: `border-2` (2px)
- **Radius**: `rounded-2xl` (16px)
- **Padding**: `p-6` (24px)
- **Shadow**: `shadow-lg`
- **Text**: `text-lg` (18px)

### XLarge (특대 컴포넌트)
- **용도**: 히어로 섹션, 메인 배너, 전체 페이지 섹션
- **Border**: `border-2` (2px)
- **Radius**: `rounded-3xl` (24px)
- **Padding**: `p-8` (32px)
- **Shadow**: `shadow-xl`
- **Text**: `text-xl` (20px)

## 컴포넌트 상태

### Default (기본)
```tsx
transition-all duration-200 cursor-default
```

### Hoverable (호버 가능)
```tsx
transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-lg
```

### Clickable (클릭 가능)
```tsx
transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md active:scale-95
```

### Disabled (비활성화)
```tsx
cursor-not-allowed opacity-50 grayscale
```

### Loading (로딩)
```tsx
cursor-wait animate-pulse
```

## 간격 시스템

### Inner Spacing (컴포넌트 내부 간격)
- **Tight**: `space-y-2` (8px)
- **Normal**: `space-y-4` (16px)
- **Relaxed**: `space-y-6` (24px)
- **Loose**: `space-y-8` (32px)

### Between Spacing (컴포넌트 간 간격)
- **Tight**: `gap-2` (8px)
- **Normal**: `gap-4` (16px)
- **Relaxed**: `gap-6` (24px)
- **Loose**: `gap-8` (32px)

### Section Spacing (섹션 간 간격)
- **Tight**: `mb-4` (16px)
- **Normal**: `mb-6` (24px)
- **Relaxed**: `mb-8` (32px)
- **Loose**: `mb-12` (48px)

## 우선순위 스타일 (리더보드용)

### Top Priority (1-3위)
```tsx
border-2 shadow-xl glow-strong animate-pulse
```

### High Priority (4-10위)
```tsx
border-2 shadow-lg glow-normal
```

### Medium Priority (11-30위)
```tsx
border-2 shadow-md glow-subtle
```

### Low Priority (31위 이상)
```tsx
border shadow-sm
```

## 사용법

### 1. 기본 임포트
```tsx
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { componentSizes, componentStates } from '@/styles/design-system';
```

### 2. Hook 사용
```tsx
const { getCardStyle, getButtonStyle, spacing } = useDesignSystem();

// 카드 스타일
const cardStyle = getCardStyle('medium', 'hoverable', rank);

// 버튼 스타일
const buttonStyle = getButtonStyle('small', 'primary');
```

### 3. 직접 사용
```tsx
// UserCard 예시
<div className={`
  ${componentSizes.medium.borderRadius}
  ${componentSizes.medium.border}
  ${componentSizes.medium.padding}
  ${componentSizes.medium.shadow}
  ${componentStates.hoverable.transition}
  ${getThemeClass('border')}
  ${getThemeClass('component')}
`}>
```

### 4. 순위별 스타일
```tsx
import { getPriorityStyle, getRankPriority } from '@/styles/design-system';

const priorityStyle = getPriorityStyle(rank);
const priorityLevel = getRankPriority(rank); // 'top' | 'high' | 'medium' | 'low'

<div className={`
  ${priorityStyle.border}
  ${priorityStyle.shadow}
  ${priorityStyle.glow}
  ${priorityStyle.animation}
`}>
```

## 레이아웃 패턴

### Card Layout
```tsx
<div className={layouts.card.container}>
  <div className={layouts.card.header}>Header</div>
  <div className={layouts.card.content}>Content</div>
  <div className={layouts.card.footer}>Footer</div>
</div>
```

### List Item Layout
```tsx
<div className={layouts.listItem.container}>
  <div className={layouts.listItem.left}>Left Content</div>
  <div className={layouts.listItem.center}>Center Content</div>
  <div className={layouts.listItem.right}>Right Content</div>
</div>
```

## 적용된 컴포넌트들

### 리더보드 컴포넌트들
- ✅ **UserCard**: Medium 카드, 순위별 우선순위 스타일
- ✅ **MyRankBanner**: XLarge 카드, 호버 효과
- ✅ **CategoryFilter**: Large 카드, 간격 시스템
- ✅ **PeriodSelector**: Medium 카드, 내부 간격
- ✅ **LeaderboardList**: Medium 카드, 간격 시스템
- ✅ **TierSystemTooltip**: Small 버튼, Large 툴팁
- ✅ **EmptyState**: XLarge 카드, 호버 효과
- ✅ **StatsSection**: Large 카드, 섹션 간격
- ✅ **TierTooltip**: Medium 툴팁

## 장점

1. **일관성**: 모든 컴포넌트에서 동일한 크기, 간격, 효과 사용
2. **유지보수성**: 중앙화된 설정으로 쉬운 업데이트
3. **확장성**: 새로운 크기나 상태 쉽게 추가 가능
4. **타입 안전성**: TypeScript로 완전한 타입 지원
5. **성능**: 미리 정의된 클래스로 최적화

## 향후 확장

- **Animation Presets**: 자주 사용되는 애니메이션 패턴
- **Color Variants**: 더 다양한 색상 조합
- **Responsive Breakpoints**: 반응형 크기 시스템
- **Component Variants**: 컴포넌트별 특화 스타일