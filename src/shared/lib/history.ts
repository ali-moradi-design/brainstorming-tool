import { create } from 'zustand';
import { restoreBoard, snapshotBoard, type BoardSnapshot } from '@/shared/api';

const LIMIT = 60;

type Stacks = Record<string, BoardSnapshot[]>;

type HistoryState = {
  past: Stacks;
  future: Stacks;
  /** Call right BEFORE a change to a board so it can be undone. */
  record: (boardId: string) => Promise<void>;
  undo: (boardId: string) => Promise<void>;
  redo: (boardId: string) => Promise<void>;
};

export const useHistory = create<HistoryState>((set, get) => ({
  past: {},
  future: {},
  record: async (boardId) => {
    const snap = await snapshotBoard(boardId);
    set((s) => ({
      past: { ...s.past, [boardId]: [...(s.past[boardId] ?? []), snap].slice(-LIMIT) },
      future: { ...s.future, [boardId]: [] },
    }));
  },
  undo: async (boardId) => {
    const stack = get().past[boardId] ?? [];
    const previous = stack[stack.length - 1];
    if (!previous) return;
    const current = await snapshotBoard(boardId);
    await restoreBoard(boardId, previous);
    set((s) => ({
      past: { ...s.past, [boardId]: stack.slice(0, -1) },
      future: { ...s.future, [boardId]: [...(s.future[boardId] ?? []), current] },
    }));
  },
  redo: async (boardId) => {
    const stack = get().future[boardId] ?? [];
    const next = stack[stack.length - 1];
    if (!next) return;
    const current = await snapshotBoard(boardId);
    await restoreBoard(boardId, next);
    set((s) => ({
      past: { ...s.past, [boardId]: [...(s.past[boardId] ?? []), current] },
      future: { ...s.future, [boardId]: stack.slice(0, -1) },
    }));
  },
}));

export const recordChange = (boardId: string): Promise<void> =>
  useHistory.getState().record(boardId);
