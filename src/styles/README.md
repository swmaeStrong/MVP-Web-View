# 🎨 스타일 시스템

프로젝트에서 사용하는 모든 색상, 애니메이션, 레이아웃을 체계적으로 관리하는 디자인 시스템입니다.

## 📁 파일 구조

```
src/styles/
├── colors.ts      # 색상 시스템
├── animations.ts  # 애니메이션 효과
├── common.ts      # 공통 스타일
├── index.ts       # 통합 export
├── example.tsx    # 사용 예제
└── README.md      # 이 문서
```

## 🚀 빠른 시작

### 기본 사용법

```tsx
// 개별 import
import { categoryColors, layout, typography } from '@/styles'

// 전체 import
import { styles, commonCombinations, utils } from '@/styles'

// 사용 예제
<button className={commonCombinations.buttonCombos.primary}>
  버튼
</button>

<div className={utils.cn(layout.grid.responsive, layout.spacing.card)}>
  <div>카드 1</div>
  <div>카드 2</div>
</div>
```

## 🎨 색상 시스템

### 브랜드 컬러

```tsx
brandColors.primary.gradient // 'from-purple-600 to-blue-600'
brandColors.primary.solid // 'purple-600'
brandColors.secondary.gradient // 'from-pink-500 to-rose-500'
```

### 카테고리별 컬러

```tsx
categoryColors.개발.gradient // 'from-blue-500 via-purple-500 to-indigo-500'
categoryColors.개발.buttonGradient // 'from-blue-500 to-purple-500'
categoryColors.개발.badgeClass // 'bg-blue-100 text-blue-700 border-blue-200'
categoryColors.디자인.gradient // 'from-pink-500 via-rose-500 to-orange-500'
categoryColors.회의.gradient // 'from-green-500 via-emerald-500 to-teal-500'
```

### 순위별 컬러

```tsx
rankColors[1].title // '👑 절대강자'
rankColors[1].textColor // 'text-yellow-600'
rankColors[1].bgColor // 'bg-yellow-50'
rankColors[2].title // '🥈 도전자'
```

### 상태별 컬러

```tsx
statusColors.success.gradient // 'from-green-100 to-emerald-100'
statusColors.warning.border // 'border-orange-200'
statusColors.error.text // 'text-red-700'
```

## 🎭 애니메이션 시스템

### 기본 트랜지션

```tsx
animations.transition.default // 'transition-all duration-300 ease-in-out'
animations.transition.fast // 'transition-all duration-150 ease-in-out'
animations.transition.smooth // 'transition-all duration-300 ease-out'
```

### 호버 효과

```tsx
animations.hover.lift // 'hover:shadow-xl hover:-translate-y-1'
animations.hover.glow // 'hover:shadow-lg hover:shadow-purple-500/25'
animations.hover.scale // 'hover:scale-105'
```

### 펄스 효과

```tsx
animations.pulse.default // 'animate-pulse'
animations.pulse.ping // 'animate-ping'
animations.pulse.bounce // 'animate-bounce'
```

### 실시간 표시기

```tsx
animations.live.container // 'flex items-center space-x-2'
animations.live.dot // 'relative inline-flex rounded-full h-3 w-3 bg-red-500'
animations.live.ping // 'animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'
```

## 📐 레이아웃 시스템

### 컨테이너

```tsx
layout.container.default // 'container mx-auto px-4'
layout.container.wide // 'container mx-auto px-6'
layout.container.narrow // 'max-w-4xl mx-auto px-4'
```

### 그리드 시스템

```tsx
layout.grid.responsive // 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
layout.grid.leaderboard // 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
layout.grid.categories // 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
```

### 플렉스 레이아웃

```tsx
layout.flex.center // 'flex items-center justify-center'
layout.flex.between // 'flex items-center justify-between'
layout.flex.colCenter // 'flex flex-col items-center justify-center'
```

### 간격

```tsx
layout.spacing.section // 'space-y-8'
layout.spacing.card // 'space-y-4'
layout.spacing.responsiveY // 'space-y-4 sm:space-y-6 lg:space-y-8'
```

## ✍️ 타이포그래피

### 제목

```tsx
typography.heading.hero // 'text-4xl sm:text-5xl lg:text-6xl font-bold'
typography.heading.h1 // 'text-3xl sm:text-4xl font-bold'
typography.heading.h2 // 'text-2xl sm:text-3xl font-bold'
```

### 본문

```tsx
typography.body.large // 'text-lg sm:text-xl'
typography.body.default // 'text-base'
typography.body.responsive // 'text-sm sm:text-base lg:text-lg'
```

### 특수 용도

```tsx
typography.special.caption // 'text-xs text-gray-500'
typography.special.label // 'text-sm font-medium text-gray-700'
typography.special.muted // 'text-gray-500'
```

