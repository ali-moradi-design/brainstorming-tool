import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Returns a function with a stable identity that always calls the latest `fn`.
 * Use it for handlers passed to memoized children (or React Flow), so they do not re-render.
 */
export function useEvent<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: A) => ref.current(...args), []);
}
