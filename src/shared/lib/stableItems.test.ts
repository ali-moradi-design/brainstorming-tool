import { renderHook } from '@testing-library/react';
import { shallowEqual, useStableItems } from './stableItems';

type Item = { id: string; n: number };

it('compares objects one level deep', () => {
  expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);
  expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  expect(shallowEqual({ a: {} }, { a: {} })).toBe(false);
});

it('keeps unchanged items and the array itself across renders', () => {
  const same = (a: Item, b: Item) => a.n === b.n;
  const first = [
    { id: 'a', n: 1 },
    { id: 'b', n: 2 },
  ];
  const { result, rerender } = renderHook(({ items }) => useStableItems(items, same), {
    initialProps: { items: first },
  });
  expect(result.current).toBe(first);

  // Fresh objects with the same values: nothing changes.
  rerender({ items: first.map((i) => ({ ...i })) });
  expect(result.current).toBe(first);

  // Only "b" changed: "a" keeps its old object, "b" is the new one.
  const changed = [
    { id: 'a', n: 1 },
    { id: 'b', n: 3 },
  ];
  rerender({ items: changed });
  expect(result.current).not.toBe(first);
  expect(result.current[0]).toBe(first[0]);
  expect(result.current[1]).toBe(changed[1]);

  // A removed item yields a new, shorter array.
  rerender({ items: [{ id: 'a', n: 1 }] });
  expect(result.current).toEqual([first[0]]);
  expect(result.current[0]).toBe(first[0]);
});
