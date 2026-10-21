import type { IdeaRecord } from '@/shared/api';

export const GAP_X = 260;
export const GAP_Y = 84;

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

/** Left-to-right tidy tree: leaves get consecutive rows, parents are centered on their children. */
export const tidyLayout = (ideas: Node[]): Map<string, Point> => {
  const children = childrenByParent(ideas);
  const positions = new Map<string, Point>();
  let row = 0;

  const place = (id: string, depth: number): number => {
    if (positions.has(id)) return positions.get(id)!.y;
    const kids = children.get(id) ?? [];
    let y: number;
    if (kids.length === 0) {
      y = row++ * GAP_Y;
    } else {
      positions.set(id, { x: depth * GAP_X, y: 0 });
      const ys = kids.map((k) => place(k, depth + 1));
      y = (ys[0] + ys[ys.length - 1]) / 2;
    }
    positions.set(id, { x: depth * GAP_X, y });
    return y;
  };

  for (const rootId of children.get(null) ?? []) place(rootId, 0);
  return positions;
};
