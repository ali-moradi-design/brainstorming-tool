import { db } from '@/shared/api';
import { addIdea, listIdeas, removeIdeaTree, updateIdea } from '@/entities/idea';
import { addNote, removeNote, updateNote } from './api';

beforeEach(async () => {
  await db.ideas.clear();
  await db.notes.clear();
});

describe('notes', () => {
  it('stores a description on the idea and many separate notes', async () => {
    const idea = await addIdea({ boardId: 'b', parentId: null, text: 'Root' });
    await updateIdea(idea.id, { description: 'About this idea' });
    await addNote('b', idea.id, 'first');
    const second = await addNote('b', idea.id, 'second');
    await updateNote(second.id, 'second (edited)');

    expect((await listIdeas('b'))[0].description).toBe('About this idea');
    expect(
      (await db.notes.where('ideaId').equals(idea.id).toArray()).map((n) => n.text).sort(),
    ).toEqual(['first', 'second (edited)']);

    await removeNote(second.id);
    expect(await db.notes.count()).toBe(1);
  });

  it('removes the notes of deleted ideas', async () => {
    const root = await addIdea({ boardId: 'b', parentId: null, text: 'Root' });
    const child = await addIdea({ boardId: 'b', parentId: root.id, text: 'Child' });
    await addNote('b', child.id, 'note on child');
    await removeIdeaTree('b', child.id);
    expect(await db.notes.count()).toBe(0);
  });
});
