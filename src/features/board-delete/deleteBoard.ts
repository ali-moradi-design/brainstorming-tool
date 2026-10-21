import { db } from '@/shared/api';

export const deleteBoard = (boardId: string): Promise<void> =>
  db.transaction('rw', db.boards, db.ideas, db.notes, db.links, async () => {
    await db.notes.where('boardId').equals(boardId).delete();
    await db.links.where('boardId').equals(boardId).delete();
    await db.ideas.where('boardId').equals(boardId).delete();
    await db.boards.delete(boardId);
  });
