import { useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

// 토스트 옵션 타입 정의
interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  id?: string; // 중복 방지를 위한 ID
}

export function useToast() {
  // 중복 토스트 방지를 위한 ref
  const activeToasts = useRef(new Set<string>());

  const success = useCallback((message: string, options?: ToastOptions) => {
    const toastId = options?.id || `success-${message}`;
    
    // 이미 같은 메시지가 표시 중이면 무시
    if (activeToasts.current.has(toastId)) {
      return toastId;
    }

    activeToasts.current.add(toastId);
    
    const result = toast.success(message, {
      id: toastId,
      duration: options?.duration,
      position: options?.position,
    });

    // 토스트가 사라질 때 Set에서 제거하기 위해 타이머 설정
    setTimeout(() => {
      activeToasts.current.delete(toastId);
    }, options?.duration || 4000);

    return result;
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    const toastId = options?.id || `error-${message}`;
    
    // 이미 같은 메시지가 표시 중이면 무시
    if (activeToasts.current.has(toastId)) {
      return toastId;
    }

    activeToasts.current.add(toastId);
    
    const result = toast.error(message, {
      id: toastId,
      duration: options?.duration || 5000, // 에러는 조금 더 오래 표시
      position: options?.position,
    });

    // 토스트가 사라질 때 Set에서 제거하기 위해 타이머 설정
    setTimeout(() => {
      activeToasts.current.delete(toastId);
    }, options?.duration || 5000);

    return result;
  }, []);

  const loading = useCallback((message: string, options?: ToastOptions) => {
    const toastId = options?.id || `loading-${message}`;
    
    return toast.loading(message, {
      id: toastId,
      position: options?.position,
    });
  }, []);

  const promise = useCallback(
    <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      },
      options?: ToastOptions
    ): Promise<T> => {
      const toastId = options?.id || `promise-${messages.loading}`;
      
      return toast.promise(promise, messages, {
        id: toastId,
        success: {
          duration: options?.duration || 4000,
          position: options?.position,
        },
        error: {
          duration: options?.duration || 5000,
          position: options?.position,
        },
        loading: {
          position: options?.position,
        },
      });
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      activeToasts.current.delete(toastId);
    } else {
      activeToasts.current.clear();
    }
    toast.dismiss(toastId);
  }, []);

  const remove = useCallback((toastId: string) => {
    activeToasts.current.delete(toastId);
    toast.remove(toastId);
  }, []);

  return {
    success,
    error,
    loading,
    promise,
    dismiss,
    remove,
  };
}