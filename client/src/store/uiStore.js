import { create } from "zustand";

export const useUiStore = create((set) => ({
  adminSidebarOpen: false,
  setAdminSidebarOpen: (adminSidebarOpen) => set({ adminSidebarOpen }),
  toggleAdminSidebar: () => set((state) => ({ adminSidebarOpen: !state.adminSidebarOpen })),
}));
