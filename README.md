# MVP Web View

개발자를 위한 스마트 생산성 추적 웹 애플리케이션입니다. IDE 코딩 시간부터 YouTube 콘텐츠 분석까지, 친구들과 리더보드에서 경쟁하며 생산성을 게임화할 수 있습니다.

## 기술 스택

### 핵심 프레임워크
- **Next.js 15.3.3** (App Router) - React 기반 풀스택 프레임워크
- **React 19.1.0** - 최신 React 버전
- **TypeScript 5** - 타입 안전성을 위한 정적 타입 언어

### 스타일링
- **Tailwind CSS 4** - 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui** - Radix UI 기반 재사용 가능한 컴포넌트 라이브러리
  - `@radix-ui/*` - 접근성을 고려한 헤드리스 UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리
- **class-variance-authority (CVA)** - 컴포넌트 variant 관리
- **tailwind-merge** - Tailwind 클래스 충돌 방지

### 상태 관리 & 데이터 페칭
- **Zustand 5.0.5** - 경량 전역 상태 관리 라이브러리
  - Redux보다 간단한 API
  - 불필요한 보일러플레이트 없음
- **TanStack React Query 5** - 서버 상태 관리 및 데이터 페칭
  - 캐싱, 동기화, 백그라운드 업데이트 자동 처리
  - 무한 스크롤 등 복잡한 데이터 패턴 지원

### 네트워크 & API
- **Axios 1.9.0** - HTTP 클라이언트
  - 인터셉터를 통한 에러 핸들링
  - 자동 요청/응답 변환

### 폼 관리
- **React Hook Form 7.61.1** - 고성능 폼 관리
  - 비제어 컴포넌트 기반으로 성능 최적화
- **Zod 4.0.14** - 스키마 검증 라이브러리
  - TypeScript 타입 추론 지원
- **@hookform/resolvers** - React Hook Form과 Zod 통합

### UI 라이브러리
- **Recharts 2.15.3** - React 기반 차트 라이브러리
  - 통계 및 리더보드 데이터 시각화
- **Swiper 11.2.10** - 터치 슬라이더
  - 모바일 친화적 캐러셀
- **React Day Picker 9.8.0** - 날짜 선택기
- **React Hot Toast 2.5.2** - 토스트 알림

### 결제 & 모니터링
- **PortOne Browser SDK 0.0.21** - 국내 결제 솔루션
- **Sentry 9.33.0** - 에러 추적 및 성능 모니터링
  - 프로덕션 환경에서만 활성화
  - 클라이언트 사이드 에러 추적

### 유틸리티
- **date-fns 4.1.0** - 날짜 조작 라이브러리
  - Moment.js보다 가볍고 모듈화
- **uuid 11.1.0** - 고유 식별자 생성
- **fuse.js 7.1.0** - 퍼지 검색 라이브러리

## 디렉토리 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   ├── group/             # 그룹 관련 페이지
│   ├── statistics/        # 통계 페이지
│   └── unauthorized/      # 인증 에러 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   ├── group/            # 그룹 관련 컴포넌트
│   └── statistics/       # 통계 관련 컴포넌트
├── config/               # 설정 파일 통합
│   ├── api/             # API 설정 (CSR/SSR 구분)
│   ├── constants/       # 애플리케이션 상수
│   └── i18n/            # 다국어 설정
├── hooks/                # 커스텀 훅
│   ├── common/          # 공통 훅
│   ├── data/            # 데이터 관련 훅
│   ├── group/           # 그룹 관련 훅
│   ├── navigation/      # 네비게이션 훅
│   ├── queries/         # React Query 훅
│   ├── ui/              # UI 관련 훅
│   └── user/            # 사용자 관련 훅
├── providers/            # React Context 프로바이더
│   ├── QueryProvider    # React Query 프로바이더
│   ├── ThemeProvider    # 테마 (다크/라이트 모드)
│   ├── LanguageProvider # 다국어 지원
│   ├── ToastProvider    # 토스트 알림
│   └── SentryProvider   # 에러 바운더리
├── schemas/             # Zod 스키마 정의
├── shadcn/              # shadcn/ui 컴포넌트
│   ├── lib/            # 유틸리티 함수
│   └── ui/             # UI 컴포넌트
├── shared/              # 공유 유틸리티
│   └── api/            # API 함수 (get, post, put, delete)
├── styles/              # 스타일 시스템
│   ├── colors.ts       # 컬러 시스템
│   ├── design-system.ts # 디자인 토큰
│   └── font-size.ts    # 폰트 시스템
├── types/               # TypeScript 타입 정의
│   ├── common/         # 공통 타입 (API 응답, 에러)
│   └── domains/        # 도메인별 타입
└── utils/               # 유틸리티 함수
```

## 주요 기능

- **생산성 추적**: IDE 코딩 시간, YouTube 시청 시간 등 다양한 활동 추적
- **리더보드**: 친구들과 생산성 경쟁
- **통계 대시보드**: 일/주/월 단위 통계 시각화
- **그룹 기능**: 팀 단위 생산성 관리
- **다크 모드**: 라이트/다크 테마 지원
- **다국어**: 한국어/영어 지원
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm run start

# ESLint 검사
npm run lint

# ESLint 자동 수정
npm run lint:fix

# TypeScript 타입 검사
npm run type-check

# Prettier 포맷팅
npm run format

# Prettier 검사
npm run format:check
```

## 코딩 컨벤션

- **TypeScript Strict Mode** 활성화
- **ESLint + Prettier** 코드 포맷팅
- **Tailwind CSS** 유틸리티 클래스 우선 사용
- **컴포넌트**: 함수형 컴포넌트 + Hooks
- **상태 관리**: 로컬 상태는 useState, 전역 상태는 Zustand, 서버 상태는 React Query
- **타입 네이밍**: API 관련 타입은 `*ApiResponse`, `*ApiRequest` 접미사 사용
