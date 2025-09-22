import { NextRequest, NextResponse } from 'next/server';
import { getThemeFromServerCookies, getLocaleFromServerCookies } from '@/utils/cookies';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 쿠키에서 테마와 언어 설정 읽기
  const cookieHeader = request.headers.get('cookie');
  const theme = getThemeFromServerCookies(cookieHeader || undefined);
  const locale = getLocaleFromServerCookies(cookieHeader || undefined);

  // 응답 헤더에 테마와 언어 정보 추가 (클라이언트에서 사용할 수 있도록)
  if (theme) {
    response.headers.set('x-theme', theme);
  }

  if (locale) {
    response.headers.set('x-locale', locale);
  }

  // 다크 모드인 경우 HTML에 클래스 추가를 위한 스크립트 인젝션 준비
  if (theme === 'dark') {
    response.headers.set('x-theme-class', 'dark');
  }

  return response;
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};