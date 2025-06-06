/**
 * 웹뷰에서 Swift 앱으로 토큰 요청하는 유틸리티
 */

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
  }
}

/**
 * Swift 앱에 토큰 요청
 */
export const requestTokenFromSwift = (): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> => {
  return new Promise(resolve => {
    try {
      if (window.webkit?.messageHandlers?.tokenHandler) {
        // Swift 앱에 토큰 요청 메시지 전송
        window.webkit.messageHandlers.tokenHandler.postMessage({
          type: 'request_token',
          timestamp: Date.now(),
        });

        // Swift에서 응답을 받기 위한 전역 함수 등록
        window.receiveTokenFromSwift = (
          accessToken: string,
          refreshToken: string
        ) => {
          resolve({ accessToken, refreshToken });
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
        // 웹뷰가 아닌 환경에서는 mock 데이터 반환
        console.log('📱 웹뷰 환경이 아님 - mock 토큰 반환');
        setTimeout(
          () =>
            resolve({
              accessToken: 'mock_access_token_' + Date.now(),
              refreshToken: 'mock_refresh_token_' + Date.now(),
            }),
          100
        );
      }
    } catch (error) {
      console.error('❌ 토큰 요청 에러:', error);
      resolve(null);
    }
  });
};
