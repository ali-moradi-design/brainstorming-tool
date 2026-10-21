import { db } from '@/shared/api';

export const deleteBoard = (boardId: string): Promise<void> =>
  db.transaction('rw', db.boards, db.ideas, async () => {
    await db.ideas.where('boardId').equals(boardId).delete();
    await db.boards.delete(boardId);
  });
