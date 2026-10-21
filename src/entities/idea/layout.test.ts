import { collectSubtree, GAP_X, GAP_Y, tidyLayout } from './layout';

const ideas = [
  { id: 'root', parentId: null },
  { id: 'a', parentId: 'root' },
  { id: 'b', parentId: 'root' },
  { id: 'a1', parentId: 'a' },
  { id: 'a2', parentId: 'a' },
];

describe('tidyLayout', () => {
  it('places depth on the x axis and leaves on consecutive rows', () => {
    const pos = tidyLayout(ideas);
    expect(pos.get('root')?.x).toBe(0);
    expect(pos.get('a')?.x).toBe(GAP_X);
    expect(pos.get('a1')).toEqual({ x: 2 * GAP_X, y: 0 });
    expect(pos.get('a2')).toEqual({ x: 2 * GAP_X, y: GAP_Y });
    expect(pos.get('b')).toEqual({ x: GAP_X, y: 2 * GAP_Y });
  });

  it('centers a parent on its children', () => {
    const pos = tidyLayout(ideas);
    expect(pos.get('a')?.y).toBe(GAP_Y / 2);
    expect(pos.get('root')?.y).toBe((GAP_Y / 2 + 2 * GAP_Y) / 2);
  });

  it('keeps orphans and survives cycles', () => {
    const pos = tidyLayout([
      { id: 'x', parentId: 'missing' },
      { id: 'c1', parentId: 'c2' },
      { id: 'c2', parentId: 'c1' },
    ]);
    expect(pos.has('x')).toBe(true);
  });
});

describe('collectSubtree', () => {
  it('returns the node and all descendants', () => {
    expect(collectSubtree(ideas, 'a').sort()).toEqual(['a', 'a1', 'a2']);
    expect(collectSubtree(ideas, 'b')).toEqual(['b']);
  });
});
