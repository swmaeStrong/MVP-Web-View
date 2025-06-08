import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// 유저 타입 정의
export interface User {
  id: string;
  nickname: string;
}

// 유저 스토어 상태 타입
interface UserState {
  // 현재 로그인한 사용자 정보
  currentUser: User | null;

  // Actions
  setCurrentUser: (user: User | null) => void;
  clearCurrentUser: () => void;
}

// Zustand 스토어 생성
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        currentUser: null,

        // Actions
        setCurrentUser: user =>
          set({ currentUser: user }, false, 'setCurrentUser'),

        clearCurrentUser: () =>
          set({ currentUser: null }, false, 'clearCurrentUser'),
      }),
      {
        name: 'user-store', // localStorage key
        partialize: state => ({
          currentUser: state.currentUser,
        }),
      }
    ),
    {
      name: 'user-store', // devtools에서 표시될 이름
    }
  )
);

// 선택자 훅들 (성능 최적화)
export const useCurrentUser = () => useUserStore(state => state.currentUser);
