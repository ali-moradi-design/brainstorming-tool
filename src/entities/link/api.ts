import { useLiveQuery } from 'dexie-react-hooks';
import { db, type LinkRecord } from '@/shared/api';
import { newId } from '@/shared/lib';

export const useLinks = (boardId: string): LinkRecord[] | undefined =>
  useLiveQuery(() => db.links.where('boardId').equals(boardId).toArray(), [boardId]);

/** Creates a link unless an id is empty, it is a self-link or the same pair is already linked (in any direction). */
export const addLink = async (boardId: string, fromId: string, toId: string): Promise<boolean> => {
  if (!fromId || !toId || fromId === toId) return false;
  const existing = await db.links.where('boardId').equals(boardId).toArray();
  if (
    existing.some(
      (l) => (l.fromId === fromId && l.toId === toId) || (l.fromId === toId && l.toId === fromId),
    )
  )
    return false;
  await db.links.add({ id: newId(), boardId, fromId, toId, createdAt: Date.now() });
  return true;
};

export const removeLink = (id: string): Promise<void> => db.links.delete(id);
