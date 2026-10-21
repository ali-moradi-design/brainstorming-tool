import { db } from '@/shared/api';
import { newId } from '@/shared/lib';

/** Creates a board together with its root idea (named after the board). */
export const createBoard = async (title: string): Promise<string> => {
  const now = Date.now();
  const boardId = newId();
  await db.transaction('rw', db.boards, db.ideas, async () => {
    await db.boards.add({ id: boardId, title, createdAt: now, updatedAt: now });
    await db.ideas.add({
      id: newId(),
      boardId,
      parentId: null,
      text: title,
      description: '',
      x: 0,
      y: 0,
      color: 3,
      createdAt: now,
    });
  });
  return boardId;
};
