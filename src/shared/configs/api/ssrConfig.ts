'use server';

import {
  STORAGE_ACCESS_KEY,
  STORAGE_REFRESH_KEY,
} from '@/shared/constants/storage';
import { cookies } from 'next/headers';

/**
 * 쿠키 저장 (Access/Refresh)
 */
export async function setRscToken(access: string, refresh?: string) {
  const cookieStore = await cookies();
  cookieStore.set(STORAGE_ACCESS_KEY, access);
  if (refresh) {
    cookieStore.set(STORAGE_REFRESH_KEY, refresh);
  }
}

/**
 * 쿠키 삭제
 */
export async function removeRscAccess() {
  const cookieStore = await cookies();
  cookieStore.delete(STORAGE_ACCESS_KEY);
}

export async function removeRscRefresh() {
  const cookieStore = await cookies();
  cookieStore.delete(STORAGE_REFRESH_KEY);
}

/**
 * 쿠키 조회
 */
export async function getRscAccess(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(STORAGE_ACCESS_KEY)?.value;
}

export async function getRscRefresh(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(STORAGE_REFRESH_KEY)?.value;
}

/**
 * Authorization 헤더 반환
 */
export async function getRscAuthHeader(): Promise<{ Authorization: string }> {
  const token = await getRscAccess();
  if (!token) throw new Error('4105'); // 커스텀 에러 코드, 필요시 의미 부여 가능
  return { Authorization: `Bearer ${token}` };
}
