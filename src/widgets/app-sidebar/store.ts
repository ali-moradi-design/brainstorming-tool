import { create } from 'zustand';

const KEY = 'bt:sidebar';

const read = (): boolean => {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) return stored === 'open';
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia('(min-width: 768px)').matches;
};

type SidebarState = { open: boolean; toggle: () => void };

export const useSidebar = create<SidebarState>((set, get) => ({
  open: read(),
  toggle: () => {
    const open = !get().open;
    try {
      localStorage.setItem(KEY, open ? 'open' : 'closed');
    } catch {
      /* storage unavailable */
    }
    set({ open });
  },
}));
