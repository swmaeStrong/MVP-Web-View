// api-utils.ts
import { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types/common/apiResponse';
import { captureApiError, addBreadcrumb } from './sentry';

export async function parseApi<T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
  context?: {
    endpoint?: string;
    method?: string;
    userId?: string;
  }
): Promise<T> {
  try {
    const response = await promise;
    const { data } = response;
    
    // API 호출 성공 브레드크럼 추가
    addBreadcrumb(
      `API 호출 성공: ${context?.endpoint || 'unknown'}`,
      'api',
      'info',
      {
        method: context?.method || 'unknown',
        statusCode: response.status,
        endpoint: context?.endpoint,
      }
    );
    
    // 204 No Content 응답 처리
    if (response.status === 204) {
      // 204 No Content는 성공이지만 반환할 데이터가 없음
      return null as unknown as T;
    }
    
    if (!data.isSuccess) {
      const error = new Error(data.message);
      
      // API 응답 에러를 Sentry에 기록
      if (context) {
        captureApiError(error, {
          endpoint: context.endpoint || 'unknown',
          method: context.method || 'unknown',
          statusCode: response.status,
          userId: context.userId,
        });
      }
      
      throw error;
    }
    
    return data.data;
  } catch (error) {
    // 네트워크 에러나 기타 Axios 에러 처리
    if (error instanceof AxiosError) {
      const apiError = new Error(
        error.response?.data?.message || 
        error.message || 
        'API 요청 중 오류가 발생했습니다.'
      );
      
      // Axios 에러를 Sentry에 기록
      if (context) {
        captureApiError(apiError, {
          endpoint: context.endpoint || 'unknown',
          method: context.method || 'unknown',
          statusCode: error.response?.status,
          userId: context.userId,
        });
      }
      
      // 에러 브레드크럼 추가
      addBreadcrumb(
        `API 에러: ${context?.endpoint || 'unknown'}`,
        'api',
        'error',
        {
          method: context?.method || 'unknown',
          statusCode: error.response?.status,
          errorMessage: error.message,
        }
      );
      
      throw apiError;
    }
    
    // 이미 처리된 에러는 다시 던짐
    throw error;
  }
}