## 🧩 공통 컴포넌트 스타일

### 버튼

```tsx
buttons.base // 기본 버튼 스타일
buttons.variant.primary // 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
buttons.variant.secondary // 'bg-gray-100 text-gray-900 hover:bg-gray-200'
buttons.size.md // 'px-4 py-2 text-sm'
```

### 카드

```tsx
cards.variant.default // 'bg-white border border-gray-200 rounded-lg shadow-sm'
cards.variant.glass // 'bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg'
cards.hover.lift // 'hover:shadow-xl hover:-translate-y-1 transition-all duration-200'
```

### 입력 필드

```tsx
inputs.base // 기본 입력 필드 스타일
inputs.state.default // 'border-gray-300 focus:border-purple-500'
inputs.state.error // 'border-red-300 focus:border-red-500'
```

## 🎛️ 미리 정의된 조합

편의를 위해 자주 사용하는 스타일 조합들이 미리 정의되어 있습니다:

### 카드 조합

```tsx
commonCombinations.cardCombos.default // 기본 카드
commonCombinations.cardCombos.elevated // 높은 그림자 카드
commonCombinations.cardCombos.glass // 글래스모피즘 카드
commonCombinations.cardCombos.interactive // 인터랙티브 카드
```

### 버튼 조합

```tsx
commonCombinations.buttonCombos.primary // 기본 버튼
commonCombinations.buttonCombos.secondary // 보조 버튼
commonCombinations.buttonCombos.outline // 아웃라인 버튼
```

### 제목 조합

```tsx
commonCombinations.headingCombos.hero // 히어로 제목
commonCombinations.headingCombos.pageTitle // 페이지 제목
commonCombinations.headingCombos.cardTitle // 카드 제목
```

## 🛠️ 유틸리티 함수

### 클래스 이름 결합

```tsx
utils.cn('class1', 'class2', condition && 'class3')
// 결과: 'class1 class2 class3' (condition이 true일 때)
```

### 조건부 클래스

```tsx
utils.conditional(isActive, 'active-class', 'inactive-class')
// isActive가 true면 'active-class', false면 'inactive-class'
```

### 반응형 클래스 생성

```tsx
utils.responsive('text-sm', 'text-base', 'text-lg', 'text-xl')
// 결과: 'text-sm sm:text-base md:text-lg lg:text-xl'
```

## 📱 실제 사용 예제

### 리더보드 카드

```tsx
<div
  className={utils.cn(
    commonCombinations.cardCombos.glass,
    animations.hover.lift,
    animations.transition.smooth,
    user.isMe && 'ring-2 ring-purple-400'
  )}
>
  <div className={layout.flex.between}>
    <div
      className={utils.cn(
        'rounded-full px-2 py-1 text-xs',
        rankColors[rank].bgColor,
        rankColors[rank].textColor
      )}
    >
      #{rank}
    </div>
  </div>

  <h3 className={typography.heading.h5}>{user.name}</h3>

  <div
    className={`inline-flex rounded-full px-2 py-1 text-xs ${categoryColors[user.category].badgeClass}`}
  >
    {user.category}
  </div>
</div>
```

### 카테고리 버튼

```tsx
{
  categories.map(category => (
    <button
      key={category}
      className={utils.cn(
        'rounded-lg px-3 py-2 font-medium transition-all duration-300',
        selectedCategory === category
          ? `bg-gradient-to-r ${categoryColors[category].buttonGradient} text-white shadow-lg`
          : 'bg-white text-gray-600 hover:bg-gray-50'
      )}
    >
      {category}
    </button>
  ))
}
```

### 통계 카드

```tsx
<div className={commonCombinations.cardCombos.glass}>
  <div className={layout.flex.colCenter}>
    <div className={`${typography.heading.h2} text-purple-600`}>
      {stats.totalUsers}
    </div>
    <div className={typography.special.muted}>총 사용자</div>
  </div>
</div>
```

## 🎯 베스트 프랙티스

1. **일관성 유지**: 항상 스타일 시스템의 값을 사용하세요
2. **조합 활용**: 미리 정의된 조합을 우선 사용하세요
3. **유틸리티 함수**: `utils.cn()`으로 클래스를 안전하게 결합하세요
4. **반응형 고려**: 모바일 퍼스트 접근법을 사용하세요
5. **타입 안정성**: TypeScript 타입을 활용하세요

## 🔧 확장하기

새로운 스타일을 추가하려면:

1. 해당 파일(`colors.ts`, `animations.ts`, `common.ts`)에 추가
2. `index.ts`에서 export 확인
3. 필요시 `commonCombinations`에 조합 추가
4. `example.tsx`에 사용 예제 추가

## 📚 참고 자료

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [디자인 시스템 가이드](https://designsystem.guide/)
- [CSS 애니메이션 가이드](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
