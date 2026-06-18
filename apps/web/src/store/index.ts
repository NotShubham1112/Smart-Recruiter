import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));

interface CandidateStore {
  selectedCandidateId: string | null;
  setSelectedCandidate: (id: string | null) => void;
}

export const useCandidateStore = create<CandidateStore>((set) => ({
  selectedCandidateId: null,
  setSelectedCandidate: (id) => set({ selectedCandidateId: id }),
}));
