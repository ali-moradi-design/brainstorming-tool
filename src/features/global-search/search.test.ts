import { db } from '@/shared/api';
import { createBoard } from '@/features/board-create';
import { addNote } from '@/entities/note';
import { updateIdea } from '@/entities/idea';
import { searchAll } from './search';

beforeEach(async () => {
  await Promise.all([db.boards.clear(), db.ideas.clear(), db.notes.clear()]);
});

describe('searchAll', () => {
  it('finds projects, ideas (text, description, tags) and notes across projects', async () => {
    const a = await createBoard('Trip to Spain');
    const [root] = await db.ideas.where('boardId').equals(a).toArray();
    await updateIdea(root.id, { description: 'Book the flights early', tags: ['travel'] });
    await addNote(a, root.id, 'Check passport expiry date');
    await createBoard('Weekly retro');

    expect((await searchAll('spain')).map((h) => h.kind).sort()).toEqual(['board', 'idea']);
    expect((await searchAll('flights'))[0]).toMatchObject({ kind: 'idea', ideaId: root.id });
    expect((await searchAll('#travel'))[0].kind).toBe('idea');
    expect((await searchAll('passport'))[0]).toMatchObject({ kind: 'note', ideaId: root.id });
    expect(await searchAll('   ')).toEqual([]);
    expect(await searchAll('zzz-not-there')).toEqual([]);
  });
});
