import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GroupTabState {
  lastVisitedTab: string | null;
  setLastVisitedTab: (tab: string) => void;
  getLastVisitedTab: () => string | null;
}

export const useGroupTabStore = create<GroupTabState>()(
  persist(
    (set, get) => ({
      lastVisitedTab: null,
      
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
    }),
    {
      name: 'group-tab-storage', // localStorage key name
      partialize: (state) => ({ lastVisitedTab: state.lastVisitedTab }), // Only persist lastVisitedTab
    }
  )
);