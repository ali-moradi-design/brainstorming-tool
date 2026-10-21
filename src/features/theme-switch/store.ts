import { create } from 'zustand';

export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'bt:theme';

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable */
  }
};

type ThemeState = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

// index.html sets data-theme before first paint; the store simply mirrors it.
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: readTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}));
