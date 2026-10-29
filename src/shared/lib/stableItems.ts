import { useRef } from 'react';

/** True when both objects have the same keys and `Object.is`-equal values. */
export const shallowEqual = (a: object, b: object): boolean => {
  const ka = Object.keys(a) as (keyof typeof a)[];
  if (ka.length !== Object.keys(b).length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && Object.is(a[k], b[k]));
};

/**
 * Returns `items`, but keeps last render's object for every item that `equal` says did not change
 * (and last render's array when nothing changed). Memoized children then skip rendering.
 */
export function useStableItems<T extends { id: string }>(
  items: T[],
  equal: (prev: T, next: T) => boolean,
): T[] {
  const cache = useRef<{ list: T[]; byId: Map<string, T> }>({ list: [], byId: new Map() });
  // A render-time cache: the result depends only on `items`, so reading and writing it here is safe.
  /* eslint-disable react-hooks/refs */
  const prev = cache.current;
  const byId = new Map<string, T>();
  const list: T[] = [];
  let same = items.length === prev.list.length;
  let fresh = true;
  for (const [i, item] of items.entries()) {
    const old = prev.byId.get(item.id);
    const kept = old && equal(old, item) ? old : item;
    byId.set(item.id, kept);
    list.push(kept);
    if (kept !== prev.list[i]) same = false;
    if (kept !== item) fresh = false;
  }
  if (same) return prev.list;
  cache.current = { list: fresh ? items : list, byId };
  /* eslint-enable react-hooks/refs */
  return fresh ? items : list;
}
