import { useCallback } from 'react';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';

export const useInitUser = () => {
  const { refetch } = useCurrentUser();

  const initializeUser = useCallback(async () => {
    try {
      console.log('👤 유저 정보를 가져오는 중...');
      
      // React Query를 통해 유저 정보 refetch
      const result = await refetch();
      const userInfo = result.data;

      if (userInfo && userInfo.id && userInfo.nickname) {
        console.log('✅ 유저 정보 초기화 완료:', {
          id: userInfo.id,
          nickname: userInfo.nickname,
        });

        return {
          userId: userInfo.id,
          nickname: userInfo.nickname,
        };
      } else {
        console.warn('⚠️ 유저 정보가 올바르지 않습니다:', userInfo);
        return null;
      }
    } catch (error) {
      console.error('❌ 유저 정보 로드 실패:', error);
      throw error;
    }
  }, [refetch]);

  return { initializeUser };
};
