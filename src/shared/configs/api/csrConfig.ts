import axios from 'axios';

import { useUserStore } from '@/stores/userStore';
import { handleApiError } from '@/utils/error-handler';
import { requestTokenFromSwift } from '../../../utils/token-bridge';
import { noAccessTokenCode } from '../errorCode';
import { removeRscAccess, setRscToken } from './ssrConfig';
import { BASEURL } from './url';

// 토큰 갱신 설정
const TOKEN_REFRESH_CONFIG = {
  MAX_RETRY_COUNT: 1,
  RETRY_DELAY: 1000, // 1초
} as const;

// 재시도 카운터를 저장할 WeakMap
const retryCountMap = new WeakMap<any, number>();

// 토큰 갱신 상태 관리
let tokenRefreshState = {
  isRefreshing: false,
  promise: null as Promise<string | null> | null,
};

export const API = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const FORMAPI = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const setRccToken = (access: string) => {
  API.defaults.headers['Authorization'] = `Bearer ${access}`;
  FORMAPI.defaults.headers['Authorization'] = `Bearer ${access}`;
};

export const removeRccAccess = () => {
  delete API.defaults.headers['Authorization'];
  delete FORMAPI.defaults.headers['Authorization'];
};


export const getRccAccess = (): string =>
  `${API.defaults.headers['Authorization']}`;

// 개발 환경의 경우에는 env에 있는 토큰을 사용
API.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development') {
    config.headers['Authorization'] =
      `Bearer ${process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN}`;
  }
  return config;
});

FORMAPI.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development') {
    config.headers['Authorization'] =
      `Bearer ${process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN}`;
  }
  return config;
});

/**
 * 토큰 재시도가 필요한 에러인지 확인
 */
const isTokenRetryNeeded = (error: any): boolean => {
  return (
    error.response &&
    noAccessTokenCode.includes(error.response.data?.code) &&
    API.defaults.headers['Authorization']
  );
};

/**
 * 에러 로깅 및 리포팅
 */
const logAndReportError = (error: any, instanceName: string) => {
  const currentUser = useUserStore.getState().currentUser;
  handleApiError(error, {
    feature: 'api-request',
    component: `axios-${instanceName}-interceptor`,
    userId: currentUser?.id,
  });
};

/**
 * 공통 에러 처리 인터셉터 생성
 */
const createTokenRetryInterceptor = (apiInstance: typeof API, instanceName: string) => {
  return async (error: any) => {
    if (isTokenRetryNeeded(error)) {
      const { config } = error;
      const retryResult = await handleTokenRetry(config, instanceName);
      
      if (retryResult.shouldRetry) {
        return apiInstance.request(config);
      }
    }
    redirectToUnauthorized();
    logAndReportError(error, instanceName);
    throw error;
  };
};

/**
 * 인증 실패 시 권한 없음 페이지로 리다이렉트
 */
const redirectToUnauthorized = () => {
  try {
    console.log('Attempting redirect to unauthorized page...');
    
    if (typeof window !== 'undefined' && window.location) {
      console.log('Using window.location.replace for redirect');
      // replace를 사용하여 브라우저 히스토리에 남기지 않음
      window.location.replace('/unauthorized');
    } else {
      console.warn('Window object not available - cannot redirect');
    }
  } catch (error) {
    console.error('Error during redirect:', error);
  }
};

/**
 * 재시도 횟수 처리
 */
const handleRetryCount = (config: any, instanceName: string): { canRetry: boolean; currentCount: number } => {
  const currentRetryCount = retryCountMap.get(config) || 0;
  
  if (currentRetryCount >= TOKEN_REFRESH_CONFIG.MAX_RETRY_COUNT) {
    console.error(`${instanceName} max retry count exceeded (${TOKEN_REFRESH_CONFIG.MAX_RETRY_COUNT})`);
    retryCountMap.delete(config);
    removeRccAccess();
    removeRscAccess();
    
    // 인증 실패 시 권한 없음 페이지로 리다이렉트
    console.log('Max retry exceeded - triggering redirect');
    setTimeout(() => redirectToUnauthorized(), 100); // 비동기 처리
    
    return { canRetry: false, currentCount: currentRetryCount };
  }

  const newCount = currentRetryCount + 1;
  retryCountMap.set(config, newCount);
  return { canRetry: true, currentCount: newCount };
};

