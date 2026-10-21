import { useLiveQuery } from 'dexie-react-hooks';
import { db, type BoardRecord } from '@/shared/api';

export const useBoards = (): BoardRecord[] | undefined =>
  useLiveQuery(() => db.boards.orderBy('updatedAt').reverse().toArray(), []);

/** `undefined` while loading, `null` when the board does not exist. */
export const useBoard = (id: string): BoardRecord | null | undefined =>
  useLiveQuery(async () => (await db.boards.get(id)) ?? null, [id]);

export const renameBoard = (id: string, title: string): Promise<number> =>
  db.boards.update(id, { title, updatedAt: Date.now() });

export const touchBoard = (id: string): Promise<number> =>
  db.boards.update(id, { updatedAt: Date.now() });
