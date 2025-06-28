# Sentry 통합 가이드

## 📋 개요

MVP Web View 프로젝트에 Sentry 에러 추적 및 성능 모니터링이 통합되어 있습니다. 이 문서는 Sentry 설정, 사용법, 트러블슈팅을 포함한 완전한 가이드입니다.

## ⚙️ 환경 변수 설정

### 필수 설정
```bash
# Sentry DSN (필수)
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# 환경 구분 (필수)
NEXT_PUBLIC_ENV="development"  # development, staging, production

# 서버사이드 경고 억제 (권장)
SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING=1
SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING=1
```

### 선택적 설정
```bash
# 개발 환경에서 Sentry 테스트 (기본: false)
SENTRY_DEBUG="true"

# 빌드 시 소스맵 업로드용 (선택사항)
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="your-project-name"
SENTRY_AUTH_TOKEN="your-auth-token"

# 릴리즈 버전 추적
NEXT_PUBLIC_SENTRY_RELEASE="1.0.0"
```

## 🏗 시스템 구성

### 핵심 파일들
- `sentry.client.config.ts` - 클라이언트 사이드 Sentry 설정
- `instrumentation.ts` - Next.js 통합 설정
- `src/utils/sentry.ts` - Sentry 유틸리티 함수들
- `src/utils/error-handler.ts` - 통합 에러 핸들러
- `src/providers/SentryProvider.tsx` - React Error Boundary Provider

### 자동 에러 캐치
- **React 컴포넌트 에러**: Error Boundary가 자동 캐치
- **API 에러**: Axios 인터셉터가 자동 처리
- **JavaScript 런타임 에러**: 전역 에러 핸들러가 캐치

## 📊 환경별 동작

### 개발 환경 (Development)
- **Sentry 전송**: 기본 비활성화 (`SENTRY_DEBUG="true"`로 활성화 가능)
- **로깅**: 콘솔에 상세 에러 정보 출력
- **에러 저장**: 로컬 스토리지에 저장
- **접근 가능**: `/dev/error-logs` 페이지에서 에러 확인 가능

### 스테이징/운영 환경
- **Sentry 전송**: 활성화
- **민감정보**: 자동 마스킹 (헤더, 파라미터, 이메일 등)
- **세션 리플레이**: 운영 환경에서만 활성화
- **성능 모니터링**: 페이지 로드 시간, API 응답 시간 추적

## 📖 사용법

### 1. 수동 에러 전송
```tsx
import { captureError } from '@/utils/sentry';

try {
  // 에러가 발생할 수 있는 코드
} catch (error) {
  captureError(error as Error, {
    tags: { feature: 'user-action' },
    extra: { userId: user.id },
    level: 'error'
  });
}
```

### 2. 사용자 정보 설정
```tsx
import { setSentryUser } from '@/utils/sentry';

setSentryUser({
  id: user.id,
  email: user.email,
  username: user.username
});
```

### 3. 브레드크럼 추가
```tsx
import { addBreadcrumb } from '@/utils/sentry';

addBreadcrumb(
  '사용자가 버튼 클릭',
  'user-action',
  'info',
  { buttonName: 'submit' }
);
```

### 4. API 에러 처리 (자동)
```tsx
// parseApi 함수 사용 시 자동으로 에러 추적
const result = await parseApi(
  API.get('/endpoint'),
  {
    endpoint: '/endpoint',
    method: 'GET',
    userId: user.id
  }
);
```

## 🔒 보안 및 개인정보 보호

### 자동 마스킹되는 정보
- **헤더**: Authorization, Cookie, API Key 등
- **이메일**: `user@example.com` → `use***@example.com`
- **URL 파라미터**: 운영 환경에서 완전 제거
- **세션 리플레이**: 모든 텍스트 및 미디어 마스킹

### 필터링되는 에러
- 네트워크 취소 에러 (canceled)
- 404 에러 (NEXT_NOT_FOUND)
- 개발 환경 콘솔 브레드크럼

## 🧪 테스트 방법

### 1. 개발 에러 로그 확인
```
http://localhost:3000/dev/error-logs
```

### 2. 브라우저 콘솔 확인
```javascript
// 환경 변수 확인
console.log({
  env: process.env.NEXT_PUBLIC_ENV,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  debug: process.env.SENTRY_DEBUG
});

// Sentry 객체 확인
console.log({
  sentry: !!window.Sentry,
  hub: !!window.__SENTRY__?.hub
});

// 수동 테스트
window.Sentry?.captureMessage('테스트 메시지');
```

## 🚨 문제 해결

### 에러가 Sentry에 전송되지 않는 경우

#### 1. 환경 변수 확인
```bash
NEXT_PUBLIC_SENTRY_DSN="https://..." # 설정됨
NEXT_PUBLIC_ENV="development"         # 설정됨
SENTRY_DEBUG="true"                   # 개발 환경에서 테스트 시
```

#### 2. 개발 환경 Sentry 활성화
개발 환경에서는 기본적으로 Sentry 전송이 비활성화됩니다.
테스트하려면 `SENTRY_DEBUG="true"` 설정 후 서버 재시작

#### 3. 네트워크 확인
- 브라우저 개발자 도구 → Network 탭
- `sentry.io` 도메인으로 요청 확인
- VPN이나 방화벽으로 차단되는지 확인

#### 4. DSN 형식 확인
```bash
# 올바른 형식
https://공개키@o조직ID.ingest.us.sentry.io/프로젝트ID
```

### 자주 발생하는 문제들

#### "🚫 Sentry 전송 차단 (개발 환경)"
- **해결**: `SENTRY_DEBUG="true"` 설정

#### "Sentry DSN not configured"
- **해결**: `NEXT_PUBLIC_SENTRY_DSN` 올바르게 설정

#### 빌드 오류
```bash
# 캐시 삭제 후 재시작
rm -rf .next
npm run dev
```

## 💡 Auth Token 없이도 사용 가능

### 정상 작동하는 기능 (Auth Token 없어도)
- ✅ JavaScript 에러 추적
- ✅ React 컴포넌트 에러
- ✅ API 에러 수집
- ✅ 사용자 정보 추적
- ✅ 성능 모니터링
- ✅ 세션 리플레이

### Auth Token이 필요한 기능
- ❌ 소스맵 업로드 (정확한 에러 위치 표시)
- ❌ 릴리즈 추적
- ❌ 빌드 시 자동 배포 추적

### 결론
**Auth Token 없어도 Sentry는 충분히 유용합니다!** 나중에 운영 환경 배포나 정확한 디버깅이 필요할 때 추가하면 됩니다.

## 📋 체크리스트

### 설정 완료 확인
- [ ] `.env` 파일에 `NEXT_PUBLIC_SENTRY_DSN` 설정
- [ ] `NEXT_PUBLIC_ENV` 환경 구분 설정
- [ ] 개발 테스트 시 `SENTRY_DEBUG="true"` 설정
- [ ] 서버사이드 경고 억제 변수 설정

### 동작 확인
- [ ] 테스트 페이지에서 에러 발생 테스트
- [ ] 브라우저 콘솔에서 Sentry 객체 확인
- [ ] Sentry 대시보드에서 에러 수신 확인
- [ ] 개발 환경 에러 로그 페이지 접근 가능

---

이 가이드를 따라하면 Sentry 연동이 완전히 설정되고, 안정적인 에러 모니터링이 가능합니다! 🚀