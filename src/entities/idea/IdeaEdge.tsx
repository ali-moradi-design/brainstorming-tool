import { BaseEdge, useInternalNode, type EdgeProps, type InternalNode } from '@xyflow/react';

type Rect = { cx: number; cy: number; w: number; h: number };

const rectOf = (node: InternalNode): Rect => {
  const w = (node.measured.width ?? 0) / 2;
  const h = (node.measured.height ?? 0) / 2;
  const { x, y } = node.internals.positionAbsolute;
  return { cx: x + w, cy: y + h, w, h };
};

/** Point where the line from the center of `from` toward `to` leaves the border of `from`. */
const borderPoint = (from: Rect, to: Rect) => {
  const dx = (to.cx - from.cx) / (2 * from.w || 1);
  const dy = (to.cy - from.cy) / (2 * from.h || 1);
  const scale = 1 / (Math.abs(dx) + Math.abs(dy) || 1);
  // Diamond-to-rect intersection; good enough for pill-shaped nodes.
  return {
    x: from.cx + from.w * (dx * scale + dy * scale),
    y: from.cy + from.h * (-dx * scale + dy * scale),
  };
};

/** Curved edge that attaches to the closest border of both nodes, so radial layouts look natural. */
export function IdeaEdge({ id, source, target, style }: EdgeProps) {
  const a = useInternalNode(source);
  const b = useInternalNode(target);
  if (!a || !b) return null;

  const ra = rectOf(a);
  const rb = rectOf(b);
  const s = borderPoint(ra, rb);
  const t = borderPoint(rb, ra);
  const bend = 0.12;
  const cx = (s.x + t.x) / 2 + (t.y - s.y) * bend;
  const cy = (s.y + t.y) / 2 - (t.x - s.x) * bend;

  return <BaseEdge id={id} path={`M ${s.x},${s.y} Q ${cx},${cy} ${t.x},${t.y}`} style={style} />;
}
