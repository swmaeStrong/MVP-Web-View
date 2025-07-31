import { useCurrentUser } from '@/stores/userStore';
import { useCallback } from 'react';

export const useScrollToMyRank = () => {
  const currentUser = useCurrentUser();

  const scrollToMyRank = useCallback(() => {
    if (!currentUser) return;

    // 현재 유저의 DOM 요소 찾기 (data-user-id 속성 사용)
    const userElement = document.querySelector(
      `[data-user-id="${currentUser.id}"]`
    );

    if (userElement) {
      // 부드럽게 스크롤
      userElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // 잠깐 하이라이트 효과 추가
      userElement.classList.add('animate-pulse');
      setTimeout(() => {
        userElement.classList.remove('animate-pulse');
      }, 2000);
    }
  }, [currentUser]);

  return { scrollToMyRank };
};
