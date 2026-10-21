import { db } from '@/shared/api';
import { createBoard } from './createBoard';

beforeEach(async () => {
  await Promise.all([db.boards.clear(), db.ideas.clear()]);
});

it('builds template branches around the root with distinct positions', async () => {
  const id = await createBoard('Decision', [
    { label: 'Pros', items: ['Cheap'] },
    { label: 'Cons' },
  ]);
  const ideas = await db.ideas.where('boardId').equals(id).toArray();
  expect(ideas.map((i) => i.text).sort()).toEqual(['Cheap', 'Cons', 'Decision', 'Pros']);
  const root = ideas.find((i) => i.parentId === null)!;
  expect(ideas.filter((i) => i.parentId === root.id)).toHaveLength(2);
  expect(new Set(ideas.map((i) => `${i.x},${i.y}`)).size).toBe(4);
});
