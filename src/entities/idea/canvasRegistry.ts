import type { Node } from '@xyflow/react';

let getNodes: (() => Node[]) | null = null;

/** The canvas registers a reader for its nodes so other slices (export) can measure the map. */
export const registerCanvasNodes = (fn: (() => Node[]) | null): void => {
  getNodes = fn;
};

export const getCanvasNodes = (): Node[] | null => (getNodes ? getNodes() : null);
