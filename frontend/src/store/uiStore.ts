import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: { name: string; phone?: string; email?: string; role?: string } | null;
  setUser: (user: { name: string; phone?: string; email?: string; role?: string } | null) => void;
}
export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  isDarkMode: false, // In a real app, you might sync this with Tailwind's dark mode via next-themes
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  user: null,
  setUser: (user) => set({ user }),
}));
