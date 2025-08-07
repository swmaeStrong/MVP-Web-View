import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GroupTabState {
  lastVisitedTab: string | null;
  setLastVisitedTab: (tab: string) => void;
  getLastVisitedTab: () => string | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useGroupTabStore = create<GroupTabState>()(
  persist(
    (set, get) => ({
      lastVisitedTab: null,
      _hasHydrated: false,
      
      setLastVisitedTab: (tab: string) => {
        // Only save if it's a group-related path
        if (tab.startsWith('/group/')) {
          set({ lastVisitedTab: tab });
        }
      },
      
      getLastVisitedTab: () => {
        const state = get();
        return state.lastVisitedTab;
      },
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'group-tab-storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lastVisitedTab: state.lastVisitedTab }), // Only persist lastVisitedTab
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);