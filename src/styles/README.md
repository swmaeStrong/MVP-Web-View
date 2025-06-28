# 🎨 통합 디자인 시스템 가이드

MVP Web View 프로젝트의 통일된 디자인 언어를 위한 중앙화된 스타일 시스템입니다. shadcn/ui 컴포넌트와 커스텀 스타일을 통합하여 모든 컴포넌트에서 일관된 크기, 간격, 효과를 제공합니다.

## 📁 파일 구조

```
src/styles/
├── design-system.ts      # 통합된 컴포넌트 스타일 시스템 (우선 사용 권장)
├── colors.ts            # 색상 시스템 (테마, 브랜드, 카테고리 등)
├── common.ts            # 공통 스타일 (레거시 지원)
├── animations.ts        # 애니메이션 효과
├── index.ts             # 통합 export
├── example.tsx          # 사용 예제
└── README.md            # 이 문서
```

## 🔄 스타일 시스템 통합

### shadcn/ui와의 통합
- **Button**: `src/shadcn/ui/button.tsx` ↔ `design-system.ts`의 `buttonSystem`
- **Card**: `src/shadcn/ui/card.tsx` ↔ `design-system.ts`의 `cardSystem`  
- **Badge**: `src/shadcn/ui/badge.tsx` ↔ `design-system.ts`의 `badgeSystem`

### 중복 제거 결과
- ✅ 버튼, 카드, 배지 스타일 통합
- ✅ 컴포넌트 크기 시스템 통합
- ✅ 색상 시스템 중앙화
- ✅ 레거시 지원 유지

## 📐 컴포넌트 크기 분류

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

## 🎭 컴포넌트 상태

### Default (기본)
```tsx
transition-all duration-200 cursor-default
```

### Hoverable (호버 가능)
```tsx
transition-all duration-200 cursor-pointer hover:opacity-80
```

### Clickable (클릭 가능)
```tsx
transition-all duration-200 cursor-pointer hover:brightness-95
```

### Disabled (비활성화)
```tsx
cursor-not-allowed opacity-50 grayscale
```

### Loading (로딩)
```tsx
cursor-wait animate-pulse
```

## 📏 간격 시스템

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

## 🚀 사용법

### 1. 기본 임포트
```tsx
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { componentSizes, componentStates, buttonSystem, cardSystem } from '@/styles/design-system';
```

### 2. Hook 사용 (권장)
```tsx
const { getCardStyle, getButtonStyle, spacing } = useDesignSystem();

// 카드 스타일
const cardStyle = getCardStyle('medium', 'hoverable', rank);

// 버튼 스타일
const buttonStyle = getButtonStyle('small', 'primary');
```

### 3. shadcn/ui 컴포넌트 사용 (권장)
```tsx
import { Button } from '@/shadcn/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';

const MyComponent = () => (
  <Card>
    <CardHeader>
      <CardTitle>제목</CardTitle>
    </CardHeader>
    <CardContent>
      <Button variant="default" size="default">버튼</Button>
      <Badge variant="default">배지</Badge>
    </CardContent>
  </Card>
);
```

### 4. 통합 스타일 시스템 직접 사용
```tsx
// 버튼 컴포넌트
const CustomButton = ({ variant = 'default', size = 'default' }) => (
  <button 
    className={`${buttonSystem.base} ${buttonSystem.variants[variant]} ${buttonSystem.sizes[size]}`}
  >
    버튼
  </button>
);

// 카드 컴포넌트
const CustomCard = () => (
  <div className={`${cardSystem.base} ${cardSystem.variants.elevated}`}>
    <div className={cardSystem.header}>
      <h3 className={cardSystem.title}>제목</h3>
    </div>
    <div className={cardSystem.content}>내용</div>
  </div>
);
```

### 5. 순위별 스타일 (리더보드용)
```tsx
import { getPriorityStyle, getRankPriority } from '@/styles/design-system';

const priorityStyle = getPriorityStyle(rank);
const priorityLevel = getRankPriority(rank); // 'top' | 'high' | 'medium' | 'low'

<div className={`
  ${priorityStyle.border}
  ${priorityStyle.shadow}
