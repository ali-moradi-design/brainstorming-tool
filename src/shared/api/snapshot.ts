import { db, type IdeaRecord, type LinkRecord, type NoteRecord } from './db';

export type BoardSnapshot = { ideas: IdeaRecord[]; notes: NoteRecord[]; links: LinkRecord[] };

export const snapshotBoard = async (boardId: string): Promise<BoardSnapshot> => ({
  ideas: await db.ideas.where('boardId').equals(boardId).toArray(),
  notes: await db.notes.where('boardId').equals(boardId).toArray(),
  links: await db.links.where('boardId').equals(boardId).toArray(),
});

/** Replaces everything that belongs to a board with a snapshot (used by undo/redo). */
export const restoreBoard = (boardId: string, snap: BoardSnapshot): Promise<void> =>
  db.transaction('rw', db.ideas, db.notes, db.links, async () => {
    await db.ideas.where('boardId').equals(boardId).delete();
    await db.notes.where('boardId').equals(boardId).delete();
    await db.links.where('boardId').equals(boardId).delete();
    await db.ideas.bulkAdd(snap.ideas);
    await db.notes.bulkAdd(snap.notes);
    await db.links.bulkAdd(snap.links);
  });
