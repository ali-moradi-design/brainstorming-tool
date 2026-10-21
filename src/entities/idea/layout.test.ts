import { buildOutline, childPosition, collectSubtree, radialLayout, RING_FIRST } from './layout';

const ideas = [
  { id: 'root', parentId: null },
  { id: 'a', parentId: 'root' },
  { id: 'b', parentId: 'root' },
  { id: 'a1', parentId: 'a' },
  { id: 'a2', parentId: 'a' },
];

const dist = (p: { x: number; y: number }) => Math.hypot(p.x, p.y);

describe('radialLayout', () => {
  it('puts the root in the center and first-level ideas on the first ring', () => {
    const pos = radialLayout(ideas);
    expect(pos.get('root')).toEqual({ x: 0, y: 0 });
    expect(dist(pos.get('a')!)).toBeCloseTo(RING_FIRST);
    expect(dist(pos.get('b')!)).toBeCloseTo(RING_FIRST);
  });

  it('spreads siblings around the circle and keeps descendants further out', () => {
    const pos = radialLayout(ideas);
    const a = pos.get('a')!;
    const b = pos.get('b')!;
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(100);
    expect(dist(pos.get('a1')!)).toBeGreaterThan(dist(a));
    expect(pos.get('a1')).not.toEqual(pos.get('a2'));
  });

  it('keeps orphans and survives cycles', () => {
    const pos = radialLayout([
      { id: 'x', parentId: 'missing' },
      { id: 'c1', parentId: 'c2' },
      { id: 'c2', parentId: 'c1' },
    ]);
    expect(pos.has('x')).toBe(true);
  });
});

describe('childPosition', () => {
  const nodes = [
    { id: 'root', parentId: null, x: 0, y: 0 },
    { id: 'a', parentId: 'root', x: 280, y: 0 },
  ];

  it('places a child of the root on the first ring', () => {
    expect(dist(childPosition(nodes, nodes[0]))).toBeCloseTo(RING_FIRST, -1);
  });

  it('places a child of another idea further away from the root', () => {
    const p = childPosition(nodes, nodes[1]);
    expect(dist(p)).toBeGreaterThan(280);
  });
});

describe('collectSubtree and buildOutline', () => {
  it('returns the node and all descendants', () => {
    expect(collectSubtree(ideas, 'a').sort()).toEqual(['a', 'a1', 'a2']);
    expect(collectSubtree(ideas, 'b')).toEqual(['b']);
  });

  it('lists ideas depth-first with their depth', () => {
    expect(buildOutline(ideas).map((r) => [r.idea.id, r.depth])).toEqual([
      ['root', 0],
      ['a', 1],
      ['a1', 2],
      ['a2', 2],
      ['b', 1],
    ]);
  });
});
