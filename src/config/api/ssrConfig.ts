'use server';

import { STORAGE_ACCESS_KEY } from '@/config/constants/storage';
import { cookies } from 'next/headers';

/**
 * 쿠키 저장 (Access)
 */
export async function setRscToken(access: string) {
  const cookieStore = await cookies();
  cookieStore.set(STORAGE_ACCESS_KEY, access);
}

/**
 * 쿠키 삭제
 */
export async function removeRscAccess() {
  const cookieStore = await cookies();
  cookieStore.delete(STORAGE_ACCESS_KEY);
}

/**
 * 쿠키 조회
 */
export async function getRscAccess(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(STORAGE_ACCESS_KEY)?.value;
}

/**
 * Authorization 헤더 반환
 */
export async function getRscAuthHeader(): Promise<{ Authorization: string }> {
  const token = await getRscAccess();
  if (!token) throw new Error('4105'); // 커스텀 에러 코드, 필요시 의미 부여 가능
  return { Authorization: `Bearer ${token}` };
}
