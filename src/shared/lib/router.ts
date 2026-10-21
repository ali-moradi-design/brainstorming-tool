import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

const getPath = () => window.location.hash.replace(/^#/, '') || '/';

/** Minimal hash router: works on static hosting without server rewrites. */
export const useHashPath = (): string => useSyncExternalStore(subscribe, getPath, () => '/');

export const navigate = (path: string): void => {
  window.location.hash = path;
};

export const boardPath = (id: string): string => `/board/${id}`;

export const matchBoardId = (path: string): string | null =>
  /^\/board\/([^/]+)$/.exec(path)?.[1] ?? null;
