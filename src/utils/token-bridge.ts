/**
 * 웹뷰에서 Swift 앱으로 토큰 요청하는 유틸리티
 */

import { getUserInfo } from '../shared/api/get';
import { setRccToken } from '../shared/configs/api/csrConfig';
import { setRscToken } from '../shared/configs/api/ssrConfig';
import { useUserStore } from '../stores/userStore';

// TypeScript 타입 정의
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        tokenHandler?: {
          postMessage: (message: any) => void;
        };
      };
    };
    receiveTokenFromSwift?: (accessToken: string, refreshToken: string) => void;
    initAccessToken?: (token: string) => void;
  }
}

/**
 * 유저 정보 초기화 함수 (훅이 아닌 일반 함수)
 */
const initializeUserInfo = async () => {
  try {
    console.log('👤 유저 정보를 가져오는 중...');
    const userInfo = await getUserInfo();

    if (userInfo && userInfo.userId && userInfo.nickname) {
      // 스토어 직접 접근하여 유저 정보 설정
      useUserStore.getState().setCurrentUser({
        id: userInfo.userId,
        nickname: userInfo.nickname,
      });

      console.log('✅ 유저 정보 저장 완료:', userInfo);
      return userInfo;
    } else {
      console.warn('⚠️ 유저 정보가 올바르지 않습니다:', userInfo);
      return null;
    }
  } catch (error) {
    console.error('❌ 유저 정보 로드 실패:', error);
    throw error;
  }
};

/**
 * Swift 앱에 토큰 요청
 */
export const requestTokenFromSwift = (): Promise<string | null> => {
  return new Promise(resolve => {
    try {
      if (window.webkit?.messageHandlers?.tokenHandler) {
        // Swift 앱에 토큰 요청 메시지 전송
        window.webkit.messageHandlers.tokenHandler.postMessage({
          type: 'request_token',
          timestamp: Date.now(),
        });

        // Swift에서 응답을 받기 위한 전역 함수 등록
        window.receiveTokenFromSwift = (accessToken: string) => {
          resolve(accessToken);
          delete window.receiveTokenFromSwift;
        };

        // 5초 타임아웃
        setTimeout(() => {
          if (window.receiveTokenFromSwift) {
            delete window.receiveTokenFromSwift;
            resolve(null);
          }
        }, 5000);

        console.log('✅ 토큰 요청 전송됨');
      } else {
        // 웹뷰가 아닌 환경에서는 null 반환
        console.log('📱 웹뷰 환경이 아님 - 토큰 요청 불가');
        resolve(null);
      }
    } catch (error) {
      console.error('❌ 토큰 요청 에러:', error);
      resolve(null);
    }
  });
};

/**
 * 전역 토큰 수신 함수 설정
 * Swift 앱에서 window.initAccessToken(token) 형태로 호출 가능
 */
if (typeof window !== 'undefined') {
  window.initAccessToken = async function (token: string) {
    console.log('✅ Swift에서 토큰 받음:', token);

    try {
      // API 인스턴스에 토큰 설정
      setRccToken(token);
      await setRscToken(token);

      console.log('🔐 토큰이 저장되었습니다');

      // 유저 정보 초기화 (일반 함수 호출)
      await initializeUserInfo();
    } catch (error) {
      console.error('❌ 토큰 설정 또는 유저 정보 로드 실패:', error);
    }
  };
}
