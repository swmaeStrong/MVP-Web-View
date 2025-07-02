import axios from 'axios';

import { useUserStore } from '@/stores/userStore';
import { handleApiError } from '@/utils/error-handler';
import { requestTokenFromSwift } from '../../../utils/token-bridge';
import { noAccessTokenCode } from '../errorCode';
import { removeRscAccess, setRscToken } from './ssrConfig';
import { BASEURL } from './url';

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

API.interceptors.response.use(
  response => response,
  async error => {
    console.log('API.interceptors.response.use');
    console.log(' 11 error', error);
    // 토큰 관련 에러 처리
    if (error.response) {
      console.log(error.response);
      console.log(' 11 error.response');
      const {
        response: {
          data: { code },
        },
        config,
      } = error;
      console.log('code', code);
      //Access token 재발급 과정
      if (noAccessTokenCode.includes(code)) {
        console.log('accessToken이 있는 경우에만 재발급 요청');
        //  accessToekn이 있는 경우에만 재발급 요청
        if (API.defaults.headers['Authorization']) {
          console.log('accessToken이 있는 경우에만 재발급 요청 1');
          await handleAccessTokenRequest();
          console.log('accessToken이 있는 경우에만 재발급 요청 2');
          // 요청 다시 실행 
          return API.request(config);
        }
      }
    }

    // 통합 에러 핸들러로 전달
    const currentUser = useUserStore.getState().currentUser;
    const unifiedError = handleApiError(error, {
      feature: 'api-request',
      component: 'axios-interceptor',
      userId: currentUser?.id,
    });

    // 원본 에러를 throw (api-utils.ts에서 처리하도록)
    throw error;
  }
);

FORMAPI.interceptors.response.use(
  response => response,
  async error => {
    // 토큰 관련 에러 처리
    if (error.response) {
      const {
        response: {
          data: { errorCode },
        },
        config,
      } = error;

      //Access token 재발급 과정
      if (noAccessTokenCode.includes(errorCode)) {
        //  accessToekn이 있는 경우에만 재발급 요청
        if (API.defaults.headers['Authorization']) {
          await handleAccessTokenRequest();
          // 요청 다시 실행
          return FORMAPI.request(config);
        }
      }
    }

    // 통합 에러 핸들러로 전달
    const currentUser = useUserStore.getState().currentUser;
    const unifiedError = handleApiError(error, {
      feature: 'api-request',
      component: 'axios-form-interceptor',
      userId: currentUser?.id,
    });

    // 원본 에러를 throw (api-utils.ts에서 처리하도록)
    throw error;
  }
);

const handleAccessTokenRequest = async () => {
  // 기존 accessToken 삭제
  removeRccAccess();
  removeRscAccess();

  // 새로운 accessToken 요청
  const newAccessToken = await requestTokenFromSwift();
  if (newAccessToken) {
    setRccToken(newAccessToken);
    setRscToken(newAccessToken);
  }
};
