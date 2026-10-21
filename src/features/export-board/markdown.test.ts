import { db } from '@/shared/api';
import { createBoard } from '@/features/board-create';
import { addNote } from '@/entities/note';
import { addIdea, updateIdea } from '@/entities/idea';
import { addLink } from '@/entities/link';
import { boardToMarkdown } from './markdown';

beforeEach(async () => {
  await Promise.all([db.boards.clear(), db.ideas.clear(), db.notes.clear(), db.links.clear()]);
});

it('renders an outline with descriptions, tags, notes and related ideas', async () => {
  const boardId = await createBoard('Launch');
  const [root] = await db.ideas.where('boardId').equals(boardId).toArray();
  const a = await addIdea({ boardId, parentId: root.id, text: 'Marketing' });
  const b = await addIdea({ boardId, parentId: root.id, text: 'Design' });
  await updateIdea(a.id, { description: 'Plan the week', tags: ['gtm'] });
  await addNote(boardId, a.id, 'Ask for the video');
  await addLink(boardId, a.id, b.id);

  const md = await boardToMarkdown(boardId);
  expect(md).toContain('# Launch');
  expect(md).toContain('- **Launch**');
  expect(md).toContain('  - **Marketing** #gtm');
  expect(md).toContain('Plan the week');
  expect(md).toContain('_Note:_ Ask for the video');
  expect(md).toContain('_Related:_ Design');
});