/**
 * 토큰 재시도 로직 처리
 */
const handleTokenRetry = async (config: any, instanceName: string): Promise<{ shouldRetry: boolean }> => {
  const { canRetry, currentCount } = handleRetryCount(config, instanceName);
  
  if (!canRetry) {
    return { shouldRetry: false };
  }

  console.log(`${instanceName} token refresh attempt ${currentCount}/${TOKEN_REFRESH_CONFIG.MAX_RETRY_COUNT}`);
  
  try {
    const newToken = await handleAccessTokenRequest();
    
    if (newToken) {
      await new Promise(resolve => setTimeout(resolve, TOKEN_REFRESH_CONFIG.RETRY_DELAY));
      return { shouldRetry: true };
    } else {
      console.error(`${instanceName} token refresh failed - no new token received`);
      retryCountMap.delete(config);
      
      // 토큰 갱신 실패 시 권한 없음 페이지로 리다이렉트
      console.log('Token refresh failed - triggering redirect');
      setTimeout(() => redirectToUnauthorized(), 100); // 비동기 처리
      
      return { shouldRetry: false };
    }
  } catch (refreshError) {
    console.error(`${instanceName} token refresh error:`, refreshError);
    retryCountMap.delete(config);
    
    // 토큰 갱신 에러 시도 권한 없음 페이지로 리다이렉트
    console.log('Token refresh error - triggering redirect');
    setTimeout(() => redirectToUnauthorized(), 100); // 비동기 처리
    
    return { shouldRetry: false };
  }
};

API.interceptors.response.use(
  response => response,
  createTokenRetryInterceptor(API, 'API')
);

FORMAPI.interceptors.response.use(
  response => response,
  createTokenRetryInterceptor(FORMAPI, 'FORMAPI')
);

/**
 * 토큰 갱신 요청 처리
 */
const handleAccessTokenRequest = async (): Promise<string | null> => {
  // 이미 토큰 갱신 중이면 대기
  if (tokenRefreshState.isRefreshing && tokenRefreshState.promise) {
    console.log('Token refresh already in progress, waiting...');
    return await tokenRefreshState.promise;
  }

  // 토큰 갱신 시작
  tokenRefreshState.isRefreshing = true;
  tokenRefreshState.promise = performTokenRefresh();

  return await tokenRefreshState.promise;
};

/**
 * 실제 토큰 갱신 수행
 */
const performTokenRefresh = async (): Promise<string | null> => {
  try {
    console.log('Starting token refresh process...');
    
    // 기존 토큰 삭제
    removeRccAccess();
    removeRscAccess();

    // 새 토큰 요청
    const newAccessToken = await requestTokenFromSwift();
    
    if (newAccessToken) {
      console.log('New token received, setting up...');
      setRccToken(newAccessToken);
      setRscToken(newAccessToken);
      return newAccessToken;
    } else {
      console.error('Failed to get new token from Swift');
      // Swift에서 토큰을 받지 못한 경우 권한 없음 페이지로 리다이렉트
      console.log('Swift token request failed - triggering redirect');
      setTimeout(() => redirectToUnauthorized(), 100); // 비동기 처리
      return null;
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    // 토큰 갱신 에러 시 권한 없음 페이지로 리다이렉트
    console.log('Token refresh process error - triggering redirect');
    setTimeout(() => redirectToUnauthorized(), 100); // 비동기 처리
    return null;
  } finally {
    // 토큰 갱신 상태 초기화
    tokenRefreshState.isRefreshing = false;
    tokenRefreshState.promise = null;
  }
};
