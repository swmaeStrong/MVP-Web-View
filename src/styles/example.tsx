// 스타일 시스템 사용 예제

import {
  animations,
  categoryColors,
  commonCombinations,
  layout,
  rankColors,
  typography,
  utils,
} from './index';

// 사용 예제들
export const examples = {
  // 1. 간단한 버튼 사용
  primaryButton: (
    <button className={commonCombinations.buttonCombos.primary}>
      기본 버튼
    </button>
  ),

  // 2. 카테고리 색상 사용
  categoryCard: (category: string) => (
    <div
      className={`${commonCombinations.cardCombos.glass} bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]?.gradient}`}
    >
      <span>{category} 카테고리</span>
    </div>
  ),

  // 3. 레이아웃 조합 사용
  gridLayout: (
    <div className={utils.cn(layout.grid.leaderboard, layout.spacing.card)}>
      <div>아이템 1</div>
      <div>아이템 2</div>
      <div>아이템 3</div>
    </div>
  ),

  // 4. 타이포그래피 사용
  headings: (
    <>
      <h1 className={typography.heading.hero}>히어로 제목</h1>
      <h2 className={typography.heading.h2}>섹션 제목</h2>
      <p className={typography.body.default}>일반 텍스트</p>
    </>
  ),

  // 5. 애니메이션 효과
  animatedCard: (
    <div
      className={utils.cn(
        commonCombinations.cardCombos.default,
        animations.hover.lift,
        animations.transition.smooth
      )}
    >
      호버시 위로 올라가는 카드
    </div>
  ),

  // 6. 유틸리티 함수 사용
  conditionalStyles: (isActive: boolean) => (
    <div
      className={utils.cn(
        'base-class',
        utils.conditional(isActive, 'active-class', 'inactive-class'),
        utils.responsive('text-sm', 'text-base', 'text-lg', 'text-xl')
      )}
    >
      조건부 스타일 적용
    </div>
  ),

  // 7. 순위별 컬러 사용
  rankBadge: (rank: number) => {
    const rankInfo =
      rank <= 10 ? rankColors[rank as keyof typeof rankColors] : null;
    return rankInfo ? (
      <div
        className={utils.cn(
          'rounded-full px-2 py-1 text-xs font-medium',
          rankInfo.bgColor,
          rankInfo.textColor,
          rankInfo.borderColor,
          'border'
        )}
      >
        #{rank} {rankInfo.title}
      </div>
    ) : null;
  },

  // 8. 복합 레이아웃 구성
  complexLayout: (
    <div className={layout.container.default}>
      <header className={utils.cn(layout.flex.between, 'py-4')}>
        <h1 className={typography.heading.h1}>제목</h1>
        <button className={commonCombinations.buttonCombos.primary}>
          액션
        </button>
      </header>

      <main className={layout.spacing.section}>
        <div className={layout.grid.responsive}>{/* 카드들 */}</div>
      </main>
    </div>
  ),
};

// 사용법 가이드
export const usageGuide = `
스타일 시스템 사용법:

1. 개별 import:
   import { categoryColors, layout } from '@/styles'

2. 전체 import:
   import * from '@/styles'

3. 통합 객체 사용:
   import { styles } from '@/styles'
   styles.colors.category.개발.gradient

4. 조합 사용:
   import { commonCombinations } from '@/styles'
   commonCombinations.buttonCombos.primary

5. 유틸리티 함수:
   import { utils } from '@/styles'
   utils.cn('class1', 'class2')
   utils.conditional(true, 'active', 'inactive')

6. 반응형 클래스:
   utils.responsive('text-sm', 'text-base', 'text-lg')
   // 결과: 'text-sm sm:text-base md:text-lg'
`;
