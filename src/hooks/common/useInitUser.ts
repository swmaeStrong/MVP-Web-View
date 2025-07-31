import { useCallback } from 'react';
import { getUserInfo } from '@/shared/api/get';
import { useUserStore } from '@/stores/userStore';

export const useInitUser = () => {
  const { setCurrentUser } = useUserStore();

  const initializeUser = useCallback(async () => {
    try {
      console.log('👤 유저 정보를 가져오는 중...');
      const userInfo = await getUserInfo();

      if (userInfo && userInfo.userId && userInfo.nickname) {
        setCurrentUser({
          id: userInfo.userId,
          nickname: userInfo.nickname,
        });

        console.log('✅ 유저 정보 초기화 완료:', {
          id: userInfo.userId,
          nickname: userInfo.nickname,
        });

        return userInfo;
      } else {
        console.warn('⚠️ 유저 정보가 올바르지 않습니다:', userInfo);
        return null;
      }
    } catch (error) {
      console.error('❌ 유저 정보 로드 실패:', error);
      throw error;
    }
  }, [setCurrentUser]);

  return { initializeUser };
};
