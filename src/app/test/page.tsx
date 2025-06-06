'use client';

import { requestTokenFromSwift } from '@/utils/token-bridge';
import { useState } from 'react';

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTokenRequest = async () => {
    setIsLoading(true);
    setResult(null);

    console.log('🚀 토큰 요청 시작...');

    try {
      const tokens = await requestTokenFromSwift();
      setResult({
        success: !!tokens,
        data: tokens,
        message: tokens
          ? 'Swift로부터 토큰 수신 성공'
          : 'Swift로부터 응답 없음 (5초 타임아웃)',
      });

      console.log('결과:', tokens);
    } catch (error) {
      setResult({
        success: false,
        data: null,
        message: '토큰 요청 중 에러 발생',
        error: error,
      });

      console.error('에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-lg'>
        {/* 제목 */}
        <h1 className='mb-8 text-center text-2xl font-bold'>
          토큰 브릿지 테스트
        </h1>

        {/* 토큰 요청 버튼 */}
        <button
          onClick={handleTokenRequest}
          disabled={isLoading}
          className={`w-full rounded-lg px-6 py-4 text-lg font-bold text-white transition-all ${
            isLoading
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
          }`}
        >
          {isLoading ? '토큰 요청 중...' : '토큰 요청'}
        </button>

        {/* 결과 표시 */}
        {result && (
          <div className='mt-8'>
            {/* 성공/실패 상태 */}
            <div
              className={`mb-4 rounded-lg p-4 text-center text-lg font-bold ${
                result.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {result.success ? '✅ 성공' : '❌ 실패'}
            </div>

            {/* 메시지 */}
            <div className='mb-4 rounded-lg bg-white p-4 shadow'>
              <h3 className='mb-2 font-bold'>상태:</h3>
              <p className='text-gray-700'>{result.message}</p>
            </div>

            {/* 토큰 데이터 */}
            {result.data && (
              <div className='rounded-lg bg-white p-4 shadow'>
                <h3 className='mb-2 font-bold'>받은 토큰:</h3>
                <div className='space-y-2'>
                  <div>
                    <span className='font-medium'>Access Token:</span>
                    <div className='mt-1 rounded bg-gray-100 p-2 font-mono text-sm break-all'>
                      {result.data.accessToken}
                    </div>
                  </div>
                  <div>
                    <span className='font-medium'>Refresh Token:</span>
                    <div className='mt-1 rounded bg-gray-100 p-2 font-mono text-sm break-all'>
                      {result.data.refreshToken}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 에러 정보 */}
            {result.error && (
              <div className='rounded-lg bg-white p-4 shadow'>
                <h3 className='mb-2 font-bold text-red-600'>에러 정보:</h3>
                <pre className='overflow-auto rounded bg-red-50 p-2 text-sm text-red-700'>
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 설명 */}
        <div className='mt-8 rounded-lg bg-blue-50 p-4'>
          <h3 className='mb-2 font-bold'>예상 결과:</h3>
          <ul className='space-y-1 text-sm'>
            <li>
              • <strong>일반 브라우저:</strong> Mock 토큰 반환 (성공)
            </li>
            <li>
              • <strong>웹뷰 (Swift 미구현):</strong> 5초 후 실패
            </li>
            <li>
              • <strong>웹뷰 (Swift 구현완료):</strong> 실제 토큰 반환 (성공)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
