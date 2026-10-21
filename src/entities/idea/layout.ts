import type { IdeaRecord } from '@/shared/api';

export const RING_FIRST = 280;
export const RING_STEP = 220;
const GOLDEN_ANGLE = 2.399963;

type Node = Pick<IdeaRecord, 'id' | 'parentId'>;
export type Point = { x: number; y: number };

const childrenByParent = (ideas: Node[]): Map<string | null, string[]> => {
  const ids = new Set(ideas.map((i) => i.id));
  const map = new Map<string | null, string[]>();
  for (const idea of ideas) {
    // Orphans (missing parent) are treated as roots so they never disappear.
    const key = idea.parentId !== null && ids.has(idea.parentId) ? idea.parentId : null;
    map.set(key, [...(map.get(key) ?? []), idea.id]);
  }
  return map;
};

/** Ids of `rootId` and all of its descendants. */
export const collectSubtree = (ideas: Node[], rootId: string): string[] => {
  const children = childrenByParent(ideas);
  const out: string[] = [];
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    if (out.includes(id)) continue;
    out.push(id);
    stack.push(...(children.get(id) ?? []));
  }
  return out;
};

/** Depth-first list with depth, for rendering an outline tree. */
export const buildOutline = <T extends Node>(ideas: T[]): { idea: T; depth: number }[] => {
  const byId = new Map(ideas.map((i) => [i.id, i]));
  const children = childrenByParent(ideas);
  const out: { idea: T; depth: number }[] = [];
  const seen = new Set<string>();
  const walk = (id: string, depth: number) => {
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ idea: byId.get(id)!, depth });
    for (const kid of children.get(id) ?? []) walk(kid, depth + 1);
  };
  for (const rootId of children.get(null) ?? []) walk(rootId, 0);
  return out;
};

const radius = (depth: number) => (depth === 0 ? 0 : RING_FIRST + (depth - 1) * RING_STEP);

/**
 * Radial layout: the root sits in the middle, every branch gets an angular wedge sized by its
 * number of leaves, and each depth level is one ring further out.
 */
export const radialLayout = (ideas: Node[]): Map<string, Point> => {
  const children = childrenByParent(ideas);
  const leaves = new Map<string, number>();
  const countLeaves = (id: string, seen: Set<string>): number => {
    if (seen.has(id)) return 0;
    seen.add(id);
    const kids = children.get(id) ?? [];
    const n = kids.length ? kids.reduce((sum, k) => sum + countLeaves(k, seen), 0) : 1;
    leaves.set(id, Math.max(n, 1));
    return n;
  };

  const positions = new Map<string, Point>();
  const place = (id: string, depth: number, from: number, to: number, origin: Point) => {
    if (positions.has(id)) return;
    const mid = (from + to) / 2;
    positions.set(
      id,
      depth === 0
        ? origin
        : {
            x: origin.x + Math.cos(mid) * radius(depth),
            y: origin.y + Math.sin(mid) * radius(depth),
          },
    );
    const kids = children.get(id) ?? [];
    const total = kids.reduce((sum, k) => sum + (leaves.get(k) ?? 1), 0) || 1;
    let cursor = from;
    for (const kid of kids) {
      const span = ((to - from) * (leaves.get(kid) ?? 1)) / total;
      place(kid, depth + 1, cursor, cursor + span, origin);
      cursor += span;
    }
  };

  (children.get(null) ?? []).forEach((rootId, index) => {
    countLeaves(rootId, new Set());
    // Extra roots (only possible with orphaned data) are placed to the side.
    const start = -Math.PI / 2;
    place(rootId, 0, start, start + Math.PI * 2, { x: index * 2400, y: 0 });
  });
  return positions;
};

/** Default spot for a new child: continues outward from the root through its parent. */
export const childPosition = (ideas: (Node & Point)[], parent: Node & Point): Point => {
  const siblings = ideas.filter((i) => i.parentId === parent.id).length;
  const root = ideas.find((i) => i.parentId === null);
  let angle: number;
  let distance: number;
  if (!root || root.id === parent.id) {
    angle = -Math.PI / 2 + siblings * GOLDEN_ANGLE;
    distance = RING_FIRST;
  } else {
    const base = Math.atan2(parent.y - root.y, parent.x - root.x);
    const side = siblings % 2 === 0 ? 1 : -1;
    angle = base + side * Math.ceil(siblings / 2) * 0.55;
    distance = RING_STEP;
  }
  return {
    x: Math.round(parent.x + Math.cos(angle) * distance),
    y: Math.round(parent.y + Math.sin(angle) * distance),
  };
};