`}>
```

## 🎨 색상 시스템

### 브랜드 컬러
```tsx
brandColors.primary.gradient; // 'from-purple-600 to-blue-600'
brandColors.primary.solid; // 'purple-600'
brandColors.secondary.gradient; // 'from-pink-500 to-rose-500'
```

### 카테고리별 컬러
```tsx
categoryColors.개발.gradient; // 'from-blue-500 via-purple-500 to-indigo-500'
categoryColors.개발.buttonGradient; // 'from-blue-500 to-purple-500'
categoryColors.개발.badgeClass; // 'bg-blue-100 text-blue-700 border-blue-200'
```

### 순위별 컬러
```tsx
rankColors[1].title; // '👑 절대강자'
rankColors[1].textColor; // 'text-yellow-600'
rankColors[1].bgColor; // 'bg-yellow-50'
```

## 📋 레이아웃 패턴

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

### Grid Layout
```tsx
<div className={layouts.grid.cols3}>
  {/* 1-column mobile, 2-column tablet, 3-column desktop */}
</div>
```

## ✅ 적용된 컴포넌트들

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

### 공통 컴포넌트들
- ✅ **ErrorState**: 디자인 시스템 적용 완료
- ✅ **NoData**: 디자인 시스템 적용 완료
- ✅ **UnderConstruction**: 디자인 시스템 적용 완료

### 통계 컴포넌트들
- ✅ **ActivityList**: 디자인 시스템 적용 완료
- ✅ **CategoryList**: 디자인 시스템 적용 완료
- ✅ **TotalTimeCard**: 디자인 시스템 적용 완료
- ⏳ **HourlyUsageComparison**: 디자인 시스템 적용 필요
- ⏳ **StatisticsBarChart**: 디자인 시스템 적용 필요
- ⏳ **StatisticsChart**: 디자인 시스템 적용 필요
- ⏳ **StatisticsRadarChart**: 디자인 시스템 적용 필요

### 홈 페이지 컴포넌트들
- ✅ **HeroSection**: 디자인 시스템 적용 완료 (부분)
- ✅ **Navigation**: 디자인 시스템 적용 완료
- ⏳ **BrandLogos**: 디자인 시스템 적용 필요
- ⏳ **CollaborationSection**: 디자인 시스템 적용 필요
- ⏳ **PricingSection**: 디자인 시스템 적용 필요
- ⏳ **StatsSection**: 디자인 시스템 적용 필요
- ⏳ **WorkspaceSection**: 디자인 시스템 적용 필요

## 🎯 베스트 프랙티스

1. **shadcn/ui 우선 사용**: 가능하면 shadcn/ui 컴포넌트를 먼저 사용하세요
2. **일관성 유지**: 항상 스타일 시스템의 값을 사용하세요
3. **Hook 활용**: `useDesignSystem` Hook을 적극 활용하세요
4. **타입 안정성**: TypeScript 타입을 활용하세요
5. **반응형 고려**: 모바일 퍼스트 접근법을 사용하세요

## 🚫 레거시 지원

기존 코드와의 호환성을 위해 `common.ts`의 레거시 스타일이 유지됩니다:
- `buttons`, `cards`, `inputs` 등의 기존 스타일
- 점진적 마이그레이션 지원
- 새로운 개발에서는 통합 시스템 사용 권장

## 🔧 확장하기

새로운 스타일을 추가하려면:

1. 해당 파일(`design-system.ts`, `colors.ts`, `animations.ts`)에 추가
2. `index.ts`에서 export 확인
3. `useDesignSystem` Hook에 헬퍼 함수 추가
4. `example.tsx`에 사용 예제 추가

## 📚 참고 자료

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [디자인 시스템 가이드](https://designsystem.guide/)
- [CSS 애니메이션 가이드](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)