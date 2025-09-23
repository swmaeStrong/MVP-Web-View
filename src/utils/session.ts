import type { SupportedLocale } from '@/config/i18n';

/**
 * 언어 설정에 따라 적절한 세션 제목을 반환합니다
 */
export function getSessionTitle(
  title: string,
  titleEng: string,
  locale: SupportedLocale
): string {
  return locale === 'ko' ? title : titleEng;
}

/**
 * 세션 데이터에서 언어별 제목을 가져오는 헬퍼 함수
 */
export function getLocalizedSessionTitle(
  session: { title: string; titleEng?: string },
  locale: SupportedLocale
): string {
  // titleEng가 없으면 title을 사용
  const titleEng = session.titleEng || session.title;
  return getSessionTitle(session.title, titleEng, locale);
}