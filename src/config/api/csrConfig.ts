import axios from 'axios';

import { useUserStore } from '@/stores/userStore';
import { handleApiError } from '@/utils/error-handler';
import { requestTokenFromSwift } from '../../utils/token-bridge';
import { noAccessTokenCode } from '../errorCode';
import { getOsEnv } from './osConfig';
import { removeRscAccess, setRscToken } from './ssrConfig';
import { BASEURL } from './url';

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
    noAccessTokenCode.includes(error.response.data?.code)
  );
};

/**
 * 에러 로깅 및 리포팅
 */
const logAndReportError = (error: any, instanceName: string, isTokenRefreshFailure = false) => {
  const currentUser = useUserStore.getState().currentUser;
  
  // 인증 에러 중 토큰 갱신 실패인 경우 추가 컨텍스트 포함
  const errorContext = {
    feature: 'api-request',
    component: `axios-${instanceName}-interceptor`,
    userId: currentUser?.id,
    ...(isTokenRefreshFailure && {
      action: 'token-refresh-failure',
      isAuthRecoveryFailed: true,
    }),
  };
  
  handleApiError(error, errorContext);
};

/**
 * 인증 실패 시 권한 없음 페이지로 리다이렉트
 */
const redirectToUnauthorized = () => {
  try {
    if (typeof window !== 'undefined' && window.location) {
      window.location.replace('/unauthorized');
    }
  } catch (error) {
    console.error('Error during redirect:', error);
  }
};

/**
 * 공통 에러 처리 인터셉터 생성
 */
const createTokenRetryInterceptor = (apiInstance: typeof API, instanceName: string) => {
  return async (error: any) => {
    const isAuthError = isTokenRetryNeeded(error);
    
    // 토큰 관련 에러인 경우 갱신 시도
    if (isAuthError) {
      const { config } = error;
      
      try {
        console.log(`${instanceName}: Token error detected, attempting to refresh token...`);
        
        // 새 토큰 요청
        const newToken = await handleAccessTokenRequest();
        
        if (newToken) {
          console.log(`${instanceName}: Token refresh successful, retrying original request...`);
          
          // 새로운 axios 인스턴스 생성 (일회용)
          const tempAxiosInstance = axios.create({
            baseURL: config.baseURL || BASEURL,
            headers: {
              ...config.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          });
          
          // 새 인스턴스로 요청 재시도 - 성공하면 원본 에러는 로깅하지 않음
          return tempAxiosInstance.request({
            ...config,
            headers: {
              ...config.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          });
        } else {
          console.error(`${instanceName}: Failed to refresh token, will log and redirect`);
          
          // 토큰 갱신 실패 시에만 로깅 및 리다이렉트
          redirectToUnauthorized();
          logAndReportError(error, instanceName, true);
          throw error;
        }
      } catch (refreshError) {
        console.error(`${instanceName}: Token refresh error:`, refreshError);
        
        // 토큰 갱신 중 에러 발생 시에만 로깅 및 리다이렉트
        redirectToUnauthorized();
        logAndReportError(error, instanceName, true);
        throw error;
      }
    }
    
    // 인증 에러가 아닌 다른 에러의 경우 바로 로깅
    logAndReportError(error, instanceName);
    throw error;
  };
};

// Response 인터셉터 등록
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

  try {
    return await tokenRefreshState.promise;
  } finally {
    // 토큰 갱신 상태 초기화
    tokenRefreshState.isRefreshing = false;
    tokenRefreshState.promise = null;
  }
};

/**
 * 실제 토큰 갱신 수행
 */
const performTokenRefresh = async (): Promise<string | null> => {
  try {
    console.log('Requesting new token from Swift...');
    
    // 기존 토큰 삭제
    removeRccAccess();
    removeRscAccess();

    // 새 토큰 요청
    const osEnv = getOsEnv();
    let newAccessToken = null;
    if (osEnv === 'Mac') {
      newAccessToken = await requestTokenFromSwift();
    } else {
      newAccessToken = await requestTokenFromSwift();
    }

    
    if (newAccessToken) {
      console.log('New token received, updating headers...');
      
      // 새 토큰 설정
      setRccToken(newAccessToken);
      setRscToken(newAccessToken);
      
      return newAccessToken;
    } else {
      console.error('Failed to get new token from Swift');
      return null;
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    return null;
  }
};