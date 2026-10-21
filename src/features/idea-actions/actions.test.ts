import { db } from '@/shared/api';
import { listIdeas } from '@/entities/idea';
import { createBoard } from '@/features/board-create';
import { deleteBoard } from '@/features/board-delete';
import { addChild, addSibling, deleteIdea, tidyBoard } from './actions';

beforeEach(async () => {
  await db.boards.clear();
  await db.ideas.clear();
});

describe('idea actions', () => {
  it('creates a board with a root idea', async () => {
    const boardId = await createBoard('Launch plan');
    const ideas = await listIdeas(boardId);
    expect(ideas).toHaveLength(1);
    expect(ideas[0]).toMatchObject({ text: 'Launch plan', parentId: null });
  });

  it('adds children and siblings, and the root has no sibling', async () => {
    const boardId = await createBoard('Root');
    const [root] = await listIdeas(boardId);
    const child = await addChild(boardId, root.id, 'child');
    const sibling = await addSibling(boardId, child!, 'sibling');
    const rootSibling = await addSibling(boardId, root.id, 'under root');

    const ideas = await listIdeas(boardId);
    expect(ideas.find((i) => i.id === sibling)?.parentId).toBe(root.id);
    expect(ideas.find((i) => i.id === rootSibling)?.parentId).toBe(root.id);
    expect(ideas).toHaveLength(4);
  });

  it('deletes a subtree but never the root', async () => {
    const boardId = await createBoard('Root');
    const [root] = await listIdeas(boardId);
    const a = (await addChild(boardId, root.id, 'a'))!;
    await addChild(boardId, a, 'a1');

    await deleteIdea(boardId, root.id);
    expect(await listIdeas(boardId)).toHaveLength(3);
    await deleteIdea(boardId, a);
    expect(await listIdeas(boardId)).toHaveLength(1);
  });

  it('tidies positions and deleting a board removes its ideas', async () => {
    const boardId = await createBoard('Root');
    const [root] = await listIdeas(boardId);
    await addChild(boardId, root.id, 'a');
    await addChild(boardId, root.id, 'b');
    await tidyBoard(boardId);
    const ideas = await listIdeas(boardId);
    expect(new Set(ideas.map((i) => `${i.x},${i.y}`)).size).toBe(3);

    await deleteBoard(boardId);
    expect(await db.ideas.count()).toBe(0);
    expect(await db.boards.count()).toBe(0);
  });
});
